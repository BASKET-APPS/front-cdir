export const CONSENT_KEY='cdir-consent-v1';
export const CONSENT_LIFETIME=180*24*60*60*1000;
export type Consent={version:1;necessary:true;preferences:boolean;statistics:boolean;marketing:boolean;savedAt:number};
export function readConsent():Consent|null{try{const raw=localStorage.getItem(CONSENT_KEY);if(!raw)return null;const value=JSON.parse(raw);if(value.version!==1||value.necessary!==true||!Number.isFinite(value.savedAt)||value.savedAt>Date.now()||Date.now()-value.savedAt>CONSENT_LIFETIME||!['preferences','statistics','marketing'].every(k=>typeof value[k]==='boolean'))return null;return value;}catch{return null;}}
export function consentAllows(category:'preferences'|'statistics'|'marketing'){return readConsent()?.[category]===true;}
