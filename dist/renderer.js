const backgrounds={};
for(const kind of ['saju','pair']){backgrounds[kind]=new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('배경을 불러오지 못했어요. 새로고침 후 다시 시도해주세요.'));i.src=`assets/${kind}.png`;});backgrounds[kind].catch(()=>{});}
function lines(ctx,text,width){const out=[];let line='';for(const word of text.split(/\s+/)){const candidate=line?line+' '+word:word;if(ctx.measureText(candidate).width<=width){line=candidate;continue;}if(line){out.push(line);line='';}for(const ch of Array.from(word)){if(ctx.measureText(line+ch).width>width&&line){out.push(line);line=ch;}else line+=ch;}}if(line)out.push(line);return out;}
function emphasis(text,summary=false){if(summary)return{lead:text,body:''};const m=text.match(/^.*?[.!?](?:\s|$)/);return m?{lead:m[0].trim(),body:text.slice(m[0].length).trim()}:{lead:text,body:''};}
function richLayout(ctx,paragraphs,size){return paragraphs.map((text,index)=>{const summary=index===paragraphs.length-1;const part=emphasis(text,summary),runs=[{text:part.lead,size:size*(summary?1.24:1.16),bold:true},{text:part.body?' '+part.body:'',size,bold:false}];const rows=[];let row={tokens:[],width:0,height:0};for(const run of runs){ctx.font=`${run.bold?'700':'400'} ${run.size}px "Nanum Myeongjo", serif`;for(const word of run.text.match(/\S+\s*|\s+/g)||[]){const width=ctx.measureText(word).width;if(row.width+width>900&&row.tokens.length){rows.push(row);row={tokens:[],width:0,height:0};}row.tokens.push({...run,text:word,x:row.width});row.width+=width;row.height=Math.max(row.height,run.size*1.45);}}if(row.tokens.length)rows.push(row);return{rows,summary,height:rows.reduce((n,r)=>n+r.height,0)};});}
async function card(result,kind){
 const text=result.kind+result.name+result.title+result.tag+result.paragraphs.join('')+'우리 아이 사주 재미로 읽는 인연 이야기';
 await document.fonts.load('700 32px "Nanum Myeongjo"',text);await document.fonts.load('32px "Nanum Myeongjo"',text);await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');ctx.drawImage(await backgrounds[kind],0,0,1080,1350);
 ctx.fillStyle='#824738';ctx.font='700 30px "Nanum Myeongjo", serif';ctx.fillText(result.kind,88,104);
 ctx.fillStyle='#756c61';ctx.font='25px "Nanum Myeongjo", serif';ctx.fillText(result.name,88,156);
 ctx.fillStyle='#302d29';ctx.font='700 52px "Nanum Myeongjo", serif';const titleLines=lines(ctx,result.title,900);titleLines.forEach((s,i)=>ctx.fillText(s,88,225+i*64));
 const tagY=225+(titleLines.length-1)*64+56;ctx.fillStyle='#824738';ctx.font='25px "Nanum Myeongjo", serif';ctx.fillText(result.tag,88,tagY);
 ctx.strokeStyle='#cfc4b5';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(88,tagY+30);ctx.lineTo(990,tagY+30);ctx.stroke();
 const start=tagY+79;let size=34,layout,total;
 do{layout=richLayout(ctx,result.paragraphs,size);total=layout.reduce((n,p)=>n+p.height+18,0)-18;if(start+total<925||size<=19)break;size--;}while(size>=19);
 if(start+total>=925)throw Error('풀이가 이미지 공간을 넘었어요. 다시 시도해주세요.');
 let y=start;for(const p of layout){ctx.fillStyle=p.summary?'#824738':'#302d29';for(const row of p.rows){for(const t of row.tokens){ctx.font=`${t.bold?'700':'400'} ${t.size}px "Nanum Myeongjo", serif`;ctx.fillText(t.text,88+t.x,y);if(t.bold){ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=0.45;ctx.strokeText(t.text,88+t.x,y);}}y+=row.height;}y+=18;}
 ctx.font='20px "Nanum Myeongjo", serif';ctx.fillStyle='#746c61';ctx.fillText('우리 아이 사주 · 재미로 읽는 인연 이야기',88,1286);
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('이미지를 만들지 못했어요.')),'image/png'));
 return{blob,url:URL.createObjectURL(blob),kind,result};
}

window.FortuneRenderer={card,lines,emphasis,richLayout};
