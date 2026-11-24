import data from '../data/madrid-clubs.json';
export type RivalClub={id:string;name:string;logoUrl:string;alternativeLogoUrl:string;provider:string;sourceUrl:string;referenceSeason:string;logoPath?:string};
export const madridClubs:RivalClub[]=[...data].sort((a,b)=>a.name.localeCompare(b.name,'es'));
export const clubSearchKey=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').replace(/[^a-z0-9]+/g,' ').trim();
export function findRivalClub(name:string){const key=clubSearchKey(name);return madridClubs.find(c=>clubSearchKey(c.name)===key);}
export function searchRivalClubs(query:string){const words=clubSearchKey(query).split(' ').filter(Boolean);return madridClubs.filter(c=>words.every(word=>clubSearchKey(c.name).includes(word)));}
