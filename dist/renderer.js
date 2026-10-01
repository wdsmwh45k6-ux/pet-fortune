const backgrounds={};
for(const kind of ['saju','pair']){backgrounds[kind]=new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('배경을 불러오지 못했어요. 새로고침 후 다시 시도해주세요.'));i.src=`assets/${kind}.png`;});backgrounds[kind].catch(()=>{});}
function lines(ctx,text,width){const out=[];let line='';for(const word of text.split(/\s+/)){const candidate=line?line+' '+word:word;if(ctx.measureText(candidate).width<=width){line=candidate;continue;}if(line){out.push(line);line='';}for(const ch of Array.from(word)){if(ctx.measureText(line+ch).width>width&&line){out.push(line);line=ch;}else line+=ch;}}if(line)out.push(line);return out;}
async function card(result,kind){
 const text=result.kind+result.name+result.title+result.tag+result.paragraphs.join('')+'우리 아이 사주 재미로 읽는 인연 이야기';
 await document.fonts.load('32px "Nanum Myeongjo"',text);await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');ctx.drawImage(await backgrounds[kind],0,0,1080,1350);
 ctx.fillStyle='#824738';ctx.font='25px "Nanum Myeongjo", serif';ctx.fillText(result.kind,88,104);
 ctx.fillStyle='#756c61';ctx.font='25px "Nanum Myeongjo", serif';ctx.fillText(result.name,88,156);
 ctx.fillStyle='#302d29';ctx.font='46px "Nanum Myeongjo", serif';const titleLines=lines(ctx,result.title,900);titleLines.forEach((s,i)=>ctx.fillText(s,88,225+i*64));
 const tagY=225+(titleLines.length-1)*64+56;ctx.fillStyle='#824738';ctx.font='25px "Nanum Myeongjo", serif';ctx.fillText(result.tag,88,tagY);
 ctx.strokeStyle='#cfc4b5';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(88,tagY+30);ctx.lineTo(990,tagY+30);ctx.stroke();
 const start=tagY+83;let size=36,wrapped,total;
 do{ctx.font=`${size}px "Nanum Myeongjo", serif`;wrapped=result.paragraphs.map(p=>lines(ctx,p,900));total=wrapped.reduce((n,a)=>n+a.length*size*1.52+22,0)-22;if(start+total<930||size<=22)break;size--;}while(size>=22);
 if(start+total>=930)throw Error('풀이가 이미지 공간을 넘었어요. 이름을 짧게 바꿔 다시 시도해주세요.');
 let y=start;wrapped.forEach((p,index)=>{ctx.fillStyle=index===wrapped.length-1?'#824738':'#302d29';for(const line of p){ctx.fillText(line,88,y);y+=size*1.52;}y+=22;});
 ctx.font='20px "Nanum Myeongjo", serif';ctx.fillStyle='#746c61';ctx.fillText('우리 아이 사주 · 재미로 읽는 인연 이야기',88,1286);
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('이미지를 만들지 못했어요.')),'image/png'));
 return{blob,url:URL.createObjectURL(blob),kind,result};
}

window.FortuneRenderer={card,lines};
