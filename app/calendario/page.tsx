import ClubLiveContent from '../../components/club-live-content';
import {ClubImage} from '../../components/static-elements';
import Link from 'next/link';
export const metadata={title:'Calendario y resultados · CDIR'};
export default function CalendarPage(){return <main className='inner-page' id='contenido'><section className='inner-hero'><div><nav className='breadcrumbs' aria-label='Ruta de navegación'><Link href='/'>Inicio</Link><span>/</span><span>Calendario y resultados</span></nav><p className='eyebrow'>CADA PARTIDO, JUNTOS</p><h1>Nos vemos<br/>en la <em>cancha.</em></h1><p>Consulta los partidos publicados por el club, dónde jugamos y los resultados de cada jornada.</p></div><ClubImage className='inner-logo' src='/club/logo.png' alt='CDIR' width='260' height='198'/></section><ClubLiveContent mode='matches'/></main>;}
