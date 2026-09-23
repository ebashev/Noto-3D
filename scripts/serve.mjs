import http from 'node:http';import {readFile} from 'node:fs/promises';import path from 'node:path';import {ROOT} from './common.mjs';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.webp':'image/webp'};
http.createServer(async(req,res)=>{try{
 let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(name==='/')name='/examples/demo.html';
 const file=path.resolve(ROOT,'.'+name);if(!file.startsWith(ROOT+path.sep)&&!file.startsWith(ROOT))throw new Error('Invalid path');
 const relative=path.relative(ROOT,file);if(relative.startsWith('..')||path.isAbsolute(relative))throw new Error('Invalid path');
 const content=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(content);
}catch{res.writeHead(404);res.end('Not found');}}).listen(8080,'127.0.0.1',()=>console.log('http://127.0.0.1:8080/ — local demo, Ctrl+C to stop'));
