"""Build the 2560x1440 reference frames for the home-scroll video.

Reads the sharpened 1920x1080 frames in public/frames, upscales 4:3 with
Lanczos, then runs a light per-frame acutance correction so the 1440p result
carries at least the same per-pixel acutance as the 1080p source (a plain
Lanczos upscale loses it).  Each frame is JPEG-encoded exactly once at q95 and
left in a temp directory as the encode reference.
"""

import glob
import os
import shutil
import tempfile
import time

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRAMES = os.path.join(ROOT, "public", "frames")
DST = os.path.join(tempfile.gettempdir(), "burgonomics-1440p-refs")

W, H = 2560, 1440
SIGMA = 1.2            # unsharp radius at 1440p scale
A_PROBE = 0.8          # amount used to sense the lap/amount slope
A_MAX = 1.4            # hard cap on the added unsharp amount
JPEG_Q = 95
CLIP_CAP = 0.0015
BAND = 0.90            # accept if lap >= BAND * target


def central_lap(gray):
    """Laplacian variance over the central food region, scaled to 1440p."""
    x0, x1, y0, y1 = int(480 * 4 / 3), int(1440 * 4 / 3), int(270 * 4 / 3), int(810 * 4 / 3)
    return float(cv2.Laplacian(gray[y0:y1, x0:x1], cv2.CV_64F).var())


def main():
    files = sorted(glob.glob(os.path.join(FRAMES, "*.jpg")))
    if len(files) != 197:
        raise SystemExit("expected 197 frames, found %d" % len(files))

    # acutance target = the 1080p source level, measured in the same window
    g0 = cv2.imread(files[0], cv2.IMREAD_GRAYSCALE)
    up0 = cv2.resize(g0, (W, H), interpolation=cv2.INTER_LANCZOS4)
    target = central_lap(up0) / BAND
    print("1440p target lap >= %.1f (plain-upscale f001 = %.1f)"
          % (target, central_lap(up0)), flush=True)

    if os.path.isdir(DST):
        shutil.rmtree(DST)
    os.makedirs(DST)

    t0 = time.time()
    amounts, laps, clips = [], [], []
    for i, f in enumerate(files, 1):
        src = cv2.imread(f, cv2.IMREAD_COLOR)
        up = cv2.resize(src, (W, H), interpolation=cv2.INTER_LANCZOS4)
        base = up.astype(np.float32)
        blur = cv2.GaussianBlur(up, (0, 0), SIGMA).astype(np.float32)
        detail = base - blur

        def render(amount):
            out = np.clip(base + amount * detail, 0.0, 255.0)
            return np.ascontiguousarray(out.astype(np.uint8))

        a0 = 0.0
        lap0 = central_lap(cv2.cvtColor(render(a0), cv2.COLOR_BGR2GRAY))
        lap1 = central_lap(cv2.cvtColor(render(A_PROBE), cv2.COLOR_BGR2GRAY))
        if lap1 <= lap0:
            amount = 0.0
        else:
            amount = A_PROBE * (target - lap0) / (lap1 - lap0)
            amount = float(np.clip(amount, 0.0, A_MAX))

        out = render(amount)
        g = cv2.cvtColor(out, cv2.COLOR_BGR2GRAY)
        lap = central_lap(g)
        if lap < BAND * target and amount < A_MAX:
            amount = min(A_MAX, amount * 1.25)
            out = render(amount)
            g = cv2.cvtColor(out, cv2.COLOR_BGR2GRAY)
            lap = central_lap(g)

        clip = float(np.mean((g <= 0) | (g >= 255)))
        if clip > CLIP_CAP:
            raise SystemExit("frame %03d clips at %.5f > %.4f" % (i, clip, CLIP_CAP))

        name = "ezgif-frame-%03d.jpg" % i
        cv2.imwrite(os.path.join(DST, name), out,
                    [cv2.IMWRITE_JPEG_QUALITY, JPEG_Q])
        amounts.append(amount)
        laps.append(lap)
        clips.append(clip)
        if i % 40 == 0 or i == len(files):
            print("  %d/%d  %.0fs" % (i, len(files), time.time() - t0), flush=True)

    a = np.array(amounts)
    lap = np.array(laps)
    ck = np.array(clips)
    print("", flush=True)
    print("1440p acutance   min=%.1f mean=%.1f max=%.1f  (target %.1f)"
          % (lap.min(), lap.mean(), lap.max(), target), flush=True)
    print("at/above 90%% of target: %d/%d" % (int((lap >= BAND * target).sum()), len(lap)),
          flush=True)
    print("amount           min=%.3f mean=%.3f max=%.3f" % (a.min(), a.mean(), a.max()),
          flush=True)
    print("clip             max=%.6f" % ck.max(), flush=True)
    total = sum(os.path.getsize(os.path.join(DST, "ezgif-frame-%03d.jpg" % i))
                for i in range(1, 198))
    print("refs dir: %s  (%.1f MB)" % (DST, total / 1e6), flush=True)


if __name__ == "__main__":
    main()
