'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

export default function ClubExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const dialog = container.querySelector<HTMLDialogElement>('#enrollment')!;
    const menu = container.querySelector<HTMLButtonElement>('.menu-toggle')!;
    const navigation = container.querySelector<HTMLElement>('#navigation')!;
    const header = container.querySelector<HTMLElement>('.header')!;
    let lastTrigger: HTMLElement | null = null;
    const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); };
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>('button, a');
      if (target?.hasAttribute('data-enroll')) {
        lastTrigger = target;
        dialog.showModal();
        document.body.classList.add('modal-open');
      }
      if (target?.classList.contains('close-dialog')) dialog.close();
      if (target === menu) {
        const open = menu.getAttribute('aria-expanded') !== 'true';
        menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open);
      }
      if (target?.matches('#navigation a')) { closeMenu(); container.querySelectorAll('details.nav-group').forEach(el=>el.removeAttribute('open')); }
      if (target?.tagName === 'A' && dialog.contains(target)) dialog.close();
      if (target?.hasAttribute('data-filter')) {
        container.querySelectorAll<HTMLElement>('[data-filter]').forEach(button => {
          const selected = button === target;
          button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected));
        });
        container.querySelectorAll<HTMLElement>('[data-category]').forEach(card => {
          card.hidden = target.dataset.filter !== 'all' && card.dataset.category !== target.dataset.filter;
        });
      }
      if (event.target === dialog) {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      }
    };
    const onClose = () => { document.body.classList.remove('modal-open'); lastTrigger?.focus(); };
    const closeGroups = () => container.querySelectorAll<HTMLDetailsElement>('details.nav-group').forEach(el => { el.open = false; });
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { closeMenu(); closeGroups(); } };
    const onOutside = (event: MouseEvent) => { if (event.target instanceof Node && !header.contains(event.target)) closeGroups(); };
    const onToggle = (event: Event) => { const selected = event.target; if(selected instanceof HTMLDetailsElement && selected.classList.contains('nav-group') && selected.open) container.querySelectorAll<HTMLDetailsElement>('details.nav-group').forEach(el => { if(el !== selected) el.open=false; }); };
    let frame = 0;
    const updateScroll = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      container.style.setProperty('--scroll-progress', String(range > 0 ? window.scrollY / range : 0));
      header.classList.toggle('scrolled', window.scrollY > 35);
      const footer=container.querySelector('.site-footer');
      container.classList.toggle('footer-visible',!!footer && footer.getBoundingClientRect().top < window.innerHeight);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateScroll); };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = container.querySelectorAll<HTMLElement>('main > section:not(.hero), .footer-invite, .activity-card, .steps-grid article, .inner-card, .sponsor-logos > a, .social-grid > a');
    let observer: IntersectionObserver | undefined;
    if (!reducedMotion.matches && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer?.unobserve(entry.target); }
        });
      }, { threshold: 0 });
      elements.forEach((element, index) => {
        element.classList.add('reveal'); element.style.setProperty('--reveal-delay', `${index % 4 * 60}ms`); observer!.observe(element);
      });
    }
    const onMotionChange = () => { if (reducedMotion.matches) { observer?.disconnect(); elements.forEach(el => el.classList.remove('reveal')); } };
    const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
    const hoverTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
    const hoverCleanups: (()=>void)[] = [];
    container.querySelectorAll<HTMLDetailsElement>('.nav-group').forEach(group => {
      const enter = () => { if(!hoverMedia.matches || window.innerWidth <= 1120)return;const timer=hoverTimers.get(group);if(timer)clearTimeout(timer);container.querySelectorAll<HTMLDetailsElement>('.nav-group').forEach(other=>{if(other!==group)other.open=false;});group.open=true; };
      const leave = () => { if(!hoverMedia.matches || window.innerWidth <= 1120)return;hoverTimers.set(group,setTimeout(()=>{if(!group.contains(document.activeElement))group.open=false;},180)); };
      group.addEventListener('mouseenter',enter);group.addEventListener('mouseleave',leave);
      hoverCleanups.push(()=>{group.removeEventListener('mouseenter',enter);group.removeEventListener('mouseleave',leave);});
    });
    container.addEventListener('click', onClick);
    dialog.addEventListener('close', onClose);
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onOutside);
    container.addEventListener('toggle', onToggle, true);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    reducedMotion.addEventListener('change', onMotionChange);
    updateScroll();
    return () => {
      container.removeEventListener('click', onClick); dialog.removeEventListener('close', onClose);
      document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onOutside); container.removeEventListener('toggle', onToggle, true);
      window.removeEventListener('resize', onScroll); reducedMotion.removeEventListener('change', onMotionChange);
      observer?.disconnect(); cancelAnimationFrame(frame);
      hoverCleanups.forEach(cleanup=>cleanup());hoverTimers.forEach(timer=>clearTimeout(timer));
      document.body.classList.remove('modal-open'); elements.forEach(el => el.classList.remove('reveal'));
    };
  }, [pathname]);
  return <div ref={root}>{children}</div>;
}
