import schemas from '../data/registration-schemas.json';
export type Field={id:string;raw:string;label:string;type:string;required:boolean;options:{value:string;label:string}[];step:string;accept?:string;hint?:string;kind?:string;condition?:string};
export type Registration={key:string;slug:string;title:string;formId:string;source:string;hidden:Record<string,string>;fields:Field[];steps:string[]};
export const registrations=schemas as Record<string,Registration>;
export function visibleField(field:Field,values:Record<string,string>,schema:Registration){if(field.condition==='bank'){const payment=schema.fields.find(f=>f.raw==='modalidad_de_pago');return !payment||values[payment.id]==='banco';}return true;}
export function validIban(value:string){const s=value.replace(/\s/g,'').toUpperCase();if(!/^ES\d{22}$/.test(s))return false;const digits=(s.slice(4)+s.slice(0,4)).replace(/[A-Z]/g,c=>String(c.charCodeAt(0)-55));let remainder=0;for(const n of digits)remainder=(remainder*10+Number(n))%97;return remainder===1;}
export function fieldError(field:Field,value:string,file:File|undefined,newPlayer:boolean,key:string){
 const required=field.required||(key==='federados'&&newPlayer&&field.type==='file');
 if(field.type==='file'){if(!file)return required?'Adjunta este documento para continuar.':'';if(file.size>5*1024*1024)return 'El archivo debe pesar menos de 5 MB.';const ext='.'+file.name.split('.').pop()?.toLowerCase();if(!(field.accept??'.pdf,.jpg,.jpeg,.png').split(',').includes(ext))return 'Formato no admitido. Utiliza uno de los formatos indicados.';return '';}
 if(required&&!value.trim())return 'Completa este campo para continuar.';
 if(field.kind==='privacy'&&value!=='Si')return 'Necesitamos que aceptes la política de privacidad para tramitar la solicitud.';
 if(field.kind==='debit'&&value!=='Si')return 'Autoriza la domiciliación o elige pago en efectivo.';
 if(value&&field.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))return 'Introduce un correo electrónico válido.';
 if(value&&field.type==='tel'&&!/^\+?[\d\s()-]{9,20}$/.test(value))return 'Revisa el número de teléfono.';
 if(value&&field.type==='date'&&(!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(value)>new Date()||Number.isNaN(Date.parse(value))))return 'Introduce una fecha de nacimiento válida.';
 if(value&&field.raw==='código_postal'&&!/^\d{5}$/.test(value))return 'Introduce un código postal de cinco cifras.';
 if(value&&field.kind==='iban'&&!validIban(value))return 'Revisa el IBAN español: ES seguido de 22 cifras.';
 if(value&&field.options.length&&!field.options.some(option=>option.value===value))return 'Selecciona una de las opciones disponibles.';
 if(value.length>4000)return 'Este texto es demasiado largo.';return '';
}
