from pathlib import Path
import json,re
from urllib.parse import urlparse
r=json.load(open('data/source-audit.json',encoding='utf-8'));photos=json.load(open('data/photo-candidates.json',encoding='utf-8'));imageMap={p['url']:'/club/asset-'+str(i)+Path(p['url']).suffix for i,p in enumerate(photos)}
titles={'club':'El club','actividades':'Jugar en CDIR','escuela-base-2':'Escuela base','equipos-federados':'Equipos federados','equipos-municipales':'Equipos municipales','equipo-ies-carmen-conde':'IES Carmen Conde','campus-2':'Campus y tecnificación','contact-us':'Contacta con el club','eventos':'Eventos y jornadas','news':'Novedades','mecenas':'Mecenas','patrocinadores':'Patrocinadores','torneo-gandia':'Torneo Gandía 2026','torneo-azua':'Torneo Doctor Azúa 2026'}
result=[]
for x in r:
 slug=urlparse(x['url']).path.strip('/')
 if not slug or '/page/' in slug:continue
 lines=x.get('text','').splitlines();title=titles.get(slug,lines[0] if lines else slug)
 body=[]
 for line in lines[1:]:
  if any(v in line for v in ['Gracias por apuntarte','Thank you for connecting','Comparte con tus','¿Te apuntas?']):break
  if line in ['WPadmin','@objetivoCDIR','Project Description','* * *','CDIR','CDIRozasbasket','#objetivo','Read More'] or re.match(r'^\d{4}-\d{2}-\d{2}T',line):continue
  if line not in body:body.append(line)
 images=[]
 for im in x.get('images',[]):
  u=re.sub(r'\.pagespeed\..*','',im['url'])
  if u in imageMap and imageMap[u] not in images:images.append(imageMap[u])
 group='club'
 if slug.startswith('nuestro-club/') or slug.startswith('torneo-'):group='eventos'
 if 'revista-' in slug or slug in ['jornada-en-familia-diciembre-2022','nilofar-bayat-el-deporte-me-ha-salvado-la-vida','12-12-2021-babybasket-villanueva-de-la-canada']:group='noticias'
 if slug in ['politica-de-privacidad','aviso-legal','politica-de-cookies']:group='legal'
 activity=slug in ['escuela-base-2','equipos-federados','equipos-municipales','equipo-ies-carmen-conde','baloncesto-inclusivo-en-familia'] or any(v in slug for v in ['entrenamientos-personalizados','escuela-o-equipo-de-discapacidad','en-primera-persona','equipos-federados-desde','participacion-en-la','nuestro-club/escuela-base','nuestro-club/torneos','nuestro-club/campus','nuestro-club/baloncesto-inclusivo-en-familia']) and not any(v in slug for v in ['2023','2024','2025','2026'])
 if activity:group='actividades'
 date=re.search(r'\b(20\d\d)-\d\d-\d\dT',x.get('text',''))
 result.append({'slug':slug,'title':title,'body':body,'images':images,'group':group,'source':x['url'],'updated':date.group(0)[:10] if date else '', 'documents':list(dict.fromkeys(u for u in x.get('links',[]) if re.search(r'\.(pdf|docx?)(?:$|\?)',u)))})
Path('data/pages.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print('Páginas interiores:',len(result))
