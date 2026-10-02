(function(root){
const L=typeof module!=='undefined'?require('./vendor/lunar.js'):root;
const C=typeof module!=='undefined'?require('./content.js'):root.FortuneContent;
const V=typeof module!=='undefined'?require('./variety.js'):root.FortuneVariety;
const elementName=['목','화','토','금','수'];
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function parseDate(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))throw Error('날짜를 정확히 입력해주세요.');const [y,m,d]=s.split('-').map(Number);const dt=new Date(Date.UTC(y,m-1,d));if(y<1900||s>today()||dt.getUTCFullYear()!==y||dt.getUTCMonth()+1!==m||dt.getUTCDate()!==d)throw Error('1900년부터 오늘까지의 실제 날짜를 입력해주세요.');return [y,m,d];}
const ganKo=['갑','을','병','정','무','기','경','신','임','계'],zhiKo=['자','축','인','묘','진','사','오','미','신','유','술','해'];
function pillarKo(value){return ganKo['甲乙丙丁戊己庚辛壬癸'.indexOf(value[0])]+zhiKo['子丑寅卯辰巳午未申酉戌亥'.indexOf(value[1])];}
function calc(s){const a=parseDate(s),l=L.Solar.fromYmd(...a).getLunar();
 const table=l.getJieQiTable(),keys=l.getJieQiList();
 // Astronomical term times are UTC+8; use fixed KST (UTC+9), without inventing a birth hour.
 const terms=keys.filter((_,i)=>i%2===0).map(key=>({key,solar:table[key],kst:table[key].nextHour(1)})).filter(t=>t.kst.toYmd()<=s).sort((a,b)=>a.kst.toYmdHms().localeCompare(b.kst.toYmdHms()));
 const term=terms[terms.length-1];if(!term)throw Error('절기 정보를 확인하지 못했어요.');
 // Read the pillars just after the latest applicable term, not at an assumed birth time.
 const after=term.solar.nextHour(1).getLunar(),yearPillar=after.getYearInGanZhiExact(),monthPillar=after.getMonthInGanZhiExact();
 const stem=l.getDayGanIndex(),branch=l.getDayZhiIndex(),pillar=l.getDayInGanZhi();
 return{stem,branch,element:Math.floor(stem/2),pillar,label:C.stems[stem][0],yearPillar,monthPillar,yearLabel:pillarKo(yearPillar),monthLabel:pillarKo(monthPillar),dayLabel:pillarKo(pillar),termBoundary:term.kst.toYmd()===s,termDate:term.kst.toYmd()};}
function pet({name,date,mode='birth'}){if(!['birth','adoption'].includes(mode))throw Error('날짜 종류를 확인해주세요.');mode='birth';name=(name||'우리 아이').trim();if(!name||Array.from(name).length>12||/[\u0000-\u001f\u007f]/.test(name))throw Error('이름은 1~12자로 입력해주세요.');const p=calc(date),s=C.stems[p.stem],ad=mode==='adoption';return{name,date,mode,calc:p,kind:ad?'함께 시작한 인연':'우리 아이 사주',title:ad?C.adoption[p.stem][0]:s[2],tag:ad?'함께한 날에 담긴 이야기':`${s[0]} · ${elementName[p.element]}의 기운`,paragraphs:ad?[C.adoption[p.stem][1],'이 풀이는 입양일에 의미를 담은 이야기이며, 아이의 타고난 성격을 판단하지 않습니다. 익숙해지는 속도를 존중하고 작은 일상을 함께 쌓아가세요.','집에 온 것은 작은 아이인데, 바뀌는 것은 집안 전체일지도 모릅니다.']:[s[3],C.branches[p.branch],s[4],s[5]]};}
function pair(p,date){const owner=calc(date);const delta=(owner.element-p.calc.element+5)%5, a=C.pairs[delta];const ad=p.mode==='adoption';return{kind:ad?'보호자와 인연 풀이':'보호자와 궁합',name:p.name,title:a[0],tag:`${elementName[p.calc.element]} · ${elementName[owner.element]}의 만남`,paragraphs:ad?[`함께 시작한 날과 보호자의 생일에 담긴 오행을 소재로 읽는 인연 이야기입니다. ${['닮은 리듬 속에서 편안함을 찾는 만남입니다.','일상에 온기와 활기를 더하는 만남입니다.','다른 속도를 이해하며 가까워지는 만남입니다.','기다림과 배려로 믿음을 쌓는 만남입니다.','보살핌 속에서 서로의 자리가 깊어지는 만남입니다.'][delta]}`,a[2],a[3]]:[a[1],a[2],a[3]],relation:delta};}
const branchNames=['자','축','인','묘','진','사','오','미','신','유','술','해'];
function basis(p){return `${p.yearLabel}년 · ${p.monthLabel}월 · ${p.dayLabel}일, ${p.label} 일간 · ${branchNames[p.branch]} 일지 · ${elementName[p.element]}의 기운`;}
// Names and input order never seed the editorial variations.
function hash(text){let h=2166136261;for(const ch of text){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;return h>>>0;}
function pick(list,seed,slot){return list[hash(seed+'|'+slot)%list.length];}
function short(text){return text.match(/[^.!?]+[.!?]+/g)?.slice(0,2).join('').trim()||text;}
const qualities=['자기 뜻이 단단하고','다정하게 호흡을 맞추고','기쁨을 아낌없이 표현하고','가까운 마음을 오래 품고','제 속도를 차분히 지키고','작은 일상을 살뜰히 기억하고','취향과 약속이 분명하고','작은 차이를 섬세히 알아보고','호기심을 따라 길을 찾고','말 없는 기척까지 살피고'];
const bonds=['짧은 눈맞춤에도 정을 나누는 아이','익숙한 곁을 오래 지키는 아이','함께하는 경험에서 용기를 얻는 아이','부드러운 응답에 마음을 여는 아이','내 사람의 반응을 귀하게 여기는 아이','알아갈수록 애정이 깊어지는 아이','즐거운 순간을 함께 나누는 아이','나란히 쉬는 시간을 사랑하는 아이','주고받는 놀이에 마음이 자라는 아이','우리끼리의 신호를 간직하는 아이','내 편에게 꾸준한 정을 주는 아이','편안한 쉼을 함께 나누는 아이'];
function fullPet(input){const p=pet(input),t=C.profiles[p.calc.stem];p.kind='우리 강아지 사주 한 장 요약';p.title=C.stems[p.calc.stem][2];
 const n=V.stemScenes[p.calc.stem],seed=input.date+'|'+p.tag;
 p.paragraphs=[pick([short(t[0]),n[0],short(C.stems[p.calc.stem][3])],seed,'core'),pick([short(t[1]),n[1],short(C.details[p.calc.stem]),n[3]],seed,'play'),pick([short(t[2]),n[2]],seed,'affection'),pick([C.memoryTraits[p.calc.stem],n[4]],seed,'memory'),pick(['정을 나누는 방식이 있어요. '+C.branches[p.calc.branch],V.branchScenes[p.calc.branch]],seed,'bond'),pick([short(C.careDetails[p.calc.stem]),n[5]],seed,'care')];
 p.paragraphs.push('한 줄 요약. '+pick([t[3].replace(/^한 줄로, /,''),qualities[p.calc.stem]+' '+bonds[p.calc.branch]+'.'],seed,'summary'));
 const [y,m,d]=input.date.split('-').map(Number);p.dateLine=`${y}년 ${m}월 ${d}일`;
 p.tag=`${p.calc.yearLabel}년 · ${p.calc.monthLabel}월 · ${p.calc.dayLabel}일`;
 p.explanation=`${basis(p.calc)}을 바탕으로 기질과 애정 표현을 읽습니다. 연주·월주는 절기 기준으로 계산해 함께 표시하며, 현재 성격 문장은 일간·일지를 중심으로 조합합니다. 연주는 입춘, 월주는 12절의 한국 시간 날짜 0시부터 바뀌는 간단 기준입니다. 출생시간과 시주는 사용하지 않습니다.${p.calc.termBoundary?' 입력한 날은 절입일이라 실제 태어난 시각에 따라 연주 또는 월주가 달라질 수 있습니다.':''}`;return p;}
function fullPair(p,date){const q=pair(p,date),o=calc(date);const story=C.directStories[q.relation],seed=p.date+'|'+date,n=V.stemScenes[p.calc.stem];q.paragraphs=[pick([C.compactPairIntro[q.relation],story[0],C.pairs[q.relation][1]],seed,'intro'),V.ordered[p.calc.element][o.element],pick([V.ownerScenes[o.stem],`보호자는 ${C.ownerTraits[o.stem]}이에요. 아이의 작은 반응을 알아가며 둘만의 생활을 만들어가는 관계예요.`],seed,'owner'),short(pick([n[2],C.profiles[p.calc.stem][2],n[4]],seed,'pet'))+' '+V.branchScenes[p.calc.branch].split('. ')[1]+'.',pick([C.compactPairSoft[q.relation],C.ownerDetails[q.relation],C.pairs[q.relation][3],n[5]],seed,'together'),pick([story[story.length-1].replace('한 줄로,','한마디로,'),`한마디로, ${qualities[p.calc.stem]} ${bonds[p.calc.branch].replace(/ 아이$/,' 아이와')} 서로의 하루를 알아가는 궁합.`],seed,'summary')];q.explanation=`${p.mode==='adoption'?'함께한 날':'아이'}: ${basis(p.calc)}. 보호자: ${basis(o)}. ${['같은 오행이 만나는 관계','아이의 기운이 보호자의 기운을 생하는 관계','아이의 기운이 보호자의 기운을 극하는 관계','보호자의 기운이 아이의 기운을 극하는 관계','보호자의 기운이 아이의 기운을 생하는 관계'][q.relation]}로 읽었습니다. 생은 북돋움, 극은 조율의 상징이며 좋은 관계와 나쁜 관계를 판정하는 점수는 아닙니다.`;return q;}
function friendPair(first,second){const a=pet(first),b=pet(second);const d=(b.calc.element-a.calc.element+5)%5,type=d===0?0:(d===1||d===4)?1:2;const f=C.friends[type],seed=[a.date,b.date].sort().join('|'),low=Math.min(a.calc.element,b.calc.element),high=Math.max(a.calc.element,b.calc.element);
 const intro=['닮은 기운으로 서로의 리듬을 알아가는 친구예요. 같은 것을 좋아해도 즐기는 방법까지 같을 필요는 없어요.','서로 다른 기운이 이어지는 상생 인연이에요. 각자가 발견한 즐거움이 다른 아이에게도 새 경험이 될 수 있어요.','다른 기준을 이해하며 가까워지는 인연이에요. 상극은 나쁜 친구라는 뜻이 아니라 서로의 속도를 조율하는 상징으로 읽어요.'];
 const describe=p=>short(pick([V.stemScenes[p.calc.stem][0],C.profiles[p.calc.stem][0],V.stemScenes[p.calc.stem][1]],seed+'|'+p.date,'portrait'))+' '+V.branchScenes[p.calc.branch].split('. ')[1]+'.';
 return{kind:'강아지 친구와 궁합',name:`${a.name} · ${b.name}`,title:f[0],tag:`${elementName[a.calc.element]} · ${elementName[b.calc.element]}의 만남`,paragraphs:[pick([intro[type],f[1].split('. ').slice(0,2).join('. ')+'.'],seed,'intro'),V.friendScenes[low][high],'첫 번째 아이 — '+describe(a),'두 번째 아이 — '+describe(b),pick([f[2],f[3]],seed,'together'),pick([['한 줄로, 닮은 발걸음으로 각자의 하루에 편안히 머무는 친구.','한 줄로, 서로 다른 호기심을 나누며 함께할 세상을 넓히는 친구.','한 줄로, 같은 속도를 강요하지 않을 때 서로를 더 깊이 알아가는 친구.'][type],`한 줄로, ${[elementName[low],elementName[high]].join('·')}의 기운이 만나 각자의 취향을 알아가는 산책 친구.`],seed,'summary')],explanation:`첫 번째 아이: ${basis(a.calc)}. 두 번째 아이: ${basis(b.calc)}. ${type===0?'같은 오행':type===1?'상생':'상극'}의 관계로 풀이합니다. 입력 순서를 바꾸어도 관계 유형과 공통 이야기는 같습니다. 이 풀이는 합사나 만남의 안전성을 판단하는 기준이 아닙니다.`,relation:type};}
const api={today,parseDate,calc,pet:fullPet,pair:fullPair,friends:friendPair};root.FortuneEngine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
