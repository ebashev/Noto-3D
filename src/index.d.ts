export interface Emoji {
  emoji: string; rgi: string; unified: string; name: string; cldr_name: string;
  category: string; subcategory: string; short_name: string; short_names: string[];
  image: string; sort_order: number; skin_tones: string[]; source_sha256: string;
}
export type ImageOptions = {format?: 'webp'; size?:128|256} | {format:'png';size?:64};
export type UrlOptions = ImageOptions & {cdn?:'jsdelivr'|'unpkg';version?:string;baseUrl?:string};
export type Token = {type:'text';text:string}|{type:'emoji';text:string;emoji:Emoji};
export const emojis: readonly Emoji[];
export const VERSION: string;
export const PACKAGE_NAME: string;
export function findEmoji(input:string): Emoji|undefined;
export function getEmojiPath(input:string, options?:ImageOptions): string|null;
export function getEmojiUrl(input:string, options?:UrlOptions): string|null;
export function getGoogleUrl(input:string,size?:128|512): string|null;
export function searchEmojis(query:string,options?:{limit?:number;category?:string}): Emoji[];
export function tokenize(text:string): Token[];
declare const api: {emojis:typeof emojis; VERSION:typeof VERSION; PACKAGE_NAME:typeof PACKAGE_NAME; findEmoji:typeof findEmoji; getEmojiPath:typeof getEmojiPath; getEmojiUrl:typeof getEmojiUrl;getGoogleUrl:typeof getGoogleUrl;searchEmojis:typeof searchEmojis;tokenize:typeof tokenize};
export default api;
