"""Encode the 1440p scroll video from the reference frames.

Usage:
    python scripts/upscale_1440p.py     # builds %TEMP%\\burgonomics-1440p-refs
    python scripts/encode_abr.py [bitrate]   # default 19500k (~19.8 MB / 8.208 s)

The shipping recipe is 2-pass ABR, GOP 4, preset veryslow with ip_ratio /
pb_ratio tightened so I-frames cannot pull away from P-frames (CRF ignores
those knobs — verified: crf20 and crf20+ip_ratio produce identical output).
"""
import os
import re
import subprocess
import sys
import tempfile

import numpy as np

FF = (r"C:\Users\DELL\AppData\Local\Microsoft\WinGet\Packages"
      r"\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe"
      r"\ffmpeg-9.0-full_build\bin\ffmpeg.exe")
REFS = os.path.join(tempfile.gettempdir(), "burgonomics-1440p-refs")
PAT = os.path.join(REFS, "ezgif-frame-%03d.jpg")
BITRATE = sys.argv[1] if len(sys.argv) > 1 else "19500k"
OUT = os.path.join(tempfile.gettempdir(), "burgonomics-encode.mp4")
NAME = "burger-scroll"
EXTRA = ["-g", "4", "-x264-params", "aq-mode=3:ip_ratio=1.05:pb_ratio=1.7"]


def run(cmd, cwd=None):
    p = subprocess.run(cmd, capture_output=True, text=True, errors="replace", cwd=cwd)
    if p.returncode != 0:
        raise RuntimeError("ffmpeg failed:\n%s" % p.stderr[-1500:])
    return p


def measure(mp4):
    log = os.path.join(tempfile.gettempdir(), "psnr.log")
    if os.path.exists(log):
        os.remove(log)
    run([FF, "-y", "-v", "error", "-framerate", "24", "-start_number", "1",
         "-i", PAT, "-i", mp4,
         "-lavfi", "[0:v][1:v]psnr=stats_file=%s" % log, "-f", "null", "-"])
    vals = []
    for line in open(log, encoding="utf-8"):
        m = re.search(r"psnr_avg:([0-9.a-z]+)", line)
        if m:
            try:
                vals.append(float(m.group(1)))
            except ValueError:
                vals.append(99.0)
    return np.array(vals)


def main():
    if not os.path.isdir(REFS):
        sys.exit("missing refs — run scripts/upscale_1440p.py first")
    for passno in (1, 2):
        cmd = [FF, "-y", "-v", "error", "-framerate", "24", "-start_number", "1",
               "-i", PAT, "-c:v", "libx264", "-preset", "veryslow",
               "-b:v", BITRATE, "-passlogfile", NAME, "-pass", str(passno),
               "-an"] + EXTRA
        if passno == 1:
            cmd += ["-f", "null", "-"]
        else:
            cmd += ["-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT]
        run(cmd, cwd=tempfile.gettempdir())
    v = measure(OUT)
    iidx = list(range(0, len(v), 4))
    pidx = [i for i in range(len(v)) if i % 4]
    size = os.path.getsize(OUT)
    print("bitrate=%s  size=%.2f MB" % (BITRATE, size / 1e6))
    print("psnr  min %.2f  mean %.2f  max %.2f  frame1 %.2f  I-P gap %.2f dB"
          % (v.min(), v.mean(), v.max(), v[0], v[iidx].mean() - v[pidx].mean()))
    print("out: %s" % OUT)


if __name__ == "__main__":
    sys.exit(main())
