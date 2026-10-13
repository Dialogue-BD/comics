import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
const result=await build({entryPoints:['src/entry.jsx'],bundle:true,minify:true,format:'iife',globalName:'DesignLanding',target:['es2020'],jsx:'automatic',outfile:'dist/entry.js',legalComments:'inline',define:{'process.env.NODE_ENV':'"production"'},metafile:true});
await writeFile('dist/meta.json',JSON.stringify(result.metafile,null,2));
const names=['react','react-dom','scheduler','lenis','gsap','@gsap/react'];let notices='Bundled libraries for Dialogue Design\n\n';
for(const name of names){const p=JSON.parse(await readFile(`node_modules/${name}/package.json`));notices+=`${name} ${p.version}\n`;for(const f of ['LICENSE','LICENSE.txt','LICENSE.md','license.txt']){try{notices+=await readFile(`node_modules/${name}/${f}`,'utf8');break}catch{}}notices+='\n\n';}
notices+=await readFile('vendor/REACT-BITS-LICENSE.md','utf8');await writeFile('dist/THIRD-PARTY-NOTICES.txt',notices);
console.log('Built the self-contained entry UI bundle.');
