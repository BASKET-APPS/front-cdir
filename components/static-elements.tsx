import type { ComponentProps } from 'react';
import {sitePath,siteHref} from '../lib/site-path';
export function ClubImage({src,...props}:ComponentProps<'img'>){return <img {...props} src={typeof src==='string'?sitePath(src):src}/>;}
export function SiteAnchor({href,...props}:ComponentProps<'a'>){return <a {...props} href={href?siteHref(href):href}/>;}
