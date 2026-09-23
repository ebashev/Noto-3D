import { readdir, readFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import {ROOT,catalog,sha256} from './common.mjs';
if(!process.argv[2])throw new Error('Usage: npm run import:originals -- /path/to/extracted/Noto_3D_Emoji_512');
const input=path.resolve(process.argv[2]),dest=path.join(ROOT,'.cache/originals');await mkdir(dest,{recursive:true});
const wanted=new Map((await catalog()).map(r=>[r.rgi,r]));let count=0;
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){
 const file=path.join(dir,e.name);if(e.isDirectory())await walk(file);else if(e.isFile()&&e.name.endsWith('.png')){
  const stem=e.name.slice(0,-4);const rgi=stem.includes('__')?stem.split('__').at(-1):stem.replace(/^emoji_u/,'');
  const row=wanted.get(rgi);if(!row)continue;
  const b=await readFile(file);if(sha256(b)!==row.sha256)throw new Error(`Checksum mismatch: ${file}`);
  await copyFile(file,path.join(dest,rgi+'.png'));wanted.delete(rgi);count++;
 }
}}
await walk(input);if(wanted.size)throw new Error(`Imported ${count}; missing ${wanted.size} originals. Extract BOTH ZIP parts into one directory.`);
console.log(`Imported and verified ${count} original PNGs.`);
