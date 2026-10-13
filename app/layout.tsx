import type { Metadata, Viewport } from 'next';
import './globals.css';
import './header.css';
import CookieConsent from '../components/cookie-consent';
import ClubGuide from '../components/club-guide';
import ClubExperience from '../components/club-experience';
import { SiteHeader, SiteFooter, Enrollment } from '../components/site-shell';

export const metadata: Metadata = {
  title: 'CDIR · Aquí jugamos todos',
  icons: { icon: '/club/logo.png' },
  description: 'Tu equipo, tu gente, tu lugar. Descubre el baloncesto inclusivo de CDI Rozasbasket en Las Rozas y forma parte del club.',
  openGraph: { title: 'CDIR · Aquí jugamos todos', description: 'Distintas capacidades. Una misma pasión. Baloncesto para todos en Las Rozas.', locale: 'es_ES', type: 'website' },
};
export const viewport: Viewport = { themeColor: '#101d2f' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="es"><body><ClubExperience><a className="skip" href="#contenido">Saltar al contenido</a><SiteHeader />{children}<SiteFooter /><Enrollment /><ClubGuide /><CookieConsent /></ClubExperience></body></html>;
}
