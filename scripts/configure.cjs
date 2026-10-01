const fs=require('node:fs');
const key=process.env.KAKAO_JAVASCRIPT_KEY||'';
if(key&&!/^[a-f0-9]{32}$/i.test(key))throw Error('KAKAO_JAVASCRIPT_KEY must be a public JavaScript app key, not an admin key');
fs.writeFileSync('dist/config.js','window.AppConfig='+JSON.stringify({kakaoJavascriptKey:key})+';\n');
const origin=process.env.SITE_URL||process.env.RENDER_EXTERNAL_URL;
if(origin){const url=new URL(origin);if(url.protocol!=='https:')throw Error('SITE_URL must use HTTPS');const base=url.origin;const routes=['/','/about/','/guide/','/privacy/','/contact/','/journal/','/journal/reading-a-fortune/','/journal/adoption-day/','/journal/friendship/'];fs.writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(r=>'<url><loc>'+base+r+'</loc></url>').join('')+'</urlset>');fs.writeFileSync('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: '+base+'/sitemap.xml\n');}else fs.writeFileSync('dist/robots.txt','User-agent: *\nAllow: /\n');
console.log('Static configuration ready. Ads disabled.');
