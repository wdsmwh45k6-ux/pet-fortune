const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const E=require('./dist/engine.js');
const {createCanvas,Image,GlobalFonts}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/@napi-rs/canvas');
GlobalFonts.registerFromPath(__dirname+'/dist/fonts/files/nanum-myeongjo-korean-400-normal.woff2','Nanum Myeongjo');
const document={fonts:{load:async()=>{},ready:Promise.resolve()},createElement(){const c=createCanvas(1080,1350);c.toBlob=fn=>fn(new Blob(['layout-checked']));return c;}};
const context=vm.createContext({document,window:{},Image,Blob,URL,console});
process.chdir(__dirname+'/dist');vm.runInContext(fs.readFileSync('renderer.js','utf8'),context);
(async()=>{let count=0;for(let i=0;i<365;i++){const date=new Date(Date.UTC(2021,0,i+1)).toISOString().slice(0,10),p=E.pet({date});for(const [sample,kind] of [[p,'saju'],[E.pair(p,'1986-04-13'),'pair'],[E.friends({date},{date:'2020-04-01'}),'saju']]){context.sample=sample;context.kind=kind;const r=await vm.runInContext('card(sample,kind)',context);assert(r.blob);URL.revokeObjectURL(r.url);count++;}}console.log(JSON.stringify({cards:count,overflow:'none'}));})().catch(e=>{console.error(e);process.exitCode=1;});
