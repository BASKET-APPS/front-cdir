import {browserMagazine} from './browser-sql';
export async function publicFirebaseFetch(input:RequestInfo|URL,init?:RequestInit){
 if(process.env.NEXT_PUBLIC_CDIR_DIRECT_SQL!=='true')return fetch(input,init);
 const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url,location.origin),match=url.pathname.match(/^\/api\/public\/magazines\/([^/]+)\/(cover|pdf)$/);
 if(!match)return fetch(input,init);
 return browserMagazine(match[1],match[2]==='cover');
}
