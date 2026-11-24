'use client';
import {useState} from 'react';
import {findRivalClub} from '../lib/club-catalog';
import {ClubImage} from './static-elements';
// Crests are shown at 23-32 px: use the 96 px copy (public/opponents/96) and fall back to the original.
const small=(path:string)=>path.replace(/^\/opponents\/([^/]+\.png)$/,'/opponents/96/$1');
export default function RivalCrest({name}:{name:string}){const club=findRivalClub(name),[attempt,setAttempt]=useState(0);const path=club?.logoPath;const src=path?(attempt===0?small(path):path):'';return path&&attempt<2&&!(attempt===1&&src===small(path))?<ClubImage className='rival-crest' src={src} alt={'Escudo de '+club!.name} width='23' height='23' loading='lazy' onError={()=>setAttempt(a=>a+1)}/>:<span className='result-rival-mark' aria-hidden='true'>◉</span>;}
