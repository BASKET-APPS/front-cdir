from pathlib import Path
from html.parser import HTMLParser
import urllib.request,concurrent.futures,json,re
from urllib.parse import urlparse
class Parse(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.images=[];self.text=[];self.skip=0
 def handle_starttag(self,t,a):
  a=dict(a)
  if t in ['style','script']: self.skip+=1
  if t=='a' and a.get('href','').startswith('https://cdir.es/'):self.links.append(a['href'])
  if t=='img':self.images.append({'url':a.get('data-src') or a.get('src',''),'alt':a.get('alt','')})
 def handle_endtag(self,t):
  if t in ['style','script'] and self.skip:self.skip-=1
 def handle_data(self,d):
  if not self.skip and d.strip():self.text.append(d.strip())
h=Path(r'C:/Users/juank/.codex/attachments/dd2fac59-7082-43d3-9b26-5e85232fd3eb/Texto pegado.txt').read_text(encoding='utf-8-sig');p=Parse();p.feed(h)
urls=sorted(set(u.split('?')[0] for u in p.links if not any(x in u for x in ['/wp-content/','/author/','/wp-json/'])))
urls+=['https://cdir.es/eventos/','https://cdir.es/politica-de-privacidad/','https://cdir.es/aviso-legal/','https://cdir.es/politica-de-cookies/']
def fetch(u):
 try:
  html=urllib.request.urlopen(u,timeout=20).read().decode('utf-8','replace'); q=Parse();q.feed(html)
  main=re.search(r'<main\b.*?</main>',html,re.S);m=Parse();m.feed(main.group(0) if main else html)
  return {'url':u,'text':'\n'.join(m.text),'images':m.images,'links':q.links,'ok':True}
 except Exception as e:return {'url':u,'ok':False,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:results=list(ex.map(fetch,sorted(set(urls))))
Path('data/source-audit.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
assets={'logo':'https://cdir.es/wp-content/uploads/2022/10/nuevo_logo-120x170-1.png'}
photos=[]
for r in results:
 for im in r.get('images',[]):
  u=im['url']; u=re.sub(r'\.pagespeed\..*','',u)
  if 'uploads/' in u and re.search(r'\.(jpg|jpeg|png)$',u,re.I) and u not in [i['url'] for i in photos] and not any(x in u.lower() for x in ['divide','icono','logo','revista']): photos.append({'url':u,'alt':im['alt'],'page':r['url']})
Path('data/photo-candidates.json').write_text(json.dumps(photos,ensure_ascii=False,indent=2),encoding='utf-8')
print('Páginas:',len(results),'recuperadas:',sum(r['ok'] for r in results),'imágenes:',len(photos))
for r in results:print(r['url'], 'OK' if r['ok'] else r['error'])
