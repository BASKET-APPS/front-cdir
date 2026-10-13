from pathlib import Path
p=Path('app/layout.tsx');h=p.read_text(encoding='utf-8');h=h.replace("import ClubGuide", "import CookieConsent from '../components/cookie-consent';\nimport ClubGuide");h=h.replace('<ClubGuide />','<ClubGuide /><CookieConsent />');h=h.replace("title: 'CDIR · Aquí jugamos todos',", "title: 'CDIR · Aquí jugamos todos',\n  icons: { icon: '/club/logo.png' },",1);p.write_text(h,encoding='utf-8')
p=Path('components/site-shell.tsx');h=p.read_text(encoding='utf-8');h=h.replace("['Nuestra historia', '/club'],", "['Nuestra historia', '/club'], ['Salud y bienestar', '/salud'], ['Espacio de familias', '/familias'],");h=h.replace('<Link href="/politica-de-cookies">Cookies</Link>','<Link href="/politica-de-cookies">Cookies</Link><button type="button" data-cookie-settings>Configurar cookies</button>');p.write_text(h,encoding='utf-8')
p=Path('app/page.tsx');h=p.read_text(encoding='utf-8');h="import WellbeingSection from '../components/wellbeing-section';\n"+h;h=h.replace('<section id="experiencias"','<WellbeingSection />\n<section id="experiencias"');h=h.replace('src="https://cdir.es/wp-content/uploads/2016/07/basketball-hoop-closeup-scaled.jpg" alt="Detalle de una canasta de baloncesto"','src="/club/presentation/page-19-image-0.jpg" alt="Jugadores y entrenador del club reunidos"');h=h.replace('src="https://cdir.es/wp-content/uploads/2023/02/Revista-CDIR-No4-1.jpg"','src="/club/revista-4.jpg"');p.write_text(h,encoding='utf-8')
p=Path('app/globals.css');h=p.read_text(encoding='utf-8');h=h[h.index('\n')+1:] if h.startswith('@import') else h;h=Path('data/local-fonts.css').read_text(encoding='utf-8')+'\n'+h;h=h.replace("url('/club/photo-3.jpg')", "url('/club/presentation/page-32-image-0.jpg')");h=h.replace('content:url(\'/club/photo-2.jpg\')','content:normal');p.write_text(h,encoding='utf-8')
p=Path('components/club-gallery.tsx');h=p.read_text(encoding='utf-8');a=h.index('const photos = [');b=h.index('];',a)+2;h=h[:a]+'''const photos = [
 {src:'/club/presentation/page-12-image-0.jpg',caption:'El equipo, también fuera de casa.'},
 {src:'/club/more-5.jpg',caption:'Una misma camiseta. Una misma pasión.'},
 {src:'/club/presentation/page-22-image-0.jpg',caption:'Aprender juntos en cada entrenamiento.'},
 {src:'/club/more-10.jpg',caption:'Compartimos la emoción del partido.'},
 {src:'/club/presentation/page-33-image-0.jpg',caption:'Crecer y disfrutar en equipo.'},
 {src:'/club/more-13.jpg',caption:'Cada encuentro suma una experiencia.'},
 {src:'/club/presentation/page-20-image-0.jpg',caption:'Los primeros pasos de una gran historia.'},
 {src:'/club/presentation/page-27-image-0.jpg',caption:'La fuerza de estar juntos.'},
];'''+h[b:];p.write_text(h,encoding='utf-8')
p=Path('lib/guide.ts');h=p.read_text(encoding='utf-8');h=h.replace('export const topics = [','''export const topics = [
 {id:'psychology',keys:['psicologia','psicologo','psicologa','gonzalo','bienestar','emocional','frustracion','presion'],title:'Psicología del club',answer:'El área de psicología acompaña a jugadores, entrenadores y familias. Consulta la atención individual y el contacto del servicio.',href:'/salud/psicologia'},
 {id:'physical',keys:['fisico','fisica','preparacion','entrenamiento','molestia','molestias'],title:'Preparación física',answer:'Conoce el equipo de preparación física y cómo coordinar el trabajo con entrenadores y profesionales del club.',href:'/salud/preparacion-fisica'},
 {id:'physio',keys:['fisioterapia','fisio','fisioterapeuta'],title:'Fisioterapia',answer:'El servicio está disponible para jugadores y familias. Consulta al club cómo solicitar cita y las condiciones.',href:'/salud/fisioterapia'},
 {id:'parents',keys:['padres','madres','familias','ampa'],title:'Espacio de familias',answer:'Descubre la Escuela de Padres, el baloncesto en familia y los recursos para acompañar la temporada.',href:'/familias'},
''');p.write_text(h,encoding='utf-8')
