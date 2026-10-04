"""Quality-first frame pipeline for public/frames.

Removes the baked-in Gemini sparkle watermark (bottom-right) from every scroll
frame, then runs an ADAPTIVE acutance pass so that every frame lands on one
common sharpness target (frame-001 level or better), and encodes each frame to
JPEG exactly once.  The source frames are read from a pristine decode
(GIF-extracted, watermark intact) and written straight out — no lossy
round-trips of a previously encoded file.

Why adaptive: the source GIF itself is unevenly sharp (central-region
Laplacian variance ranges from ~86 to ~128, a 1.5x spread).  A single blind
unsharp amount reproduces that spread.  This script instead

  1. measures a robust sharpness statistic per frame over a stable central
     food region,
  2. drives a per-frame edge-aware unsharp amount that closes the gap to a
     single common target,
  3. rejects any amount that would push the halo/overshoot metric past
     HALO_CAP or clip pixels at 0/255 past CLIP_CAP.

The edge-aware term (a Sobel-derived weight) suppresses the added detail
exactly where ringing would show up — on already strong edges — and keeps it
where it buys acutance, in the texture.  That is what lets the soft frames be
lifted ~40% without paying for it in halo.

Usage:
    python scripts/process_frames.py                     # git-pristine -> public/frames
    python scripts/process_frames.py --src DIR --out DIR
    python scripts/process_frames.py --target 190        # pin the acutance target

Key point: pass --src pointing at the pristine decode and --out pointing at
public/frames so every frame is encoded exactly once.
"""

import argparse
import glob
import os
import subprocess
import sys
import tempfile
import time
import zipfile

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DIR = os.path.join(ROOT, "public", "frames")

# The Gemini watermark is a static overlay: two sparkles at a fixed position.
# star1 = x1704-1776, y864-936  |  star2 = x1756-1827, y908-977
RECTS = [(1698, 852, 1782, 944), (1750, 900, 1834, 984)]
THRESHOLD = 62
MIN_AREA = 100
DILATE = 9
INPAINT_RADIUS = 5

# --- adaptive acutance -------------------------------------------------------
JPEG_Q = 95
SHARPEN_SIGMA = 1.0       # unsharp radius in px (same as the old light pass)
EDGE_K = 48.0             # Sobel magnitude where the boost weight halves
HALO_STRONG = 40.0        # |Laplacian| that makes a pristine pixel a strong edge
HALO_CAP = 0.105          # max mean|new-src| / mean|Laplacian(src)| on those px
HALO_CAP_SOBEL = 0.12     # same deviation normalised by pristine edge magnitude
CLIP_CAP = 0.0015         # max fraction of pixels allowed to land on 0 or 255
A_MAX = 2.4               # hard cap on the unsharp amount (no runaway boosts)
CENTRAL = (480, 1440, 270, 810)   # central food region: x0, x1, y0, y1
GRID_SIGMA = 1.0              # px of a block boundary that gets shielded
GRID_DAMP = 0.80              # max fraction of the boost removed on the grid
FEATHER = 8.0             # sigma (px) feather that keeps the inpainted patch alone
PRISTINE_COMMIT = "0131958"
BAND_LO, BAND_HI = 0.90, 1.10     # acceptance band around the common target


def build_mask(src):
    """Star shapes, lifted once from the frame where they read cleanest."""
    g = cv2.imread(os.path.join(src, "ezgif-frame-001.jpg"), cv2.IMREAD_GRAYSCALE)
    if g is None:
        raise RuntimeError("could not read reference frame in " + src)
    sub = np.zeros(g.shape, np.uint8)
    for x0, y0, x1, y1 in RECTS:
        roi = g[y0:y1, x0:x1]
        m = (roi > THRESHOLD).astype(np.uint8)
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
        n, lab, stats, _ = cv2.connectedComponentsWithStats(m, 8)
        for i in range(1, n):
            if stats[i, cv2.CC_STAT_AREA] >= MIN_AREA:
                sub[y0:y1, x0:x1][lab == i] = 1
    mask = cv2.dilate(sub, np.ones((DILATE, DILATE), np.uint8))
    if int((mask > 0).sum()) < 3000:
        # The source is already watermark-free (commit 446e8c8 stripped it):
        # nothing to inpaint, so hand back an empty mask.
        print("source is watermark-free, skipping inpaint", flush=True)
        return np.zeros_like(mask)
    return mask


def acquire_pristine():
    """Extract the watermark-intact frames straight out of git history."""
    tmp = tempfile.mkdtemp(prefix="burgonomics-pristine-")
    zpath = os.path.join(tmp, "frames.zip")
    cmd = ["git", "-C", ROOT, "archive", "--format=zip", "-o", zpath,
           PRISTINE_COMMIT, "public/frames"]
    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except (OSError, subprocess.CalledProcessError) as exc:
        raise RuntimeError(
            "could not extract pristine frames from git commit %s (%s); "
            "pass --src DIR pointing at the watermark-intact decode"
            % (PRISTINE_COMMIT, exc))
    with zipfile.ZipFile(zpath) as zf:
        zf.extractall(tmp)
    os.remove(zpath)
    return os.path.join(tmp, "public", "frames")


def central_lap(gray):
    """Laplacian variance over the stable central food region."""
    x0, x1, y0, y1 = CENTRAL
    return float(cv2.Laplacian(gray[y0:y1, x0:x1], cv2.CV_64F).var())


def prepare(path, mask):
    """Decode a pristine frame and precompute everything the search needs."""
    src = cv2.imread(path)
    if src is None:
        raise RuntimeError("read failed: " + path)
    pg = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    if int((mask > 0).sum()):
        fixed = cv2.inpaint(src, mask, INPAINT_RADIUS, cv2.INPAINT_TELEA)
    else:
        fixed = src.copy()

    lap_p = np.abs(cv2.Laplacian(pg.astype(np.float64), cv2.CV_64F))
    excl = cv2.dilate(mask, np.ones((15, 15), np.uint8)) > 0
    strong = (lap_p > HALO_STRONG) & ~excl
    n_strong = int(strong.sum())
    if n_strong < 5000:
        raise RuntimeError("strong-edge set too small in " + path)

    sx = cv2.Sobel(pg, cv2.CV_32F, 1, 0, ksize=3)
    sy = cv2.Sobel(pg, cv2.CV_32F, 0, 1, ksize=3)
    smag = np.sqrt(sx * sx + sy * sy)

    # Edge-aware weight: full boost on texture, strongly reduced on the strong
    # edges where an unsharp mask would otherwise ring.  The inpainted watermark
    # patch is feathered out so the (synthetic) inpaint result is left alone.
    w = 1.0 / (1.0 + (smag / EDGE_K) ** 2)
    if FEATHER > 0:
        cover = cv2.GaussianBlur((mask > 0).astype(np.float32), (0, 0), FEATHER)
        w *= (1.0 - np.minimum(cover, 1.0))
    w = w.astype(np.float32)

    # Shield the JPEG 8px block grid: an unsharp mask applied at a block
    # boundary doubles the step there, and the 1080p -> 1440p upscale then
    # smears those steps into the visible "square pixels" on the burger.
    yy, xx = np.indices(pg.shape)

    def near_grid(a):
        d = np.minimum(a % 8.0, 8.0 - (a % 8.0))
        return 1.0 - GRID_DAMP * np.exp(-(d * d) / (2.0 * GRID_SIGMA ** 2))

    w = (w * (near_grid(xx) * near_grid(yy))).astype(np.float32)

    base = fixed.astype(np.float32)
    blur = cv2.GaussianBlur(fixed, (0, 0), SHARPEN_SIGMA).astype(np.float32)
    dw = (base - blur) * w[:, :, None]

    return {
        "path": path,
        "pg": pg,
        "strong": strong,
        "psrc": pg[strong].astype(np.float32),
        "edge_lap": float(lap_p[strong].mean()),
        "edge_sob": float(smag[strong].mean()),
        "base": base,
        "dw": dw,
    }


def render(plan, amount):
    """Apply the unsharp amount, encode once, and score the DECODED result."""
    out = plan["base"] + amount * plan["dw"]
    np.clip(out, 0.0, 255.0, out)
    out = np.ascontiguousarray(out, dtype=np.uint8)
    ok, buf = cv2.imencode(".jpg", out, [cv2.IMWRITE_JPEG_QUALITY, JPEG_Q])
    if not ok:
        raise RuntimeError("encode failed: " + plan["path"])
    dec = cv2.imdecode(buf, cv2.IMREAD_COLOR)
    if dec is None:
        raise RuntimeError("decode failed: " + plan["path"])
    g = cv2.cvtColor(dec, cv2.COLOR_BGR2GRAY)
    idx = plan["strong"]
    halo = float(np.abs(g[idx].astype(np.float32) - plan["psrc"]).mean())
    return {
        "lap": central_lap(g),
        "halo": halo / plan["edge_lap"],
        "halo_sob": halo / plan["edge_sob"],
        "clip": float(np.mean((g <= 0) | (g >= 255))),
        "buf": buf,
    }


def feasible(m):
    return (m["halo"] <= HALO_CAP and m["halo_sob"] <= HALO_CAP_SOBEL
            and m["clip"] <= CLIP_CAP)


def bisect(plan, lo, hi, iterations, accept):
    """Bisect `amount` over [lo, hi]; `accept(m)` decides which side to keep."""
    best, best_m = lo, None
    for _ in range(iterations):
        mid = 0.5 * (lo + hi)
        m = render(plan, mid)
        if accept(m):
            best, best_m, lo = mid, m, mid
        else:
            hi = mid
    if best_m is None:
        best_m = render(plan, best)
    return best, best_m


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=None,
                    help="pristine input directory (default: git %s)" % PRISTINE_COMMIT)
    ap.add_argument("--out", default=DEFAULT_DIR, help="output directory")
    ap.add_argument("--target", type=float, default=None,
                    help="pin the common acutance target instead of deriving it")
    ap.add_argument("--search-iters", type=int, default=6)
    ap.add_argument("frames", nargs="*", help="optional subset of file names")
    args = ap.parse_args()

    only = set(args.frames)
    src = args.src or acquire_pristine()
    os.makedirs(args.out, exist_ok=True)
    mask = build_mask(src)
    print("watermark mask px: %d" % int((mask > 0).sum()), flush=True)
    print("src=%s  out=%s  q=%d" % (src, args.out, JPEG_Q), flush=True)
    print("unsharp: edge-aware sigma=%.1f EDGE_K=%.0f  guards: halo<=%.3f "
          "(sobel<=%.3f) clip<=%.4f a<=%.1f"
          % (SHARPEN_SIGMA, EDGE_K, HALO_CAP, HALO_CAP_SOBEL, CLIP_CAP, A_MAX),
          flush=True)

    files = sorted(glob.glob(os.path.join(src, "*.jpg")))
    if only:
        files = [f for f in files if os.path.basename(f) in only]
    if not files:
        raise RuntimeError("no frames matched")
    if len(files) != 197:
        print("WARNING: expected 197 frames, found %d" % len(files), flush=True)

    # ---- pass 1: how much acutance can each frame take before it rings? -----
    t0 = time.time()
    caps = []
    for i, f in enumerate(files, 1):
        plan = prepare(f, mask)
        m_a = render(plan, A_MAX)
        if feasible(m_a):
            a_hi, m_hi = A_MAX, m_a
        else:
            a_hi, m_hi = bisect(plan, 0.0, A_MAX, args.search_iters, feasible)
        caps.append((f, a_hi, m_hi["lap"], m_hi["halo"], m_hi["halo_sob"],
                     m_hi["clip"]))
        if i % 40 == 0 or i == len(files):
            print("  cap %d/%d  %.0fs" % (i, len(files), time.time() - t0),
                  flush=True)

    target = args.target if args.target is not None else min(c[2] for c in caps)
    softest = min(caps, key=lambda c: c[2])
    print("acutance target T = %.2f  (set by %s at a=%.3f, halo=%.4f)"
          % (target, os.path.basename(softest[0]), softest[1], softest[3]),
          flush=True)
    if target < BAND_LO * 170.0:
        print("WARNING: target %.1f is below the currently shipped frame-001 "
              "level (~170)" % target, flush=True)

    # ---- pass 2: hit T on every frame, encode once, write ------------------
    t0 = time.time()
    before = after = 0
    amounts, halos, halos_sob, clips, laps = [], [], [], [], []
    for i, (f, a_hi, cap_lap, _, _, _) in enumerate(caps, 1):
        plan = prepare(f, mask)
        if target >= cap_lap:
            a, m = a_hi, render(plan, a_hi)
        else:
            a, m = bisect(plan, 0.0, a_hi, args.search_iters + 1,
                          lambda mm: mm["lap"] < target)
        name = os.path.basename(f)
        dst = os.path.join(args.out, name)
        with open(dst, "wb") as fh:
            fh.write(m["buf"].tobytes())
        before += os.path.getsize(f)
        after += os.path.getsize(dst)
        amounts.append(a)
        halos.append(m["halo"])
        halos_sob.append(m["halo_sob"])
        clips.append(m["clip"])
        laps.append(m["lap"])
        if i % 40 == 0 or i == len(files):
            print("  write %d/%d  %.0fs  %.1f MB -> %.1f MB"
                  % (i, len(files), time.time() - t0, before / 1e6, after / 1e6),
                  flush=True)

    a = np.array(amounts)
    lap = np.array(laps)
    h = np.array(halos)
    hs = np.array(halos_sob)
    ck = np.array(clips)
    print("", flush=True)
    print("acutance (central Laplacian var, decoded)  min=%.2f mean=%.2f "
          "max=%.2f  f001=%.2f" % (lap.min(), lap.mean(), lap.max(), lap[0]),
          flush=True)
    print("within +-%.0f%% of f001: %d/%d"
          % (100 * (1 - BAND_LO), int(((lap >= BAND_LO * lap[0])
                                       & (lap <= BAND_HI * lap[0])).sum()),
             len(lap)), flush=True)
    print("amount                min=%.3f mean=%.3f max=%.3f"
          % (a.min(), a.mean(), a.max()), flush=True)
    print("halo (lap denom)      min=%.4f mean=%.4f max=%.4f  cap=%.3f"
          % (h.min(), h.mean(), h.max(), HALO_CAP), flush=True)
    print("halo (edge denom)     min=%.4f mean=%.4f max=%.4f  cap=%.3f"
          % (hs.min(), hs.mean(), hs.max(), HALO_CAP_SOBEL), flush=True)
    print("clip fraction          min=%.6f mean=%.6f max=%.6f  cap=%.4f"
          % (ck.min(), ck.mean(), ck.max(), CLIP_CAP), flush=True)
    print("done: %d frames in %.1fs, %.3f MB"
          % (len(files), time.time() - t0, after / 1e6), flush=True)


if __name__ == "__main__":
    sys.exit(main())
