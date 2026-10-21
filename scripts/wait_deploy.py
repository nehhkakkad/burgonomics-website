import re
import time
from scrapling.fetchers import Fetcher

deadline = time.time() + 300
while time.time() < deadline:
    try:
        r = Fetcher().get("https://burgonomics.com/")
        html = r.html_content
        m = re.search(r'/assets/(index-[\w-]+\.js)', html)
        bundle = m.group(1) if m else "?"
        main = Fetcher().get(f"https://burgonomics.com{m.group(0)}") if m else None
        t = main.html_content if main else ""
        found = bool(re.search(r'NotFound-\w+\.js', t))
        print(f"{time.strftime('%H:%M:%S')}  bundle={bundle}  hasNotFoundRef={found}")
        if found:
            print("DEPLOYED")
            break
    except Exception as e:
        print("fetch error:", str(e)[:100])
    time.sleep(25)
