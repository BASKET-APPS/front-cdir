from pathlib import Path
import json,concurrent.futures
from urllib.parse import urlparse
exec(Path('scripts/audit.py').read_text().split("h=Path(")[0])
exec('def fetch' + Path('scripts/audit.py').read_text().split('def fetch')[1].split('with concurrent.futures')[0])
r=json.load(open('data/source-audit.json',encoding='utf-8'))
for depth in range(2):
 known={x['url'].rstrip('/') for x in r};extra=set()
 for x in r:
  for u in x.get('links',[]):
   u=u.split('?')[0].split('#')[0].rstrip('/')+'/'
   if u.rstrip('/') not in known and urlparse(u).netloc=='cdir.es' and not any(z in u for z in ['/wp-','/author/','/category/','/portfolio_category/','/feed/']):extra.add(u)
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:r.extend(ex.map(fetch,sorted(extra)))
Path('data/source-audit.json').write_text(json.dumps(r,ensure_ascii=False,indent=2),encoding='utf-8')
print('Total',len(r),'OK',sum(x['ok'] for x in r))
for x in r[41:]:print(x['url'])

