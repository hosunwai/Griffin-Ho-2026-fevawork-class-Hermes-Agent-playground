const {test}=require('node:test');const assert=require('node:assert/strict');let D={};try{D=require('../enrolment-data.js')}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e}
test('demo storage persists one application, reports unavailable or corrupt storage and clears only its key',()=>{
 assert.equal(typeof D.createStore,'function');
 const mem=new Map([['unrelated','keep']]);const storage={getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,v),removeItem:k=>mem.delete(k)};
 const store=D.createStore(storage);assert.deepEqual(store.list(),[]);
 const saved=store.add(valid);assert(saved.id.startsWith('DEMO-'));assert.equal(store.list().length,1);assert.equal(store.get(saved.id).childName,valid.childName);assert.equal(store.get('missing'),null);
 assert.throws(()=>store.add({...valid,email:'broken'}));assert.equal(store.list().length,1);
 store.clear();assert.deepEqual(store.list(),[]);assert.equal(mem.get('unrelated'),'keep');
 const broken=D.createStore({getItem:()=>'{broken',setItem:()=>{throw Error('quota')}});assert.throws(()=>broken.list());
 const blocked=D.createStore({getItem:()=>null,setItem:()=>{throw Error('quota')}});assert.throws(()=>blocked.add(valid));
});
const valid={parentName:'示範家長',phone:'00000000',email:'parent@example.invalid',childName:'示範小朋友',dob:'2019-04-15',grade:'P1',course:'ai',notes:'課堂測試',acknowledged:true};
test('valid demo application passes and every required or malformed field is rejected',()=>{
 assert.equal(typeof D.validate,'function');assert.deepEqual(D.validate(valid,'2026-10-24'),{});
 for(const k of ['parentName','phone','email','childName','dob','grade','course'])assert(D.validate({...valid,[k]:''},'2026-10-24')[k],k);
 for(const [k,v] of [['phone','1234'],['phone','abcd5678'],['email','bad@'],['email','a@@b.com'],['dob','2026-10-25'],['dob','2020-02-30'],['grade','BAD'],['course','unknown'],['notes','x'.repeat(1001)],['acknowledged',false],['parentName',' '],['parentName','a'.repeat(61)]])assert(D.validate({...valid,[k]:v},'2026-10-24')[k],k);
});
