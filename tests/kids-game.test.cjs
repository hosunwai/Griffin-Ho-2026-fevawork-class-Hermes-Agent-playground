const {test}=require('node:test');
const assert=require('node:assert/strict');
let engine={};try{engine=require('../kids-engine.js')}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e}
test('math questions have four unique choices, one correct answer and nonnegative results within 20',()=>{
 assert.equal(typeof engine.mathQuestion,'function');
 let operations=new Set();
 for(let i=0;i<3000;i++){
  const q=engine.mathQuestion();operations.add(q.op);
  assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);
  assert.equal(q.choices.filter(x=>x===q.answer).length,1);
  assert(q.a>=0&&q.a<=20&&q.b>=0&&q.b<=20);
  assert.equal(q.answer,q.op==='+'?q.a+q.b:q.a-q.b);
  assert(q.answer>=0&&q.answer<=20);
  assert(q.choices.every(x=>Number.isInteger(x)&&x>=0&&x<=20));
 }
 assert.equal(operations.size,2);
});
test('round scores each question once, advances only after answering and finishes at ten',()=>{
 assert.equal(typeof engine.createGame,'function');
 const g=engine.createGame('english');assert.equal(g.score,0);
 assert.equal(g.next(),false);
 assert.equal(g.submit('not a choice'),false);assert.equal(g.answered,false);
 for(let i=0;i<10;i++){
  assert.equal(g.index,i);
  const answer=g.question.answer;
  assert.equal(g.submit(i===0?g.question.choices.find(c=>c!==answer):answer),true);
  const before=g.score;assert.equal(g.submit(answer),false);assert.equal(g.score,before);
  assert.equal(g.next(),true);
 }
 assert.equal(g.score,90);assert.equal(g.correct,9);assert.equal(g.finished,true);assert.equal(g.next(),false);
 const m=engine.createGame('math');assert.equal(m.score,0);assert.equal(m.index,0);
});
test('English rounds contain ten distinct pictures and four distinct words with one answer',()=>{
 assert.equal(typeof engine.englishRound,'function');
 for(let i=0;i<100;i++){
  const qs=engine.englishRound();assert.equal(qs.length,10);
  assert.equal(new Set(qs.map(q=>q.answer)).size,10);
  for(const q of qs){assert(q.picture&&q.zh);assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.equal(q.choices.filter(x=>x===q.answer).length,1)}
 }
});
