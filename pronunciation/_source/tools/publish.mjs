// Copy the fresh build (dist/) up into the served folder: ../index.html and ../assets/.
// Audio stays in ../audio and is never touched.
import fs from 'fs';
import path from 'path';
const dist = path.resolve('dist');
const site = path.resolve('..');
fs.copyFileSync(path.join(dist, 'index.html'), path.join(site, 'index.html'));
fs.mkdirSync(path.join(site, 'assets'), { recursive: true });
for (const f of fs.readdirSync(path.join(dist, 'assets'))) {
  fs.copyFileSync(path.join(dist, 'assets', f), path.join(site, 'assets', f));
}
console.log('Published dist/ → ../index.html and ../assets/');
