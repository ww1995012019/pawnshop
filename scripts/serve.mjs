import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.cwd(),'dist');
const port=Number(process.env.PORT||4174);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.wav':'audio/wav','.map':'application/json'};
createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    let p=resolve(root,'.'+decodeURIComponent(url.pathname));
    if(p!==root&&!p.startsWith(root+sep)){res.writeHead(403);res.end();return;}
    if((await stat(p)).isDirectory())p=resolve(p,'index.html');
    const body=await readFile(p);res.writeHead(200,{'Content-Type':types[extname(p)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'0.0.0.0',()=>console.log(`Creator Web preview http://localhost:${port}`));
