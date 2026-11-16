// Run before every push:  node release.js
// Stamps a new version number into version.json and into every page, so devices that
// saved an older copy notice the change and reload themselves instead of showing stale files.
const fs = require('fs'), path = require('path');
const v = Date.now().toString(36);
const pages = [['index.html', './'], ['pirates/index.html', '../'], ['space/index.html', '../'], ['ghostbound/index.html', '../'], ['lizzy/index.html', '../']];
const snippet = base => `<script data-arcade-version>window.AV='${v}';fetch('${base}version.json?'+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(j=>{if(j.v&&j.v!==AV){const u=new URL(location.href);if(u.searchParams.get('v')!==j.v){u.searchParams.set('v',j.v);location.replace(u)}}}).catch(()=>{});if('serviceWorker'in navigator)navigator.serviceWorker.register('${base}sw.js').catch(()=>{});try{if(localStorage.getItem('arcade-wand')!=='0')document.documentElement.classList.add('wand')}catch(e){}</script>`;
// installable app: icon, colours and the offline cache (sw.js) are wired into every page
const pwa = base => `<link data-pwa rel="manifest" href="${base}manifest.webmanifest">\n<meta data-pwa name="theme-color" content="#1a1030">\n<meta data-pwa name="mobile-web-app-capable" content="yes">\n<meta data-pwa name="apple-mobile-web-app-capable" content="yes">\n<meta data-pwa name="apple-mobile-web-app-title" content="Pixel Arcade">\n<link data-pwa rel="apple-touch-icon" href="${base}icons/apple-180.png">
<link data-pwa rel="stylesheet" href="${base}shared/wand.css?v=${v}">`;
for (const [file, base] of pages) {
  const f = path.join(__dirname, file);
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace(/\n?<script data-arcade-version>[\s\S]*?<\/script>/, '');
  s = s.replace(/\n?<(?:link|meta) data-pwa[^>]*>/g, '');
  s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + snippet(base) + '\n' + pwa(base));
  s = s.replace(/((?:shared\/arcade\.(?:css|js))|(?:"(?:data|extras)\.js))(\?v=[a-z0-9]+)?/g, (m, a) => a + '?v=' + v);
  fs.writeFileSync(f, s);
}
fs.writeFileSync(path.join(__dirname, 'version.json'), JSON.stringify({ v }) + '\n');
console.log('version', v);
