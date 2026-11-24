const {isIP} = require('node:net');
let url;
try { url = new URL(process.env.CDIR_ADMIN_API_URL); }
catch { throw Error('Set GitHub variable CDIR_ADMIN_API_URL to the deployed HTTPS administration server.'); }
if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || url.hostname === 'localhost' || url.hostname.endsWith('.localhost') || isIP(url.hostname.replace(/^\[|\]$/g, ''))) {
  throw Error('CDIR_ADMIN_API_URL must be a public HTTPS origin, without a path or credentials.');
}
console.log('Public HTTPS API origin configured.');
