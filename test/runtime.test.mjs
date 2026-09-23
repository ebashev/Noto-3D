import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {emojis,findEmoji,getEmojiPath,getEmojiUrl,tokenize,searchEmojis} from '../dist/index.js';
const require=createRequire(import.meta.url);
test('ESM/CJS APIs agree and cover every catalog record',()=>{
 const cjs=require('../dist/index.cjs');assert.equal(emojis.length,3988);assert.equal(cjs.emojis.length,3988);
 for(const e of emojis){assert.equal(findEmoji(e.emoji)?.unified,e.unified);assert.equal(findEmoji(e.unified)?.unified,e.unified);assert.equal(cjs.getEmojiPath(e.emoji),getEmojiPath(e.emoji));}
});
test('aliases, Unicode sequences and normalized codes',()=>{
 assert.equal(findEmoji('🤠').rgi,'1f920');assert.equal(findEmoji('emoji_u1f920').rgi,'1f920');
 assert.equal(findEmoji(':grinning:').emoji,'😀');assert.equal(findEmoji('❤️').rgi,findEmoji('❤').rgi);
 assert.equal(findEmoji('100').emoji,'💯');
 assert.equal(findEmoji('❤︎'),undefined);assert.equal(findEmoji('not an emoji'),undefined);
 for(const s of ['👍🏽','👨‍👩‍👧‍👦','🇷🇺','1️⃣'])assert.ok(findEmoji(s),s);
});
test('grapheme tokenizer preserves copyable text and composed emoji',()=>{
 const text='Привет 🤠! 👨‍👩‍👧‍👦 👍🏽 🇷🇺 1️⃣, 123 ❤︎';const parts=tokenize(text);
 assert.equal(parts.map(p=>p.text).join(''),text);assert.equal(parts.filter(p=>p.type==='emoji').length,5);
 assert.ok(parts.at(-1).text.endsWith('123 ❤︎'));
});
test('paths and exact version CDN URLs',()=>{
 assert.equal(getEmojiPath('🤠'),'img/noto3d/webp/128/1f920.webp');
 assert.equal(getEmojiPath('🤠',{format:'png'}),'img/noto3d/png/64/1f920.png');
 assert.ok(getEmojiUrl('🤠',{cdn:'unpkg'}).startsWith('https://unpkg.com/'));
 assert.equal(getEmojiUrl('🤠',{baseUrl:'/emoji-assets/'}),'/emoji-assets/img/noto3d/webp/128/1f920.webp');
 assert.equal(getEmojiPath('unavailable'),null);
 assert.throws(()=>getEmojiPath('🤠',{format:'png',size:256}));assert.throws(()=>getEmojiUrl('🤠',{version:'latest'}));
});
test('search handles limits and categories',()=>{
 assert.equal(searchEmojis('',{limit:0}).length,0);assert.ok(searchEmojis('cowboy').length>0);
 assert.ok(searchEmojis('',{category:'Flags',limit:10}).every(e=>e.category==='Flags'));
});
