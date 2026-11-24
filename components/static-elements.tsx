import type { ComponentProps } from 'react';
import {sitePath,siteHref} from '../lib/site-path';
import variants from '../data/image-variants.json';
type Variant={w:number;h:number;variants:{src:string;w:number}[]};
// Wide photos get lighter 828/1240 px candidates (scripts/generate-image-variants.py). With sizes=100vw by
// default the browser only picks one when the screen needs no more device pixels than it has,
// so desktop quality is unchanged. Images decode off the main thread unless the caller says otherwise.
export function ClubImage({src,srcSet,sizes,decoding,...props}:ComponentProps<'img'>){
 const v=typeof src==='string'&&!srcSet?(variants as Record<string,Variant>)[src]:undefined;
 return <img {...props} decoding={decoding??'async'} src={typeof src==='string'?sitePath(src):src} srcSet={v?[...v.variants.map(x=>sitePath(x.src)+' '+x.w+'w'),sitePath(src as string)+' '+v.w+'w'].join(', '):srcSet} sizes={v?sizes??'100vw':sizes}/>;
}
export function SiteAnchor({href,...props}:ComponentProps<'a'>){return <a {...props} href={href?siteHref(href):href}/>;}
