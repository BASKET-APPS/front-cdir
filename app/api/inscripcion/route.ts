import {registrations,fieldError,visibleField} from '../../../lib/registration';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const upstream='https://cdir.es/wp-admin/admin-ajax.php';
const attempts=new Map<string,{count:number;until:number}>();
const fail=(message:string,status=400,errors?:Record<string,string>)=>Response.json({message,errors},{status,headers:{'Cache-Control':'no-store'}});
async function boundedForm(request:Request){const reader=request.body?.getReader();if(!reader)throw new Error('empty');const chunks:Uint8Array[]=[];let size=0;while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>30*1024*1024){await reader.cancel();throw new Error('large');}chunks.push(value);}return new Response(new Blob(chunks as BlobPart[]),{headers:{'Content-Type':request.headers.get('content-type')??''}}).formData();}
async function signatureValid(file:File){const bytes=new Uint8Array(await file.slice(0,8).arrayBuffer());const ext=file.name.split('.').pop()?.toLowerCase();return ext==='pdf'?new TextDecoder().decode(bytes).startsWith('%PDF-'):ext==='png'?bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71:ext==='jpg'||ext==='jpeg'?bytes[0]===255&&bytes[1]===216:ext==='doc'?bytes[0]===208&&bytes[1]===207:ext==='docx'?bytes[0]===80&&bytes[1]===75:false;}
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return fail('Origen de solicitud no permitido.',403);
 if(!request.headers.get('content-type')?.startsWith('multipart/form-data'))return fail('Formato de solicitud no válido.');
 const now=Date.now();for(const [key,item] of attempts)if(item.until<now)attempts.delete(key);
 const address=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()??'local';const count=attempts.get(address)??{count:0,until:now+60_000};if(count.count>=6)return fail('Espera un minuto antes de volver a intentarlo.',429);count.count++;attempts.set(address,count);
 let data:FormData;try{data=await boundedForm(request);}catch(error){return fail(error instanceof Error&&error.message==='large'?'La solicitud supera el tamaño máximo de 30 MB.':'No se pudo leer el formulario.',413);}
 if(String(data.get('company_url')??''))return fail('No se pudo validar la solicitud.');
 const schema=registrations[String(data.get('activity')??'')];if(!schema)return fail('Actividad no válida.');
 const values:Record<string,string>={};for(const field of schema.fields){const value=data.get('field_'+field.id);if(typeof value==='string')values[field.id]=value.trim();}
 const errors:Record<string,string>={};const newPlayer=data.get('new_player')==='true';
 for(const field of schema.fields.filter(f=>visibleField(f,values,schema))){const entry=data.get('field_'+field.id);const file=entry instanceof File&&entry.size?entry:undefined;const error=fieldError(field,values[field.id]??'',file,newPlayer,schema.key);if(error)errors[field.id]=error;if(file&&!await signatureValid(file))errors[field.id]='El contenido del archivo no coincide con un formato permitido.';}
 if(Object.keys(errors).length)return fail('Revisa los campos indicados antes de enviar.',422,errors);
 const outgoing=new FormData();for(const [key,value] of Object.entries(schema.hidden))if(key!=='ip')outgoing.set(key,value);outgoing.set('nex_forms_Id',schema.formId);outgoing.set('action','submit_nex_form');outgoing.set('company_url','');outgoing.set('ms_current_step','1');outgoing.set('paypal_return_url','');
 // Preserve distinct consent records even where the legacy template reused super_select.
 for(const field of schema.fields.filter(f=>visibleField(f,values,schema))){const entry=data.get('field_'+field.id);if(field.type==='file'){if(entry instanceof File&&entry.size){const name=entry.name.replace(/[^a-zA-Z0-9._-]/g,'_').slice(-120);outgoing.append(field.raw,entry,name);}}else{let value=values[field.id]??'';if(field.type==='radio'&&!value)value='0';if(field.type==='date'&&value)value=value.split('-').reverse().join('/');outgoing.append(field.raw,value);if(field.kind==='images')outgoing.set('cdir_consentimiento_imagenes',value);if(field.kind==='privacy')outgoing.set('cdir_aceptacion_privacidad',value);}}
 const repeatedConsent=schema.fields.filter(f=>f.raw==='super_select');
 if(repeatedConsent.length>1){
  // The old template reused one PHP key for two different consents. Never let a
  // privacy acceptance turn a refused image permission into an acceptance.
  outgoing.delete('super_select');
  outgoing.set('super_select',repeatedConsent.every(f=>values[f.id]==='Si')?'Si':'0');
 }
 try{
  // Read the current public form before sending, so an obsolete form ID never silently receives data.
  const source=await fetch(schema.source,{cache:'no-store',signal:AbortSignal.timeout(12_000)});if(!source.ok)return fail('No se pudo conectar con el sistema del club. Inténtalo más tarde.',503);const html=await source.text();const exists=new RegExp('<form[^>]*data-form-id=["\']'+schema.formId+'["\']').test(html);if(!exists)return fail('El formulario del club ha cambiado. Contacta con CDIR para actualizar la inscripción.',503);
  const response=await fetch(upstream,{method:'POST',body:outgoing,headers:{Referer:schema.source},redirect:'error',signal:AbortSignal.timeout(25_000)});const text=(await response.text()).trim();
  if(!response.ok)return fail('El sistema del club no ha confirmado el envío. Contacta con CDIR antes de repetir la solicitud.',502);
  if(text==='0'||text==='-1'||/\b(error|failed|invalid|denied|fatal|exception)\b/i.test(text))return fail('El sistema del club ha devuelto un error. Contacta con CDIR antes de repetir la solicitud.',502);
  // NEX-Forms handles an empty successful response. Any unfamiliar body remains explicitly unconfirmed.
  if(text!==''&&text!=='1'&&text!=='success'){return Response.json({status:'uncertain',message:'El servidor del club ha respondido, pero no podemos confirmar automáticamente la recepción. Contacta con CDIR antes de repetir el envío.'},{status:202,headers:{'Cache-Control':'no-store'}});}
  return Response.json({status:'sent',message:'Tu solicitud se ha enviado al sistema del club. CDIR debe confirmar su recepción y la disponibilidad de plaza.'},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({status:'uncertain',message:'No hemos podido confirmar el resultado del envío. Contacta con CDIR antes de repetir la solicitud.'},{status:202,headers:{'Cache-Control':'no-store'}});}
}
