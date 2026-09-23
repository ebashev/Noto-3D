import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { ROOT, catalog, sha256, pool } from './common.mjs';
const dest = path.join(ROOT,'.cache/originals'); await mkdir(dest,{recursive:true});
const rows = await catalog(); let count=0; const failures=[];
await pool(rows, 12, async row => {
  const file=path.join(dest,row.rgi+'.png');
  try { const b=await readFile(file); if (sha256(b)===row.sha256) {count++;return;} } catch(e) {if(e.code!=='ENOENT')throw e;}
  let error;
  for(let attempt=0;attempt<4;attempt++) {
    try {
      const res=await fetch(row.url,{signal:AbortSignal.timeout(45000)}); if(!res.ok)throw new Error(`HTTP ${res.status}`);
      const b=Buffer.from(await res.arrayBuffer());
      if(b.length!==row.bytes||sha256(b)!==row.sha256)throw new Error('CDN changed or corrupt image. Import the original archive instead.');
      await writeFile(file+'.part',b);await rename(file+'.part',file);error=null;break;
    }catch(e){error=e.message;if(attempt<3)await new Promise(r=>setTimeout(r,1000*(attempt+1)));}
  }
  if(error)failures.push({rgi:row.rgi,error});
  if(++count%100===0)console.log(`Originals: ${count}/${rows.length}`);
});
if(failures.length){console.error(failures);process.exitCode=1;}else console.log('All 3988 originals verified.');
