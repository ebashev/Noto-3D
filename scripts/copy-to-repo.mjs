import {readdir,readFile,stat,mkdir,copyFile} from 'node:fs/promises';import path from 'node:path';import {ROOT} from './common.mjs';
if(!process.argv[2])throw new Error('Usage: node scripts/copy-to-repo.mjs /path/to/cloned/Noto-3D');
const target=path.resolve(process.argv[2]);if(target===path.resolve(ROOT)||target.startsWith(path.resolve(ROOT)+path.sep))throw new Error('Destination must be outside this source directory.');
await stat(path.join(target,'.git'));
const files=[];const exclude=new Set(['.git','node_modules','.cache','artifacts']);
async function walk(dir,relative=''){for(const e of await readdir(dir,{withFileTypes:true})){if(exclude.has(e.name)||/\.(tgz|zip)$/.test(e.name))continue;const r=path.join(relative,e.name);if(e.isDirectory())await walk(path.join(dir,e.name),r);else if(e.isFile())files.push(r);}}
await walk(ROOT);
for(const f of files){try{const existing=await readFile(path.join(target,f)),source=await readFile(path.join(ROOT,f));if(!existing.equals(source))throw new Error(`Conflict: ${f}. Compare/merge manually; nothing copied.`);}catch(e){if(e.code!=='ENOENT')throw e;}}
for(const f of files){await mkdir(path.dirname(path.join(target,f)),{recursive:true});await copyFile(path.join(ROOT,f),path.join(target,f));}
console.log(`Copied ${files.length} files to ${target}. Review git diff/status, then commit and push.`);
