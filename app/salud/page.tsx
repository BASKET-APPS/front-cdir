import {ClubImage} from '../../components/static-elements';
import Link from 'next/link';
import WellbeingSection from '../../components/wellbeing-section';
export const metadata={title:'Salud y bienestar · CDIR',description:'Psicología, preparación física y fisioterapia en CDI Rozasbasket. Información de la temporada 2026–2027.'};
export default function Health(){return <main id="contenido"><section className="inner-hero"><div><nav className="breadcrumbs"><Link href="/">Inicio</Link><span>/</span><span>Salud y bienestar</span></nav><p className="eyebrow">ACOMPAÑAMOS A LAS PERSONAS</p><h1>Salud y bienestar<span>.</span></h1><p>Jugadores, entrenadores y familias: un equipo que cuida de su gente. Conoce las áreas presentadas para la temporada 2026–2027.</p></div><ClubImage className="inner-logo" src="/club/logo.png" alt="CDIR" width="260" height="198"/></section><WellbeingSection/></main>;}
