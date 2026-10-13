from pypdf import PdfReader
from pathlib import Path
import json
r=PdfReader(r'C:/Users/juank/Downloads/Reunion_Familias_CDIR_2026_2027_v2.pdf');out=[]
for i,p in enumerate(r.pages):
 text=p.extract_text();print(f'\n--- PÁGINA {i+1} ---\n{text}');out.append({'page':i+1,'text':text})
 for j,im in enumerate(p.images):
  path=Path('public/club/presentation')/f'page-{i+1}-image-{j}{Path(im.name).suffix}';path.write_bytes(im.data)
Path('data/pdf/content.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
