"""Try encode candidates for the 1440p home-scroll video and score uniformity.

For each candidate we encode, then measure per-frame PSNR against the 1440p
reference frames.  The point is not the average — it is the SPREAD, because a
large I-frame/P-frame gap is exactly what makes frame 1 look better than the
rest of the animation.
"""

import hashlib
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time

FFMPEG = (r"C:\Users\DELL\AppData\Local\Microsoft\WinGet\Packages"
          r"\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe"
          r"\ffmpeg-9.0-full_build\bin\ffmpeg.exe")
FFPROBE = os.path.join(os.path.dirname(FFMPEG), "ffprobe.exe")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REFS = os.path.join(tempfile.gettempdir(), "burgonomics-1440p-refs")
WORK = os.path.join(tempfile.gettempdir(), "burgonomics-encode-trials")
PATTERN = os.path.join(REFS, "ezgif-frame-%03d.jpg")

BUDGET = 14 * 1000 * 1000
SPREAD_MAX = 1.5
MIN_PSNR = 44.0

CANDIDATES = [
    ("g4-crf18", ["-g", "4", "-crf", "18", "-x264-params", "aq-mode=3"]),
    ("g4-crf20", ["-g", "4", "-crf", "20", "-x264-params", "aq-mode=3"]),
    ("g1-crf22", ["-g", "1", "-crf", "22", "-x264-params", "aq-mode=3"]),
    ("g1-crf24", ["-g", "1", "-crf", "24", "-x264-params", "aq-mode=3"]),
]


def run(cmd, cwd=None):
    p = subprocess.run(cmd, capture_output=True, text=True, errors="replace", cwd=cwd)
    if p.returncode != 0:
        raise RuntimeError("command failed: %s\n%s" % (" ".join(cmd[-6:]), p.stderr[-2000:]))
    return p


def probe(path):
    p = run([FFPROBE, "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height,nb_frames,r_frame_rate,codec_name",
             "-show_entries", "format=duration,size",
             "-of", "default=noprint_wrappers=1", path])
    out = {}
    for line in p.stdout.splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            out[k] = v
    return out


def psnr_spread(video, tmp):
    """Per-frame PSNR of `video` against the reference frames."""
    # the filtergraph parser treats ':' as an option separator, so the
    # stats_file path must be relative to a working directory
    stats = os.path.join(tmp, "psnr.log")
    if os.path.exists(stats):
        os.remove(stats)
    run([FFMPEG, "-y", "-v", "error",
         "-framerate", "24", "-start_number", "1", "-i", PATTERN,
         "-i", video,
         "-lavfi", "[0:v][1:v]psnr=stats_file=psnr.log",
         "-f", "null", "-"], cwd=tmp)
    vals = []
    with open(stats, "r", encoding="utf-8") as fh:
        for line in fh:
            m = re.search(r"psnr_avg:([0-9.a-z]+)", line)
            if not m:
                continue
            try:
                vals.append(float(m.group(1)))
            except ValueError:
                vals.append(99.0)
    return vals


def main():
    if not os.path.isdir(REFS):
        raise SystemExit("missing refs dir: run scripts/upscale_1440p.py first")
    # keep previously encoded candidates so a re-run only scores them
    if not os.path.isdir(WORK):
        os.makedirs(WORK)

    results = []
    for name, extra in CANDIDATES:
        out = os.path.join(WORK, name + ".mp4")
        t0 = time.time()
        if os.path.exists(out) and os.path.getsize(out) > 0:
            print("%-10s reusing existing encode" % name, flush=True)
        else:
            run([FFMPEG, "-y", "-v", "error",
                 "-framerate", "24", "-start_number", "1", "-i", PATTERN,
                 "-c:v", "libx264", "-preset", "slower", "-pix_fmt", "yuv420p",
                 "-movflags", "+faststart"] + extra + [out])
        enc = time.time() - t0
        size = os.path.getsize(out)
        vals = psnr_spread(out, WORK)
        info = probe(out)
        lo, hi = min(vals), max(vals)
        spread = hi - lo
        ok = (spread <= SPREAD_MAX and lo >= MIN_PSNR and size <= BUDGET)
        results.append((name, size, lo, hi, spread, len(vals), ok, info, out, enc))
        print("%-10s %7.2f MB  min %6.2f  max %6.2f  spread %.2f dB  frames %d  "
              "enc %.0fs  -> %s"
              % (name, size / 1e6, lo, hi, spread, len(vals), enc,
                 "PASS" if ok else "fail"),
              flush=True)

    print("", flush=True)
    passing = [r for r in results if r[6]]
    if not passing:
        print("NO candidate met spread<=%.1f dB, min>=%.0f dB, size<=%.0f MB"
              % (SPREAD_MAX, MIN_PSNR, BUDGET / 1e6), flush=True)
        print("(best spread: %.2f dB)" % min(r[4] for r in results), flush=True)
        return 1
    best = max(passing, key=lambda r: r[2])   # highest worst-case PSNR
    print("BEST: %s  (%.2f MB, min %.2f dB, spread %.2f dB)"
          % (best[0], best[1] / 1e6, best[2], best[4]), flush=True)
    sha = hashlib.sha256(open(best[8], "rb").read()).hexdigest()
    print("sha256=%s  -> burger-scroll-%s.mp4" % (sha, sha[:8]), flush=True)
    print("work dir: %s" % WORK, flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
