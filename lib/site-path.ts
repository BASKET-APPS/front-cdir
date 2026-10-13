export const basePath = '/front-cdir';
/** Prefix public files and native anchors; next/link adds basePath itself. */
export function sitePath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//') || path === basePath || path.startsWith(basePath + '/')) return path;
  return basePath + path;
}
export function siteHref(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const [pathname, suffix = ''] = path.split(/(?=[?#])/, 2);
  const normalized = /\.[a-z0-9]+$/i.test(pathname) || pathname.endsWith('/') ? pathname : pathname + '/';
  return sitePath(normalized) + suffix;
}
