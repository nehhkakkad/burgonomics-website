import re
from scrapling.fetchers import Fetcher

p = Fetcher().get("https://burgonomics.com/no-such-page-404")
print("HTTP status for unknown URL:", p.status)
