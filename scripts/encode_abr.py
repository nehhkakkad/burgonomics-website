import os, re, shutil, subprocess, sys, tempfile, time
import numpy as np

FF = (r"C:\Users\DELL\AppData\Local\Microsoft\WinGet\Packages"
      r"\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe"
      r"\ffmpeg-9.0-full_build\bin\ffmpeg.exe")
REFS = os.path.join(tempfile.gettempdir(), "burgonomics-1440p-refs")
PAT = os.path.join(REFS, "ezgif-frame-%03d.jpg")
W = os.path.join(tempfile.gettempdir(), "burgonomics-abr")
BR = "13600k"          # ~14.0 MB over 8.208 s
BUDGET = 14 * 1000 * 1000

CANDS = [
    ("abr-g4-eq", ["-g", "4",
                   "-x264-params", "aq-mode=3:ip_ratio=1.05:pb_ratio=1.7"]),
    ("abr-g1", ["-g", "1", "-x264-params", "aq-mode=3"]),
]


def run(cmd, cwd=None):
    p = subprocess.run(cmd, capture_output=True, text=True, errors="replace", cwd=cwd)
    if p.returncode != 0:
        raise RuntimeError("fail %s\n%s" % (" ".join(cmd[-4:]), p.stderr[-1500:]))
    return p


def psnr(mp4, tag):
    log = "p_%s.log" % tag
    jp = os.path.join(W, log)
    if os.path.exists(jp):
        os.remove(jp)
    run([FF, "-y", "-v", "error", "-framerate", "24", "-start_number", "1",
         "-i", PAT, "-i", mp4, "-lavfi", "[0:v][1:v]psnr=stats_file=" + log,
         "-f", "null", "-"], cwd=W)
    out = []
    for line in open(jp, encoding="utf-8"):
        m = re.search(r"psnr_avg:([0-9.a-z]+)", line)
        if m:
            try:
                out.append(float(m.group(1)))
            except ValueError:
                out.append(99.0)
    return np.array(out)


def main():
    if os.path.isdir(W):
        shutil.rmtree(W)
    os.makedirs(W)
    results = []
    for name, extra in CANDS:
        out = os.path.join(W, name + ".mp4")
        t0 = time.time()
        for passno in (1, 2):
            cmd = [FF, "-y", "-v", "error", "-framerate", "24", "-start_number", "1",
                   "-i", PAT, "-c:v", "libx264", "-preset", "veryslow",
                   "-b:v", BR, "-passlogfile", name,
                   "-pass", str(passno), "-an"]
            if passno == 2:
                cmd += ["-pix_fmt", "yuv420p", "-movflags", "+faststart"] + extra + [out]
            else:
                cmd += extra + ["-f", "null", "-"]
            run(cmd, cwd=W)
        size = os.path.getsize(out)
        v = psnr(out, name)
        iidx = list(range(0, len(v), 4))
        pidx = [i for i in range(len(v)) if i % 4]
        gap = (v[iidx].mean() - v[pidx].mean()) if len(iidx) and len(pidx) else 0.0
        print("%-12s %6.2f MB  min %6.2f  mean %6.2f  max %6.2f  spread %5.2f  "
              "I-P gap %.2f dB  %.0fs  %s"
              % (name, size / 1e6, v.min(), v.mean(), v.max(), v.max() - v.min(),
                 gap, time.time() - t0,
                 "ok" if size <= BUDGET else "OVER"), flush=True)
        results.append((name, size, v, gap))
    best = min(results, key=lambda r: (abs(r[1] - BUDGET),))
    print("\nclosest to budget: %s" % best[0], flush=True)
    for n, s, v, gap in results:
        print("  %-12s frame1=%.2f  worst=%.2f  gap=%.2f" % (n, v[0], v.min(), gap))


if __name__ == "__main__":
    sys.exit(main())
