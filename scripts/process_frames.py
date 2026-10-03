"""Quality-first frame pipeline for public/frames.

Removes the baked-in Gemini sparkle watermark (bottom-right) from every scroll
frame, then does ONE light acutance pass and a single JPEG encode. The source
frames are read from a pristine input directory (GIF-extracted, watermark
intact, no smoothing) and written once — no lossy round-trips.

Usage:
    python scripts/process_frames.py                     # public/frames -> public/frames
    python scripts/process_frames.py --src DIR --out DIR
    python scripts/process_frames.py ezgif-frame-001.jpg # subset by name

Key point: pass --src pointing at the pristine decode and --out pointing at
public/frames so every frame is encoded exactly once.
"""

import argparse
import glob
import os
import sys
import time

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

# Quality-first acutance: the old pipeline ran 2x bilateral(9,30,9) smoothing
# before sharpening, which is what destroyed detail. There is deliberately NO
# denoise here — only a light unsharp mask so the output keeps (at least) the
# source's high-frequency energy after the single JPEG encode.
SHARPEN_SIGMA = 1.0
SHARPEN_AMOUNT = 0.40
JPEG_Q = 95


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
        raise RuntimeError("watermark mask came out too small")
    return mask


def enhance(im):
    """Light unsharp mask only — no smoothing, detail is the point."""
    blur = cv2.GaussianBlur(im, (0, 0), SHARPEN_SIGMA)
    return cv2.addWeighted(im, 1 + SHARPEN_AMOUNT, blur, -SHARPEN_AMOUNT, 0)


def process(path, mask, outdir):
    im = cv2.imread(path)
    if im is None:
        raise RuntimeError("read failed: " + path)
    fixed = cv2.inpaint(im, mask, INPAINT_RADIUS, cv2.INPAINT_TELEA)
    out = enhance(fixed)
    name = os.path.basename(path)
    dst = os.path.join(outdir, name)
    ok, buf = cv2.imencode(".jpg", out, [cv2.IMWRITE_JPEG_QUALITY, JPEG_Q])
    if not ok:
        raise RuntimeError("encode failed: " + name)
    with open(dst, "wb") as fh:
        fh.write(buf.tobytes())
    return os.path.getsize(path), os.path.getsize(dst)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=DEFAULT_DIR, help="pristine input directory")
    ap.add_argument("--out", default=DEFAULT_DIR, help="output directory")
    ap.add_argument("frames", nargs="*", help="optional subset of file names")
    args = ap.parse_args()

    only = set(args.frames)
    os.makedirs(args.out, exist_ok=True)
    mask = build_mask(args.src)
    print("watermark mask px: %d" % int((mask > 0).sum()), flush=True)
    print("src=%s  out=%s  q=%d  unsharp(sigma=%.1f, amount=%.2f)" % (
        args.src, args.out, JPEG_Q, SHARPEN_SIGMA, SHARPEN_AMOUNT
    ), flush=True)

    files = sorted(glob.glob(os.path.join(args.src, "*.jpg")))
    if only:
        files = [f for f in files if os.path.basename(f) in only]
    if not files:
        raise RuntimeError("no frames matched")
    if len(files) != 197:
        print("WARNING: expected 197 frames, found %d" % len(files), flush=True)

    t0 = time.time()
    before = after = 0
    for i, f in enumerate(files, 1):
        b, a = process(f, mask, args.out)
        before += b
        after += a
        if i % 25 == 0 or i == len(files):
            print("%d/%d  %.1fs  %.1f MB -> %.1f MB" % (
                i, len(files), time.time() - t0, before / 1e6, after / 1e6
            ), flush=True)
    print("done: %d frames in %.1fs" % (len(files), time.time() - t0), flush=True)


if __name__ == "__main__":
    sys.exit(main())
