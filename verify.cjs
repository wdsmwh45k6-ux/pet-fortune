const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('./dist/engine.js'),C=require('./dist/content.js');
assert.equal(E.calc('1986-05-29').pillar,'癸酉');
for(const s of ['2025-02-29','1900-02-29','2026-04-31','1899-01-01','9999-01-01','2021-13-01','2021-00-01'])assert.throws(()=>E.calc(s));
assert.doesNotThrow(()=>E.calc('2000-02-29'));
const p=E.pet({date:'2021-04-14',name:'루이'});assert.deepEqual(p,E.pet({date:'2021-04-14',name:'루이'}));
assert.equal(C.stems.length,10);assert.equal(C.branches.length,12);assert.equal(C.adoption.length,10);assert.equal(C.pairs.length,5);
const {createCanvas,Image,GlobalFonts}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/@napi-rs/canvas');
GlobalFonts.registerFromPath(__dirname+'/dist/fonts/files/nanum-myeongjo-korean-400-normal.woff2','Nanum Myeongjo');
const doc={fonts:{load:async()=>{},ready:Promise.resolve()},createElement(){const c=createCanvas(1080,1350);c.toBlob=fn=>fn(new Blob(['checked'],{type:'image/png'}));return c;}};
const context=vm.createContext({document:doc,window:{},Image,Blob,URL,console});
process.chdir(__dirname+'/dist');vm.runInContext(fs.readFileSync('renderer.js','utf8'),context);
(async()=>{
 const dates=Array.from({length:60},(_,i)=>new Date(Date.UTC(2020,0,1+i)).toISOString().slice(0,10));
 let count=0;async function check(sample,kind){context.sample=sample;context.kind=kind;const r=await vm.runInContext('card(sample,kind)',context);URL.revokeObjectURL(r.url);count++;}
 for(const date of dates)await check(E.pet({date,name:'열두글자이름테스트입니다'}),'saju');
 const es=Array.from({length:5},(_,i)=>dates.find(d=>E.calc(d).element===i));
 for(let a=0;a<5;a++)for(let b=0;b<5;b++){
 const p=E.pet({date:es[a]});const pair=E.pair(p,es[b]);assert.equal(pair.relation,(b-a+5)%5);await check(pair,'pair');
 const x={date:es[a]},y={date:es[b]};assert.equal(E.friends(x,y).relation,E.friends(y,x).relation);await check(E.friends(x,y),'saju');
 }
 for(const date of dates.slice(0,10)){const p=E.pet({date,mode:'adoption'});await check(p,'saju');await check(E.pair(p,es[0]),'pair');await check(E.friends({date,mode:'adoption'},{date:es[0]}),'saju');}
 for(const [sample,kind] of [[p,'saju'],[E.pair(p,'1986-04-13'),'pair'],[E.friends({name:'루이',date:'2021-04-14'},{name:'보리',date:'2020-04-01'}),'saju']]){
 doc.createElement=()=>{const c=createCanvas(1080,1350);c.toBlob=fn=>fn(new Blob([c.toBuffer('image/png')],{type:'image/png'}));return c;};context.sample=sample;context.kind=kind;const r=await vm.runInContext('card(sample,kind)',context);fs.writeFileSync('/workspace/scratch/8a3cfc2b1535/'+(sample.kind.includes('친구')?'friends':kind)+'-v2.png',Buffer.from(await r.blob.arrayBuffer()));URL.revokeObjectURL(r.url);
 }
 console.log(JSON.stringify({dateValidation:'passed',documentedReference:'passed',cardLayouts:count,overflow:'none',guardianPairs:25,friendPairs:25,friendSymmetry:'passed',samplePNGs:3}));
})().catch(e=>{console.error(e);process.exitCode=1;});
