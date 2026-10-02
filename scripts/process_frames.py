"""One-off asset fix for public/frames.

Removes the baked-in Gemini sparkle watermark (bottom-right) from every scroll
frame and re-processes them to undo GIF-extraction compression artifacts.

Usage:  python scripts/process_frames.py            # all frames
        python scripts/process_frames.py ezgif-frame-001.jpg ...
"""

import glob
import os
import sys
import time

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "frames")
OUT = os.path.join(os.environ.get("TEMP", "."), "frames_out")

# The Gemini watermark is a static overlay: two sparkles at a fixed position.
# star1 = x1704-1776, y864-936  |  star2 = x1756-1827, y908-977
RECTS = [(1698, 852, 1782, 944), (1750, 900, 1834, 984)]
THRESHOLD = 62
MIN_AREA = 100
DILATE = 9
INPAINT_RADIUS = 5

DENOISE_D = 9
DENOISE_SIGMA_COLOR = 30
DENOISE_SIGMA_SPACE = 9
DENOISE_PASSES = 2
SHARPEN_SIGMA = 1.0
SHARPEN_AMOUNT = 0.7
JPEG_Q = 85


def build_mask(src):
    """Star shapes, lifted once from the frame where they read cleanest."""
    g = cv2.imread(os.path.join(src, "ezgif-frame-001.jpg"), cv2.IMREAD_GRAYSCALE)
    if g is None:
        raise RuntimeError("could not read reference frame")
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
    den = im
    for _ in range(DENOISE_PASSES):
        den = cv2.bilateralFilter(
            den, DENOISE_D, DENOISE_SIGMA_COLOR, DENOISE_SIGMA_SPACE
        )
    blur = cv2.GaussianBlur(den, (0, 0), SHARPEN_SIGMA)
    return cv2.addWeighted(den, 1 + SHARPEN_AMOUNT, blur, -SHARPEN_AMOUNT, 0)


def process(path, mask, outdir):
    im = cv2.imread(path)
    if im is None:
        raise RuntimeError("read failed: " + path)
    fixed = cv2.inpaint(im, mask, INPAINT_RADIUS, cv2.INPAINT_TELEA)
    out = enhance(fixed)
    name = os.path.basename(path)
    dst = os.path.join(outdir, name)
    cv2.imwrite(dst, out, [cv2.IMWRITE_JPEG_QUALITY, JPEG_Q])
    return os.path.getsize(path), os.path.getsize(dst)


def main():
    only = set(sys.argv[1:])
    os.makedirs(OUT, exist_ok=True)
    mask = build_mask(SRC)
    print("watermark mask px: %d" % int((mask > 0).sum()), flush=True)

    files = sorted(glob.glob(os.path.join(SRC, "*.jpg")))
    if only:
        files = [f for f in files if os.path.basename(f) in only]
    if not files:
        raise RuntimeError("no frames matched")

    t0 = time.time()
    before = after = 0
    for i, f in enumerate(files, 1):
        b, a = process(f, mask, OUT)
        before += b
        after += a
        if i % 10 == 0 or i == len(files):
            print("%d/%d  %.1fs  %.1f MB -> %.1f MB" % (
                i, len(files), time.time() - t0, before / 1e6, after / 1e6
            ), flush=True)


if __name__ == "__main__":
    main()
