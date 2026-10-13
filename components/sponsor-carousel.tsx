'use client';
import {ClubImage} from './static-elements';

import Link from 'next/link';
import {useState} from 'react';
const sponsors=['DIA','Boosters Group','Tu Colada','Colegios Zola Las Rozas','Jorge Pinilla Health & Performance','Hoy Tengo Gine','Komvida','100% Natural','Light Architecture Studio'];
export default function SponsorCarousel(){const [paused,setPaused]=useState(false);return <div className="sponsor-carousel" aria-label="Patrocinadores del club"><div className="sponsor-carousel-toolbar"><p>Ellos también hacen equipo con CDIR.</p><button onClick={()=>setPaused(!paused)} aria-pressed={paused} aria-label={paused?'Reanudar carrusel de patrocinadores':'Pausar carrusel de patrocinadores'}>{paused?'▶ Reanudar':'Ⅱ Pausar'}</button></div><div className={'sponsor-window '+(paused?'paused':'')}><div className="sponsor-marquee"><div className="sponsor-logos">{sponsors.map((name,i)=><Link href="/patrocinadores" key={name} aria-label={'Conocer patrocinador: '+name}><ClubImage src={'/club/asset-'+(i+1)+'.jpeg'} alt={name} loading="lazy"/></Link>)}</div><div className="sponsor-logos sponsor-copy" aria-hidden="true">{sponsors.map((name,i)=><div key={name}><ClubImage src={'/club/asset-'+(i+1)+'.jpeg'} alt="" loading="lazy"/></div>)}</div></div></div></div>;}
