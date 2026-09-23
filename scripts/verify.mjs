import {readFile,readdir,stat} from 'node:fs/promises';import path from 'node:path';
import {ROOT,readJson,sha256,catalog,FORMATS,imagePath,toUnified} from './common.mjs';
const manifest=await readJson('manifest.json'),pkg=await readJson('package.json'),source=await catalog();
if(manifest.package!==pkg.name||manifest.version!==pkg.version||manifest.emojiCount!==3988||manifest.imageCount!==11964)throw new Error('Stale manifest: run npm run build');
const expected=new Set(source.flatMap(e=>FORMATS.map(f=>imagePath(toUnified(e.rgi),f.format,f.size))));
let bytes=0;const seen=new Set();
for(const a of manifest.assets){
 if(!expected.has(a.file)||seen.has(a.file))throw new Error(`Unexpected/duplicate asset: ${a.file}`);seen.add(a.file);
 const b=await readFile(path.join(ROOT,a.file));if(b.length!==a.bytes||sha256(b)!==a.sha256)throw new Error(`Corrupt asset: ${a.file}`);bytes+=b.length;
 if(a.format==='png'&&(!b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||b.readUInt32BE(16)!==64||b.readUInt32BE(20)!==64))throw new Error('Invalid PNG');
 if(a.format==='webp'&&(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WEBP'))throw new Error('Invalid WebP');
}
async function inventory(dir){let files=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())files.push(...await inventory(p));else files.push(p);}return files;}
const actual=await inventory(path.join(ROOT,'img'));
if(actual.length!==expected.size||seen.size!==expected.size)throw new Error('Extra/missing asset files');
const ds=await readJson('emoji-datasource.json');const dsCodes=new Set();for(const e of ds){dsCodes.add(e.unified);Object.values(e.skin_variations||{}).forEach(v=>dsCodes.add(v.unified));if('sheet_x' in e||'has_img_apple' in e)throw new Error('Invalid inherited sprite/vendor data');}
if(dsCodes.size!==3988||source.some(r=>!dsCodes.has(toUnified(r.rgi))))throw new Error('Datasource adapter loses variants');
// Project budget, deliberately below the current jsDelivr 150 MB package limit.
let shipped=bytes;
for(const name of ['dist','licenses'])for(const p of await inventory(path.join(ROOT,name)))shipped+=(await stat(p)).size;
for(const n of ['emoji.json','emoji-datasource.json','manifest.json','package.json','README.md','CONTRIBUTING.md','NOTICE.md','LICENSE.md'])shipped+=(await stat(path.join(ROOT,n))).size;
if(shipped>120_000_000)throw new Error(`Package exceeds project budget: ${shipped} bytes`);
console.log(`Verified 3988 emojis / ${seen.size} assets. Images ${(bytes/1e6).toFixed(2)} MB; publish payload ~${(shipped/1e6).toFixed(2)} MB.`);
