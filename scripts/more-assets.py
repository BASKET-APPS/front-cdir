import urllib.request,json,re,concurrent.futures
from pathlib import Path
from PIL import Image,ImageDraw
old=json.load(open('data/media.json',encoding='utf-8'));more=json.load(urllib.request.urlopen('https://cdir.es/wp-json/wp/v2/media?per_page=100&page=2'))
used={m['source_url'] for m in old if 'IMG-' in m['source_url']}
photos=[m for m in old+more if 'IMG-' in m['source_url'] and m['source_url'].lower().endswith(('.jpg','.jpeg'))][8:24]
def fetch(item):
 i,m=item;url=m.get('media_details',{}).get('sizes',{}).get('large',{}).get('source_url',m['source_url']);path=f'public/club/more-{i}.jpg';urllib.request.urlretrieve(url,path);return {'src':f'/club/more-{i}.jpg','source':m['source_url']}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:results=list(ex.map(fetch,enumerate(photos)))
Path('data/additional-photos.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
im=Image.new('RGB',(1000,560),'white');d=ImageDraw.Draw(im)
for i,x in enumerate(results):
 p=Image.open('public'+x['src']);p.thumbnail((240,110));a=(i%4)*250;b=(i//4)*140;im.paste(p,(a,b));d.text((a+5,b+112),str(i),fill='black')
im.save('data/more-photos.jpg')
fontCss=urllib.request.urlopen('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap').read().decode()
Path('public/fonts').mkdir(exist_ok=True)
for i,url in enumerate(dict.fromkeys(re.findall(r'url\((https[^)]+)\)',fontCss))):
 name=f'font-{i}'+Path(url).suffix;urllib.request.urlretrieve(url,'public/fonts/'+name);fontCss=fontCss.replace(url,'/fonts/'+name)
Path('data/local-fonts.css').write_text(fontCss,encoding='utf-8')
urllib.request.urlretrieve('https://cdir.es/wp-content/uploads/2023/02/Revista-CDIR-No4-1.jpg','public/club/revista-4.jpg')
print('Fotografías adicionales:',len(results),'Fuentes locales descargadas')
