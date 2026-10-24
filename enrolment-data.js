(function(root){'use strict';
const courses={ai:'AI小小探索班',python:'兒童Python啟蒙班',primary:'小學全科提升班',art:'創意繪畫小達人班'};
const grades={K:'幼稚園',P1:'小一',P2:'小二',P3:'小三',P4:'小四',P5:'小五',P6:'小六',other:'其他'};
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function validate(d,now=today()){
 const e={};for(const k of ['parentName','childName'])if(typeof d[k]!=='string'||!d[k].trim()||d[k].trim().length>60)e[k]='請填寫 1–60 字的虛構姓名。';
 const p=String(d.phone||'').replace(/[\s-]/g,'').replace(/^\+852/,'');if(!(/^[2-9]\d{7}$/.test(p)||p==='00000000'))e.phone='請輸入 8 位香港電話格式，或使用示範號碼 00000000。';
 if(typeof d.email!=='string'||d.email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))e.email='請輸入完整 Email 格式，例如 parent@example.invalid。';
 const birth=String(d.dob||'');const date=new Date(birth+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(birth)||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==birth||birth>now||birth<'1900-01-01')e.dob='請輸入有效的虛構日期（1900 年起，不能是未來日期）。';
 if(!Object.hasOwn(grades,d.grade))e.grade='請選擇就讀年級。';if(!Object.hasOwn(courses,d.course))e.course='請選擇想報讀的課程。';
 if(d.notes!==undefined&&(typeof d.notes!=='string'||d.notes.length>1000))e.notes='備註最多 1,000 字。';if(d.acknowledged!==true)e.acknowledged='請確認只使用虛構資料，並了解這是本機示範。';return e;
}
const storageKey='jec-classroom-applications-v1';
function createStore(storage){return {
 list(){let raw;try{raw=storage.getItem(storageKey)}catch(e){throw Error('無法讀取本機儲存，請檢查瀏覽器設定。')}if(raw===null)return [];let records;try{records=JSON.parse(raw)}catch(e){throw Error('示範紀錄格式損壞，請到管理頁清除本機示範紀錄。')}if(!Array.isArray(records)||records.length>100||records.some(r=>!r||typeof r.id!=='string'||!/^DEMO-[a-zA-Z0-9-]+$/.test(r.id)||typeof r.createdAt!=='string'||!Number.isFinite(Date.parse(r.createdAt))||Object.keys(validate({...r,acknowledged:true})).length))throw Error('示範紀錄格式損壞，請清除本機示範紀錄後再試。');return records},
 add(data){if(Object.keys(validate(data)).length)throw Error('資料格式不正確，請檢查表格。');const all=this.list();if(all.length>=100)throw Error('已達 100 筆示範紀錄上限，請先到管理頁清除紀錄。');const row={};for(const k of ['parentName','phone','email','childName','dob','grade','course','notes'])row[k]=String(data[k]||'').trim();row.id='DEMO-'+(globalThis.crypto&&globalThis.crypto.randomUUID?globalThis.crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));row.createdAt=new Date().toISOString();try{storage.setItem(storageKey,JSON.stringify([row,...all]))}catch(e){throw Error('未能儲存：瀏覽器可能封鎖本機儲存或空間已滿。請勿視為報名成功。')}return row},
 get(id){return this.list().find(r=>r.id===id)||null},
 clear(){try{storage.removeItem(storageKey)}catch(e){throw Error('未能清除本機示範紀錄。')}}
};}
const api={courses,grades,today,validate,createStore,storageKey};if(typeof module==='object'&&module.exports)module.exports=api;else root.JECDemo=api;
})(typeof window!=='undefined'?window:globalThis);
