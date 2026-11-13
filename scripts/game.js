/* safety net: never let a 0-size canvas crash drawing */
(function(){const D=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(im){try{if(im&&((im.width===0)||(im.height===0)||(im.videoWidth===0&&im.tagName==='VIDEO')))return;return D.apply(this,arguments)}catch(e){if(e&&e.name==='InvalidStateError')return;throw e}}})();
'use strict';
/* ============ utilities ============ */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t;
const rnd=(a,b)=>a+Math.random()*(b-a), rint=(a,b)=>Math.floor(rnd(a,b+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const fmt=n=>Math.floor(n).toLocaleString('en-US');
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const weekKey=()=>{const d=new Date();const j=new Date(d.getFullYear(),0,1);return d.getFullYear()+'-W'+Math.floor(((d-j)/864e5+j.getDay())/7)};
function seeded(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return()=>{h+=0x6D2B79F5;let t=Math.imul(h^h>>>15,1|h);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296}}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function mk(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}

/* ============ icons ============ */
const P={menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',paw:'<circle cx="7" cy="10" r="1.8"/><circle cx="12" cy="6.5" r="1.8"/><circle cx="17" cy="10" r="1.8"/><path d="M12 12.5c-3 0-5 2.8-5 5 0 1.8 2 2.5 5 2.5s5-.7 5-2.5c0-2.2-2-5-5-5z"/>',
quest:'<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>',up:'<path d="M12 20V6M6 12l6-6 6 6"/>',map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
shop:'<path d="M4 9h16l-1 11H5z"/><path d="M8 9V7a4 4 0 018 0v2"/>',music:'<path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
check:'<path d="M5 12l5 5 9-10"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',gift:'<rect x="4" y="10" width="16" height="10"/><rect x="3" y="7" width="18" height="3"/><path d="M12 7v13M12 7c-3-4-6-1-4 0M12 7c3-4 6-1 4 0"/>',
home:'<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',bag:'<path d="M6 8h12l1 13H5z"/><path d="M9 8V6a3 3 0 016 0v2"/>',trophy:'<path d="M7 4h10v5a5 5 0 01-10 0z"/><path d="M7 6H4v2a3 3 0 003 3M17 6h3v2a3 3 0 01-3 3M12 14v4M8 21h8"/>',
hanger:'<path d="M12 8a2.5 2.5 0 10-2.5-2.5M12 8v2l9 6a1 1 0 01-.6 1.8H3.6A1 1 0 013 16l9-6"/>',chev:'<path d="M9 6l6 6-6 6"/>',prev:'<path d="M5 5v14M7 12l10-7v14z"/>',next:'<path d="M19 5v14M17 12L7 5v14z"/>',
shuffle:'<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',repeat:'<path d="M4 11V9a3 3 0 013-3h12l-3-3M20 13v2a3 3 0 01-3 3H5l3 3"/>',vol:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 010 6"/>',swap:'<path d="M7 7h12l-3-3M17 17H5l3 3"/>',star:'<path d="M12 3l2.8 6 6.2.8-4.6 4.3 1.2 6.4L12 17.5 6.4 20.5l1.2-6.4L3 9.8 9.2 9z"/>',map2:'<path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',book:'<path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6M20 4v14h-6"/>',paint:'<path d="M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a4 4 0 004-4c0-5-4-10-9-10z"/>',
fs:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',heartO:'<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z"/>'};
function ico(n,extra=''){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" ${extra}>${P[n]||''}</svg>`}
const ICO={
 play:'<svg viewBox="0 0 24 24"><path d="M6 3.5l15 8.5-15 8.5z" fill="#fff"/></svg>',
 pause:'<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4.5" height="16" rx="1.5" fill="#fff"/><rect x="13.5" y="4" width="4.5" height="16" rx="1.5" fill="#fff"/></svg>',
 coin:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffc94a" stroke="#a8620a" stroke-width="1.6"/><circle cx="12" cy="12" r="6.4" fill="none" stroke="#e08a12" stroke-width="1.6"/><path d="M12 8v8M9.6 10c0-1.3 4.8-1.3 4.8 0s-4.8 1.3-4.8 3 4.8 1.7 4.8 0" fill="none" stroke="#a8620a" stroke-width="1.3" stroke-linecap="round"/></svg>',
 gem:'<svg viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 12L2 9z" fill="#5ee0ff" stroke="#1b6fa8" stroke-width="1.5" stroke-linejoin="round"/><path d="M2 9h20M9 3l-2 6 5 12 5-12-2-6" fill="none" stroke="#1b6fa8" stroke-width="1.2"/></svg>',
 tix:'<svg viewBox="0 0 24 24"><path d="M3 7h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4z" fill="#ff5d73" stroke="#8a1228" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 7v10" stroke="#fff" stroke-width="1.5" stroke-dasharray="2 2"/></svg>',
 heart:'<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z" fill="#ff4f6d" stroke="#7a0f26" stroke-width="1.5"/></svg>',
 heartX:'<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/></svg>',
 frag:'<svg viewBox="0 0 24 24"><path d="M3 5l6-2 6 2 6-2v15l-6 2-6-2-6 2z" fill="#e9d6a0" stroke="#8a6a24" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 11l3 3 5-6" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/></svg>'
};

/* ============ game data ============ */
const TRACKS=[
 {id:0,title:'1990',tag:'Street beat',src:'assets/1990.mp3'},
 {id:1,title:'Welcome2DTQ',tag:'Hip-hop',src:'assets/welcome2dtq.mp3'},
 {id:2,title:'Para sa Streets',tag:'Filipino street beat',src:'assets/para-sa-streets.mp3'},
 {id:3,title:'Matikas',tag:'Upbeat',src:'assets/matikas.mp3'},
 {id:4,title:'Buenos Dias (feat. Fern.)',tag:'Uncle Dags',src:'assets/buenos-dias.mp3'},
 {id:5,title:'WENG-WENG (feat. Gaspari)',tag:'Uncle Dags',src:'assets/weng-weng.mp3'},
 {id:6,title:'Pwede Bang?',tag:'Hev Abi',src:'assets/pwede-bang.mp3'},
 {id:7,title:'Iced Coffee o Mango Shake',tag:'Hev Abi',src:'assets/iced-coffee.mp3'}];
const embSrc=p=>(window.EMB&&window.EMB[p])||p;
function playGhost(v){try{const a=new Audio(embSrc('assets/ghost.mp3'));a.volume=Math.max(0,Math.min(1,(S.st.sfx==null?.7:S.st.sfx)*(v==null?.6:v)));a.play().catch(()=>{})}catch(e){}}
const SECRET_AUDIO={biringan:'assets/secret-worlds/biringan.mp3',balete:'assets/secret-worlds/balete.mp3',mansion:'assets/secret-worlds/mansion.mp3',kapre:'assets/secret-worlds/kapre.mp3'};
let activeSecretAudio=null;
function stopSecretAudio(){const a=activeSecretAudio;activeSecretAudio=null;if(a){a.pause();a.currentTime=0}}
function playSecretAudio(id,v=.55){const src=SECRET_AUDIO[id];if(!src)throw new Error('No secret-map audio configured for '+id);stopSecretAudio();const a=new Audio(src);a.volume=Math.max(0,Math.min(1,(S.st.sfx==null?.8:S.st.sfx)*v));activeSecretAudio=a;a.addEventListener('ended',()=>{if(activeSecretAudio===a)activeSecretAudio=null},{once:true});a.play().catch(e=>{if(activeSecretAudio===a)activeSecretAudio=null;console.warn('Unable to play secret-map audio for '+id,e)})}
const PETS=[
 {id:'aurum',name:'Aurum',title:'Golden Alchemist',rar:'Special',price:2500,c1:'#ffc94a',c2:'#fff1b0',kind:'fox',pers:'Calm, clever, and fascinated by shiny treasures.',ab:'Midas Touch',abd:'Coins turn to gold and every coin is worth triple. The money maker.',evo:'Midas Monarch',dur:7},
 {id:'choco',name:'Choco',title:'Inferno Beast',rar:'Special',price:3000,c1:'#7a4a2c',c2:'#ff7a2a',kind:'dragon',pers:'Bold, adventurous, and energetic.',ab:'Dragon Rampage',abd:'Becomes a dragon: burns through obstacles, sweeps up what is in reach, and you cannot be hurt while it lasts. The bodyguard.',evo:'Inferno Overlord',dur:4},
 {id:'yuki',name:'Yuki',title:'Crystal Oracle',rar:'Special',price:3500,c1:'#eaf4ff',c2:'#7fd6ff',kind:'cat',pers:'Gentle, intelligent, and mysterious.',ab:'Prism Break',abd:'Every catch splits into extra crystal coins, and you heal 1 heart. The healer.',evo:'Prism Sovereign',dur:7},
 {id:'mochi',name:'Mochi',title:'Dream Architect',rar:'Special',price:4000,c1:'#ffb3d9',c2:'#ff6fb5',kind:'bunny',pers:'Playful, imaginative, and creative.',ab:'Dream Forge',abd:'Builds a dream shield that absorbs your next three hits. The defender.',evo:'Dream Palace',dur:8},
 {id:'zumi',name:'Zumi',title:'Starfall Sovereign',rar:'Legendary',price:6000,c1:'#5a6bff',c2:'#ffe27a',kind:'drake',pers:'Elegant, powerful, mysterious, and protective.',ab:'Celestial Rain',abd:'Summons a shower of falling stars across all lanes and boosts your combo by 10. The score booster.',evo:'Eternal Starfall',dur:6},
 {id:'vexi',name:'Vexi',title:'Fate Weaver',rar:'Legendary',price:7000,c1:'#a45bff',c2:'#ff6fd0',kind:'cat2',pers:'Intelligent, mysterious, and strategic.',ab:'Thread of Fate',abd:'Links nearby items so one catch collects the whole chain and pulls items toward you. The collector.',evo:'Eternal Threads',dur:6}];
const POWERS=[
 {id:'rewind',name:'Time Rewind',price:150,dur:6,col:'#7fd6ff',desc:'Slows the world to half speed so every catch lines up.'},
 {id:'jackpot',name:'Golden Jackpot',price:200,dur:8,col:'#ffc94a',desc:'Every coin you catch is worth triple.'},
 {id:'clone',name:'Crystal Clone',price:220,dur:8,col:'#8ff0ff',desc:'Two crystal clones run in the other lanes and catch for you.'},
 {id:'prism',name:'Prism Burst',price:180,dur:0,col:'#ff9fd6',desc:'Shatters every obstacle ahead into coins.'},
 {id:'gravity',name:'Gravity Shift',price:160,dur:8,col:'#b58cff',desc:'Pulls items from every lane toward you.'},
 {id:'chain',name:'Chain Reaction',price:240,dur:8,col:'#ff8a4a',desc:'Each catch also collects the next three items ahead.'},
 {id:'portal',name:'Treasure Portal',price:260,dur:5,col:'#7b4dff',desc:'Warp into a golden tunnel. You cannot be hit and everything is treasure.'}];
const UPS=[
 {id:'catch',name:'Catching',base:200,desc:'Wider catch range for every lane.',fx:l=>`+${l*10}% catch range`},
 {id:'move',name:'Movement',base:180,desc:'Quicker lane switching and a longer slide.',fx:l=>`+${l*12}% lane speed`},
 {id:'surv',name:'Survival',base:260,desc:'Longer protection after a hit. Levels 3 and 5 add a heart.',fx:l=>`${(1.4+l*.25).toFixed(1)}s protection${l>=5?', +2 hearts':l>=3?', +1 heart':''}`},
 {id:'coin',name:'Coins & Treasures',base:240,desc:'Every coin is worth more.',fx:l=>`+${l*12}% coin value`},
 {id:'power',name:'Power-Ups',base:220,desc:'Power-ups last longer.',fx:l=>`+${l*10}% duration`},
 {id:'pet',name:'Pet Support',base:230,desc:'Pet abilities recharge faster.',fx:l=>`-${l*7}% cooldown`},
 {id:'lucky',name:'Special: Lucky Charm',base:300,desc:'Better odds for tickets and bonus chests.',fx:l=>`+${l*15}% rare drops`}];
const upCost=(u,l)=>Math.round(u.base*Math.pow(1.7,l)*(l>=5?2:1));
const DIST=[
 {id:'intramuros',name:'Intramuros',sub:'The Golden Quarter',lv:1,sky:['#1a1f5c','#7b4dc4','#ffb36b'],fog:'#3a2f7a',walls:['#d9b882','#c99a6b','#e0c896','#b98a64','#cfa97a','#d8bf9a'],trim:'#7a4a2c',roof:'#8f3b2a',lamp:'#ffd48a',acc:'#ffc94a'},
 {id:'tondo',name:'Tondo',sub:'The Bustling Streets',lv:3,sky:['#20174d','#c24d7a','#ffa45b'],fog:'#5a2a6a',walls:['#e0795a','#58b4c9','#e8c04f','#8cc7a1','#d9627d','#9a8fd8'],trim:'#5b3a2a',roof:'#6b6f8a',lamp:'#ffb86b',acc:'#ff8a4a'},
 {id:'binondo',name:"Binondo",sub:"The Merchant's Maze",lv:5,sky:['#2a0f3a','#a31f4d','#ff7a3c'],fog:'#5c1a3a',walls:['#c4302b','#e8b43a','#a82a2a','#d99a2b','#b8403a','#e6c47a'],trim:'#3a1a1a',roof:'#2a2a3a',lamp:'#ff6a4a',acc:'#ff4d4d'},
 {id:'divisoria',name:'Divisoria',sub:'The Grand Marketplace',lv:8,sky:['#10305a','#3a8fd9','#ffd27a'],fog:'#2a5a9a',walls:['#4fc3d9','#ff9fbf','#ffd35a','#8fe08f','#ff8a5a','#b59bff'],trim:'#2a3a5a',roof:'#d9573a',lamp:'#fff2a8',acc:'#5ee0ff'}];
const WORLDS=[
 {id:'manila',name:'Manila',sub:'The Golden Streets',boss:'Uncle Dags',need:'Starting world',col:'#ffc94a',desc:'Colonial stone, jeepneys, markets, and one very loud rival.',open:true},
 {id:'bohol',name:'Bohol',sub:'Enchanted Hills',boss:'Hill Colossus',need:'Defeat Uncle Dags',col:'#b6d95a',desc:'Chocolate Hills and glowing tropical forest.'},
 {id:'palawan',name:'Palawan',sub:'Crystal Paradise',boss:'Abyssal King',need:'Clear Bohol',col:'#5ee0ff',desc:'Clear water, limestone cliffs, hidden lagoons.'},
 {id:'siargao',name:'Siargao',sub:'Celestial Shores',boss:'Stormcaller',need:'Clear Palawan',col:'#7b9bff',desc:'Surf breaks, palm trees, and starlit islands.'}];
const SECRETS=[
 {id:'biringan',name:'Biringan City',sub:'The Hidden Enchanted Kingdom',boss:'The Enchanted King',need:0,col:'#c99aff',star:true,clue:'Complete Manila and beat Uncle Dags, and the lanterns light the way.',desc:'A glowing kingdom inspired by the Biringan City legend of Samar. The rarest map in the game.'},
 {id:'balete',name:'The Whispering Balete',sub:'The Forest of Secrets',boss:'The Rootbound Guardian',need:0,col:'#5be38a',clue:'Roots glow where the old tree listens.',desc:'Giant ancient balete trees, glowing roots, and foggy passages.'},
 {id:'mansion',name:'The Midnight Mansion',sub:'The House of Whispers',boss:'The Lady of Midnight',need:0,col:'#9fb4ff',clue:'One window is always lit at midnight.',desc:'Moonlit hallways and hidden rooms, inspired by White Lady stories.'},
 {id:'kapre',name:"The Kapre's Grove",sub:'The Forgotten Woodland',boss:'The Ancient Kapre',need:0,col:'#ffa24a',clue:'Follow the smoke and the giant footprints.',desc:'Massive trees and ancient woodland paths, inspired by Kapre folklore.'},];
const SCAMS=[
 {from:'PromoBlast PH',txt:'CONGRATULATIONS! You won a [[free iPhone 15]]! Click [[bit.ly/claim-prize-now]] [[within 10 minutes]] or it goes to someone else!',scam:1,why:'Prizes you never entered for are bait. The short link hides where it goes, and the countdown is there to stop you from thinking.'},
 {from:'Bank Notice',txt:'Your account is LOCKED. Verify now at [[secure-bpi-login.co]] to avoid [[permanent closure]].',scam:1,why:'Real banks do not threaten you through links. The web address is a look-alike. Open the official app or call the number on your card.'},
 {from:'Customer Care',txt:'Hi! To fix your account, please send your [[OTP]], [[full name and birthday]].',scam:1,why:'Nobody legitimate ever needs your OTP. It is the key to your account.'},
 {from:'MegaSale Shop',txt:'[[90% OFF]] everything [[today only]]! Send payment to this [[personal GCash number]] to reserve your item.',scam:1,why:'Impossible discounts, a deadline, and a personal wallet for payment are the classic fake shop pattern.'},
 {from:'Unknown Number',txt:'Mama, this is my [[new number]]. I lost my phone. Please load [[P2,000]] now and [[do not tell Papa]].',scam:1,why:'Scammers pretend to be family. Call your real mama on her old number before you send anything.'},
 {from:'Work From Home',txt:'Earn [[P5,000 daily]] just by liking videos! Pay a [[P500 registration fee]] to start.',scam:1,why:'Real jobs do not charge you to start. Easy money for tiny work is the hook.'},
 {from:'School Canteen',txt:'Your order is ready for pick up at 12:30. Show order number 4412 at the counter.',scam:0,why:'No link, no payment request, no pressure, and it is about something you really ordered. This one is fine.'},
 {from:'Barangay Hall',txt:'Reminder: clean-up drive this Saturday 8 AM at the covered court. Bring gloves. See you there!',scam:0,why:'It asks for nothing private and nothing urgent. A normal community notice.'}];
const TITLES=[{lv:1,t:'Rookie Catcher'},{lv:5,t:'Street Catcher'},{lv:10,t:'Catch Master'},{lv:15,t:'Dags Dodger'},{lv:20,t:'Manila Legend'},{lv:28,t:'Hev’s Best Friend'}];
const ACH=[
 {id:'c100',n:'First Handful',d:'Catch 100 items',s:'catches',g:100,r:100},{id:'c1k',n:'Coin Magnet',d:'Catch 1,000 items',s:'catches',g:1000,r:400},{id:'c5k',n:'Treasure Hoarder',d:'Catch 5,000 items',s:'catches',g:5000,r:1200},
 {id:'cb20',n:'Combo Starter',d:'Reach a 20x combo',s:'bestCombo',g:20,r:150},{id:'cb50',n:'Combo Machine',d:'Reach a 50x combo',s:'bestCombo',g:50,r:500},
 {id:'b1',n:'Rival Settled',d:'Win the Rap Battle against Uncle Dags',s:'bosses',g:1,r:500},{id:'p1',n:'Pet Parent',d:'Collect a pet',s:'petsOwned',g:1,r:100},{id:'p3',n:'Zoo Keeper',d:'Collect 3 pets',s:'petsOwned',g:3,r:600},
 {id:'ev1',n:'Glow Up',d:'Evolve a pet to Level 5',s:'evolved',g:1,r:400},{id:'sc5',n:'Not Fooled',d:'Spot 5 scams',s:'scamOk',g:5,r:200},{id:'sc20',n:'Scam Slayer',d:'Spot 20 scams',s:'scamOk',g:20,r:700},
 {id:'j1',n:'Para po!',d:'Step through a portal to a Secret Map',s:'journeys',g:1,r:250},{id:'d5',n:'Long Way Home',d:'Run 5,000 meters in total',s:'distance',g:5000,r:300},{id:'r5',n:'Round Five',d:'Reach Round 5 in a run',s:'bestRound',g:5,r:300}];
function achStat(k){const s=S.stats;if(k==='petsOwned')return Object.keys(S.pets).length;if(k==='evolved')return Object.values(S.pets).filter(p=>p.lvl>=5).length;return s[k]||0}

/* ============ save ============ */
const KEY='catchingDagsWithHev.v1';
const DEF=()=>({ver:1,bpow:['magnet','thunder'],setup:false,seenIntro:false,tutorialDone:false,name:'',nick:'',user:'',look:null,coins:600,tickets:2,level:1,exp:0,
 pets:{},petEggs:{},pendingHatch:null,hatchIntro:null,treasures:{},owned:{},petFit:{},petSel:null,evoView:{},inv:{power:{gravity:2,jackpot:2,rewind:1},fragments:0,chests:0},power:'gravity',up:{},
 trapped:null,stats:{catches:0,gold:0,bestCombo:0,bosses:0,rematchWins:0,runs:0,best:0,distance:0,petUses:0,powerUses:0,scamOk:0,scamTotal:0,jumps:0,slides:0,journeys:0,bestRound:1,worlds:1,secrets:0},
 quests:{day:'',daily:[],week:'',weekly:[]},ach:{},login:{count:0,last:''},spin:{last:''},titleLv:1,
 st:{music:.6,sfx:.8,quality:'medium',vibrate:true,diff:'medium',shake:true,pixfx:true,musicOn:true,voice:true,tts:false,scare:true,text:1,touch:true,sens:1,calm:false,notif:{daily:true,quest:true,event:true}},
 mu:{track:0,fav:[],recent:[],list:[0,1,2,3,4,5,6,7],shuffle:false,repeat:'all',auto:true},mode:{kind:'catch',dist:'intramuros'},bossWon:false,bossesWon:{},rematchWins:{},scareWarned:{},seenBiringan:false,portalPending:false,pendingReconcile:false,lifeMsgSeen:false,dclear:{},claimed:{}});
let S=DEF(), memSave=null;
function deepMerge(a,b){for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k]))deepMerge(a[k],b[k]);else a[k]=b[k]}return a}
function load(){try{const r=localStorage.getItem(KEY);if(r){S=deepMerge(DEF(),JSON.parse(r));return true}}catch(e){if(memSave){S=deepMerge(DEF(),memSave);return true}}return false}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){try{memSave=JSON.parse(JSON.stringify(S))}catch(e2){}}}
const SAVE_MIGRATION_KEY=KEY+'.progress-reset-2026';
function applyProgressReset(){
 try{
  if(localStorage.getItem(SAVE_MIGRATION_KEY))return true;
  if(!window.gameHost||window.gameHost.creatorExempt){localStorage.setItem(SAVE_MIGRATION_KEY,'preserved');return true}
  const prior=localStorage.getItem(KEY);
  const backup=prior===null&&memSave?JSON.stringify(memSave):prior;
  if(backup!==null)localStorage.setItem(KEY+'.backup-before-reset-2026',backup);
  const fresh=DEF();fresh.coins=1500;
  localStorage.setItem(KEY,JSON.stringify(fresh));
  localStorage.setItem(SAVE_MIGRATION_KEY,'applied');
  S=fresh;
  return true;
 }catch(error){console.error('Could not back up and apply the one-time progress reset; existing progress was preserved.',error);return false}
}
function eraseProgress(){try{localStorage.removeItem(KEY)}catch(e){}memSave=null;S=DEF()}
const expNeed=l=>80+l*45;
function addExp(n){let up=0;S.exp+=n;while(S.exp>=expNeed(S.level)){S.exp-=expNeed(S.level);S.level++;up++}return up}
const titleName=()=>{let t=TITLES[0].t;for(const x of TITLES)if(S.level>=x.lv&&x.lv<=S.titleLv)t=x.t;return t};

/* ============ quests + achievements ============ */
const QT=[
 {k:'catch',ev:'catch',t:n=>`Catch ${n} treasures`,r:[40,60,75,100],c:n=>n*5},
 {k:'gold',ev:'gold',t:n=>`Catch ${n} golden objects`,r:[8,12,20],c:n=>n*14},
 {k:'combo',ev:'combo',m:1,t:n=>`Reach a ${n}x combo`,r:[12,18,25,35],c:n=>n*18},
 {k:'round',ev:'round',m:1,t:n=>`Reach Round ${n}`,r:[3,4,5],c:n=>n*90},
 {k:'pet',ev:'pet',t:n=>`Activate a pet ability ${n} times`,r:[2,3,5],c:n=>n*80,cat:'pet'},
 {k:'power',ev:'power',t:n=>`Use ${n} power-ups`,r:[1,2,3],c:n=>n*110},
 {k:'jump',ev:'jump',t:n=>`Jump ${n} times`,r:[15,25,40],c:n=>n*8},
 {k:'slide',ev:'slide',t:n=>`Slide under ${n} gates`,r:[3,5,8],c:n=>n*40},
 {k:'dist',ev:'dist',t:n=>`Run ${n} meters`,r:[600,1000,1600],c:n=>Math.round(n/4)},
 {k:'runs',ev:'run',t:n=>`Finish ${n} runs`,r:[2,3,4],c:n=>n*90},
 {k:'scam',ev:'scam',t:n=>`Identify ${n} suspicious messages`,r:[3,4,5],c:n=>n*60,cat:'scam'},
 {k:'frag',ev:'frag',t:n=>`Find ${n} map fragment${n>1?'s':''}`,r:[1],c:n=>300,cat:'surprise'},
 {k:'chests',ev:'chest',t:n=>`Catch ${n} treasure chests`,r:[2,3],c:n=>n*100}];
function genQuests(){
 const d=today(),w=weekKey();
 if(S.quests.day!==d){const R=seeded('d'+d+S.level),pool=QT.filter(q=>q.k!=='frag').sort(()=>R()-.5).slice(0,3);
  S.quests.daily=pool.map((q,i)=>mkQ(q,R,1,'daily'));
  const sp=QT.filter(q=>q.cat==='surprise'||q.cat==='scam'||q.cat==='pet');const sq=sp[Math.floor(R()*sp.length)];const x=mkQ(sq,R,1,'surprise');x.coins=Math.round(x.coins*1.4);x.tix=1;S.quests.daily.push(x);S.quests.day=d}
 if(S.quests.week!==w){const R=seeded('w'+w+S.level),pool=QT.filter(q=>['catch','gold','combo','dist','runs','power','pet','round'].includes(q.k)).sort(()=>R()-.5).slice(0,3);
  S.quests.weekly=pool.map(q=>{const x=mkQ(q,R,4,'weekly');x.tix=1;return x});S.quests.week=w}
}
function mkQ(q,R,mult,cat){let g=q.r[Math.floor(R()*q.r.length)];if(mult>1&&!q.m)g=Math.round(g*mult);else if(mult>1)g=Math.min(g+4,40);
 return{id:q.k+'_'+Math.floor(R()*1e5),k:q.k,ev:q.ev,m:q.m||0,goal:g,prog:0,text:q.t(g),coins:q.c(g)*(mult>1?1.2:1)|0,tix:0,cat:q.cat&&cat!=='weekly'?q.cat:cat,claimed:false}}
function track(ev,n=1){let ch=false;for(const q of S.quests.daily.concat(S.quests.weekly)){if(q.ev!==ev||q.claimed)continue;const old=q.prog;if(q.m)q.prog=Math.max(q.prog,n);else q.prog+=n;q.prog=Math.min(q.prog,q.goal);if(q.prog!==old)ch=true}return ch}
function checkAch(){const out=[];for(const a of ACH){if(S.ach[a.id])continue;if(achStat(a.s)>=a.g){S.ach[a.id]=Date.now();S.coins+=a.r;out.push(a)}}return out}

/* ============ audio ============ */
let AC=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume().catch(()=>{});return AC}
function tone(f,d,type='sine',v=.18,slide=0,delay=0){const a=ac();if(!a)return;try{const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+delay;o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+slide),t+d);g.gain.setValueAtTime(Math.max(.0002,v*S.st.sfx),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.03)}catch(e){}}
const SFX={coin:c=>tone(760+Math.min(c,24)*26,.11,'triangle',.16),gold:()=>{tone(988,.1,'triangle',.2);tone(1318,.16,'triangle',.2,0,.07)},gem:()=>{tone(1100,.1,'sine',.2);tone(1650,.2,'sine',.18,0,.06)},
 hit:()=>{tone(150,.3,'sawtooth',.28,-100);tone(90,.35,'square',.18,-50,.04)},jump:()=>tone(280,.16,'square',.07,260),slide:()=>tone(420,.2,'sawtooth',.06,-260),
 power:()=>[523,659,784,1046].forEach((f,i)=>tone(f,.2,'triangle',.2,0,i*.06)),pet:()=>[392,523,659,880].forEach((f,i)=>tone(f,.22,'sine',.2,0,i*.07)),
 round:()=>[523,659,784].forEach((f,i)=>tone(f,.25,'triangle',.22,0,i*.1)),win:()=>[523,659,784,1046,1318].forEach((f,i)=>tone(f,.3,'triangle',.22,0,i*.1)),lose:()=>[330,262,196].forEach((f,i)=>tone(f,.35,'sawtooth',.16,0,i*.16)),
 ui:()=>tone(620,.07,'triangle',.1),buy:()=>{tone(880,.08,'square',.1);tone(1320,.14,'square',.1,0,.07)},no:()=>tone(160,.2,'square',.1)};
function buzz(ms){if(S.st.vibrate&&navigator.vibrate){try{navigator.vibrate(ms)}catch(e){}}}

/* jukebox */
const DIFFS={easy:['Easy',15],medium:['Medium',10],hard:['Hard',5]};
const baseLives=()=>(DIFFS[S.st.diff]||DIFFS.medium)[1];
const aud=document.getElementById('bgMusic')||new Audio();aud.removeAttribute('loop');aud.preload='auto';aud.loop=false;let audBlobTried=false,userTouched=false,musicWanted=false;
function applyVol(){aud.volume=S.st.musicOn===false?0:clamp(S.st.music,0,1);aud.muted=S.st.musicOn===false}
function curTrack(){return TRACKS[S.mu.track]||TRACKS[0]}
function playTrack(i,quiet){S.mu.track=i;const t=TRACKS[i];audBlobTried=false;aud.src=embSrc(t.src);applyVol();musicWanted=true;
 const p=aud.play();if(p&&p.catch)p.catch(()=>{});S.mu.recent=[i].concat(S.mu.recent.filter(x=>x!==i)).slice(0,8);save();uiMusicChanged()}
function toggleMusic(){if(aud.paused){if(!aud.src)playTrack(S.mu.track);else{musicWanted=true;aud.play().catch(()=>{})}}else{musicWanted=false;aud.pause()}uiMusicChanged()}
function nextTrack(dir=1,auto=false){const L=S.mu.list.length?S.mu.list:[0,1,2,3,4,5,6,7];let i=L.indexOf(S.mu.track);
 if(S.mu.shuffle&&L.length>1){let n;do{n=L[Math.floor(Math.random()*L.length)]}while(n===S.mu.track);playTrack(n);return}
 i=(i+dir+L.length)%L.length;if(auto&&S.mu.repeat==='off'&&i===0&&dir>0){musicWanted=false;uiMusicChanged();return}playTrack(L[i])}
aud.addEventListener('ended',()=>{if(S.mu.repeat==='one'){aud.currentTime=0;aud.play().catch(()=>{})}else nextTrack(1,true)});
aud.addEventListener('play',()=>uiMusicChanged());aud.addEventListener('pause',()=>uiMusicChanged());
aud.addEventListener('error',()=>{if(!audBlobTried&&aud.src){audBlobTried=true;const src=curTrack().src;fetch(src).then(r=>r.blob()).then(b=>{aud.src=URL.createObjectURL(b);aud.play().catch(()=>{})}).catch(()=>{toast('Could not load the track. Check your connection and try again.')})}});
function firstTouch(){if(userTouched)return;userTouched=true;ac();if(S.mu.auto)playTrack(S.mu.track,true)}
['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,()=>firstTouch(),{once:false,passive:true}));
let uiMusicChanged=()=>{};
/* ---- boss first-victory rewards (idempotent: paid once per boss, saved in S.claimed) ---- */
const BOSS_REWARD={biringan:50000,balete:100000,mansion:200000,kapre:350000};
const ALL_BONUS=150000;
const REMATCH_REWARD={biringan:{fee:100000,reward:160000},balete:{fee:150000,reward:240000},mansion:{fee:200000,reward:330000},kapre:{fee:250000,reward:420000}};
let activeRematch=null;
function bossCleared(id){return id==='intramuros'?!!S.bossWon:!!(S.bossesWon&&S.bossesWon[id])}
const TREASURES=[
 {id:'heart',name:'Heart Locket',price:40000,desc:'Start every run with +1 heart.',col:'#ff5d73'},
 {id:'purse',name:'Golden Purse',price:70000,desc:'Every coin you catch is worth 15% more, forever.',col:'#ffc94a'},
 {id:'shoe',name:'Lucky Horseshoe',price:50000,desc:'15% better odds for tickets and bonus chests.',col:'#5be38a'},
 {id:'charm',name:'Pet Charm',price:55000,desc:'Your pet ability recharges 20% faster.',col:'#b58cff'},
 {id:'hourglass',name:'Golden Hourglass',price:65000,desc:'Power-ups last 20% longer.',col:'#7fd6ff'},
 {id:'guard',name:'Silver Guardian',price:60000,desc:'Longer protection after a hit (+0.4s).',col:'#c6cfdc'}];
const PET_FITS=[
 {id:'pcrown',name:'Royal Crown',slot:'hat',price:30000},{id:'party',name:'Party Hat',slot:'hat',price:8000},{id:'pwiz',name:'Wizard Hat',slot:'hat',price:15000},{id:'phalo',name:'Angel Halo',slot:'hat',price:18000},
 {id:'pshade',name:'Cool Shades',slot:'face',price:14000},{id:'pbow',name:'Bow Tie',slot:'neck',price:5000},{id:'pscarf',name:'Red Scarf',slot:'neck',price:9000},{id:'pcape',name:'Hero Cape',slot:'back',price:20000}];
const petFitKey=id=>{const f=(S.petFit&&S.petFit[id])||{};return Object.keys(f).sort().map(k=>f[k]).join('+')};
const hasT=k=>!!(S.treasures&&S.treasures[k]);
const PACKS=[{n:10,disc:.8},{n:25,disc:.65}];
const effL=l=>l<=5?l:5+(l-5)*.5;
function payBoss(id){S.claimed=S.claimed||{};let paid=0,extra=0;if(!S.claimed[id]){const r=BOSS_REWARD[id]!=null?BOSS_REWARD[id]:((typeof bossOf==='function'&&bossOf(id)||{}).reward||0);S.claimed[id]=1;S.coins+=r;paid=r}
 if(!S.claimed.all&&['biringan','balete','mansion','kapre'].every(k=>S.claimed[k])){S.claimed.all=1;S.coins+=ALL_BONUS;extra=ALL_BONUS}
 save();return{paid,extra}}
function reconcileRewards(){S.claimed=S.claimed||{};const bw=S.bossesWon||{};Object.keys(BOSS_REWARD).forEach(k=>{if(bw[k]&&!S.claimed[k])payBoss(k)});save()}

/* ============ three.js core ============ */
const canvas=$('#gl');
const R=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
const MC={};
function M(c,o){const k=c+(o?JSON.stringify(o):'');return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.72,metalness:.04},o||{})))}
function LM(c,o){const k='L'+c+(o?JSON.stringify(o):'');return MC[k]||(MC[k]=new THREE.MeshLambertMaterial(Object.assign({color:c},o||{})))}
const EM=(c,i=1)=>{const k='E'+c+i;return MC[k]||(MC[k]=new THREE.MeshBasicMaterial({color:c}))};
const OLM=new THREE.MeshBasicMaterial({color:0x0b1230,side:THREE.BackSide});
function radTex(c1,c2){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,c1);gr.addColorStop(.35,c1.replace(/[\d.]+\)$/,'.45)'));gr.addColorStop(1,c2);g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}
const GLOW=radTex('rgba(255,255,255,1)','rgba(255,255,255,0)');
function glowSprite(color,size,op=.9){const m=new THREE.SpriteMaterial({map:GLOW,color,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:op,fog:false});const s=new THREE.Sprite(m);s.scale.set(size,size,1);return s}
function labelSprite(text,bg,fg='#fff',w=2.4){const c=document.createElement('canvas');c.width=320;c.height=110;const g=c.getContext('2d');
 g.fillStyle=bg;g.strokeStyle='#fff';g.lineWidth=7;const r=36;g.beginPath();g.moveTo(14+r,12);g.arcTo(306,12,306,98,r);g.arcTo(306,98,14,98,r);g.arcTo(14,98,14,12,r);g.arcTo(14,12,306,12,r);g.closePath();g.fill();g.stroke();
 g.fillStyle=fg;g.font='400 58px "Lilita One",Arial Rounded MT Bold,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,160,57);
 const t=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false,fog:false}));s.scale.set(w,w*110/320,1);s.renderOrder=10;return s}
function mesh(geo,mat,x=0,y=0,z=0,par,ol=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(par)par.add(m);if(ol){const o=new THREE.Mesh(geo,OLM);o.scale.setScalar(ol);m.add(o)}return m}
function sph(r,sx,sy,sz,mat,x,y,z,par,ol=0){const m=mesh(new THREE.SphereGeometry(r,18,14),mat,x,y,z,par,ol);m.scale.set(sx,sy,sz);return m}

/* ---------- jeepney ---------- */
function signTex(text,bg,fg){const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,512,96);g.fillStyle=fg;g.font='400 64px "Lilita One",Arial Black,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,52);return new THREE.CanvasTexture(c)}
function buildJeepney(c1='#ff4fa3',c2='#5ee0ff',sign='INTRAMUROS'){
 const g=new THREE.Group();
 mesh(new THREE.BoxGeometry(2.2,.8,5),M(c1),0,.78,0,g,1.02);
 mesh(new THREE.BoxGeometry(2.1,1,3.3),M('#f4f0e6'),0,1.58,-.7,g,1.02);
 mesh(new THREE.BoxGeometry(2.25,.14,3.5),M(c2),0,2.15,-.7,g,1.02);
 mesh(new THREE.BoxGeometry(2.2,.5,1.3),M(c1),0,1.15,1.85,g,1.02);
 for(const s of[-1,1]){mesh(new THREE.BoxGeometry(.04,.55,2.8),M('#16264f',{emissive:'#6fa8ff',emissiveIntensity:.35}),s*1.06,1.7,-.7,g);mesh(new THREE.BoxGeometry(.05,.14,5.02),M(c2),s*1.1,.9,0,g);mesh(new THREE.BoxGeometry(.05,.07,5.02),M('#ffc94a'),s*1.1,.6,0,g)}
 mesh(new THREE.BoxGeometry(1.9,.62,.04),M('#16264f',{emissive:'#6fa8ff',emissiveIntensity:.3}),0,1.7,.97,g);
 mesh(new THREE.BoxGeometry(1.7,.4,.1),M('#d8dde8',{metalness:.7,roughness:.25}),0,.95,2.52,g);
 mesh(new THREE.BoxGeometry(2.3,.14,.2),M('#d8dde8',{metalness:.7,roughness:.25}),0,.5,2.6,g);
 for(const s of[-1,1]){mesh(new THREE.SphereGeometry(.17,12,10),EM('#fff3b0'),s*.7,1.0,2.55,g);const gl=glowSprite('#ffe9a0',1.4,.55);gl.position.set(s*.7,1.0,2.7);g.add(gl)}
 const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.9,.36),new THREE.MeshBasicMaterial({map:signTex(sign,'#16264f','#ffc94a')}));sg.position.set(0,2.4,.98);g.add(sg);
 mesh(new THREE.BoxGeometry(1.9,.3,.05),M('#ffc94a'),0,2.4,.96,g);
 for(const[x,z]of[[-1.1,1.6],[1.1,1.6],[-1.1,-1.5],[1.1,-1.5]]){const w=mesh(new THREE.CylinderGeometry(.42,.42,.3,16),M('#14141c'),x,.42,z,g,1.04);w.rotation.z=Math.PI/2;const h=mesh(new THREE.CylinderGeometry(.2,.2,.32,10),M('#d8dde8',{metalness:.6}),x,.42,z,g);h.rotation.z=Math.PI/2}
 for(let i=0;i<3;i++)mesh(new THREE.BoxGeometry(1.6,.18,.5),M(['#ffc94a','#ff4fa3','#5ee0ff'][i]),0,2.3,-1.5+i*.8,g);
 const sh=mesh(new THREE.CircleGeometry(1.4,20),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.3,depthWrite:false}),0,.03,0,g);sh.rotation.x=-Math.PI/2;sh.scale.y=2;
 return g}

/* ============ authentic pixel-art engine ============
   Characters, pets and icons are built on a tiny pixel grid (no smoothing): chunky shapes, thick black
   outline, flat colour + one shade tone. Every part is independent so players can mix hair, face, skin,
   clothes, colours and accessories.  Sprites are upscaled with nearest-neighbour everywhere. */
const INKP='#14101c';
const PW=48,PH=54,OX=4,OY=1;
const hex2=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const toHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mixC=(a,b,t)=>{const x=hex2(a),y=hex2(b);return toHex(x.map((v,i)=>v+(y[i]-v)*t))};
const shadeC=c=>mixC(c,'#2a1650',.3),hiC=c=>mixC(c,'#ffffff',.3);
const ell=(cx,cy,rx,ry)=>(x,y)=>((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1;
const rc=(x0,y0,w,h)=>(x,y)=>x>=x0&&x<x0+w&&y>=y0&&y<y0+h;
const or=(...f)=>(x,y)=>f.some(g=>g(x,y));
const and=(a,b)=>(x,y)=>a(x,y)&&b(x,y);
const not=a=>(x,y)=>!a(x,y);
const tri=(x0,y0,w,h)=>(x,y)=>y>=y0&&y<y0+h&&Math.abs(x+.5-(x0+w/2))<=((y-y0+1)/h)*w/2;
const pts=(...p)=>(x,y)=>p.some(q=>q[0]===x&&q[1]===y);
const mkMask=f=>{const m=new Uint8Array(PW*PH);for(let y=0;y<PH;y++)for(let x=0;x<PW;x++)m[y*PW+x]=f(x-OX,y-OY)?1:0;return m};
class Pix{constructor(){this.c=new Array(PW*PH).fill(null)}set(x,y,c){if(x>=0&&y>=0&&x<PW&&y<PH)this.c[y*PW+x]=c}
 dot(x,y,c){this.set(x+OX,y+OY,c)}
 /* paint a part: optional outline around it, flat colour, shade on the lower / right rim */
 part(f,col,o={}){const m=mkMask(f),at=(x,y)=>x>=0&&y>=0&&x<PW&&y<PH&&m[y*PW+x]===1;
  if(o.ol!==false)for(let y=0;y<PH;y++)for(let x=0;x<PW;x++)if(!at(x,y)&&(at(x-1,y)||at(x+1,y)||at(x,y-1)||at(x,y+1)))this.set(x,y,INKP);
  const sh=o.sh===false?null:shadeC(col),hi=o.hi?hiC(col):null;
  for(let y=0;y<PH;y++)for(let x=0;x<PW;x++)if(at(x,y)){let c=col;if(sh&&(!at(x,y+1)||(!at(x+1,y)&&at(x,y-1))))c=sh;else if(hi&&(!at(x,y-1)&&at(x,y+1)))c=hi;this.set(x,y,c)}}
 toCanvas(){const cv=document.createElement('canvas');cv.width=PW;cv.height=PH;const g=cv.getContext('2d'),id=g.createImageData(PW,PH);for(let i=0;i<PW*PH;i++){const c=this.c[i];if(!c)continue;const r=hex2(c);id.data[i*4]=r[0];id.data[i*4+1]=r[1];id.data[i*4+2]=r[2];id.data[i*4+3]=255}g.putImageData(id,0,0);return cv}}

/* ---------- palettes ---------- */
const SKINS=['#fde3cf','#f6cfae','#e8b48a','#d09a70','#b07850','#8a5a3a','#6a4028','#4a2c1c'];
const HAIRC=['#14101c','#3b2418','#6a3a22','#a9783f','#e0c88c','#b8432c','#7b4dff','#e8789a','#4a78e0','#f4f4f8','#2fa86a','#f2b53a'];
const CLOTHC=['#2e2850','#f4f4f8','#d94a4a','#f2b53a','#3a8fe0','#2fa86a','#7b4dff','#ff7ab8','#24336e','#6a6a4a','#8a8a99','#c9c6ee','#e85a2a','#4a2c1c','#18a8a8','#1a1a22'];
const ACCC=['#f2c04a','#d9dbe6','#ffffff','#ff4fa3','#5ee0ff','#7b4dff','#e85a2a','#14101c'];
const AURAS=['','#ffd24a','#5ee0ff','#ff4fa3','#9a7bff','#52e08a','#ff7a3c','#ffffff'];

/* ---------- option catalogues ---------- */
const O_HAIR=[['spiky','Spiky'],['side','Side part'],['crop','Short crop'],['buzz','Buzz'],['long','Long'],['bob','Bob'],['pony','Ponytail'],['pigtail','Pigtails'],['bun','Bun'],['curly','Curly'],['none','Bald']];
const O_EYES=[['dot','Dots'],['wide','Shiny'],['happy','Happy'],['wink','Wink'],['sharp','Sharp'],['sleepy','Sleepy']];
const O_MOUTH=[['smile','Smile'],['grin','Grin'],['flat','Flat'],['smirk','Smirk'],['cat','Cat'],['o','Oh!']];
const O_FH=[['','None'],['goatee','Goatee'],['stache','Mustache']];
const O_TOP=[['tee','T-shirt'],['hoodie','Hoodie'],['jacket','Open jacket'],['varsity','Varsity'],['jersey','Jersey'],['tank','Tank'],['vest','Sweater vest'],['crop','Crop top'],['dress','Dress'],['cheer','Cheer top']];
const O_BOT=[['cargo','Baggy cargo'],['jeans','Jeans'],['shorts','Shorts'],['skirt','Skirt']];
const O_SHOE=[['sneaker','Sneakers'],['boot','Boots'],['hightop','High-tops']];
const O_HAT=[['','None'],['cap','Cap'],['backcap','Back cap'],['beanie','Beanie'],['straw','Straw hat'],['beret','Beret'],['headband','Headband'],['catears','Cat ears'],['hphead','Headphones']];
const PREM_HAT=[['crown','Gold Crown',90000],['tophat','Top Hat',30000],['halo','Angel Halo',45000],['wizard','Wizard Hat',35000]];
const PREM_TOP=[['barong','Barong Tagalog',50000],['tux','Tuxedo',60000],['royal','Royal Robe',100000]];
const PREM_NECK=[['pearls','Pearl Necklace',20000],['bowtie','Bow Tie',18000],['diamond','Diamond Chain',70000]];
const PREM_EXTRA=[['wings','Angel Wings',100000],['cape','Hero Cape',50000]];
const PREM_SHOE=[['gold','Golden Sneakers',40000]];
const PREM_ALL=[].concat(PREM_HAT,PREM_TOP,PREM_NECK,PREM_EXTRA,PREM_SHOE);
const premOf=id=>PREM_ALL.find(x=>x[0]===id);
const PREM_TC={barong:'#f3e6c4',tux:'#1c1c26',royal:'#7a1f3d'};
const O_EYEW=[['','None'],['glasses','Glasses'],['round','Round'],['shades','Shades']];
const O_NECK=[['','None'],['chain','Chain'],['scarf','Scarf'],['hpneck','Neck phones']];
const O_EXTRA=[['','None'],['backpack','Backpack'],['mic','Mic'],['ball','Basketball']];
const L0={hs:'crop',hc:'#14101c',eyes:'dot',mouth:'smile',blush:1,skin:'#f6cfae',top:'tee',tc:'#3a8fe0',ta:'#f4f4f8',bot:'cargo',bc:'#2e2850',shoe:'sneaker',sc:'#f4f4f8',hat:'',hatc:'#d94a4a',eyew:'',neck:'',nc:'#f2c04a',extra:'',xc:'#1e1d26',ear:0,fh:'',pose:'idle',aura:''};
const resolveLook=l=>Object.assign({},L0,l||{});
const defaultLook=()=>Object.assign({},L0,{hs:'long',hc:'#6a3a22',eyes:'wide',skin:'#fde3cf',top:'varsity',tc:'#24336e',ta:'#f4f4f8',bot:'skirt',bc:'#2a3560',extra:'backpack',xc:'#ff9ac4',aura:''});

/* ---------- hair ---------- */
function hairShapes(L){const hs=L.hs,H=ell(20,15,13.5,12.5);const hl=f=>and(H,(x,y)=>y<f(x));
 const sides=(h)=>or(rc(7,10,3,h),rc(30,10,3,h));
 switch(hs){
 case'spiky':{const d=[1,3,2,4,2,3,1,3,2,4,2,3,1];return{front:or(hl(x=>12+d[((x-7)%13+13)%13]),sides(9),tri(10,0,5,4),tri(17,-2,6,5),tri(25,0,5,4),tri(7,3,4,4),tri(29,3,4,4))}}
 case'side':return{front:or(hl(x=>x<18?17-Math.floor((x-8)*.3):x<26?12:11),sides(8))};
 case'crop':return{front:or(hl(x=>12+(x%2?1:0)),sides(6))};
 case'buzz':return{front:and(ell(20,15,12.6,11.6),(x,y)=>y<10)};
 case'long':return{back:or(ell(20,16,14.5,13),rc(5,14,30,26)),front:or(hl(x=>13+((x>=13&&x<=27)?2:0)),rc(6,10,4,24),rc(30,10,4,24))};
 case'bob':return{back:rc(5,12,30,16),front:or(hl(x=>14),rc(6,10,4,16),rc(30,10,4,16))};
 case'pony':return{back:or(ell(35,19,3.6,9),rc(31,8,5,4)),front:or(hl(x=>13),sides(6),pts([33,10],[34,10]))};
 case'pigtail':return{back:or(ell(4.5,23,3.2,8),ell(35.5,23,3.2,8)),front:or(hl(x=>13),sides(7))};
 case'bun':return{front:or(hl(x=>12+(x%2?1:0)),sides(6),ell(20,2.5,4.5,3.5))};
 case'curly':return{back:ell(20,14,16,14),front:or(hl(x=>11+((x%3)===0?2:0)))};
 default:return{}}}

/* ---------- eyes / mouth ---------- */
function drawFace(px,L,skin){const ec=INKP;
 const L1=rc(14,17,2,4),R1=rc(25,17,2,4);
 switch(L.eyes){
 case'wide':px.part(or(rc(13,16,3,5),rc(25,16,3,5)),ec,{ol:false,sh:false});px.dot(13,16,'#ffffff');px.dot(25,16,'#ffffff');px.dot(14,20,'#6a5aa0');px.dot(26,20,'#6a5aa0');break;
 case'happy':for(const[x,y]of[[13,19],[14,18],[15,18],[16,19],[24,19],[25,18],[26,18],[27,19]])px.dot(x,y,ec);break;
 case'wink':px.part(L1,ec,{ol:false,sh:false});for(const[x,y]of[[24,19],[25,18],[26,18],[27,19]])px.dot(x,y,ec);break;
 case'sharp':px.part(or(rc(14,18,2,3),rc(25,18,2,3)),ec,{ol:false,sh:false});for(const[x,y]of[[12,16],[13,16],[14,17],[15,17],[25,17],[26,17],[27,16],[28,16]])px.dot(x,y,ec);break;
 case'sleepy':for(const[x,y]of[[13,19],[14,19],[15,19],[16,19],[24,19],[25,19],[26,19],[27,19]])px.dot(x,y,ec);break;
 default:px.part(or(L1,R1),ec,{ol:false,sh:false})}
 if(L.blush){const b=mixC(skin,'#ff5f86',.55);px.part(or(rc(10,21,3,2),rc(28,21,3,2)),b,{ol:false,sh:false})}
 px.dot(20,22,mixC(skin,'#7a3a3a',.5));
 const m=L.mouth;const mc='#3a1020';
 if(m==='grin'){px.part(rc(17,23,7,3),mc,{ol:false,sh:false});px.part(rc(18,23,5,1),'#ffffff',{ol:false,sh:false});px.part(rc(19,25,3,1),'#e0546a',{ol:false,sh:false})}
 else if(m==='flat')px.part(rc(19,24,3,1),mc,{ol:false,sh:false});
 else if(m==='o')px.part(rc(19,23,2,3),mc,{ol:false,sh:false});
 else if(m==='cat')for(const[x,y]of[[18,24],[19,25],[20,24],[21,25],[22,24]])px.dot(x,y,mc);
 else if(m==='smirk')for(const[x,y]of[[19,25],[20,25],[21,25],[22,24]])px.dot(x,y,mc);
 else for(const[x,y]of[[18,24],[19,25],[20,25],[21,25],[22,24]])px.dot(x,y,mc)}

const DIG={'2':['111','001','111','100','111'],'3':['111','001','111','001','111']};
/* ---------- the character ---------- */
function drawPix(L,pose){L=resolveLook(L);if(PREM_TC[L.top])L.tc=PREM_TC[L.top];pose=pose||L.pose||'idle';const px=new Pix(),skin=L.skin,T=L.top,B=L.bot,hairC=L.hc;
 const longSl=['hoodie','jacket','varsity','vest'].includes(T),shortSl=['tee','jersey'].includes(T);
 const hair=hairShapes(L);
 if(hair.back)px.part(hair.back,hairC,{hi:true});
 if(L.extra==='backpack'){px.part(rc(9,28,22,13),L.xc);px.part(rc(15,34,10,4),shadeC(L.xc),{ol:false,sh:false})}
 /* legs */
 if(L.extra==='wings'){px.part(or(ell(4,29,5,10),ell(36,29,5,10)),'#f4f6ff');px.part(or(ell(4,32,3,6),ell(36,32,3,6)),'#cfd8ff',{ol:false,sh:false})}
 if(L.extra==='cape'){px.part(or(rc(11,29,19,17),rc(9,33,23,13)),'#c0392b');px.part(rc(11,44,19,2),'#ffc94a',{ol:false,sh:false})}
 const legC=L.bc;
 const dressy=T==='dress'||T==='cheer';
 if(B==='cargo'||B==='jeans'){const w=B==='cargo'?8:7,x1=B==='cargo'?12:13,x2=B==='cargo'?21:21;px.part(or(rc(x1,38,w,9),rc(x2,38,w,9),B==='cargo'?or(rc(x1-1,45,w+2,2),rc(x2-1,45,w+2,2)):()=>false),legC);
  if(B==='cargo'){px.part(or(rc(12,42,2,2),rc(27,42,2,2)),mixC(legC,'#ffffff',.12),{ol:false,sh:false});px.part(rc(12,38,17,1),shadeC(legC),{ol:false,sh:false})}}
 else if(B==='shorts'){px.part(or(rc(14,43,4,4),rc(23,43,4,4)),skin);px.part(or(rc(12,38,8,6),rc(21,38,8,6)),legC)}
 else{px.part(or(rc(14,44,3,3),rc(24,44,3,3)),L.sock||'#ffffff');px.part(or(rc(12,38,17,2),rc(11,40,19,2),rc(10,42,21,3)),legC)}
 /* shoes */
 const sh=L.shoe==='gold'?'#ffc94a':L.sc;
 if(L.shoe==='boot')px.part(or(rc(12,45,7,6),rc(21,45,7,6),rc(11,49,9,2),rc(21,49,9,2)),sh);
 else if(L.shoe==='hightop'){px.part(or(rc(11,45,8,6),rc(22,45,8,6)),sh);px.part(or(rc(11,45,8,1),rc(22,45,8,1)),'#ffffff',{ol:false,sh:false});px.part(or(rc(10,50,10,1),rc(21,50,10,1)),'#ffffff',{ol:false,sh:false})}
 else{px.part(or(rc(10,47,9,4),rc(22,47,9,4)),sh);px.part(or(rc(10,50,10,1),rc(21,50,10,1)),'#ffffff',{ol:false,sh:false});px.part(or(rc(11,47,3,1),rc(26,47,3,1)),hiC(sh),{ol:false,sh:false})}
 /* torso */
 const tc=L.tc,ta=L.ta;
 const wideT=['hoodie','jacket','varsity'].includes(T);
 if(T==='hoodie')px.part(rc(14,27,12,3),shadeC(tc));
 if(T==='dress'||T==='cheer'){px.part(or(rc(13,29,14,6),rc(12,35,16,3),rc(11,38,18,3),rc(10,41,20,3)),tc);px.part(rc(10,43,20,1),T==='cheer'?'#ffffff':shadeC(tc),{ol:false,sh:false})}
 else if(T==='crop'){px.part(rc(14,34,12,4),skin);px.part(rc(13,29,14,5),tc)}
 else if(T==='vest'){px.part(rc(13,29,14,10),ta);px.part(or(rc(13,31,5,8),rc(22,31,5,8)),tc,{ol:false});px.part(rc(18,29,4,2),skin,{ol:false,sh:false})}
 else if(T==='jacket'){px.part(rc(13,29,14,11),ta);px.part(or(rc(12,29,6,11),rc(22,29,6,11)),tc);px.part(or(rc(18,30,1,9),rc(21,30,1,9)),hiC(tc),{ol:false,sh:false})}
 else if(T==='varsity'){px.part(rc(13,29,14,11),ta);px.part(or(rc(12,29,6,11),rc(22,29,6,11)),tc);px.part(rc(18,29,4,2),skin,{ol:false,sh:false})}
 else px.part(wideT?rc(12,29,16,11):rc(13,29,14,10),tc);
 if(T==='jersey'){for(const[ch,x0]of[['2',16],['3',21]])DIG[ch].forEach((r,j)=>{for(let i=0;i<3;i++)if(r[i]==='1')px.dot(x0+i,31+j,'#ffffff')})}
 if(T==='tee'&&L.ta&&L.ta!==L.tc){px.part(rc(16,32,8,3),L.ta,{ol:false,sh:false})}

 if(T==='cheer'){px.part(rc(13,31,14,1),'#ffffff',{ol:false,sh:false})}
 if(T==='barong'){px.part(or(rc(15,31,1,8),rc(24,31,1,8),rc(19,31,2,8)),'#d4b96a',{ol:false,sh:false});px.part(rc(17,29,6,2),skin,{ol:false,sh:false});px.part(or(rc(13,29,3,2),rc(24,29,3,2)),'#fff7e0',{ol:false,sh:false})}
 if(T==='tux'){px.part(rc(17,29,6,9),'#ffffff',{ol:false,sh:false});px.part(or(rc(13,29,4,10),rc(23,29,4,10)),'#101018',{ol:false,sh:false});px.part(or(rc(19,32,2,1),rc(19,34,2,1),rc(19,36,2,1)),'#2a2838',{ol:false,sh:false})}
 if(T==='royal'){px.part(rc(12,28,16,3),'#f4f4f8');px.part(or(rc(19,31,2,9),rc(13,38,14,2)),'#ffc94a',{ol:false,sh:false});px.dot(16,34,'#ffd24a');px.dot(24,34,'#ffd24a')}
 /* neck wear (under the head) */
 if(L.neck==='scarf'){px.part(rc(12,28,16,3),L.nc);px.part(rc(24,30,4,7),L.nc)}
 if(L.neck==='hpneck'){px.part(or(rc(10,28,4,7),rc(26,28,4,7)),L.nc)}
 /* arms */
 const slc=T==='jersey'||T==='tee'?tc:(T==='vest'?ta:T==='varsity'?ta:tc);
 const sleeveL=(T==='tank'||dressy||T==='crop'||T==='jersey')?null:slc;
 const armUp=(x,y,w,h,hand)=>{px.part(rc(x,y,w,h),L.slv||sleeveL||skin);};
 const vis=(f)=>f;
 const hand=(x,y,w=4,h=3)=>px.part(rc(x,y,w,h),skin,{sh:false});
 const arm=(x,y,w,h,full)=>{const sl=sleeveL?(longSl?h:(shortSl?Math.min(h,4):0)):0;if(sl<h)px.part(rc(x,y,w,h),skin);if(sl>0)px.part(rc(x,y,w,sl),sleeveL)};
 if(pose==='idle'||pose==='peace'||pose==='point'||pose==='pocket'){
  arm(9,30,4,8);if(pose==='pocket'){px.part(rc(9,30,4,6),sleeveL||skin)}else hand(9,38,4,3);
  if(pose==='idle'||pose==='pocket'){arm(28,30,4,8);if(pose==='pocket')px.part(rc(28,30,4,6),sleeveL||skin);else hand(28,38,4,3)}
  if(pose==='peace'){arm(30,23,4,9);hand(30,20,4,3);px.part(or(rc(30,17,1,3),rc(33,17,1,3)),skin,{ol:true,sh:false});px.part(rc(28,30,3,3),sleeveL||skin)}
  if(pose==='point'){px.part(rc(28,31,4,3),sleeveL||skin);px.part(rc(32,31,6,3),sleeveL||skin);hand(38,30,4,4);px.part(rc(41,30,3,2),skin,{sh:false})}}
 else if(pose==='cross'){arm(9,30,4,6);px.part(rc(10,34,13,4),sleeveL||skin);hand(21,34,4,4);arm(28,30,4,6);px.part(rc(17,37,14,3),sleeveL||skin);hand(16,37,4,3)}
 else if(pose==='cheer'){for(const x of[5,31]){arm(x,23,4,9);hand(x,20,4,3)}px.part(or(rc(9,29,4,3),rc(27,29,4,3)),sleeveL||skin)}
 /* head */
 px.part(or(rc(6,17,2,4),rc(33,17,2,4)),skin,{sh:false});
 px.part(ell(20,17,12,11),skin);
 drawFace(px,L,skin);
 if(L.ear)px.dot(6,20,'#f2c04a');
 if(L.fh==='goatee')px.part(rc(18,26,5,2),hairC,{ol:false,sh:false});
 if(L.fh==='stache')px.part(rc(17,22,7,1),hairC,{ol:false,sh:false});
 /* chain around the neck */
 if(L.neck==='chain'){for(const[x,y]of[[14,29],[15,30],[16,31],[17,32],[18,33],[19,33],[20,33],[21,33],[22,33],[23,32],[24,31],[25,30],[26,29]])px.dot(x,y,L.nc);px.part(rc(19,34,3,3),L.nc)}
 if(L.neck==='pearls'){for(const[x,y]of[[14,29],[15,30],[16,31],[17,32],[18,33],[19,33],[20,33],[21,33],[22,33],[23,32],[24,31],[25,30],[26,29]])px.dot(x,y,'#f6f3ee')}
 if(L.neck==='diamond'){for(const[x,y]of[[14,29],[15,30],[16,31],[17,32],[18,33],[19,33],[20,33],[21,33],[22,33],[23,32],[24,31],[25,30],[26,29]])px.dot(x,y,'#ffc94a');px.part(rc(19,34,3,3),'#8ff0ff');px.dot(20,36,'#ffffff')}
 if(L.neck==='bowtie'){px.part(or(rc(14,29,5,4),rc(22,29,5,4)),'#d6335a');px.part(rc(19,29,3,4),'#8e1b3b')}
 /* hair in front */
 if(hair.front)px.part(hair.front,hairC,{hi:true});
 if(L.hs==='pony'||L.hs==='pigtail'){px.part(L.hs==='pony'?pts([33,10],[34,10],[33,11],[34,11]):pts([5,14],[6,14],[34,14],[35,14]),'#ff4fa3',{ol:false,sh:false})}
 /* hats */
 const hc=L.hatc,hat=L.hat;
 if(hat==='cap'){px.part(and(ell(20,13,13,11),(x,y)=>y<12),hc);px.part(rc(8,11,26,2),shadeC(hc))}
 else if(hat==='backcap'){px.part(and(ell(20,13,13.4,11.5),(x,y)=>y<13),hc,{hi:true});px.part(rc(31,10,7,2),shadeC(hc));px.part(rc(8,12,25,1),shadeC(hc),{ol:false,sh:false})}
 else if(hat==='beanie'){px.part(and(ell(20,14,13.5,12),(x,y)=>y<12),hc);px.part(rc(7,11,27,4),shadeC(hc));px.part(ell(20,1.5,2.4,2),hiC(hc))}
 else if(hat==='straw'){px.part(or(ell(20,6,10,7),and(ell(20,13,13,6),(x,y)=>y<11)),'#f2c04a');px.part(rc(11,6,19,2),'#d94a4a',{ol:false,sh:false});px.part(ell(20,10,19.5,3.2),'#f2c04a');px.part(rc(1,10,8,1),shadeC('#f2c04a'),{ol:false,sh:false})}
 else if(hat==='beret'){px.part(or(ell(17,7,12,5),rc(8,9,18,2)),hc);px.dot(17,1,shadeC(hc))}
 else if(hat==='headband'){px.part(rc(8,10,25,3),hc)}
 else if(hat==='catears'){px.part(or(tri(8,-1,7,7),tri(26,-1,7,7)),L.hc==='#14101c'?'#2e2850':L.hc);px.part(or(tri(10,2,3,3),tri(28,2,3,3)),'#ff8cc2',{ol:false,sh:false})}
 else if(hat==='crown'){px.part(or(rc(11,5,19,4),tri(11,0,5,6),tri(18,-1,5,7),tri(25,0,5,6)),'#ffc94a');px.dot(14,6,'#ff4f6a');px.dot(20,6,'#5ee0ff');px.dot(26,6,'#ff4f6a')}
 else if(hat==='tophat'){px.part(rc(9,5,23,2),'#1a1a24');px.part(rc(13,-2,15,8),'#1a1a24');px.part(rc(13,2,15,2),'#c0392b',{ol:false,sh:false})}
 else if(hat==='halo'){px.part(and(ell(20,2,10,3),not(ell(20,2,7,1.4))),'#ffe27a',{ol:false,sh:false})}
 else if(hat==='wizard'){px.part(tri(12,-3,17,11),'#3b2a8a');px.part(rc(8,7,25,2),'#2e2070');px.dot(18,3,'#ffd24a');px.dot(23,5,'#ffd24a')}
 else if(hat==='hphead'){px.part(and(and(ell(20,13,15.5,13),not(ell(20,13,13.5,11))),(x,y)=>y<14),hc);px.part(or(rc(3,12,5,9),rc(33,12,5,9)),hc)}
 /* eyewear */
 if(L.eyew==='shades'){px.part(or(rc(11,16,9,5),rc(22,16,9,5),rc(20,17,2,1)),INKP,{ol:false,sh:false});px.part(or(pts([8,17],[9,17],[10,17],[31,17],[32,17],[33,17])),INKP,{ol:false,sh:false});px.dot(12,17,'#7a7ab8');px.dot(23,17,'#7a7ab8')}
 else if(L.eyew==='glasses'){px.part(and(or(rc(11,15,8,6),rc(22,15,8,6)),not(or(rc(12,16,6,4),rc(23,16,6,4)))),'#3a2418',{ol:false,sh:false});px.dot(19,17,'#3a2418');px.dot(20,17,'#3a2418');px.dot(21,17,'#3a2418')}
 else if(L.eyew==='round'){px.part(and(or(ell(15,18,4.5,4.5),ell(26,18,4.5,4.5)),not(or(ell(15,18,3,3),ell(26,18,3,3)))),'#3a2418',{ol:false,sh:false});px.dot(19,18,'#3a2418');px.dot(20,18,'#3a2418');px.dot(21,18,'#3a2418')}
 /* hand-held */
 if(L.extra==='mic'){px.part(rc(35,33,2,9),'#8a8a99');px.part(ell(36,31.5,3,3),'#2a2838')}
 if(L.extra==='ball'){px.part(ell(35,42,5,5),'#e8762a');px.part(or(rc(31,42,9,1),rc(35,37,1,10)),INKP,{ol:false,sh:false})}
 return px}

/* ---------- caches / API ---------- */
const lookCache={};
const lookKey=(L,pose)=>JSON.stringify(resolveLook(L))+'|'+(pose||'');
function pixCanvas(L,pose){const k=lookKey(L,pose);return lookCache[k]||(lookCache[k]=drawPix(L,pose).toCanvas())}
const sprCanvas=pixCanvas;
const urlCache={};
function sprURL(L,pose){const k='s'+lookKey(L,pose);return urlCache[k]||(urlCache[k]=pixCanvas(L,pose).toDataURL('image/png'))}
/* crops: 'head' = face + hair, 'body' = clothes */
function cropURL(L,kind,sz,pose){const k='c'+kind+sz+lookKey(L,pose);if(urlCache[k])return urlCache[k];const s=pixCanvas(L,pose),c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 const r=kind==='head'?[OX+1,OY-1,38,38]:kind==='shoe'?[OX+2,OY+36,36,16]:[OX+2,OY+26,36,26];const side=Math.max(r[2],r[3]);g.drawImage(s,r[0]-(side-r[2])/2,r[1]-(side-r[3])/2,side,side,0,0,sz,sz);return urlCache[k]=c.toDataURL('image/png')}
const headURL=(L,sz=96)=>cropURL(L,'head',sz);
const avatarThumb=()=>headURL(resolveLook(S.look),128);
const npcThumb=look=>headURL(look,128);
const sid=L=>lookKey(L,'');
const texCache={};
function texFor(L,pose){const k=lookKey(L,pose);if(texCache[k])return texCache[k];const t=new THREE.CanvasTexture(pixCanvas(L,pose));t.minFilter=THREE.NearestFilter;t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;return texCache[k]=t}

/* ---------- 3D scene billboard ---------- */
const POSEMAP={idle:'idle',arms:'idle',angry:'idle',wave:'peace',cheer:'cheer',run:'idle',jump:'idle',slide:'idle',hit:'idle'};
function buildChibi(L){L=resolveLook(L);const H=2.5;
 const g=new THREE.Group(),rig=new THREE.Group();g.add(rig);
 const geo=new THREE.PlaneGeometry(1,1);geo.translate(0,.5,0);
 const mat=new THREE.MeshBasicMaterial({map:texFor(L,L.fp?L.fp.idle:'idle'),transparent:true,alphaTest:.04,side:THREE.DoubleSide});const m=new THREE.Mesh(geo,mat);rig.add(m);
 const sh=new THREE.Mesh(new THREE.CircleGeometry(.6,24),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.32,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.01;sh.scale.set(1.2,.6,1);g.add(sh);
 let au=null;if(L.aura){au=glowSprite(L.aura,4.8,.5);au.position.set(0,H*.5,-.06);rig.add(au)}
 const c={g,rig,head:new THREE.Group(),legs:[new THREE.Group(),new THREE.Group()],arms:[new THREE.Group(),new THREE.Group()],shadow:sh,kind:'sprite',spr:{m,L,H,cur:'',sx:H*PW/PH,sy:H}};
 c.spr.setPose=p=>{if(c.spr.cur===p)return;c.spr.cur=p;m.material.map=texFor(L,p)};c.spr.setPose(L.fp?L.fp.idle:'idle');return c}
function pose(c,t,st,k=1){const s=c.spr;if(!s)return;const m=s.m,rig=c.rig;rig.rotation.set(0,0,0);rig.position.set(0,0,0);rig.scale.set(1,1,1);m.material.color.setHex(0xffffff);
 const fp=s.L.fp,pn=fp?(fp[st]||fp.idle):(POSEMAP[st]||'idle');s.setPose(pn);
 if(st==='run'){rig.position.y=Math.abs(Math.sin(t*10*k))*.14;rig.rotation.z=Math.sin(t*10*k)*.05}
 else if(st==='jump'){rig.scale.set(.94,1.07,1)}
 else if(st==='slide'){rig.rotation.z=-.5;rig.position.y=.1}
 else if(st==='hit'){rig.rotation.z=Math.sin(t*40)*.09;m.material.color.setHex(0xff8a8a)}
 else if(st==='cheer'){rig.position.y=Math.abs(Math.sin(t*5))*.24;rig.rotation.z=Math.sin(t*5)*.06}
 else if(st==='wave'){rig.rotation.z=Math.sin(t*3)*.04;rig.position.y=Math.abs(Math.sin(t*3))*.04}
 else if(st==='angry'){rig.position.y=Math.abs(Math.sin(t*6))*.07;rig.rotation.z=Math.sin(t*13)*.025}
 else if(st==='arms'){rig.position.y=Math.abs(Math.sin(t*3.4))*.05}
 else{const b=Math.sin(t*2.2)*.012;rig.scale.set(1-b,1+b*2,1)}
 const f=c.g.rotation.y<-.25?-1:1;m.scale.set(s.sx*f,s.sy,1);m.rotation.y=-c.g.rotation.y}

/* ---------- characters of the story ---------- */
const HEV_LOOK=resolveLook({hs:'spiky',hc:'#14101c',eyes:'sharp',mouth:'flat',blush:0,skin:'#fde3cf',top:'jacket',tc:'#2e2850',ta:'#f4f4f8',bot:'cargo',bc:'#2c2745',shoe:'sneaker',sc:'#f4f4f8',neck:'hpneck',nc:'#cfd3df',ear:1,fp:{idle:'pocket',arms:'cross',angry:'cross',wave:'peace',cheer:'peace',hit:'pocket'}});
const DAGS_LOOK=resolveLook({hs:'crop',hc:'#14101c',eyes:'sharp',mouth:'grin',blush:0,skin:'#e0a982',top:'tee',tc:'#2a2838',ta:'#f2b53a',bot:'cargo',bc:'#2b2838',shoe:'sneaker',sc:'#2a2838',hat:'backcap',hatc:'#2a2638',eyew:'shades',neck:'chain',nc:'#f2c04a',ear:1,fp:{idle:'cross',arms:'cross',angry:'point',wave:'peace',cheer:'peace',hit:'cross'}});
const BOSS_LOOK=resolveLook({hs:'crop',hc:'#14101c',eyes:'sharp',mouth:'flat',blush:0,skin:'#c99468',top:'tee',tc:'#2a2836',ta:'#2a2836',bot:'cargo',bc:'#2b2838',shoe:'sneaker',sc:'#f4f4f8',hat:'backcap',hatc:'#2a2638',eyew:'shades',neck:'chain',nc:'#f2c04a',fh:'goatee',ear:1,fp:{idle:'pocket',arms:'cross',angry:'point',wave:'peace',cheer:'peace',hit:'cross'}});
/* the 12 starter styles (+ one unlockable) - all fully editable afterwards */
const STYLES=[
 {id:'b0',n:'Varsity Kid',g:'m',look:{hs:'side',hc:'#1a1a30',eyes:'wide',skin:'#f6d2b8',top:'varsity',tc:'#24336e',ta:'#f4f4f8',bot:'cargo',bc:'#252a44',sc:'#f4f4f8',extra:'backpack',xc:'#1e1d26'}},
 {id:'b1',n:'Chill Hoodie',g:'m',look:{hs:'side',hc:'#3b2418',eyes:'sharp',mouth:'flat',skin:'#f1c8a6',top:'jacket',tc:'#e8eaf0',ta:'#2e2850',bot:'cargo',bc:'#4a4d52',hat:'hphead',hatc:'#cfd3df',neck:'chain',nc:'#d9dbe6',extra:'backpack',xc:'#1e1d26'}},
 {id:'b2',n:'Cool Shades',g:'m',look:{hs:'spiky',hc:'#1b1530',mouth:'grin',skin:'#ebbf98',top:'tee',tc:'#2e2c3c',ta:'#7ab8ff',bot:'cargo',bc:'#2c2a38',eyew:'shades',neck:'chain',nc:'#d9dbe6',fp:null}},
 {id:'b3',n:'Blond Drift',g:'m',look:{hs:'side',hc:'#e0c88c',eyes:'sharp',mouth:'flat',skin:'#f6d2b8',top:'jacket',tc:'#2e2c3a',ta:'#8a8d96',bot:'cargo',bc:'#6a6a4a',extra:'backpack',xc:'#2e2c3a'}},
 {id:'b4',n:'Court 23',g:'m',look:{hs:'spiky',hc:'#14101c',eyes:'sharp',mouth:'flat',skin:'#d09a70',top:'jersey',tc:'#2e2c3a',bot:'shorts',bc:'#2e2c3a',shoe:'hightop',sc:'#2e2c3a',hat:'headband',hatc:'#4a8ff0',extra:'ball'}},
 {id:'b5',n:'Study Buddy',g:'m',look:{hs:'side',hc:'#3a2418',eyes:'dot',mouth:'flat',skin:'#f1c8a6',top:'vest',tc:'#d8c49a',ta:'#ffffff',bot:'jeans',bc:'#1e2036',eyew:'glasses'}},
 {id:'g0',n:'Campus Pop',g:'f',look:{hs:'long',hc:'#6a3a22',eyes:'wide',skin:'#fde3cf',top:'varsity',tc:'#24336e',ta:'#ffffff',bot:'skirt',bc:'#2a3560',extra:'backpack',xc:'#ff9ac4'}},
 {id:'g1',n:'Pink Beat',g:'f',look:{hs:'long',hc:'#3b2418',eyes:'wink',mouth:'grin',skin:'#fde3cf',top:'jacket',tc:'#ff9ac4',ta:'#ffffff',bot:'cargo',bc:'#c9c6ee',shoe:'sneaker',sc:'#ff9ac4',hat:'hphead',hatc:'#ff9ac4'}},
 {id:'g2',n:'Street Queen',g:'f',look:{hs:'long',hc:'#14101c',eyes:'wide',mouth:'flat',skin:'#f6d2b8',top:'crop',tc:'#2e2c3c',bot:'cargo',bc:'#2c2a38',shoe:'sneaker',sc:'#2c2a38',neck:'chain',nc:'#d9dbe6'}},
 {id:'g3',n:'Pep Squad',g:'f',look:{hs:'pony',hc:'#6a3a22',eyes:'wink',mouth:'grin',skin:'#fde3cf',top:'cheer',tc:'#3a6ae0',bot:'skirt',bc:'#3a6ae0',shoe:'sneaker',sc:'#3a6ae0',fp:{idle:'cheer',arms:'cheer',angry:'cheer',wave:'cheer',cheer:'cheer',hit:'idle'}}},
 {id:'g4',n:'Cozy Beret',g:'f',look:{hs:'long',hc:'#4a2c1c',eyes:'dot',mouth:'smile',skin:'#fde3cf',top:'vest',tc:'#f4cdc4',ta:'#fff6f0',bot:'skirt',bc:'#cfa27a',hat:'beret',hatc:'#fff6f0',shoe:'sneaker',sc:'#fff6f0'}},
 {id:'g5',n:'Neko Hood',g:'f',look:{hs:'long',hc:'#2a1f3a',eyes:'wide',mouth:'cat',skin:'#fde3cf',top:'jacket',tc:'#2e2c3a',ta:'#ff7ab8',bot:'cargo',bc:'#2c2a38',hat:'catears',neck:'hpneck',nc:'#ff9ac4'}}];
const BONUS_STYLES=[{id:'dags',n:'Dags Streetwear',g:'m',need:'bossWon',look:Object.assign({},DAGS_LOOK,{fp:null,eyes:'wide',mouth:'grin',eyew:'',hs:'crop',hat:'backcap'})}];
const stylesAvail=()=>STYLES.concat(BONUS_STYLES.filter(b=>S[b.need]));
STYLES.forEach(s=>{s.look=resolveLook(s.look)});BONUS_STYLES.forEach(s=>{s.look=resolveLook(s.look)});
function loadArt(){return Promise.resolve()}

/* ============ pixel-art environments: one unique painter per map ============
   Every map is drawn on a tiny canvas (about 256x144), then scaled up with nearest-neighbour.
   The same painters make the home screen, the in-run backdrops and the map cards. */
const mkCv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const NAT={plaza:'n',intramuros:'n',tondo:'n',binondo:'n',divisoria:'d',banaue:'d',palawan:'d',bohol:'d',siargao:'n',biringan:'n',balete:'n',mansion:'n',kapre:'n',tikbalang:'n',stage:'n'};
const DAYSKY={balete:['#5ab090','#98d8b8','#e0f8e8'],mansion:['#6a7a98','#98a4b8','#d8dce8'],biringan:['#b890f0','#e8b8f8','#fff0ff'],tikbalang:['#b88ac8','#e0b0d0','#ffe8d0'],kapre:['#4a9a3a','#98c868','#f0f8c0'],binondo:['#5aa8e0','#a0d0f0','#f8e0b0'],siargao:['#2a9ae8','#6ad0f8','#e8f8ff'],tondo:['#4a98e0','#90c8f0','#ffe8c0']};
const DEFDAY=['#3a8fe0','#7ac4f4','#d8f0ff'],DEFNIGHT=['#06082a','#1a1a5a','#3a3a8a'];
function painter(w,h,seed0=7,alt=false,pid=''){const c=mkCv(w,h),g=c.getContext('2d');let sd=seed0;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
 const R=(x,y,a,b,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.max(0,Math.round(a)),Math.max(0,Math.round(b)))};
 const E=(cx,cy,rx,ry,col)=>{g.fillStyle=col;for(let y=-Math.ceil(ry);y<=Math.ceil(ry);y++){const k=1-(y*y)/(ry*ry);if(k<0)continue;const hw=Math.round(rx*Math.sqrt(k));g.fillRect(Math.round(cx-hw),Math.round(cy+y),hw*2+1,1)}};
 let hzv=0;const D=(cx,cy,r,col)=>{if(alt&&NAT[pid]==='n'&&r>=7&&cy<hzv*.55&&/^#(f|e|d[89a-f])/i.test(col))return;E(cx,cy,r,r,col)};
 const TRI=(cx,top,hg,hw,col)=>{for(let i=0;i<hg;i++){const half=Math.round(hw*(i+1)/hg);R(cx-half,top+i,half*2+1,1,col)}};
 const lerp=(a,b,t)=>mixC(a,b,t);
 const sky=(stops,to)=>{hzv=to;if(alt)stops=NAT[pid]==='n'?(DAYSKY[pid]||DEFDAY):DEFNIGHT;const n=stops.length-1;for(let y=0;y<to;y++){const t=Math.floor(y/to*14)/14*n,i=Math.min(n-1,Math.floor(t));R(0,y,w,1,lerp(stops[i],stops[i+1],t-i))}
 if(alt){if(NAT[pid]==='n'){D2(w*.74,to*.3,9,'#fff7b0');g.globalAlpha=.25;D2(w*.74,to*.3,15,'#fff7b0');g.globalAlpha=1}else{for(let i=0;i<70;i++){const x=rnd()*w,y=rnd()*to*.8;R(x,y,1,1,'#ffffff');if(rnd()<.15){R(x-1,y,3,1,'#fff');R(x,y-1,1,3,'#fff')}}D2(w*.2,to*.28,9,'#ffffff');g.globalAlpha=.3;D2(w*.2,to*.28,15,'#ffffff');g.globalAlpha=1}}};
 const D2=(cx,cy,r,col)=>E(cx,cy,r,r,col);
 const stars=(n,ymax,col='#fff')=>{if(alt)return;for(let i=0;i<n;i++){const x=rnd()*w,y=rnd()*ymax;R(x,y,1,1,col);if(rnd()<.18){R(x-1,y,3,1,col);R(x,y-1,1,3,col)}}};
 const ridge=(base,amp,per,col,ph=0)=>{for(let x=0;x<w;x++){const y=base-Math.round(amp*(.5+.5*Math.sin(x/per+ph)+.35*Math.sin(x/(per*.43)+ph*2.1)));R(x,y,1,h-y,col)}};
 const cloud=(cx,cy,s,col='#fff',sh='#dfe9ff')=>{D(cx,cy,3*s,col);D(cx+4*s,cy+1,2.4*s,col);D(cx-4*s,cy+1,2.4*s,col);R(cx-6*s,cy+1*s,12*s,2*s,col);R(cx-6*s,cy+2.6*s,12*s,1,sh)};
 const pine=(x,y,s,c1='#1d6a3a',c2='#2f9a54',tr='#5a3a22')=>{R(x-1,y-3*s,2,3*s,tr);for(let i=0;i<3;i++){TRI(x,y-6*s-i*4*s,6*s,(5-i)*s*.9+1,i%2?c2:c1)}};
 const rtree=(x,y,s,c1='#2f8a3a',c2='#46b04e',tr='#5a3a22')=>{R(x-1,y-5*s,2,5*s,tr);D(x,y-8*s,5*s,c1);D(x-3*s,y-6*s,3.5*s,c1);D(x+3*s,y-6*s,3.5*s,c1);D(x-1,y-10*s,3*s,c2)};
 const palm=(x,y,s,lean=1,lf='#2fa04a',lf2='#56c85e')=>{for(let i=0;i<10*s;i++)R(x+Math.round(Math.sin(i/(5*s))*2*s*lean),y-i,2,1,'#8a5a2a');const tx=x+Math.round(Math.sin(2)*2*s*lean),ty=y-10*s;for(const[dx,dy]of[[-7,2],[-5,-1],[-2,-3],[3,-3],[6,-1],[8,2]]){for(let t=0;t<5;t++)R(tx+dx*s*t/5+(dx>0?1:-1),ty+dy*s*t/5+t*t*.18*s,2,2,t%2?lf2:lf)}D(tx,ty+1,1.5,'#7a4a20')};
 const win=(x,y,a,b,lit,fr='#2a1a3a')=>{R(x,y,a,b,fr);R(x+1,y+1,a-2,b-2,lit)};
 const house=(x,y,a,b,wall,roof,lit,s=1)=>{R(x,y-b,a,b,wall);R(x,y-1,a,1,shadeC(wall));TRI(x+a/2,y-b-a*.32,Math.round(a*.32)+1,a/2+1,roof);for(let i=0;i<Math.floor(a/6);i++)win(x+2+i*6,y-b+3,3,4,lit);R(x+a/2-1,y-4,3,4,shadeC(wall))};
 const church=(x,y,s,wall='#d8c08e',roof='#8a3a2a',lit='#ffe27a')=>{R(x-14*s,y-18*s,28*s,18*s,wall);R(x-14*s,y-1,28*s,1,shadeC(wall));TRI(x,y-26*s,8*s,15*s,roof);
  for(const sx of[-1,1]){const tx=x+sx*11*s;R(tx-4*s,y-32*s,8*s,32*s,lerp(wall,'#ffffff',.1));R(tx-4*s,y-1,8*s,1,shadeC(wall));TRI(tx,y-40*s,8*s,5*s,roof);R(tx,y-47*s,1,7*s,'#f2c04a');R(tx-2,y-45*s,5,1,'#f2c04a');win(tx-1,y-28*s,3,6*s,lit)}
  R(x-3*s,y-10*s,6*s,10*s,'#3a2418');E(x,y-10*s,3*s,2*s,'#3a2418');win(x-1,y-22*s,3,6*s,lit);for(const dx of[-8,8])win(x+dx*s-1,y-14*s,3,5*s,lit)};
 const lamp=(x,y,s=1,glow='#ffd48a')=>{R(x,y-16*s,2,16*s,'#14101c');R(x-2,y-19*s,6,4*s,'#14101c');R(x-1,y-18*s,4,3*s,glow);g.globalAlpha=.25;D(x+1,y-17*s,7*s,glow);g.globalAlpha=.12;D(x+1,y-17*s,12*s,glow);g.globalAlpha=1};
 const bunting=(x0,x1,y,sag,cols)=>{const n=Math.floor((x1-x0)/6);for(let i=0;i<=n;i++){const t=i/n,x=x0+(x1-x0)*t,yy=y+Math.round(Math.sin(t*Math.PI)*sag);R(x,yy,1,1,'#e8e0f0');R(x-1,yy+1,3,1,cols[i%cols.length]);R(x,yy+2,1,1,cols[i%cols.length])}};
 return{alt,c,g,w,h,rnd,R,E,D,TRI,sky,stars,ridge,cloud,pine,rtree,palm,win,house,church,lamp,bunting,lerp}}

/* ---------- map painters: p = painter, hz = horizon row ---------- */
const SC={};
SC.plaza=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#120a3a','#3a1a7a','#b04a9a','#ff9a8a'],hz+4);p.stars(60,hz*.5);D(w*.8,hz*.22,11,'#fff6d8');D(w*.8-3,hz*.22-2,2,'#e6dcc0');D(w*.8+3,hz*.22+3,3,'#e6dcc0');g2(p,w*.8,hz*.22,15,'#ffd8f0',.12);
 p.ridge(hz-10,10,26,'#2a1a5a',1);for(let i=0;i<9;i++)p.rtree(10+i*30+p.rnd()*12,hz-4,2,'#1a4a4a','#2a6a5a');
 p.church(w*.3,hz+2,1.5);p.house(w*.5,hz+4,30,20,'#c9a46a','#6a2a2a','#ffe27a');p.house(w*.64,hz+2,26,26,'#9a7aa8','#4a2a5a','#ffd24a');p.house(w*.04,hz+4,26,18,'#b0845a','#5a2a2a','#ffe27a');
 for(let i=0;i<6;i++)p.rtree(w*.38+i*26,hz+8,3,'#1f6a36','#38a04a');
 R(0,hz+4,w,h,'#3a2a58');for(let y=hz+4;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#4a3470','#1e1038',t))}
 R(w*.18,hz+4,w*.64,h,'#6a5a8a');for(let y=hz+4;y<h;y+=3)for(let x=w*.18+((y/3)%2)*3;x<w*.82;x+=6)R(x,y,5,2,((x+y)%4)?'#7a6a9a':'#5a4a7a');
 E(w*.5,hz+22,14,5,'#3a6ab0');E(w*.5,hz+21,11,3,'#5a9ae0');R(w*.5-1,hz+8,3,12,'#cfd8f0');E(w*.5,hz+8,5,2,'#8ab8f0');
 p.lamp(w*.06,hz+26,1.6);p.lamp(w*.94,hz+26,1.6);p.lamp(w*.78,hz+18,1.1);p.bunting(w*.06,w*.5,hz-18,8,['#ff4fa3','#ffd24a','#5ee0ff','#ffffff']);p.bunting(w*.5,w*.94,hz-18,8,['#5ee0ff','#ff4fa3','#ffd24a','#fff']);
 for(let i=0;i<26;i++)R(p.rnd()*w,hz+p.rnd()*(h-hz),1,1,['#ffe27a','#ff9ad0','#9ae8ff'][i%3])};
function g2(p,x,y,r,col,a){p.g.globalAlpha=a;p.E(x,y,r,r,col);p.g.globalAlpha=1}
SC.intramuros=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#1a1f5c','#5a3aa8','#d9708a','#ffb36b'],hz+4);p.stars(40,hz*.4);D(w*.18,hz*.3,9,'#fff0d0');
 p.ridge(hz-4,6,30,'#3a2f7a',2);R(0,hz-4,w,6,'#3a2f7a');for(let x=0;x<w;x+=8)R(x,hz-10,5,6,'#8a6a4a');
 for(const[x,s]of[[w*.3,1.4],[w*.7,1.2]])p.church(x,hz+6,s,'#d9b882','#8f3b2a');
 for(let i=0;i<7;i++){const x=i*(w/6.5)-4;p.house(x,hz+12,30,22+(i%3)*5,['#d9b882','#c99a6b','#e0c896','#b98a64'][i%4],'#8f3b2a','#ffd48a')}
 for(let y=hz+12;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#6a4a3a','#2a1a2a',t))}
 R(w*.25,hz+12,w*.5,h,'#5a4a6a');for(let y=hz+12;y<h;y+=3)for(let x=w*.25+((y/3)%2)*3;x<w*.75;x+=6)R(x,y,5,2,((x+y)%4)?'#6a5a7a':'#4a3a5a');
 p.lamp(w*.2,hz+30,1.5);p.lamp(w*.8,hz+30,1.5);p.bunting(w*.1,w*.9,hz-8,10,['#ff4fa3','#ffd24a','#5ee0ff','#fff'])};
SC.tondo=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#20174d','#8a3a7a','#e8706a','#ffa45b'],hz+4);p.stars(24,hz*.35);D(w*.7,hz*.28,8,'#ffe0b0');
 p.ridge(hz-6,8,20,'#4a2a6a',1);const cols=['#e0795a','#58b4c9','#e8c04f','#8cc7a1','#d9627d','#9a8fd8'];
 for(let i=0;i<14;i++){const x=i*19-6+p.rnd()*4,b=20+Math.floor(p.rnd()*26),c=cols[i%6];R(x,hz+10-b,17,b,c);R(x,hz+9,17,1,shadeC(c));R(x-1,hz+10-b-2,19,3,'#4a3a4a');for(let wy=hz+10-b+4;wy<hz+4;wy+=7)for(let wx=x+2;wx<x+15;wx+=5)p.win(wx,wy,3,4,p.rnd()<.6?'#ffd48a':'#2a2a4a');if(i%3===0){R(x+2,hz+10-b-6,1,5,'#222');R(x+4,hz+10-b-6,1,5,'#222')}}
 for(let i=0;i<7;i++){const x=i*40+6;R(x,hz-12,1,18,'#14101c');for(let k=0;k<10;k++)R(x+k*3,hz-8+Math.round(Math.sin(k)*2),1,1,'#14101c')}
 p.bunting(0,w*.5,hz-10,8,['#ff4fa3','#ffd24a','#5ee0ff','#ff7a3c']);p.bunting(w*.5,w,hz-10,8,['#ffd24a','#5ee0ff','#ff4fa3','#9a7bff']);
 for(let y=hz+10;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#6a5a5a','#2a1e2a',t))}for(let i=0;i<30;i++)R(p.rnd()*w,hz+14+p.rnd()*(h-hz-14),3,1,'#8a7a7a');
 p.lamp(w*.12,hz+30,1.4,'#ffb86b');p.lamp(w*.88,hz+30,1.4,'#ffb86b')};
SC.binondo=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#2a0f3a','#7a1f5a','#d9402a','#ff7a3c'],hz+4);p.stars(24,hz*.3);D(w*.5,hz*.4,13,'#ffd07a');p.g.globalAlpha=.25;D(w*.5,hz*.4,20,'#ff9a5a');p.g.globalAlpha=1;
 p.ridge(hz-4,5,22,'#3a1030',3);
 const pagoda=(x,y,s,wall,roof)=>{for(let i=0;i<4;i++){const ww=(22-i*4)*s,yy=y-i*12*s;R(x-ww/2,yy-9*s,ww,9*s,wall);R(x-ww/2-3*s,yy-11*s,ww+6*s,3*s,roof);R(x-ww/2-4*s,yy-9*s,2*s,2*s,roof);R(x+ww/2+2*s,yy-9*s,2*s,2*s,roof);for(let k=0;k<2;k++)p.win(x-ww/2+3*s+k*8*s,yy-7*s,3*s,4*s,'#ffd24a')}R(x,y-52*s,1,8*s,'#f2c04a')};
 pagoda(w*.2,hz+8,1,'#b8302b','#2a2a3a');pagoda(w*.8,hz+8,1.1,'#c4402b','#2a2a3a');
 for(let i=0;i<9;i++){const x=i*30+2,b=18+(i%3)*8;R(x,hz+10-b,26,b,['#a82a2a','#c4302b','#8a1f2a'][i%3]);R(x-2,hz+10-b-3,30,4,'#2a2a3a');for(let k=0;k<3;k++)p.win(x+4+k*8,hz+10-b+5,4,5,'#ffd24a');}
 R(w*.4,hz-26,w*.2,3,'#d9302a');R(w*.4,hz-26,2,34,'#d9302a');R(w*.6-2,hz-26,2,34,'#d9302a');R(w*.4-2,hz-30,w*.2+4,4,'#2a2a3a');
 for(let i=0;i<16;i++){const x=6+i*16,y=hz-4+Math.round(Math.sin(i)*3);R(x,y-6,1,6,'#14101c');E(x,y+1,3,4,'#e8302a');R(x-1,y,3,1,'#ffb040');R(x,y+4,1,2,'#f2c04a')}
 for(let y=hz+10;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#5a2a2a','#1e0f1a',t))}for(let y=hz+10;y<h;y+=4)for(let x=(y/4%2)*5;x<w;x+=10)R(x,y,9,3,'#6a3434');};
SC.divisoria=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#10305a','#3a8fd9','#9ad0f0','#ffe9a8'],hz+4);p.cloud(w*.2,hz*.3,2);p.cloud(w*.62,hz*.2,2);p.cloud(w*.86,hz*.42,1);
 p.ridge(hz-4,6,24,'#6a9ad0',1);const aw=['#e8302a','#ffd35a','#3ab8d9','#ff8a5a','#8fe08f','#b59bff'];
 for(let i=0;i<8;i++){const x=i*33-4,b=24+(i%4)*7;R(x,hz+10-b,30,b,['#4fc3d9','#ff9fbf','#ffd35a','#8fe08f'][i%4]);R(x-1,hz+10-b-2,32,3,'#2a3a5a');for(let k=0;k<3;k++)p.win(x+3+k*9,hz+10-b+4,5,6,'#cfe8ff')}
 for(let i=0;i<9;i++){const x=i*29-2;for(let k=0;k<8;k++){R(x+k*3,hz+2,3,6,k%2?aw[i%6]:'#ffffff')}R(x-1,hz+8,26,1,shadeC(aw[i%6]));R(x,hz+9,2,10,'#6a4a2a');R(x+22,hz+9,2,10,'#6a4a2a');R(x+2,hz+13,20,4,'#a8702e');for(let k=0;k<6;k++)D(x+4+k*3.5,hz+12,1.6,['#ff4a3a','#ffd24a','#8fd84a','#ff8a3a'][k%4])}
 for(let i=0;i<14;i++){const x=i*18+4;R(x,hz-14,1,8,'#222');R(x,hz-14,6,4,aw[i%6]);}
 for(let y=hz+19;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#7a7a8a','#3a3a4a',t))}for(let i=0;i<24;i++)R(p.rnd()*w,hz+24+p.rnd()*(h-hz-24),4,1,'#9a9aaa')};
SC.banaue=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#4a9ae8','#8ad0f8','#d8f0ff'],hz);p.cloud(w*.25,hz*.28,2);p.cloud(w*.7,hz*.18,3);p.cloud(w*.9,hz*.4,1);
 p.ridge(hz-18,16,40,'#7aa8c8',.5);p.ridge(hz-10,18,30,'#3a8a6a',2);
 for(let t=0;t<9;t++){const y=hz-6+t*7;for(let x=0;x<w;x++){const o=Math.round(Math.sin(x/(22-t)+t)*3);R(x,y+o,1,7,t%2?'#4ab04a':'#6ad05a');R(x,y+o,1,1,'#2a7a3a');}R(0,y+8,w,1,'#a8e08a')}
 for(let i=0;i<5;i++){const x=20+i*48;R(x,hz-8+i%3*5,6,5,'#8a5a2a');TRI(x+3,hz-12+i%3*5,5,5,'#c8a05a');}
 for(let i=0;i<8;i++)p.pine(10+i*34+p.rnd()*10,hz+12+p.rnd()*8,1.2,'#1d6a3a','#2f9a54');
 R(0,h-14,w,14,'#5a3a22');for(let x=0;x<w;x+=5)R(x,h-14+((x/5)%2),4,1,'#7a5232')};
SC.palawan=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#2a9ae8','#6ad0f8','#c8f0ff'],hz);p.cloud(w*.3,hz*.3,2);p.cloud(w*.75,hz*.2,2);
 for(const[x,s,hh]of[[w*.1,16,50],[w*.28,12,38],[w*.8,18,56],[w*.92,12,34]]){for(let y=0;y<hh;y++){const k=Math.sin((y/hh)*Math.PI*.55+.4);R(x-s*k,hz-y,s*2*k,1,y%7===0?'#8a8070':'#b0a690')}R(x-s*.9,hz-hh,s*1.8,3,'#2f8a3a');for(let k=0;k<4;k++)D(x-s*.6+k*s*.4,hz-hh-2,3,'#3aa04a')}
 for(let y=hz;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#3ae0e0','#1a7ab8',t))}for(let i=0;i<70;i++){const x=p.rnd()*w,y=hz+3+p.rnd()*(h-hz-3);R(x,y,4,1,'#bff8ff')}
 E(w*.5,hz+2,22,3,'#e8d8a8');p.palm(w*.45,hz+3,1.6,1);p.palm(w*.56,hz+3,1.3,-1);
 R(w*.62,hz+8,18,1,'#8a5a2a');R(w*.64,hz+4,14,4,'#a8702e');TRI(w*.64+7,hz,5,9,'#d9b070');
 p.TRI(w*.36,hz+12,6,3,'#f4f4f8');R(w*.36,hz+8,1,6,'#6a4a2a');R(w*.34,hz+16,8,2,'#8a5a2a');
 R(0,h-12,w,12,'#e8d8a8');for(let i=0;i<30;i++)R(p.rnd()*w,h-12+p.rnd()*12,2,1,'#c8b888')};
SC.bohol=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#2a6ad8','#7ab8f0','#e8f4d8','#ffe9a8'],hz);for(let y=hz;y<hz+10;y++)R(0,y,w,1,'#9cc44a');p.cloud(w*.2,hz*.35,2);p.cloud(w*.8,hz*.22,2);
 for(let i=0;i<16;i++){const x=i*17-4+p.rnd()*8,r=9+p.rnd()*9,y=hz+2;E(x,y,r,r*.8,i%2?'#b6d95a':'#9cc44a');for(let k=0;k<4;k++)R(x-r*.5+k*r*.3,y-r*.5+k,1,r*.4,'#7aa83a');}
 for(let i=0;i<10;i++){const x=i*26+p.rnd()*10,r=8+p.rnd()*10;E(x,hz+14,r,r*.7,i%2?'#a8d050':'#8cb83c');E(x-r*.3,hz+10,r*.3,r*.2,'#cfe880')}
 for(let y=hz+8;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#6aa84a','#2a6a2a',t))}
 for(let i=0;i<6;i++)p.rtree(14+i*44+p.rnd()*10,hz+22+p.rnd()*10,2.4,'#2a7a2a','#46b04e');
 R(w*.55,hz+30,6,1,'#5a3a22');for(let i=0;i<20;i++)R(p.rnd()*w,hz+20+p.rnd()*(h-hz-20),1,1,'#ffe27a');
 R(0,h-12,w,12,'#9a7a4a');for(let x=0;x<w;x+=6)R(x,h-12,5,1,'#bf9a5a')};
SC.siargao=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#2a1a6a','#b83a8a','#ff7a5a','#ffcf6a'],hz+2);p.stars(24,hz*.4);D(w*.5,hz-2,16,'#fff1a8');D(w*.5,hz-2,12,'#ffe27a');
 for(let y=hz;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#ff9a6a','#2a4a9a',t))}for(let i=0;i<80;i++){const x=p.rnd()*w,y=hz+2+p.rnd()*(h-hz)*.6;R(x,y,3+p.rnd()*4,1,'#ffe9a8')}
 for(let i=0;i<9;i++){const x=w*.5-9+i*2;R(x,hz+2+i*2,Math.max(1,6-i),1,'#ffe9a8')}
 for(let i=0;i<4;i++){const x=18+i*58+p.rnd()*8,y=hz+10+i%2*6;R(x,y,10,1,'#f4f4f8');R(x+4,y-8,1,8,'#6a4a2a');TRI(x+5,y-8,8,5,'#f4f4f8');}
 p.palm(w*.12,hz+26,2,1);p.palm(w*.2,hz+22,1.7,-1);p.palm(w*.88,hz+26,2,-1);p.palm(w*.78,hz+22,1.6,1);
 R(w*.4,hz+16,w*.2,2,'#6a4a2a');R(w*.42,hz+10,w*.16,6,'#a8702e');TRI(w*.5,hz+4,6,w*.1,'#d9b070');
 R(0,h-16,w,16,'#f0d8a0');for(let i=0;i<40;i++)R(p.rnd()*w,h-16+p.rnd()*16,2,1,'#d8b878');
 for(let i=0;i<4;i++){const x=40+i*60;R(x,h-24,2,12,'#4ab0d8');R(x-1,h-24,4,3,'#ff4fa3')}};
SC.biringan=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#120a3a','#3a1a7a','#7a3aa8','#d9a0ff'],hz+4);p.stars(70,hz*.7,'#e8d8ff');D(w*.5,hz*.3,12,'#f4e8ff');p.g.globalAlpha=.2;D(w*.5,hz*.3,22,'#d9a0ff');p.g.globalAlpha=1;
 p.ridge(hz-4,6,24,'#2a1a5a',1);
 const spire=(x,y,s,c)=>{R(x-4*s,y-18*s,8*s,18*s,c);TRI(x,y-30*s,12*s,6*s,'#e8c8ff');R(x-1,y-34*s,1,5*s,'#ffe27a');for(let k=0;k<3;k++)p.win(x-3*s+k*2.6*s,y-14*s,2*s,4*s,'#ffe27a')};
 for(let i=0;i<9;i++)spire(14+i*29,hz+6,1+(i%3)*.3,['#5a3a9a','#7a4ab8','#4a2a8a'][i%3]);
 for(let i=0;i<7;i++){const x=i*40+10;R(x,hz-8,1,16,'#14101c');D(x,hz-9,3,'#ffe27a');p.g.globalAlpha=.25;D(x,hz-9,8,'#ffd24a');p.g.globalAlpha=1}
 for(let y=hz+6;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#5a3a8a','#1a0c3a',t))}R(w*.3,hz+6,w*.4,h,'#7a5aaa');for(let y=hz+6;y<h;y+=4)R(w*.3,y,w*.4,1,'#8a6aba');
 for(let i=0;i<30;i++)R(p.rnd()*w,hz+p.rnd()*(h-hz),1,1,['#ffe27a','#9ae8ff','#ffa0e8'][i%3]);
 for(let i=0;i<5;i++){p.g.globalAlpha=.18;p.E(p.rnd()*w,hz+10+p.rnd()*30,30,3,'#e8d8ff');p.g.globalAlpha=1}};
SC.balete=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#06140e','#0e3a2a','#1a5a3a'],hz+4);p.stars(30,hz*.4,'#bfffd8');D(w*.82,hz*.25,8,'#d8ffe8');
 p.ridge(hz-8,10,26,'#0a2a20',1);for(let i=0;i<10;i++)p.pine(8+i*28+p.rnd()*8,hz+6,1.5,'#0a3a2a','#145a3a');
 const trunk=(x,y,s)=>{R(x-12*s,y-70*s,24*s,70*s,'#2a1a10');for(let k=-3;k<=3;k++)R(x+k*3*s,y-70*s,1,70*s,'#3a2418');for(let k=0;k<6;k++){const rx=x-18*s+k*7*s;for(let t=0;t<30*s;t++)R(rx+Math.round(Math.sin(t/6+k)*3),y-30*s+t,2,1,'#3a2418')}D(x,y-72*s,24*s,'#0e4a2e');D(x-14*s,y-64*s,15*s,'#0a3a24');D(x+16*s,y-66*s,16*s,'#0a3a24');
  for(let k=0;k<12;k++){const gx=x-20*s+p.rnd()*40*s;R(gx,y-40*s+p.rnd()*40*s,1,4*s,'#5eff9a')}E(x,y-36*s,4*s,6*s,'#14101c');R(x-2*s,y-38*s,2,2,'#8aff9a');R(x+1*s,y-38*s,2,2,'#8aff9a')};
 trunk(w*.5,hz+14,.72);
 for(let y=hz+10;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#1a3a22','#08140c',t))}for(let i=0;i<26;i++)R(p.rnd()*w,hz+p.rnd()*(h-hz),1,1,['#8aff9a','#d8ffe8','#5ef0d0'][i%3]);
 for(let i=0;i<5;i++){p.g.globalAlpha=.2;p.E(p.rnd()*w,hz+12+p.rnd()*30,28,3,'#bfffd8');p.g.globalAlpha=1}};
SC.mansion=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#0a0a2a','#1a1a5a','#3a3a8a'],hz+4);p.stars(50,hz*.6,'#cfd8ff');D(w*.8,hz*.3,12,'#e8f0ff');D(w*.8-3,hz*.3-3,3,'#c0c8e8');
 p.ridge(hz-6,8,24,'#12123a',1);for(let i=0;i<8;i++)p.pine(10+i*34,hz+8,1.5,'#0a1a2a','#102a3a');
 const x=w*.5;R(x-34,hz-30,68,44,'#3a3a6a');R(x-34,hz+13,68,1,'#2a2a4a');TRI(x,hz-52,22,38,'#2a2a52');R(x-48,hz-16,16,30,'#34345e');TRI(x-40,hz-30,14,10,'#24244a');R(x+32,hz-16,16,30,'#34345e');TRI(x+40,hz-30,14,10,'#24244a');R(x-3,hz-62,6,14,'#34345e');TRI(x,hz-70,8,4,'#24244a');
 for(let r=0;r<2;r++)for(let k=0;k<6;k++)p.win(x-28+k*10,hz-26+r*18,6,9,(r===0&&k===3)?'#ffe27a':'#161640');p.g.globalAlpha=.25;p.E(x+2,hz-22,9,8,'#ffe27a');p.g.globalAlpha=1;R(x-4,hz+2,9,12,'#161640');E(x,hz+2,4,3,'#161640');
 for(let i=0;i<16;i++){const gx=6+i*16;R(gx,hz+14,1,14,'#14101c');R(gx-1,hz+14,3,1,'#14101c')}R(0,hz+22,w,1,'#14101c');
 for(let y=hz+14;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#2a2a4a','#0a0a1a',t))}for(let i=0;i<6;i++){p.g.globalAlpha=.16;p.E(p.rnd()*w,hz+14+p.rnd()*30,30,3,'#e8f0ff');p.g.globalAlpha=1}
 const gh=(gx,gy)=>{p.g.globalAlpha=.55;R(gx-3,gy-6,7,10,'#f0f4ff');D(gx,gy-6,3.5,'#f0f4ff');R(gx-1,gy-6,1,2,'#14101c');R(gx+2,gy-6,1,2,'#14101c');p.g.globalAlpha=1};gh(w*.18,hz+6);gh(w*.86,hz+20)};
SC.kapre=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#0a1a0a','#1a3a1a','#3a6a2a','#ffb040'],hz+2);p.stars(20,hz*.3,'#e8ffc8');D(w*.2,hz*.28,7,'#fff0b8');
 p.ridge(hz-10,12,20,'#0a2a12',1);for(let i=0;i<9;i++)p.palm(10+i*30,hz+6,1.4+(i%3)*.3,i%2?1:-1,'#145a2a','#1f8a3a');
 const x=w*.58;R(x-7,hz-80,14,92,'#3a2a1a');for(let k=0;k<5;k++)R(x-6+k*3,hz-80,1,92,'#4a3a22');D(x,hz-82,26,'#145a2a');D(x-20,hz-70,14,'#0e4a22');D(x+20,hz-72,15,'#0e4a22');D(x+2,hz-96,13,'#1f8a3a');
 R(x-26,hz-30,52,3,'#3a2a1a');R(x+8,hz-34,5,6,'#2a1a10');R(x+13,hz-33,4,1,'#8a8a8a');D(x+18,hz-33,1.4,'#ff6a1a');p.g.globalAlpha=.3;D(x+18,hz-33,6,'#ff8a2a');p.g.globalAlpha=1;
 E(x,hz-48,4,7,'#14101c');R(x-3,hz-50,2,2,'#ffb040');R(x+1,hz-50,2,2,'#ffb040');
 for(let y=hz+10;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#2a4a1a','#0a1a08',t))}for(let i=0;i<20;i++)R(p.rnd()*w,hz+14+p.rnd()*(h-hz-14),1,3,'#4a8a2a');
 for(let i=0;i<26;i++)R(p.rnd()*w,hz+p.rnd()*(h-hz),1,1,['#ffd24a','#8aff7a'][i%2])};
SC.tikbalang=(p,hz)=>{const{w,h,R,E,D,TRI}=p;p.sky(['#1a1a3a','#4a3a7a','#8a6aaa','#d8b8d8'],hz+2);p.stars(30,hz*.35,'#f0e8ff');D(w*.3,hz*.3,10,'#fff4e0');
 p.ridge(hz-26,18,50,'#5a4a8a',.3);p.ridge(hz-14,16,34,'#3a2a6a',1.6);p.ridge(hz-4,12,26,'#241a4a',3);
 const tb=(x,y,s)=>{R(x-3*s,y-30*s,6*s,24*s,'#0e0a1a');R(x-5*s,y-8*s,3*s,10*s,'#0e0a1a');R(x+2*s,y-8*s,3*s,10*s,'#0e0a1a');R(x-2*s,y-38*s,6*s,10*s,'#0e0a1a');R(x+2*s,y-36*s,6*s,5*s,'#0e0a1a');TRI(x-2*s,y-42*s,5*s,2*s,'#0e0a1a');R(x,y-35*s,2,2,'#ff4a4a');for(let k=0;k<8;k++)R(x-3*s-2,y-38*s+k*3,2,3,'#0e0a1a')};tb(w*.7,hz+8,1.1);
 for(let i=0;i<4;i++){const x=i*70+20;for(let k=0;k<20;k++)R(x+Math.round(Math.sin(k/3)*4),hz+4+k,2,1,'#14101c');R(x-6,hz+2,12,2,'#14101c')}
 for(let y=hz+6;y<h;y++){const t=(y-hz)/(h-hz);R(0,y,w,1,mixC('#4a3a5a','#14101c',t))}R(w*.4,hz+6,w*.2,h,'#6a5a7a');for(let y=hz+6;y<h;y+=5)R(w*.4,y,w*.2,1,'#7a6a8a');
 for(let i=0;i<6;i++){p.g.globalAlpha=.25;p.E(p.rnd()*w,hz+8+p.rnd()*34,34,4,'#f0e8ff');p.g.globalAlpha=1}for(let i=0;i<18;i++)R(p.rnd()*w,hz+p.rnd()*(h-hz),1,1,'#ffe27a')};
SC.stage=(p,hz)=>{const{w,h,R,E,D,TRI}=p;R(0,0,w,h,'#0b0620');for(let y=0;y<h;y++)R(0,y,w,1,mixC('#1a0f3a','#3a1060',y/h));
 const g=p.g;for(let i=0;i<6;i++){g.globalAlpha=.16;g.fillStyle=['#ff4fa3','#5ee0ff','#ffc94a','#7b4dff','#ffffff','#ff7a1a'][i];g.beginPath();g.moveTo(w*.1+i*w*.16,0);g.lineTo(w*.1+i*w*.16-14,hz);g.lineTo(w*.1+i*w*.16+14,hz);g.fill()}g.globalAlpha=1;
 const tags=[['DAGS','#ff7a1a',w*.1,hz*.5,22],['BEAT','#5ee0ff',w*.62,hz*.34,16],['DTQ','#ff4fa3',w*.7,hz*.72,18],['1990','#b58cff',w*.4,hz*.62,14]];g.textBaseline='middle';for(const[t,c,x,y,s]of tags){g.font=`${s}px "Press Start 2P","Courier New",monospace`;g.fillStyle='#0a0620';g.fillText(t,x+1,y+1);g.fillStyle=c;g.fillText(t,x,y)}
 for(const s of[0,1])for(let k=0;k<2;k++){const sx=s?w-34-k*30:6+k*30,sy=hz-8-k*0;R(sx,sy-34,26,40,'#14141c');R(sx+1,sy-33,24,38,'#1e1e2a');for(const yy of[8,22]){D(sx+13,sy-34+yy+4,6,'#2a2a38');D(sx+13,sy-34+yy+4,3,'#7b4dff')}}
 R(w*.3,hz-4,w*.4,6,'#2a1f55');R(w*.3,hz-4,w*.4,1,'#ff4fa3');
 for(let i=0;i<30;i++){const x=i*(w/29),y=hz+6+(i%2)*3;D(x,y,3,['#2a1a4a','#3a2a6a','#1a1a3a'][i%3]);R(x+2,y-5,1,2,'#e6f2ff')}
 for(let y=hz+8;y<h;y++)R(0,y,w,1,mixC('#2a1a5a','#0e0820',(y-hz)/(h-hz)));for(let x=0;x<w;x+=8)R(x,hz+8,1,h,'#3a2a7a');R(0,hz+8,w,1,'#ff4fa3')};
/* ---------- registry ---------- */
const MAPS={ /* id -> painter, floor look */
 plaza:{n:'Plaza',fl:['#6a5a8a','#5a4a7a','#7a6a9a','cobble']},
 intramuros:{n:'Intramuros',fl:['#6a5a7a','#4a3a5a','#8a7a9a','cobble']},tondo:{n:'Tondo',fl:['#7a6a6a','#5a4a4a','#9a8a8a','dirt']},binondo:{n:'Binondo',fl:['#6a3434','#4a2222','#8a4a4a','brick']},divisoria:{n:'Divisoria',fl:['#7a7a8a','#5a5a6a','#9a9aaa','cobble']},
 banaue:{n:'Banaue',fl:['#6a4a2a','#4a3220','#8a6a3a','dirt']},palawan:{n:'Palawan',fl:['#e8d8a8','#d0be88','#f8ecc0','sand']},bohol:{n:'Bohol',fl:['#9a7a4a','#7a5a32','#bf9a5a','dirt']},siargao:{n:'Siargao',fl:['#f0d8a0','#d8bc80','#fff0c0','sand']},
 biringan:{n:'Biringan City',fl:['#7a5aaa','#5a3a8a','#9a7aca','cobble']},balete:{n:'The Whispering Balete',fl:['#1a3a22','#10281a','#2a5a34','moss']},mansion:{n:'The Midnight Mansion',fl:['#2a2a4a','#1a1a38','#3a3a6a','plank']},kapre:{n:"Kapre's Grove",fl:['#2a4a1a','#1a3410','#3a6a28','moss']},tikbalang:{n:'Tikbalang Trail',fl:['#4a3a5a','#32283e','#6a5a7a','dirt']},
 stage:{n:'Manila Underground Rap Stage',fl:['#2a1a5a','#1e1242','#3a2a7a','plank']}};
const HZ=.64;
const sceneCache={};
function sceneCanvas(id,w,h,alt=false){const k=id+'|'+w+'|'+h+(alt?'A':'');if(sceneCache[k])return sceneCache[k];const p=painter(w,h,id.length*13+5,alt,id);const hz=Math.round(h*HZ);(SC[id]||SC.plaza)(p,hz);gradeAlt(p.g,w,h,id,alt);return sceneCache[k]=p.c}
function gradeAlt(g,w,h,id,alt){if(!alt||id==='stage')return;if(NAT[id]==='n'){g.globalCompositeOperation='screen';g.fillStyle='#46465a'}else{g.globalCompositeOperation='multiply';g.fillStyle='#7a80c4'}g.fillRect(0,0,w,h);g.globalCompositeOperation='source-over'}
function sceneURL(id,w=96,h=64,alt=false){const k='u'+id+w+h+alt;return urlCache[k]||(urlCache[k]=sceneCanvas(id,w,h,alt).toDataURL('image/png'))}
function floorTex(id,alt=false){const f=(MAPS[id]||MAPS.plaza).fl,c=mkCv(32,32),g=c.getContext('2d');g.fillStyle=f[0];g.fillRect(0,0,32,32);const kind=f[3];
 if(kind==='cobble'||kind==='brick'){for(let y=0;y<32;y+=8)for(let x=((y/8)%2)*8;x<40;x+=16){g.fillStyle=f[2];g.fillRect(x-16+1,y+1,14,1);g.fillStyle=f[1];g.fillRect(x-16,y+7,16,1);g.fillRect(x-16+15,y,1,8)}}
 else if(kind==='plank'){for(let y=0;y<32;y+=8){g.fillStyle=f[1];g.fillRect(0,y+7,32,1);g.fillStyle=f[2];g.fillRect(0,y,32,1);g.fillStyle=f[1];g.fillRect(((y/8)*11)%32,y,1,8)}}
 else{let s=3;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<40;i++){g.fillStyle=r()<.5?f[1]:f[2];g.fillRect(r()*32|0,r()*32|0,kind==='moss'?1:2,1)}}
 gradeAlt(g,32,32,id,alt);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t}

/* ---------- tiny icons (ASCII pixel art) for collectibles and hazards ---------- */
const ICONS={
 coin:{p:{y:'#f2c04a',d:'#c98a1a',l:'#fff1a8',k:INKP},a:['..kkkkkk..','.kyyllyyk.','kyylyyyydk','kylyydyyyk','kyyydddyyk','kyydyyyyyk','kyyyyyyydk','.kyyyyydk.','..kddddk..','...kkkk...']},
 gold:{p:{y:'#ffd84a',d:'#d9902a',l:'#fffbd0',k:INKP,r:'#ff8a2a'},a:['...kkkkkk...','..kyyllyyk..','.kyyllyyyyk.','kyyyryyryyyk','kylyyrrryyyk','kyyyyrryyydk','kyyyyyyyyydk','.kyydyyyydk.','..kddddddk..','...kkkkkk...']},
 gem:{p:{c:'#5ee0ff',d:'#1f9ad8',l:'#d8fbff',k:INKP},a:['..kkkkkk..','.kllccccdk','kllccccccdk','kcccccccddk','.kcccccddk.','..kcccddk..','...kcddk...','....kdk....','.....k.....']},
 chest:{p:{b:'#a8702e',d:'#6a4220',g:'#f2c04a',k:INKP,l:'#cf9650'},a:['..kkkkkkkk..','.kbllllllbk.','kbbbbggbbbbk','kdddddggdddk','kkkkkkggkkkk','kbbbbbggbbbk','kbbbbbggbbbk','kddddddgdddk','.kkkkkkkkkk.']},
 mystery:{p:{v:'#7a4dff',d:'#4a2aa8',l:'#c9a8ff',w:'#fff',k:INKP},a:['.kkkkkkkkk.','kvllllllvvk','kvvvwwwvvvk','kvvvvvwvvvk','kvvvvwwvvvk','kvvvvwvvvvk','kvvvvvvvvvk','kvvvvwvvvdk','kddddddddk.','.kkkkkkkkk.']},
 orb:{p:{w:'#ffffff',c:'#7fe8ff',d:'#2a9ad8',y:'#ffd24a',k:INKP},a:['...kkkk...','..kwwccdk.','.kwwccccdk','kyccccccdyk','kyccccccdyk','.kccccccdk.','..kcccddk..','...kkkk...']},
 frag:{p:{g:'#5ef0d0',d:'#1fb89a',l:'#d8fff4',k:INKP},a:['...kkkk...','..kllggk..','.kllgggdk.','kgggggggdk','kggggggddk','.kgggdddk.','..kdddkk..','...kkk....']},
 ticket:{p:{r:'#ff5d73',d:'#c02a4a',w:'#ffffff',k:INKP,y:'#ffd24a'},a:['.kkkkkkkkkk.','krrrrwrrrrrk','kryyrwrrrrrk','krrrrwrryrrk','krrrrwrrrrrk','kddddwddddk.','.kkkkkkkkkk.']},
 note:{p:{v:'#b58cff',d:'#7b4dff',k:INKP,l:'#e8d8ff'},a:['....kkkkk.','....kvvvvk','....kvdkk.','....kvk...','....kvk...','.kkkkvk...','kvllvvk...','kvvvvdk...','.kkkkk....']},
 fake:{p:{v:'#ff6a4a',d:'#c0200a',k:INKP,l:'#ffc0a8'},a:['....kkkkk.','....kvvvvk','....kvdkk.','....kvk...','....kvk...','.kkkkvk...','kvllvvk...','kvvvvdk...','.kkkkk....']},
 mic:{p:{w:'#ffffff',c:'#5ee0ff',s:'#8a8a99',d:'#4a4a5a',k:INKP},a:['..kkkkk..','.kwwcccck.','kwwwccccck','kwccccccck','.kcccccck.','..kkddkk..','...kssk...','...kssk...','...kddk...','....kk....']},
 star:{p:{y:'#ffd84a',d:'#d9902a',l:'#fffbd0',k:INKP},a:['....kk....','...kyyk...','kkkkyylkkk','kyyyyyyyyk','.kyyyyyyk.','..kyyyyk..','..kyykykk.','.kyk..kyk.','.kk....kk.']},
 crate:{p:{b:'#c48a4a',d:'#8a5a2a',l:'#e0aa6a',k:INKP},a:['kkkkkkkkkkkkkkkk','kbbbbbbbbbbbbbbk','kbllllllllllllbk','kblbbbbbbbbbblbk','kbdlbbbbbbbbldbk','kbbdlbbbbbbldbbk','kbbbdlbbbbldbbbk','kbbbbdlbbldbbbbk','kbbbbbdllbbbbbbk','kbbbbbldlbbbbbbk','kbbbbldbbldbbbbk','kbbbldbbbbldbbbk','kbbldbbbbbbldbbk','kbldbbbbbbbbldbk','kbddddddddddddbk','kkkkkkkkkkkkkkkk']},
 barrel:{p:{b:'#d9762a',d:'#8a4a14',l:'#f0a05a',m:'#5a5a6a',k:INKP},a:['..kkkkkkkk..','.kbllbbbbbk.','kmmmmmmmmmmk','kbllbbbbbbdk','kbbbbbbbbbdk','kbbbbbbbbbdk','kmmmmmmmmmmk','kbbbbbbbbbdk','kbbbbbbbbbdk','.kbbbbbbbdk.','..kkkkkkkk..']},
 sale:{p:{r:'#ff4a4a',w:'#ffffff',d:'#a82020',y:'#ffd24a',k:INKP},a:['kkkkkkkkkkkkkk','krrrrrrrrrrrrk','krwwrwwrwwrwrk','krwrrwrrwrrwrk','krwwrwwrwwrwrk','krrrrrrrrrrrrk','kddddddddddddk','kkkkkkkkkkkkkk']},
 wave:{p:{c:'#7fe8ff',p:'#ff9fd6',d:'#2a9ad8',k:INKP},a:['..kkkkkkkk..','.kccccccccpk','kcckkkkkkccpk','kckppppppkcpk','kckpkkkkpkcpk','kckppppppkcpk','kcckkkkkkccpk','.kccccccccpk','..kkkkkkkk..']}};
const iconCache={};
function iconCanvas(name){if(iconCache[name])return iconCache[name];const I=ICONS[name],h=I.a.length,w=Math.max(...I.a.map(r=>r.length)),c=mkCv(w,h),g=c.getContext('2d');I.a.forEach((r,y)=>{for(let x=0;x<r.length;x++){const k=r[x];if(k==='.')continue;g.fillStyle=I.p[k]||'#f0f';g.fillRect(x,y,1,1)}});return iconCache[name]=c}
const iconTex={};
function iconTexture(name){if(iconTex[name])return iconTex[name];const t=new THREE.CanvasTexture(iconCanvas(name));t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return iconTex[name]=t}
function iconSprite(name,size){const c=iconCanvas(name),m=new THREE.SpriteMaterial({map:iconTexture(name),transparent:true,alphaTest:.1});const s=new THREE.Sprite(m);s.scale.set(size*c.width/Math.max(c.width,c.height),size*c.height/Math.max(c.width,c.height),1);return s}
function iconURL(name){const k='i'+name;return urlCache[k]||(urlCache[k]=iconCanvas(name).toDataURL('image/png'))}

/* ---------- pixel pets ---------- */
const petCache={};
function petFitDraw(px,ids,layer){const has=i=>ids.includes(i);
 if(layer==='back'){if(has('pcape')){px.part(rc(7,22,22,16),'#c0392b');px.part(rc(7,36,22,2),'#ffc94a',{ol:false,sh:false})}return}
 if(has('pcrown'))px.part(or(rc(12,4,13,3),tri(12,-1,4,5),tri(16,-2,5,6),tri(21,-1,4,5)),'#ffc94a');
 if(has('party')){px.part(tri(13,-3,10,11),'#ff4fa3');px.dot(17,-3,'#ffe27a');px.part(rc(15,3,6,1),'#ffffff',{ol:false,sh:false})}
 if(has('pwiz')){px.part(tri(11,-4,15,12),'#3b2a8a');px.part(rc(8,6,21,2),'#2e2070');px.dot(17,0,'#ffd24a')}
 if(has('phalo'))px.part(and(ell(18,2,8,2.4),not(ell(18,2,5.5,1.1))),'#ffe27a',{ol:false,sh:false});
 if(has('pshade')){px.part(or(rc(10,15,6,4),rc(20,15,6,4),rc(16,16,4,1)),INKP,{ol:false,sh:false});px.dot(11,16,'#7a7ab8');px.dot(21,16,'#7a7ab8')}
 if(has('pbow')){px.part(or(rc(11,25,6,4),rc(19,25,6,4)),'#ff4fa3');px.part(rc(16,26,4,3),'#c2185b')}
 if(has('pscarf')){px.part(rc(9,25,19,3),'#e8453c');px.part(rc(22,27,4,6),'#e8453c')}}
function petCanvas(d,evo){const stage=typeof evo==='number'?clamp(evo,1,3):evo?2:1,fk=petFitKey(d.id),k=d.id+stage+fk,fids=fk?fk.split('+'):[];if(petCache[k])return petCache[k];const px=new Pix(),c1=d.c1,c2=d.c2,kd=d.kind;
 const T=()=>{};
 petFitDraw(px,fids,'back');
 if(kd==='dragon'||kd==='drake'){px.part(or(tri(2,6,6,8),tri(30,6,6,8)),shadeC(c2));}
 if(kd==='fox'||kd==='cat2'){px.part(or(ell(32,22,5,9),kd==='cat2'?ell(36,15,4,8):()=>false),c1);if(kd==='fox')px.part(ell(35,16,3,4),c2)}
 else if(kd==='cat'){px.part(ell(33,22,3,9),c1)}
 else if(kd==='dragon'||kd==='drake'){px.part(or(ell(32,25,6,3),tri(34,19,5,6)),c1)}
 else if(kd==='bunny'){px.part(ell(31,26,3,3),'#ffffff')}
 px.part(ell(18,28,10,7),c1);px.part(ell(18,30,6,4),c2,{ol:false});
 px.part(or(rc(11,33,4,4),rc(21,33,4,4)),c1);
 px.part(ell(18,17,10,9),c1);
 if(kd==='bunny'){px.part(or(rc(11,0,4,11),rc(21,0,4,11)),c1);px.part(or(rc(12,2,2,7),rc(22,2,2,7)),c2,{ol:false,sh:false})}
 else if(kd==='dragon'){px.part(or(tri(9,5,4,4),tri(23,5,4,4)),'#f4f4f8');px.part(or(tri(3,10,6,5),tri(29,10,6,5)),shadeC(c2))}
 else if(kd==='drake'){px.part(or(tri(9,4,4,5),tri(23,4,4,5)),c2)}
 else px.part(or(tri(8,5,6,7),tri(22,5,6,7)),c1);
 if(kd==='cat'||kd==='cat2'||kd==='fox')px.part(or(tri(10,8,3,4),tri(23,8,3,4)),c2,{ol:false,sh:false});
 px.part(ell(18,20,5,3.4),kd==='fox'?c2:mixC(c1,'#ffffff',.55),{ol:false,sh:false});
 px.part(or(rc(12,16,2,3),rc(22,16,2,3)),INKP,{ol:false,sh:false});px.dot(12,16,'#fff');px.dot(22,16,'#fff');px.dot(18,19,'#5a2a3a');
 px.part(or(rc(9,20,3,2),rc(25,20,3,2)),mixC(c1,'#ff6f8a',.5),{ol:false,sh:false});
 if(stage>=2){px.part(or(rc(14,-1,2,3),rc(17,-3,2,5),rc(20,-1,2,3),rc(14,1,8,2)),'#ffd24a');px.part(or(tri(-3,14,8,9),tri(33,14,8,9)),mixC(c2,'#ffffff',.5))}
 if(stage>=3){px.part(or(ell(18,2,14,2),tri(2,7,5,6),tri(29,7,5,6)),'#5ee0ff',{ol:false,sh:false});px.dot(18,1,'#ffffff')}
 petFitDraw(px,fids,'front');
 const cv=px.toCanvas();return petCache[k]=cv}
const petTexCache={};
function buildPet(d,evo){const stage=typeof evo==='number'?clamp(evo,1,3):evo?2:1,g=new THREE.Group(),rig=new THREE.Group();g.add(rig);const cv=petCanvas(d,stage);const tk=d.id+stage+petFitKey(d.id);let t=petTexCache[tk];if(!t){t=petTexCache[tk]=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false}
 const geo=new THREE.PlaneGeometry(1,1);geo.translate(0,.5,0);const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:t,transparent:true,alphaTest:.04,side:THREE.DoubleSide}));const H=1.6;m.scale.set(H*PW/PH,H,1);rig.add(m);
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(.5,20),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.3,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.01;shadow.scale.set(1.2,.6,1);g.add(shadow);
 return{g,rig,shadow,kind:'pet',update(tm,hop=1){rig.position.y=Math.abs(Math.sin(tm*3.2))*.14*hop;const b=Math.sin(tm*6.4)*.03;m.scale.set(H*PW/PH*(1-b),H*(1+b),1)}}}
const petThumbC={};
function petThumb(d,evo){const stage=typeof evo==='number'?clamp(evo,1,3):evo?2:1,k=d.id+stage+petFitKey(d.id);if(petThumbC[k])return petThumbC[k];const cv=petCanvas(d,stage),c=mkCv(64,64),g=c.getContext('2d');g.imageSmoothingEnabled=false;const s=Math.min(56/cv.width,56/cv.height)*1;const w=cv.width*s,h=cv.height*s;g.drawImage(cv,(64-w)/2,64-h-2,w,h);return petThumbC[k]=c.toDataURL('image/png')}

/* ---------- playable map list (beyond Manila's districts) + pixel 2.5D world for the arena ---------- */
const EXTRA_MAPS=[
 {id:'bohol',kind:'world',need:'Defeat Uncle Dags',col:'#b6d95a'},{id:'palawan',kind:'world',need:'Defeat the Hill Colossus (Bohol)',col:'#5ee0ff'},
 {id:'siargao',kind:'world',need:'Defeat the Abyssal King (Palawan)',col:'#7b9bff'},
 {id:'biringan',kind:'secret',col:'#c99aff'},{id:'balete',kind:'secret',col:'#5be38a'},{id:'mansion',kind:'secret',col:'#9fb4ff'},{id:'kapre',kind:'secret',col:'#ffa24a'}];
const mapName=id=>(MAPS[id]||{}).n||id;
function mapOpen(id){const m=EXTRA_MAPS.find(x=>x.id===id);if(!m)return true;
 if(m.kind==='secret')return secOpen(id);
 const bw=S.bossesWon||{};return id==='bohol'?!!S.bossWon:!!bw[({palawan:'bohol',siargao:'palawan'})[id]]}
const CLEAR_R=4;
function manilaDone(){const dc=S.dclear||{};return !!S.bossWon&&DIST.every(d=>(dc[d.id]||0)>=CLEAR_R)}
const SECGATE={balete:'bohol',mansion:'palawan',kapre:'siargao'};
const SECGATE_NAME={biringan:'Manila',balete:'Bohol',mansion:'Palawan',kapre:'Siargao'};
function secOpen(id){const bw=S.bossesWon||{};if(id==='biringan')return manilaDone()||!!S.seenBiringan;return !!bw[SECGATE[id]]}
const PROPS={plaza:['lamp','tree'],intramuros:['lamp','house'],tondo:['lamp','house'],binondo:['lamp','house'],divisoria:['lamp','house'],banaue:['pine','tree'],palawan:['palm','palm'],bohol:['tree','tree'],siargao:['palm','lamp'],biringan:['lamp','spire'],balete:['pine','tree'],mansion:['pine','lamp'],kapre:['palm','tree'],tikbalang:['pine','pine']};
const propTexC={};
function propTex(kind,id){const k=kind+id;if(propTexC[k])return propTexC[k];const p=painter(32,48,3+id.length),wall=(SC_WALL[id]||'#c9a46a');
 if(kind==='lamp')p.lamp(16,46,1.8);else if(kind==='pine')p.pine(16,46,2.4,'#1d6a3a','#2f9a54');else if(kind==='palm')p.palm(14,46,2.6,1);else if(kind==='tree')p.rtree(16,46,2.6);
 else if(kind==='spire'){p.R(11,18,10,28,'#5a3a9a');p.TRI(16,6,14,8,'#e8c8ff');p.R(16,2,1,6,'#ffe27a');for(let i=0;i<3;i++)p.win(13,24+i*7,3,4,'#ffe27a')}
 else{p.house(3,46,26,30,wall,'#8f3b2a','#ffd48a')}
 const t=new THREE.CanvasTexture(p.c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return propTexC[k]=t}
const SC_WALL={intramuros:'#d9b882',tondo:'#58b4c9',binondo:'#c4302b',divisoria:'#ff9fbf'};
function buildPixelWorld(sc,id,opt={}){const root=new THREE.Group();sc.add(root);const hasAlt=id!=='stage';
 const px=(cv)=>{const t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t};
 const bgc=sceneCanvas(id,384,216).getContext('2d').getImageData(2,2,1,1).data;sc.background=new THREE.Color(`rgb(${bgc[0]},${bgc[1]},${bgc[2]})`);sc.fog=null;
 const layers=[];const mk=(geo,pos,rot,tx,tint)=>{const out=[];for(const a of hasAlt?[0,1]:[0]){const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:tx(a),color:tint||0xffffff,transparent:a===1,opacity:a===1?0:1,depthWrite:a===0}));m.position.copy(pos);if(rot)m.rotation.x=rot;if(a===1)m.position.y+=.004;root.add(m);out.push(m)}layers.push(out);return out};
 mk(new THREE.PlaneGeometry(150,84.4),new THREE.Vector3(0,14,-78),0,a=>px(sceneCanvas(id,384,216,!!a)));
 mk(new THREE.PlaneGeometry(14,160),new THREE.Vector3(0,0,-60),-Math.PI/2,a=>{const t=floorTex(id,!!a);t.repeat.set(7,40);return t});
 mk(new THREE.PlaneGeometry(150,160),new THREE.Vector3(0,-.02,-60),-Math.PI/2,a=>{const t=floorTex(id,!!a);t.repeat.set(30,40);return t},0x8a8a9a);
 for(const sd of[-1,1]){const e=new THREE.Mesh(new THREE.PlaneGeometry(.35,160),new THREE.MeshBasicMaterial({color:0x14101c}));e.rotation.x=-Math.PI/2;e.position.set(sd*7.1,.01,-60);root.add(e)}
 const kinds=PROPS[id]||PROPS.plaza,props=[];
 for(let i=0;i<9;i++)for(const sd of[-1,1]){const kd=kinds[(i+(sd>0?1:0))%kinds.length],t=propTex(kd,id),m=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,alphaTest:.1,fog:false}));const h=kd==='house'?7:kd==='lamp'?6:9;m.scale.set(h*32/48,h,1);m.position.set(sd*(9.5+(i%3)*1.2),h/2,-4-i*9);root.add(m);props.push(m)}
 const night=new THREE.Color(0x8890c8),white=new THREE.Color(0xffffff);
 const api={root,props,k:0,tk:0,setK(k){api.k=k;if(!hasAlt)return;for(const L of layers)L[1].material.opacity=k;const dark=NAT[id]==='d'?k:0;props.forEach(m=>m.material.color.copy(white).lerp(night,dark))},update(t,dt){if(api.k!==api.tk){api.k+=Math.sign(api.tk-api.k)*Math.min(Math.abs(api.tk-api.k),dt*.5);api.setK(api.k)}}};
 return api}

/* ============ premium, landmark-accurate Manila scenes (+ landmark upgrades for other maps) ============ */
function mkit(p,hz){const{R,E,D,TRI,w,h,g}=p;const day=p.alt;
 const lit=()=>day?'#d8ecff':'#ffd48a';
 const K={
 brick(x,y,bw,bh,base,dk,lt){R(x,y,bw,bh,base);for(let yy=y;yy<y+bh;yy+=3){R(x,yy,bw,1,dk);for(let xx=x+((yy-y)/3%2)*3;xx<x+bw;xx+=6)R(xx,yy,1,3,dk)}R(x,y,2,bh,lt);R(x+bw-2,y,2,bh,dk);R(x,y,bw,1,lt)},
 arch(x,y,aw,ah,col){R(x,y-ah+aw/2,aw,ah-aw/2,col);E(x+aw/2,y-ah+aw/2,aw/2,aw/2,col);},
 crenel(x,y,cw,col,dk){for(let i=0;i<cw;i+=4){R(x+i,y-3,3,3,col);R(x+i,y-3,3,1,dk)}},
 shutter(x,y,wl){R(x,y,5,8,'#2a1a3a');R(x+1,y+1,3,6,wl);R(x-2,y,2,8,'#3a6a4a');R(x+5,y,2,8,'#3a6a4a')},
 jeepney(x,y,s,body,stripe){const L=Math.round(30*s);R(x,y-9*s,L,7*s,body);R(x,y-4*s,L,1*s,stripe);R(x+2*s,y-12*s,L-9*s,3*s,body);R(x+3*s,y-11*s,L-12*s,2*s,'#cfe8ff');for(let i=0;i<4;i++)R(x+4*s+i*5*s,y-11*s,1,2*s,'#14101c');R(x+L,y-7*s,4*s,5*s,body);R(x+L-1,y-7*s,2*s,3*s,'#cfe8ff');
  R(x-1,y-9*s,1,7*s,'#14101c');R(x,y-13*s,L-8*s,1,'#14101c');for(const wx of[x+4*s,x+L-5*s]){D(wx,y-1*s,3*s,'#14101c');D(wx,y-1*s,1.4*s,'#9a9aaa')}for(let i=0;i<5;i++)R(x+3*s+i*4*s,y-7*s,2*s,1*s,['#ffd24a','#ff4fa3','#5ee0ff','#fff','#ff7a3c'][i]);R(x+L+3*s,y-6*s,1*s,1*s,'#ffe27a')},
 lantern(x,y,col='#e8302a'){R(x,y-8,1,6,'#14101c');E(x,y+1,3,4,col);R(x-1,y-1,3,1,'#ffb040');R(x-2,y+1,5,1,shadeC(col));R(x,y+5,1,3,'#f2c04a');p.g.globalAlpha=.22;D(x,y+1,7,'#ffb040');p.g.globalAlpha=1},
 sign(x,y,sw,sh,bg,fg){R(x,y,sw,sh,'#14101c');R(x+1,y+1,sw-2,sh-2,bg);for(let i=0;i<sw-4;i+=3){if(p.rnd()<.8)R(x+2+i,y+2,2,sh-4,fg);if(p.rnd()<.4)R(x+2+i,y+sh/2,3,1,fg)}},
 wires(y0){for(let k=0;k<3;k++){let py=y0+k*3;for(let x=0;x<w;x++){R(x,py+Math.round(Math.sin(x/38+k)*2),1,1,'#14101c')}}for(const x of[w*.2,w*.55,w*.9])R(x,y0-6,2,hz-y0+22,'#14101c')},
 street(y0,c1,c2,dk,lt,plan){for(let y=y0;y<h;y++)R(0,y,w,1,mixC(c1,c2,(y-y0)/(h-y0)));
  if(plan==='cobble'){for(let y=y0+2;y<h;y+=4){const sz=Math.max(4,Math.round(3+(y-y0)/8));for(let x=((y/4)%2)*sz/2;x<w;x+=sz){R(x,y,sz-1,1,lt);R(x+sz-1,y,1,3,dk)}}}
  else{for(let i=0;i<60;i++)R(p.rnd()*w,y0+4+p.rnd()*(h-y0-4),4,1,i%2?dk:lt)}}};
 return K}
function tower(p,x,y,tw,th,wall,dk,roof,lit){const{R,TRI,E}=p;R(x,y-th,tw,th,wall);R(x+tw-2,y-th,2,th,dk);R(x,y-th,2,th,mixC(wall,'#fff',.25));for(let i=0;i<3;i++)R(x,y-th+4+i*(th/3.2),tw,1,dk);R(x+tw/2-2,y-th*.62,4,Math.round(th*.2),'#2a1a28');E(x+tw/2,y-th*.62,2,2,'#2a1a28');R(x-1,y-th-2,tw+2,3,mixC(wall,'#fff',.15));TRI(x+tw/2,y-th-tw*.9-2,Math.round(tw*.9),tw/2+2,roof);R(x+tw/2,y-th-tw*.9-9,1,8,'#f2c04a');R(x+tw/2-2,y-th-tw*.9-6,5,1,'#f2c04a')}
SC.intramuros=(p,hz)=>{const{w,h,R,E,D,TRI,g}=p;const K=mkit(p,hz),lit=p.alt?'#d8ecff':'#ffd48a';
 p.sky(['#1a1f5c','#5a3aa8','#d9708a','#ffb36b'],hz+4);K.street(hz+4,'#6a4a5a','#2a1a2a','#3a2a3a','#8a7a8a','cobble');p.stars(40,hz*.4);D(w*.16,hz*.3,8,'#fff0d0');
 p.ridge(hz-2,5,40,'#4a3a8a',2);
 // Manila Cathedral (centre-left): facade, pediment, dome and tall bell tower
 const cx=w*.42,cy=hz+8;R(cx-26,cy-26,52,26,'#cdbd98');R(cx-26,cy-1,52,1,'#8a7a5a');K.brick(cx-26,cy-26,6,26,'#bba97f','#9a8a66','#dccfae');K.brick(cx+20,cy-26,6,26,'#bba97f','#9a8a66','#dccfae');
 TRI(cx,cy-40,14,26,'#d8c9a4');R(cx-26,cy-27,52,2,'#9a8a66');E(cx,cy-33,5,5,'#8a3a3a');E(cx,cy-33,3,3,'#ffd890');for(const dx of[-14,0,14]){K.arch(cx+dx-4,cy,8,14,'#2a1a28')}
 for(const dx of[-18,18])K.arch(cx+dx-2,cy-12,4,8,'#2a1a28');
 R(cx-34,cy-52,11,52,'#c6b68f');K.brick(cx-34,cy-52,11,52,'#c6b68f','#a69671','#dccfae');R(cx-36,cy-54,15,3,'#d8c9a4');K.arch(cx-31,cy-32,5,12,'#2a1a28');K.arch(cx-31,cy-46,5,8,lit);E(cx-28.5,cy-58,7,6,'#6a7a9a');R(cx-29,cy-70,1,10,'#f2c04a');R(cx-31,cy-67,5,1,'#f2c04a');
 // San Agustin church (right)
 const sx=w*.74,sy=hz+10;K.brick(sx-24,sy-30,48,30,'#a89a78','#8a7c5c','#c4b690');TRI(sx,sy-42,12,24,'#b8aa88');for(const dx of[-18,18]){K.brick(sx+dx-5,sy-38,10,38,'#9a8c6a','#7e704f','#bfb18c');R(sx+dx-6,sy-40,12,3,'#b8aa88');K.arch(sx+dx-2,sy-20,4,8,'#2a1a28');K.arch(sx+dx-2,sy-30,4,8,lit)}
 K.arch(sx-5,sy,10,18,'#3a2418');K.arch(sx-14,sy-8,4,10,'#2a1a28');K.arch(sx+10,sy-8,4,10,'#2a1a28');E(sx,sy-28,4,4,'#2a1a28');
 // Fort Santiago gate + walls (left foreground)
 const fx=w*.1,fy=hz+14;K.brick(0,fy-30,w*.32,30,'#8a8068','#6e6450','#a89e84');K.crenel(0,fy-30,w*.32,'#8a8068','#5e5440');R(fx-14,fy-44,34,44,'#968c72');K.brick(fx-14,fy-44,34,44,'#968c72','#756b54','#b0a68a');K.crenel(fx-14,fy-44,34,'#968c72','#5e5440');K.arch(fx-6,fy,18,26,'#1e1228');R(fx-6,fy-4,18,4,'#3a2a3a');for(let k=0;k<5;k++)R(fx-4+k*3,fy-26+k%2,1,22,'#4a3a4a');R(fx-4,fy-36,14,6,'#c9a14a');R(fx-2,fy-35,10,4,'#8a3a2a');
 R(w*.3-4,fy-38,9,8,'#7a705a');TRI(w*.3,fy-44,6,7,'#9a3a2a');
 // bahay-na-bato row, right foreground
 for(let i=0;i<3;i++){const bx=w*.84+i*(w*.08)-4,by=hz+24;R(bx,by-26,w*.09,26,['#d9b882','#c99a6b','#e0c896'][i]);R(bx,by-26,w*.09,3,'#6a3a2a');R(bx,by-14,w*.09,2,'#5a3a22');for(let k=0;k<2;k++)K.shutter(bx+3+k*9,by-23,lit);R(bx+2,by-12,w*.09-4,2,'#5a3a22');for(let k=0;k<3;k++)R(bx+3+k*5,by-10,1,6,'#5a3a22');K.lantern(bx+w*.045,by-9,'#ffcf6a')}
 K.street(hz+14,'#6a4a5a','#2a1a2a','#3a2a3a','#8a7a8a','cobble');
 // calesa (horse carriage)
 const hx=w*.58,hy=hz+30;R(hx,hy-8,16,6,'#7a3a1a');R(hx,hy-12,10,4,'#5a2a14');TRI(hx+5,hy-18,4,8,'#3a2a2a');D(hx+3,hy-2,4,'#14101c');D(hx+3,hy-2,2,'#c9a14a');D(hx+14,hy-2,3,'#14101c');R(hx+16,hy-7,10,3,'#3a2a1a');E(hx+30,hy-8,6,4,'#6a3a22');R(hx+34,hy-14,4,6,'#6a3a22');R(hx+28,hy-5,2,6,'#4a2a18');R(hx+33,hy-5,2,6,'#4a2a18');R(hx+37,hy-13,2,2,'#14101c');
 p.lamp(w*.24,hz+34,1.6);p.lamp(w*.62,hz+24,1.2);p.lamp(w*.9,hz+34,1.6);p.bunting(w*.05,w*.5,hz-14,9,['#ff4fa3','#ffd24a','#5ee0ff','#fff']);p.bunting(w*.5,w*.97,hz-14,9,['#5ee0ff','#ffd24a','#ff4fa3','#fff'])};
SC.tondo=(p,hz)=>{const{w,h,R,E,D,TRI}=p;const K=mkit(p,hz),lit=p.alt?'#d8ecff':'#ffd48a';
 p.sky(['#20174d','#8a3a7a','#e8706a','#ffa45b'],hz+4);K.street(hz+4,'#6a5a5a','#2a1e2a','#4a3a3a','#8a7a7a','dirt');p.stars(24,hz*.35);D(w*.78,hz*.28,8,'#ffe0b0');
 // Sto. Nino de Tondo-style church, twin towers
 const cx=w*.5,cy=hz+6;R(cx-24,cy-28,48,28,'#e8dcc0');R(cx-24,cy-28,3,28,'#fff4dc');R(cx+21,cy-28,3,28,'#c8bca0');TRI(cx,cy-42,14,24,'#d8cca8');E(cx,cy-33,4,4,'#8a3a2a');E(cx,cy-33,2,2,'#ffd890');for(const dx of[-22,22])tower(p,cx+dx-7,cy,14,48,'#efe3c6','#c4b896','#8a3a2a',lit);K.arch(cx-5,cy,10,17,'#3a2418');for(const dx of[-14,14])K.arch(cx+dx-2,cy-8,4,9,'#2a1a28');
 // dense stacked colourful houses with tin roofs
 const cols=['#e0795a','#58b4c9','#e8c04f','#8cc7a1','#d9627d','#9a8fd8','#f0a050'];
 for(let layer=0;layer<2;layer++)for(let i=0;i<16;i++){const x=i*17-8+layer*8+Math.floor(p.rnd()*4),by=hz+12+layer*7,hh=16+Math.floor(p.rnd()*22),c=cols[(i+layer*3)%7];if(Math.abs(x-cx)<32&&layer===0)continue;R(x,by-hh,15,hh,c);R(x+13,by-hh,2,hh,shadeC(c));R(x,by-hh-2,16,3,'#8a8a96');for(let k=0;k<16;k+=3)R(x+k,by-hh-2,1,3,'#6a6a76');for(let wy=by-hh+4;wy<by-4;wy+=8)for(let wx=x+2;wx<x+12;wx+=6)p.win(wx,wy,3,4,p.rnd()<.6?lit:'#2a2a4a');if(i%4===0){R(x+3,by-hh-8,1,6,'#222');R(x+5,by-hh-7,5,1,'#fff');R(x+5,by-hh-6,5,2,'#ff4fa3')}if(i%5===1){R(x+2,by-hh+10,12,1,'#14101c');for(let k=0;k<4;k++)R(x+3+k*3,by-hh+11,2,4,['#fff','#ff4fa3','#5ee0ff','#ffd24a'][k])}}
 K.wires(hz-16);
 // sari-sari store, basketball hoop, jeepney
 const sx=w*.06,sy=hz+30;R(sx,sy-18,34,18,'#58b4c9');R(sx,sy-20,36,4,'#e8302a');K.sign(sx+2,sy-26,30,6,'#ffd24a','#8a1f1a');R(sx+3,sy-12,12,9,'#3a2418');for(let k=0;k<4;k++)R(sx+18+k*4,sy-11,3,5,['#ff4fa3','#ffd24a','#5ee0ff','#fff'][k]);
 R(w*.88,hz+4,1,28,'#14101c');R(w*.88-6,hz+2,12,8,'#fff');R(w*.88-6,hz+2,12,1,'#14101c');R(w*.88-3,hz+10,6,1,'#ff7a3c');for(let k=0;k<3;k++)R(w*.88-3+k*2,hz+11,1,3,'#fff');
 K.street(hz+14,'#6a5a5a','#2a1e2a','#4a3a3a','#8a7a7a','dirt');K.jeepney(w*.58,hz+34,1.2,'#d94a4a','#ffd24a');
 p.lamp(w*.2,hz+34,1.4,'#ffb86b');p.lamp(w*.8,hz+34,1.4,'#ffb86b');p.bunting(0,w*.5,hz-8,8,['#ff4fa3','#ffd24a','#5ee0ff','#ff7a3c']);p.bunting(w*.5,w,hz-8,8,['#ffd24a','#5ee0ff','#ff4fa3','#9a7bff'])};
SC.binondo=(p,hz)=>{const{w,h,R,E,D,TRI}=p;const K=mkit(p,hz),lit=p.alt?'#d8ecff':'#ffd24a';
 p.sky(['#2a0f3a','#7a1f5a','#d9402a','#ff7a3c'],hz+4);K.street(hz+4,'#6a3434','#1e0f1a','#4a2222','#8a4a4a','cobble');p.stars(24,hz*.3);D(w*.5,hz*.38,12,'#ffd07a');
 // Binondo Church octagonal bell tower (left)
 const bx=w*.18,by=hz+8;R(bx-22,by-24,44,24,'#e8d8a8');R(bx-22,by-24,3,24,'#fff4c8');TRI(bx,by-34,10,22,'#d8c898');for(let i=0;i<3;i++)K.arch(bx-14+i*10,by,6,12,'#3a2418');
 const tx=bx+16;R(tx,by-62,18,62,'#ead9a6');R(tx,by-62,3,62,'#fff0c0');R(tx+15,by-62,3,62,'#c8b884');for(let i=0;i<4;i++){R(tx-1,by-14-i*12,20,1,'#a89868');K.arch(tx+6,by-6-i*12,6,8,'#2a1a28')}R(tx-2,by-64,22,3,'#d8c898');TRI(tx+9,by-80,16,14,'#8a3a2a');R(tx+9,by-90,1,10,'#f2c04a');R(tx+6,by-87,7,1,'#f2c04a');
 // Chinatown Welcome Arch (centre) - red pillars, gold/green tiled roof, lions
 const ax=w*.58,ay=hz+30;for(const dx of[-30,22]){R(ax+dx,ay-46,8,46,'#c4202a');R(ax+dx,ay-46,2,46,'#e8483a');R(ax+dx+6,ay-46,2,46,'#8a1018');R(ax+dx-3,ay-6,14,6,'#6a6a7a');R(ax+dx-3,ay-8,14,2,'#9a9aaa');E(ax+dx+4,ay-9,3,3,'#e8c04a')}
 R(ax-34,ay-52,72,8,'#c4202a');R(ax-34,ay-52,72,1,'#e8483a');for(let i=0;i<72;i+=4){R(ax-34+i,ay-55,3,3,'#2a8a5a');R(ax-34+i,ay-55,3,1,'#5ae0a0')}R(ax-38,ay-58,80,4,'#e8c04a');TRI(ax+2,ay-72,14,44,'#2a8a5a');R(ax-34,ay-58,76,1,'#8a5a14');for(let i=0;i<44;i+=4)R(ax-20+i,ay-66+Math.abs(i-22)/3,2,3,'#e8c04a');K.sign(ax-14,ay-50,32,5,'#e8c04a','#8a1018');for(let k=0;k<3;k++)D(ax-12+k*14,ay-60,2.4,'#ffd24a');R(ax+1,ay-84,2,12,'#e8c04a');
 for(const dx of[-28,24]){R(ax+dx-2,ay-14,8,8,'#d9a02a');R(ax+dx,ay-18,5,5,'#d9a02a');R(ax+dx+1,ay-17,1,1,'#14101c');R(ax+dx-3,ay-6,3,6,'#d9a02a')}
 // shophouses with vertical signs, lanterns
 const hs=[[w*.02,'#a82a2a'],[w*.34,'#8a1f2a'],[w*.84,'#a82a2a'],[w*.94,'#c4302b']];for(const[x,c]of hs){const bh=34;R(x,hz+10-bh,w*.1,bh,c);R(x,hz+10-bh,2,bh,'#e8483a');R(x-2,hz+10-bh-3,w*.1+4,4,'#2a2a3a');for(let r=0;r<2;r++)for(let k=0;k<2;k++)p.win(x+4+k*8,hz-22+r*12,5,7,lit);K.sign(x+w*.1-5,hz-28,4,24,'#ffd24a','#8a1018')}
 for(let i=0;i<14;i++)K.lantern(6+i*18,hz-6+Math.round(Math.sin(i*.9)*3),i%3?'#e8302a':'#ffb040');R(0,hz-12,w,1,'#14101c');
 K.street(hz+10,'#6a3434','#1e0f1a','#4a2222','#8a4a4a','cobble');K.jeepney(w*.3,hz+34,1.1,'#e8c04f','#c4202a');
 p.lamp(w*.46,hz+36,1.4,'#ff8a3a')};
SC.divisoria=(p,hz)=>{const{w,h,R,E,D,TRI}=p;const K=mkit(p,hz),lit=p.alt?'#cfe8ff':'#cfe8ff';
 p.sky(['#10305a','#3a8fd9','#9ad0f0','#ffe9a8'],hz+4);K.street(hz+4,'#7a7a8a','#3a3a4a','#5a5a6a','#9a9aaa','cobble');p.cloud(w*.2,hz*.3,2);p.cloud(w*.62,hz*.2,2);p.cloud(w*.86,hz*.42,1);
 // tall mall building with giant 168 sign + shop towers
 const mx=w*.5,my=hz+10;R(mx-30,my-70,60,70,'#e8dcc8');R(mx-30,my-70,3,70,'#fff');R(mx+27,my-70,3,70,'#b8ac98');for(let r=0;r<6;r++)for(let k=0;k<7;k++)p.win(mx-26+k*8,my-64+r*10,5,6,r<2?'#ffd24a':lit);R(mx-34,my-76,68,8,'#e8302a');K.sign(mx-30,my-75,60,7,'#e8302a','#fff');R(mx-14,my-96,28,18,'#e8302a');R(mx-14,my-96,28,2,'#fff');for(let k=0;k<3;k++){const dx=mx-11+k*9;if(k===0){R(dx,my-93,2,12,'#fff')}else if(k===1){R(dx,my-93,6,2,'#fff');R(dx,my-93,2,12,'#fff');R(dx,my-83,6,2,'#fff');R(dx+4,my-93,2,12,'#fff');R(dx,my-88,6,2,'#fff')}else{R(dx,my-93,6,2,'#fff');R(dx,my-93,2,12,'#fff');R(dx+4,my-93,2,12,'#fff');R(dx,my-88,6,2,'#fff');R(dx,my-83,6,2,'#fff')}}
 for(const[x,c,bh]of[[w*.04,'#4fc3d9',44],[w*.2,'#ff9fbf',36],[w*.78,'#ffd35a',46],[w*.9,'#8fe08f',38]]){R(x,hz+10-bh,w*.14,bh,c);R(x+w*.14-2,hz+10-bh,2,bh,shadeC(c));R(x-1,hz+10-bh-2,w*.14+2,3,'#2a3a5a');for(let r=0;r<Math.floor(bh/12);r++)for(let k=0;k<3;k++)p.win(x+3+k*8,hz+10-bh+4+r*11,5,6,lit);K.sign(x+2,hz-4,w*.14-4,5,'#e8302a','#fff')}
 // tiangge stalls with umbrellas and hanging goods
 const aw=['#e8302a','#ffd35a','#3ab8d9','#ff8a5a','#8fe08f','#b59bff'];
 for(let i=0;i<10;i++){const x=i*26-4,y=hz+18+(i%2)*3;for(let k=0;k<10;k++)R(x+k*2,y-10,2,5,k%2?aw[i%6]:'#fff');R(x-1,y-5,22,1,shadeC(aw[i%6]));R(x,y-4,1,12,'#6a4a2a');R(x+19,y-4,1,12,'#6a4a2a');R(x+2,y+1,16,4,'#a8702e');for(let k=0;k<5;k++)D(x+4+k*3.4,y,1.6,['#ff4a3a','#ffd24a','#8fd84a','#ff8a3a','#5ee0ff'][(k+i)%5]);for(let k=0;k<4;k++){R(x+3+k*4,y-4,1,4,'#14101c');R(x+2+k*4,y-1,3,5,aw[(i+k)%6])}}
 for(let i=0;i<12;i++){const x=6+i*22+p.rnd()*8,y=hz+30+p.rnd()*8;D(x,y-5,2,['#e8a070','#c88050','#f0b890'][i%3]);R(x-2,y-3,5,7,aw[(i*2)%6]);R(x-2,y+4,2,3,'#2a2a3a');R(x+1,y+4,2,3,'#2a2a3a')}
 K.street(hz+30,'#7a7a8a','#3a3a4a','#5a5a6a','#9a9aaa','cobble');K.jeepney(w*.06,hz+44,1.25,'#3ab8d9','#ffd24a');K.jeepney(w*.66,hz+42,1.15,'#e8302a','#fff');
 for(let i=0;i<14;i++){const x=i*18+4;R(x,hz-14,1,8,'#222');R(x,hz-14,6,4,aw[i%6])}};

/* ---- landmark upgrades for the other maps (added on top of their base scene) ---- */
function plus(id,fn){const o=SC[id];SC[id]=(p,hz)=>{o(p,hz);fn(p,hz)}}
plus('banaue',(p,hz)=>{const{w,R,TRI,D}=p;for(let i=0;i<3;i++){const x=w*.3+i*34,y=hz+16+i%2*3;for(let k=0;k<4;k++)R(x+2+k*4,y,1,6,'#6a4a22');R(x,y-1,18,2,'#8a5a2a');R(x+1,y-9,16,8,'#a8742e');R(x+1,y-9,16,1,'#c89050');TRI(x+9,y-22,13,14,'#d9b062');for(let k=0;k<13;k+=3)R(x+9-Math.round(k*1.1),y-22+k,1,1,'#8a6a2a');R(x+7,y-7,4,6,'#3a2418')}
 for(let i=0;i<6;i++){const x=20+i*46,y=hz+24+(i%3)*4;D(x,y-4,2,'#e8b070');TRI(x,y-10,5,5,'#e8c878');R(x-2,y-2,5,6,'#c04a3a')}p.g.globalAlpha=.25;for(let i=0;i<4;i++)p.E(p.rnd()*p.w,hz-4+i*6,40,3,'#fff');p.g.globalAlpha=1});
plus('palawan',(p,hz)=>{const{w,R,TRI,D}=p;for(let i=0;i<3;i++){const x=w*.2+i*w*.27,y=hz+10+i*5;R(x,y,22,4,'#3a8aa8');R(x+2,y+3,18,2,'#2a6a8a');R(x-3,y-1,3,2,'#e8e0d0');R(x+22,y-1,3,2,'#e8e0d0');R(x+6,y-12,1,12,'#6a4a2a');TRI(x+10,y-12,10,8,'#fff8e8');R(x-6,y+6,34,1,'#e8e0d0');R(x-6,y+6,1,3,'#e8e0d0');R(x+28,y+6,1,3,'#e8e0d0')}
 R(w*.7,hz-30,12,30,'#7a7060');p.E(w*.76,hz-8,9,8,'#1e2a3a');R(w*.69,hz-30,14,2,'#2f8a3a')});
plus('bohol',(p,hz)=>{const{w,R,E,D}=p;const tx=w*.2,ty=hz+30;R(tx-1,ty-34,4,34,'#5a3a22');R(tx-14,ty-26,28,3,'#5a3a22');R(tx-14,ty-26,3,6,'#3a8a3a');E(tx+9,ty-30,4,4,'#9a7a52');E(tx+9,ty-33,3,3,'#9a7a52');R(tx+6,ty-35,2,3,'#14101c');R(tx+10,ty-35,2,3,'#14101c');D(tx+7,ty-34,1,'#ffe27a');D(tx+11,ty-34,1,'#ffe27a');R(tx+8,ty-27,6,4,'#7a5a3a');
 const cx=w*.7,cy=hz+16;R(cx-14,cy-16,28,16,'#e0d4b0');R(cx-14,cy-16,2,16,'#fff4d8');p.TRI(cx,cy-24,8,16,'#a8503a');R(cx-3,cy-8,6,8,'#3a2418');R(cx+16,cy-26,8,26,'#d8ccaa');p.TRI(cx+20,cy-34,8,6,'#a8503a')});
plus('siargao',(p,hz)=>{const{w,h,R,TRI,D}=p;const bx=w*.72,by=hz+22;for(const dx of[0,22]){R(bx+dx,by-26,2,26,'#6a4a2a')}R(bx-2,by-30,28,2,'#8a5a2a');R(bx-2,by-26,28,1,'#6a4a2a');R(bx,by-40,24,10,'#a8742e');TRI(bx+12,by-50,10,16,'#d9b062');R(bx+9,by-38,6,6,'#3a2418');R(bx+24,by-8,w*.2,3,'#8a5a2a');for(let k=0;k<8;k++)R(bx+26+k*4,by-5,1,5,'#6a4a2a');
 for(let i=0;i<3;i++){const x=w*.34+i*24,y=hz+8+i*4;R(x,y,6,1,'#14101c');R(x+2,y-8,2,8,'#e8e0d0');D(x+2,y-10,1.6,'#e8a070');R(x+1,y-6,4,3,'#ff4fa3');R(x-4,y+2,16,1,'#fff')}
 for(let i=0;i<3;i++){const x=40+i*14,y=h-26;R(x,y,2,14,['#ff4fa3','#4ab0d8','#ffd24a'][i]);R(x-1,y-1,4,2,'#fff')}});

/* ============ boss roster (pixel monsters + configs) and the boss platform ============ */
const ICONS2={
 rock:{p:{b:'#8a8a98',d:'#5a5a68',l:'#b8b8c8',k:INKP},a:['...kkkkk...','..kllbbbk..','.kllbbbbbdk','kbbbbbbbbdk','kbbbbbbbddk','kbbbbbbdddk','.kbbbbdddk.','..kkddkkk..']},
 leaf:{p:{g:'#5ee06a',d:'#2a9a3a',l:'#c8ffc8',k:INKP},a:['.....kkk..','...kkllgk.','..kllgggdk','.klgggggdk','kgggggggdk','kgggggddk.','.kgdddkk..','kk.kkk....']},
 shell:{p:{p:'#ffb0d8',d:'#d9709a',l:'#fff0f8',k:INKP},a:['..kkkkkk..','.kllppppdk','kllppppppdk','kpkppkppkdk','kppkppkppdk','.kpppppddk.','..kdddddk..','...kkkkk...']},
 lantern:{p:{y:'#ffd24a',o:'#ff9a2a',d:'#c06a1a',r:'#e8302a',k:INKP},a:['...kkkk...','..kddddk..','.kyyyyyyk.','kyyooooyyk','kyooyyooyk','kyooyyooyk','kyyooooyyk','.kyyyyyyk.','..kddddk..','...krrk...']},
 fakeorb:{p:{r:'#ff4a4a',d:'#a01818',l:'#ffc0c0',k:INKP},a:['...kkkk...','..kllrrk..','.klrrrrrdk','krrrrrrrrdk','krrrrrrrrdk','.krrrrrddk.','..kdddddk..','...kkkk...']}};
ICONS2.bomb={p:{k:INKP,b:'#2a2a38',l:'#6a6a88',f:'#ff9a2a',y:'#ffe27a',m:'#8a8a99'},a:['......yf...','.....fyk...','....kmk....','..kkkkkkk..','.kbllbbbbk.','kbllbbbbbbk','kblbbbbbbbk','kbbbbbbbbbk','kbbbbbbbbdk','.kbbbbbbbk.','..kkkkkkk..']};
Object.assign(ICONS,ICONS2);

const BOSSES={
 intramuros:{name:'Uncle Dags',title:'Hype Shield',battle:'Rap Battle: Uncle Dags',col:'#d4491b',scene:'stage',look:'dags',beams:1,rate:1,
  ph:['SOUND CHECK','BEAT BREAKDOWN','FINAL DROP'],pl:['Okay, not bad. But I have more speakers!','You are not beating the king of Tondo that easy!'],
  intro:['Prove it! Whose music deserves the spotlight?!','Everybody keeps comparing us. So let us settle it, Hev!'],pitch:'Catch my mics to crack my Hype Shield. Dodge the bass, the fake beats and the spotlights!',
  taunts:['You call that a catch? My beats fall faster than that!','Hev gets the headlines. I get the bass!','Everybody compares us. Let me show you why they should not!','Keep up, rookie. The spotlight is mine!'],
  atk:{bass:['BASS DROP!','Feel that bass? Jump!'],fake:['FAKE BEAT!','Not every beat is real, rookie!'],spot:['SPOTLIGHT RUSH!','Everybody look at me!']},
  icons:{note:'note',mic:'mic',fake:'fake',wave:'wave'},zone:0xff3a4a,crack:'HYPE SHIELD CRACKED!',broken:'HYPE SHIELD BROKEN!',win:'Okay, okay. That was actually fire. Rematch someday?',reward:0},
 banaue:{name:'Mountain Guardian',title:'Stone Heart',col:'#8fd06a',scene:'banaue',mon:'golem',pal:{body:'#8a8a98',top:'#4ab04a',eye:'#7fff7f',crown:'#e8c878'},H:5.6,rate:1.05,
  ph:['AWAKENING','TERRACE QUAKE','MOUNTAIN’S WRATH'],pl:['The terraces tremble under me!','You cannot climb higher than the clouds!'],intro:['Who dares walk my terraces?','Turn back, little catcher.'],pitch:'Catch the glowing crystals to crack my Stone Heart. Dodge rockslides, mirage fruit and stone pillars!',
  taunts:['These mountains are older than your whole country.','Every step you take, I feel it.','Stone does not tire. Do you?'],
  atk:{bass:['ROCKSLIDE!','Boulders away!'],fake:['MIRAGE FRUIT!','Not every harvest is real.'],spot:['STONE PILLARS!','The ground rises!']},
  icons:{note:'leaf',mic:'gem',fake:'fakeorb',wave:'rock'},zone:0x9a7a3a,crack:'STONE HEART CRACKED!',broken:'STONE HEART SHATTERED!',win:'You have the spirit of the highlands. Pass.',reward:600},
 palawan:{name:'Abyssal King',title:'Tide Crown',col:'#5ee0ff',scene:'palawan',mon:'serpent',pal:{body:'#2a6ab0',belly:'#8ad0f0',eye:'#ffe27a',crown:'#ffd24a'},H:5.4,rate:1.15,
  ph:['RISING TIDE','WHIRLPOOL','ABYSSAL ROAR'],pl:['The sea answers to me!','Drown in the deep!'],intro:['Welcome to the deep, surface child.','The lagoon is MINE.'],pitch:'Catch the pearls to crack my Tide Crown. Dodge tidal surges, fake shells and whirlpools!',
  taunts:['The ocean has swallowed bigger heroes.','Hear the waves? They sing for me.','Your pet cannot swim this deep.'],
  atk:{bass:['TIDAL SURGE!','Ride it or sink!'],fake:['FAKE SHELLS!','Empty shells, hollow hope.'],spot:['WHIRLPOOL!','Down you go!']},
  icons:{note:'shell',mic:'orb',fake:'fakeorb',wave:'wave'},zone:0x37d0ff,crack:'TIDE CROWN CRACKED!',broken:'TIDE CROWN BROKEN!',win:'The tide turns. You may sail on.',reward:800},
 bohol:{name:'Hill Colossus',title:'Earth Core',col:'#b6d95a',scene:'bohol',mon:'golem',pal:{body:'#8a5a32',top:'#6ab04a',eye:'#ffe27a',crown:null},H:5.9,rate:1.2,
  ph:['HILL RUMBLE','CHOCOLATE QUAKE','COLOSSUS RISES'],pl:['The hills move when I move!','Feel the whole island shake!'],intro:['The hills are waking up!','Careful, tarsier friend.'],pitch:'Catch the sun charms to crack my Earth Core. Dodge rolling boulders, fake leaves and quake columns!',
  taunts:['I am a hundred hills in one.','Small steps, small catcher.','The tarsiers hide when I stomp.'],
  atk:{bass:['HILL ROLL!','Rolling thunder!'],fake:['FALSE LEAVES!','Grass is not always green.'],spot:['QUAKE COLUMN!','Hold your ground!']},
  icons:{note:'leaf',mic:'star',fake:'fakeorb',wave:'rock'},zone:0x9a7a3a,crack:'EARTH CORE CRACKED!',broken:'EARTH CORE BROKEN!',win:'The hills are calm again. Thank you.',reward:1000},
 siargao:{name:'Stormcaller',title:'Storm Eye',col:'#7b9bff',scene:'siargao',mon:'storm',pal:{},H:5.4,rate:1.3,
  ph:['GATHERING CLOUDS','LIGHTNING SURF','EYE OF THE STORM'],pl:['Lightning loves a good surf!','Now the real storm begins!'],intro:['A storm is coming, catcher.','Hold on to your board!'],pitch:'Catch the storm stars to crack my Storm Eye. Dodge big waves, fake lightning orbs and thunder strikes!',
  taunts:['I ride the thunder.','Even the sun hides from me.','Surf’s up, and so is the storm!'],
  atk:{bass:['BIG WAVE!','Wipeout!'],fake:['FALSE SPARKS!','Not every spark is safe to touch.'],spot:['LIGHTNING STRIKE!','Thunder incoming!']},
  icons:{note:'orb',mic:'star',fake:'fakeorb',wave:'wave'},zone:0xfff04a,crack:'STORM EYE CRACKED!',broken:'STORM EYE CALMED!',win:'The sky clears. Paalam, surfer.',reward:1200},
 biringan:{name:'The Enchanted King',title:'Fae Crown',col:'#c99aff',scene:'biringan',mon:'king',pal:{},H:5.4,rate:1.1,
  ph:['LANTERN HALL','MIRROR COURT','KINGDOM’S GLOW'],pl:['My court dazzles all who enter!','The kingdom is mine alone!'],intro:['Welcome, mortal, to Biringan.','You were not meant to find this road.'],pitch:'Catch the royal crystals to crack my Fae Crown. Dodge gust waves, fake lanterns and fae light!',
  taunts:['Few return from my lantern road.','Stay, and be my honored guest.','Every light here is a promise.'],
  atk:{bass:['FAE GUST!','Hold on to your hat!'],fake:['FALSE LANTERNS!','Not every light is friendly.'],spot:['FAE LIGHT!','Step out of the glow!']},
  icons:{note:'lantern',mic:'orb',fake:'fakeorb',wave:'wave'},zone:0xc99aff,crack:'FAE CROWN CRACKED!',broken:'FAE CROWN BROKEN!',win:'Impressive. The road will open for you again.',reward:1500},
 balete:{name:'Rootbound Guardian',title:'Heartwood',col:'#5be38a',scene:'balete',mon:'root',pal:{},H:5.6,rate:1.1,
  ph:['WHISPERS','TANGLED ROOTS','ANCIENT FURY'],pl:['The roots remember everything!','The forest hungers!'],intro:['The tree listens... and it is angry.','You walk on my roots.'],pitch:'Catch the ember charms to crack my Heartwood. Dodge root whips, fake leaves and root bursts!',
  taunts:['I have stood a thousand years.','My roots reach under your feet.','Quiet. The forest is listening.'],
  atk:{bass:['ROOT WHIP!','Jump the root!'],fake:['FALSE LEAVES!','Pretty leaves, bitter bark.'],spot:['ROOT BURST!','The ground opens!']},
  icons:{note:'leaf',mic:'frag',fake:'fakeorb',wave:'rock'},zone:0x2aff6a,crack:'HEARTWOOD CRACKED!',broken:'HEARTWOOD SPLIT!',win:'The forest quiets. You are forgiven.',reward:1800},
 mansion:{name:'The Lady of Midnight',title:'Midnight Veil',col:'#9fb4ff',scene:'mansion',mon:'lady',pal:{},H:5.6,rate:1.25,
  ph:['COLD HALLWAY','WHISPERING WINDOWS','MIDNIGHT TOLL'],pl:['The house is awake now...','Midnight has come!'],intro:['Do you hear the whispers?','Stay a while... forever.'],pitch:'Catch the pale lights to crack my Midnight Veil. Dodge cold gusts, fake lanterns and moonbeams!',
  taunts:['One window is always lit.','You are not alone in this house.','Listen... the clock is striking.'],
  atk:{bass:['COLD GUST!','Brr, jump it!'],fake:['FALSE LIGHTS!','That light is not for you.'],spot:['MOONBEAM!','Stay out of the moonlight!']},
  icons:{note:'lantern',mic:'orb',fake:'fakeorb',wave:'wave'},zone:0xe8f0ff,crack:'MIDNIGHT VEIL CRACKED!',broken:'MIDNIGHT VEIL TORN!',win:'Dawn at last. Thank you for staying.',reward:2000},
 kapre:{name:'The Ancient Kapre',title:'Ember Heart',col:'#ffa24a',scene:'kapre',mon:'kapre',pal:{},H:6,rate:1.3,
  ph:['SMOKE RINGS','FOOTSTEP QUAKE','FIRE IN THE TREES'],pl:['My smoke covers the whole grove!','You are small. I am the forest!'],intro:['Hoo hoo... a little visitor.','Smell that smoke?'],pitch:'Catch the ember charms to crack my Ember Heart. Dodge giant footsteps, fake fireflies and smoke blasts!',
  taunts:['I was here before the first road.','My shadow is bigger than your village.','Care for a puff?'],
  atk:{bass:['GIANT STEP!','Jump the shockwave!'],fake:['FALSE FIREFLIES!','Not every glow is a friend.'],spot:['SMOKE BLAST!','Cough! Move away!']},
  icons:{note:'star',mic:'frag',fake:'fakeorb',wave:'rock'},zone:0xff8a2a,crack:'EMBER HEART CRACKED!',broken:'EMBER HEART PUT OUT!',win:'Hoo... you are braver than you look.',reward:2400},
 tikbalang:{name:'The Trail Trickster',title:'Illusion Mask',col:'#ff6fd0',scene:'tikbalang',mon:'tik',pal:{},H:5.6,rate:1.4,
  ph:['WRONG TURN','TWISTED PATH','TRICKSTER’S LAUGH'],pl:['Which way is the real trail?','You will never find the end!'],intro:['Lost already?','Wear your shirt inside out, why don’t you.'],pitch:'Catch the true markers to crack my Illusion Mask. Dodge shockwaves, fake orbs and illusion gates!',
  taunts:['Left? Right? Who knows!','The trail loves to loop.','Hehehe, you followed the wrong glow.'],
  atk:{bass:['STAMPEDE!','Hooves everywhere!'],fake:['ILLUSIONS!','Some of these are not real.'],spot:['ILLUSION GATE!','Do not step in!']},
  icons:{note:'gem',mic:'orb',fake:'fakeorb',wave:'wave'},zone:0xff4a8a,crack:'ILLUSION MASK CRACKED!',broken:'ILLUSION MASK SHATTERED!',win:'Hmph. You found the way out.',reward:3000}};
const bossOf=id=>BOSSES[id]||BOSSES.intramuros;

/* ---- pixel monsters ---- */
const monCache={};
function monCanvas(kind,pal={}){const k=kind+JSON.stringify(pal);if(monCache[k])return monCache[k];const px=new Pix();
 const eyes=(y,c,sep=8)=>{px.part(or(rc(22-sep/2-2,y,3,3),rc(22+sep/2,y,3,3)),c,{ol:false,sh:false})};
 if(kind==='golem'){const b=pal.body,t=pal.top;px.part(or(rc(0,28,8,18),rc(36,28,8,18)),b);px.part(ell(22,36,14,14),b);px.part(or(rc(11,46,9,7),rc(24,46,9,7)),b);px.part(or(ell(6,29,6,6),ell(38,29,6,6)),b);px.part(ell(22,17,11,10),b);px.part(or(ell(22,8,10,3),ell(7,24,5,2),ell(37,24,5,2)),t,{sh:false});
  if(pal.crown)px.part(or(tri(12,0,10,8),tri(22,-1,10,9),tri(26,0,10,8)),pal.crown);
  eyes(15,pal.eye);px.part(rc(16,22,12,2),INKP,{ol:false,sh:false});for(const x of[17,20,23,26])px.dot(x,22,'#fff');px.part(or(rc(14,34,16,2),rc(18,40,10,2)),shadeC(b),{ol:false,sh:false})}
 else if(kind==='serpent'){const b=pal.body;px.part(or(tri(-3,12,12,12),tri(35,12,12,12)),shadeC(b));px.part(ell(22,42,18,10),b);px.part(ell(22,42,10,6),pal.belly,{ol:false,sh:false});px.part(rc(15,16,14,28),b);px.part(rc(18,22,8,22),pal.belly,{ol:false,sh:false});px.part(ell(22,14,12,10),b);px.part(rc(10,18,24,5),shadeC(b));px.part(or(tri(8,-2,6,10),tri(16,-4,6,12),tri(22,-5,6,13),tri(28,-4,6,12)),pal.crown);px.part(or(rc(10,9,4,4),rc(30,9,4,4)),pal.eye,{ol:false,sh:false});px.dot(12,10,INKP);px.dot(32,10,INKP);for(const x of[12,16,20,24,28])px.dot(x,20,'#fff')}
 else if(kind==='storm'){px.part(tri(4,16,36,36),'#4a5aa8');px.part(tri(14,20,16,28),'#6a7ac8',{ol:false});px.part(ell(22,13,8,8),'#e8c8a0');px.part(or(tri(14,18,5,8),rc(14,18,16,2)),'#f0f0f8');px.part(or(ell(13,6,7,5),ell(22,3,8,6),ell(31,6,7,5)),'#e8eefc');px.part(rc(36,12,2,36),'#7a5a3a');px.part(or(tri(32,0,8,10),tri(36,6,8,10)),'#ffe84a');eyes(11,'#ffe84a',6);px.part(rc(18,17,8,2),'#f0f0f8',{ol:false,sh:false});px.part(or(rc(2,30,6,4),rc(34,30,6,4)),'#e8c8a0')}
 else if(kind==='king'){px.part(ell(22,26,22,26),'#e8c8ff',{ol:false,sh:false});px.part(tri(2,16,38,36),'#6a2a9a');px.part(tri(14,18,14,34),'#e8c04a',{ol:false});px.part(or(rc(0,26,6,14),rc(38,26,6,14)),'#5a2088');px.part(ell(22,14,9,9),'#f0e0f8');px.part(or(rc(11,0,3,8),rc(16,-2,3,10),rc(21,-3,3,11),rc(26,-2,3,10),rc(31,0,3,8),rc(11,6,23,4)),'#ffd24a');for(const x of[12,17,22,27,32])px.dot(x,5,x%2?'#ff4fa3':'#5ee0ff');eyes(12,'#7a2aff',7);px.part(rc(19,19,6,2),'#c04a8a',{ol:false,sh:false});px.part(rc(40,8,2,40),'#ffd24a');px.part(ell(41,6,4,4),'#5ee0ff')}
 else if(kind==='root'){px.part(or(rc(-2,6,6,28),rc(38,6,6,28),tri(-4,34,10,14),tri(38,34,10,14)),'#5a3a22');px.part(or(tri(2,40,14,14),tri(14,44,14,10),tri(26,40,14,14)),'#4a2e1a');px.part(rc(8,12,28,38),'#6a4426');for(let x=12;x<34;x+=5)px.part(rc(x,14,1,34),'#4a2e1a',{ol:false,sh:false});px.part(or(ell(22,6,16,8),ell(8,10,7,5),ell(36,10,7,5)),'#2a8a3a');px.part(ell(22,8,6,3),'#5ee06a',{ol:false,sh:false});px.part(or(rc(13,22,6,6),rc(25,22,6,6)),'#14101c',{ol:false,sh:false});px.part(or(rc(15,24,3,3),rc(27,24,3,3)),'#7aff9a',{ol:false,sh:false});px.part(rc(15,34,14,3),'#14101c',{ol:false,sh:false})}
 else if(kind==='lady'){px.part(rc(8,8,28,44),'#14101c');px.part(tri(6,26,32,28),'#f4f4ff');px.part(tri(14,32,16,20),'#d8d8f0',{ol:false});px.part(or(rc(2,26,6,18),rc(36,26,6,18)),'#f4f4ff');px.part(ell(22,16,9,10),'#f0f0fa');px.part(or(rc(12,6,20,5),rc(10,8,4,18),rc(30,8,4,18)),'#14101c');px.part(or(rc(15,13,4,6),rc(25,13,4,6)),'#14101c',{ol:false,sh:false});px.part(or(rc(16,18,1,5),rc(27,18,1,5)),'#e83a4a',{ol:false,sh:false});px.part(rc(19,22,6,2),'#8a2a3a',{ol:false,sh:false})}
 else if(kind==='kapre'){px.part(or(rc(-2,26,10,22),rc(36,26,10,22)),'#2a1e18');px.part(ell(22,34,19,18),'#3a2a22');px.part(or(rc(8,46,11,7),rc(25,46,11,7)),'#2a1e18');px.part(ell(22,14,11,10),'#3a2a22');for(let i=0;i<30;i++)px.dot(6+(i*7)%32,24+(i*5)%22,'#524036');px.part(or(rc(14,14,6,4),rc(24,14,6,4)),'#ff7a1a',{ol:false,sh:false});px.part(rc(15,22,14,2),'#14101c',{ol:false,sh:false});px.part(rc(26,20,14,3),'#e8e0d0');px.dot(41,21,'#ff4a1a');px.dot(42,20,'#ffb040');px.part(rc(12,34,20,3),'#2a8a3a');px.part(ell(22,3,9,3),'#2a8a3a')}
 else if(kind==='tik'){px.part(or(rc(0,26,8,16),rc(36,26,8,16)),'#2a2230');px.part(rc(12,22,20,24),'#2a2230');px.part(or(rc(13,44,6,9),rc(25,44,6,9)),'#14101c');px.part(or(tri(6,0,6,12),tri(10,-1,6,14),tri(14,-2,6,15),tri(18,-2,6,15)),'#6a3a8a');px.part(ell(18,12,8,10),'#3a2c44');px.part(rc(20,14,16,9),'#3a2c44');px.part(rc(32,15,6,8),'#4a3a58');px.part(or(tri(12,0,6,9),tri(22,0,6,9)),'#3a2c44');px.part(rc(15,10,4,4),'#ff3a3a',{ol:false,sh:false});px.dot(16,11,'#fff');px.part(rc(34,17,2,2),'#14101c',{ol:false,sh:false});px.part(or(rc(2,34,4,6),rc(38,34,4,6)),'#4a3a58')}
 return monCache[k]=px.toCanvas()}
function buildMon(kind,pal,H=6.4){const g=new THREE.Group(),rig=new THREE.Group();g.add(rig);const cv=monCanvas(kind,pal),t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;
 const geo=new THREE.PlaneGeometry(1,1);geo.translate(0,.5,0);const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:t,transparent:true,alphaTest:.04,side:THREE.DoubleSide}));m.scale.set(H*PW/PH,H,1);rig.add(m);
 return{g,rig,mon:true,H,m,update(tm,angry,hit){const pulse=Math.sin(tm*(angry?6:3))*(angry?.05:.03),bob=Math.abs(Math.sin(tm*(angry?5:2.4)));
  rig.rotation.set(0,0,0);rig.position.y=bob*(hit?.1:.28);
  if(kind==='king')rig.rotation.z=Math.sin(tm*(hit?4:2.2))*(hit?.16:.06);
  else if(kind==='root'){rig.rotation.z=Math.sin(tm*(hit?5:1.6))*(hit?.04:.025);if(hit)rig.position.y-=.3}
  else if(kind==='lady'){rig.position.y+=hit?.55:.18;rig.rotation.z=Math.sin(tm*(hit?2:1.1))*(hit?.03:.02)}
  else if(kind==='kapre'){rig.position.y+=bob*(hit?.8:.35);rig.rotation.z=Math.sin(tm*(hit?7:1.4))*(hit?.09:.035)}
  m.scale.set(H*PW/PH*(1-pulse),H*(1+pulse),1);m.material.color.set(hit?0xff9a9a:0xffffff)}}}
function monThumb(id){const c=bossOf(id);if(c.mon){const cv=monCanvas(c.mon,c.pal||{}),o=mkCv(64,64),g=o.getContext('2d');g.imageSmoothingEnabled=false;const s=Math.min(60/cv.width,60/cv.height);g.drawImage(cv,(64-cv.width*s)/2,62-cv.height*s,cv.width*s,cv.height*s);return o.toDataURL('image/png')}return headURL(c.look==='dags'?BOSS_LOOK:BOSS_LOOK,64)}

/* ---- boss platform in front of the pixel backdrop ---- */
function bossPlatform(sc,bc){const wt=floorTex(bc.scene);wt.repeat.set(5,3);const side=new THREE.MeshBasicMaterial({map:wt,color:0xb0b0c0}),top=new THREE.MeshBasicMaterial({map:wt});
 const box=new THREE.Mesh(new THREE.BoxGeometry(10,3.8,3.2),[side,side,top,side,side,side]);box.position.set(0,1.9,-5.5);sc.add(box);
 const col=new THREE.Color(bc.col);const strip=new THREE.Mesh(new THREE.BoxGeometry(10.1,.12,3.3),new THREE.MeshBasicMaterial({color:col}));strip.position.set(0,3.85,-5.5);sc.add(strip);
 const beams=[];if(bc.beams){for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.ConeGeometry(1.5,16,16,1,true),new THREE.MeshBasicMaterial({color:[0xff4fa3,0x5ee0ff,0xffc94a,0x7b4dff,0xffffff,0xff7a1a][i],transparent:true,opacity:.14,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));b.position.set(-9+i*3.6,13,-6);b.userData.i=i;sc.add(b);beams.push(b)}}
 return{update(t){beams.forEach(b=>{b.rotation.z=Math.sin(t*1.3+b.userData.i)*.5;b.rotation.x=Math.cos(t*1.1+b.userData.i)*.2});strip.material.color.set(col).multiplyScalar(.75+.25*Math.sin(t*5))}}}

/* ============ environment ============ */
const SEG=24,NSEG=9;
function skyTex(cols){const c=document.createElement('canvas');c.width=4;c.height=256;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,cols[0]);gr.addColorStop(.55,cols[1]);gr.addColorStop(1,cols[2]);g.fillStyle=gr;g.fillRect(0,0,4,256);return new THREE.CanvasTexture(c)}
function addSky(sc,pal,moon=true){sc.background=skyTex(pal.sky);sc.fog=new THREE.Fog(new THREE.Color(pal.fog),30,175);
 const n=220,pos=new Float32Array(n*3);for(let i=0;i<n;i++){const a=rnd(0,Math.PI*2),e=rnd(.25,1.25);pos[i*3]=Math.cos(a)*120*Math.cos(e*.7);pos[i*3+1]=30+Math.sin(e)*70;pos[i*3+2]=-Math.abs(Math.sin(a))*120-20}
 const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(pos,3));const st=new THREE.Points(gg,new THREE.PointsMaterial({color:0xffffff,size:2.2,sizeAttenuation:false,fog:false,transparent:true,opacity:.8}));sc.add(st);
 if(moon){const m=new THREE.Mesh(new THREE.SphereGeometry(5,24,18),new THREE.MeshBasicMaterial({color:0xfff3d8,fog:false}));m.position.set(-34,46,-110);sc.add(m);const gl=glowSprite('#ffe9b0',46,.55);gl.position.copy(m.position);sc.add(gl)}}
function facade(pal,floors,seed){
 const Rr=seeded('f'+seed+pal.id),w=768,fh=128,h=fh*floors;
 const cm=document.createElement('canvas');cm.width=w;cm.height=h;const g=cm.getContext('2d');
 const em=document.createElement('canvas');em.width=w;em.height=h;const e=em.getContext('2d');
 const base=pal.walls[seed%pal.walls.length];g.fillStyle=base;g.fillRect(0,0,w,h);e.fillStyle='#000';e.fillRect(0,0,w,h);
 g.strokeStyle='rgba(0,0,0,.09)';g.lineWidth=2;for(let y=0;y<h;y+=32){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();for(let x=(y/32%2)*32;x<w;x+=64){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+32);g.stroke()}}
 const arch=(ctx,x,y,ww,hh)=>{ctx.beginPath();ctx.moveTo(x,y+hh);ctx.lineTo(x,y+ww/2);ctx.arc(x+ww/2,y+ww/2,ww/2,Math.PI,0);ctx.lineTo(x+ww,y+hh);ctx.closePath()};
 for(let f=0;f<floors;f++){
  g.fillStyle=pal.trim;g.fillRect(0,f*fh+fh-9,w,9);g.fillStyle='rgba(255,255,255,.14)';g.fillRect(0,f*fh,w,4);
  for(let c=0;c<6;c++){const x=c*128+36,y=f*fh+20,ground=f===floors-1,ww=56,hh=ground?92:78;
   g.fillStyle=pal.trim;arch(g,x-6,y-6,ww+12,hh+8);g.fill();
   const lit=Rr()<.6&&!ground||ground&&Rr()<.4;
   g.fillStyle=lit?'#ffd88a':'#1b2347';arch(g,x,y,ww,hh);g.fill();
   if(lit){e.fillStyle='#ffb347';arch(e,x,y,ww,hh);e.fill()}
   g.strokeStyle='rgba(30,15,5,.75)';g.lineWidth=3;g.beginPath();g.moveTo(x+ww/2,y+4);g.lineTo(x+ww/2,y+hh);g.moveTo(x,y+hh*.5);g.lineTo(x+ww,y+hh*.5);g.stroke();
   if(!ground){g.fillStyle='#4a2f1a';g.fillRect(x-14,y+hh-4,ww+28,9);g.strokeStyle='#4a2f1a';g.lineWidth=2;for(let k=0;k<=6;k++){g.beginPath();g.moveTo(x-12+k*12,y+hh-4);g.lineTo(x-12+k*12,y+hh-16);g.stroke()}}}}
 const t1=new THREE.CanvasTexture(cm),t2=new THREE.CanvasTexture(em);t1.anisotropy=4;return{map:t1,emi:t2}}
function buntingTex(pal){const c=document.createElement('canvas');c.width=512;c.height=64;const g=c.getContext('2d');g.strokeStyle='#3a2a1a';g.lineWidth=3;g.beginPath();g.moveTo(0,8);g.quadraticCurveTo(256,40,512,8);g.stroke();
 const cols=[pal.acc,'#ff4fa3','#5ee0ff','#ffffff','#7b4dff'];for(let i=0;i<14;i++){const x=18+i*36,t=x/512,y=8+4*t*(1-t)*8*4/4+ (1-Math.pow(2*t-1,2))*16;g.fillStyle=cols[i%cols.length];g.beginPath();g.moveTo(x-12,y);g.lineTo(x+12,y);g.lineTo(x,y+26);g.closePath();g.fill()}return new THREE.CanvasTexture(c)}
function roadTex(){const c=document.createElement('canvas');c.width=256;c.height=256;const g=c.getContext('2d');g.fillStyle='#2b3355';g.fillRect(0,0,256,256);
 for(let i=0;i<900;i++){g.fillStyle=`rgba(${rint(90,150)},${rint(100,160)},${rint(160,220)},.07)`;g.fillRect(rnd(0,256),rnd(0,256),rint(1,3),rint(1,3))}
 g.fillStyle='rgba(255,255,255,.85)';for(const x of[.5-1.1/7.4,.5+1.1/7.4])g.fillRect(x*256-2,20,4,100);
 g.fillStyle='#ffc94a';g.fillRect(2,0,5,256);g.fillRect(249,0,5,256);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t}
function cobbleTex(){const c=document.createElement('canvas');c.width=256;c.height=256;const g=c.getContext('2d');g.fillStyle='#8b7a6a';g.fillRect(0,0,256,256);
 for(let y=0;y<8;y++)for(let x=0;x<8;x++){const ox=(y%2)*16;g.fillStyle=`hsl(${28+rint(-4,4)},${rint(14,22)}%,${rint(40,56)}%)`;g.beginPath();g.roundRect?g.roundRect(x*32+ox+2,y*32+2,28,28,7):g.rect(x*32+ox+2,y*32+2,28,28);g.fill()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t}
function buildChurch(pal){
 const g=new THREE.Group(),st=LM('#d8c39a'),dk=LM('#a8916a'),gold=LM('#ffd27a',{emissive:'#ffb347',emissiveIntensity:.55});
 mesh(new THREE.BoxGeometry(14,11,7),st,0,5.5,0,g);
 const sh=new THREE.Shape();sh.moveTo(-7.4,0);sh.lineTo(7.4,0);sh.lineTo(0,4);sh.closePath();const pd=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:7.2,bevelEnabled:false}),dk);pd.position.set(0,11,-3.6);g.add(pd);
 for(const s of[-1,1]){const x=s*8.4;mesh(new THREE.BoxGeometry(4,17,4.4),st,x,8.5,.2,g);mesh(new THREE.BoxGeometry(4.5,.6,4.9),dk,x,17.2,.2,g);mesh(new THREE.BoxGeometry(3,3.4,3),st,x,19,.2,g);
  const arc=mesh(new THREE.BoxGeometry(1.2,2.2,3.2),LM('#1b2347',{emissive:'#ffb347',emissiveIntensity:.8}),x,19,.2,g);const r=mesh(new THREE.ConeGeometry(2.5,3.6,4),LM(pal.roof),x,22.5,.2,g);r.rotation.y=Math.PI/4;
  mesh(new THREE.BoxGeometry(.2,1.4,.2),gold,x,25,.2,g);mesh(new THREE.BoxGeometry(.8,.2,.2),gold,x,25.3,.2,g);
  for(let i=0;i<3;i++)mesh(new THREE.BoxGeometry(1.1,2.2,.3),LM('#1b2347',{emissive:'#ffb347',emissiveIntensity:.7}),x,4+i*4.3,2.5,g)}
 mesh(new THREE.BoxGeometry(3.2,5,.4),LM('#2a1a10',{emissive:'#ff9a3c',emissiveIntensity:.8}),0,2.5,3.55,g);const ar=mesh(new THREE.CircleGeometry(1.6,16,0,Math.PI),LM('#2a1a10',{emissive:'#ff9a3c',emissiveIntensity:.8}),0,5,3.76,g);
 const rose=mesh(new THREE.CircleGeometry(1.3,20),LM('#6fa8ff',{emissive:'#6fa8ff',emissiveIntensity:.8}),0,9,3.56,g);
 for(const s of[-1,1])for(let i=0;i<2;i++)mesh(new THREE.BoxGeometry(1.4,3,.3),LM('#1b2347',{emissive:'#ffb347',emissiveIntensity:.7}),s*4.2,3+i*4.2,3.6,g);
 for(let i=0;i<4;i++)mesh(new THREE.BoxGeometry(9-i*.8,.4,2.2),dk,0,.2+i*.4,4.2+(3-i)*.7,g);
 const gl=glowSprite('#ffb347',34,.45);gl.position.set(0,6,6);g.add(gl);
 return g}
function makeLamp(pal){const g=new THREE.Group();mesh(new THREE.CylinderGeometry(.07,.11,4.4,8),M('#1b2038'),0,2.2,0,g);mesh(new THREE.BoxGeometry(.9,.08,.08),M('#1b2038'),.4,4.35,0,g);
 const b=mesh(new THREE.SphereGeometry(.25,10,8),EM(pal.lamp),.8,4.2,0,g);const gl=glowSprite(pal.lamp,3.4,.75);gl.position.set(.8,4.2,0);g.add(gl);return g}

function buildRunEnv(sc,pal,opt={}){
 const off=opt.off||7.5,root=new THREE.Group();sc.add(root);
 const types=[];
 for(let i=0;i<6;i++){const fl=3+(i%2),f=facade(pal,fl,i),h=fl*3.7;
  const fm=new THREE.MeshLambertMaterial({map:f.map,emissiveMap:f.emi,emissive:0xffffff,emissiveIntensity:1});
  const plain=LM(pal.walls[i%pal.walls.length]);
  types.push({geo:new THREE.BoxGeometry(8,h,SEG),mats:[fm,plain,LM(pal.roof),plain,plain,plain],h})}
 const bTex=buntingTex(pal),bMat=new THREE.MeshBasicMaterial({map:bTex,transparent:true,side:THREE.DoubleSide});
 const segs=[];
 for(let i=0;i<NSEG;i++){
  const sg=new THREE.Group();root.add(sg);sg.position.z=SEG*1.5-i*SEG;
  const b=[];
  for(const s of[-1,1]){const t=types[(i+(s>0?3:0))%6];const bm=new THREE.Mesh(t.geo,t.mats);bm.position.set(s*(off+4),t.h/2-.3,0);if(s>0)bm.scale.x=-1;sg.add(bm);
   const par=mesh(new THREE.BoxGeometry(8.6,.5,SEG+.2),LM(pal.trim),s*(off+4),t.h-.1,0,sg);b.push({bm,par,s});
   const lp=makeLamp(pal);lp.position.set(s*(off-.9),0,-4);lp.rotation.y=s>0?Math.PI:0;sg.add(lp);const lp2=makeLamp(pal);lp2.position.set(s*(off-.9),0,8);lp2.rotation.y=s>0?Math.PI:0;sg.add(lp2)}
  const bp=new THREE.Mesh(new THREE.PlaneGeometry(off*2-1.4,1.5),bMat);bp.position.set(0,7.2,0);bp.rotation.x=.03;sg.add(bp);
  segs.push({g:sg,b})}
 const L=280,rt=roadTex();rt.repeat.set(1,L/8);const road=new THREE.Mesh(new THREE.PlaneGeometry(7.4,L),new THREE.MeshLambertMaterial({map:rt}));road.rotation.x=-Math.PI/2;road.position.set(0,0,-L/2+40);root.add(road);
 const ct=cobbleTex();ct.repeat.set(Math.max(1,(off-3.7)/3),L/6);const sideM=new THREE.MeshLambertMaterial({map:ct});
 for(const s of[-1,1]){const sw=new THREE.Mesh(new THREE.PlaneGeometry(off-3.7+.2,L),sideM);sw.rotation.x=-Math.PI/2;sw.position.set(s*((off+3.7)/2),.22,-L/2+40);root.add(sw);const cb=mesh(new THREE.BoxGeometry(.3,.26,L),LM('#c6b79a'),s*3.75,.12,-L/2+40,root)}
 const church=buildChurch(pal);church.position.set(0,0,opt.churchZ||-120);church.scale.setScalar(opt.churchS||1.7);root.add(church);
 return{root,segs,types,road,rt,ct,church,off,
  update(dz,speed){for(const s of segs){s.g.position.z+=dz;if(s.g.position.z>SEG*1.5+1){s.g.position.z-=SEG*NSEG;for(const bb of s.b){const t=pick(types);bb.bm.geometry=t.geo;bb.bm.material=t.mats;bb.bm.position.y=t.h/2-.3;bb.par.position.y=t.h-.1}}}
   rt.offset.y+=dz/8;ct.offset.y+=dz/6},
  dispose(){sc.remove(root)}}}

/* ============ scenes ============ */
const cams={};function mkCam(k,fov,near=.1,far=400){const c=new THREE.PerspectiveCamera(fov,innerWidth/innerHeight,near,far);cams[k]=c;return c}
function lights(sc,top='#a9b6ff',bot='#3a2a55',hi=1.05,sun='#ffe3b8',si=.95,sp=[-6,12,8]){sc.add(new THREE.HemisphereLight(new THREE.Color(top),new THREE.Color(bot),hi));const d=new THREE.DirectionalLight(new THREE.Color(sun),si);d.position.set(...sp);sc.add(d);return d}
const SCN={};
/* --- stage (cinematic) --- */
function setupStage(){const sc=new THREE.Scene(),cam=mkCam('stage',46);sc.background=new THREE.Color(0x0d0a22);sc.fog=new THREE.Fog(0x0d0a22,18,60);lights(sc,'#6a5acd','#150c33',.8,'#ffd0ff',.7,[2,10,10]);
 mesh(new THREE.BoxGeometry(14,.8,6),M('#2a1f55'),0,.4,-1,sc);mesh(new THREE.BoxGeometry(14.2,.12,6.2),M('#ff4fa3',{emissive:'#ff4fa3',emissiveIntensity:.9}),0,.82,-1,sc);
 const cc=document.createElement('canvas');cc.width=512;cc.height=256;const g=cc.getContext('2d');const gr=g.createLinearGradient(0,0,512,256);gr.addColorStop(0,'#4b2bd6');gr.addColorStop(1,'#ff4fa3');g.fillStyle=gr;g.fillRect(0,0,512,256);g.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<8;i++)g.fillRect(i*64,0,28,256);g.fillStyle='#fff';g.font='400 150px "Lilita One",Arial Black,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('HEV LIVE',256,135);
 const led=new THREE.Mesh(new THREE.PlaneGeometry(14,7),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cc)}));led.position.set(0,5,-4);sc.add(led);
 const beams=[];for(let i=0;i<5;i++){const b=new THREE.Mesh(new THREE.ConeGeometry(1.4,12,16,1,true),new THREE.MeshBasicMaterial({color:[0xff4fa3,0x5ee0ff,0xffc94a,0x7b4dff,0xffffff][i],transparent:true,opacity:.16,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));b.position.set(-6+i*3,8,-2.5);b.userData.i=i;sc.add(b);beams.push(b)}
 const crowd=[];for(let r=0;r<4;r++)for(let i=0;i<14;i++){crowd.push(mkFan(-9+i*1.4+(r%2)*.7,.05,6+r*1.4,r*14+i,sc,1))}
 SCN.stage={sc,cam,beams,crowd,hev:null,dags:null,coins:[],t:0,pan:0}}
function stageBuild(){const s=SCN.stage;if(s.hev)return;s.hev=buildChibi(HEV_LOOK);s.hev.g.scale.setScalar(2.5);s.hev.g.position.set(-1.5,.8,-1);s.sc.add(s.hev.g);
 s.dags=buildChibi(DAGS_LOOK);s.dags.g.scale.setScalar(2.6);s.dags.g.position.set(14,.8,-1);s.dags.g.rotation.y=-.5;s.sc.add(s.dags.g)}
function stageUpdate(dt,t){const s=SCN.stage;s.beams.forEach(b=>{b.rotation.z=Math.sin(t*1.3+b.userData.i)*.5;b.rotation.x=Math.cos(t*1.1+b.userData.i)*.2});
 s.crowd.forEach((c,i)=>fanAnim(c,t,i));
 s.coins.forEach(c=>{c.v.y-=14*dt;c.m.position.addScaledVector(c.v,dt);if(c.m.position.y<.9){c.m.position.y=.9;c.v.y=Math.abs(c.v.y)*.5;c.v.x*=.7;c.v.z*=.7}c.m.rotation.y+=dt*6})}
/* --- playground --- */
function setupPlay(){const sc=new THREE.Scene(),cam=mkCam('play',42);sc.background=skyTex(['#5aa8ff','#a8d8ff','#fff0c8']);sc.fog=new THREE.Fog(0xcfe8ff,18,60);lights(sc,'#ffffff','#4a7a4a',1.1,'#fff4d0',.9,[4,10,6]);
 const gr=mesh(new THREE.CylinderGeometry(8,8.4,.6,40),M('#58c470'),0,-.3,0,sc);mesh(new THREE.TorusGeometry(7.4,.1,6,60),M('#ffe27a'),0,.02,0,sc).rotation.x=Math.PI/2;
 for(let i=0;i<26;i++){const a=rnd(0,6.28),r=rnd(2,7);const f=mesh(new THREE.SphereGeometry(.12,8,6),M(pick(['#ff7aa8','#ffe27a','#ffffff','#b58cff'])),Math.cos(a)*r,.12,Math.sin(a)*r,sc)}
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2+.3,r=7;const tr=new THREE.Group();mesh(new THREE.CylinderGeometry(.18,.25,1.4,8),M('#8a5a3a'),0,.7,0,tr,1.06);mesh(new THREE.SphereGeometry(1,14,10),M(pick(['#3fb86a','#4fd07a','#ff9fc0'])),0,2.1,0,tr,1.04);tr.position.set(Math.cos(a)*r,0,Math.sin(a)*r-1);sc.add(tr)}
 const toy=mesh(new THREE.SphereGeometry(.4,14,10),M('#ff4fa3',{emissive:'#ff4fa3',emissiveIntensity:.2}),2,.4,2,sc,1.06);
 SCN.play={sc,cam,pets:[],hearts:[],toy,t:0}}
function playBuild(){const p=SCN.play;p.pets.forEach(o=>p.sc.remove(o.pt.g));p.pets=[];const own=PETS.filter(d=>S.pets[d.id]);own.forEach((d,i)=>{const pt=buildPet(d,petStage(S.pets[d.id].lvl,S.evoView[d.id]!==false));pt.g.scale.setScalar(1.6);const a=i/Math.max(1,own.length)*6.28;pt.g.position.set(Math.cos(a)*3,0,Math.sin(a)*3);p.sc.add(pt.g);p.pets.push({pt,d,tx:pt.g.position.x,tz:pt.g.position.z,wait:rnd(0,2),hop:0})})}
function playUpdate(dt,t){const p=SCN.play;p.pets.forEach((o,i)=>{const g=o.pt.g;o.wait-=dt;if(o.wait<=0){const a=rnd(0,6.28),r=rnd(0,5.5);o.tx=Math.cos(a)*r;o.tz=Math.sin(a)*r;o.wait=rnd(2,5)}
 const dx=o.tx-g.position.x,dz=o.tz-g.position.z,d=Math.hypot(dx,dz);if(d>.15){g.position.x+=dx/d*dt*1.6;g.position.z+=dz/d*dt*1.6;g.rotation.y=lerp(g.rotation.y,Math.atan2(dx,dz),.1)}
 o.hop=Math.max(0,o.hop-dt*2.4);o.pt.update(t+i,d>.15?1.6:.5);o.pt.rig.position.y+=Math.sin(o.hop*Math.PI)*1.1});
 p.hearts=p.hearts.filter(h=>{h.life-=dt;h.s.position.y+=dt*1.4;h.s.material.opacity=Math.max(0,h.life);if(h.life<=0){p.sc.remove(h.s);return false}return true});
 p.cam.position.set(0,6.5,11.5);p.cam.lookAt(0,.6,0)}
/* --- thumbnails --- */
let TR=null,TS=null,TC_=null;
function thumb(obj,cp,look,fov=32,size=256){if(!TR){TR=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});TR.setSize(size,size);TR.setPixelRatio(1);TS=new THREE.Scene();TS.add(new THREE.HemisphereLight(0xffffff,0x6a5a90,1.15));const d=new THREE.DirectionalLight(0xfff0d8,1);d.position.set(3,6,8);TS.add(d);TC_=new THREE.PerspectiveCamera(fov,1,.1,50)}
 TC_.fov=fov;TC_.updateProjectionMatrix();TC_.position.set(...cp);TC_.lookAt(...look);TS.add(obj);TR.render(TS,TC_);const u=TR.domElement.toDataURL('image/png');TS.remove(obj);return u}
const thumbCache={};

/* fans: real people (skin tones, hair, tees split Hev-blue / Dags-pink, raised arms) */
function mkFan(x,y,z,i,sc,sz){const g=new THREE.Group();g.position.set(x,y,z);const sk=['#f1c27d','#e0ac69','#c68642','#8d5524','#ffdbac'][i%5],sh=['#5ee0ff','#ff4fa3','#ffd23f','#8a6aff','#5be38a','#ff7a2a'][(i*7)%6],hr=['#1a1208','#2a1a10','#0e0e0e','#4a2c14','#8a5a2a'][(i*3)%5],K=.8*(sz||1);
 const add=(geo,col,px,py,pz)=>{const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:col}));m.position.set(px*K,py*K,pz*K);g.add(m);return m};
 add(new THREE.BoxGeometry(.2,.55,.2),'#1c2140',-.09,.28,0);add(new THREE.BoxGeometry(.2,.55,.2),'#1c2140',.09,.28,0);
 add(new THREE.BoxGeometry(.46,.55,.28),sh,0,.82,0);const sp=add(new THREE.BoxGeometry(.23,.55,.285),(i%2?'#5ee0ff':'#ff4fa3'),-.115,.82,0);
 add(new THREE.SphereGeometry(.2,10,8),sk,0,1.28,0);const hair=add(new THREE.SphereGeometry(.215,10,6,0,Math.PI*2,0,Math.PI*.55),hr,0,1.3,-.01);if(i%4===0){add(new THREE.BoxGeometry(.44,.34,.1),hr,0,1.25,-.14)}
 const la=add(new THREE.BoxGeometry(.12,.5,.12),sk,-.3,.95,0),ra=add(new THREE.BoxGeometry(.12,.5,.12),sk,.3,.95,0);
 const ph=add(new THREE.BoxGeometry(.12,.2,.03),i%3===0?'#ffffff':'#ffe27a',.34,1.28,.05);ph.material=new THREE.MeshBasicMaterial({color:i%3===0?'#dff4ff':'#fff2a0'});
 g.scale.setScalar(1);sc.add(g);return{h:g,ph,la,ra,b:i*.7,base:y}}
function fanAnim(c,t,i){const b=Math.abs(Math.sin(t*4+(c.b||i)));c.h.position.y=(c.base||0)+b*.18;if(c.la){c.la.rotation.z=.5+Math.sin(t*6+(c.b||i))*.5;c.ra.rotation.z=-.5-Math.sin(t*6+(c.b||i)+1)*.5}}

/* ============ run engine (2.5D lane runner, 3D rendered) ============ */
const LANES=[-2.2,0,2.2];
const tex=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)};
const TX={
 stripe:tex(128,64,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle='#e8334a';for(let x=-h;x<w;x+=32){g.beginPath();g.moveTo(x,h);g.lineTo(x+16,h);g.lineTo(x+16+h,0);g.lineTo(x+h,0);g.fill()}}),
 banner:tex(256,128,(g,w,h)=>{g.fillStyle='#ff4fa3';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='400 64px "Lilita One",Arial Black,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('SALE!',w/2,h/2+4);g.strokeStyle='#ffc94a';g.lineWidth=8;g.strokeRect(6,6,w-12,h-12)}),
 crate:tex(128,128,(g,w,h)=>{g.fillStyle='#b9854a';g.fillRect(0,0,w,h);g.strokeStyle='#6a4524';g.lineWidth=8;g.strokeRect(4,4,w-8,h-8);g.beginPath();g.moveTo(8,8);g.lineTo(w-8,h-8);g.moveTo(w-8,8);g.lineTo(8,h-8);g.stroke();g.fillStyle='#e8334a';g.font='400 34px Arial Black,sans-serif';g.textAlign='center';g.fillText('DAGS',w/2,h/2+12)}),
 q:tex(128,128,(g,w,h)=>{g.fillStyle='#7b4dff';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='400 100px "Lilita One",Arial Black,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('?',w/2,h/2+6)}),
 umb:tex(128,64,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#fff':'#ff6a3c';g.fillRect(i*16,0,16,h)}})};
const GEO={coin:(()=>{const g=new THREE.CylinderGeometry(.4,.4,.09,22);g.rotateX(Math.PI/2);return g})(),rim:(()=>{const g=new THREE.TorusGeometry(.4,.045,6,22);return g})(),gem:new THREE.OctahedronGeometry(.42),box:new THREE.BoxGeometry(1,1,1)};
function mkItem(type){const g=new THREE.Group();let spin=true;
 const goldM=M('#ffc94a',{emissive:'#e08a12',emissiveIntensity:.55,metalness:.6,roughness:.3});
 if(type==='coin'){mesh(GEO.coin,goldM,0,0,0,g);mesh(GEO.rim,M('#fff1a8',{emissive:'#ffd24a',emissiveIntensity:.5}),0,0,0,g)}
 else if(type==='gold'||type==='star'){const c=mesh(GEO.coin,M('#ffe27a',{emissive:'#ffb800',emissiveIntensity:.9,metalness:.7,roughness:.25}),0,0,0,g);c.scale.setScalar(1.45);const r=mesh(GEO.rim,M('#fff',{emissive:'#fff1a8',emissiveIntensity:.9}),0,0,0,g);r.scale.setScalar(1.45);const gl=glowSprite('#ffd24a',2.4,.65);g.add(gl)}
 else if(type==='gem'){const m=mesh(GEO.gem,M('#5ee0ff',{emissive:'#1fb8ff',emissiveIntensity:.8,roughness:.2,metalness:.3}),0,0,0,g);m.scale.y=1.35;g.add(glowSprite('#5ee0ff',1.8,.5))}
 else if(type==='chest'){mesh(new THREE.BoxGeometry(.95,.5,.65),M('#8a5a2a'),0,-.1,0,g,1.04);mesh(new THREE.BoxGeometry(1,.28,.7),M('#a8702e'),0,.28,0,g,1.04);mesh(new THREE.BoxGeometry(.2,.7,.72),goldM,0,.05,0,g);g.add(glowSprite('#ffd24a',2.2,.5));spin=false;g.userData.bob=1}
 else if(type==='mystery'){mesh(new THREE.BoxGeometry(.8,.8,.8),new THREE.MeshStandardMaterial({map:TX.q,emissive:'#5a2aff',emissiveIntensity:.35}),0,0,0,g,1.05);g.add(glowSprite('#b58cff',2,.5))}
 else if(type==='orb'){mesh(new THREE.SphereGeometry(.42,16,12),M('#ffffff',{emissive:'#7fe8ff',emissiveIntensity:.9}),0,0,0,g);const r=mesh(new THREE.TorusGeometry(.62,.05,6,24),M('#ffc94a',{emissive:'#ffc94a',emissiveIntensity:.8}),0,0,0,g);r.rotation.x=1.2;g.add(glowSprite('#9ff',2.6,.6))}
 else if(type==='frag'){const m=mesh(new THREE.DodecahedronGeometry(.45),M('#5ef0d0',{emissive:'#1fd0b0',emissiveIntensity:.8}),0,0,0,g,1.05);g.add(glowSprite('#5ef0d0',2.4,.6))}
 else if(type==='ticket'){mesh(new THREE.BoxGeometry(.95,.5,.1),M('#ff5d73',{emissive:'#ff2a4a',emissiveIntensity:.45}),0,0,0,g,1.05);mesh(new THREE.BoxGeometry(.08,.5,.12),M('#fff'),.15,0,0,g);g.add(glowSprite('#ff7a8a',2,.4))}
 else if(type==='note'){mesh(new THREE.SphereGeometry(.24,12,10),M('#b58cff',{emissive:'#7b4dff',emissiveIntensity:.9}),-.1,-.3,0,g);mesh(new THREE.CylinderGeometry(.05,.05,.8,6),M('#b58cff',{emissive:'#7b4dff',emissiveIntensity:.9}),.08,.08,0,g);const f=mesh(new THREE.BoxGeometry(.3,.12,.05),M('#ff9fd6',{emissive:'#ff4fa3',emissiveIntensity:.9}),.22,.4,0,g);f.rotation.z=-.5;g.add(glowSprite('#b58cff',2.2,.6))}
 g.userData.spin=spin;return g}
function mkObs(type){const g=new THREE.Group();let hw=.95,hd=.45,hh=.85;
 if(type==='low'){mesh(new THREE.BoxGeometry(1.9,.5,.28),new THREE.MeshStandardMaterial({map:TX.stripe,roughness:.7}),0,.62,0,g,1.04);for(const s of[-1,1])mesh(new THREE.BoxGeometry(.14,.85,.2),M('#444a66'),s*.82,.42,0,g)}
 else if(type==='gate'){for(const s of[-1,1])mesh(new THREE.BoxGeometry(.18,3.4,.3),M('#3a2f55'),s*1.02,1.7,0,g,1.04);mesh(new THREE.BoxGeometry(2.2,2.1,.3),new THREE.MeshStandardMaterial({map:TX.banner,roughness:.8}),0,2.25,0,g,1.03);hh=99}
 else if(type==='cart'){mesh(new THREE.BoxGeometry(1.7,1.1,1.8),M('#a8702e'),0,.7,0,g,1.04);mesh(new THREE.BoxGeometry(1.5,.12,1.6),M('#e8d6a8'),0,1.3,0,g);const um=mesh(new THREE.ConeGeometry(1.35,.7,12),new THREE.MeshStandardMaterial({map:TX.umb}),0,2.35,0,g,1.03);mesh(new THREE.CylinderGeometry(.05,.05,1.2,6),M('#444'),0,1.8,0,g);for(const s of[-1,1])mesh(new THREE.CylinderGeometry(.3,.3,.14,12),M('#222'),s*.9,.3,.5,g).rotation.z=Math.PI/2;hd=.95;hh=2.3}
 else if(type==='mover'){const j=buildJeepney(pick(['#ffc94a','#5ee0ff','#7b4dff','#2fd08a']),'#ff4fa3','PARA PO');j.scale.setScalar(.38);g.add(j);hd=.95;hh=2.3;hw=.8}
 else if(type==='crate'){mesh(new THREE.BoxGeometry(1.5,1.5,1.5),new THREE.MeshStandardMaterial({map:TX.crate}),0,.75,0,g,1.03);hd=.8;hh=2.3;hw=.8;g.userData.ring=mesh(new THREE.RingGeometry(.5,.85,24),new THREE.MeshBasicMaterial({color:0xff3a4a,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}),0,.05,0)}
 g.userData.hw=hw;g.userData.hd=hd;g.userData.hh=hh;return g}

let G=null,RS=null; // run state, run scene
const keysDown={};
const ptr={x:0,y:0};
function petStats(){const d=PETS.find(p=>p.id===S.petSel);if(!d||!S.pets[d.id])return null;const p=S.pets[d.id],ascended=p.lvl>=20;const mult=(1+.08*(p.lvl-1))*(p.lvl>=5?1.2:1)*(ascended?1.25:1);return{d,p,dur:d.dur*mult,cd:16*(1-.07*(S.up.pet||0))*(ascended?.85:1)*(hasT('charm')?.8:1)}}
const upv=k=>effL(S.up[k]||0);

function startRun(kind,distId){
 if(kind==='journey')kind='catch';if(S.trapped&&distId!==S.trapped)distId=S.trapped;
 hudReset();if(kind==='explore')return startExplore(distId);
 if(kind!=='journey')return startArena(kind,distId);
 stopAll();if(kind==='journey')setPix(true);{const tb=$('#tbtns');if(tb)tb.hidden=true;$('#btnPow').style.display='';const kk=$('#keys');if(kk)kk.textContent='A / D or arrows steer | W / Space jump | S slide | Q pet | E power-up | P pause'}TUT=TUT_RUN;const pal=kind==='journey'?Object.assign({},DIST[0],{sky:['#ff9a5a','#ffcf7a','#fff1c0'],fog:'#f4c07a'}):DIST.find(d=>d.id===distId)||DIST[0];
 const sc=new THREE.Scene(),cam=cams.run||mkCam('run',60);addSky(sc,pal,kind!=='journey');lights(sc,kind==='journey'?'#fff0d0':'#a9b6ff',kind==='journey'?'#8a6a50':'#3a2a55',1.1,'#ffe3b8',1);
 const env=buildRunEnv(sc,pal,{off:7.5,churchZ:-135,churchS:1.9});
 let ch,pl;if(kind==='journey'){pl={g:new THREE.Group(),kind:'jeep'};const j=buildJeepney('#ff4fa3','#5ee0ff','INTRAMUROS');j.rotation.y=Math.PI;j.scale.setScalar(.5);pl.g.add(j);pl.j=j}else pl=buildChibi(resolveLook(S.look||defaultLook()));
 sc.add(pl.g);pl.g.rotation.y=kind==='journey'?0:Math.PI;
 const ps=petStats();let pet=null;if(ps&&kind!=='journey'){pet=buildPet(ps.d,petStage(ps.p.lvl,S.evoView[ps.d.id]!==false));pet.g.scale.setScalar(.9);pet.g.rotation.y=Math.PI;sc.add(pet.g)}
 const clones=[];const cl=resolveLook(Object.assign({},S.look||{},{hc:'#5ee0ff',tc:'#5ee0ff',skin:'#9ff4ff',aura:'#5ee0ff'}));
 for(let i=0;i<2;i++){const c=buildChibi(cl);c.g.rotation.y=Math.PI;c.g.visible=false;sc.add(c.g);clones.push(c)}
 const shield=new THREE.Mesh(new THREE.SphereGeometry(1.5,16,12),new THREE.MeshBasicMaterial({color:0xff9fd6,transparent:true,opacity:.28,depthWrite:false}));shield.visible=false;sc.add(shield);
 let boss=null;if(kind==='boss'){boss=buildChibi(DAGS_LOOK);boss.g.scale.setScalar(4.6);boss.g.position.set(0,0,-62);sc.add(boss.g);const l=labelSprite('Uncle Dags','#d4491b',  '#fff',7);l.position.set(0,12.5,-62);sc.add(l);G_bossLabel=l;
  for(const s of[-1,1]){const sp=new THREE.Group();mesh(new THREE.BoxGeometry(4,7,3),M('#14141c'),0,3.5,0,sp,1.02);for(const y of[2.2,5])mesh(new THREE.CylinderGeometry(1.1,1.1,.3,16),M('#2a2a38',{emissive:'#7b4dff',emissiveIntensity:.5}),0,y,1.55,sp).rotation.x=Math.PI/2;sp.position.set(s*10,0,-58);sc.add(sp)}}
 const tun=glowSprite('#ffc94a',60,0);tun.position.set(0,2,-30);sc.add(tun);
 SCN.run=RS={sc,cam,env,pl,pet,clones,shield,boss,tun,pal,parts:[],fall:[]};
 let CN;const hearts=baseLives()+(upv('surv')>=3?1:0)+(upv('surv')>=5?1:0)+(hasT('heart')?1:0)+(CN=takeCons()).heart;
 G={kind,dist:distId,t:0,pause:false,over:false,speed:0,base:kind==='journey'?15:16,distM:0,x:0,lane:1,y:0,vy:0,slide:0,lives:hearts,maxLives:hearts,inv:CN.shield?5:0,cdbl:CN.dbl,rev:CN.revive,score:0,coins:0,combo:0,best:0,comboT:0,round:1,nextRound:450,
  items:[],obs:[],gap:12,sinceSpawn:0,fx:{gravity:CN.magnet?12:0},catches:0,golds:0,chests:0,frags:0,tix:0,jumps:0,slides:0,petUses:0,powUses:0,hits:0,
  petCd:0,pow:null,powCharges:0,mochi:0,tut:S.tutorialDone?null:{step:0,t:0,need:0},time:0,journeyT:0,shake:0,state:'run',bossP:0,bossPh:0,hype:0,orbs:0,notes:0,lastDist:0,lineLane:1};
 if(boss)G.maxBoss=100;
 const pw=POWERS.find(p=>p.id===S.power);if(pw&&(S.inv.power[pw.id]||0)>0){S.inv.power[pw.id]--;G.powCharges=1;G.pow=pw}else G.pow=pw||POWERS[4];
 buildRunHud();showScreen('run');R.setClearColor(0x000000);musicEnsure();save();
 G.banner=kind==='boss'?'RAP BATTLE!':kind==='journey'?'ALL ABOARD!':'GO!';banner(G.banner);
 SFX.round();setMode('run')}
let G_bossLabel=null;
function buildRunHud(){const ps=petStats();$('#petImg').src=ps?petThumb(ps.d,petStage(ps.p.lvl,S.evoView[ps.d.id]!==false)):'';$('#btnPet').style.display=ps&&G.kind!=='journey'?'grid':'none';
 $('#powName').textContent=G.pow.name.split(' ').join('\n');$('#bossBar').hidden=G.kind!=='boss';$('#coach').hidden=true;$('#keys').style.opacity=1;setTimeout(()=>{const k=$('#keys');if(k)k.style.opacity=0},7000);
 $('#btnPow').style.display=G.kind==='journey'?'none':'grid';$('#bubble').hidden=true;$('#efx').innerHTML='';hudDirty();}
function hudDirty(){const h=$('#hearts');let s='';if(G.maxLives>8)s=ICO.heart+`<b class="hnum">x${G.lives}<small>/${G.maxLives}</small></b>`;else for(let i=0;i<G.maxLives;i++)s+=i<G.lives?ICO.heart:ICO.heartX;if(h.dataset.s!==s){h.innerHTML=s;h.dataset.s=s}
 $('#rScore').textContent=fmt(G.score);$('#rCoins').textContent=fmt(G.coins);$('#roundTxt').textContent=G.kind==='journey'?'Jeepney Adventure':G.kind==='boss'?'Rap Battle':'Round '+G.round;
 const cb=$('#combo');if(G.combo>=3){cb.classList.add('on');cb.textContent='COMBO x'+G.combo}else cb.classList.remove('on');
 $('#powCt').textContent=G.powCharges;const pc=G.powCharges>0?0:1;$('#powCd').style.transform=`scaleY(${G.fx.powActive?1:pc})`;$('#btnPow').classList.toggle('ready',G.powCharges>0);
 const ps=petStats();if(ps){const r=clamp(G.petCd/ps.cd,0,1);$('#petCd').style.transform=`scaleY(${r})`;$('#btnPet').classList.toggle('ready',G.petCd<=0)}
 if(G.kind==='boss')$('#bossFill').style.width=G.bossP+'%'}
function banner(t){const b=$('#banner');b.textContent=t;b.classList.remove('show');void b.offsetWidth;b.classList.add('show')}
let bubbleT=0;function say(who,txt,ms=2800){const b=$('#bubble');b.hidden=false;b.innerHTML=`<b style="color:${(typeof G!=='undefined'&&G&&G.bcfg&&who===G.bcfg.name)?G.bcfg.col:'#d4491b'}">${who}:</b> ${esc(txt)}`;bubbleT=ms/1000}
function coach(txt,title){const c=$('#coach');c.hidden=false;c.innerHTML=`<b>${title}</b>${txt}`}
function fxBar(id,name,t,max,col){}

/* ---- spawning ---- */
function addItem(type,lane,z,yo=0,val){const m=mkItem(type);const x=typeof lane==='number'&&lane%1===0?LANES[lane]:lane;m.position.set(x,1,z);RS.sc.add(m);const it={type,m,x,z,yo,lane,dead:false,val:val};G.items.push(it);return it}
function addObs(type,lane,z){const m=mkObs(type);const x=LANES[lane];m.position.set(x,0,z);RS.sc.add(m);if(m.userData.ring)RS.sc.add(m.userData.ring);const o={type,m,x,z,lane,hw:m.userData.hw,hd:m.userData.hd,hh:m.userData.hh,dead:false,ph:Math.random()*6,fall:type==='crate',y0:0};G.obs.push(o);return o}
const coinOrGold=i=>i%8===7?'gold':'coin';
const PAT={
 line(z){const l=rint(0,2),n=rint(6,9);for(let i=0;i<n;i++)addItem(coinOrGold(i),l,z-i*2.6);return n*2.6},
 zig(z){let l=rint(0,2);for(let i=0;i<10;i++){addItem(coinOrGold(i),l,z-i*2.4);if(i%3===2)l=clamp(l+pick([-1,1]),0,2)}return 24},
 wall(z){for(let l=0;l<3;l++){addObs('low',l,z);for(let k=0;k<5;k++)addItem('coin',l,z+3-k*1.5,1.2+Math.sin(k/4*Math.PI)*1.3)}return 6},
 gate(z){for(let l=0;l<3;l++){addObs('gate',l,z);for(let k=0;k<3;k++)addItem('coin',l,z+2.5-k*2.5)}return 8},
 block(z){const s=rint(0,2);for(let l=0;l<3;l++)if(l!==s)addObs('cart',l,z);for(let i=0;i<7;i++)addItem(coinOrGold(i+1),s,z+5-i*2.6);return 14},
 mover(z){addObs('mover',rint(0,2),z);const l=rint(0,2);for(let i=0;i<6;i++)addItem('coin',l,z+4-i*2.6);return 12},
 crates(z){const s=rint(0,2);for(let l=0;l<3;l++)if(l!==s)addObs('crate',l,z);for(let i=0;i<5;i++)addItem('coin',s,z+4-i*3);return 14},
 treasure(z){const l=rint(0,2);addItem('chest',l,z);for(let i=1;i<4;i++){addItem('coin',l,z-i*2.2);addItem('coin',l,z+i*2.2)}return 10},
 special(z){const l=rint(0,2),lucky=1+upv('lucky')*.15+(hasT('shoe')?.15:0);const r=Math.random();
  if(G.kind!=='journey'&&r<.3*lucky&&G.powCharges<1&&!G.fx.powActive)addItem('orb',l,z);else if(r<.55)addItem('mystery',l,z);else if(r<.72*Math.min(1.4,lucky)&&G.kind==='catch')addItem('frag',l,z);else if(r<.88)addItem('ticket',l,z);else addItem('gem',l,z);
  for(let i=1;i<4;i++)addItem('coin',l,z-i*2.4);return 10},
 notes(z){const l=rint(0,2),n=rint(5,8);for(let i=0;i<n;i++)addItem('note',l,z-i*2.6);return n*2.6},
 notezig(z){let l=rint(0,2);for(let i=0;i<9;i++){addItem('note',l,z-i*2.4);if(i%3===2)l=clamp(l+pick([-1,1]),0,2)}return 22}};
function spawnPattern(){const z=-95;let len=10;
 if(G.fx.portal>0){for(let i=0;i<8;i++){addItem('gold',rint(0,2),z-i*3,0,5)}return 24}
 if(G.tut&&G.tut.step<4){len=PAT.line(z);G.gap=len+10;return}
 if(G.kind==='boss'){const ph=G.bossPh,r=Math.random();
  if(r<.5)len=Math.random()<.5?PAT.notes(z):PAT.notezig(z);
  else if(ph===0){len=r<.75?PAT.block(z):PAT.wall(z)}
  else if(ph===1){len=r<.65?PAT.mover(z):r<.85?PAT.block(z):PAT.wall(z)}
  else{len=r<.6?PAT.crates(z):r<.8?PAT.mover(z):PAT.gate(z)}
  G.gap=len+rnd(5,8)-ph;return}
 const diff=clamp(.32+(G.round-1)*.07,.32,.75),r=Math.random();
 if(r<diff){const q=Math.random();
  if(G.kind==='journey'){len=q<.4?PAT.wall(z):q<.75?PAT.block(z):PAT.mover(z)}
  else if(q<.2)len=PAT.wall(z);else if(q<.4)len=PAT.gate(z);else if(q<.62)len=PAT.block(z);else if(q<.82)len=PAT.mover(z);else len=G.round>=2?PAT.crates(z):PAT.block(z)}
 else{const q=Math.random();len=q<.4?PAT.line(z):q<.65?PAT.zig(z):q<.85?PAT.treasure(z):PAT.special(z)}
 G.gap=len+rnd(6,10)-Math.min(4,G.round*.4)}

/* ---- actions ---- */
function jump(){if(!G||G.over||G.pause)return;if(G.y<=.02&&G.slide<=0){G.vy=10.6;SFX.jump();G.jumps++;track('jump',1);tutStep('jump')}else if(G.y>.02&&G.slide<=0){/* double press = nothing */}}
function slide(){if(!G||G.over||G.pause||G.kind==='journey')return;if(G.y>.2){G.vy=-16;G.wantSlide=true}else if(G.slide<=0){G.slide=.62+upv('move')*.05;SFX.slide();G.slides++;tutStep('slide')}}
function laneMove(d){if(!G||G.over||G.pause)return;const n=clamp(G.lane+d,0,2);if(n!==G.lane){G.lane=n;tutStep('lane')}}
function burst(pos,col,n=8,sp=5,up=3){for(let i=0;i<n&&RS.parts.length<110;i++){const s=glowSprite(col,rnd(.4,.9),.95);s.position.copy(pos);const a=rnd(0,6.28);s.userData={v:new THREE.Vector3(Math.cos(a)*rnd(.3,1)*sp,rnd(.3,1)*up+1,Math.sin(a)*rnd(.3,1)*sp),life:rnd(.4,.8)};RS.sc.add(s);RS.parts.push(s)}}
function addScore(v){G.score+=Math.round(v)}
const mult=()=>Math.min(5,1+Math.floor(G.combo/10));
function catchItem(it,silent){if(it.dead)return;it.dead=true;RS.sc.remove(it.m);const p=new THREE.Vector3(it.x,it.m.position.y,0);
 let t=it.type,val=0,col='#ffd24a';
 if(t==='coin'&&G.fx.midas>0)t='gold';
 const cm=(G.cdbl?2:1)*(1+upv('coin')*.12+(hasT('purse')?.15:0))*(G.fx.jackpot>0&&(t==='coin'||t==='gold')?3:1);
 const portalGold=G.fx.portal>0;
 if(t==='coin'){val=1;SFX.coin(G.combo)}else if(t==='gold'||t==='star'||portalGold){val=it.val||5;G.golds++;track('gold',1);SFX.gold()}
 else if(t==='gem'){val=10;col='#5ee0ff';SFX.gem()}else if(t==='chest'){val=25;G.chests++;track('chest',1);SFX.gem();banner('TREASURE!')}
 else if(t==='note'){val=1;col='#b58cff';SFX.coin(G.combo);bossHype(4)}
 else if(t==='mystery'){const r=Math.random();if(r<.5){val=rint(15,40);banner('+'+Math.round(val*cm)+' COINS')}else if(r<.75){const k=pick(POWERS.filter(x=>x.dur>0));setFx(k,true);banner(k.name.toUpperCase())}else{G.tix++;banner('LUCKY TICKET!')}SFX.power();col='#b58cff'}
 else if(t==='orb'){if(G.powCharges<1){G.powCharges=1;banner('POWER READY!')}else val=5;SFX.power();col='#9ff'}
 else if(t==='frag'){G.frags++;S.inv.fragments++;track('frag',1);banner('MAP FRAGMENT!');SFX.win();col='#5ef0d0'}
 else if(t==='ticket'){G.tix++;banner('LUCKY TICKET!');SFX.power();col='#ff7a8a'}
 if(t!=='note'&&val>0&&!silent&&G.fx.yuki>0){val+=2;burst(p,'#7fd6ff',6)}
 const v=Math.round(val*cm);G.coins+=v;G.catches++;G.combo++;G.comboT=3;G.best=Math.max(G.best,G.combo);track('catch',1);track('combo',G.combo);
 addScore(v*10*mult()+5);S.stats.catches++;
 if(G.combo>0&&G.combo%10===0){banner('COMBO x'+G.combo+'!');SFX.round();buzz(30)}
 burst(p,col,t==='gold'||t==='chest'?12:6);
 if(!silent){if(G.fx.chain>0){let n=0;for(const o of G.items){if(!o.dead&&o!==it&&o.z<-1&&o.z>-26&&n<3){n++;setTimeout(()=>G&&!G.over&&catchItem(o,true),60*n)}}}
  if(G.fx.vexi>0){let n=0;for(const o of G.items){if(!o.dead&&o!==it&&o.lane===it.lane&&o.z<-1&&o.z>-14&&n<5){n++;setTimeout(()=>G&&!G.over&&catchItem(o,true),50*n)}}}}
 tutStep('catch');G.dirty=1}
function hitPlayer(o){if(G.inv>0||G.fx.portal>0||G.fx.choco>0)return;
 if(G.mochi>0){G.mochi--;G.inv=.8;burst(new THREE.Vector3(G.x,1.2,0),'#ff9fd6',14);SFX.pet();if(G.mochi<=0){G.fx.mochi=0;RS.shield.visible=false}if(o){o.dead=true}return}
 G.lives--;G.hits++;G.combo=0;G.inv=1.4+upv('surv')*.25+(hasT('guard')?.4:0);G.shake=.5;SFX.hit();buzz(120);burst(new THREE.Vector3(G.x,1.2,0),'#ff5d73',12);
 if(G.kind==='boss'){G.bossP=Math.max(0,G.bossP-3)}
 if(G.lives<=0&&G.rev){G.rev=0;G.lives=Math.min(2,G.maxLives);G.inv=3;banner('SECOND CHANCE!')}if(G.lives<=0)endRun('lives');else banner('OUCH!');G.dirty=1}
function bossHype(n){if(G.kind!=='boss'||G.over)return;G.notes++;G.bossP=Math.min(100,G.bossP+n);const ph=G.bossP<33?0:G.bossP<66?1:2;
 if(ph!==G.bossPh){G.bossPh=ph;banner(ph===1?'PHASE 2':'FINAL PHASE');SFX.round()}
 if(G.bossP>=100)endRun('win')}
function setFx(pw,free){const d=pw.dur*(1+upv('power')*.1)*(hasT('hourglass')?1.2:1);G.powUses++;S.stats.powerUses++;track('power',1);SFX.power();
 if(pw.id==='prism'&&G.arena)arenaPrism();else if(pw.id==='prism'){for(const o of G.obs){if(!o.dead&&o.z<2){o.dead=true;RS.sc.remove(o.m);if(o.m.userData.ring)RS.sc.remove(o.m.userData.ring);burst(new THREE.Vector3(o.x,1,o.z),'#ff9fd6',10);for(let k=0;k<3;k++)addItem('gem',o.lane,o.z-k*1.6)}}banner('PRISM BURST!')}
 else if(pw.id==='rewind'){G.fx.rewind=d;banner('TIME REWIND')}else if(pw.id==='jackpot'){G.fx.jackpot=d;banner('GOLDEN JACKPOT')}else if(pw.id==='clone'){G.fx.clone=d;banner('CRYSTAL CLONE')}
 else if(pw.id==='gravity'){G.fx.gravity=d;banner('GRAVITY SHIFT')}else if(pw.id==='chain'){G.fx.chain=d;banner('CHAIN REACTION')}
 else if(pw.id==='portal'){G.fx.portal=d;G.fx.powActive=1;for(const o of G.obs){if(G.arena){killObs(o);continue}if(!o.dead){o.dead=true;RS.sc.remove(o.m);if(o.m.userData.ring)RS.sc.remove(o.m.userData.ring)}}banner('TREASURE PORTAL!')}
 if(pw.dur>0)G.fx.powActive=d;G.fx.powId=pw.id;G.fx.powMax=d}
function usePower(){if(!G||G.over||G.pause||G.kind==='journey')return;if(G.powCharges<=0||G.fx.powActive>0){SFX.no();return}G.powCharges--;setFx(G.pow);tutStep('power');G.dirty=1}
function usePet(){if(!G||G.over||G.pause||G.kind==='journey')return;const ps=petStats();if(!ps)return;if(G.petCd>0){SFX.no();return}
 G.petCd=ps.cd;G.petUses++;S.stats.petUses++;track('pet',1);SFX.pet();const id=ps.d.id,d=ps.dur,ascended=ps.p.lvl>=20;banner(ps.d.ab.toUpperCase());burst(new THREE.Vector3(G.x,1.5,0),ps.d.c2,16,6,5);
 if(id==='aurum')G.fx.midas=d;else if(id==='choco'){G.fx.choco=d;G.fx.chocoSpeed=1}else if(id==='yuki')G.fx.yuki=d;else if(id==='mochi'){G.mochi=ascended?5:2;G.fx.mochi=d}
 else if(id==='zumi'&&G.arena){starRain();G.fx.zumi=ascended?3:2}else if(id==='zumi'){for(let i=0;i<(ascended?20:14);i++)addItem('star',rint(0,2),-14-i*2.4,0,4);G.fx.zumi=ascended?3:2}else if(id==='vexi')G.fx.vexi=d;
 const heal=()=>{if(G.lives<G.maxLives){G.lives++;if(typeof hud==='function')try{hud()}catch(e){}}};
 if(id==='aurum'){G.fx.jackpot=Math.max(G.fx.jackpot||0,d)}
 else if(id==='choco'){G.inv=Math.max(G.inv,d)}
 else if(id==='yuki'){heal();if(ascended)heal()}
 else if(id==='mochi'){G.mochi=ascended?5:3}
 else if(id==='zumi'){G.combo=(G.combo||0)+10;G.comboT=Math.max(G.comboT||0,6)}
 else if(id==='vexi'){G.fx.gravity=Math.max(G.fx.gravity||0,d*.8)}
 if(G.fx.mochi)RS.shield.visible=true;tutStep('pet')}

/* ---- tutorial ---- */
let TUT=[{need:'lane',title:'Switch lanes',txt:'Press Left or Right, or swipe sideways.'},{need:'jump',title:'Jump',txt:'Press Up or Space, or swipe up.'},{need:'slide',title:'Slide',txt:'Press Down, or swipe down.'},{need:'catch5',title:'Catch coins!',txt:'Run through coins to catch them. Chain catches for a combo.'},{need:'time',title:'Dodge and win',txt:'Jump over low barriers, slide under gates, switch lanes around carts. Tap the round buttons for pet and power-up moves.'}];
const TUT_RUN=TUT;
function tutStep(a){const T=G&&G.tut;if(!T)return;const cur=TUT[T.step];if(!cur)return;if(cur.need===a||(cur.need==='catch5'&&a==='catch'&&++T.c>=5)){T.step++;T.t=0;T.c=0;SFX.ui();if(T.step>=TUT.length){endTut()}else showTut()}}
function showTut(){const T=G.tut,c=TUT[T.step];coach(c.txt,c.title)}
function endTut(){G.tut=null;S.tutorialDone=true;$('#coach').hidden=true;save()}

/* ---- update ---- */
function runUpdate(dt){if(!G)return;if(G.explore)return exploreUpdate(dt);if(G.arena)return arenaUpdate(dt);const rs=RS;
 if(G.pause){render(rs.sc,rs.cam);return}
 G.t+=dt;
 if(G.tut){const T=G.tut;if(T.c==null){T.c=0;showTut()}T.t+=dt;if(TUT[T.step]&&TUT[T.step].need==='time'&&T.t>7)endTut()}
 if(bubbleT>0){bubbleT-=dt;if(bubbleT<=0)$('#bubble').hidden=true}
 // timers
 for(const k of['rewind','jackpot','clone','gravity','chain','portal','midas','choco','yuki','mochi','vexi','zumi','powActive'])if(G.fx[k]>0){G.fx[k]-=dt;if(G.fx[k]<=0){G.fx[k]=0;if(k==='mochi'){G.mochi=0;rs.shield.visible=false}if(k==='portal')banner('PORTAL CLOSED')}}
 if(G.petCd>0)G.petCd-=dt;if(G.inv>0)G.inv-=dt;if(G.comboT>0){G.comboT-=dt;if(G.comboT<=0)G.combo=0}
 // speed
 const ps=petStats();let sp=G.base*(G.fx.rewind>0?.55:1)*(G.fx.choco>0?1.3:1)*(G.fx.portal>0?1.25:1);
 if(G.kind==='boss')sp=15+G.bossPh*1.5;if(G.tut)sp=Math.min(sp,13);
 G.speed=lerp(G.speed,sp,.06);const dz=G.speed*dt;G.distM+=dz;G.score+=dz*.8;S.stats.distance+=0;
 if(G.kind==='catch'&&G.distM>=G.nextRound){G.round++;G.nextRound+=450;G.base=Math.min(34,G.base+1.7);banner('ROUND '+G.round);SFX.round();track('round',G.round);S.stats.bestRound=Math.max(S.stats.bestRound,G.round);G.dirty=1}
 if(G.kind==='journey'){G.journeyT+=dt;if(G.journeyT>=70){endRun('arrive')}}
 // player physics
 const tx=LANES[G.lane];G.x+=(tx-G.x)*Math.min(1,dt*(14+upv('move')*1.7));
 if(G.y>0||G.vy>0){G.vy-=28*dt;G.y+=G.vy*dt;if(G.y<=0){G.y=0;G.vy=0;if(G.wantSlide){G.wantSlide=false;G.slide=.62+upv('move')*.05;SFX.slide();G.slides++}}}
 if(G.slide>0)G.slide-=dt;
 // spawn
 G.sinceSpawn+=dz;if(G.sinceSpawn>=G.gap){G.sinceSpawn=0;spawnPattern()}
 // world
 rs.env.update(dz);
 const catchW=.9+upv('catch')*.1;
 const lanesX=[G.x];if(G.fx.clone>0){const o=[0,1,2].filter(i=>i!==G.lane);o.forEach(i=>lanesX.push(LANES[i]))}
 const pTop=G.slide>0?G.y+.85:G.y+1.8;
 for(const it of G.items){if(it.dead)continue;it.z+=dz;const fallY=Math.max(0,-it.z-26)*.22;let y=(it.type==='chest'?.75:1.05)+it.yo+fallY;
  if(it.m.userData.bob)y+=Math.sin(G.t*3+it.x)*.1;it.m.position.set(it.x,y,it.z);if(it.m.userData.spin)it.m.rotation.y+=dt*3.2;
  const mag=G.fx.gravity>0||G.fx.choco>0&&it.z>-14;
  if(mag&&it.z>-24&&it.z<2){it.x=lerp(it.x,G.x,Math.min(1,dt*6));it.yo=lerp(it.yo,0,.1)}
  else if(upv('catch')>0&&it.z>-9&&it.z<1&&Math.abs(it.x-G.x)<2.4){it.x=lerp(it.x,G.x,Math.min(1,dt*upv('catch')*1.2))}
  if(it.z>-1.1&&it.z<1.1){for(const lx of lanesX){if(Math.abs(it.x-lx)<catchW+.35&&y-.4<pTop+.1&&y+.4>G.y-.1){catchItem(it);break}}}
  if(it.z>5&&!it.dead){it.dead=true;rs.sc.remove(it.m);if(it.type==='gold'||it.type==='gem'||it.type==='chest'){}}}
 G.items=G.items.filter(i=>!i.dead);
 for(const o of G.obs){if(o.dead)continue;o.z+=dz;
  if(o.type==='mover'){o.x=Math.sin(G.t*1.6+o.ph)*2.2;o.m.position.x=o.x;o.z+=dz*.2}
  if(o.fall){const gy=Math.max(0,-o.z-34)*.6;o.m.position.set(o.x,gy,o.z);const rg=o.m.userData.ring;rg.rotation.x=-Math.PI/2;rg.position.set(o.x,.06,o.z);rg.scale.setScalar(1+Math.sin(G.t*8)*.08);o.m.rotation.y=gy>0?G.t*3:0}
  else o.m.position.z=o.z;
  if(o.type==='mover')o.m.position.set(o.x,0,o.z);
  if(G.fx.choco>0&&o.z>-12&&o.z<3){o.dead=true;rs.sc.remove(o.m);if(o.m.userData.ring)rs.sc.remove(o.m.userData.ring);burst(new THREE.Vector3(o.x,1,o.z),'#ff7a2a',14,6,4);for(let k=0;k<2;k++)addItem('coin',o.lane,o.z-k*1.4);continue}
  if(!G.over&&Math.abs(o.z)<o.hd+.45&&Math.abs(o.x-G.x)<o.hw+.4){
   if(o.fall&&o.m.position.y>1.2)continue;
   let hit=false;if(o.type==='gate'){hit=G.slide<=0}else hit=G.y<o.hh;
   if(hit)hitPlayer(o)}
  else if(o.type==='gate'&&o.z>.6&&!o.passed&&!o.dead){o.passed=true;if(G.slide>0){track('slide',1)}}
  if(o.z>8){o.dead=true;rs.sc.remove(o.m);if(o.m.userData.ring)rs.sc.remove(o.m.userData.ring)}}
 G.obs=G.obs.filter(o=>!o.dead||(rs.sc.remove(o.m),false));
 // visuals: player
 const pg=rs.pl.g;pg.position.set(G.x,G.y,0);
 if(rs.pl.kind==='jeep'){pg.rotation.z=(tx-G.x)*.06;pg.children[0].position.y=Math.sin(G.t*20)*.015}
 else{pg.rotation.z=(tx-G.x)*.08;pose(rs.pl,G.t,G.inv>.5&&G.inv>1?'hit':G.slide>0?'slide':G.y>.05?'jump':'run',G.speed/16)}
 pg.visible=G.inv>0&&G.fx.portal<=0?Math.floor(G.t*14)%2===0:true;
 if(G.fx.choco>0){pg.scale.setScalar(1.25)}else pg.scale.setScalar(1);
 if(rs.pet){rs.pet.g.position.x=lerp(rs.pet.g.position.x,G.x+(G.lane===2?-1.25:1.25),.1);rs.pet.g.position.z=lerp(rs.pet.g.position.z,1.7,.1);rs.pet.update(G.t*1.6);if(G.fx.choco>0)rs.pet.g.scale.setScalar(1.6);else rs.pet.g.scale.setScalar(.9)}
 rs.clones.forEach((c,i)=>{c.g.visible=G.fx.clone>0;if(G.fx.clone>0){const o=[0,1,2].filter(k=>k!==G.lane);c.g.position.set(LANES[o[i]],G.y,0);pose(c,G.t+i,G.y>.05?'jump':'run',1)}});
 rs.shield.visible=G.mochi>0;rs.shield.position.set(G.x,1.1,0);rs.shield.scale.setScalar(1+Math.sin(G.t*6)*.04);
 if(G.fx.portal>0){rs.sc.fog.color.lerp(new THREE.Color('#ffb347'),.05)}else rs.sc.fog.color.lerp(new THREE.Color(rs.pal.fog),.05);
 if(rs.boss){rs.boss.g.position.y=Math.abs(Math.sin(G.t*3))*.6;pose(rs.boss,G.t,G.bossPh>=1?'angry':'arms');}
 // particles
 for(let i=rs.parts.length-1;i>=0;i--){const p=rs.parts[i],u=p.userData;u.life-=dt;u.v.y-=9*dt;p.position.addScaledVector(u.v,dt);p.position.z+=dz*.9;p.material.opacity=Math.max(0,u.life*1.6);if(u.life<=0){rs.sc.remove(p);p.material.dispose();rs.parts.splice(i,1)}}
 // camera
 const a=innerWidth/innerHeight,cam=rs.cam;cam.fov=a<1?72:60;cam.updateProjectionMatrix();
 G.shake=Math.max(0,G.shake-dt*1.4);const sh=S.st.shake?G.shake:0;
 cam.position.set(G.x*.55+rnd(-sh,sh)*.4,(a<1?5.6:4.5)+rnd(-sh,sh)*.3,a<1?10:8);cam.lookAt(G.x*.3,1.5,-10);
 if(G.fx.rewind>0)cam.fov+=0;
 if(G.dirty||Math.floor(G.t*10)!==G.lastHud){G.dirty=0;G.lastHud=Math.floor(G.t*10);hudDirty();renderEfx()}
 render(rs.sc,cam)}
function renderEfx(){const e=$('#efx');let h='';const bars=[['powActive',G.fx.powId&&POWERS.find(p=>p.id===G.fx.powId)?POWERS.find(p=>p.id===G.fx.powId).name:'',G.fx.powMax,'#ffc94a']];
 for(const[k,n,m,c]of bars)if(G.fx[k]>0&&n)h+=`<div>${n}</div><div class="bar"><i style="width:${(G.fx[k]/m*100)}%"></i></div>`;
 const ps=petStats();if(ps){const pk={aurum:'midas',choco:'choco',yuki:'yuki',mochi:'mochi',vexi:'vexi'}[ps.d.id];if(pk&&G.fx[pk]>0)h+=`<div>${ps.d.ab}</div><div class="bar v"><i style="width:${Math.min(100,G.fx[pk]/ps.dur*100)}%"></i></div>`}
 if(e.dataset.h!==h){e.innerHTML=h;e.dataset.h=h}}
function pauseRun(){if(!G||G.over||G.pause)return;G.pause=true;openPause()}
function resumeRun(){if(!G)return;G.pause=false;closeSheet()}
function endRun(why){if(G.over)return;G.over=true;G.reason=why;
 const win=why==='win'||why==='arrive';if(win)SFX.win();else SFX.lose();
 setTimeout(()=>{if(G)finishRun(why)},win?900:700)}

/* ============ screen + sheet plumbing ============ */
let mode='none',curScene=null;
const SCREENS=['title','home','run','cust','cine'];
let lastScr=null,wipeN=0;
const WIPES=[['circle(0% at 50% 50%)','circle(85% at 50% 50%)'],['inset(0 100% 0 0)','inset(0 0 0 0)'],['inset(100% 0 0 0)','inset(0 0 0 0)'],['polygon(0 0,0 0,0 0)','polygon(0 0,260% 0,0 260%)'],['inset(0 0 0 100%)','inset(0 0 0 0)'],['circle(0% at 0% 100%)','circle(150% at 0% 100%)'],['inset(0 0 100% 0)','inset(0 0 0 0)'],['circle(0% at 100% 0%)','circle(150% at 100% 0%)']];
function playWipe(){const w=document.getElementById('wipe');if(!w)return;const k=WIPES[wipeN++%WIPES.length];w.style.transition='none';w.style.opacity='.96';w.style.clipPath=k[0];void w.offsetWidth;w.style.transition='clip-path .3s ease-out';w.style.clipPath=k[1];setTimeout(()=>{w.style.transition='opacity .38s ease-in';w.style.opacity='0'},300)}
function showScreen(id){if(lastScr!==null&&id!==lastScr&&id!=='none')playWipe();lastScr=id;SCREENS.forEach(s=>{const e=$('#'+s);if(e)e.hidden=s!==id})}
function setMode(m){mode=m;document.body.dataset.view=(m==='home'||m==='title'||m==='cust')?'2d':'3d';if(m==='title'){showScreen('title')}else if(m==='home'){showScreen('home')}else if(m==='run'){showScreen('run')}else if(m==='cust'){showScreen('cust')}else if(m==='cine'){showScreen('cine')}else if(m==='play'){showScreen('none')}}
let pixLow=false;
function setPix(on){if(on===pixLow)return;pixLow=on;R.setPixelRatio(on?.32:Math.min(window.devicePixelRatio||1,S.st.quality==='low'?1:2));R.setSize(innerWidth,innerHeight,false)}
function stopAll(){if(G&&RS){RS.sc.traverse(o=>{});}G=null;RS=null;setPix(false)}
function render(sc,cam){R.render(sc,cam)}
let toastT=0;function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('show'),2400)}
function musicEnsure(){if(userTouched&&S.mu.auto&&aud.paused&&!musicWanted)playTrack(S.mu.track)}

let SH=null;
const SHEET_ANIMS=['a-up','a-zoom','a-right','a-drop','a-flip','a-left'];
function sheetAnim(t){t=String(t||'');if(/shop/i.test(t))return'a-up';if(/pet/i.test(t))return'a-zoom';if(/map|world/i.test(t))return'a-right';if(/quest|daily|weekly/i.test(t))return'a-drop';if(/setting|profile/i.test(t))return'a-flip';let h=0;for(const c of t)h=(h*31+c.charCodeAt(0))>>>0;return SHEET_ANIMS[h%SHEET_ANIMS.length]}
function openSheet(o){closeSheet(true);SH=o;if(!o.tab&&o.tabs)o.tab=o.tabs[0].id;
 const v=mk('div','veil');v.innerHTML=`<div class="sheet ${o.narrow?'narrow':''} ${sheetAnim(o.title)}" role="dialog" aria-modal="true" aria-label="${esc(o.title)}"><div class="sh-head"><h2>${esc(o.title)}</h2>${o.right||''}${o.noClose?'':`<button class="ibtn" data-a="close" aria-label="Close">${ico('x')}</button>`}</div><div class="tabs" hidden></div><div class="sh-body"></div><div class="sh-foot" hidden></div></div>`;
 $('#sheetRoot').appendChild(v);o.el=v;v.addEventListener('pointerdown',e=>{if(e.target===v&&!o.noClose&&o.dismiss!==false)closeSheet()});renderSheet();return o}
function renderSheet(keepScroll){if(!SH)return;const o=SH,body=$('.sh-body',o.el),sc=body.scrollTop;const tb=$('.tabs',o.el);
 if(o.tabs){tb.hidden=false;tb.innerHTML=o.tabs.map(t=>`<button class="tab ${t.id===o.tab?'on':''}" data-a="tab:${t.id}">${t.label}</button>`).join('')}
 body.innerHTML=o.render(o.tab);if(!keepScroll){body.classList.remove('swap');void body.offsetWidth;body.classList.add('swap')}const ft=$('.sh-foot',o.el);const f=o.foot?o.foot(o.tab):'';ft.hidden=!f;ft.innerHTML=f||'';if(keepScroll)body.scrollTop=sc;if(o.after)o.after(o.tab,body)}
function closeSheet(silent){if(!SH)return;const o=SH;SH=null;if(o.el){if(silent)o.el.remove();else{const e=o.el;e.classList.add('out');setTimeout(()=>e.remove(),170)}}if(!silent&&o.onClose)o.onClose()}
const ACT={};
$('#sheetRoot').addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const[n,...r]=b.dataset.a.split(':');if(n==='close'){SFX.ui();closeSheet();return}if(n==='tab'){SH.tab=r[0];SFX.ui();renderSheet();return}if(ACT[n]){SFX.ui();ACT[n](r.join(':'),b,e)}});
function reSheet(){renderSheet(true)}
const coinHtml=n=>`<span style="display:inline-flex;align-items:center;gap:.25rem;vertical-align:middle"><span style="width:1.1rem;height:1.1rem;display:inline-block">${ICO.coin}</span>${fmt(n)}</span>`;
const tixHtml=n=>`<span style="display:inline-flex;align-items:center;gap:.25rem;vertical-align:middle"><span style="width:1.1rem;height:1.1rem;display:inline-block">${ICO.tix}</span>${fmt(n)}</span>`;
function spend(n){if(S.coins<n){SFX.no();toast('Not enough coins. Catch more in a run!');return false}S.coins-=n;save();refreshHome();SFX.buy();return true}

/* ============ home ============ */
function userTouchedStart(){firstTouch()}

/* ============ pets ============ */
let petView='aurum';
const petNeed=l=>50*l;
const petStage=(lvl,show=true)=>!show?1:lvl>=20?3:lvl>=5?2:1;
const petEggRemaining=id=>Math.max(0,(S.petEggs&&S.petEggs[id]?S.petEggs[id].hatchAt:0)-Date.now());
function completePetEgg(id){
 const egg=S.petEggs&&S.petEggs[id];if(!egg||egg.hatchAt>Date.now())return false;
 delete S.petEggs[id];S.pets[id]=S.pets[id]||{lvl:1,exp:0};S.pendingHatch=id;
 if(!S.petSel)S.petSel=id;
 S.stats.petsOwned=Object.keys(S.pets).length;save();
 return true
}
function schedulePetEgg(id){
 const egg=S.petEggs&&S.petEggs[id];if(!egg)return;
 setTimeout(()=>{if(completePetEgg(id)){const d=PETS.find(p=>p.id===id);toast((d?d.name:'Your pet')+' hatched! Open Pet Companions to meet your new friend.')}},petEggRemaining(id))
}
function schedulePetEggs(){Object.keys(S.petEggs||{}).forEach(schedulePetEgg)}
function petWardrobe(id){const f=(S.petFit&&S.petFit[id])||{},own=S.owned||{};return `<h4 style="margin:.9rem 0 .4rem">Pet Wardrobe</h4><div class="row" style="flex-wrap:wrap;gap:.4rem">${PET_FITS.map(x=>{const worn=f[x.slot]===x.id,has=own[x.id];return `<button class="btn sm ${worn?'':'ghost'}" data-a="ptfit:${id}:${x.id}">${x.name}${has?(worn?' ✓ Worn':' · Wear'):' · In Shop'}</button>`}).join('')}</div>`}
ACT.ptfit=a=>{const [pid,fid]=String(a).split(':'),x=PET_FITS.find(q=>q.id===fid);if(!x||!S.pets[pid])return;S.owned=S.owned||{};S.petFit=S.petFit||{};if(!S.owned[fid]){toast('Buy it first in Shop → Pet Outfits');return}const f=S.petFit[pid]=S.petFit[pid]||{};if(f[x.slot]===fid)delete f[x.slot];else f[x.slot]=fid;save();hmKey='';reSheet();toast(x.name+(f[x.slot]===fid?' on!':' removed'))};
const trainCost=l=>3000*l;
ACT.ptrain=id=>{const o=S.pets[id];if(!o||o.lvl>=40)return;if(!spend(trainCost(o.lvl)))return;o.lvl++;o.exp=0;S.stats.petsOwned=Object.keys(S.pets).length;save();hmKey='';reSheet();toast((PETS.find(p=>p.id===id)||{}).name+' reached Level '+o.lvl+'!')};
function petCard(d){const o=S.pets[d.id],egg=S.petEggs&&S.petEggs[d.id],stage=o?petStage(o.lvl,S.evoView[d.id]!==false):1;return `<button class="card ${petView===d.id?'on':''} ${o||egg?'':'lock'}" data-a="pview:${d.id}" style="text-align:left"><img class="thumb" alt="${d.name}" src="${petThumb(d,stage)}"><div class="row"><h4 class="grow">${d.name}</h4><span class="pill ${d.rar==='Legendary'?'violet':'gold'}">${d.rar}</span></div><p>${o?`Level ${o.lvl}${S.petSel===d.id?' · With you':''}`:egg?'Egg incubating':`${coinHtml(d.price)}`}</p></button>`}
function openPets(tab){if(S.pendingHatch&&S.pets[S.pendingHatch]){petView=S.pendingHatch;S.hatchIntro=S.pendingHatch;S.pendingHatch=null;save()}openSheet({title:'Pet Companions',tabs:[{id:'col',label:'Collection'}],tab:tab||'col',
 render(t){
  const d=PETS.find(p=>p.id===petView),o=S.pets[d.id],egg=S.petEggs&&S.petEggs[d.id],stage=o?petStage(o.lvl,S.evoView[d.id]!==false):1;
  const hdr=`<div class="card on" style="margin-bottom:.9rem"><div class="row" style="align-items:flex-start;flex-wrap:wrap"><img class="thumb" style="width:min(180px,100%);flex:none" src="${petThumb(d,stage)}" alt="${d.name}"><div class="grow" style="min-width:200px"><div class="row"><h3 class="disp" style="margin:0;font-size:1.5rem;color:#fff">${stage>=3?'Ascended '+d.evo:stage===2?d.evo:d.name}</h3><span class="pill ${d.rar==='Legendary'?'violet':'gold'}">${d.rar}</span></div><p class="muted">${d.title}. ${d.pers}</p>
  <p style="margin-top:.5rem"><b style="color:var(--gold)">${d.ab}.</b> <span class="muted">${d.abd}</span></p>
  <p class="muted" style="margin-top:.3rem">Stage 2 begins at Level 5; the final form unlocks at Level 20.</p>
  ${S.hatchIntro===d.id?`<div class="card on" style="margin-top:.5rem"><b>${d.name} has hatched!</b><p class="muted">Your new companion is ready to join you on runs.</p></div>`:''}
  ${o?`<div style="margin-top:.6rem"><div class="row"><span>Level ${o.lvl}${o.lvl>=40?' (max)':''}</span><div class="grow"><div class="bar v"><i style="width:${o.lvl>=40?100:o.exp/petNeed(o.lvl)*100}%"></i></div></div><span class="muted">${o.lvl>=40?'':o.exp+'/'+petNeed(o.lvl)}</span></div></div>`:''}
  <div class="row" style="margin-top:.8rem;flex-wrap:wrap;gap:.5rem">${o?`<button class="btn sm" data-a="psel:${d.id}" ${S.petSel===d.id?'disabled':''}>${S.petSel===d.id?'Selected':'Bring along'}</button>${o.lvl<40?`<button class="btn sm gold" data-a="ptrain:${d.id}">Train to Lv ${o.lvl+1} ${coinHtml(trainCost(o.lvl))}</button>`:''}${o.lvl>=5?`<button class="btn sm ghost" data-a="pevo:${d.id}">${stage>1?'Show normal look':'Show evolved look'}</button>`:''}`:egg?`<span class="pill gold">Egg incubating · ${Math.ceil(petEggRemaining(d.id)/1000)}s remaining</span>`:`<button class="btn sm" data-a="pbuy:${d.id}">Adopt for ${coinHtml(d.price)}</button><span class="muted">Earn coins in runs. No real money, ever.</span>`}</div>${o?petWardrobe(d.id):''}</div></div></div>`;
  return hdr+`<div class="grid s">${PETS.map(petCard).join('')}</div>`}})}
ACT.pview=id=>{petView=id;reSheet()};
ACT.psel=id=>{S.petSel=id;if(S.hatchIntro===id)S.hatchIntro=null;save();hmKey='';reSheet();toast(PETS.find(p=>p.id===id).name+' will join your runs.')};
ACT.pevo=id=>{S.evoView[id]=!(S.evoView[id]!==false);save();hmKey='';reSheet()};
ACT.pbuy=id=>{const d=PETS.find(p=>p.id===id);if(!d||S.pets[id]||(S.petEggs&&S.petEggs[id]))return;if(!spend(d.price))return;S.petEggs=S.petEggs||{};S.petEggs[id]={hatchAt:Date.now()+30000};save();hmKey='';refreshHome();reSheet();schedulePetEgg(id);toast(d.name+' egg is incubating. It will hatch in 30 seconds.');SFX.buy()};
canvas.addEventListener('pointerdown',e=>{if(mode!=='play')return;const p=SCN.play,r=canvas.getBoundingClientRect(),v=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1),rc=new THREE.Raycaster();rc.setFromCamera(v,p.cam);
 for(const o of p.pets){const hit=rc.intersectObject(o.pt.g,true);if(hit.length){o.hop=1;SFX.pet();const h=labelSprite('<3','#ff4fa3','#fff',1.2);h.position.copy(o.pt.g.position).add(new THREE.Vector3(0,2.2,0));p.sc.add(h);p.hearts.push({s:h,life:1.1});break}}});

/* ============ quests ============ */
function questRow(q){const done=q.prog>=q.goal;const tag=q.cat==='surprise'?'<span class="pill violet">Surprise</span>':q.cat==='pet'?'<span class="pill gold">Pet</span>':q.cat==='scam'?'<span class="pill bad">Scam Alert</span>':'';
 return `<div class="card" style="margin-bottom:.55rem"><div class="row"><div class="grow"><div class="row" style="gap:.4rem;flex-wrap:wrap"><b>${esc(q.text)}</b>${tag}</div><div class="bar" style="margin:.4rem 0 .2rem"><i style="width:${q.prog/q.goal*100}%"></i></div><span class="muted">${fmt(q.prog)} / ${fmt(q.goal)} · ${coinHtml(q.coins)}${q.tix?' + '+tixHtml(q.tix):''}</span></div>${q.claimed?'<span class="pill good">Claimed</span>':done?`<button class="btn sm" data-a="qclaim:${q.id}">Claim</button>`:'<span class="pill">In progress</span>'}</div></div>`}
function openQuests(tab){genQuests();openSheet({title:'Quests & Records',tabs:[{id:'d',label:'Daily'},{id:'w',label:'Weekly'},{id:'ach',label:'Achievements'},{id:'ev',label:'Events'},{id:'rec',label:'Records'}],tab:tab||'d',
 render(t){if(t==='d')return `<p class="muted" style="margin-bottom:.7rem">Fresh quests every day. Missing a day never erases progress.</p>`+S.quests.daily.map(questRow).join('');
  if(t==='w')return `<p class="muted" style="margin-bottom:.7rem">Weekly quests are bigger and pay more coins.</p>`+S.quests.weekly.map(questRow).join('');
  if(t==='ach')return achList();if(t==='rec')return recList();return eventList()}})}
ACT.qclaim=id=>{const q=S.quests.daily.concat(S.quests.weekly).find(x=>x.id===id);if(!q||q.claimed||q.prog<q.goal)return;q.claimed=true;S.coins+=q.coins;S.tickets+=q.tix||0;save();refreshHome();reSheet();SFX.buy();toast('+'+q.coins+' coins'+(q.tix?' and a Lucky Ticket':''))};
function achList(){return `<div class="grid">${ACH.map(a=>{const v=achStat(a.s),done=!!S.ach[a.id];return `<div class="card ${done?'on':''}"><div class="row"><h4 class="grow">${a.n}</h4>${done?'<span class="pill good">Done</span>':`<span class="pill">${coinHtml(a.r)}</span>`}</div><p>${a.d}</p><div class="bar"><i style="width:${Math.min(100,v/a.g*100)}%"></i></div><span class="muted">${fmt(Math.min(v,a.g))} / ${fmt(a.g)}</span></div>`}).join('')}</div>`}
function recList(){const s=S.stats;const R_=[['Best score',s.best],['Highest combo',s.bestCombo],['Highest round',s.bestRound],['Total catches',s.catches],['Total distance (m)',s.distance],['Runs played',s.runs],['Boss victories',s.bosses],['Scams spotted',s.scamOk],['Pets collected',Object.keys(S.pets).length+' / 6']];
 return `<p class="muted" style="margin-bottom:.7rem">Personal records only. There are no leaderboards. Just you versus you.</p><div class="grid s">${R_.map(([a,b])=>`<div class="stat"><b>${typeof b==='number'?fmt(b):b}</b><span>${a}</span></div>`).join('')}</div>`}
function eventList(){const E=[['Rap Battle: Hev vs Dags','Playable now','Catch the beats, outlast the speakers, settle the rivalry. Win once for bonus rewards.','ev:boss','Play Rap Battle',S.level>=3],['Halloween Special','Ended Oct 31','Spooky Manila returns next October. A visual prototype slot is reserved here.',null,'',false],['Christmas Special','Starts Dec 1 (prototype)','Parol lights and holiday collectibles. Not built yet.',null,'',false],['Summer Event','Next summer (prototype)','Beach coins and wave-rider journeys. Not built yet.',null,'',false]];
 return `<p class="muted" style="margin-bottom:.7rem">All events are free to join. No online play needed.</p>`+E.map(e=>`<div class="card" style="margin-bottom:.55rem"><div class="row"><div class="grow"><b>${e[0]}</b> <span class="pill ${e[5]?'good':''}">${e[1]}</span><p style="margin-top:.3rem">${e[2]}</p></div>${e[3]?`<button class="btn sm" data-a="${e[3]}" ${e[5]?'':'disabled'}>${e[5]?e[4]:'Reach Lv 3'}</button>`:''}</div></div>`).join('')}
ACT.ev=k=>{if(k==='boss'){if(S.trapped){toast('The road back is sealed. Beat '+bossOf(S.trapped).name+' first.');return}closeSheet(true);S.mode={kind:'boss',dist:'intramuros'};save();bossPrep('intramuros')}};

/* ============ upgrades ============ */
function treasureList(){const pk=POWERS.map(p=>`<div class="card"><div class="row"><span style="width:2.4rem;height:2.4rem;border-radius:50%;background:${p.col};display:grid;place-items:center;flex:none;color:#10162e;font-family:var(--display)">${p.name[0]}</span><div class="grow"><b>${p.name}</b> <span class="pill">Owned ${S.inv.power[p.id]||0}</span></div></div><div class="row" style="margin-top:.4rem;flex-wrap:wrap;gap:.4rem">${PACKS.map((k,i)=>`<button class="btn sm" data-a="ppack:${p.id}:${i}">x${k.n} ${coinHtml(Math.round(p.price*k.n*k.disc))}</button>`).join('')}</div></div>`).join('');
 return `<p class="muted" style="margin-bottom:.7rem">Permanent treasures. Expensive, but yours forever. No real money, ever.</p><div class="grid">${TREASURES.map(t=>{const o=hasT(t.id);return `<div class="card ${o?'on':''}"><div class="row"><span style="width:2.6rem;height:2.6rem;border-radius:50%;background:${t.col};display:grid;place-items:center;flex:none;color:#10162e;font-family:var(--display)">${t.name[0]}</span><h4 class="grow">${t.name}</h4></div><p>${t.desc}</p>${o?'<span class="pill good">Owned</span>':`<button class="btn sm" data-a="tbuy:${t.id}">Buy ${coinHtml(t.price)}</button>`}</div>`}).join('')}</div><h4 style="margin:1rem 0 .5rem">Power-up packs</h4><div class="grid">${pk}</div>`}
ACT.tbuy=id=>{const t=TREASURES.find(x=>x.id===id);if(!t||hasT(id))return;if(!spend(t.price))return;S.treasures=S.treasures||{};S.treasures[id]=1;save();reSheet();toast(t.name+' is yours!')};
ACT.ppack=a=>{const [id,i]=String(a).split(':'),p=POWERS.find(x=>x.id===id),k=PACKS[+i];if(!p||!k||!spend(Math.round(p.price*k.n*k.disc)))return;S.inv.power[id]=(S.inv.power[id]||0)+k.n;save();reSheet();toast('+'+k.n+' '+p.name)};
function powList(buy){return POWERS.map(p=>{const n=S.inv.power[p.id]||0;return `<div class="card" style="margin-bottom:.55rem"><div class="row"><span style="width:2.6rem;height:2.6rem;border-radius:50%;background:${p.col};display:grid;place-items:center;flex:none;color:#10162e;font-family:var(--display)">${p.name[0]}</span><div class="grow"><div class="row" style="gap:.4rem;flex-wrap:wrap"><b>${p.name}</b>${S.power===p.id?'<span class="pill gold">Equipped</span>':''}<span class="pill">Owned ${n}</span></div><p>${p.desc} ${p.dur?`Lasts ${p.dur}s.`:'Instant.'}</p></div></div>
 <div class="row" style="margin-top:.4rem;flex-wrap:wrap;gap:.5rem"><button class="btn sm ghost" data-a="pequip:${p.id}" ${S.power===p.id?'disabled':''}>Equip</button>${buy?`<button class="btn sm" data-a="pbuyp:${p.id}">Buy ${coinHtml(p.price)}</button>`:''}</div></div>`}).join('')}
ACT.pequip=id=>{S.power=id;save();reSheet();toast(POWERS.find(p=>p.id===id).name+' equipped')};
ACT.pbuyp=id=>{const p=POWERS.find(x=>x.id===id);if(!spend(p.price))return;S.inv.power[id]=(S.inv.power[id]||0)+1;save();reSheet()};
function upgGrid(){return `<p class="muted" style="margin-bottom:.7rem">Upgrades use earned coins only and stay small so skill still wins.</p><div class="grid">${UPS.map(u=>{const l=S.up[u.id]||0,max=l>=10;return `<div class="card"><div class="row"><h4 class="grow">${u.name}</h4><span class="pill ${l>=5?'gold':''}">Lv ${l}/10${l>=5?' Elite':''}</span></div><p>${u.desc}</p><div class="dots">${[0,1,2,3,4,5,6,7,8,9].map(i=>`<i class="${i<l?'f':''}"></i>`).join('')}</div><p>Now: <b style="color:#fff">${l?u.fx(effL(l)):'none'}</b>${max?'':`<br>Next: <b style="color:var(--gold)">${u.fx(effL(l+1))}</b>`}</p>${max?'<span class="pill good">Maxed</span>':`<button class="btn sm" data-a="upbuy:${u.id}">Upgrade ${coinHtml(upCost(u,l))}</button>`}</div>`}).join('')}</div>`}
function openUpgrades(tab){return openShop(tab==='p'?'pow':'upg')}
function openUpgradesOld(tab){openSheet({title:'Upgrade Center',tabs:[{id:'u',label:'Upgrades'},{id:'p',label:'Power-Ups'}],tab:tab||'u',
 render(t){if(t==='p')return `<p class="muted" style="margin-bottom:.7rem">One power-up is equipped per run. Tap the gold button in a run to use it. Orbs on the road recharge it.</p>`+powList(false);
  return upgGrid()}})}
ACT.upbuy=id=>{const u=UPS.find(x=>x.id===id),l=S.up[id]||0;if(l>=10||!spend(upCost(u,l)))return;S.up[id]=l+1;save();reSheet();toast(u.name+' is now Level '+(l+1))};

/* ============ maps ============ */
function openMaps(tab){openSheet({title:'World Map',tabs:[{id:'w',label:'Worlds'},{id:'m',label:'Manila'},{id:'s',label:'Secret Maps'}],tab:tab||'m',
 render(t){
  const SEAL=S.trapped?`<div class="card on" style="margin-bottom:.6rem"><b style="color:var(--gold)">The road back is sealed.</b><p>You are inside ${mapName(S.trapped)}. Beat <b style="color:#fff">${bossOf(S.trapped).name}</b> to return to the normal maps.</p></div>`:'';const WRAP=h=>S.trapped?SEAL+'<div style="opacity:.4;pointer-events:none">'+h+'</div>':h;
  if(t==='w')return WRAP(`<div class="grid">${WORLDS.map((w,i)=>`<div class="card ${mapOpen(w.id)?'on':'lock'}" style="background:linear-gradient(160deg,${w.col}55,rgba(255,255,255,.04))"><img src="${sceneURL(w.id,128,72)}" alt="" class="mapimg"><div class="row"><h4 class="grow">${i+1}. ${w.name}</h4>${mapOpen(w.id)?'<span class="pill good">Open</span>':ico('lock','width="18" height="18"')}</div><b style="color:${w.col}">${w.sub}</b><p>${w.desc}</p><p>Boss: <b style="color:#fff">${w.boss}</b></p><p>${mapOpen(w.id)?'Catching, Exploration and the boss battle are open.':`Unlock: ${w.need}.`}</p>${w.id==='manila'?'<button class="btn sm" data-a="tab:m">Enter Manila</button>':(mapOpen(w.id)?`<button class="btn sm" data-a="mplay:catch:${w.id}">Play Catching</button> <button class="btn sm alt" data-a="mplay:boss:${w.id}">Boss: ${(S.bossesWon||{})[w.id]?'defeated':bossOf(w.id).name}</button>`:'<button class="btn sm" disabled>Locked</button>')}</div>`).join('')}</div>`);
  if(t==='m'){return WRAP(`<h3>Districts</h3><div class="grid">${DIST.map(d=>{const ok=S.level>=d.lv||(d.id==='tondo'&&S.bossWon);return `<div class="card ${ok?'':'lock'}" style="background:linear-gradient(160deg,${d.sky[1]}66,rgba(255,255,255,.04))"><img src="${sceneURL(d.id,128,72)}" alt="" class="mapimg"><h4>${d.name}</h4><b style="color:${d.acc}">${d.sub}</b><p>Catching Mode. ${ok?'Endless run with rounds that get faster.':`Unlocks at Level ${d.lv}.`}</p><p class="muted">${((S.dclear||{})[d.id]||0)>=CLEAR_R?'Cleared':'Reach Round '+CLEAR_R+' to clear (best R'+((S.dclear||{})[d.id]||0)+')'}</p><button class="btn sm" data-a="mplay:catch:${d.id}" ${ok?'':'disabled'}>${ok?'Play':'Locked'}</button> ${ok?``:''}</div>`}).join('')}</div>
   <h3>Boss</h3><div class="grid">
   <div class="card ${S.level>=3?'':'lock'}"><h4>Uncle Dags</h4><b style="color:#ff9fd6">Boss Mode</b><p>The Rap Battle. Catch beats to build hype, dodge speakers and crates. Three phases.${S.bossWon?' You have won once.':''}</p><button class="btn sm" data-a="mplay:boss:intramuros" ${S.level>=3?'':'disabled'}>${S.level>=3?'Battle':'Reach Level 3'}</button></div></div>`)}
  const dc=S.dclear||{},mdone=manilaDone();
  return `<p class="muted" style="margin-bottom:.7rem">Four secret places inspired by Philippine folklore. Every world hides one: beat its boss and a secret map appears (Manila: Biringan City, Bohol: Whispering Balete, Palawan: Midnight Mansion, Siargao: Kapre’s Grove). Once you arrive, the only way back to the normal maps is to beat that map’s boss.</p>${SEAL}<div class="card ${mdone?'on':''}" style="margin-bottom:.6rem"><b>Biringan City needs:</b> Reach Round ${CLEAR_R} in all four Manila districts and beat Uncle Dags.<p class="muted">${DIST.map(d=>`${d.name}: ${(dc[d.id]||0)>=CLEAR_R?'done':'R'+(dc[d.id]||0)+'/'+CLEAR_R}`).join(' · ')} · Dags: ${S.bossWon?'done':'not yet'}</p></div><div class="grid">${SECRETS.map(s=>{const open=secOpen(s.id),seen=S.stats['sec_'+s.id],won=(S.bossesWon||{})[s.id],rw=BOSS_REWARD[s.id],rem=REMATCH_REWARD[s.id];return `<div class="card ${s.star?'on':''} ${open?'':'lock'}" style="background:linear-gradient(160deg,${s.col}44,rgba(255,255,255,.04));${s.star?'grid-column:1/-1':''}"><img src="${(open||seen)?sceneURL(s.id,128,72):''}" alt="" class="mapimg" ${(open||seen)?'':'hidden'}><div class="row"><h4 class="grow">${s.name}</h4>${s.star?'<span class="pill violet">Signature map</span>':''}${open?'':ico('lock','width="18" height="18"')}</div><b style="color:${s.col}">${s.sub}</b><p>${s.desc}</p><p>Boss: <b style="color:#fff">${s.boss}</b>${rw?` · First win: <b style="color:var(--gold)">${fmt(rw)} coins</b>${(S.claimed||{})[s.id]?' (claimed)':''}`:''}</p><p class="muted" style="margin:.3rem 0">Backstory: <b>${won?'Unlocked in the Story Gallery':'Beat the boss to hear it'}</b></p>${open?`<p><i>Clue:</i> ${s.clue}</p>`:`<p class="muted">${s.id==='biringan'?'Locked: finish all four Manila districts and beat Uncle Dags.':'Locked: beat the '+SECGATE_NAME[s.id]+' boss to make it appear.'}</p>`}${open?(S.trapped===s.id?`<button class="btn sm" data-a="mplay:catch:${s.id}">Catching</button> <button class="btn sm alt" data-a="mplay:boss:${s.id}">Boss: ${bossOf(s.id).name}</button>`:S.trapped?'<button class="btn sm" disabled>Sealed</button>':won?`<button class="btn sm alt" data-a="mplay:boss:${s.id}">Rematch · ${fmt(rem.fee)} coins</button>`:`<button class="btn sm" data-a="sride:${s.id}">Enter the portal</button>`):'<button class="btn sm" disabled>Locked</button>'}</div>`}).join('')}</div>`}})}
ACT.mplay=a=>{const[k,d]=a.split(':');if(S.trapped&&d!==S.trapped){toast('The road back is sealed. Beat '+bossOf(S.trapped).name+' first.');return}closeSheet(true);S.mode={kind:k,dist:d};save();if(k==='boss')bossPrep(d);else startRun(k,d)};
ACT.sride=id=>{const s=SECRETS.find(x=>x.id===id);openSheet({title:'Step into the portal?',narrow:true,render(){return `<p>A mysterious portal opens toward <b style="color:${s.col}">${s.name}</b>. It is a short cinematic, no gameplay.</p><p class="muted" style="margin:.6rem 0"><b style="color:var(--gold)">Warning:</b> once you arrive, the road back is sealed. The only way to return to Manila and the other maps is to beat <b style="color:#fff">${s.boss}</b>.</p><div class="row" style="gap:.5rem;flex-wrap:wrap"><button class="btn" data-a="sride2:${id}">Step through</button><button class="btn ghost" data-a="phome2">Not yet</button></div>`}})};
ACT.phome2=()=>{closeSheet(true);openMaps('s')};
ACT.sride2=id=>{closeSheet(true);startPortal(id)};
ACT.sdisc=id=>{const s=SECRETS.find(x=>x.id===id);S.stats['sec_'+id]=s.clue;S.stats.secrets=SECRETS.filter(x=>S.stats['sec_'+x.id]).length;S.coins+=300;save();refreshHome();reSheet();SFX.win();toast(s.name+' discovered! +300 coins')};

function clothesShop(){const base=Object.assign({},S.look&&S.look.hs?S.look:{}),G=[['Hats',PREM_HAT,'hat','head'],['Tops',PREM_TOP,'top','body'],['Neckwear',PREM_NECK,'neck','body'],['Extras',PREM_EXTRA,'extra','body'],['Shoes',PREM_SHOE,'shoe','shoe']];
 return `<p class="muted" style="margin-bottom:.7rem">Premium clothes you can't get in the free Closet. Buy once, wear anytime in Closet. Coins only, no real money.</p>`+G.map(([t,arr,key,kind])=>`<h4 style="margin:.8rem 0 .4rem">${t}</h4><div class="grid">${arr.map(([id,n,pr])=>{const own=S.owned&&S.owned[id];return `<div class="card ${own?'on':''}" style="text-align:center"><img alt="" class="thumb" src="${cropURL(Object.assign({},base,{[key]:id,hatc:'#ffc94a',nc:'#ffffff'}),kind,64)}" style="width:72px;height:72px"><b>${n}</b><br>${own?'<span class="pill good">Owned</span>':`<button class="btn sm" data-a="cbuy:${id}">Buy ${coinHtml(pr)}</button>`}</div>`}).join('')}</div>`).join('')+`<div style="margin-top:.8rem"><button class="btn sm alt" data-a="closet">Open Closet</button></div>`}
ACT.cbuy=id=>{const pm=premOf(id);if(!pm||(S.owned&&S.owned[id]))return;if(!spend(pm[2]))return;S.owned=S.owned||{};S.owned[id]=1;save();reSheet();toast(pm[1]+' is yours! Wear it in the Closet.')};
function petFitShop(){return `<p class="muted" style="margin-bottom:.7rem">Outfits for your pets. Buy here, then dress a pet in Pet Companions.</p><div class="grid">${PET_FITS.map(x=>{const own=S.owned&&S.owned[x.id];return `<div class="card ${own?'on':''}"><b>${x.name}</b> <span class="pill">${x.slot}</span><br>${own?'<span class="pill good">Owned</span>':`<button class="btn sm" data-a="pfbuy:${x.id}">Buy ${coinHtml(x.price)}</button>`}</div>`}).join('')}</div><div style="margin-top:.8rem"><button class="btn sm alt" data-a="topets">Open Pets</button></div>`}
ACT.pfbuy=id=>{const x=PET_FITS.find(q=>q.id===id);if(!x||(S.owned&&S.owned[id]))return;if(!spend(x.price))return;S.owned=S.owned||{};S.owned[id]=1;save();reSheet();toast(x.name+' is yours!')};

const CONS=[
 {id:'heartp',name:'Extra Heart',price:8000,desc:'Start your next run with +1 heart.',col:'#ff5d73'},
 {id:'dbl',name:'Coin Doubler',price:12000,desc:'Coins are worth double for your next run.',col:'#ffc94a'},
 {id:'shield',name:'Start Shield',price:6000,desc:'5 seconds of protection at the start of your next run.',col:'#8ff0ff'},
 {id:'magnet',name:'Coin Magnet',price:7000,desc:'Items fly to you for the first 12 seconds of your next run.',col:'#b58cff'},
 {id:'revive',name:'Second Chance',price:20000,desc:'If you run out of hearts, come back once with 2 hearts.',col:'#5be38a'}];
function boostList(){S.inv.cons=S.inv.cons||{};S.consOff=S.consOff||{};
 const hp=`<div class="card"><div class="row"><span class="pill gold">Pet Snack</span><div class="grow"><p>Gives your selected pet 120 EXP.</p></div></div><button class="btn sm" data-a="bsnack">Buy ${coinHtml(4000)}</button></div>
 <div class="card"><div class="row"><span class="pill gold">Pet Feast x5</span><div class="grow"><p>Five snacks at once: 600 EXP for your selected pet.</p></div></div><button class="btn sm" data-a="bfeast">Buy ${coinHtml(16000)}</button></div>`;
 return `<p class="muted" style="margin-bottom:.7rem">Helpers that make runs easier. Each one is used automatically at the start of your next run (you can switch auto-use off).</p><div class="grid">${CONS.map(c=>{const n=S.inv.cons[c.id]||0,off=S.consOff[c.id];return `<div class="card"><div class="row"><span style="width:2.4rem;height:2.4rem;border-radius:50%;background:${c.col};display:grid;place-items:center;flex:none;color:#10162e;font-family:var(--display)">${c.name[0]}</span><h4 class="grow">${c.name}</h4><span class="pill">x${n}</span></div><p>${c.desc}</p><div class="row" style="gap:.4rem;flex-wrap:wrap"><button class="btn sm" data-a="cbuyc:${c.id}">Buy ${coinHtml(c.price)}</button><button class="btn sm ghost" data-a="ctog:${c.id}">Auto-use: ${off?'OFF':'ON'}</button></div></div>`}).join('')}${hp}</div>`}
ACT.cbuyc=id=>{const c=CONS.find(x=>x.id===id);if(!c||!spend(c.price))return;S.inv.cons=S.inv.cons||{};S.inv.cons[id]=(S.inv.cons[id]||0)+1;save();reSheet();toast('+1 '+c.name)};
ACT.ctog=id=>{S.consOff=S.consOff||{};S.consOff[id]=S.consOff[id]?0:1;save();reSheet()};
ACT.bticket=()=>{if(!spend(15000))return;S.tickets++;save();reSheet();toast('+1 Lucky Ticket')};
ACT.bfeast=()=>{if(!S.petSel||!S.pets[S.petSel]){toast('Adopt and select a pet first');return}if(!spend(16000))return;for(let i=0;i<5;i++)addPetExp(S.petSel,120);save();hmKey='';reSheet();toast('Pet Feast! +600 EXP')};
ACT.bsnack=()=>{if(!S.petSel||!S.pets[S.petSel]){toast('Adopt and select a pet first');return}if(!spend(4000))return;const u=addPetExp(S.petSel,120);save();hmKey='';reSheet();toast('Pet Snack! '+(u?'Level up!':'+120 EXP'))};
function takeCons(){const o={heart:0,dbl:0,shield:0,magnet:0,revive:0};S.inv.cons=S.inv.cons||{};S.consOff=S.consOff||{};const m={heartp:'heart',dbl:'dbl',shield:'shield',magnet:'magnet',revive:'revive'};const used=[];CONS.forEach(c=>{if((S.inv.cons[c.id]||0)>0&&!S.consOff[c.id]){S.inv.cons[c.id]--;o[m[c.id]]=1;used.push(c.name)}});if(used.length){save();setTimeout(()=>toast('Boost used: '+used.join(', ')),900)}return o}
function petShopList(){return `<p class="muted" style="margin-bottom:.7rem">Adopt pets with coins. Eggs hatch after 30 seconds; train them and dress them up too.</p><div class="grid">${PETS.map(d=>{const o=S.pets[d.id],egg=S.petEggs&&S.petEggs[d.id];return `<div class="card ${o?'on':''}" style="text-align:center"><img alt="${d.name}" class="thumb" src="${petThumb(d,o?petStage(o.lvl,S.evoView[d.id]!==false):1)}" style="width:72px;height:72px"><br><b>${d.name}</b> <span class="pill">${d.rar}</span><p>${d.ab}</p>${o?'<span class="pill good">Owned · Lv '+o.lvl+'</span>':egg?'<span class="pill gold">Egg incubating</span>':`<button class="btn sm" data-a="pbuy:${d.id}">Adopt ${coinHtml(d.price)}</button>`}</div>`}).join('')}</div>`}

/* ============ run results, pause, daily, shop, wheel, inventory, jukebox ============ */
let lastRun={kind:'catch',dist:'intramuros'},flow=null;
const BY=['Uncle Dags','Hev Abi','Hev Abi','Gat Putch ft. Uncle Dags'];
const wpick=a=>{let t=a.reduce((s,x)=>s+x.w,0)*Math.random();for(let i=0;i<a.length;i++){t-=a[i].w;if(t<=0)return i}return 0};
function addPetExp(id,n){const p=S.pets[id];if(!p)return 0;let up=0;p.exp+=n;while(p.lvl<40&&p.exp>=petNeed(p.lvl)){p.exp-=petNeed(p.lvl);p.lvl++;up++}if(p.lvl>=40)p.exp=0;return up}
function giveChest(){const c=rint(180,420);const pw=Math.random()<.55?pick(POWERS):null;S.coins+=c;if(pw)S.inv.power[pw.id]=(S.inv.power[pw.id]||0)+1;return `+${c} coins${pw?' and a '+pw.name+' power-up':''}`}

function playKapreCutscene(after){
 const resumeMusic=!aud.paused;aud.pause();stopAll();setMode('story');showScreen('none');
 const ov=mk('div','scr');ov.id='kapreCutscene';ov.style.cssText='position:absolute;inset:0;z-index:80;background:#000;display:grid;place-items:center';
 const video=document.createElement('video');video.src='assets/secret-worlds/kapre_cutscene.mp4';video.preload='auto';video.autoplay=true;video.playsInline=true;video.style.cssText='width:100%;height:100%;object-fit:contain;background:#000';ov.appendChild(video);$('#ui').appendChild(ov);
 let done=false,failed=false;
 const finish=()=>{if(done)return;done=true;video.pause();ov.remove();if(resumeMusic)aud.play().catch(error=>console.warn('Unable to resume the jukebox after the Kapre cutscene.',error));if(after)after()};
 const showError=error=>{if(done||failed)return;failed=true;console.error('Unable to play the Kapre cutscene.',error);video.pause();const message=mk('div');message.style.cssText='max-width:36rem;padding:2rem;text-align:center;color:#fff';message.innerHTML='<h2>Video playback unavailable</h2><p>The Kapre cutscene could not be played. Continue to the story.</p>';const button=mk('button','btn','Continue story');button.addEventListener('click',finish);message.appendChild(button);ov.replaceChildren(message)};
 video.addEventListener('ended',finish,{once:true});video.addEventListener('error',()=>showError(video.error||new Error('Unknown video playback error')),{once:true});
 video.play().catch(showError);
}
function finishRun(why){
 const g=G;if(!g||g.fin)return;g.fin=true;g.pause=true;lastRun={kind:g.kind,dist:g.dist};if(g.arena&&g.round>=3)S.stats['clear_'+g.dist]=1;
 const win=why==='win'||why==='arrive',bonus=why==='win'?400:why==='arrive'?150:0,rematchReward=why==='win'&&g.rematch?g.rematch.reward:0,coins=g.coins+bonus+rematchReward,tix=g.tix+(why==='win'?2:0);
 const prevBest=S.stats.best,score=Math.floor(g.score);
 S.coins+=coins;S.tickets+=tix;S.stats.runs++;S.stats.best=Math.max(prevBest,score);S.stats.bestCombo=Math.max(S.stats.bestCombo,g.best);S.stats.distance+=Math.floor(g.distM);S.stats.jumps+=g.jumps;S.stats.slides+=g.slides;
 if(g.kind==='catch'){S.stats.bestRound=Math.max(S.stats.bestRound,g.round);S.dclear=S.dclear||{};S.dclear[g.dist]=Math.max(S.dclear[g.dist]||0,g.round)}
 if(why==='arrive')S.stats.journeys++;let firstWin=false,bossBonus=null,rematchBonus=null,freed=null;if(why==='lose'){const _g=G;setTimeout(()=>showLifeLesson(_g),1800)}if(why==='win'){S.stats.bosses++;S.bossesWon=S.bossesWon||{};const bid=g.dist,bcf=bossOf(bid);firstWin=!S.bossesWon[bid];S.bossesWon[bid]=1;S.stats.worlds=1+['bohol','palawan','siargao'].filter(k=>S.bossesWon[k]).length;if(g.rematch){S.rematchWins[bid]=(S.rematchWins[bid]||0)+1;S.stats.rematchWins=(S.stats.rematchWins||0)+1;rematchBonus={name:bcf.name,reward:rematchReward,wins:S.rematchWins[bid]}}if(['biringan','balete','mansion','kapre'].includes(bid))if(S.trapped&&bid===S.trapped){freed=S.trapped;S.lorePending=freed;S.teamPending=freed;S.trapped=null;S.mode={kind:'catch',dist:'intramuros'}}if(bid==='intramuros'){firstWin=!S.bossWon;if(firstWin&&!S.lifeMsgSeen)S.pendingReconcile=true;S.bossWon=true;ensureDagsWear()}else if(firstWin){if(({bohol:'balete',palawan:'mansion',siargao:'kapre'})[bid])S.revealPending=({bohol:'balete',palawan:'mansion',siargao:'kapre'})[bid];const pr=payBoss(bid);S.tickets+=3;bossBonus={name:bcf.name,reward:pr.paid,extra:pr.extra}}}
 if(why==='win'&&g.dist==='kapre'&&firstWin)S.kapreCutscenePending=true;
 if(manilaDone()&&!S.seenBiringan)S.portalPending=true;
 const exp=Math.round(score/30+g.catches*.5)+(win?60:0),lvUp=addExp(exp);
 let petTxt='';const ps=petStats();if(ps){const gain=15+g.petUses*10+(win?30:0),up=addPetExp(ps.d.id,gain);petTxt=`${ps.d.name} +${gain} EXP${up?` · Level ${S.pets[ps.d.id].lvl}!`:''}`}
 track('run',1);track('dist',Math.floor(g.distM));const ach=checkAch();save();refreshHome();
 const first=flow==='first';const rec=score>prevBest&&prevBest>0;
 const title=first?'First Rewards!':why==='win'?(g.dist==='intramuros'?'Rap Battle Won!':'Boss Defeated!'):why==='arrive'?'Arrived in Intramuros!':g.kind==='boss'?'Battle Over':'Run Over';
 const line=why==='win'?'<p class="muted" style="margin:.4rem 0"><b style="color:'+bossOf(g.dist).col+'">'+bossOf(g.dist).name+':</b> '+bossOf(g.dist).win+'<br><b style="color:#8a6aff">Hev:</b> '+(g.dist==='intramuros'?'Respect, Dags.':'That was a tough one!')+'</p>'+(freed?'<p style="margin:.4rem 0;color:var(--gold)"><b>The road back is open!</b> You can return to Manila and the other maps now.</p>':''):why==='arrive'?'<p class="muted" style="margin:.4rem 0">Para po! The jeepney pulls up at the gates of Intramuros.</p>':first?'<p class="muted" style="margin:.4rem 0"><b style="color:#8a6aff">Hev:</b> You are a natural! Everything you caught is yours to keep.</p>':'';
 openSheet({title,narrow:true,noClose:true,render(){return `<div style="text-align:center"><div class="disp" style="font-size:2.6rem;color:var(--gold);line-height:1">${fmt(score)}</div><div class="muted">SCORE${rec?' · NEW PERSONAL BEST!':prevBest?` · Best ${fmt(S.stats.best)}`:''}</div>${line}</div>
  <div class="grid s" style="margin:.8rem 0"><div class="stat"><b>${fmt(coins)}</b><span>Coins</span></div><div class="stat"><b>${g.catches}</b><span>Catches</span></div><div class="stat"><b>x${g.best}</b><span>Best combo</span></div><div class="stat"><b>${g.arena?(g.kind==='boss'?Math.round(g.bossP)+'%':'R'+g.round):Math.floor(g.distM)+'m'}</b><span>${g.arena?(g.kind==='boss'?bossOf(g.dist).title+' broken':'Round'):'Distance'}</span></div><div class="stat"><b>+${exp}</b><span>EXP</span></div>${tix?`<div class="stat"><b>+${tix}</b><span>Tickets</span></div>`:''}</div>
  ${firstWin&&bossBonus?`<div class="card on" style="margin-bottom:.5rem"><b>${bossBonus.name} defeated!</b><p class="muted">+${fmt(bossBonus.reward)} coins and 3 tickets.${bossBonus.extra?' Secret Maps complete! Bonus +'+fmt(bossBonus.extra)+' coins.':''} ${({bohol:'Palawan unlocked. A secret map appeared!',palawan:'Siargao unlocked. A secret map appeared!',siargao:'A secret map appeared!'})[g.dist]||''}</p></div>`:''}${rematchBonus?`<div class="card on" style="margin-bottom:.5rem"><b>${rematchBonus.name} rematch won!</b><p class="muted">+${fmt(rematchBonus.reward)} coins · Rematches won: ${rematchBonus.wins}</p></div>`:''}${firstWin&&!bossBonus?'<div class="card on" style="margin-bottom:.5rem"><b>Beat Breaker Trophy unlocked!</b><p class="muted">Free Dags streetwear preset added to the customizer. Tondo district unlocked.</p></div>':''}${lvUp?`<div class="card on" style="margin-bottom:.5rem"><b>Level up! You are Level ${S.level}.</b></div>`:''}${petTxt?`<p class="muted" style="margin-bottom:.4rem">${esc(petTxt)}</p>`:''}${ach.map(a=>`<div class="card on" style="margin-bottom:.4rem"><b>Achievement: ${a.n}</b> <span class="muted">+${a.r} coins</span></div>`).join('')}
  <div class="row" style="gap:.5rem;margin-top:.8rem;flex-wrap:wrap;justify-content:center">${first?'<button class="btn" data-a="rhome">Continue</button>':`<button class="btn" data-a="again">${why==='win'||why==='arrive'?'Play again':'Run it back'}</button><button class="btn ghost" data-a="rhome">${S.kapreCutscenePending?'Continue':'Home'}</button>`}</div>`}})}
ACT.again=()=>{closeSheet(true);startRun(lastRun.kind,lastRun.dist)};
ACT.rhome=()=>{closeSheet(true);flow=null;if(S.kapreCutscenePending){playKapreCutscene(()=>{S.kapreCutscenePending=false;save();goHome()});return}goHome()};

function miniPlayer(){const t=curTrack(),on=!aud.paused;return `<div class="card" style="margin-bottom:.8rem"><div class="row"><div class="disc ${on?'spin2':''}"></div><div class="grow"><b>${t.title}</b><p>${BY[t.id]}</p></div><button class="ibtn" data-a="mprev" aria-label="Previous">${ico('prev')}</button><button class="ibtn" data-a="mtoggle" aria-label="Play or pause">${on?ICO.pause:ICO.play}</button><button class="ibtn" data-a="mnext" aria-label="Next">${ico('next')}</button></div></div>`}
function openPause(){openSheet({title:'Paused',narrow:true,live:1,onClose:()=>{if(G)G.pause=false},render(){return miniPlayer()+`<div class="row" style="gap:.5rem;flex-wrap:wrap"><button class="btn" data-a="resume">Resume</button><button class="btn alt" data-a="restart">Restart</button><button class="btn ghost" data-a="pset">Settings</button><button class="btn ghost" data-a="phome">Home</button></div><p class="muted" style="margin-top:.7rem">Your music choice stays the same in every map, journey and boss battle. Change it any time.</p>`}})}
ACT.resume=()=>resumeRun();ACT.restart=()=>{const g=G;closeSheet(true);startRun(g.kind,g.dist)};ACT.phome=()=>{closeSheet(true);goHome()};ACT.pset=()=>openSettings('run');
ACT.mprev=()=>nextTrack(-1);ACT.mnext=()=>nextTrack(1);ACT.mtoggle=()=>toggleMusic();
uiMusicChanged=()=>{if(SH&&SH.live)reSheet()};
aud.addEventListener('timeupdate',()=>{const p=$('#jprog');if(p&&aud.duration)p.style.width=(aud.currentTime/aud.duration*100)+'%'});

/* ---- daily ---- */
const DAILY=[150,200,250,300,350,450,700];
function openDaily(){openSheet({title:'Daily Rewards',narrow:true,render(){const c=S.login.count,claimed=S.login.last===today(),p=c%7,lastIdx=(c-1+7)%7,doneUpTo=claimed?lastIdx:p-1;
 return `<p class="muted" style="margin-bottom:.7rem">Come back whenever you like. Missing a day never erases your progress, and you just continue where you left off.</p><div class="grid s">${DAILY.map((v,i)=>{const done=claimed?(c>0&&i<=lastIdx):i<p,cur=!claimed&&i===p;return `<div class="card ${cur?'on':''} ${done?'lock':''}" style="text-align:center"><h4>Day ${i+1}</h4><div style="margin:.3rem 0">${coinHtml(v)}</div>${i===6?'<span class="pill violet">+ Bonus chest</span>':''}${done?'<div class="muted" style="margin-top:.3rem">Claimed</div>':''}</div>`}).join('')}</div>
  <div style="margin-top:.9rem;text-align:center">${claimed?'<span class="pill good">Today is claimed. See you next time!</span>':'<button class="btn" data-a="dclaim">Claim Day '+(p+1)+'</button>'}</div>`}})}
ACT.dclaim=()=>{if(S.login.last===today())return;const p=S.login.count%7;S.coins+=DAILY[p];let t='+'+DAILY[p]+' coins';if(p===6)t+=' and a bonus chest: '+giveChest();S.login.count++;S.login.last=today();save();refreshHome();reSheet();SFX.win();toast(t)};

/* ---- shop, wheel, inventory ---- */
const WG=[{l:'100',col:'#ffd964',w:26,f:()=>{S.coins+=100;return '+100 coins'}},{l:'250',col:'#ff9fd6',w:15,f:()=>{S.coins+=250;return '+250 coins'}},
 {l:'Pet XP',col:'#9ff0d0',w:14,f:()=>{if(S.petSel&&S.pets[S.petSel]){addPetExp(S.petSel,40);return '+40 pet EXP'}S.coins+=60;return '+60 coins'}},
 {l:'Boost',col:'#b58cff',w:12,f:()=>{const p=pick(POWERS.filter(x=>x.dur>0));S.inv.power[p.id]=(S.inv.power[p.id]||0)+1;return p.name+' power-up'}},
 {l:'Chest',col:'#7fd6ff',w:9,f:()=>giveChest()},{l:'500',col:'#ffc94a',w:4,f:()=>{S.coins+=500;return '+500 coins!'}},{l:'Ticket',col:'#ff7a8a',w:6,f:()=>{S.tickets++;return 'a Lucky Ticket'}},{l:'150',col:'#ffe9a8',w:14,f:()=>{S.coins+=150;return '+150 coins'}}];
const WL=[{l:'400',col:'#c99aff',w:24,f:()=>{S.coins+=400;return '+400 coins'}},{l:'Pet XP',col:'#9ff0d0',w:16,f:()=>{if(S.petSel){addPetExp(S.petSel,120);return '+120 pet EXP'}S.coins+=200;return '+200 coins'}},{l:'1000',col:'#ffc94a',w:6,f:()=>{S.coins+=1000;return '+1,000 coins!'}},
 {l:'Chests',col:'#7fd6ff',w:14,f:()=>giveChest()+' and '+giveChest()},{l:'500',col:'#5ef0d0',w:10,f:()=>{S.coins+=500;return '500 coins'}},{l:'2 Tix',col:'#ff7a8a',w:8,f:()=>{S.tickets+=2;return '2 Lucky Tickets'}},{l:'Power',col:'#b58cff',w:14,f:()=>{const p=pick(POWERS.filter(x=>x.dur>0));S.inv.power[p.id]=(S.inv.power[p.id]||0)+2;return '2x '+p.name}},{l:'700',col:'#ff9fd6',w:8,f:()=>{S.coins+=700;return '+700 coins'}}];
function drawWheel(cv,segs){const g=cv.getContext('2d'),W=cv.width,c=W/2,n=segs.length,a=Math.PI*2/n;for(let i=0;i<n;i++){g.beginPath();g.moveTo(c,c);g.arc(c,c,c-8,-Math.PI/2+i*a,-Math.PI/2+(i+1)*a);g.closePath();g.fillStyle=segs[i].col;g.fill();g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=4;g.stroke();g.save();g.translate(c,c);g.rotate(-Math.PI/2+(i+.5)*a);g.fillStyle='#1b1040';g.font='800 '+Math.round(W*.058)+'px Nunito,Arial,sans-serif';g.textAlign='right';g.textBaseline='middle';g.fillText(segs[i].l,c-26,0);g.restore()}
 g.beginPath();g.arc(c,c,W*.09,0,7);g.fillStyle='#ffc94a';g.fill();g.lineWidth=5;g.strokeStyle='#fff';g.stroke();g.fillStyle='#7a4a00';g.font='800 '+Math.round(W*.05)+'px Nunito,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('SPIN',c,c)}
let spinning=false;
function wheelBlock(id,title,segs,locked,msg,btn){return `<div class="card ${locked?'lock':'on'}" style="margin-bottom:.9rem"><h3 style="margin:0 0 .5rem">${title}</h3><div class="wheelwrap"><div class="wheelbox"><div class="ptr"></div><canvas id="${id}" width="600" height="600"></div>${btn}<p class="muted" style="text-align:center">${msg}</p></div></div>`}
function openShop(tab){openSheet({title:'Shop',tabs:[{id:'upg',label:'Upgrades'},{id:'pow',label:'Power-Ups'},{id:'boost',label:'Boosts'},{id:'pets',label:'Pets'},{id:'clo',label:'Clothes'},{id:'pfit',label:'Pet Outfits'},{id:'tre',label:'Treasures'},{id:'inv',label:'Inventory'}],tab:(!tab||tab==='shop'||tab==='wheel')?'upg':tab,
 render(t){
  if(t==='upg')return upgGrid();if(t==='pow')return `<p class="muted" style="margin-bottom:.7rem">One power-up is equipped per run. Buy extras here.</p>`+powList(true);if(t==='boost')return boostList();if(t==='pets')return petShopList();
  if(t==='clo')return clothesShop();if(t==='pfit')return petFitShop();if(t==='tre')return treasureList();
  if(t==='wheel'){const free=S.spin.last!==today(),lg=S.stats.worlds>=2;
   return wheelBlock('wG','Golden Wheel',WG,false,free?'One free spin every day. Come back tomorrow for more.':'Free spin used today. See you tomorrow!',`<button class="btn" data-a="spin" ${free&&!spinning?'':'disabled'}>${free?'Free Spin':'Come back tomorrow'}</button>`)+
   wheelBlock('wL','Legendary Wheel',WL,!lg,lg?`Costs 1 Lucky Ticket. You hold ${S.tickets}.`:`Unlocks after World 2 (Bohol). Tickets come from quests, bosses, achievements and events. You hold ${S.tickets}. No paid spins, ever.`,`<button class="btn alt" data-a="lspin" ${lg&&S.tickets>0&&!spinning?'':'disabled'}>${lg?'Spin for 1 Ticket':'Locked'}</button>`)}
  if(t==='inv'){const pw=POWERS.filter(p=>(S.inv.power[p.id]||0)>0);
   return `<div class="grid s"><div class="stat"><b>${fmt(S.coins)}</b><span>Coins</span></div><div class="stat"><b>${S.inv.fragments}</b><span>Map fragments</span></div><div class="stat"><b>${Object.keys(S.pets).length}/6</b><span>Pets</span></div></div>
   <h3>Power-ups</h3>${pw.length?pw.map(p=>`<div class="card" style="margin-bottom:.4rem"><div class="row"><b class="grow">${p.name}</b><span class="pill">x${S.inv.power[p.id]}</span>${S.power===p.id?'<span class="pill gold">Equipped</span>':`<button class="btn sm ghost" data-a="pequip:${p.id}">Equip</button>`}</div></div>`).join(''):'<p class="muted">None yet. Buy some in the Shop tab or find orbs on the road.</p>'}
   <h3>Collection</h3><p class="muted">Pets: ${PETS.filter(p=>S.pets[p.id]).map(p=>p.name).join(', ')||'none yet'}.<br>Special treasures and event items: none right now.<br>Premium outfits owned: ${Object.keys(S.owned||{}).length}.</p><div style="margin-top:.7rem"><button class="btn sm alt" data-a="closet">Open Closet</button></div>`}
  return `<div class="card on" style="margin-bottom:.8rem"><div class="row"><div class="grow"><b>Everyday looks are free. Premium outfits live here.</b><p>Basic hair, outfits and accessories are free in your Closet. Fancy clothes, pet outfits and treasures are in the Clothes, Pet Outfits and Treasures tabs.</p></div><button class="btn sm alt" data-a="closet">Closet</button></div></div>
   <p class="muted" style="margin-bottom:.7rem">Everything here costs coins you earned in runs. No real money, ever.</p><h3>Power-ups</h3>${powList(true)}
   <h3>Pets</h3><div class="card"><div class="row"><div class="grow"><b>Pet Companions</b><p>Adopt pets with coins. Prices range from 2,500 to 7,000.</p></div><button class="btn sm" data-a="topets">Open</button></div></div>`},
 after(t,body){}})}
ACT.closet=()=>{closeSheet(true);openCust(false)};ACT.topets=()=>openPets();
function doSpin(id,segs,after){if(spinning)return;spinning=true;const i=wpick(segs),seg=360/segs.length,cv=$('#'+id);const r=360*5-(i*seg+seg/2);const msg=segs[i].f();save();refreshHome();
 if(cv){cv.style.transition='transform 3.8s cubic-bezier(.12,.7,.15,1)';cv.style.transform=`rotate(${r}deg)`}SFX.round();
 setTimeout(()=>{spinning=false;SFX.win();toast('You won '+msg+'!');if(SH)reSheet()},cv?3900:0)}
ACT.spin=()=>{if(S.spin.last===today()||spinning)return;S.spin.last=today();doSpin('wG',WG)};
ACT.lspin=()=>{if(S.stats.worlds<2||S.tickets<1||spinning)return;S.tickets--;doSpin('wL',WL)};

/* ---- jukebox ---- */
function trackRow(i,ctx){const t=TRACKS[i],on=S.mu.track===i&&!aud.paused,fav=S.mu.fav.includes(i),inL=S.mu.list.includes(i);
 return `<div class="track ${S.mu.track===i?'on':''}" style="margin-bottom:.45rem"><div class="disc ${on?'spin2':''}"></div><div class="grow" style="min-width:0"><b>${t.title}</b><p>${BY[i]} · ${t.tag}</p></div><button class="ibtn" data-a="tplay:${i}" aria-label="Play ${t.title}">${on?ICO.pause:ICO.play}</button><button class="ibtn" data-a="tfav:${i}" aria-label="Favorite" style="color:${fav?'#ffc94a':'#fff'}">${ico('star')}</button>${ctx==='lib'?`<button class="ibtn" data-a="tlist:${i}" aria-label="Playlist">${inL?ico('check'):'+'}</button>`:''}</div>`}
function openJuke(tab){openSheet({title:'Spotibai',live:1,tabs:[{id:'lib',label:'My Library'},{id:'list',label:'My Playlist'},{id:'fav',label:'Favorites'},{id:'rec',label:'Recently Played'}],tab:tab||'lib',
 render(t){const t0=curTrack(),on=!aud.paused,pr=aud.duration?aud.currentTime/aud.duration*100:0;
  const np=`<div class="card on" style="margin-bottom:.9rem"><div class="muted" style="margin-bottom:.4rem">NOW PLAYING</div><div class="row"><div class="disc ${on?'spin2':''}"></div><div class="grow"><b style="font-size:1.1rem">${t0.title}</b><p>${BY[t0.id]} · ${t0.tag}</p></div>${on?'<div class="eq"><i></i><i></i><i></i></div>':''}</div><div class="bar" data-a="seek" style="margin:.7rem 0;cursor:pointer;height:.8rem"><i id="jprog" style="width:${pr}%"></i></div>
   <div class="row" style="justify-content:center;gap:.6rem"><button class="ibtn" data-a="mshuf" aria-label="Shuffle" style="color:${S.mu.shuffle?'#ffc94a':'#fff'}">${ico('shuffle')}</button><button class="ibtn" data-a="mprev" aria-label="Previous">${ico('prev')}</button><button class="ibtn" data-a="mtoggle" aria-label="Play or pause" style="width:3.4rem;height:3.4rem">${on?ICO.pause:ICO.play}</button><button class="ibtn" data-a="mnext" aria-label="Next">${ico('next')}</button><button class="ibtn" data-a="mrep" aria-label="Repeat" style="color:${S.mu.repeat==='off'?'#fff':'#ffc94a'}">${ico('repeat')}<small style="position:absolute;font-size:.6rem;bottom:2px;right:5px">${S.mu.repeat==='one'?'1':''}</small></button></div></div>`;
  let body='';
  if(t==='lib')body=`<p class="muted" style="margin-bottom:.6rem">Pick any song for any map, journey or boss battle. The soundtrack is never forced on you.</p>`+TRACKS.map((x,i)=>trackRow(i,'lib')).join('')+`<p class="muted" style="margin-top:.5rem">Genres: street beats, hip-hop, chill, upbeat, electronic, adventure and boss instrumentals. Only tracks you provided are playable here.</p>`;
  else if(t==='list')body=S.mu.list.length?S.mu.list.map(i=>trackRow(i,'list')).join(''):'<p class="muted">Your playlist is empty. Tap + in My Library.</p>';
  else if(t==='fav')body=S.mu.fav.length?S.mu.fav.map(i=>trackRow(i,'fav')).join(''):'<p class="muted">Tap the star on a song to add it here.</p>';
  else body=S.mu.recent.length?S.mu.recent.map(i=>trackRow(i,'rec')).join(''):'<p class="muted">Nothing played yet.</p>';
  return np+body+`<h3>Volume</h3><label class="fld">Music volume<input type="range" min="0" max="1" step=".05" value="${S.st.music}" data-st="music" aria-label="Music volume"></label><label class="fld" style="margin-top:.5rem">Sound effects volume<input type="range" min="0" max="1" step=".05" value="${S.st.sfx}" data-st="sfx" aria-label="Sound effects volume"></label>
   <div class="row" style="margin-top:.7rem"><span class="grow">Auto play when the game starts</span><button class="toggle ${S.mu.auto?'on':''}" data-a="muauto" role="switch" aria-checked="${S.mu.auto}" aria-label="Auto play"><i></i></button></div>`}})}
ACT.tplay=i=>{i=+i;if(S.mu.track===i&&!aud.paused)toggleMusic();else playTrack(i)};
ACT.tfav=i=>{i=+i;const k=S.mu.fav.indexOf(i);if(k>=0)S.mu.fav.splice(k,1);else S.mu.fav.push(i);save();reSheet()};
ACT.tlist=i=>{i=+i;const k=S.mu.list.indexOf(i);if(k>=0)S.mu.list.splice(k,1);else S.mu.list.push(i);save();reSheet()};
ACT.mshuf=()=>{S.mu.shuffle=!S.mu.shuffle;save();reSheet()};ACT.mrep=()=>{S.mu.repeat={all:'one',one:'off',off:'all'}[S.mu.repeat]||'all';save();reSheet()};ACT.muauto=()=>{S.mu.auto=!S.mu.auto;save();reSheet()};
ACT.seek=(a,b,e)=>{const r=b.getBoundingClientRect();if(aud.duration)aud.currentTime=clamp((e.clientX-r.left)/r.width,0,1)*aud.duration};
$('#sheetRoot').addEventListener('input',e=>{const t=e.target;if(t.dataset&&t.dataset.st){S.st[t.dataset.st]=+t.value;applyVol();save()}});

/* ============ profile, settings, help, scam alert, cinematic, closet, first-time flow ============ */
(function(){const st=document.createElement('style');st.textContent='.msg .w{cursor:pointer;padding:0 1px;border-radius:3px;display:inline-block}.msg .w.pk{background:rgba(255,201,74,.45);color:#fff}.msg mark.pk{outline:2px solid var(--gold)}.msg .w.miss{outline:2px dashed var(--silver)}.pbg{border-radius:18px;padding:1rem}body.lefty .r-bot{flex-direction:row-reverse}.hint-x{font-size:.8rem;color:var(--silver)}';document.head.appendChild(st)})();

/* ---- profile ---- */
const PBG=['linear-gradient(135deg,#3a2a8a,#ff4fa3)','linear-gradient(135deg,#0f4a6a,#5ee0ff)','linear-gradient(135deg,#6a3a0f,#ffc94a)','linear-gradient(135deg,#0f4a2a,#5be38a)'];
function openProfile(){openSheet({title:'Player Profile',render(){const s=S.stats,pet=PETS.find(p=>p.id===S.petSel),ttl=titleName();const bg=PBG[S.pbg||0];
 return `<div class="pbg" style="background:${bg}"><div class="row" style="align-items:center"><img src="${avatarThumb()}" alt="Your avatar" style="width:6rem;height:6rem;border-radius:20px;background:rgba(0,0,0,.25)"><div class="grow"><h3 class="disp" style="margin:0;font-size:1.7rem;color:#fff">${esc(S.name||'Player')}</h3><span class="pill gold" style="margin-top:.3rem">${ttl}</span></div></div>
  <div class="row" style="margin-top:.7rem"><span>Lv ${S.level}</span><div class="grow"><div class="bar"><i style="width:${Math.round(S.exp/expNeed(S.level)*100)}%"></i></div></div><span class="muted" style="color:#fff">${S.exp}/${expNeed(S.level)} EXP</span></div></div>
  <div class="grid s" style="margin:.8rem 0"><div class="stat"><b>${fmt(S.coins)}</b><span>Coins</span></div><div class="stat"><b>${fmt(s.catches)}</b><span>Total catches</span></div><div class="stat"><b>x${s.bestCombo}</b><span>Highest combo</span></div><div class="stat"><b>${s.bosses}</b><span>Boss victories</span></div><div class="stat"><b>${s.worlds}/4</b><span>Worlds reached</span></div><div class="stat"><b>${s.secrets}/4</b><span>Secret maps</span></div><div class="stat"><b>${Object.keys(S.pets).length}/6</b><span>Pets collected</span></div><div class="stat"><b>${pet?pet.name:'None'}</b><span>Favorite pet</span></div><div class="stat"><b>${Object.keys(S.ach).length}/${ACH.length}</b><span>Achievements</span></div></div>
  <h3>Profile background</h3><div class="sw">${PBG.map((b,i)=>`<button style="background:${b}" class="${(S.pbg||0)===i?'on':''}" data-a="pbg:${i}" aria-label="Background ${i+1}"></button>`).join('')}</div>
  <h3>Player title</h3><div class="sw">${TITLES.filter(t=>t.lv<=S.level).map(t=>`<button class="tx ${t.t===ttl?'on':''}" data-a="ttl:${t.lv}">${t.t}</button>`).join('')}</div>
  <div class="row" style="flex-wrap:wrap;gap:.5rem;margin-top:1rem"><button class="btn sm" data-a="pedit">Edit Profile</button><button class="btn sm alt" data-a="closet">Customize / Closet</button><button class="btn sm ghost" data-a="pach">Achievements</button><button class="btn sm ghost" data-a="prec">Personal Records</button></div>`}})}
ACT.pbg=i=>{S.pbg=+i;save();reSheet()};ACT.ttl=l=>{S.titleLv=+l;save();reSheet()};ACT.pach=()=>openQuests('ach');ACT.prec=()=>openQuests('rec');ACT.pedit=()=>openEdit(false);
function fields(){return `<div style="display:grid;gap:.6rem;margin:.8rem 0"><label class="fld">Name<input type="text" id="pf_name" maxlength="20" autocomplete="off" placeholder="Your name" value="${esc(S.name||'')}"></label></div><div id="pf_err" class="fb-no" style="min-height:1.3rem;font-weight:800"></div>`}
function readFields(){const name=$('#pf_name').value.trim().slice(0,20);
 if(!name){$('#pf_err').textContent='Please type a name.';return null}return{name,nick:name.slice(0,12),user:'player'}}
function openEdit(first){if(first)showScreen('none');
 openSheet({title:first?'Create your profile':'Edit Profile',narrow:true,noClose:first,render(){return `<div class="row" style="align-items:center"><img src="${avatarThumb()}" alt="Your avatar" style="width:5.5rem;height:5.5rem;border-radius:18px;background:rgba(255,255,255,.08)"><p class="muted grow">Saved on this device only. No email, no phone number and no sign-up needed.</p></div>${fields()}<div class="row" style="gap:.5rem"><button class="btn" data-a="${first?'pfcreate':'pfsave'}">${first?'Create profile':'Save'}</button>${first?'':'<button class="btn ghost" data-a="close">Cancel</button>'}</div>`}})}
ACT.pfsave=()=>{const f=readFields();if(!f)return;Object.assign(S,f);save();refreshHome();closeSheet(true);openProfile();toast('Profile updated')};
ACT.pfcreate=()=>{const f=readFields();if(!f)return;Object.assign(S,f);S.setup=true;save();closeSheet(true);goHome.shown=1;goHome();meetHev()};

/* ---- settings, help, story gallery, about ---- */
function tg(path){const v=path.split('.').reduce((o,k)=>o[k],S.st);return `<button class="toggle ${v?'on':''}" data-a="tg:${path}" role="switch" aria-checked="${!!v}" aria-label="${path}"><i></i></button>`}
function sg(key,opts){return `<div class="seg">${opts.map(([v,l])=>`<button class="${String(S.st[key])===String(v)?'on':''}" data-a="sv:${key}:${v}">${l}</button>`).join('')}</div>`}
function srow(label,ctl,note){return `<div style="margin:.55rem 0"><div class="row"><span class="grow"><b>${label}</b>${note?`<br><span class="muted">${note}</span>`:''}</span>${ctl.startsWith('<button')?ctl:''}</div>${ctl.startsWith('<button')?'':`<div style="margin-top:.35rem">${ctl}</div>`}</div>`}
function openSettings(from,tab){openSheet({title:'Settings',tabs:from==='run'?[{id:'set',label:'Settings'}]:[{id:'set',label:'Settings'},{id:'help',label:'Help'},{id:'story',label:'Story Gallery'},{id:'about',label:'About'}],tab:tab||'set',onClose:()=>{if(from==='run'&&G&&G.pause)openPause()},
 render(t){
 if(t==='help')return helpHtml();
 if(t==='story')return `<p class="muted" style="margin-bottom:.7rem">Relive the story of Hev and Dags and run the tutorial again whenever you like.</p><div class="card" style="margin-bottom:.6rem"><div class="row"><div class="grow"><b>The Great Rivalry</b><p>The opening cinematic. About 20 seconds.</p></div><button class="btn sm" data-a="replaycine">Replay</button></div></div><div class="card"><div class="row"><div class="grow"><b>Tutorial</b><p>Replay the guided Intramuros run.</p></div><button class="btn sm" data-a="replaytut">Replay</button></div></div>`;
 if(t==='about')return aboutHtml();
 if(S.st.voice===undefined)S.st.voice=true;
 return `<h3>Audio</h3>${srow('Music',tg('musicOn'))}${srow('Read dialogue aloud',tg('tts'),'Optional. Uses the voices installed on your device.')}${srow('Music volume',`<input type="range" min="0" max="1" step=".05" value="${S.st.music}" data-st="music" aria-label="Music volume">`)}${srow('Sound effects volume',`<input type="range" min="0" max="1" step=".05" value="${S.st.sfx}" data-st="sfx" aria-label="Sound effects volume">`)}
 <h3>Controls</h3>${srow('Touch swipes',tg('touch'),'Swipe on the screen to move, jump and slide.')}${srow('Sensitivity',sg('sens',[[.7,'Low'],[1,'Normal'],[1.4,'High']]))}${srow('Control layout',sg('hand',[['right','Right-handed'],['left','Left-handed']]))}
 <h3>Graphics</h3>${srow('Quality',sg('quality',[['low','Performance'],['medium','Balanced'],['high','Quality']]),'Lower it if the game feels slow.')}
 <h3>Display</h3>${srow('Fullscreen',`<button class="toggle ${document.fullscreenElement?'on':''}" data-a="fs" role="switch" aria-label="Fullscreen"><i></i></button>`,document.fullscreenEnabled?'':'Not available on this device.')}
 <h3>Gameplay</h3>${srow('Difficulty',sg('diff',[['easy','Easy 15'],['medium','Medium 10'],['hard','Hard 5']]),'Starting lives. Upgrades add extra hearts.')}${srow('Vibration',tg('vibrate'))}${srow('Screen shake',tg('shake'))+srow('Pixel effect',tg('pixfx'),'Crisp pixels and a light scanline look.')}${srow('Calm mode',tg('calm'),'Fewer flashes and no screen shake.')}
 <h3>Accessibility</h3>${srow('Text size',sg('text',[[.9,'Small'],[1,'Normal'],[1.15,'Large'],[1.3,'Huge']]))}
 <h3>Language</h3>${srow('Language',`<div class="seg"><button class="on">English</button><button disabled style="opacity:.5">Filipino (soon)</button></div>`)}
 <h3>Notifications</h3><p class="muted">In-game reminders only. Nothing is ever sent to you outside the game.</p>${srow('Daily rewards',tg('notif.daily'))}${srow('Quest reminders',tg('notif.quest'))}${srow('Event notifications',tg('notif.event'))}
 <h3>Privacy and saves</h3><p class="muted">Your progress is saved on this device only. If you delete the app or switch devices it can be lost. An optional backup is planned for later. No account, email or phone number is needed.</p><div style="margin-top:.6rem"><button class="btn sm ghost" data-a="wipe" id="wipeBtn">Erase all progress</button></div>`}})}
ACT.tg=p=>{const k=p.split('.');let o=S.st;for(let i=0;i<k.length-1;i++)o=o[k[i]];o[k[k.length-1]]=!o[k[k.length-1]];if(p==='calm'&&S.st.calm)S.st.shake=false;save();applyPrefs();reSheet()};
ACT.sv=a=>{const[k,...r]=a.split(':');const v=r.join(':');S.st[k]=(v!==''&&!isNaN(+v))?+v:v;save();applyPrefs();reSheet()};
ACT.fs=()=>{try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen()}catch(e){}setTimeout(reSheet,300)};
ACT.wipe=(a,b)=>{if(b.dataset.sure){eraseProgress();location.reload()}else{b.dataset.sure=1;b.textContent='Tap again to erase everything'}};
ACT.replaycine=()=>{closeSheet(true);startCine(()=>goHome())};ACT.replaytut=()=>{S.tutorialDone=false;save();closeSheet(true);startRun('catch','intramuros')};
function applyPrefs(){document.documentElement.style.fontSize=(S.st.text*100)+'%';document.body.classList.toggle('lefty',S.st.hand==='left');document.body.classList.toggle('pixfx',S.st.pixfx!==false);const dpr=window.devicePixelRatio||1;R.setPixelRatio(S.st.quality==='low'?1:S.st.quality==='high'?Math.min(dpr,2):Math.min(dpr,1.5));resizeAll();applyVol()}
function helpHtml(){const d=(t,b)=>`<details class="card" style="margin-bottom:.45rem"><summary style="cursor:pointer;font-weight:900">${t}</summary><div class="muted" style="margin-top:.5rem">${b}</div></details>`;
 return d('How to play','<b>Movement</b>: switch lanes left and right. <b>Jumping</b>: hop over low barriers. <b>Sliding</b>: duck under gates. <b>Catching</b>: run through coins, gems, chests and mystery boxes. <b>Avoiding</b>: dodge carts, jeepneys and falling crates. <b>Combos and scoring</b>: chain catches without a hit; every 10 raises your multiplier up to x5. <b>Power-ups</b>: tap the gold button. <b>Pet abilities</b>: tap the pet button. <b>Boss encounters</b>: catch music notes to win the Rap Battle. <b>Journey</b>: ride the jeepney, switch lanes and collect. <b>Scam Alert</b>: spot the scam on the Home screen.')+
 d('Game controls','Keyboard: A / D or Left / Right to move, Space (or Up / W) to jump, S (or Down) to boost, Q pet ability, E power-up, 1 / 2 boss powers, P or Esc to pause.<br>Touch: drag to move, use the Jump and Boost buttons. Secret Maps are reached through mysterious portals.')+
 d('FAQs','<b>Do I need to pay?</b> No. Everything uses coins and tickets you earn. Character looks are always free.<br><b>Is there a leaderboard?</b> No. You only compete against your own records.<br><b>Do pets need feeding?</b> Never. They are friends, not chores.<br><b>What if I miss a day?</b> Nothing is lost.')+
 d('Feature guide','<b>Pets</b> give a special ability and evolve at Level 5. <b>Upgrades</b> make small, fair boosts. <b>Quests</b> change daily. <b>Maps</b> hold Manila districts, the Rap Battle and secret map clues. A portal takes you to a discovered Secret Map, and the only way back to the normal maps is to beat that map\u2019s boss. <b>Spotibai</b> lets you choose your own music anywhere.')+
 d('Troubleshooting','No music? Tap the screen once, then press play in Spotibai. Game slow? Settings, Graphics, Performance. Progress missing? Saves live in this browser only, so clearing site data erases them.')+
 d('Credits','Game design and story: the Catching Dags with Hev team. Songs are provided by the team and are shown for your enjoyment; they are not used without permission. All characters here are original cartoon designs, not real likenesses. Built with three.js.')}
function aboutHtml(){const row=(n,s)=>`<tr><td style="padding:.25rem .5rem .25rem 0">${n}</td><td><span class="pill ${s==='Done'?'good':s==='Prototype'?'violet':''}">${s}</span></td></tr>`;
 return `<p class="muted" style="margin-bottom:.7rem"><b style="color:#fff">Catching Dags with Hev</b><br>Catch. Collect. Outsmart the Scams.<br>Build status, so nothing is hidden:</p><table style="width:100%;font-size:.88rem;font-weight:700">${[['Title, cinematic, closet (free), profile','Done'],['Home, quests, achievements, records','Done'],['Intramuros + 3 more Manila districts (catching)','Done'],['Portal travel to the Secret Maps','Done'],['Uncle Dags Rap Battle (boss)','Done'],['6 pets, abilities, Lv5 evolved look','Done'],['Upgrades, 7 power-ups, shop, inventory','Done'],['Golden Wheel, daily rewards','Done'],['Scam Alert, Spotibai, settings, help, local save','Done'],['Legendary Wheel (needs World 2)','Prototype'],['Worlds 2 to 5 and their journeys and bosses','Prototype'],['4 secret maps: ride in, catching, exploring, boss to escape (backstories coming soon)','Done'],['Seasonal events (Halloween, Christmas, Summer)','Prototype'],['Exploration Mode','Done']].map(r=>row(...r)).join('')}</table>`}

/* ---- Scam Alert ---- */
let SCM=null;
function scamWords(txt){const out=[];let inF=false;txt.replace(/\[\[/g,' [[ ').replace(/\]\]/g,' ]] ').split(/\s+/).filter(Boolean).forEach(w=>{if(w==='[[')inF=true;else if(w===']]')inF=false;else out.push({w,f:inF})});return out}
function openScam(){SCM={view:'home'};openSheet({title:'Scam Alert!',narrow:true,render(){const sc=SCM;
 if(sc.view==='home')return `<div class="card on" style="margin-bottom:.8rem"><h3 style="margin:0">Spot the Scam. Stay Safe.</h3><p>Read each message, tap the words that feel suspicious, then decide: scam or safe? Quick missions, quick rewards.</p></div><div class="grid s"><div class="stat"><b>${S.stats.scamOk}</b><span>Scams spotted</span></div><div class="stat"><b>${S.stats.scamTotal}</b><span>Messages checked</span></div></div><div style="margin-top:.9rem"><button class="btn" data-a="scstart">Start mission (5 messages)</button></div><p class="muted" style="margin-top:.7rem">Fake prizes, suspicious links, requests for personal info, fake discounts and people pretending to be someone else. Everything here is fictional.</p>`;
 if(sc.view==='done')return `<div style="text-align:center"><h3 class="disp" style="font-size:1.8rem;color:var(--gold);margin:0">Mission complete!</h3><p style="margin:.5rem 0">You got <b>${sc.right} of 5</b> right.</p><p>${coinHtml(sc.earn)}${sc.tix?' + '+tixHtml(sc.tix):''}</p><p class="muted" style="margin:.6rem 0">${sc.right>=4?'Sharp eyes! Scammers hate you.':'Good start. Look for pressure, links and requests for private info.'}</p><div class="row" style="justify-content:center;gap:.5rem"><button class="btn" data-a="scstart">Another mission</button><button class="btn ghost" data-a="close">Done</button></div></div>`;
 const m=sc.q[sc.i],words=scamWords(m.txt);const head=`<div class="row" style="margin-bottom:.5rem"><b class="grow">Message ${sc.i+1} of 5</b><span class="pill">${sc.right} right</span></div>`;
 if(sc.view==='q')return head+`<div class="phone"><div class="msg"><span class="from">${esc(m.from)}</span>${words.map((x,i)=>`<span class="w ${sc.flags.includes(i)?'pk':''}" data-a="w:${i}">${esc(x.w)}</span>`).join(' ')}</div></div><p class="muted" style="margin:.6rem 0">Tap any words that look like warning signs, then choose.</p><div class="row" style="gap:.5rem"><button class="btn alt grow" data-a="sca:scam">Scam!</button><button class="btn grow" data-a="sca:safe">Looks safe</button></div>`;
 const spotted=words.filter((x,i)=>x.f&&sc.flags.includes(i)).length,total=words.filter(x=>x.f).length;
 return head+`<div class="phone"><div class="msg"><span class="from">${esc(m.from)}</span>${words.map((x,i)=>x.f?`<mark class="${sc.flags.includes(i)?'pk':''}">${esc(x.w)}</mark>`:`<span class="w ${sc.flags.includes(i)?'miss':''}">${esc(x.w)}</span>`).join(' ')}</div></div>
  <div class="card ${sc.ok?'on':''}" style="margin-top:.7rem"><b class="${sc.ok?'fb-ok':'fb-no'}">${sc.ok?'Correct!':'Not quite.'} This message is ${m.scam?'a SCAM':'SAFE'}.</b>${m.scam?`<p>Warning signs: you spotted ${spotted} of ${total}. The red words are the clues.</p>`:''}<p style="margin-top:.3rem">${m.why}</p>${sc.reward?`<p style="margin-top:.3rem">${coinHtml(sc.reward)}</p>`:''}</div><div style="margin-top:.7rem"><button class="btn" data-a="scnext">${sc.i>=4?'Finish':'Next message'}</button></div>`}})}
ACT.scstart=()=>{let q=SCAMS.slice().sort(()=>Math.random()-.5).slice(0,5);if(!q.some(x=>!x.scam))q[4]=pick(SCAMS.filter(x=>!x.scam));SCM={view:'q',q,i:0,flags:[],right:0,earn:0,tix:0};reSheet()};
ACT.w=i=>{i=+i;const f=SCM.flags,k=f.indexOf(i);if(k>=0)f.splice(k,1);else f.push(i);reSheet()};
ACT.sca=c=>{const m=SCM.q[SCM.i],ok=(c==='scam')===!!m.scam;SCM.ok=ok;S.stats.scamTotal++;SCM.reward=0;S.scam=S.scam||{day:'',n:0};if(S.scam.day!==today())S.scam={day:today(),n:0};
 if(ok){SCM.right++;S.stats.scamOk++;if(m.scam)track('scam',1);if(S.scam.n<12){S.scam.n++;SCM.reward=25;S.coins+=25;SCM.earn+=25}SFX.win()}else SFX.no();SCM.view='fb';save();refreshHome();reSheet()};
ACT.scnext=()=>{if(SCM.i>=4){if(SCM.right>=4){S.coins+=50;SCM.earn+=50}if(SCM.right===5){S.tickets++;SCM.tix=1}const a=checkAch();save();refreshHome();SCM.view='done';if(a.length)toast('Achievement: '+a[0].n)}else{SCM.i++;SCM.flags=[];SCM.view='q'}reSheet()};

/* ---- cinematic ---- */
let cine=null;const CMTS=['Sorry Dags, Hev’s songs hit different.','Can Dags even compete with Hev?','Hev’s music is on another level.','No one can beat Hev’s songs.','Hev is always number one!'];
const cap=(who,t)=>{$('#cineTxt').innerHTML=`<div class="say ${who==='dags'?'dags':''}">${who?`<b>${who==='dags'?'Dags':'Hev'}</b>`:''}${esc(t)}</div>`};
const cmt=i=>{const e=mk('div','cmt',esc(CMTS[i]));e.style.left=rnd(4,48)+'%';e.style.top=rnd(18,58)+'%';$('#cmts').appendChild(e);setTimeout(()=>e.remove(),3100)};
function coinBurst(){const s=SCN.stage;for(let i=0;i<30;i++){const m=new THREE.Mesh(GEO.coin,M('#ffc94a',{emissive:'#e08a12',emissiveIntensity:.6,metalness:.6,roughness:.3}));m.position.set(-.2,3,-.4);s.sc.add(m);s.coins.push({m,v:new THREE.Vector3(rnd(-6,6),rnd(5,11),rnd(0,5))})}cine.shake=.7}
const CT=[[0,()=>cap('','Hev takes the biggest stage in Manila. The crowd goes wild.')],[3,()=>cmt(0)],[3.2,()=>cap('','Online, fans keep comparing Hev and Dags...')],[3.8,()=>cmt(1)],[4.6,()=>cmt(2)],[5.4,()=>cmt(3)],[6.2,()=>cmt(4)],
 [7,()=>{cine.dagsIn=true;cap('','Dags reads every comment. He is not happy.')}],[9.3,()=>cap('dags','You think you’re better than me just because everyone keeps comparing our songs?')],[12,()=>cap('hev','I never said that. They’re the ones comparing us.')],[14,()=>cap('dags','Then prove it! Let’s see whose music deserves the spotlight!')],
 [16,()=>{coinBurst();cap('','A chaotic competition begins. Coins and treasures scatter across Manila!')}],[17.2,()=>{cine.turn=true;cap('hev','Hey! Can you help me catch them all?')}],[19.4,()=>endCine()]];
function startCine(after){closeSheet(true);stageBuild();const s=SCN.stage;s.dags.g.position.x=14;s.hev.g.rotation.y=.6;s.coins.forEach(c=>s.sc.remove(c.m));s.coins=[];
 cine={t:0,i:0,after,kind:'stage',done:false,shake:0};$('#cineTitle').textContent='THE GREAT RIVALRY';$('#cmts').innerHTML='';$('#cineTxt').innerHTML='';$('#btnSkip').textContent='Skip';setMode('cine');R.setClearColor(0x0d0a22)}
function endCine(){if(!cine||cine.done)return;cine.done=true;S.seenIntro=true;save();const a=cine.after;cine=null;SCN.stage.coins.forEach(c=>SCN.stage.sc.remove(c.m));SCN.stage.coins=[];if(a)a()}
function skipCine(){if(!cine)return;SFX.ui();endCine()}
function cineUpdate(dt,T){const s=SCN.stage;cine.t+=dt;while(cine.i<CT.length&&CT[cine.i][0]<=cine.t){const f=CT[cine.i++][1];if(cine)f();if(!cine)return}
 stageUpdate(dt,T);if(cine.dagsIn)s.dags.g.position.x=lerp(s.dags.g.position.x,2.8,.05);
 s.hev.g.rotation.y=lerp(s.hev.g.rotation.y,cine.turn?0:.6,.06);pose(s.hev,T,cine.turn?'wave':'arms');pose(s.dags,T+1,'angry');
 cine.shake=Math.max(0,cine.shake-dt);const sh=cine.shake*.25,cam=s.cam;cam.position.set(rnd(-sh,sh),3.2+rnd(-sh,sh),clamp(18-cine.t*.22,13.5,18));cam.lookAt(.4,2.4,-1)}
/* ---- first-time flow ---- */
function startFirstFlow(){flow='first';startCine(()=>openCust(true))}
const HEVP=nick=>[`Yo, ${nick}! I am Hev. I make the music, you make the catches.`,'Dags and I got into a loud argument. People kept comparing our songs, and now coins and treasures are flying all over Manila.','Catch what you can. Dodge what you cannot. I will be right beside you. Let us start in Intramuros!'];
let hevI=0;
function meetHev(){hevI=0;const nick=S.nick||S.name;const pages=HEVP(nick);
 openSheet({title:'Meet Hev',narrow:true,noClose:true,render(){return `<div class="row" style="align-items:flex-start"><img src="${npcThumb(HEV_LOOK)}" alt="Hev" style="width:6rem;height:6rem;border-radius:18px;background:rgba(255,255,255,.08)"><div class="grow"><b style="color:#8a6aff">Hev</b><p style="font-size:1.02rem;color:#fff;margin-top:.3rem">${esc(pages[hevI])}</p></div></div><div style="margin-top:1rem"><button class="btn" data-a="hevnext">${hevI<pages.length-1?'Next':'Let’s go!'}</button></div>`}})}
ACT.hevnext=()=>{if(hevI<2){hevI++;reSheet()}else{closeSheet(true);startRun('catch','intramuros')}};

function ensureDagsWear(){}

/* ============ 2D screens: pixel plaza backdrop, title, home, character creator, story gallery ============ */
const BG={img:null,id:'',dpr:1,ff:[]};
const bgSceneId=()=>mode==='cust'?'intramuros':'plaza';
const isDay=()=>{const h=new Date().getHours();return h>=6&&h<18};
function bgBuild(id){const c=$('#bgc'),dpr=Math.min(devicePixelRatio||1,1.5),w=Math.max(innerWidth||0,320),h=Math.max(innerHeight||0,240);c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);BG.dpr=dpr;BG.id=id;BG.day=isDay();
 const o=mkCv(c.width,c.height),g=o.getContext('2d');g.imageSmoothingEnabled=false;const s=sceneCanvas(id,256,144,isDay()),k=Math.max(o.width/256,o.height/144);g.drawImage(s,(o.width-256*k)/2,(o.height-144*k)/2,256*k,144*k);
 g.fillStyle='rgba(10,6,32,.18)';g.fillRect(0,0,o.width,o.height);BG.img=o;let sd=5;const rd=()=>(sd=(sd*16807)%2147483647)/2147483647;BG.ff=[];for(let i=0;i<26;i++)BG.ff.push({x:rd()*w,y:h*.3+rd()*h*.6,v:3+rd()*8,c:['#ffe27a','#9ae8ff','#ff9ad0'][i%3],p:rd()*6})}
function bgFrame(t,dt){const c=$('#bgc'),id=bgSceneId();if(!c||!(innerWidth>0&&innerHeight>0))return;if(!BG.img||BG.id!==id||BG.day!==isDay())bgBuild(id);const g=c.getContext('2d');g.setTransform(1,0,0,1,0,0);g.drawImage(BG.img,0,0);g.setTransform(BG.dpr,0,0,BG.dpr,0,0);
 for(const b of BG.ff){b.y-=b.v*dt;if(b.y<innerHeight*.25){b.y=innerHeight+6;b.x=Math.random()*innerWidth}const a=.25+.6*(.5+.5*Math.sin(t*2+b.p));g.globalAlpha=a;g.fillStyle=b.c;const px=Math.round(b.x+Math.sin(t*.7+b.p)*10),py=Math.round(b.y);g.fillRect(px,py,3,3)}g.globalAlpha=1}
let bgT;addEventListener('resize',()=>{clearTimeout(bgT);bgT=setTimeout(()=>{BG.img=null},120)});

/* ---- helpers ---- */
const idleOf=L=>L.fp?L.fp.idle:'idle';
const spr=(L,p)=>sprURL(L,p||idleOf(L));
const wood=(cls='')=>`px-wood ${cls}`;

/* ---- title screen ---- */
function buildTitle(){const t=$('#title');t.innerHTML=`<div class="t-art l"><img id="tHev" alt="Hev"></div><div class="t-art r"><img id="tDags" alt="Dags"></div>
 <div class="t-logo"><h1><span class="a">CATCHING</span><span class="b">DAGS</span><span class="c">WITH HEV</span></h1><p>Catch. Collect. Outsmart the Scams.</p></div>
 <div class="t-btns"><button class="px-play" id="tPlay"><span>PLAY</span></button><div class="row" style="gap:.6rem;justify-content:center"><button class="px-sm" id="tStory">${ico('book')}Backstory</button><button class="px-sm" id="tSet">${ico('gear')}Settings</button><button class="px-sm" id="tQuit">${ico('x')}Quit</button></div></div>`;
 $('#tHev').src=spr(HEV_LOOK,'peace');$('#tDags').src=spr(DAGS_LOOK,'cross');
 $('#tPlay').addEventListener('click',()=>{SFX.ui();firstTouch();if(!S.setup)startFirstFlow();else goHome()});
 $('#tSet').addEventListener('click',()=>{SFX.ui();openSettings()});$('#tStory').addEventListener('click',()=>{SFX.ui();openStory('bs')});
 $('#tQuit').addEventListener('click',()=>{SFX.ui();openSheet({title:'Quit?',narrow:true,render(){return `<p style="margin-bottom:.8rem">Thanks for playing! Your progress is saved on this device. You can close this tab any time.</p><div class="row" style="gap:.5rem"><button class="btn" data-a="close">Keep playing</button></div>`}})})}
function showTitle(){stopAll();setMode('title');R.setClearColor(0x0d1630)}

/* ---- home screen ---- */
const NAVL=[['diff','Easy','heart'],['events','Events','star'],['rewards','Login Rewards','gift'],['quests','Quests','quest']];
const DOCK=[['pets','Pets','paw'],['inv','Inventory','bag'],['shop','Shop','shop'],['map','Maps','map'],['more','More','menu']];
const MORE=[['daily','Daily Quests','quest'],['weekly','Weekly Quests','book'],['upg','Upgrades','up'],['juke','Spotibai','music'],['story','Story Gallery','book'],['secret','Secret Maps','map2'],['scam','Scam Alert','alert'],['closet','Customize','star'],['profile','Profile','star'],['settings','Settings','gear']];
const GO={diff:()=>{const o=['easy','medium','hard'];S.st.diff=o[(o.indexOf(S.st.diff)+1)%3];save();refreshHome();toast(DIFFS[S.st.diff][0]+': '+DIFFS[S.st.diff][1]+' lives')},daily:()=>openQuests('d'),weekly:()=>openQuests('w'),events:()=>openQuests('ev'),rewards:openDaily,map:()=>openMaps('m'),juke:openJuke,story:()=>openStory(),secret:()=>openMaps('s'),
 pets:()=>openPets(),inv:()=>openShop('inv'),quests:()=>openQuests(),upg:()=>openUpgrades(),shop:()=>openShop(),scam:openScam,closet:()=>openCust(false),profile:openProfile,settings:openSettings,more:()=>openMore()};
function openMore(){openSheet({title:'More',narrow:true,render(){return `<div class="mg">${MORE.map(([k,l,i])=>`<button class="px-tile" data-a="mgo:${k}">${ico(i)}<span>${l}</span></button>`).join('')}</div>`}})}
ACT.mgo=k=>{closeSheet(true);GO[k]()};
const TIPS=['Welcome back! Ready to catch?','Real prizes never ask for your OTP.','Press S to boost your catch speed!','Fake rewards? Dodge the red ones.','Try the Rap Battle with Uncle Dags!'];
function buildHome(){const nv=([k,l,i])=>`<button class="px-tile" data-go="${k}">${ico(i)}<span>${l}</span><i class="dot" hidden></i></button>`;
 $('#home').innerHTML=`<div class="px-top"><button class="px-prof ${wood()}" id="btnProfile" aria-label="Open profile"><img id="pAvatar" alt=""><span class="pn"><b id="pName">Player</b><span class="lvrow"><em id="pLv">Lv 1</em><span class="bar"><i id="pExp" style="width:0"></i></span></span></span></button>
  <div class="px-wal"><span class="px-chip" id="chCoins"><span id="icoCoin"></span><b id="vCoins">0</b><i>+</i></span><span class="px-chip" id="chTix" hidden style="display:none"><span id="icoTix"></span><b id="vTix">0</b><i>+</i></span>
  <button class="px-ib" id="btnGift" aria-label="Daily rewards"></button><button class="px-ib" id="btnSet" aria-label="Settings"></button></div></div>
  <nav class="px-left" aria-label="Quick menu">${NAVL.map(nv).join('')}</nav>
  <div class="hstage" id="hStage"><div class="hc pet" id="hPet"><img alt="Your pet"></div><div class="hc me" id="hMe"><i class="aura"></i><img alt="You"><span class="tag">You</span></div><div class="hc hev"><div class="say" id="hSay"></div><img id="hHev" alt="Hev"><span class="tag">Hev</span></div></div>
  <button class="px-play side ${wood()}" id="btnPlay" aria-label="Play"><small id="playLbl"></small><b>PLAY</b></button>
  <div class="px-dock" id="dock">${DOCK.map(([k,l,i])=>`<button class="px-bb ${wood()}" data-go="${k}">${ico(i)}<span>${l}</span><i class="dot" hidden></i></button>`).join('')}</div>`;
 $('#home').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){SFX.ui();GO[b.dataset.go]();return}if(e.target.closest('#hMe')){SFX.ui();openCust(false)}});
 $('#hHev').src=spr(HEV_LOOK,'peace');
 $('#btnProfile').addEventListener('click',()=>{SFX.ui();openProfile()});$('#btnGift').addEventListener('click',()=>{SFX.ui();openDaily()});$('#btnSet').addEventListener('click',()=>{SFX.ui();openSettings()});
 $('#chCoins').addEventListener('click',()=>{SFX.ui();openShop()});
 $('#btnGift').innerHTML=ico('gift');$('#btnSet').innerHTML=ico('gear');$('#icoCoin').innerHTML=ICO.coin;$('#icoTix').innerHTML=ICO.gem||ICO.tix;
 $('#btnPlay').addEventListener('click',()=>{SFX.ui();firstTouch();const m=S.mode||{kind:'catch',dist:'intramuros'};startRun(m.kind,m.dist)})}
let hmKey='';
function refreshHome(){if(S.tickets>0){const got={};for(let i=0;i<Math.min(S.tickets,30);i++){const p=pick(POWERS);S.inv.power[p.id]=(S.inv.power[p.id]||0)+1;got[p.name]=(got[p.name]||0)+1}S.tickets=0;save();setTimeout(()=>toast('Bonus power-ups: '+Object.keys(got).map(k=>got[k]+'x '+k).join(', ')),400)}if(!$('#pAvatar'))return;const L=resolveLook(S.look);
 const pd=S.petSel&&S.pets[S.petSel]?PETS.find(p=>p.id===S.petSel):null,evo=pd?petStage(S.pets[pd.id].lvl,S.evoView[pd.id]!==false):1;
 const key=JSON.stringify(L)+(pd?pd.id+evo:'');if(key!==hmKey){hmKey=key;$('#pAvatar').src=headURL(L,96);const me=$('#hMe');$('img',me).src=spr(L,'idle');$('.aura',me).style.background=L.aura?`radial-gradient(closest-side,${L.aura}cc,${L.aura}00)`:'none';
  const pe=$('#hPet');pe.hidden=!pd;if(pd)$('img',pe).src=petThumb(pd,evo)}
 $('#pName').textContent=S.nick||S.name||'Player';$('#pLv').textContent='Lv '+S.level;$('#pExp').style.width=Math.round(S.exp/expNeed(S.level)*100)+'%';$('#vCoins').textContent=fmt(S.coins);$('#vTix').textContent=fmt(S.tickets);
 $('#hSay').textContent=(S.nick||S.name?'Hi '+(S.nick||S.name)+'! ':'')+TIPS[(S.level+new Date().getDate())%TIPS.length];
 const dl=$('[data-go="diff"] span');if(dl)dl.textContent=DIFFS[S.st.diff||'medium'][0]+' '+baseLives();genQuests();const dq=S.quests.daily,wq=S.quests.weekly,cl=q=>q.prog>=q.goal&&!q.claimed;
 const dots={quests:dq.concat(wq).some(cl),shop:false,rewards:S.login.last!==today()&&S.setup};
 $$('[data-go]',$('#home')).forEach(b=>{const d=$('.dot',b);if(d)d.hidden=!dots[b.dataset.go]});
 if(S.trapped&&(!S.mode||S.mode.dist!==S.trapped||S.mode.kind==='journey'))S.mode={kind:'catch',dist:S.trapped};if(S.mode&&S.mode.kind==='journey')S.mode={kind:'catch',dist:'intramuros'};const m=S.mode||{kind:'catch'};const dn=(DIST.find(d=>d.id===m.dist)||DIST[0]).name;$('#playLbl').textContent=m.kind==='boss'?(S.trapped?'Boss Battle':'Rap Battle'):(S.trapped?mapName(S.trapped):dn)}
function goHome(){if(S.pendingReconcile&&!S.lifeMsgSeen){S.pendingReconcile=false;save();setTimeout(()=>startReconcile(),600)}else if(S.teamPending){const tid=S.teamPending;S.teamPending=false;save();setTimeout(()=>startTeam(tid,()=>goHome()),600)}else if(S.revealPending){const rid=S.revealPending;S.revealPending=false;save();setTimeout(()=>startReveal(rid,()=>goHome()),600)}else if(S.lorePending){const lid=S.lorePending;S.lorePending=false;save();setTimeout(()=>startLore(lid,()=>{if(S.claimed&&S.claimed.all&&!(S.loreSeen||{}).ending)startLore('ending',()=>goHome());else goHome()}),600)}else if(!S.seenBiringan&&manilaDone()){S.portalPending=false;save();setTimeout(()=>startPortal('biringan'),700)}stopAll();setMode('home');hmKey='';refreshHome();R.setClearColor(0x0d1630);
 if(S.setup&&S.login.last!==today()&&!goHome.shown){goHome.shown=1;setTimeout(()=>{if(mode==='home'&&!SH)openDaily()},700)}}

/* ---- story gallery ---- */
function openStory(tab){openSheet({title:'Story Gallery',tabs:[{id:'bs',label:'Backstory'},{id:'ci',label:'Cinematic'},{id:'ch',label:'Characters'},{id:'tr',label:'Trophies'}],tab:tab||'bs',render(t){
 if(t==='bs'){const CH=[['1. The Argument','Hev and Dags make music in Manila. People kept comparing their songs, and the comparing got loud. So loud that coins, gems and treasure started falling all over the city.'],['2. The Catcher','That is where you come in. With your pet beside you, you catch every treasure that falls. Let one hit the floor and you lose a life. The only things you must never catch are bombs and boxes.'],['3. Uncle Dags','Dags has an uncle: the king of the Manila Underground Rap Stage. He says the argument must be settled with a Rap Battle. Crack his Hype Shield by catching the mics, and earn the Beat Breaker Trophy.'],['4. Beyond Manila','The falling treasure reaches Banaue, Palawan, Bohol and Siargao. Each place has a guardian who will not let you pass until you prove yourself.'],['5. The Secret Roads','Some places are not on any map: Biringan City, the Whispering Balete, the Midnight Mansion, the Kapre\u2019s Grove and the Tikbalang Trail. Collect map fragments to find them, then step through its portal. You can only come back by beating the guardian. The full story of each secret map: Coming soon.'],['6. Outsmart the Scams','Real prizes never ask for your OTP. Hev will remind you along the way. Catch, explore, collect and outsmart the scams.']];return `<p class="muted" style="margin-bottom:.7rem">The whole story of Catching Dags with Hev. Come back any time.</p>${CH.map(([h,p])=>`<div class="card" style="margin-bottom:.5rem"><h4>${h}</h4><p>${p}</p></div>`).join('')}<div class="card" style="margin-bottom:.5rem"><h4>7. Hev and Dags</h4><p>${S.lifeMsgSeen?'Rivals no more. The scene and its message are saved here.':'Locked until Hev and Dags settle things in the Rap Battle.'}</p>${S.lifeMsgSeen?'<button class="btn sm" data-a="replayrec">Replay</button>':''}</div>${['biringan','balete','mansion','kapre'].map(k=>`<div class="card" style="margin-bottom:.5rem"><h4>Backstory: ${mapName(k)}</h4><p>${(S.loreSeen||{})[k]?'The tale is unlocked.':'Beat the boss to hear it.'}</p>${(S.loreSeen||{})[k]?`<button class="btn sm" data-a="replaylore:${k}">Replay</button>`:''}</div>`).join('')}${['biringan','balete','mansion','kapre'].map(k=>`<div class="card" style="margin-bottom:.5rem"><h4>Teamwork: ${mapName(k)}</h4><p>${(S.teamSeen||{})[k]?'Hev and Dags solve a problem together.':'Unlocks after you beat this boss.'}</p>${(S.teamSeen||{})[k]?`<button class="btn sm" data-a="replayteam:${k}">Replay</button>`:''}</div>`).join('')}<div style="margin-top:.6rem"><button class="btn" data-a="replaycine">Replay intro cinematic</button></div>`}
 if(t==='ci')return `<div class="card on" style="text-align:center"><div style="display:flex;justify-content:center;gap:.5rem;align-items:flex-end"><img src="${spr(HEV_LOOK,'peace')}" alt="Hev" style="height:11rem"><img src="${spr(DAGS_LOOK,'cross')}" alt="Dags" style="height:11rem"></div><h3 style="margin:.4rem 0 0">The Great Rivalry</h3><p class="muted">Fans keep comparing Hev and Dags. Things get loud.</p><div style="margin-top:.6rem"><button class="btn" data-a="replaycine">Replay intro</button></div></div>`;
 if(t==='ch'){const L=[[HEV_LOOK,'Hev','Human rapper. Navy, electric blue and silver. Always has his mic.'],[DAGS_LOOK,'Dags','Streetwear rapper with a cap, shades and gold chain.'],[BOSS_LOOK,'Uncle Dags','Boss of the Manila Underground Rap Stage.']];return `<div class="grid">${L.map(([l,n,d])=>`<div class="card" style="text-align:center"><img src="${spr(l)}" alt="${n}" style="height:10rem"><h4>${n}</h4><p class="muted">${d}</p></div>`).join('')}</div>`}
 return `<div class="grid">${[['Beat Breaker Trophy','Beat Uncle Dags in the Rap Battle.',!!S.bossWon]].map(([n,d,ok])=>`<div class="card ${ok?'on':'lock'}"><h4>${n}</h4><p class="muted">${ok?'Unlocked. Dags Streetwear is free in Customize.':d}</p></div>`).join('')}</div>`}})}

/* ---- character creator ---- */
let CU=null;
const VIEWS=[['',0],['',1],['peace',0],['cheer',0],['pocket',0]];
const TABS=[['styles','Styles'],['hair','Hair'],['face','Face'],['clothes','Clothes'],['acc','Accessories'],['colors','Colors']];
const PAL={skin:SKINS,hc:HAIRC,tc:CLOTHC,ta:CLOTHC,bc:CLOTHC,sc:CLOTHC,hatc:CLOTHC,nc:ACCC,xc:CLOTHC,aura:AURAS};
const PNAME={skin:'Skin tone',hc:'Hair color',tc:'Top color',ta:'Top accent',bc:'Bottom color',sc:'Shoe color',hatc:'Hat color',nc:'Neckwear color',xc:'Bag / item color',aura:'Aura glow'};
function openCust(first){closeSheet(true);S.favs=(S.favs||[]).filter(f=>f&&f.hs);const base=S.look&&S.look.hs?resolveLook(S.look):defaultLook();CU={look:Object.assign({},base),orig:Object.assign({},base),first:!!first,tab:'styles',view:0};setMode('cust');R.setClearColor(0x1a1f5c);renderCust()}
const cuPose=()=>{const v=VIEWS[CU.view],L=CU.look;return[v[0]||idleOf(L),v[1]]};
const premFor=k=>(({top:PREM_TOP,hat:PREM_HAT,neck:PREM_NECK,extra:PREM_EXTRA,shoe:PREM_SHOE})[k]||[]).filter(x=>S.owned&&S.owned[x[0]]);
function renderCust(){if(!CU)return;const L=CU.look,h=t=>`<div class="opt-h">${t}</div>`;
 const[pp,fl]=cuPose(),pv=$('#cuImg');pv.src=sprURL(L,pp);pv.style.transform=fl?'scaleX(-1)':'';$('#cuAura').style.background=L.aura?`radial-gradient(closest-side,${L.aura}d0,${L.aura}00)`:'none';$('#cuName').textContent=S.nick||S.name||'Your look';
 const og=(key,arr,kind)=>`<div class="og">${arr.map(([v,n])=>`<button class="ob ${L[key]===v?'on':''}" data-c="set:${key}:${v}"><img alt="" src="${cropURL(Object.assign({},L,{[key]:v}),kind,64)}"><span>${n}</span></button>`).join('')}${premFor(key).map(([v,n,pr])=>{const own=S.owned&&S.owned[v];return `<button class="ob ${L[key]===v?'on':''}" data-c="set:${key}:${v}"><img alt="" src="${cropURL(Object.assign({},L,{[key]:v}),kind,64)}"><span>${n}<br><small style="color:${own?'#5be38a':'#ffc94a'}">Premium</small></span></button>`}).join('')}</div>`;
 const cr=k=>`<div class="sw">${PAL[k].map(c=>`<button class="${L[k]===c?'on':''}" data-c="col:${k}:${c}" style="background:${c||'#26365f'}" aria-label="${c||'None'}">${c?'':'&#8709;'}</button>`).join('')}${k==='aura'?'':`<label class="cust" title="Custom color"><input type="color" data-cc="${k}" value="${/^#[0-9a-f]{6}$/i.test(L[k])?L[k]:'#ffffff'}"></label>`}</div>`;
 const row=k=>h(PNAME[k])+cr(k);let b='';
 if(CU.tab==='styles'){const av=stylesAvail();b=h('Quick styles (edit anything afterwards)')+`<div class="og">${av.map(s=>`<button class="ob ${CU.style===s.id?'on':''}" data-c="style:${s.id}"><img alt="" src="${cropURL(s.look,'head',64)}"><span>${s.n}</span></button>`).join('')}</div>`+(S.bossWon?'':'<p class="muted" style="margin-top:.7rem">Beat Uncle Dags in the Rap Battle to unlock Dags Streetwear.</p>')}
 else if(CU.tab==='hair')b=h('Hairstyle')+og('hs',O_HAIR,'head')+row('hc');
 else if(CU.tab==='face')b=h('Eyes')+og('eyes',O_EYES,'head')+h('Mouth')+og('mouth',O_MOUTH,'head')+h('Facial hair')+og('fh',O_FH,'head')+row('skin')+h('Blush')+`<div class="og"><button class="ob ${L.blush?'on':''}" data-c="tog:blush"><span>${L.blush?'On':'Off'}</span></button></div>`;
 else if(CU.tab==='clothes')b=h('Top')+og('top',O_TOP,'body')+row('tc')+row('ta')+h('Bottoms')+og('bot',O_BOT,'body')+row('bc')+h('Shoes')+og('shoe',O_SHOE,'shoe')+row('sc');
 else if(CU.tab==='acc')b=h('Hat')+og('hat',O_HAT,'head')+(L.hat?row('hatc'):'')+h('Eyewear')+og('eyew',O_EYEW,'head')+h('Neckwear')+og('neck',O_NECK,'body')+(L.neck?row('nc'):'')+h('Carry')+og('extra',O_EXTRA,'body')+(L.extra?row('xc'):'');
 else b=['skin','hc','tc','ta','bc','sc','hatc','nc','xc','aura'].map(row).join('');
 if(S.favs.length)b+=h('Saved outfits')+`<div class="og">${S.favs.map((f,i)=>`<button class="ob" data-c="fav:${i}"><img alt="" src="${cropURL(f,'head',64)}"><span>#${i+1}</span></button>`).join('')}</div>`;
 $('#custOpts').innerHTML=`<div class="seg px-tabs">${TABS.map(([k,l])=>`<button class="${CU.tab===k?'on':''}" data-c="tab:${k}">${l}</button>`).join('')}</div>`+b;
 $('#custFoot').innerHTML=`<button class="px-sm" data-cf="reset">Reset</button><button class="px-sm" data-cf="rand">Random</button><button class="px-sm" data-cf="fav">&#9733; Slot</button>${CU.first?'':'<button class="px-sm" data-cf="cancel">Back</button>'}<button class="px-sm go" data-cf="save">Save Outfit</button>`}
function randLook(){const p=a=>a[Math.floor(Math.random()*a.length)],L=CU.look;Object.assign(L,{hs:p(O_HAIR)[0],hc:p(HAIRC),eyes:p(O_EYES)[0],mouth:p(O_MOUTH)[0],skin:p(SKINS),top:p(O_TOP)[0],tc:p(CLOTHC),ta:p(CLOTHC),bot:p(O_BOT)[0],bc:p(CLOTHC),shoe:p(O_SHOE)[0],sc:p(CLOTHC),hat:Math.random()<.4?p(O_HAT)[0]:'',hatc:p(CLOTHC),eyew:Math.random()<.3?p(O_EYEW)[0]:'',neck:Math.random()<.3?p(O_NECK)[0]:'',extra:Math.random()<.3?p(O_EXTRA)[0]:''});if(L.top==='dress'||L.top==='cheer')L.bot='skirt';CU.style=null}
function initCust(){$('#cust').innerHTML=`<div class="cu-prev"><div class="cu-title">Customize</div><div class="cu-ped"><i class="aura" id="cuAura"></i><img id="cuImg" alt="Your character"><i class="plate"></i></div>
  <div class="cu-rot"><button class="px-sm" data-c="rot:-1" aria-label="Rotate left">&#9664;</button><div class="cu-name" id="cuName"></div><button class="px-sm" data-c="rot:1" aria-label="Rotate right">&#9654;</button></div></div>
  <div class="panel"><div class="opts" id="custOpts"></div><div class="fb" id="custFoot"></div></div>`;
 $('#cust').addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.cc;if(!CU||!k)return;CU.look[k]=e.target.value;CU.style=null;const[pp,fl]=cuPose(),pv=$('#cuImg');pv.src=sprURL(CU.look,pp)});
 $('#cust').addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.cc&&CU)renderCust()});
 $('#cust').addEventListener('click',e=>{if(!CU)return;
 const cf=e.target.closest('[data-cf]');if(cf){SFX.ui();const k=cf.dataset.cf;
  if(k==='save'){S.look=resolveLook(CU.look);hmKey='';save();toast('Outfit saved!');const f=CU.first;CU=null;if(f)openEdit(true);else goHome()}
  else if(k==='cancel'){CU=null;goHome()}
  else if(k==='reset'){CU.look=Object.assign({},CU.orig);CU.style=null;renderCust()}
  else if(k==='fav'){if(S.favs.length>=4)S.favs.shift();S.favs.push(resolveLook(CU.look));save();toast('Saved to a slot');renderCust()}
  else if(k==='rand'){randLook();renderCust()}return}
 const b=e.target.closest('[data-c]');if(!b)return;SFX.ui();const[k,a,...r]=b.dataset.c.split(':'),v=r.join(':'),L=CU.look;
 if(k==='tab')CU.tab=a;else if(k==='rot')CU.view=(CU.view+(+a)+VIEWS.length)%VIEWS.length;
 else if(k==='set'){const pm=premOf(v);if(pm&&!(S.owned&&S.owned[v])){toast('Buy it in the Shop first');return}L[a]=v;CU.style=null;if(a==='top'&&(v==='dress'||v==='cheer'))L.bot='skirt'}
 else if(k==='col'){L[a]=v;CU.style=null}
 else if(k==='tog'){L[a]=L[a]?0:1}
 else if(k==='style'){const s=stylesAvail().find(x=>x.id===a);if(s){const au=L.aura;CU.look=Object.assign({},s.look,{aura:au});CU.style=a}}
 else if(k==='fav'){const f=S.favs[+a];if(f)CU.look=Object.assign({},f);CU.style=null}
 renderCust()})}

/* ============ catching arena engine: Catching Mode + Boss Mode ============
   The player stays in a fixed arena, moves left and right, jumps, and actively catches falling objects.
   (The lane runner in c_run.js is now used for the Jeepney Adventure journey only.) */
const ARENA={A:4.8};
const ATUT=[{need:'lane',title:'Move',txt:'Press Left or Right, or drag across the screen, to move in the arena.'},{need:'catch5',title:'Catch!',txt:'Catch EVERYTHING that falls: coins, gems, chests and tickets. If one hits the floor, you lose a life!'},{need:'jump',title:'Jump',txt:'Press Space (or Up) or tap Jump to lift your catch zone for high catches.'},{need:'pulse',title:'Boost',txt:'Press S (or Down) or tap Boost for a quick dash and a wide catch. It needs a short rest.'},{need:'time',title:'No bombs, no boxes',txt:'Bombs and boxes are the only things you must NOT catch. A red ring shows where they will land. Step away! The round buttons are your pet and your power-up.'}];
const BPOW={magnet:{n:'Magnet Burst',cost:40,col:'#ff4fa3',d:'Pulls nearby collectibles to you for 4 seconds.'},thunder:{n:'Thunder Catch',cost:60,col:'#ffe27a',d:'Instantly catches up to six nearby collectibles.'},gshield:{n:'Golden Shield',cost:50,col:'#ffc94a',d:'Blocks one obstacle hit.'},freeze:{n:'Time Freeze',cost:50,col:'#7fd6ff',d:'Slows everything that falls for 4 seconds.'},explode:{n:'Treasure Explosion',cost:70,col:'#ff7a3c',d:'Collects every collectible near you in one blast.'}};
const BTAUNT=['You call that a catch? My beats fall faster than that!','Hev gets the headlines. I get the bass!','Everybody compares us. Let me show you why they should not!','Keep up, rookie. The spotlight is mine!'];

function ringMesh(){const r=new THREE.Mesh(new THREE.RingGeometry(.5,.9,24),new THREE.MeshBasicMaterial({color:0xff3a4a,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));r.rotation.x=-Math.PI/2;return r}
function pxIcon(n,sz,y=0){const g=new THREE.Group(),sp=iconSprite(n,sz);sp.position.y=y;g.add(sp);return g}
function mkFall(type){if(type==='crate'){const g=pxIcon('crate',1.6,.8);g.userData={h:1.5,hw:.8,ring:ringMesh()};return g}
 if(type!=='crate'){const g=pxIcon('bomb',1.5,.5);g.userData={hw:.9,h:1,ring:ringMesh()};return g}
 const g=new THREE.Group();mesh(new THREE.BoxGeometry(1.7,1,.35),new THREE.MeshStandardMaterial({map:TX.banner,roughness:.8}),0,.5,0,g,1.04);g.userData={hw:.9,h:1,ring:ringMesh()};return g}
function mkGround(type){if(type==='wave'){const g=pxIcon((G&&G.bcfg&&G.bcfg.icons&&G.bcfg.icons.wave)||'wave',1.5,.6);g.userData={hw:.7,h:.95,spin:0};return g}const g0=pxIcon('barrel',1.4,.6);g0.userData={hw:.6,h:.95,spin:0};return g0;const g=new THREE.Group();
 if(type==='wave'){const m=mesh(new THREE.TorusGeometry(.5,.12,8,24),M('#7fe8ff',{emissive:'#37d0ff',emissiveIntensity:1.2}),0,.5,0,g);m.scale.set(1,1,1);const m2=mesh(new THREE.TorusGeometry(.8,.08,8,24),M('#ff9fd6',{emissive:'#ff4fa3',emissiveIntensity:1.2}),0,.55,0,g);g.add(glowSprite('#7fe8ff',3,.6));g.userData={hw:.7,h:.95,spin:0}}
 else{const b=mesh(new THREE.CylinderGeometry(.55,.55,.9,14),M('#e8762a'),0,.5,0,g);b.rotation.z=Math.PI/2;b.rotation.x=0;for(const y of[-.25,.25]){const r=mesh(new THREE.TorusGeometry(.56,.05,6,16),M('#3a2a1a'),0,.5,y,g)}g.userData={hw:.6,h:.95,spin:1}}
 return g}
const PXI={coin:['coin',.95],gold:['gold',1.35],star:['star',1.2],gem:['gem',1.1],chest:['chest',1.4],mystery:['mystery',1.2],orb:['orb',1.15],frag:['frag',1.1],ticket:['ticket',1.3],note:['note',1.2],fake:['fake',1.2],mic:['mic',1.4]};
function mkArenaItem(type){let pi=PXI[type];const bi=G&&G.bcfg&&G.bcfg.icons&&G.bcfg.icons[type];if(bi)pi=[bi,type==='mic'?1.5:1.25];if(pi){const g=pxIcon(pi[0],pi[1]);g.userData={spin:false,bob:true};return g}
 if(type==='mic'){const g=new THREE.Group();mesh(new THREE.CylinderGeometry(.08,.1,.7,8),M('#c6cfdc',{metalness:.7,roughness:.3}),0,-.1,0,g);mesh(new THREE.SphereGeometry(.28,14,10),M('#ffffff',{emissive:'#5ee0ff',emissiveIntensity:1}),0,.35,0,g);g.add(glowSprite('#5ee0ff',2.6,.75));g.userData.spin=true;return g}
 if(type==='fake'){const g=mkItem('note');g.traverse(o=>{if(o.material&&o.material.color&&!o.isSprite){o.material=o.material.clone();o.material.color.set('#ff6a4a');if(o.material.emissive)o.material.emissive.set('#c0200a')}});g.userData.spin=false;return g}
 return mkItem(type)}

function arenaCam(){const cam=RS.cam,a=innerWidth/innerHeight;cam.fov=50;const t=Math.tan(cam.fov*Math.PI/360),A=ARENA.A+.9;const d=Math.max(13,A/(t*a));cam.aspect=a;cam.updateProjectionMatrix();RS.d=d;RS.vis=t*a*d;cam.position.set(0,3.2+(d-13)*.1,d);cam.lookAt(0,4+(d-13)*.12,0)}

function buildBossStage(sc){sc.background=new THREE.Color(0x0b0620);sc.fog=new THREE.Fog(0x0b0620,26,80);lights(sc,'#8a7bff','#150c33',.9,'#ffd0ff',.8,[3,12,10]);
 mesh(new THREE.BoxGeometry(26,.5,16),M('#241a4a'),0,-.25,-2,sc);for(const s of[-1,1])mesh(new THREE.BoxGeometry(.2,.1,16),M('#ff4fa3',{emissive:'#ff4fa3',emissiveIntensity:1.2}),s*9.8,.05,-2,sc);mesh(new THREE.BoxGeometry(19.6,.1,.2),M('#5ee0ff',{emissive:'#5ee0ff',emissiveIntensity:1.2}),0,.05,5.9,sc);
 const cv=document.createElement('canvas');cv.width=1024;cv.height=512;const g=cv.getContext('2d');const gr=g.createLinearGradient(0,0,1024,512);gr.addColorStop(0,'#1a0f3a');gr.addColorStop(1,'#3a1060');g.fillStyle=gr;g.fillRect(0,0,1024,512);
 const tags=[['DAGS','#ff7a1a',140,260,120],['BEAT','#5ee0ff',620,180,90],['DTQ','#ff4fa3',700,390,110],['MANILA','#ffe27a',80,430,70],['1990','#b58cff',470,330,80]];g.textBaseline='middle';for(const[t,c,x,y,s]of tags){g.save();g.translate(x,y);g.rotate(-.08);g.font='900 '+s+'px "Lilita One",Arial Black,sans-serif';g.lineWidth=10;g.strokeStyle='#0a0620';g.strokeText(t,0,0);g.fillStyle=c;g.fillText(t,0,0);g.restore()}
 const wall=new THREE.Mesh(new THREE.PlaneGeometry(32,16),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}));wall.position.set(0,8,-10);sc.add(wall);
 const neon=(txt,col,x,y)=>{const c=document.createElement('canvas');c.width=512;c.height=128;const q=c.getContext('2d');q.font='900 62px "Lilita One",Arial Black,sans-serif';q.textAlign='center';q.textBaseline='middle';q.shadowColor=col;q.shadowBlur=24;q.fillStyle='#fff';q.fillText(txt,256,66);const m=new THREE.Mesh(new THREE.PlaneGeometry(7.5,1.9),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));m.position.set(x,y,-9.8);sc.add(m)};neon('UNDERGROUND','#ff4fa3',-8.5,12.4);neon('RAP STAGE','#5ee0ff',8.5,12.4);
 const spk=[];for(const s of[-1,1])for(let k=0;k<2;k++){const sp=new THREE.Group();mesh(new THREE.BoxGeometry(3,3.6,2.2),M('#14141c'),0,1.8,0,sp,1.02);for(const y of[1.1,2.7]){mesh(new THREE.CylinderGeometry(.85,.85,.2,18),M('#2a2a38',{emissive:'#7b4dff',emissiveIntensity:.7}),0,y,1.15,sp).rotation.x=Math.PI/2}sp.position.set(s*(8+k*2.2),k*3.7,-4);sc.add(sp);spk.push(sp)}
 mesh(new THREE.BoxGeometry(9,.6,3),M('#2a1f55'),0,5.1,-5.5,sc);mesh(new THREE.BoxGeometry(9.1,.1,3.1),M('#ff4fa3',{emissive:'#ff4fa3',emissiveIntensity:.9}),0,5.45,-5.5,sc);
 const beams=[];for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.ConeGeometry(1.5,16,16,1,true),new THREE.MeshBasicMaterial({color:[0xff4fa3,0x5ee0ff,0xffc94a,0x7b4dff,0xffffff,0xff7a1a][i],transparent:true,opacity:.14,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));b.position.set(-9+i*3.6,13,-6);b.userData.i=i;sc.add(b);beams.push(b)}
 const crowd=[];for(let i=0;i<22;i++){crowd.push(mkFan(-10+i*.95,0,-8,i,sc,1.5))}
 return{spk,beams,crowd,update(t){beams.forEach(b=>{b.rotation.z=Math.sin(t*1.3+b.userData.i)*.5;b.rotation.x=Math.cos(t*1.1+b.userData.i)*.2});crowd.forEach((c,i)=>fanAnim(c,t,i));spk.forEach((s,i)=>s.scale.setScalar(1+Math.max(0,Math.sin(t*7.5+i))*.03))}}}

function startArena(kind,distId){
 closeSheet(true);stopAll();hudReset();const boss=kind==='boss';TUT=ATUT;
 const pal=DIST.find(d=>d.id===distId)||DIST[0];const sc=new THREE.Scene(),cam=cams.run||mkCam('run',50);let env=null,stage=null;
 const bc=boss?bossOf(distId):null;lights(sc,'#a9b6ff','#3a2a55',1.1,'#ffe3b8',1);if(boss){env=buildPixelWorld(sc,bc.scene);stage=bossPlatform(sc,bc)}else env=buildPixelWorld(sc,distId)
 const pl=buildChibi(resolveLook(S.look||defaultLook()));pl.g.scale.setScalar(1.55);sc.add(pl.g);
 const ps=petStats();let pet=null;if(ps){pet=buildPet(ps.d,petStage(ps.p.lvl,S.evoView[ps.d.id]!==false));pet.g.scale.setScalar(1.25);sc.add(pet.g)}
 const cl=resolveLook(Object.assign({},S.look||{},{hc:'#5ee0ff',tc:'#5ee0ff',skin:'#9ff4ff',aura:'#5ee0ff'}));
 const clones=[];for(let i=0;i<2;i++){const c=buildChibi(cl);c.g.scale.setScalar(1.55);c.g.visible=false;sc.add(c.g);clones.push(c)}
 const shield=new THREE.Mesh(new THREE.SphereGeometry(1.7,16,12),new THREE.MeshBasicMaterial({color:0xff9fd6,transparent:true,opacity:.28,depthWrite:false}));shield.visible=false;sc.add(shield);
 const ring=new THREE.Mesh(new THREE.RingGeometry(.9,1,32),new THREE.MeshBasicMaterial({color:0xffe27a,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));sc.add(ring);
 let bd=null;if(boss){if(bc.mon){bd=buildMon(bc.mon,bc.pal,bc.H);bd.g.position.set(0,3.95,-5.5)}else{bd=buildChibi(BOSS_LOOK);bd.g.scale.setScalar(2.2);bd.g.position.set(0,4.45,-5.5)}sc.add(bd.g)}
 SCN.run=RS={sc,cam,env,stage,pl,pet,clones,shield,ring,boss:bd,pal,parts:[],d:13,vis:10};arenaCam();
 const rematch=boss&&activeRematch&&activeRematch.id===distId?activeRematch:null;activeRematch=null;
 let CN;const hearts=baseLives()+(upv('surv')>=3?1:0)+(upv('surv')>=5?1:0)+(hasT('heart')?1:0)+(CN=takeCons()).heart;
 G={arena:1,kind,dist:distId,t:0,pause:false,over:false,speed:0,distM:0,x:0,vx:0,y:0,vy:0,slide:0,drag:null,lives:hearts,maxLives:hearts,inv:CN.shield?5:0,cdbl:CN.dbl,rev:CN.revive,score:0,coins:0,combo:0,best:0,comboT:0,round:1,rt:0,
  items:[],obs:[],zones:[],later:[],spawnT:.8,gT:7,fx:{gravity:CN.magnet?12:0},catches:0,golds:0,chests:0,frags:0,tix:0,jumps:0,slides:0,petUses:0,powUses:0,hits:0,petCd:0,pow:null,powCharges:0,mochi:0,gshield:0,pulse:0,pulseCd:0,
  tut:S.tutorialDone||boss?null:{step:0,t:0,c:0},shake:0,bossP:0,bossPh:0,meter:0,notes:0,rematch,rematchScale:rematch?1.15+Math.min(5,(S.rematchWins[distId]||0))*.08:1,bs:{t:0,cd:3,micT:2.5,tauntT:12}};
 const pw=POWERS.find(p=>p.id===S.power);if(!boss){if(pw&&(S.inv.power[pw.id]||0)>0){S.inv.power[pw.id]--;G.powCharges=1;G.pow=pw}else G.pow=pw||POWERS[4]}else G.pow=pw||POWERS[4];
 G.bcfg=bc;buildRunHud();arenaHudBuild();showScreen('run');R.setClearColor(0x000000);musicEnsure();save();
 if(G.tut)showTut();
 G.bcfg=bc;banner(boss?bc.ph[0]:'GO!');SFX.round();setMode('run');
}

/* ---- HUD pieces that only the arena uses ---- */
function arenaHudBuild(){const hud=$('#run .hud');let t=$('#tbtns');if(!t){t=mk('div','tbtns');t.id='tbtns';t.innerHTML='<button class="tb" id="tbL" aria-label="Move left">&#9664;</button><button class="tb" id="tbR" aria-label="Move right">&#9654;</button><span style="flex:1"></span><button class="tb" id="tbC" aria-label="Boost">BOOST</button><button class="tb" id="tbJ" aria-label="Jump">JUMP</button>';hud.appendChild(t);
  const hold=(id,k)=>{const b=$('#'+id);const on=e=>{e.preventDefault();e.stopPropagation();keysDown[k]=true};const off=()=>{keysDown[k]=false};b.addEventListener('pointerdown',on);['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,off))};hold('tbL','left');hold('tbR','right');
  $('#tbJ').addEventListener('pointerdown',e=>{e.stopPropagation();jump()});$('#tbC').addEventListener('pointerdown',e=>{e.stopPropagation();catchPulse()})}
 let bp=$('#bpw');if(!bp){bp=mk('div','bpw');bp.id='bpw';bp.innerHTML='<div class="bm"><i id="bmFill"></i></div><div class="bbs"><button class="abtn bp" id="bpA"></button><button class="abtn bp" id="bpB"></button></div>';hud.appendChild(bp);$('#bpA').addEventListener('click',()=>bossPower(0));$('#bpB').addEventListener('click',()=>bossPower(1))}
 const boss=G.kind==='boss';bp.hidden=!boss;t.hidden=false;$('#btnPow').style.display=boss?'none':'grid';
 if(boss){const bw=S.bpow||['magnet','thunder'];[['#bpA',bw[0]],['#bpB',bw[1]]].forEach(([s,k])=>{const b=$(s);b.innerHTML=`<span>${BPOW[k].n.split(' ').join('\n')}</span>`;b.style.setProperty('--c',BPOW[k].col)})}
 $('#bossName').textContent=G.bcfg?G.bcfg.name+' · '+G.bcfg.title:'';const kk=$('#keys');if(kk)kk.textContent=boss?'A / D or arrows move | Space jump | S boost | 1 / 2 boss powers | Q pet | P pause':'A / D or arrows move | Space jump | S boost | Q pet | E power-up | P pause'}
(function(){const st=document.createElement('style');st.textContent='.tbtns{position:absolute;left:max(14px,env(safe-area-inset-left,0px));right:max(14px,env(safe-area-inset-right,0px));bottom:calc(max(14px,env(safe-area-inset-bottom,0px)) + 92px);display:none;gap:.5rem;pointer-events:none}.tbtns>*{pointer-events:auto}.tbtns .tb{min-width:3.6rem;height:3.1rem;border-radius:14px;background:rgba(13,22,48,.78);border:2px solid var(--line);color:#fff;font-family:var(--display);font-size:1rem;padding:0 .7rem;touch-action:none}.tbtns .tb:active{background:var(--gold);color:#3a2300}@media(pointer:coarse){.tbtns{display:flex}}.bpw[hidden]{display:none!important}.bpw{position:absolute;right:max(14px,env(safe-area-inset-right,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:.45rem;align-items:flex-end;pointer-events:none}.bpw>*{pointer-events:auto}.bpw .bm{width:11rem;height:.8rem;border-radius:9px;background:rgba(255,255,255,.18);overflow:hidden;border:1.5px solid #fff6}.bpw .bm i{display:block;height:100%;width:0;background:linear-gradient(90deg,#5ee0ff,#ff4fa3,#ffc94a);transition:width .2s}.bpw .bbs{display:flex;gap:.6rem}.abtn.bp{width:4.6rem;height:4.6rem;font-size:.62rem;line-height:1.05;white-space:pre-line;text-align:center;background:radial-gradient(circle at 35% 30%,#fff3,var(--c,#7b4dff));border:3px solid #fff;color:#10162e;font-family:var(--display)}.abtn.bp[disabled]{filter:grayscale(.9) brightness(.55)}.abtn.bp.ready{animation:pulse 1s infinite}';document.head.appendChild(st)})();

/* ---- actions ---- */
function catchPulse(){if(!G||!G.arena||G.over||G.pause||G.pulseCd>0){if(G&&G.pulseCd>0)SFX.no();return}G.boostT=.45;G.pulse=.28;G.pulseCd=1.1;SFX.slide();tutStep('pulse');RS.ring.material.opacity=.9;RS.ring.userData.t=0}
function bossPower(i){if(!G||!G.arena||G.kind!=='boss'||G.over||G.pause)return;const k=(S.bpow||['magnet','thunder'])[i],p=BPOW[k];if(G.meter<p.cost){SFX.no();return}G.meter-=p.cost;SFX.power();banner(p.n.toUpperCase());burst(new THREE.Vector3(G.x,1.6,0),p.col,18,7,5);
 if(k==='magnet')G.fx.bmag=4;else if(k==='freeze')G.fx.bfreeze=4;else if(k==='gshield')G.gshield=1;
 else if(k==='thunder'){const L=G.items.filter(o=>!o.dead&&o.type!=='fake'&&Math.hypot(o.x-G.x,o.y-(G.y+1.3))<6).sort((a,b)=>a.y-b.y).slice(0,6);L.forEach((o,j)=>setTimeout(()=>G&&!G.over&&acatch(o,true),70*j))}
 else if(k==='explode'){G.items.filter(o=>!o.dead&&o.type!=='fake'&&Math.hypot(o.x-G.x,o.y-(G.y+1.3))<7).forEach((o,j)=>setTimeout(()=>G&&!G.over&&acatch(o,true),40*j));for(const o of G.obs)if(!o.dead&&Math.abs(o.x-G.x)<4)killObs(o)}
 G.dirty=1}
function starRain(){for(let i=0;i<14;i++)G.later.push({t:i*.12,f:()=>spawnItem('star',rnd(-ARENA.A,ARENA.A),{val:4,vy:6})})}
function arenaPrism(){for(const o of G.obs){if(!o.dead){burst(new THREE.Vector3(o.x,Math.max(1,o.y),0),'#ff9fd6',10);const x=o.x,y=Math.max(2,o.y);killObs(o);for(let k=0;k<3;k++)spawnItem('gem',x+(k-1)*.9,{y:y+k*.6})}}banner('PRISM BURST!')}
function killObs(o){o.dead=true;RS.sc.remove(o.m);if(o.ring)RS.sc.remove(o.ring)}

/* ---- spawning ---- */
/* Round speed tiers: R1-2 easy, R3-4 medium, R5-6 hard, then a gentle climb */
function roundF(r){const T=[.8,.9,1,1.12,1.25,1.4];return r<=6?T[Math.max(0,r-1)]:Math.min(2,1.4+(r-6)*.06)}
function spawnItem(type,x,o={}){const m=mkArenaItem(type);const y=o.y!=null?o.y:11.5;m.position.set(x,y,0);RS.sc.add(m);const spd=o.vy||(G.kind==='boss'?(4.3+Math.min(6,(G.round-1)*.55)):4.3*roundF(G.round))*rnd(.85,1.15);const it={type,m,x,y,vy:spd,val:o.val,free:!!o.free,dead:false};G.items.push(it);return it}
function spawnFall(type){const m=mkFall(type),x=rnd(-ARENA.A,ARENA.A);const ud=m.userData;m.position.set(x,12,0);RS.sc.add(m);const rg=ud.ring;rg.position.set(x,.06,0);RS.sc.add(rg);const o={kind:'fall',m,x,y:12,vy:(G.kind==='boss'?(5.2+Math.min(5,(G.round-1)*.5)):5.2*roundF(G.round))*rnd(.9,1.1),hw:ud.hw,h:ud.h,ring:rg,dead:false};G.obs.push(o);return o}
function spawnGround(type,dir){const m=mkGround(type),ud=m.userData;const x=-dir*(ARENA.A+2.2);m.position.set(x,0,0);RS.sc.add(m);const o={kind:'ground',type,m,x,y:0,vx:dir*(type==='wave'?7.5:5.2+G.round*.3),hw:ud.hw,h:ud.h,spin:ud.spin,dead:false};G.obs.push(o);return o}
function collectibleType(){const r=Math.random(),lucky=1+upv('lucky')*.15+(hasT('shoe')?.15:0);
 if(G.kind==='boss')return r<.72?'note':r<.9?'coin':'gold';
 if(r<.56)return 'coin';if(r<.69)return 'gold';if(r<.80)return 'coin';if(r<.85)return 'chest';if(r<.90*Math.min(1.1,lucky))return 'mystery';
 if(r<.93&&G.powCharges<1&&!G.fx.powActive)return 'orb';if(r<.975)return 'ticket';return 'coin'}
function arenaSpawn(dt){
 if(G.over)return;G.spawnT-=dt;const T=G.tut;
 if(G.spawnT<=0){const base=Math.max(.3,.78-(G.round-1)*.045);G.spawnT=base*rnd(.7,1.25)*(G.fx.portal>0?.5:1);
  const r=Math.random();let obsP=(T&&T.step<2)?0:(G.kind==='boss'?.1:Math.min(.3,.13+G.round*.02));
  if(r<obsP)spawnFall(Math.random()<.55?'crate':'bomb');else{const t=G.fx.portal>0?'gold':collectibleType();const it=spawnItem(t,rnd(-ARENA.A,ARENA.A));if(G.fx.portal>0)it.val=5}}
 }

/* ---- catching ---- */
function missItem(it){if(G.over)return;G.lives=Math.max(0,G.lives-1);G.misses=(G.misses||0)+1;G.combo=0;G.shake=.3;SFX.hit();buzz(60);banner('MISSED! -1 LIFE');burst(new THREE.Vector3(it.x,.4,0),'#ff5d73',6);G.dirty=1;if(G.lives<=0&&G.rev){G.rev=0;G.lives=Math.min(2,G.maxLives);G.inv=3;banner('SECOND CHANCE!')}if(G.lives<=0)endRun('lose')}
function acatch(it,silent){if(it.dead)return;it.dead=true;RS.sc.remove(it.m);const p=new THREE.Vector3(it.x,it.y,0);
 if(it.type==='fake'){G.combo=0;burst(p,'#ff6a4a',10);banner('FAKE BEAT!');hitPlayer(null);return}
 let t=it.type,val=0,col='#ffd24a';if(t==='coin'&&G.fx.midas>0)t='gold';
 const cm=(G.cdbl?2:1)*(1+upv('coin')*.12+(hasT('purse')?.15:0))*(G.fx.jackpot>0&&(t==='coin'||t==='gold')?3:1);
 if(t==='coin'){val=1;SFX.coin(G.combo)}else if(t==='gold'||t==='star'||G.fx.portal>0){val=it.val||5;G.golds++;track('gold',1);SFX.gold()}
 else if(t==='gem'){val=10;col='#5ee0ff';SFX.gem()}else if(t==='chest'){val=25;G.chests++;track('chest',1);SFX.gem();banner('TREASURE!')}
 else if(t==='note'){val=1;col='#b58cff';SFX.coin(G.combo);bossProg(1.3)}
 else if(t==='mic'){val=3;col='#5ee0ff';SFX.gem();bossProg(7);banner(G.bcfg.crack)}
 else if(t==='mystery'){const r=Math.random();if(r<.5){val=rint(15,40);banner('+'+Math.round(val*cm)+' COINS')}else if(r<.75){const k=pick(POWERS.filter(x=>x.dur>0));setFx(k,true);banner(k.name.toUpperCase())}else{G.tix++;banner('LUCKY TICKET!')}SFX.power();col='#b58cff'}
 else if(t==='orb'){if(G.powCharges<1){G.powCharges=1;banner('POWER READY!')}else val=5;SFX.power();col='#9ff'}
 else if(t==='frag'){G.frags++;S.inv.fragments++;track('frag',1);banner('MAP FRAGMENT!');SFX.win();col='#5ef0d0'}
 else if(t==='ticket'){G.tix++;banner('LUCKY TICKET!');SFX.power();col='#ff7a8a'}
 if(G.fx.yuki>0&&(t==='gem'||t==='chest'||t==='gold')&&!silent){for(let k=0;k<3;k++)spawnItem('coin',it.x+(k-1)*.8,{y:it.y+1+k*.5,vy:5,free:1});burst(p,'#7fd6ff',8)}
 if(val>0&&!silent&&G.fx.yuki>0&&t==='coin')val+=2;
 const v=Math.round(val*cm);G.coins+=v;G.catches++;G.combo++;G.comboT=3;G.best=Math.max(G.best,G.combo);track('catch',1);track('combo',G.combo);
 const mult=Math.min(5,1+Math.floor(G.combo/10));addScore(v*10*mult+5);S.stats.catches++;
 if(G.kind==='boss')G.meter=Math.min(100,G.meter+(t==='mic'?10:t==='gold'?3:1.4)+(G.combo>10?.8:0));
 if(G.combo>0&&G.combo%10===0){banner('COMBO x'+G.combo+'!');SFX.round();buzz(30)}
 burst(p,col,t==='gold'||t==='chest'||t==='mic'?12:6);RS.pl&&(G.cheer=.25);
 if(!silent){if(G.fx.chain>0){const L=G.items.filter(o=>!o.dead&&o!==it&&o.type!=='fake').sort((a,b)=>Math.hypot(a.x-it.x,a.y-it.y)-Math.hypot(b.x-it.x,b.y-it.y)).slice(0,3);L.forEach((o,j)=>setTimeout(()=>G&&!G.over&&acatch(o,true),60*(j+1)))}
  if(G.fx.vexi>0){const L=G.items.filter(o=>!o.dead&&o!==it&&o.type!=='fake'&&Math.hypot(o.x-it.x,o.y-it.y)<4.5).slice(0,5);L.forEach((o,j)=>setTimeout(()=>G&&!G.over&&acatch(o,true),50*(j+1)))}}
 tutStep('catch');G.dirty=1}
function bossProg(n){if(G.kind!=='boss'||G.over)return;G.bossP=Math.min(100,G.bossP+n);const ph=G.bossP<33?0:G.bossP<66?1:2;if(ph!==G.bossPh){G.bossPh=ph;const bc=G.bcfg;banner(bc.ph[ph]);SFX.round();G.bs.cd=1.2}if(G.bossP>=100){banner(G.bcfg.broken);endRun('win')}}

/* ---- boss attacks ---- */
function bossAttack(){const ph=G.bossPh,atk=pick(ph===0?['bass','bass','fake']:ph===1?['bass','fake','spot']:['bass','fake','spot','spot']),rematch=G.rematch&&G.rematch.id===G.dist?G.dist:null;
 if(atk==='bass'){banner(G.bcfg.atk.bass[0]);const dir=Math.random()<.5?1:-1;G.later.push({t:.9,f:()=>{if(G.over)return;spawnGround('wave',dir);if(ph>=2||rematch==='balete'||rematch==='kapre')G.later.push({t:rematch==='kapre'?.55:.9,f:()=>{if(G.over)return;spawnGround('wave',-dir);if(rematch==='kapre')G.later.push({t:.55,f:()=>!G.over&&spawnGround('wave',dir)})}})}})}
 else if(atk==='fake'){banner(G.bcfg.atk.fake[0]);if(rematch==='mansion'){const n=7,bad=new Set([rint(0,n-1),rint(0,n-1)]);for(let i=0;i<n;i++){const x=-ARENA.A+i*(ARENA.A*2/(n-1));spawnItem(bad.has(i)?'fake':'note',x,{y:11.2+i*.18,vy:5.8})}}else{const x0=rnd(-ARENA.A,ARENA.A-6),bad=new Set([rint(0,4),rint(0,4)]);for(let i=0;i<5;i++)spawnItem(bad.has(i)?'fake':'note',clamp(x0+i*1.9,-ARENA.A,ARENA.A),{y:11.5+i*.15,vy:5.4})}}
 else{banner(G.bcfg.atk.spot[0]);const n=rematch==='biringan'?4:ph>=2?3:2;for(let i=0;i<n;i++){const x=rematch==='biringan'?-ARENA.A+(i+1)*(ARENA.A*2/(n+1)):rnd(-ARENA.A,ARENA.A);const m=new THREE.Mesh(new THREE.CylinderGeometry(.95,.95,13,20,1,true),new THREE.MeshBasicMaterial({color:G.bcfg.zone,transparent:true,opacity:.0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.set(x,6.5,0);RS.sc.add(m);G.zones.push({x,m,t:0,warn:rematch==='biringan'?.95:1.4,hit:.55,done:false})}}}
function bossUpdate(dt){const B=G.bs;if(G.over)return;B.t+=dt;B.cd-=dt;if(B.cd<=0){bossAttack();B.cd=(rnd(3.6,5.4)-G.bossPh*.6)/G.bcfg.rate/(G.rematchScale||1)}
 B.micT-=dt;if(B.micT<=0){spawnItem('mic',rnd(-ARENA.A,ARENA.A),{vy:4.4});B.micT=rnd(3.2,4.6)}
 B.tauntT-=dt;if(B.tauntT<=0)B.tauntT=rnd(13,18)
 for(const z of G.zones){z.t+=dt;const op=z.t<z.warn?.12+.1*Math.sin(z.t*14):z.t<z.warn+z.hit?.75:0;z.m.material.opacity=op;if(z.t>=z.warn)z.m.material.color.set(0xfff0a0);
  if(z.t>=z.warn&&!z.done&&Math.abs(G.x-z.x)<1.05){z.done=true;hitPlayer(null)}if(z.t>=z.warn+z.hit){RS.sc.remove(z.m);z.dead=true}}
 G.zones=G.zones.filter(z=>!z.dead)}

/* ---- update ---- */
function arenaUpdate(dt){const rs=RS;
 if(G.pause){render(rs.sc,rs.cam);return}
 G.t+=dt;if(G.tut){const T=G.tut;T.t+=dt;if(ATUT[T.step]&&ATUT[T.step].need==='time'&&T.t>8)endTut()}
 if(bubbleT>0){bubbleT-=dt;if(bubbleT<=0)$('#bubble').hidden=true}
 for(const k of['rewind','jackpot','clone','gravity','chain','portal','midas','choco','yuki','mochi','vexi','zumi','powActive','bmag','bfreeze'])if(G.fx[k]>0){G.fx[k]-=dt;if(G.fx[k]<=0){G.fx[k]=0;if(k==='mochi')G.mochi=0;if(k==='portal')banner('PORTAL CLOSED')}}
 if(G.petCd>0)G.petCd-=dt;if(G.inv>0)G.inv-=dt;if(G.comboT>0){G.comboT-=dt;if(G.comboT<=0)G.combo=0}
 if(G.pulse>0)G.pulse-=dt;if(G.pulseCd>0)G.pulseCd-=dt;if(G.cheer>0)G.cheer-=dt;
 for(const l of G.later)l.t-=dt;const due=G.later.filter(l=>l.t<=0);G.later=G.later.filter(l=>l.t>0);due.forEach(l=>l.f());
 // round progression
 if(G.kind==='catch'&&!G.over){G.rt+=dt;if(G.rt>=28){G.rt=0;G.round++;banner('ROUND '+G.round);SFX.round();track('round',G.round);S.stats.bestRound=Math.max(S.stats.bestRound,G.round);G.dirty=1}}
 const tf=(G.fx.rewind>0?.5:1)*(G.fx.bfreeze>0?.2:1);const A=ARENA.A;
 // movement
 const dir=(keysDown.right?1:0)-(keysDown.left?1:0),sp=8.6*(G.kind==='boss'?1:(.9+.1*roundF(G.round)))*(1+upv('move')*.12)*(S.st.sens||1)*(G.boostT>0?1.8:1);if(G.boostT>0)G.boostT-=dt;const ox=G.x;
 if(G.drag!=null)G.x+=(G.drag-G.x)*Math.min(1,dt*14);else{G.vx=lerp(G.vx,dir*sp,Math.min(1,dt*11));G.x+=G.vx*dt}
 G.x=clamp(G.x,-A,A);const mv=(G.x-ox)/Math.max(dt,.001);if(Math.abs(mv)>1.5)tutStep('lane');
 if(G.y>0||G.vy>0){G.vy-=28*dt;G.y+=G.vy*dt;if(G.y<=0){G.y=0;G.vy=0}}
 arenaSpawn(dt*tf);if(G.kind==='boss')bossUpdate(dt);
 // catch zone
 const zw=.95+upv('catch')*.1+(G.pulse>0?1.5:0)+(G.fx.choco>0?2.4:0);const centers=[G.x];if(G.fx.clone>0){centers.push(clamp(G.x-3.4,-A,A),clamp(G.x+3.4,-A,A))}
 for(const it of G.items){if(it.dead)continue;let spd=it.vy*tf;
  if(G.fx.gravity>0){spd*=.6;it.x=lerp(it.x,G.x,Math.min(1,dt*1.8))}
  if(G.fx.bmag>0&&it.type!=='fake'){const dx=G.x-it.x,dy=(G.y+1.3)-it.y,dd=Math.hypot(dx,dy)||1;if(dd<5.8){it.x+=dx/dd*dt*10;it.y+=dy/dd*dt*7}}
  if(upv('catch')>0&&Math.abs(it.x-G.x)<2.6&&it.y<4)it.x=lerp(it.x,G.x,Math.min(1,dt*upv('catch')*.9));
  it.y-=spd*dt;it.m.position.set(it.x,it.y,0);if(it.m.userData.spin)it.m.rotation.y+=dt*3.2;if(it.m.userData.bob)it.m.position.y+=Math.sin(G.t*3+it.x)*.08;
  let got=false;for(const cx of centers){if(Math.abs(it.x-cx)<zw&&it.y<G.y+2.9&&it.y>G.y+.05){got=true;break}}
  if(got&&!G.over){acatch(it);continue}
  if(it.y<.12){it.dead=true;rs.sc.remove(it.m);if(it.type!=='fake')burst(new THREE.Vector3(it.x,.2,0),'#c6cfdc',2,2,1);if(G.kind!=='boss'&&it.type!=='fake'&&!it.free&&!G.tut)missItem(it)}}
 G.items=G.items.filter(i=>!i.dead);
 // obstacles
 for(const o of G.obs){if(o.dead)continue;
  if(G.fx.choco>0&&Math.abs(o.x-G.x)<4.2&&(o.kind==='ground'||o.y<6)){burst(new THREE.Vector3(o.x,1,0),'#ff7a2a',14,6,4);killObs(o);spawnItem('coin',o.x,{y:o.y+1,vy:5});continue}
  if(o.kind==='fall'){o.y-=o.vy*tf*dt;o.m.position.set(o.x,Math.max(0,o.y),0);o.ring.scale.setScalar(1+Math.sin(G.t*8)*.08);o.m.rotation.y=o.y>.1?G.t*2.5:0;
   if(!G.over&&!o.hit&&Math.abs(o.x-G.x)<o.hw+.55&&o.y<G.y+2.3&&o.y+o.h>G.y+.1){o.hit=true;hitPlayer(o);killObs(o);burst(new THREE.Vector3(o.x,1,0),'#ffb347',10);continue}
   if(o.y<=0){burst(new THREE.Vector3(o.x,.3,0),'#d9b882',8,4,2);G.shake=Math.max(G.shake,.18);killObs(o)}}
  else{o.x+=o.vx*tf*dt;o.m.position.set(o.x,0,0);if(o.spin)o.m.rotation.z-=o.vx*dt*.8;else o.m.rotation.y+=dt*3;
   if(!G.over&&!o.hit&&Math.abs(o.x-G.x)<o.hw+.45&&G.y<o.h-.05){o.hit=true;hitPlayer(o)}
   if(Math.abs(o.x)>A+3.5)killObs(o)}}
 G.obs=G.obs.filter(o=>!o.dead);
 // visuals
 const pg=rs.pl.g;pg.position.set(G.x,G.y,0);const tr=Math.abs(mv)>1.5?Math.sign(mv)*.7:0;pg.rotation.y=lerp(pg.rotation.y,tr,.2);pg.rotation.z=lerp(pg.rotation.z,-(G.vx||0)*.012,.2);
 pose(rs.pl,G.t,G.inv>1?'hit':G.pulse>0||G.cheer>0?'cheer':G.y>.05?'jump':Math.abs(mv)>1.5?'run':'idle',1);
 pg.visible=G.inv>0&&G.fx.portal<=0&&!G.fx.choco?Math.floor(G.t*14)%2===0:true;
 if(rs.ring){const r=rs.ring;if(r.material.opacity>0){r.userData.t=(r.userData.t||0)+dt;const s=1+r.userData.t*8;r.scale.setScalar(s);r.position.set(G.x,G.y+1.4,0);r.material.opacity=Math.max(0,.9-r.userData.t*3.2)}}
 if(rs.pet){const side=G.x>A-1.2?-1.7:1.7;rs.pet.g.position.x=lerp(rs.pet.g.position.x,G.x+side,.08);rs.pet.g.position.z=lerp(rs.pet.g.position.z,1.2,.1);rs.pet.update(G.t*1.6);rs.pet.g.scale.setScalar(G.fx.choco>0?2.1:1.25)}
 rs.clones.forEach((c,i)=>{c.g.visible=G.fx.clone>0;if(G.fx.clone>0){c.g.position.set(centers[i+1],G.y,0);pose(c,G.t+i,G.y>.05?'jump':'idle',1)}});
 const gs=G.gshield>0;rs.shield.visible=G.mochi>0||gs;rs.shield.material.color.set(gs?0xffc94a:0xff9fd6);rs.shield.position.set(G.x,1.3,0);rs.shield.scale.setScalar(1+Math.sin(G.t*6)*.04);
 if(rs.boss){const b=rs.boss;if(b.mon)b.update(G.t,G.bs.cd<1,G.over&&G.reason==='win');else{{const en=G.t<2.4?(1-G.t/2.4):0;if(!G._ent){G._ent=1;banner(((G.bcfg&&G.bcfg.name)||'BOSS').toUpperCase()+' ENTERS!');try{rumble(1.4,60,35,.3)}catch(e){}}b.g.position.y=4.45+Math.abs(Math.sin(G.t*3))*.35*(1-en)+en*en*14}pose(rs.boss,G.t,G.over&&G.reason==='win'?'hit':G.bs.cd<1?'angry':'arms')}}
 if(rs.stage)rs.stage.update(G.t);
 if(rs.env&&rs.env.update){rs.env.tk=G.kind==='boss'?(G.bossPh>=2?1:0):(Math.floor((G.round-1)/2)%2);rs.env.update(G.t,dt)}
 if(G.fx.portal>0&&rs.sc.fog)rs.sc.fog.color.lerp(new THREE.Color('#ffb347'),.05);
 for(let i=rs.parts.length-1;i>=0;i--){const p=rs.parts[i],u=p.userData;u.life-=dt;u.v.y-=9*dt;p.position.addScaledVector(u.v,dt);p.material.opacity=Math.max(0,u.life*1.6);if(u.life<=0){rs.sc.remove(p);p.material.dispose();rs.parts.splice(i,1)}}
 // camera
 arenaCam();G.shake=Math.max(0,G.shake-dt*1.4);const sh=S.st.shake&&!S.st.calm?G.shake:0;if(sh){rs.cam.position.x+=rnd(-sh,sh)*.4;rs.cam.position.y+=rnd(-sh,sh)*.3}
 if(G.dirty||Math.floor(G.t*10)!==G.lastHud){G.dirty=0;G.lastHud=Math.floor(G.t*10);hudDirty();arenaHudUpdate();renderEfx()}
 render(rs.sc,rs.cam)}
function arenaHudUpdate(){const exp=Math.round(G.score/30+G.catches*.5);if(G.kind!=='boss')$('#roundTxt').textContent='Round '+G.round+' · +'+exp+' EXP';else $('#roundTxt').textContent=(G.dist==='intramuros'?'Rap Battle':'Boss Battle')+' · +'+exp+' EXP';
 const cc=$('#tbC');if(cc)cc.style.opacity=G.pulseCd>0?.45:1;
 if(G.kind==='boss'){$('#bmFill').style.width=G.meter+'%';const bw=S.bpow||['magnet','thunder'];[['#bpA',bw[0]],['#bpB',bw[1]]].forEach(([s,k])=>{const b=$(s);const ok=G.meter>=BPOW[k].cost;b.classList.toggle('ready',ok);b.disabled=!ok})}}

/* ---- boss prep ---- */
function bossPrep(distId){if(S.trapped&&distId!==S.trapped)distId=S.trapped;const cur=(S.bpow||['magnet','thunder']).slice();S.bpow=cur;const bc=bossOf(distId),rem=REMATCH_REWARD[distId],repeat=!!(rem&&bossCleared(distId));
 openSheet({title:bc.battle||('Boss Battle: '+bc.name),narrow:true,render(){return `<div class="row" style="gap:.6rem;margin-bottom:.6rem;align-items:center"><img src="${monThumb(distId)}" alt="" style="width:4.2rem;height:4.2rem;image-rendering:pixelated;background:#2a2060;border:3px solid #14101c"><p class="muted grow"><b style="color:${bc.col}">${bc.name}:</b> ${bc.pitch}</p></div><p class="muted" style="margin-bottom:.7rem">Pick <b style="color:#fff">two</b> boss powers. They charge from catches and combos, and only work in boss battles. Your pet joins in.</p>${repeat?`<p class="muted">Rematch entry: ${coinHtml(rem.fee)} · Win reward: ${coinHtml(rem.reward)}. Each rematch victory raises the battle difficulty.</p>`:''}${Object.entries(BPOW).map(([k,p])=>`<div class="card ${S.bpow.includes(k)?'on':''}" style="margin-bottom:.45rem"><div class="row"><span style="width:2.4rem;height:2.4rem;border-radius:50%;background:${p.col};flex:none"></span><div class="grow"><b>${p.n}</b> <span class="pill">${p.cost}% meter</span><p>${p.d}</p></div><button class="btn sm ${S.bpow.includes(k)?'':'ghost'}" data-a="bpick:${k}">${S.bpow.includes(k)?'Equipped':'Equip'}</button></div></div>`).join('')}<div style="margin-top:.8rem"><button class="btn" data-a="bstart:${distId}" ${S.bpow.length===2&&(!repeat||S.coins>=rem.fee)?'':'disabled'}>${repeat?'Pay '+fmt(rem.fee)+' coins · Rematch for '+fmt(rem.reward):'Start battle'}</button></div>`}})}
ACT.bpick=k=>{const b=S.bpow;const i=b.indexOf(k);if(i>=0){if(b.length>1)b.splice(i,1)}else{if(b.length>=2)b.shift();b.push(k)}save();reSheet()};
ACT.bstart=d=>{d=d||'intramuros';const rem=REMATCH_REWARD[d];activeRematch=null;if(rem&&bossCleared(d)){if(S.coins<rem.fee){toast('You need '+fmt(rem.fee)+' coins to enter this rematch.');return}S.coins-=rem.fee;activeRematch={id:d,fee:rem.fee,reward:rem.reward};save();refreshHome()}closeSheet(true);startArena('boss',d)};

/* ============ Exploration Mode: free-roam pixel maps, no enemies, no timer ============ */
const EXPL={
 plaza:{poi:'Rizal Plaza',tip:'Real prizes never ask for your OTP.'},
 intramuros:{poi:'Fort Santiago',tip:'Official government pages end in .gov.ph. Look-alike links do not.'},
 tondo:{poi:'Sto. Niño de Tondo',tip:'A friend asking for load money? Call them first.'},
 binondo:{poi:'Chinatown Welcome Arch',tip:'Too-good-to-be-true deals are bait. Check the shop first.'},
 divisoria:{poi:'The 168 Mall',tip:'Pay at the stall, not through a link a stranger sends.'},
 palawan:{poi:'Hidden Lagoon',tip:'Booking scams use fake pages. Book through the official site.'},
 bohol:{poi:'Chocolate Hills Viewpoint',tip:'Short links hide where they go. Be careful before tapping.'},
 siargao:{poi:'Cloud 9 Boardwalk',tip:'Fake giveaways love tagging you. Real ones do not ask for a fee.'},
 biringan:{poi:'The Lantern Gate',tip:'If a stranger asks for a code, the answer is always no.'},
 balete:{poi:'The Whispering Balete',tip:'Pause before you click. Scammers hurry you on purpose.'},
 mansion:{poi:'The Lit Window',tip:'Unknown callers claiming to be your bank are not your bank.'},
 kapre:{poi:"The Kapre's Seat",tip:'Screenshots of “proof” can be faked. Verify directly.'}};
function hudReset(){const h=$('#hearts');if(h){h.hidden=false;$('#btnPet').style.display='';$('#combo').hidden=false}const tb=$('#tbtns');if(tb)tb.hidden=false}
function startExplore(id){if(S.trapped&&id!==S.trapped)id=S.trapped;
 closeSheet(true);stopAll();id=PROPS[id]?id:'plaza';const cfg=EXPL[id]||EXPL.plaza;
 const sc=new THREE.Scene(),cam=cams.run||mkCam('run',50);lights(sc,'#a9b6ff','#3a2a55',1.1,'#ffe3b8',1);const env=buildPixelWorld(sc,id);
 // extra scattered scenery so the map feels like a place
 const kinds=PROPS[id]||PROPS.plaza;let sd=id.length*7+3;const rd=()=>(sd=(sd*16807)%2147483647)/2147483647;
 for(let i=0;i<26;i++){const kd=kinds[i%kinds.length],t=propTex(kd,id),m=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,alphaTest:.1,fog:false}));const hh=kd==='house'?7:kd==='lamp'?6:kd==='palm'?9:8;m.scale.set(hh*32/48,hh,1);const x=(rd()<.5?-1:1)*(4+rd()*10),z=-2-rd()*34;m.position.set(x,hh/2,z);sc.add(m)}
 const pl=buildChibi(resolveLook(S.look||defaultLook()));pl.g.scale.setScalar(1.55);sc.add(pl.g);
 const ps=petStats();let pet=null;if(ps){pet=buildPet(ps.d,petStage(ps.p.lvl,S.evoView[ps.d.id]!==false));pet.g.scale.setScalar(1.25);sc.add(pet.g)}
 const hev=buildChibi(HEV_LOOK);hev.g.scale.setScalar(1.55);const hevX=rd()<.5?-6:6;hev.g.position.set(hevX,0,-14);sc.add(hev.g);
 const items=[];const put=(type,icon,size,val)=>{const sp=iconSprite(icon,size);const x=(rd()-.5)*24,z=-1-rd()*32;sp.position.set(x,size*.55+.5,z);sc.add(sp);items.push({type,sp,x,z,val,size,dead:false,ph:rd()*6})};
 for(let i=0;i<14;i++)put('coin','coin',.9,1);for(let i=0;i<3;i++)put('gem','gem',1.1,10);put('chest','chest',1.5,40);put('gem','gem',1.1,5);put('poi','star',1.8,0);for(let i=0;i<3;i++)put('tip','ticket',1.2,0);
 const total=items.filter(i=>i.type!=='tip').length;
 SCN.run=RS={sc,cam,env,stage:null,pl,pet,clones:[],shield:{visible:false},ring:{material:{opacity:0},scale:{setScalar(){}},position:{set(){}},userData:{}},hev,boss:null,pal:DIST[0],parts:[],d:13,vis:10};
 G={explore:1,dist:id,kind:'explore',t:0,pause:false,over:false,fin:false,x:0,z:2,vx:0,vz:0,y:0,vy:0,face:1,items,total,found:0,coins:0,frags:0,gems:0,poiSeen:false,tips:0,heal:0,score:0,catches:0,best:0,combo:0,lives:1,maxLives:1,fx:{},later:[],bcfg:null,drag:null,dragId:null,hevT:0,hevX,cfg};
 camExplore(true);setMode('run');R.setClearColor(0x0d1630);
 $('#hearts').parentElement.hidden=false;$('#hearts').hidden=true;$('#bossBar').hidden=true;$('#btnPow').style.display='none';$('#btnPet').style.display='none';const tb=$('#tbtns');if(tb)tb.hidden=true;$('#combo').hidden=true;$('#coach').hidden=true;
 const kk=$('#keys');if(kk)kk.textContent='A / D or arrows move | W forward | S sprint | Space jump | P pause';
 $('#roundTxt').textContent='Exploring '+mapName(id);banner('EXPLORE');SFX.round();say('Hev','Take your time. Find '+cfg.poi+' and every hidden treasure!',3600)}
function camExplore(snap){const rs=RS,c=rs.cam,a=innerWidth/innerHeight;c.fov=50;c.aspect=a;c.updateProjectionMatrix();const tx=G.x*.85,tz=G.z+9;if(snap){c.position.set(tx,4.2,tz)}else{c.position.x+=(tx-c.position.x)*.12;c.position.z+=(tz-c.position.z)*.12;c.position.y=4.2}c.lookAt(c.position.x,1.9,G.z-3)}
function exploreUpdate(dt){const rs=RS;if(G.pause){render(rs.sc,rs.cam);return}
 G.t+=dt;if(bubbleT>0){bubbleT-=dt;if(bubbleT<=0)$('#bubble').hidden=true}
 const dx=(keysDown.right?1:0)-(keysDown.left?1:0),dz=(keysDown.up?-1:0)+(keysDown.down?1:0);let ix=dx,iz=dz;
 if(G.stick){ix=clamp(G.stick.x/50,-1,1);iz=clamp(G.stick.y/50,-1,1);if(Math.hypot(ix,iz)<.15){ix=0;iz=0}}
 const sprint=keysDown.sprint?1.7:1,sp=6*sprint*(S.st.sens||1),m=Math.hypot(ix,iz)||1;
 G.vx=lerp(G.vx,ix/m*sp*Math.min(1,m),Math.min(1,dt*10));G.vz=lerp(G.vz,iz/m*sp*Math.min(1,m),Math.min(1,dt*10));
 G.x=clamp(G.x+G.vx*dt,-13,13);G.z=clamp(G.z+G.vz*dt,-34,4);if(Math.abs(G.vx)>.4)G.face=G.vx>0?1:-1;
 if(G.y>0||G.vy>0){G.vy-=28*dt;G.y+=G.vy*dt;if(G.y<=0){G.y=0;G.vy=0}}
 const moving=Math.hypot(G.vx,G.vz)>.8;
 rs.pl.g.position.set(G.x,G.y,G.z);pose(rs.pl,G.t,G.y>.05?'jump':moving?'run':'idle',1);pose(rs.hev,G.t,'idle',1);rs.pl.g.rotation.z=-G.vx*.012;
 if(rs.pet){const p=rs.pet.g;p.position.x+=(G.x-1.4*G.face-p.position.x)*Math.min(1,dt*4);p.position.z+=(G.z+.6-p.position.z)*Math.min(1,dt*4);rs.pet.update(G.t,moving?1.4:.8)}
 // day/night: every ~45 s
 rs.env.tk=Math.floor(G.t/45)%2;rs.env.update(G.t,dt);
 // items
 for(const it of G.items){if(it.dead)continue;it.sp.position.y=it.size*.55+.5+Math.sin(G.t*3+it.ph)*.12;const d=Math.hypot(it.x-G.x,it.z-G.z);
  if(d<(it.type==='poi'?1.8:1.25)&&G.y<1.4){it.dead=true;rs.sc.remove(it.sp);G.catches++;
   if(it.type==='coin'){G.coins+=1;G.score+=10;G.found++;SFX.coin(G.found)}
   else if(it.type==='gem'){G.coins+=10;G.score+=100;G.found++;G.gems++;SFX.gem();banner('GEM!')}
   else if(it.type==='chest'){G.coins+=40;G.score+=250;G.found++;SFX.gem();banner('TREASURE!')}
   else if(it.type==='frag'){G.found++;G.frags++;S.inv.fragments++;track('frag',1);SFX.win();banner('MAP FRAGMENT!')}
   else if(it.type==='poi'){G.found++;G.poiSeen=true;G.coins+=30;G.score+=300;SFX.win();banner(G.cfg.poi.toUpperCase());toast('Discovered: '+G.cfg.poi)}
   else if(it.type==='tip'){G.tips++;SFX.power();say('Scam Alert',G.cfg.tip,5200);G.score+=50}
   burst(new THREE.Vector3(it.x,1,it.z),it.type==='gem'?'#5ee0ff':'#ffd24a',8);G.dirty=1}}
 // Hev chat
 const hd=Math.hypot(G.x-G.hevX,G.z-(-14));G.hevT-=dt;if(hd<3&&G.hevT<=0){G.hevT=12;say('Hev',pick(['Nice! Keep exploring.','Psst. There is a star hidden somewhere far away.','Real prizes never ask for your OTP.','Your pet is having fun too.']),3200)}
 if(!G.fin&&G.found>=G.total){G.fin=true;banner('MAP COMPLETE!');SFX.win();setTimeout(()=>{if(G&&G.explore)endExplore()},1400)}
 for(let i=RS.parts.length-1;i>=0;i--){const p=RS.parts[i],u=p.userData;u.life-=dt;u.v.y-=9*dt;p.position.addScaledVector(u.v,dt);p.material.opacity=Math.max(0,u.life*1.6);if(u.life<=0){RS.sc.remove(p);RS.parts.splice(i,1)}}
 camExplore(false);$('#rScore').textContent=fmt(G.score);$('#rCoins').textContent=fmt(G.coins);$('#roundTxt').textContent=mapName(G.dist)+' · Found '+G.found+'/'+G.total;
 render(rs.sc,rs.cam)}
function endExplore(early){if(!G||!G.explore||G.over)return;G.over=true;const g=G;g.reason='explore';
 const done=g.found>=g.total,first=done&&!S.stats['explore_'+g.dist];S.coins+=g.coins+(done?150:0);S.stats.explored=(S.stats.explored||0)+(first?1:0);if(first){S.stats['explore_'+g.dist]=1;S.tickets+=2}S.stats.coinsEarned=(S.stats.coinsEarned||0)+g.coins;addExp(Math.round(g.score/25));save();refreshHome();
 openSheet({title:done?'Map complete!':'Exploration paused',narrow:true,noClose:true,render(){return `<div style="text-align:center"><div class="disp" style="font-size:2.2rem;color:var(--gold)">${g.found}/${g.total}</div><div class="muted">found in ${esc(mapName(g.dist))}</div></div><div class="grid s" style="margin:.8rem 0"><div class="stat"><b>${fmt(g.coins+(done?150:0))}</b><span>Coins</span></div><div class="stat"><b>${g.gems}</b><span>Gems</span></div><div class="stat"><b>${g.frags}</b><span>Fragments</span></div><div class="stat"><b>${g.poiSeen?'Yes':'No'}</b><span>${esc(g.cfg.poi)}</span></div></div>${first?'<div class="card on" style="margin-bottom:.5rem"><b>First full exploration!</b><p class="muted">+150 coins and +2 tickets.</p></div>':''}<p class="muted" style="margin-bottom:.6rem">Scam Alert tip: ${esc(g.cfg.tip)}</p><div class="row" style="gap:.5rem;flex-wrap:wrap"><button class="btn" data-a="xagain">Explore again</button><button class="btn ghost" data-a="phome">Home</button></div>`}})}
ACT.xagain=()=>{const d=G&&G.dist;closeSheet(true);startExplore(d||'plaza')};

/* ============ Secret-map entrances (cinematics only, no gameplay, no jeepney) + creepy audio ============ */
let RIDE=null,GHOSTT=0,_ac=null,AMBBUSY=0,SCARET=0;
const zAC=()=>{try{_ac=_ac||new (window.AudioContext||window.webkitAudioContext)();if(_ac.state==='suspended')_ac.resume();return _ac}catch(e){return null}};
const SV=v=>(S.st.sfx==null?.8:S.st.sfx)*(v==null?1:v);
function ztone(f,dur,type,vol,delay,f2){const c=zAC();if(!c)return;try{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+(delay||0);o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(SV(vol||.15),t+Math.min(.05,dur/3));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+.05)}catch(e){}}
function noise(dur,fc,q,vol,delay,type){const c=zAC();if(!c)return;try{const n=Math.floor(c.sampleRate*dur),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
 const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime+(delay||0);s.buffer=b;f.type=type||'bandpass';f.frequency.value=fc;f.Q.value=q||1;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(SV(vol||.2),t+dur*.4);g.gain.linearRampToValueAtTime(0,t+dur);s.connect(f);f.connect(g);g.connect(c.destination);s.start(t)}catch(e){}}
function rumble(dur,f0,f1,vol){ztone(f0,dur,'sawtooth',(vol||.25)*.6,0,f1);noise(dur,150,.7,(vol||.25)*.8,0,'lowpass')}
const whisper=(d)=>{noise(1.4,2400,3,.12,d||0);noise(1.1,3600,4,.07,(d||0)+.5)};
const footsteps=(n)=>{for(let i=0;i<n;i++){ztone(70,.22,'sine',.35,i*.62,38);noise(.12,200,1,.12,i*.62,'lowpass')}};
const hum=()=>{ztone(196,3.2,'sine',.08,0,185);ztone(293,3.2,'sine',.04,0,277)};
const wind=()=>noise(4.5,500,.6,.14,0,'lowpass');
const musicBox=(delay)=>{[659,784,988,880,659,784,1175,988].forEach((f,i)=>ztone(f,.9,'triangle',.1,(delay||0)+i*.42))};
const doorCreak=(d)=>ztone(180,1.8,'sawtooth',.06,d||0,90);
/* 4 jump-scare sounds, one per face, all different */
const SCARE_SND=[
 ()=>{ztone(1700,.8,'sawtooth',.12,0,420);noise(.8,5000,.8,.12)},
 ()=>{ztone(75,1.3,'sine',.5,0,32);noise(1,120,.6,.35,0,'lowpass')},
 ()=>{whisper(0);playGhost(.55)},
 ()=>{[622,659,932,988,1244].forEach((f,i)=>ztone(f,.7,'triangle',.1,i*.11));ztone(55,1.2,'sine',.3,.4,40)}];
function loadFaces(){window.FACEIMG=window.FACEIMG||(window.EMBIMG||[]).map(u=>{const i=new Image();i.src=u;return i})}
function jumpScare(idx,warningShown){if(S.st.scare===false)return;if(!warningShown){const warning=mk('div','scr');warning.style.cssText='position:absolute;inset:0;z-index:61;background:rgba(5,4,20,.96);display:grid;place-items:center;padding:24px;text-align:center';warning.innerHTML='<div><b style="color:#ffd24a;font-size:1.2rem">Content warning</b><p style="color:#fff;margin:.6rem 0">This scene contains a sudden visual and audio scare.</p><span class="muted">The scare will begin in a moment.</span></div>';$('#ui').appendChild(warning);setTimeout(()=>{if(!warning.isConnected)return;warning.remove();jumpScare(idx,true)},2400);return}loadFaces();const n=(window.EMBIMG||[]).length;if(!n)return;
 const i=idx!=null?idx:Math.floor(Math.random()*n);SCARE_SND[i%SCARE_SND.length]();
 const o=mk('div','scr');o.style.cssText='position:absolute;inset:0;z-index:60;background:#000;display:grid;place-items:center;pointer-events:none;opacity:0;transition:opacity .12s';
 o.innerHTML=`<img src="${EMBIMG[i%n]}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;image-rendering:auto">`;$('#ui').appendChild(o);
 requestAnimationFrame(()=>{o.style.opacity='1'});setTimeout(()=>{o.style.transition='opacity .45s';o.style.opacity='0'},650);setTimeout(()=>o.remove(),1300)}
/* Biringan-only atmosphere: unpredictable, never overlapping */
function biringanTick(){try{if(!(G&&G.dist==='biringan')||G.pause||G.over)return;const now=performance.now();
  if(now<AMBBUSY||Math.random()>.45)return;const k=Math.floor(Math.random()*6);AMBBUSY=now+7000;
 [wind,()=>whisper(0),()=>footsteps(2+Math.floor(Math.random()*3)),hum,()=>whisper(0),()=>{ztone(1318,1.6,'sine',.05,0,1245);ztone(1480,1.6,'sine',.03,.2,1400)}][k]()}catch(e){}}

function startRide(id){startPortal(id)}
function startPortal(id){
 const s=SECRETS.find(x=>x.id===id);if(!s)return;
 stopSecretAudio();
 playSecretAudio(id,.55);
 const first=id==='biringan'&&!S.seenBiringan;loadFaces();
 closeSheet(true);stopAll();setMode('ride');showScreen('none');try{aud.pause()}catch(e){}
 const ov=mk('div','scr');ov.id='rideUi';ov.style.cssText='position:absolute;inset:0;pointer-events:auto;background:#000;z-index:25;display:grid;place-items:center';
 ov.innerHTML=`<canvas id="rideCv" width="192" height="108" style="width:100%;height:100%;object-fit:cover;image-rendering:pixelated"></canvas><div id="rideTxt" style="position:absolute;left:0;right:0;bottom:max(18px,env(safe-area-inset-bottom,0px));text-align:center;padding:0 1rem"></div>${first?'':'<button class="btn ghost sm" id="rideSkip" style="position:absolute;top:max(12px,env(safe-area-inset-top,0px));right:12px">Skip</button>'}<div id="rideCont" style="position:absolute;left:0;right:0;bottom:max(70px,calc(env(safe-area-inset-bottom,0px) + 60px));text-align:center" hidden><button class="btn" id="rideGo">Continue</button></div>`;
 $('#ui').appendChild(ov);
 const cv=$('#rideCv'),x=cv.getContext('2d');x.imageSmoothingEnabled=false;
 const dest=sceneCanvas(id,192,108,0);
 const LB=[['Hev','Nanalo tayo kay Dags. Panalo ang Maynila!'],['Hev','…teka. Bakit biglang dumilim?'],['Hev','…ikaw ’yon! Ang mukha sa profile ng @BeatBuster!'],['Hev','May bumubukas… ano ’yan?!'],['Hev','Hinihila tayo!'],['','Biringan City. Isang kaharian na lumilitaw lang sa mga naliligaw.'],['Hev','Mag-ingat tayo. Parang may sumusunod sa atin.']];
 const LINES={balete:[['','May mga bulong sa hangin…'],['Hev','Gumagalaw ang mga ugat! May daan sa likod ng puno.'],['',s.name+'. '+s.sub]],
  mansion:[['','May tumutugtog na musika sa dilim…'],['Hev','Sinusundan natin ang himig. Teka, kusang bumukas ang pinto!'],['',s.name+'. '+s.sub]],
  kapre:[['','Ang lupa ay yumayanig. May napakalaking yabag.'],['Hev','Sundan natin ang mga bakas. May amoy ng usok…'],['',s.name+'. '+s.sub]],
  tikbalang:[['Hev','Naliligaw tayo sa daan…'],['Hev','Baligtarin mo ang suot mo!'],['',s.name+'. '+s.sub]]};
 const L=first?LB:(LINES[id]||LINES.tikbalang),DUR=first?32:14,T0=performance.now();let done=false,raf=0,fl={};
 const stars=Array.from({length:40},(_,i)=>[(i*53)%192,(i*29)%70]);
 const rnd=n=>{const v=Math.sin(n*12.9898)*43758.5453;return v-Math.floor(v)};
 const once=(k,fn)=>{if(!fl[k]){fl[k]=1;fn()}};
 const P={dark:6,face:10,portal:14,pull:19,arrive:23};
 function face(a){const im=(window.FACEIMG||[])[0];x.globalAlpha=a;if(im&&im.complete&&im.naturalWidth){const h=108,w=h*im.naturalWidth/im.naturalHeight;x.drawImage(im,96-w/2,0,w,h)}else{x.fillStyle='#e8e4ff';x.fillRect(82,30,28,36)}x.globalAlpha=1}
 function portal(cx,cy,r,t){for(let k=0;k<9;k++){const rr=r*(1-k*.1);x.fillStyle=['#2a0a52','#4a1a86','#7a3ad6','#b07cff','#e0c8ff','#7a3ad6','#4a1a86','#1a0636','#000'][k];
   for(let a=0;a<48;a++){const ang=a/48*Math.PI*2+t*(1+k*.15),w=rr*(1+.18*Math.sin(a*3+t*4+k));x.fillRect(Math.round(cx+Math.cos(ang)*w),Math.round(cy+Math.sin(ang)*w*.8),Math.max(2,Math.round(rr/4)),Math.max(2,Math.round(rr/4)))}}
   x.fillStyle='#000';x.beginPath();x.ellipse(cx,cy,r*.35,r*.28,0,0,7);x.fill()}
 function manila(t,dim){x.fillStyle='#14183a';x.fillRect(0,0,192,108);x.fillStyle='#fff';stars.forEach(([a,b],i)=>{if((Math.floor(t*2)+i)%4)x.fillRect(a,b,1,1)});
  x.fillStyle='#1d2250';for(let k=0;k<9;k++){const h=24+rnd(k)*30;x.fillRect(k*22-4,84-h,20,h);x.fillStyle='#ffd23f';for(let w=0;w<6;w++)if(rnd(k*9+w)>.5)x.fillRect(k*22+(w%2)*8,84-h+6+Math.floor(w/2)*8,4,4);x.fillStyle='#1d2250'}
  x.fillStyle='#2b2b3a';x.fillRect(0,84,192,24);x.fillStyle='#ffd23f';for(let k=0;k<6;k++)x.fillRect(k*34,98,16,2);
  x.fillStyle='#8a6aff';x.fillRect(86,58,10,26);x.fillRect(84,52,14,8);x.fillStyle='#ffd7b0';x.fillRect(86,46,10,8);x.fillStyle='#000';x.fillRect(86,45,10,3);
  if(dim>0){x.globalAlpha=dim;x.fillStyle='#000';x.fillRect(0,0,192,108);x.globalAlpha=1}}
 const glowRect=(a,y,w,h,c,al)=>{x.globalAlpha=al;x.fillStyle=c;x.fillRect(a,y,w,h);x.globalAlpha=1};
 function balete(t){const g=x.createLinearGradient(0,0,0,108);g.addColorStop(0,'#06140f');g.addColorStop(1,'#0e2a1c');x.fillStyle=g;x.fillRect(0,0,192,108);
  x.fillStyle='#1b120a';x.fillRect(70,0,52,86);x.fillStyle='#2a1c10';for(let k=0;k<6;k++)x.fillRect(72+k*8,0,2,86);
  x.fillStyle='#0a1a10';x.fillRect(0,86,192,22);
  once('w1',()=>whisper(0));if(t>3)once('w2',()=>whisper(0));if(t>6)once('w3',()=>{rumble(2.2,55,35,.25);whisper(.3)});
  const grow=Math.min(1,t/6);for(let k=0;k<9;k++){const dir=k<4?-1:1,ph=k%4;x.fillStyle='#5be38a';for(let i=0;i<Math.floor(30*grow);i++){const px=96+dir*(8+i*2.6+ph*3),py=86-Math.sin(i*.14+ph)*10*(1+ph*.3)+Math.sin(t*2+k)*1.2;x.globalAlpha=.55+.3*Math.sin(t*3+k);x.fillRect(Math.round(px),Math.round(py+ph*3),2,2)}}x.globalAlpha=1;
  if(t>6){const w=Math.min(26,(t-6)*7);glowRect(96-w/2,24,w,62,'#c8ffd8',.9);glowRect(96-w/2-3,22,w+6,66,'#5be38a',.3);x.fillStyle='#fff';stars.slice(0,12).forEach(([a,b],i)=>x.fillRect(96+((a*7+t*8)%40-20)*(w/26),40+((b*5+t*10)%40),1,1))}}
 function mansion(t){const g=x.createLinearGradient(0,0,0,100);g.addColorStop(0,'#070a22');g.addColorStop(1,'#1a2150');x.fillStyle=g;x.fillRect(0,0,192,108);x.fillStyle='#fff';stars.forEach(([a,b],i)=>{if((Math.floor(t*2)+i)%5)x.fillRect(a,b,1,1)});
  x.fillStyle='#e8ecff';x.beginPath();x.arc(40,20,8,0,7);x.fill();
  x.fillStyle='#0c0f26';x.fillRect(48,40,96,50);x.fillRect(40,52,16,38);x.fillRect(136,52,16,38);for(let k=0;k<4;k++){x.beginPath();x.moveTo(48+k*24,40);x.lineTo(60+k*24,26);x.lineTo(72+k*24,40);x.fill()}
  x.fillRect(86,14,20,30);x.beginPath();x.moveTo(84,14);x.lineTo(96,2);x.lineTo(108,14);x.fill();
  for(let r=0;r<2;r++)for(let c=0;c<5;c++){const lit=(r===0&&c===2)||(Math.sin(t*3+c*2+r)>.93);x.fillStyle=lit?'#ffe9a0':'#1f2750';x.fillRect(56+c*16,48+r*18,7,9)}
  x.fillStyle='#050612';x.fillRect(0,90,192,18);x.fillStyle='#14183a';for(let k=0;k<24;k++)x.fillRect(k*8,88,2,12);
  once('m1',()=>musicBox(0));if(t>6)once('m2',()=>{doorCreak(0);rumble(1.5,50,40,.15)});
  x.fillStyle='#000';x.fillRect(88,66,16,24);if(t>6.5){const o=Math.min(1,(t-6.5)/2);glowRect(88,66,16*o,24,'#fff3b8',.95);x.globalAlpha=.25*o;x.fillStyle='#ffe9a0';x.beginPath();x.moveTo(88,66);x.lineTo(104,66);x.lineTo(140,108);x.lineTo(52,108);x.fill();x.globalAlpha=1}
  for(let k=0;k<5;k++){const a=(t*20+k*40)%100;x.fillStyle='#8a6aff';x.globalAlpha=.6;x.fillRect(30+k*30,100-a,2,2);x.globalAlpha=1}}
 function kapre(t){const g=x.createLinearGradient(0,0,0,108);g.addColorStop(0,'#1a0f08');g.addColorStop(1,'#3a2410');x.fillStyle=g;x.fillRect(0,0,192,108);
  x.fillStyle='#0d0805';for(let k=0;k<7;k++){const px=k*30-6+(k%2)*6;x.fillRect(px,0,14+(k%3)*4,90);x.fillRect(px-10,8,34,14)}
  x.fillStyle='#24160a';x.fillRect(0,84,192,24);x.fillStyle='#14100a';x.fillRect(0,84,192,2);
  const prints=[[40,100,6],[66,95,8],[96,91,10],[130,92,13]];prints.forEach(([px,py,sz],i)=>{if(t>1.5+i*1.7){once('f'+i,()=>{rumble(.7,70,36,.4)});x.fillStyle='#0a0603';x.beginPath();x.ellipse(px,py,sz,sz*.5,0,0,7);x.fill();for(let k=0;k<5;k++)x.fillRect(px-sz+k*(sz*.5),py-sz*.7,2,2)}});
  if(t>8){x.globalAlpha=Math.min(1,(t-8)/2);x.fillStyle='#ffb347';x.fillRect(158,40,3,3);x.fillStyle='#ff7a2a';x.fillRect(159,41,1,1);x.globalAlpha=1;for(let k=0;k<6;k++){x.globalAlpha=.25;x.fillStyle='#aaa';x.fillRect(158+Math.sin(t*2+k)*4,38-((t*10+k*8)%30),4,4)}x.globalAlpha=1;once('k2',()=>hum())}
  const sh=t>1.5&&Math.floor(t*3)%2?1:0;if(sh)x.translate(0,0)}
 function tikbalang(t){x.fillStyle='#0b0620';x.fillRect(0,0,192,108);stars.forEach(([a,b])=>{x.fillStyle='#ff6fd0';x.fillRect(a,b,1,1)});x.fillStyle='#1a0a30';x.fillRect(0,84,192,24);x.fillStyle='#ff6fd0';for(let k=0;k<6;k++){const a=(k*35+t*30)%192;x.fillRect(a,96,14,2)}once('t1',()=>whisper(0))}
 const STY={balete,mansion,kapre,tikbalang};
 function rideFrame(){
  const t=(performance.now()-T0)/1000;x.setTransform(1,0,0,1,0,0);let sty=null;
  if(first){
   if(t<P.dark){manila(t,t>P.dark-3?Math.min(1,(t-(P.dark-3))/3)*.92+(Math.sin(t*40)>.6?.05:0):0);if(t>P.dark-3)once('wnd',wind)}
   else if(t<P.portal){x.fillStyle='#000';x.fillRect(0,0,192,108);
    if(t>P.face&&t<P.face+1.8){once('face',()=>{rumble(2,60,40,.18);ztone(1700,.6,'sawtooth',.08,0,500)});const a=Math.min(1,(t-P.face)*4)*(1-Math.max(0,(t-P.face-1.2)/.6));face(Math.max(0,a))}
    if(t<P.face-1)once('foot',()=>footsteps(3));const f=Math.sin(t*23)>.7?.15:0;x.globalAlpha=f;x.fillStyle='#5b2a8a';x.fillRect(0,0,192,108);x.globalAlpha=1}
   else if(t<P.pull){x.fillStyle='#07020f';x.fillRect(0,0,192,108);once('rum',()=>rumble(7,45,90,.3));const g=Math.min(1,(t-P.portal)/2.5);portal(96,54,6+g*38,t)}
   else if(t<P.arrive){const k=(t-P.pull)/(P.arrive-P.pull);x.fillStyle='#07020f';x.fillRect(0,0,192,108);x.save();x.translate(96,54);x.rotate(k*6);x.scale(1+k*3,1+k*3);x.translate(-96,-54);portal(96,54,44,t);x.restore();x.globalAlpha=Math.min(1,k*k*1.4);x.fillStyle='#fff';x.fillRect(0,0,192,108);x.globalAlpha=1}
   else{const k=Math.min(1,(t-P.arrive)/2.5);x.drawImage(dest,0,0,192,108);x.globalAlpha=1-k;x.fillStyle='#fff';x.fillRect(0,0,192,108);x.globalAlpha=1;once('arr',()=>{wind();whisper(1)});if(t>DUR-6)once('arr2',()=>footsteps(3))}
  }else{
   if(t<DUR-2.5){(STY[id]||tikbalang)(t)}else{const k=Math.min(1,(t-(DUR-2.5))/2.5);x.drawImage(dest,0,0,192,108);x.globalAlpha=1-k;x.fillStyle='#fff';x.fillRect(0,0,192,108);x.globalAlpha=1}
  }
  const li=Math.min(L.length-1,Math.floor(t/DUR*L.length));const sp=L[li][0];
  $('#rideTxt').innerHTML=`<span class="chip" style="font-size:.95rem;padding:.5rem 1rem;display:inline-block;max-width:92%">${sp?`<b style="color:${sp==='Hev'?'#8a6aff':'#ffd23f'}">${sp}:</b> `:'<i>'}${L[li][1]}${sp?'':'</i>'}</span>`;
  if(first&&t>=DUR-0.5)$('#rideCont').hidden=false;
  if(!first&&t>=DUR)return end();
  if(t>=DUR+120)return end();
  raf=requestAnimationFrame(rideFrame)}
 function end(){if(done)return;done=true;cancelAnimationFrame(raf);stopSecretAudio();ov.remove();RIDE=null;
  S.trapped=id;S.mode={kind:'catch',dist:id};S.stats['sec_'+id]=S.stats['sec_'+id]||s.clue;S.stats.secrets=SECRETS.filter(q=>S.stats['sec_'+q.id]).length;S.stats.journeys=(S.stats.journeys||0)+1;
  if(id==='biringan')S.seenBiringan=true;
  S.coins+=150;try{checkAch()}catch(e){}save();goHome();SFX.win();if(id==='mansion')loreSnd(id,.5);else try{if(S.st.musicOn!==false&&musicWanted)aud.play().catch(()=>{})}catch(e){}
  openSheet({title:'Arrived: '+s.name,narrow:true,noClose:first,render(){return `<p><b style="color:${s.col}">${s.sub}</b></p><p class="muted" style="margin:.5rem 0">Backstory: <b>unlocks after you beat the boss</b></p><p style="margin:.5rem 0"><b style="color:var(--gold)">The road back is sealed.</b> Beat <b style="color:#fff">${s.boss}</b> to return to Manila and the other maps.</p><div class="row" style="gap:.5rem;flex-wrap:wrap"><button class="btn" data-a="mplay:catch:${id}">Catching</button><button class="btn alt" data-a="mplay:boss:${id}">Fight ${s.boss}</button></div>`}})}
 const sk=$('#rideSkip');if(sk)sk.onclick=end;$('#rideGo').onclick=end;RIDE={end};raf=requestAnimationFrame(rideFrame)}

/* ============ Story scenes: Hev + Dags reconciliation, the life message (one screen, no skip), Biringan backstory (skippable, shown after the boss) ============ */
const LIFE_MSG='Your worth isn’t measured by how you compare to others. Your real strength comes from discovering who you are, learning from others, and choosing to do what’s right.';
const REC=[['Dags','Hev… pagod na akong ikumpara ako sa’yo.'],['Dags','Tuwing may nagsasabing mas magaling ka, parang wala akong halaga. Kaya ako nagalit.'],['Hev','Ako rin, Dags. Ang ingay ng comparison, kahit hindi tayo ang nagsimula.'],['Dags','Sandali. Tingnan mo ’to. Si @BeatBuster ang unang nag-post na sinabi mo raw na basura ang kanta ko.'],['Hev','Hindi ko sinabi ’yan! May DM din akong natanggap: sabi mo raw, wala akong talent.'],['Dags','Hindi ako nag-message ng ganyan. Peke ang account na ’yon. Pareho tayong nauto!'],['Hev','Impersonation. Kaya huwag basta maniwala sa mensahe bago i-verify.'],['Dags','Pasensya na, pre. Hindi lang ingay ng tao ang kalaban natin. May nanloloko pala.'],['Hev','Walang kompetisyon sa pagiging ikaw. Tara, gumawa tayo ng beat na tayo lang ang makakagawa.'],['Dags','Deal. Kasama ang mga fans natin!']];
const LORE={ending:[['','Tatlong tunog ang bumalik: bulong ng Balete, himig ng Mansion, yabag ng Kapre. At ang mga ilaw ng Biringan ang nagbigay ng ilaw sa lahat.'],['','Nang pagsamahin ang apat na ritmo, nabuo ang kantang matagal nang nawawala: ang Lost Beats.'],['Hev','Dags, naririnig mo ba? Ang tunog natin ’yan, hindi kanino man ang kopya.'],['','Sa ilalim ng entablado ng Biringan, may natagpuan si Hev na lumang kahon. Dalawang pangalan ang nakaukit sa takip: Pilar at Berting.'],['Hev','Dags... si Lola Pilar ’yan. Ang lola kong nagturo sa akin ng unang himig.'],['Dags','At si Mang Berting ang unang gurong nagturo sa akin ng rap. (tumahimik sandali) Magkakilala sila?'],['','Sa loob ng kahon ay isang liham: “Kung dumating ang araw na pagkumparahin kayo ng mga tao, huwag kayong maniwala. Hinati namin ang mga Beat para magkita kayo, dahil buo lang ang kanta kapag magkasama.”'],['','Walang nagnakaw ng kanta. Hinati ito ng dalawang kaibigan para magtagpo ang susunod na henerasyon. Ang away ay hindi nagsimula sa kanila. Ang mga kuwento at pekeng account ang nagpalaki nito, para may makinabang sa gulo.'],['Hev','Kaya pala... hindi tayo ang magkaaway. Ang nagpaaway sa atin, iyon ang dapat nating kinikilatis.'],['Dags','Tama. Sa susunod na may magpaaway sa atin, titingnan muna natin kung sino ang nakikinabang.'],['Dags','Magkaiba ang boses natin pero iisa ang beat. Tara, kantahin natin nang magkasama.'],['','At sa unang pagkakataon, tumugtog ang Lost Beats sa buong Pilipinas. Ang dating ingay ay naging musika.'],['','Salamat sa paglalaro, kaibigan. Hanggang sa susunod na beat.']],
 balete:[['','Sa gitna ng gubat ay may punong balete na mas matanda pa sa bayan. Dito itinago ng mga matatanda ang unang Lost Beat: isang tugtog na kinanta ng unang kapitan ng nayon.'],['','Ang nagbabantay ay si Mang Tomas, isang tagapag-alaga ng puno. Nangako siyang hindi aalis sa puwesto. Lumipas ang isandaang taon, at ang mga ugat ay tumubo sa paligid niya.'],['','Akala niya ang bawat dumarating ay kukuha ng Beat para ikumpara at ipagpalit. Kaya siya naging Rootbound Guardian.'],['','Nang matalo mo siya, lumuwag ang mga ugat at napayapa siya. Ibinigay niya sa iyo ang unang Beat at isang nakaukit na nota: \u201CAng susunod na himig ay nasa Mansion.\u201D Sa likod ng nota, may dalawang titik na halos nabura: P at B.']],
 mansion:[['','Ang Midnight Mansion ay bahay ng isang pamilya ng mang-aawit. Si Lady Isabela ay kumakanta tuwing hatinggabi hanggang sa ikumpara siya ng mga tao sa kanyang kapatid.'],['','Tumigil siyang kumanta, pero ang himig ay hindi umalis sa bahay. Tuwing hatinggabi, tumutugtog pa rin ito at nililigaw ang sinumang makinig.'],['','Ang hindi mo inaasahan: ang himig ay pamilyar kay Hev. Ito ang unang tugtog na itinuro ng kanyang lola.'],['','Nang matalo mo ang Lady of Midnight, kumanta siya ulit, at ibinigay ang ikalawang Beat. Sabi niya: \u201CSundan mo ang yabag sa kagubatan.\u201D']],
 kapre:[['','Ang Kapre\u2019s Grove ay kagubatang halos nakalimutan na. Ang Ancient Kapre ay nakaupo sa kanyang puno, naninigarilyo ng usok na kasing-alingasaw ng hamog.'],['','Matagal na siyang walang bisita. Ang bawat yabag niya ay tawag sa mga taong dati ay dumadalaw at nakikinig sa kanyang kuwento.'],['','Itinago niya ang ikatlong Beat sa kanyang puno para hindi ito mawala, kaya natakot siya sa mga lumalapit.'],['','Sa balat ng puno ay may ukit na luma: \u201CP + B\u201D. Nang matalo mo siya, tumawa siya at ibinigay ang Beat. Bumalik ang tatlong tunog. Sa Biringan na lang ang mga ilaw na magbibigay ng liwanag sa lahat.']],
 biringan:[['','Matagal na, may kaharian ng musika sa Samar. Tuwing may kumakanta nang buong puso, may ilaw na sinisindihan sa Biringan.'],['','Pero nang mag-away ang dalawang magkaibigan dahil sa mga nagkukumpara sa kanila, ang bawat comparison ay naging ingay. Ninakaw ng ingay ang mga ritmo: ang Lost Beats.'],['','Ang Enchanted King ang tagabantay ng mga ritmo. Nang marinig niya ang gulo nina Hev at Dags, ikinulong niya ang lahat para hindi na masira pa ang musika.'],['','Hindi siya masama. Natakot lang siyang tuluyang mawala ang musika. Nang natalo mo siya, isa-isang bumalik ang mga ilaw.'],['','May mga bakas pang naiwan: bulong sa Balete, himig sa Mansion, yapak sa Kapre. Sundan mo ang mga ito, at mabubuo ang Lost Beats.']]};
function storyStage(bgId,skippable,onSkip){closeSheet(true);stopAll();setMode('story');showScreen('none');
 const ov=mk('div','scr');ov.id='storyUi';ov.style.cssText='position:absolute;inset:0;pointer-events:auto;background:#000;z-index:25;display:flex;flex-direction:column;align-items:center;justify-content:flex-end';
 const bg=sceneCanvas(bgId,192,108,0);bg.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;image-rendering:pixelated';ov.appendChild(bg);
 ov.insertAdjacentHTML('beforeend',`<div id="stChars" style="position:absolute;left:0;right:0;bottom:30%;display:flex;justify-content:center;gap:4rem;align-items:flex-end"></div><div id="stTxt" style="position:relative;max-width:min(760px,94%);margin-bottom:max(24px,env(safe-area-inset-bottom,0px));text-align:center"></div>${skippable?'<button class="btn ghost sm" id="stSkip" style="position:absolute;top:max(12px,env(safe-area-inset-top,0px));right:12px">Skip</button>':''}`);
 $('#ui').appendChild(ov);const sk=$('#stSkip');if(sk)sk.onclick=onSkip;return ov}
function startReconcile(after){
 let i=0,finished=false;const fin=()=>{if(finished)return;finished=true;ov.remove();lifeMessage(()=>{S.lifeMsgSeen=true;save();if(after)after();else goHome()})};
 const ov=storyStage('plaza',true,fin);
 $('#stChars').innerHTML=`<img src="${spr(HEV_LOOK,'peace')}" alt="Hev" style="height:42vh;max-height:300px"><img src="${spr(DAGS_LOOK,'cross')}" alt="Dags" style="height:42vh;max-height:300px">`;
 const show=()=>{const [w,t]=REC[i];$('#stTxt').innerHTML=`<div class="chip" style="font-size:1.05rem;padding:.8rem 1.2rem;display:block;line-height:1.5"><b style="color:${w==='Hev'?'#8a6aff':'#ffd23f'}">${w}:</b> ${t}</div><button class="btn" id="stNext" style="margin-top:.7rem">${i<REC.length-1?'Next':'Continue'}</button>`;$('#stNext').onclick=()=>{if(i<REC.length-1){i++;show()}else fin()}};show()}
function lifeMessage(done){closeSheet(true);stopAll();setMode('story');showScreen('none');
 const ov=mk('div','scr');ov.id='lifeUi';ov.style.cssText='position:absolute;inset:0;pointer-events:auto;z-index:30;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 40%,#3a1f7a 0%,#1a0f3a 55%,#07040f 100%);padding:max(20px,env(safe-area-inset-top,0px)) 20px max(20px,env(safe-area-inset-bottom,0px))';
 ov.innerHTML=`<div style="max-width:720px;text-align:center"><div style="color:var(--gold);letter-spacing:.25em;font-size:.8rem;margin-bottom:1.2rem">A MESSAGE FROM HEV AND DAGS</div><p style="font-family:var(--display,inherit);font-size:clamp(1.15rem,3.4vw,1.9rem);line-height:1.6;color:#fff;margin:0 0 1.8rem">“${LIFE_MSG}”</p><button class="btn" id="lifeGo" disabled>Continue</button><div class="muted" id="lifeHint" style="margin-top:.6rem;font-size:.8rem">Take a moment to read.</div></div>`;
 $('#ui').appendChild(ov);setTimeout(()=>{const b=$('#lifeGo');if(b){b.disabled=false;$('#lifeHint').textContent=''}},6000);$('#lifeGo').onclick=()=>{ov.remove();done()}}
const LOREFACE={biringan:0,balete:1,mansion:2,kapre:3};
let LAUD=null;
function loreSnd(id,vol){try{const src=id==='mansion'?'assets/secret-worlds/mansion-theme.mp3':'assets/lore-'+id+'.mp3';if(!LAUD||LAUD._id!==id){loreStop();LAUD=new Audio(embSrc(src));LAUD._id=id;LAUD.loop=true}LAUD.volume=Math.max(0,Math.min(1,vol*(S.st.sfx==null?.8:S.st.sfx)));LAUD.play().catch(error=>console.warn('Unable to play '+id+' ambience.',error))}catch(error){console.warn('Unable to initialize '+id+' ambience.',error)}}
function loreStop(){try{if(LAUD){LAUD.pause();LAUD=null}}catch(e){}}
function lorePop(id,cb){const n=(window.EMBIMG||[]).length,fi=LOREFACE[id];if(fi==null||fi>=n)return cb();
 const o=mk('div','scr');o.style.cssText='position:absolute;inset:0;z-index:60;background:#000;display:grid;place-items:center;opacity:0;transition:opacity .25s;pointer-events:auto';
 $('#ui').appendChild(o);requestAnimationFrame(()=>{o.style.opacity='1'});
 setTimeout(()=>{o.innerHTML=`<img src="${EMBIMG[fi]}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;opacity:0;transition:opacity .15s">`;requestAnimationFrame(()=>{o.firstChild.style.opacity='1'});loreSnd(id,1)},900);
 setTimeout(()=>{o.firstChild&&(o.firstChild.style.opacity='0')},2300);
 setTimeout(()=>{o.style.opacity='0'},2700);setTimeout(()=>{o.remove();loreSnd(id,.5);cb()},3200)}
function startLore(id,after){let i=0,fin=false,busy=false;const L=LORE[id];if(!L)return after&&after();
 const end=()=>{if(fin)return;fin=true;loreStop();if(id==='mansion'&&musicWanted&&S.st.musicOn!==false)aud.play().catch(error=>console.warn('Unable to resume the jukebox after Mansion story.',error));ov.remove();S.loreSeen=S.loreSeen||{};S.loreSeen[id]=1;save();if(after)after()};
 const ov=storyStage(id,true,end);loreSnd(id,.5);
 const show=()=>{$('#stTxt').innerHTML=`<div class="chip" style="font-size:1.05rem;padding:.8rem 1.2rem;display:block;line-height:1.55">${L[i][0]?`<b style="color:#ffc94a">${L[i][0]}</b> `:''}<i>${L[i][1]}</i></div><button class="btn" id="stNext" style="margin-top:.7rem">${i<L.length-1?'Next':'Done'}</button>`;$('#stNext').onclick=()=>{if(busy)return;if(i<L.length-1){i++;if(i===2&&LOREFACE[id]!=null){busy=true;$('#stTxt').innerHTML='';lorePop(id,()=>{busy=false;if(!fin)show()})}else show()}else end()}};show()}
ACT.replayrec=()=>{closeSheet(true);startReconcile(()=>goHome())};
ACT.replaylore=id=>{closeSheet(true);startLore(id,()=>goHome())};

/* ============ A THOUGHT TO TAKE WITH YOU: one random life lesson after an ordinary run ends ============ */
const LESSONS=['Your own pace is still progress. You don’t have to be ahead of everyone to move forward.','Being different is not a weakness. Your uniqueness can become your greatest strength.','Mistakes are part of learning. Every attempt gives you a chance to do better.','Courage isn’t about having no fear. It’s about choosing to move forward.','True strength comes from helping others. Even small acts of kindness matter.','Listen before you judge. Everyone has a story you may not know.','Winning isn’t everything. What you learn along the way matters, too.','Respect makes every journey better. Different people and traditions deserve understanding.','You don’t have to be perfect to be valuable. Your worth is not measured by your achievements.','Small choices matter. Choosing what is right can make a lasting difference.'];
function showLifeLesson(run){if(G!==run||document.querySelector('#lessonUi'))return;
 let i;do{i=Math.floor(Math.random()*LESSONS.length)}while(LESSONS.length>1&&i===S.lastLesson);S.lastLesson=i;save();
 const o=mk('div','scr');o.id='lessonUi';o.style.cssText='position:absolute;inset:0;z-index:45;display:grid;place-items:center;background:rgba(5,4,20,.55);opacity:0;transition:opacity .6s;padding:20px';
 o.innerHTML=`<div style="max-width:520px;text-align:center;background:linear-gradient(160deg,#2a1f6a,#14103a);border:4px solid #000;box-shadow:0 0 0 3px #ffd23f,0 10px 40px rgba(0,0,0,.6);border-radius:18px;padding:1.4rem 1.3rem;transform:translateY(24px) scale(.96);transition:transform .6s cubic-bezier(.2,1.3,.4,1)"><div style="color:#ffd23f;letter-spacing:.18em;font-size:.8rem;font-weight:800;margin-bottom:.8rem">A THOUGHT TO TAKE WITH YOU</div><p style="font-size:1.2rem;line-height:1.55;color:#fff;margin:0 0 1.1rem">“${LESSONS[i]}”</p><button class="btn" id="lessonOk">Thanks, Hev</button></div>`;
 $('#ui').appendChild(o);requestAnimationFrame(()=>{o.style.opacity='1';o.firstChild.style.transform='none'});
 $('#lessonOk').onclick=()=>{o.style.opacity='0';setTimeout(()=>o.remove(),500)}}

/* ============ Secret Map boss victory: two-character teamwork scene (Hev + Uncle Dags) ============ */
const TEAM_LESSON='Different strengths, one goal. Sometimes, the best way forward is together.';
const TEAM={
 balete:{obs:{w:30,h:12,bg:'#5a3a1c',bd:'#2a1a0a',y:60,name:'root'},steps:[
  [3800,[20,'idle'],[80,'cross',1],null,['Dags','Wait! Hev? Akala ko multo ka!']],
  [3800,[28,'idle'],[78,'cross',1],null,['Hev','Ikaw din, Dags! Sumunod ako sa bulong. Tingnan mo, hinaharangan ng ugat ang daan.']],
  [3800,[28,'idle'],[62,'point',1],[0,0],['Dags','Easy. Kaya ko ’to mag-isa. Hnnng…!'],'thud'],
  [3600,[28,'idle'],[64,'idle',1],[2,0],['Dags','…Okay. Hindi gumalaw. Sandali lang, nag-iinit pa ako.']],
  [3800,[40,'cheer'],[66,'idle',1],[1,1],['Hev','Pakinggan mo! Bumibitaw ang ugat tuwing may beat. Clap kasama ko!'],'note'],
  [3800,[40,'cheer'],[62,'point',1],[1,1],['Dags','Parang freestyle! Isa, dalawa, tatlo… PUSH!'],'thud'],
  [3800,[40,'cheer'],[56,'cheer',1],[3,0],['Hev','Ayan! Magkasabay tayo!'],'win'],
  [3800,[34,'peace'],[62,'peace',1],[3,0],['Dags','Ang galing mo sa timing, Hev.']],
  [3400,[34,'peace'],[62,'peace',1],[3,0],['Hev','At ikaw sa lakas. Hindi ko mabubuksan ’yan mag-isa.']]]},
 mansion:{obs:{w:22,h:30,bg:'#3a3a52',bd:'#111120',y:42,name:'gate'},steps:[
  [3800,[20,'idle'],[82,'cross',1],null,['Dags','Hev?! Ikaw pala! Nauna ka pa sa akin sa multo!']],
  [3800,[28,'idle'],[78,'pocket',1],null,['Hev','Hindi multo, kaibigan. Tingnan mo, nakakandado ang gate at may music box sa gilid.']],
  [3800,[28,'idle'],[60,'point',1],[0,0],['Dags','Madali lang. Susundutin ko ang kandado. Tsk… ayaw.'],'thud'],
  [3600,[44,'idle'],[60,'idle',1],[0,0],['Hev','Dags, sabay sa himig! Tuwing tumutunog ang nota, ikot mo ang susi.']],
  [3800,[44,'cheer'],[60,'point',1],[1,1],['Hev','Isa… dalawa…'],'note'],
  [3800,[44,'cheer'],[60,'cheer',1],[1,1],['Dags','Ngayon na?! Ngayon na! Click!'],'thud'],
  [3800,[40,'cheer'],[58,'cheer',1],[3,0],['Hev','Bumukas!'],'win'],
  [3800,[36,'peace'],[62,'peace',1],[3,0],['Dags','Ikaw ang himig, ako ang kamay. Bagay tayo.']],
  [3400,[36,'peace'],[62,'peace',1],[3,0],['Hev','Hindi bubukas ’yan kung isa lang sa atin.']]]},
 kapre:{obs:{w:34,h:8,bg:'#2a6aa8',bd:'#0c2a50',y:68,name:'water'},steps:[
  [3800,[20,'idle'],[80,'cross',1],null,['Dags','Hev! Sinundan mo rin ang yabag?']],
  [3800,[28,'idle'],[76,'pocket',1],null,['Hev','Oo, at may baha sa gitna ng bakas. Napakalawak.']],
  [3800,[28,'idle'],[62,'point',1],[0,0],['Dags','Tatalunin ko lang. Isa… dalawa… SPLASH!'],'thud'],
  [3600,[28,'idle'],[62,'idle',1],[0,0],['Hev','Dags, basa ka na. May troso sa kabila, pero hindi ko kayang hilahin mag-isa.']],
  [3800,[28,'idle'],[50,'point',1],[1,1],['Dags','Ako na sa hila. Ikaw ang magtali sa dulo!'],'thud'],
  [3800,[44,'cheer'],[50,'cheer',1],[1,1],['Hev','Sige! Hila!'],'note'],
  [3800,[44,'cheer'],[50,'cheer',1],[3,0],['Dags','Tulay na! Mukha tayong magaling!'],'win'],
  [3800,[40,'peace'],[56,'peace',1],[3,0],['Hev','Ikaw ang lakas, ako ang tali. Panalo!']],
  [3400,[40,'peace'],[56,'peace',1],[3,0],['Dags','Hindi ko sasabihing kailangan kita… pero kailangan nga kita.']]]},
 biringan:{obs:{w:36,h:10,bg:'#b48a3a',bd:'#4a360c',y:30,name:'lanterns'},steps:[
  [3800,[20,'idle'],[80,'cross',1],null,['Dags','Hev! Buhay ka pa pala!']],
  [3800,[28,'idle'],[76,'pocket',1],null,['Hev','Buhay at gutom. Tingnan mo, patay ang mga parol sa tulay. Parang kailangang buhayin.']],
  [3800,[28,'idle'],[60,'point',1],[0,0],['Dags','Aabutin ko! Hnnng… ang taas.'],'thud'],
  [3600,[28,'idle'],[60,'idle',1],[0,0],['Hev','Ako ang may tamang nota para sindihan, pero hindi ko maabot.']],
  [3800,[48,'idle'],[56,'point',1],[1,1],['Dags','Sakay ka sa balikat ko. Ayusin mo ang tono!'],'thud'],
  [3800,[50,'cheer'],[56,'cheer',1],[1,1],['Hev','La… la… LA!'],'note'],
  [3800,[50,'cheer'],[56,'cheer',1],[3,0],['Dags','Umilaw na lahat!'],'win'],
  [3800,[40,'peace'],[60,'peace',1],[3,0],['Hev','Ikaw ang taas, ako ang tono.']],
  [3400,[40,'peace'],[60,'peace',1],[3,0],['Dags','Hindi ito mangyayari kung isa lang.']]]}};
function startTeam(id,after){const T=TEAM[id];if(!T){S.teamSeen=S.teamSeen||{};if(after)after();return}
 S.teamSeen=S.teamSeen||{};const replay=!!S.teamSeen[id];let done=false,timer=0,k=0;
 const ov=storyStage(id,replay,()=>fin());
 const st=ov.querySelector('#stChars');st.style.cssText='position:absolute;inset:0;display:block';
 const pic=(l,p)=>spr(l,p);
 st.innerHTML=`<div id="tmObs" style="position:absolute;left:${50-T.obs.w/2}%;top:${T.obs.y}%;width:${T.obs.w}%;height:${T.obs.h}%;background:${T.obs.bg};border:4px solid ${T.obs.bd};border-radius:6px;transition:all .9s;box-shadow:inset 0 6px rgba(255,255,255,.18)"></div><img id="tmHev" alt="Hev" style="position:absolute;bottom:18%;height:38vh;max-height:280px;width:auto;transform:translateX(-50%);transition:left .9s,transform .3s"><img id="tmDags" alt="Dags" style="position:absolute;bottom:18%;height:38vh;max-height:280px;width:auto;transform:translateX(-50%) scaleX(-1);transition:left .9s,transform .3s">`;
 function fin(){if(done)return;done=true;clearTimeout(timer);ov.remove();S.teamSeen[id]=1;save();if(after)after()}
 function lesson(){$('#stTxt').innerHTML=`<div class="chip" style="display:block;padding:1rem 1.2rem;font-size:1.15rem;line-height:1.55"><div style="color:#ffd23f;letter-spacing:.16em;font-size:.78rem;font-weight:800;margin-bottom:.4rem">A LESSON WORTH SHARING</div>“${TEAM_LESSON}”</div><button class="btn" id="tGo" style="margin-top:.7rem" disabled>Continue</button>`;setTimeout(()=>{const b=$('#tGo');if(b){b.disabled=false}},2500);$('#tGo').onclick=fin;try{SFX.win()}catch(e){}}
 function step(){const s=T.steps[k];if(!s)return lesson();
  const [d,h,g,o,line,fx]=s,H=$('#tmHev'),D=$('#tmDags'),ob=$('#tmObs');
  H.style.left=h[0]+'%';H.src=pic(HEV_LOOK,h[1]);D.style.left=g[0]+'%';D.src=pic(DAGS_LOOK,g[1]);D.style.transform='translateX(-50%) scaleX(-1)';
  if(o){if(o[0]===1)ob.style.transform='translateX('+(k%2?6:-6)+'px)';else if(o[0]===2)ob.style.transform='translateX(-4px)';else if(o[0]===3){ob.style.transform='translateX('+(k>6?(T.obs.w+30)*(id==='kapre'?0:1):0)+'vw) rotate(0deg)';ob.style.opacity='.0';if(id==='kapre'){ob.style.opacity='1';ob.style.background='#7a5a2c';ob.style.height='4%'}}}
  if(fx==='thud')rumble(.5,70,38,.3);else if(fx==='note'){ztone(659,.4,'triangle',.12,0);ztone(784,.4,'triangle',.12,.2)}else if(fx==='win'){[523,659,784,1047].forEach((f,i)=>ztone(f,.5,'triangle',.12,i*.12))}
  H.style.transform='translateX(-50%) translateY('+(h[1]==='cheer'?-14:0)+'px)';D.style.transform='translateX(-50%) scaleX(-1) translateY('+(g[1]==='cheer'?-14:0)+'px)';
  $('#stTxt').innerHTML=`<div class="chip" style="font-size:1.05rem;padding:.8rem 1.2rem;display:block;line-height:1.5"><b style="color:${line[0]==='Hev'?'#8a6aff':'#ffd23f'}">${line[0]}:</b> ${line[1]}</div>`;
  k++;timer=setTimeout(step,d)}
 step()}
ACT.replayteam=id=>{closeSheet(true);startTeam(id,()=>goHome())};

/* ============ A SECRET MAP APPEARS (after beating a world boss) ============ */
function startReveal(id,after){const s=SECRETS.find(x=>x.id===id);if(!s)return after&&after();
 closeSheet(true);stopAll();stopSecretAudio();setMode('story');showScreen('none');
 const ov=mk('div','scr');ov.id='revealUi';ov.style.cssText='position:absolute;inset:0;z-index:40;pointer-events:auto;background:#000;display:grid;place-items:center;overflow:hidden';
 const bg=sceneCanvas(id,192,108,1);bg.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;image-rendering:pixelated;opacity:0;filter:blur(6px) brightness(.5);transition:opacity 3s,filter 3s';ov.appendChild(bg);
 ov.insertAdjacentHTML('beforeend',`<div id="rvRift" style="position:absolute;left:50%;top:50%;width:6px;height:0;background:${s.col};box-shadow:0 0 40px 14px ${s.col};transform:translate(-50%,-50%);transition:height 1.6s ease-in,width 1.2s ease-out 1.6s,opacity 1.5s;z-index:1"></div><div style="position:relative;z-index:2;text-align:center;padding:20px;opacity:0;transition:opacity 1.2s;background:radial-gradient(ellipse,rgba(0,0,0,.72),rgba(0,0,0,0) 75%)" id="rvTxt"><div style="color:${s.col};letter-spacing:.3em;font-size:.85rem;font-weight:800">A SECRET MAP APPEARED</div><h2 class="disp" style="font-size:clamp(1.8rem,7vw,3.2rem);margin:.5rem 0;color:#fff;text-shadow:0 0 18px ${s.col}">${s.name}</h2><div style="color:${s.col};font-weight:700">${s.sub}</div><p style="max-width:460px;margin:.9rem auto;color:#ddd">${s.id==='balete'?'The roots whisper your name\u2026':s.id==='mansion'?'A music box plays somewhere in the dark\u2026':'The ground shakes with giant footsteps\u2026'}</p><p class="muted" style="max-width:460px;margin:0 auto 1rem">Once you step through, the road back is sealed until you beat <b style="color:#fff">${s.boss}</b>.</p><div class="row" style="gap:.6rem;justify-content:center;flex-wrap:wrap"><button class="btn" id="rvGo">Enter the portal</button><button class="btn ghost" id="rvLater">Later</button></div></div>`);
 $('#ui').appendChild(ov);rumble(2.4,50,95,.3);
 let closed=false;const timers=[];
 const later=(fn,ms)=>timers.push(setTimeout(()=>{if(!closed)fn()},ms));
 later(()=>{const r=$('#rvRift');if(r){r.style.height='70%';r.style.width='26px'}},60);
 later(()=>{ztone(220,1.6,'sawtooth',.06,0,880);[523,659,784,1047].forEach((f,i)=>ztone(f,.8,'triangle',.1,i*.15));bg.style.opacity='1';bg.style.filter='blur(2px) brightness(.8)';const t=$('#rvTxt');if(t)t.style.opacity='1';const r=$('#rvRift');if(r)r.style.opacity='.25'},1900);
 const close=cb=>{if(closed)return;closed=true;timers.forEach(clearTimeout);stopSecretAudio();ov.remove();cb&&cb()};
 $('#rvLater').onclick=()=>close(after);$('#rvGo').onclick=()=>close(()=>startPortal(id))}

/* ===== Story-scene life: walk-ins, idle motion, turning, speaker emphasis, camera drift, soft SFX (no voices) ===== */
(function(){
 const vol=()=>S&&S.st&&S.st.sfx!=null?S.st.sfx:.8;
 const step=(v)=>{try{ztone(90+Math.random()*30,.07,'triangle',.05*vol()*v,0,60)}catch(e){}};
 const whoosh=()=>{try{ztone(500,.35,'sine',.03*vol(),0,160)}catch(e){}};
 const pop=(f)=>{try{ztone(f,.09,'square',.025*vol(),0,f*1.3)}catch(e){}};
 let st=null;
 function setup(ov){
  const ch=[...ov.querySelectorAll('#stChars img')];if(!ch.length)return null;
  const bg=ov.querySelector('canvas');
  ch.forEach((im,i)=>{im.style.transformOrigin='50% 100%';im.style.willChange='transform'});
  return {ov,ch,bg,t0:performance.now(),lastWho:'',stepAt:[0,0],react:0,pts:ch.map(()=>({x:i0(),ph:Math.random()*6}))};
 }
 const i0=()=>0;
 function tick(now){
  requestAnimationFrame(tick);
  const ov=document.getElementById('storyUi');
  if(!ov){st=null;return}
  if(!st||st.ov!==ov){st=setup(ov);if(!st)return;whoosh()}
  const t=(now-st.t0)/1000,txt=document.getElementById('stTxt'),lab=txt?(txt.querySelector('b')||{}).textContent||'':'';
  const who=/hev/i.test(lab)?0:/dag/i.test(lab)?1:-1;
  if(who!==st.lastWho){st.lastWho=who;st.react=t;if(who>=0)pop(who===0?620:330)}
  const n=st.ch.length,walk=Math.min(1,t/1.4);
  st.ch.forEach((im,i)=>{
   const side=i===0?-1:1,ease=1-Math.pow(1-walk,3),dx=(1-ease)*side*180;
   const walking=walk<1,bob=walking?Math.abs(Math.sin(t*9+i))*10:Math.sin(t*1.8+i*1.7)*3;
   const spk=who===i,rt=Math.max(0,1-(t-st.react)*2.2);
   const lean=spk?(side*-4*Math.min(1,(t-st.react)*3)):0;
   const hop=spk?-Math.sin(Math.min(1,(t-st.react)*3)*Math.PI)*10:0;
   const sc=spk?1.04:.97,flip=1;
   im.style.opacity=walking?Math.min(1,.2+walk*1.2):(spk?1:.82);
   im.style.transform=`translate(${dx}px,${-bob+hop}px) rotate(${lean+Math.sin(t*1.3+i)*(walking?3:.8)}deg) scale(${sc*flip},${sc*(1+Math.sin(t*2.2+i)*.012)})`;
   if(walking&&Math.sin(t*9+i)<-.97&&now-st.stepAt[i]>180){st.stepAt[i]=now;step(1)}
  });
  if(st.bg)st.bg.style.transform=`scale(${1.04+Math.min(.06,t*.004)}) translate(${Math.sin(t*.25)*6}px,${Math.cos(t*.2)*3}px)`;
 }
 requestAnimationFrame(tick);
})();

/* press pop on every button + screen wipe layer */
(function(){if(!document.getElementById('wipe')){const w=document.createElement('div');w.id='wipe';document.body.appendChild(w)}
 document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('button,.btn,.tab,.ob,.ibtn');if(!b||b.disabled)return;b.classList.remove('rip');void b.offsetWidth;b.classList.add('rip');setTimeout(()=>b.classList.remove('rip'),340)},true)})();

/* ===== Character voices: each character/boss has their own synthesized talking voice (no recordings, works offline) ===== */
const VOICES={
 'Rootbound Guardian':{f:88,v:16,t:'sawtooth',d:.12,g:.055,ts:{p:.1,r:.75}},'Lady of Midnight':{f:540,v:60,t:'sine',d:.1,g:.08,vib:1,ts:{p:1.9,r:.85}},'Ancient Kapre':{f:66,v:10,t:'sawtooth',d:.14,g:.06,ts:{p:.1,r:.7}},
 'Mang Tomas':{f:150,v:20,t:'triangle',d:.1,g:.07,ts:{p:.7,r:.85}},'BeatBuster':{f:300,v:150,t:'square',d:.06,g:.035,ts:{p:1,r:1.2}}};
function voiceProfile(name){name=(name||'').replace(/[:@]/g,'').trim();if(!name||/narrat|^$/i.test(name)||/^(hev|uncle dags|dags)$/i.test(name))return null;if(VOICES[name])return VOICES[name];
 let h=0;for(const c of name)h=(h*31+c.charCodeAt(0))>>>0;const low=h%3===0;return{f:low?80+h%60:200+h%260,v:20+h%50,t:['triangle','square','sawtooth','sine'][h%4],d:.08+(h%5)*.01,g:.05,ts:{p:low?.3:1+(h%10)/10,r:.9}}}
let voiceTimer=[];
function voiceStop(){voiceTimer.forEach(clearTimeout);voiceTimer=[];try{if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}}
function voiceLine(name,text){try{if(!S||!S.st)return;const pr=voiceProfile(name);if(!pr)return;
 const clean=String(text||'').replace(/<[^>]+>/g,'').replace(/&[a-z]+;/g,' ').trim();if(!clean)return;voiceStop();
 const vol=(S.st.sfx==null?.8:S.st.sfx),n=Math.min(36,Math.max(5,Math.round(clean.length/2.6)));let seed=clean.length*7+(name||'').length;
 for(let i=0;i<n;i++){const ch=clean[Math.min(clean.length-1,Math.floor(i*clean.length/n))],vow=/[aeiouAEIOU]/.test(ch);if(/[\s,.!?]/.test(ch)&&i%3===0)continue;
  voiceTimer.push(setTimeout(()=>{seed=(seed*9301+49297)%233280;const r=seed/233280,f=pr.f+(r-.5)*2*pr.v*(vow?1:.5);tone(f,pr.d,pr.t,pr.g*vol*(vow?1:.7),pr.vib?f*.06:0)},i*pr.d*1000*.85))}
 if(S.st.tts&&window.speechSynthesis){const u=new SpeechSynthesisUtterance(clean);const vs=speechSynthesis.getVoices();u.voice=vs.find(v=>/^(fil|tl)/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null;u.pitch=pr.ts.p;u.rate=pr.ts.r;u.volume=Math.min(1,vol);speechSynthesis.speak(u)}}catch(e){}}
(function(){const _say=say;say=function(w,t,ms){_say(w,t,ms);voiceLine(w,t)};
 let last='';const mo=new MutationObserver(()=>{const el=document.getElementById('stTxt');if(!el){last='';return}const txt=el.textContent.trim();if(!txt||txt===last)return;last=txt;
  const b=el.querySelector('b');const who=b?b.textContent.replace(/[:]/g,'').trim():'';const body=b?txt.slice(b.textContent.length).trim():txt;
  if(!/^(Next|Done|Skip)$/i.test(body))voiceLine(who,body.replace(/(Next|Done)$/,''))});
 mo.observe(document.getElementById('ui')||document.body,{childList:true,subtree:true,characterData:true})})();

/* ============ main: input, resize, loop, init ============ */
function resizeAll(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);for(const k in cams){cams[k].aspect=w/h;cams[k].updateProjectionMatrix()}}
addEventListener('resize',resizeAll);
let T=0,last=performance.now();
addEventListener('pointermove',e=>{ptr.x=(e.clientX/innerWidth-.5)*2;ptr.y=-((e.clientY/innerHeight)-.5)*2});
let sw0=null;
const arenaX=cx=>clamp((cx/innerWidth-.5)*2*(RS?RS.vis:10),-ARENA.A,ARENA.A);
addEventListener('pointerdown',e=>{firstTouch();if(mode==='run'&&G&&G.explore&&!SH&&!e.target.closest('button')){G.so={x:e.clientX,y:e.clientY};G.stick={x:0,y:0};G.sid=e.pointerId;return}if(mode==='run'&&!SH&&!e.target.closest('button')){if(G&&G.arena&&e.pointerType!=='mouse'){G.drag=arenaX(e.clientX);G.dragId=e.pointerId}sw0={x:e.clientX,y:e.clientY,t:performance.now()}}});
addEventListener('pointermove',e=>{if(G&&G.explore&&G.so&&e.pointerId===G.sid){G.stick={x:e.clientX-G.so.x,y:e.clientY-G.so.y};return}if(G&&G.arena&&G.drag!=null&&e.pointerId===G.dragId)G.drag=arenaX(e.clientX)});
addEventListener('pointercancel',()=>{if(G)G.drag=null});
addEventListener('pointerup',e=>{if(G&&G.explore){G.stick=null;G.so=null;if(sw0&&sw0.y-e.clientY>60&&G.y<=0){G.vy=9;SFX.jump()}sw0=null;return}if(G&&G.arena)G.drag=null;if(!sw0)return;if(G&&G.arena){const m=Math.hypot(e.clientX-sw0.x,e.clientY-sw0.y);const up=sw0.y-e.clientY>60;sw0=null;if(up)jump();return}const dx=e.clientX-sw0.x,dy=e.clientY-sw0.y,th=46/(S.st.sens||1);sw0=null;if(!S.st.touch||mode!=='run'||SH)return;
 if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>th)laneMove(dx>0?1:-1);else if(dy<-th)jump();else if(dy>th)slide();else if(Math.abs(dx)<12&&Math.abs(dy)<12)jump()});
addEventListener('keyup',e=>{const k=e.key;if(k==='ArrowLeft'||k==='a'||k==='A')keysDown.left=false;if(k==='ArrowRight'||k==='d'||k==='D')keysDown.right=false;if(k==='ArrowUp'||k==='w'||k==='W')keysDown.up=false;if(k==='ArrowDown')keysDown.down=false;if(k==='s'||k==='S')keysDown.sprint=false});
addEventListener('keydown',e=>{if(e.target.matches&&e.target.matches('input,select,textarea'))return;const k=e.key;
 if(mode==='run'&&G&&G.explore){if(k==='ArrowLeft'||k==='a'||k==='A')keysDown.left=true;else if(k==='ArrowRight'||k==='d'||k==='D')keysDown.right=true;else if(k==='ArrowUp'||k==='w'||k==='W')keysDown.up=true;else if(k==='ArrowDown')keysDown.down=true;else if(k==='s'||k==='S')keysDown.sprint=true;else if(k===' '){if(G.y<=0&&!G.pause){G.vy=9;SFX.jump()}}else if(k==='p'||k==='P'||k==='Escape'){if(G.pause&&SH&&!G.over)resumeRun();else pauseRun()}if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k))e.preventDefault()}
 else if(mode==='run'&&G&&G.arena){if(k==='ArrowLeft'||k==='a'||k==='A')keysDown.left=true;else if(k==='ArrowRight'||k==='d'||k==='D')keysDown.right=true;else if(k==='ArrowUp'||k==='w'||k==='W')jump();else if(k===' ')jump();else if(k==='s'||k==='S'||k==='ArrowDown')catchPulse();else if(k==='q'||k==='Q')usePet();else if((k==='e'||k==='E')&&G.kind!=='boss')usePower();else if(k==='1')bossPower(0);else if(k==='2')bossPower(1);else if(k==='p'||k==='P'||k==='Escape'){if(G.pause&&SH&&!G.fin)resumeRun();else pauseRun()}if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k))e.preventDefault()}
 else if(mode==='run'){if(k==='ArrowLeft'||k==='a'||k==='A')laneMove(-1);else if(k==='ArrowRight'||k==='d'||k==='D')laneMove(1);else if(k==='ArrowUp'||k==='w'||k==='W'||k===' ')jump();else if(k==='ArrowDown'||k==='s'||k==='S')slide();else if(k==='q'||k==='Q')usePet();else if(k==='e'||k==='E')usePower();
  else if(k==='p'||k==='P'||k==='Escape'){if(G&&G.pause&&SH&&!G.fin)resumeRun();else pauseRun()}
  if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k))e.preventDefault()}
 else if(k==='Escape'&&SH&&!SH.noClose)closeSheet()});
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
 try{if(mode==='home'||mode==='title'||mode==='cust')bgFrame(T,dt);
  else if(mode==='cine'&&cine){cineUpdate(dt,T);render(SCN.stage.sc,SCN.stage.cam)}
  else if(mode==='run')runUpdate(dt);
  else if(mode==='play'){playUpdate(dt,T);render(SCN.play.sc,SCN.play.cam)}}catch(err){console.error(err)}}
async function init(){
 load();const resetOk=applyProgressReset();if(!S.mu.v2){S.mu.v2=1;[4,5,6,7].forEach(i=>{if(!S.mu.list.includes(i))S.mu.list.push(i)})}S.favs=S.favs||[];if(S.bossWon&&!S.lifeMsgSeen)S.pendingReconcile=true;try{reconcileRewards()}catch(e){}S.scam=S.scam||{day:'',n:0};
 await loadArt();
 S.look=(S.look&&S.look.hs)?S.look:null; /* looks from the old 3D avatar builder are replaced by the illustrated styles */
 buildTitle();buildHome();initCust();setupStage();setupPlay();applyPrefs();
 $('#btnPause').innerHTML=ICO.pause;$('#btnPause').addEventListener('click',pauseRun);$('#btnPet').addEventListener('click',usePet);$('#btnPow').addEventListener('click',usePower);$('#btnSkip').addEventListener('click',skipCine);
 $('#icoCoin2').innerHTML=ICO.coin;
 schedulePetEggs();resizeAll();showTitle();requestAnimationFrame(t=>{last=t;frame(t)});
 if(!resetOk)setTimeout(()=>toast('The one-time reset was skipped because the save backup could not be verified. Your progress was kept.'),900);
 setTimeout(()=>$('#load').classList.add('out'),250)}
window.__game={get S(){return S},get G(){return G},get mode(){return mode}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

/* ---- sound files from the original game: assets/catch.wav and assets/miss.wav (bgMusic is the <audio> used by the jukebox) ---- */
function playFile(id,rate=1){try{const a=document.getElementById(id);if(!a)return;const c=a.cloneNode(true);c.volume=clamp(S.st.sfx,0,1);c.playbackRate=rate;c.play().catch(()=>{})}catch(e){}}
(function(){const c0=SFX.coin,h0=SFX.hit;SFX.coin=n=>{c0(n);playFile('catchSound',1+Math.min(n||0,12)*.03)};SFX.hit=()=>{h0();playFile('missSound')}})();
