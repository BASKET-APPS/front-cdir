from pathlib import Path
import json,re
p=Path('data/registration-schemas.json');forms=json.loads(p.read_text(encoding='utf-8'))
for k,s in forms.items():
 source=Path('data/'+('contacto' if k.startswith('contacto') else k)+'-form.html').read_text(encoding='utf-8')
 for f in s['fields']:
  raw=f['raw'];label=f['label']
  if not label:label=raw.replace('_',' ').strip()
  if f['type']=='radio':
   if 'priv' in raw or (raw=='super_select' and 'privacidad' in label):label='He leído y acepto la política de privacidad';f['required']=True;f['kind']='privacy'
   elif 'captacion' in raw or (raw=='super_select' and 'imágenes' in label):label='Autorizo la captación y publicación de imágenes en los medios del club';f['required']=False;f['kind']='images'
   elif 'recibos' in raw:label='Autorizo la domiciliación de las cuotas del club';f['kind']='debit'
   elif 'informacion' in raw or 'info' in raw or 'noticias' in raw:label='Quiero recibir información sobre eventos y noticias';f['required']=False;f['kind']='news'
   if len(f['options'])==1:f['options']=[{'value':'Si','label':'Sí'},{'value':'0','label':'No'}]
   else:
    for o in f['options']:o['label']={'banco':'Domiciliación bancaria','efectivo':'Efectivo'}.get(o['value'],o['label'])
  if 'iban' in label.lower() or raw=='nº_de_cuenta':label='IBAN de la cuenta';f['kind']='iban'
  if 'adjuntar' in raw or f['type']=='file':
   label=label.split('Necesario')[0].split('Descarga')[0].strip() or 'Documento de domiciliación firmado'
   f['hint']='JPG, PNG o PDF. Hasta 5 MB por archivo.'
  if raw=='_dni':label='DNI del participante o de su tutor';f['hint']='Si el niño o niña no tiene DNI, introduce el de su padre, madre o tutor.'
  if raw=='nº_de_dni':label='DNI del jugador/a';f['required']=True
  if f['type']=='textarea':label=label or raw.replace('_',' ')
  # Placeholders supply actual public labels on contact forms.
  if k.startswith('contacto'):
   pattern=re.search(r'<(?:input|textarea)[^>]*name=["\']'+re.escape(raw)+r'["\'][^>]*>',source)
   if pattern:
    placeholder=re.search(r'placeholder=["\']([^"\']+)',pattern.group(0));label=placeholder.group(1).lstrip('*').strip() if placeholder else label
  f['label']=label
  f['step']='confirm' if f['type']=='radio' and f.get('kind') in ['privacy','images','news','debit'] else 'documents' if f['type']=='file' else 'payment' if raw in ['modalidad_de_pago','titular_de_la_cuenta','nº_de_cuenta'] else 'player' if 'jugador' in raw or raw in ['nombre','_apellidos','año_de_nacimiento','_dni','patologías','días_y_sede_para_la_escuela_base[]','centro_escolar'] else 'family'
  if f['type']=='radio' and 'empadronado' in raw:f['step']='player'
  if f.get('kind')=='debit':f['step']='payment'
  if k in ['mecenas','contacto','contacto-jugador'] and f['step']=='player':f['step']='family'
  if raw in ['titular_de_la_cuenta','nº_de_cuenta'] or f.get('kind')=='debit':f['condition']='bank'
  if k=='escuela' and 'días_y_sede' in raw:f['required']=True
 s['steps']=[step for step in ['player','family','payment','documents','confirm'] if any(f['step']==step for f in s['fields'])]
 if 'confirm' not in s['steps']:s['steps'].append('confirm')
 s['title']={'federados':'Equipos federados','escuela':'Escuela base','municipales':'Equipos municipales','ies':'IES Carmen Conde','mecenas':'Mecenazgo','contacto':'Consulta al club','contacto-jugador':'Quiero entrenar en CDIR'}[k]
p.write_text(json.dumps(forms,ensure_ascii=False,indent=2),encoding='utf-8')
for k,s in forms.items():print(k,[(f['id'],f['raw'],f['label']) for f in s['fields'] if f['type']=='radio'])
