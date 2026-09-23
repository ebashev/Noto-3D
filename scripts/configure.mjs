import {readFile,writeFile} from 'node:fs/promises';import path from 'node:path';import {ROOT} from './common.mjs';
const name=process.argv[2];if(!name||!/^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name)||name.length>214)throw new Error('Usage: npm run configure -- @your-npm-user/emoji-datasource-noto3d');
const p=path.join(ROOT,'package.json');const pkg=JSON.parse(await readFile(p,'utf8'));pkg.name=name;await writeFile(p,JSON.stringify(pkg,null,2)+'\n');
const lockPath=path.join(ROOT,'package-lock.json');try{const lock=JSON.parse(await readFile(lockPath,'utf8'));lock.name=name;if(lock.packages?.[''])lock.packages[''].name=name;await writeFile(lockPath,JSON.stringify(lock,null,2)+'\n');}catch(e){if(e.code!=='ENOENT')throw e;}
console.log(`Package name set to ${name}. Run npm run build. Documentation uses the example name emoji-datasource-noto3d; substitute your actual name.`);
