export type PublicMatch={id:string;team:string;season?:string;startsAt:string;opponent:string;venue:string;location:string;status:string;scoreFor:number|null;scoreAgainst:number|null;isExample:boolean};
// La última semana con resultados publicados, agrupada de lunes a domingo en Madrid.
export function previousMatchday(matches:PublicMatch[],now=Date.now()){
 const finished=matches.filter(m=>m.status==='FINAL'&&m.scoreFor!==null&&m.scoreAgainst!==null&&Date.parse(m.startsAt)<=now).sort((a,b)=>b.startsAt.localeCompare(a.startsAt));
 const week=(date:string)=>{const local=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(date));const d=new Date(local+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10);};
 if(!finished.length)return [];
 const latest=week(finished[0].startsAt);return finished.filter(m=>week(m.startsAt)===latest).sort((a,b)=>a.team.localeCompare(b.team,'es'));
}
