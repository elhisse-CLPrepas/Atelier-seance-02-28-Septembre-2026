import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const args = process.argv.slice(2);
const rawPort = args.find(x => x.startsWith('--port='))?.slice(7) ?? '4173';
const port = Number(rawPort);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Port invalide');
const rawPrefix = args.find(x => x.startsWith('--prefix='))?.slice(9) ?? '/';
const prefix = '/' + rawPrefix.split('/').filter(Boolean).join('/') + (rawPrefix === '/' ? '' : '/');
if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('Le dossier dist manque. Exécutez npm ci puis npm run build.');
  process.exit(1);
}
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
const server = http.createServer((req,res) => {
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405);res.end();return;}
  let pathname;
  try {pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);} catch {res.writeHead(400);res.end();return;}
  if (prefix !== '/' && pathname === prefix.slice(0,-1)) {res.writeHead(302,{Location:prefix});res.end();return;}
  if (!pathname.startsWith(prefix)) {res.writeHead(404);res.end('Page introuvable');return;}
  const relative = pathname.slice(prefix.length) || 'index.html';
  const target = path.resolve(root,relative);
  if (!target.startsWith(root + path.sep)) {res.writeHead(403);res.end();return;}
  fs.stat(target,(error,stat)=>{
    if (error || !stat.isFile()) {res.writeHead(404);res.end('Fichier introuvable');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-store'});
    if (req.method === 'HEAD') {res.end();return;}
    const stream=fs.createReadStream(target);stream.on('error',()=>res.destroy());stream.pipe(res);
  });
});
server.on('error',error=>{
  console.error(error.code==='EADDRINUSE' ? `Le port ${port} est occupé. Fermez le serveur déjà ouvert ou utilisez --port=4174.` : error.message);
  process.exitCode=1;
});
server.listen(port,'127.0.0.1',()=>{
  const url=`http://127.0.0.1:${port}${prefix}`;
  console.log(`Présentation LN-IA : ${url}\nGardez cette fenêtre ouverte. Ctrl+C pour arrêter.`);
  if (args.includes('--open')) {
    const command=process.platform==='win32'?'cmd':process.platform==='darwin'?'open':'xdg-open';
    const params=process.platform==='win32'?['/c','start','',url]:[url];
    const child=spawn(command,params,{stdio:'ignore'});
    child.on('error',()=>console.log('Ouvrez cette adresse dans votre navigateur.'));
  }
});
