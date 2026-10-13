'use client';
import {ClubImage} from './static-elements';

import { useEffect, useRef, useState } from 'react';
const photos = [
 {src:'/club/presentation/page-12-image-0.jpg',caption:'El equipo, también fuera de casa.'},
 {src:'/club/more-5.jpg',caption:'Una misma camiseta. Una misma pasión.'},
 {src:'/club/more-8.jpg',caption:'Aprender juntos en cada entrenamiento.'},
 {src:'/club/more-10.jpg',caption:'Compartimos la emoción del partido.'},
 {src:'/club/presentation/page-33-image-0.jpg',caption:'Crecer y disfrutar en equipo.'},
 {src:'/club/more-13.jpg',caption:'Cada encuentro suma una experiencia.'},
 {src:'/club/presentation/page-20-image-0.jpg',caption:'Los primeros pasos de una gran historia.'},
 {src:'/club/presentation/page-27-image-0.jpg',caption:'La fuerza de estar juntos.'},
];
export default function ClubGallery() {
  const track = useRef<HTMLDivElement>(null); const section=useRef<HTMLElement>(null); const [active,setActive]=useState(0); const [playing,setPlaying]=useState(true); const [paused,setPaused]=useState(false); const [visible,setVisible]=useState(false); const [reduced,setReduced]=useState(false);
  useEffect(()=>{const media=window.matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setReduced(media.matches);update();media.addEventListener("change",update);const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{threshold:.15});if(section.current)observer.observe(section.current);return()=>{media.removeEventListener("change",update);observer.disconnect();};},[]);
  useEffect(()=>{if(!playing||paused||!visible||reduced)return;const interval=setInterval(()=>{if(!document.hidden)go(active+1);},4000);return()=>clearInterval(interval);},[active,playing,paused,visible,reduced]);
  function go(index:number) {const next=(index+photos.length)%photos.length; const el=track.current; const slide=el?.children[next] as HTMLElement|undefined; if(el&&slide) el.scrollTo({left:slide.offsetLeft-el.offsetLeft,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});setActive(next);}
  return <section ref={section} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setPaused(false);}} className="section gallery-section" aria-roledescription="carrusel" aria-label="Fotografías del club"><div className="section-heading"><div><p className="eyebrow muted">ASÍ SE VIVE CDIR</p><h2>Esto es más<br />que <em>un equipo.</em></h2></div><div className="gallery-controls"><button onClick={()=>setPlaying(!playing)} aria-label={playing?"Pausar carrusel":"Reanudar carrusel"} aria-pressed={!playing}>{playing?"Ⅱ":"▶"}</button><button onClick={()=>go(active-1)} aria-label="Foto anterior">←</button><button onClick={()=>go(active+1)} aria-label="Foto siguiente">→</button></div></div><div className="gallery-track" ref={track} onScroll={()=>{const el=track.current;if(el){const width=(el.children[0] as HTMLElement).getBoundingClientRect().width+20;setActive(Math.min(photos.length-1,Math.round(el.scrollLeft/width)));}}}>{photos.map((photo,i)=><figure key={photo.src}><ClubImage src={photo.src} alt={`Fotografía del club: ${photo.caption}`} loading="lazy" /><figcaption><span>0{i+1}</span>{photo.caption}</figcaption></figure>)}</div><div className="gallery-dots" aria-label="Seleccionar fotografía">{photos.map((_,i)=><button key={i} aria-label={`Ver fotografía ${i+1}`} aria-pressed={active===i} onClick={()=>go(i)} className={active===i?'active':''} />)}</div></section>;
}
