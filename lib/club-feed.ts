'use client';
import {useEffect,useState} from 'react';
import {browserPublicFeed} from './browser-sql';
// Shared, public-only client cache for /api/public/club.
// - One request in flight per set of sections (several components or quick re-renders share it).
// - Each section has its own freshness: results change more often than magazines.
// - Nothing is polled while the tab is hidden; returning to the tab only refreshes stale sections.
// - Requests use `cache: 'no-cache'`, so the browser revalidates with ETag and unchanged data costs a 304.
export type FeedSection='events'|'matches'|'magazines'|'activities';
export type MatchView='archive'|'recent';
export const SECTION_TTL:Record<FeedSection,number>={matches:60_000,events:5*60_000,activities:5*60_000,magazines:10*60_000};
const CHECK_EVERY=15_000;
type Entry={value:unknown;at:number};
const store=new Map<string,Entry>(),inFlight=new Map<string,Promise<void>>(),listeners=new Set<()=>void>();
const key=(origin:string,section:FeedSection,matchView:MatchView)=>origin+'|'+section+(section==='matches'?'|'+matchView:'');
function notify(){for(const listener of listeners)listener();}
/** Fetches the given sections once, merging every section the server returns (older servers return all). */
export function loadSections(origin:string,sections:FeedSection[],matchView:MatchView='archive'):Promise<void>{
 const wanted=[...new Set(sections)].sort();const id=origin+'?'+wanted.join(',')+'|'+matchView;
 const running=inFlight.get(id);if(running)return running;
 const demo=process.env.NEXT_PUBLIC_CDIR_DEMO==='true';
 const request=async()=>{if(demo){try{const saved=localStorage.getItem('cdir-demo-public-feed-v1');if(saved)return JSON.parse(saved);}catch{}const r=await fetch('/cdir-admin-app/demo/public-feed.json');if(!r.ok)throw Error('Demo feed unavailable');return r.json();}const r=await fetch(origin+'/api/public/club?sections='+wanted.join(',')+(matchView==='recent'?'&matchView=recent':''),{cache:'no-cache'});if(!r.ok)throw Error('Feed unavailable');return r.json();};
 const work=(process.env.NEXT_PUBLIC_CDIR_DIRECT_SQL==='true'?browserPublicFeed():request()).then((data:Record<string,unknown>)=>{
  const at=Date.now();for(const section of Object.keys(SECTION_TTL) as FeedSection[])if(Array.isArray(data?.[section]))store.set(key(origin,section,matchView),{value:data[section],at});notify();
 }).finally(()=>inFlight.delete(id));
 inFlight.set(id,work);return work;
}
function stale(origin:string,sections:FeedSection[],matchView:MatchView,now=Date.now()){return sections.filter(s=>{const e=store.get(key(origin,s,matchView));return !e||now-e.at>=SECTION_TTL[s];});}
function snapshot(origin:string,sections:FeedSection[],matchView:MatchView){const out:Record<string,unknown>={};for(const s of sections){const e=store.get(key(origin,s,matchView));if(!e)return null;out[s]=e.value;}return out;}
/** Test hook: forget cached sections. */
export function resetClubFeed(){store.clear();inFlight.clear();}
export function useClubFeed<T>(origin:string|undefined,sections:FeedSection[],retry:number,matchView:MatchView='archive'){
 const id=sections.join(',');
 const [data,setData]=useState<T|null>(()=>origin?snapshot(origin,sections,matchView) as T|null:null),[error,setError]=useState(false);
 useEffect(()=>{if(!origin)return;const wanted=id.split(',') as FeedSection[];let alive=true;
  const update=()=>{const next=snapshot(origin,wanted,matchView);if(alive)setData(next as T|null);};
  const refresh=(force=false)=>{if(!force&&document.visibilityState==='hidden')return;const due=force?wanted:stale(origin,wanted,matchView);if(!due.length)return;
   loadSections(origin,due,matchView).then(()=>{if(alive)setError(false);},()=>{if(alive)setError(true);});};
  listeners.add(update);update();refresh(retry>0);
  const timer=setInterval(()=>refresh(),CHECK_EVERY);
  const visible=()=>{if(document.visibilityState==='visible')refresh();};
  document.addEventListener('visibilitychange',visible);window.addEventListener('focus',visible);
  return()=>{alive=false;listeners.delete(update);clearInterval(timer);document.removeEventListener('visibilitychange',visible);window.removeEventListener('focus',visible);};
 },[origin,id,retry,matchView]);
 return {data,error};
}
