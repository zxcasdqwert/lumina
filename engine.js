/* Pure match engine. No UI, network or platform dependencies. */
(function(root){
'use strict';
const N=8, TYPES=6;
function matchLines(b){const lines=[];for(const axis of ['h','v'])for(let outer=0;outer<N;outer++){let start=0;while(start<N){const index=k=>axis==='h'?outer*N+k:k*N+outer,type=b[index(start)];let end=start+1;while(end<N&&b[index(end)]===type)end++;if(type>=0&&end-start>=3)lines.push({axis,type,cells:Array.from({length:end-start},(_,k)=>index(start+k))});start=end;}}return lines;}
function matches(b){return [...new Set(matchLines(b).flatMap(line=>line.cells))];}
function adjacent(a,b){return Math.abs(a%N-b%N)+Math.abs(Math.floor(a/N)-Math.floor(b/N))===1;}
function swap(b,a,c){[b[a],b[c]]=[b[c],b[a]];}
function moves(b){const out=[];for(let i=0;i<64;i++)for(const j of [i%8<7?i+1:-1,i<56?i+8:-1]){if(j<0||b[i]===b[j])continue;swap(b,i,j);if(matches(b).length)out.push([i,j]);swap(b,i,j);}return out;}
function board(rng=Math.random){for(let attempt=0;attempt<1000;attempt++){let b=[];for(let i=0;i<64;i++){let choices=Array.from({length:TYPES},(_,k)=>k).filter(t=>!(i%8>=2&&b[i-1]===t&&b[i-2]===t)&&!(i>=16&&b[i-8]===t&&b[i-16]===t));b.push(choices[Math.floor(rng()*choices.length)]);}if(moves(b).length)return b;}throw Error('Board generation failed');}
function refill(b,rng=Math.random){for(let c=0;c<N;c++){let values=[];for(let r=7;r>=0;r--)if(b[r*8+c]>=0)values.push(b[r*8+c]);for(let r=7;r>=0;r--)b[r*8+c]=values[7-r]??Math.floor(rng()*TYPES);}return b;}
function shuffle(b,rng=Math.random){const original=b.slice();let seed=7919;for(let tries=0;tries<10000;tries++){const random=tries<300?rng:()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);b.splice(0,64,...original);for(let i=63;i>0;i--){const j=Math.floor(random()*(i+1));swap(b,i,j);}if(!matches(b).length&&moves(b).length)return b;}b.splice(0,64,...original);throw Error('Cannot shuffle this inventory');}
function blast(i){let out=[];for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){let r=Math.floor(i/8)+dr,c=i%8+dc;if(r>=0&&r<8&&c>=0&&c<8)out.push(r*8+c);}return out;}
// Explicit campaign: points, requested pieces, mist, and combinations.
const levels=[
{moves:22,score:900},{moves:23,type:0,count:16},{moves:24,mist:12},
{moves:24,type:2,count:16},{moves:25,score:2700},{moves:25,mist:18},
{moves:25,type:1,count:18},{moves:26,type:3,count:17,mist:14},
{moves:26,score:3800},{moves:26,mist:24},{moves:26,type:4,count:20},
{moves:27,type:0,count:19,mist:20},{moves:27,score:4800},
{moves:27,mist:30},{moves:27,type:5,count:22},
{moves:28,type:2,count:21,mist:26},{moves:28,score:5700},
{moves:28,type:1,count:22,mist:28},{moves:29,mist:38},
{moves:30,score:4200,type:5,count:22,mist:30}];
levels.forEach(l=>{if(l.mist)l.clear=Math.ceil(l.mist*.65);});
function mistFor(n){let a=Array(64).fill(0);const order=Array.from({length:64},(_,i)=>(i*17+19)%64);order.slice(0,n).forEach(i=>a[i]=1);return a;}
function complete(s,l){return (!l.score||s.score>=l.score)&&(!l.count||s.collected[l.type]>=l.count)&&(!l.mist||l.mist-s.mist.reduce((a,b)=>a+b,0)>=l.clear);}
const Engine={N,TYPES,matchLines,matches,adjacent,swap,moves,board,refill,shuffle,blast,levels,mistFor,complete};
if(typeof module!=='undefined')module.exports=Engine;else root.Engine=Engine;
})(typeof window==='undefined'?globalThis:window);


