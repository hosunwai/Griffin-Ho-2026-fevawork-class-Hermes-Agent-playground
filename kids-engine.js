(function(root){
'use strict';
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function mathQuestion(){
 const op=Math.random()<0.5?'+':'−';let a,b;
 if(op==='+'){a=Math.floor(Math.random()*21);b=Math.floor(Math.random()*(21-a))}
 else{a=Math.floor(Math.random()*21);b=Math.floor(Math.random()*(a+1))}
 const answer=op==='+'?a+b:a-b;
 const others=shuffle(Array.from({length:21},(_,i)=>i).filter(n=>n!==answer)).slice(0,3);
 return {a,b,op,answer,choices:shuffle([answer,...others])};
}
const words=[['apple','蘋果'],['cat','貓'],['dog','狗'],['sun','太陽'],['fish','魚'],['ball','球'],['car','汽車'],['tree','樹'],['book','書'],['banana','香蕉'],['star','星星'],['bird','鳥']];
function englishRound(){return shuffle(words).slice(0,10).map(([answer,zh])=>({answer,zh,picture:answer,choices:shuffle([answer,...shuffle(words.filter(w=>w[0]!==answer)).slice(0,3).map(w=>w[0])])}))}
function createGame(mode){
 if(!['english','math'].includes(mode))throw new Error('不支援的遊戲模式');
 const questions=mode==='english'?englishRound():Array.from({length:10},mathQuestion);
 return {mode,index:0,score:0,correct:0,answered:false,finished:false,
 get question(){return questions[this.index]},
 submit(value){if(this.finished||this.answered||!this.question.choices.includes(value))return false;this.answered=true;if(value===this.question.answer){this.score+=10;this.correct++}return true},
 next(){if(this.finished||!this.answered)return false;if(this.index===9)this.finished=true;else{this.index++;this.answered=false}return true}
 };
}
const api={mathQuestion,englishRound,createGame};if(typeof module==='object'&&module.exports)module.exports=api;else root.KidsEngine=api;
})(typeof window!=='undefined'?window:globalThis);
