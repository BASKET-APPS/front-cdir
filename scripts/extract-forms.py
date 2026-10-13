from pathlib import Path
from html.parser import HTMLParser
import json,re
class Node:
 def __init__(self,t,a,parent=None):self.tag=t;self.a=dict(a);self.parent=parent;self.children=[];self.text=''
 def content(self):return self.text+''.join(c.content() for c in self.children)
 def find(self,t):return [c for c in self.children if c.tag==t]+[x for c in self.children for x in c.find(t)]
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.root=Node('root',[]);self.current=self.root
 def handle_starttag(self,t,a):
  n=Node(t,a,self.current);self.current.children.append(n)
  if t not in ['input','img','br','hr','meta','link','source','wbr']:self.current=n
 def handle_endtag(self,t):
  n=self.current
  while n.parent:
   if n.tag==t:self.current=n.parent;return
   n=n.parent
 def handle_data(self,d):self.current.text+=d
result={}
slugs={'federados':'equipos-federados','escuela':'escuela-base-2','municipales':'equipos-municipales','ies':'equipo-ies-carmen-conde','mecenas':'mecenas','contacto':'contact-us'}
for name,slug in slugs.items():
 h=Path('data/'+name+'-form.html').read_text(encoding='utf-8');p=Parser();p.feed(h)
 for index,form in enumerate(p.root.find('form')):
  if form.a.get('name')!='nex_form':continue
  key=name if name!='contacto' else ('contacto-jugador' if index==0 else 'contacto')
  fields=[];hidden={};seen=set()
  for n in form.find('input')+form.find('select')+form.find('textarea'):
   a=n.a;raw=a.get('name','');typ=a.get('type',n.tag)
   if not raw or raw in ['company_url','ms_current_step']:continue
   if typ=='hidden':
    if raw!='ip':hidden[raw]=a.get('value','')
    continue
   parent=n
   while parent.parent and 'form_field' not in parent.a.get('class','').split():parent=parent.parent
   labels=parent.find('label');label=' '.join(labels[0].content().split()) if labels else raw.replace('_',' ')
   label=re.sub(r'^\*\s*','',label).replace('NO PONER COMAS','').strip()
   if typ=='radio':
    if a.get('value')=='0':continue
    # All options in a group are represented once. Duplicate legacy consent names get distinct UI identifiers.
    if raw in seen and raw!='super_select':continue
   elif raw in seen:continue
   if raw=='super_select':label='Consentimiento de imágenes' if not any(f['raw']=='super_select' for f in fields) else 'Acepto la política de privacidad'
   seen.add(raw)
   required='required' in a.get('class','').split() or 'required' in parent.a.get('class','').split() or a.get('data-required')=='true'
   field={'id':str(len(fields)),'raw':raw,'label':label,'type':typ,'required':required,'options':[]}
   if typ=='select':field['options']=[{'value':o.a.get('value',''),'label':' '.join(o.content().split())} for o in n.find('option') if o.a.get('value') not in ['0','']]
   if typ=='radio':field['options']=[{'value':f.a.get('value',''),'label':f.a.get('value','')} for f in form.find('input') if f.a.get('name')==raw and f.a.get('type')=='radio' and f.a.get('value')!='0'];field['options']=list({v['value']:v for v in field['options']}.values())
   if typ=='file':field['accept']='.jpg,.jpeg,.png,.pdf' if 'foto' in raw or 'dni' in raw else '.pdf,.jpg,.jpeg,.png,.doc,.docx'
   if typ=='text':
    if 'email' in raw:field['type']='email'
    elif 'tel' in raw:field['type']='tel'
    elif 'fecha_de_nacimiento' in raw:field['type']='date'
   fields.append(field)
  result[key]={'key':key,'slug':slug,'title':hidden.get('nf_page_title',name),'formId':form.a.get('data-form-id',form.a.get('id')),'source':'https://cdir.es/'+slug+'/','hidden':hidden,'fields':fields}
Path('data/registration-schemas.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
for k,f in result.items():
 print(k,'ID',f['formId'])
 for x in f['fields']:print(x['id'],x['label'][:90],x['type'],x['required'])
