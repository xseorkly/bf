document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY="bac_fr_checklist";
  const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
  const ACTIVITY_KEY="bac_fr_activity_dates";
  const ERROR_KEY="bac_fr_error_entries";
  function isoDate(d=new Date()){return d.toISOString().slice(0,10)}
  function logLearningActivity(){let dates=[];try{dates=JSON.parse(localStorage.getItem(ACTIVITY_KEY)||"[]")}catch(e){}const t=isoDate();if(!dates.includes(t)){dates.push(t);localStorage.setItem(ACTIVITY_KEY,JSON.stringify(dates))}updateRegularity()}
  function weekKey(s){const d=new Date(s+"T12:00:00"),day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return isoDate(d)}
  function updateRegularity(){const el=document.getElementById("streak-counter"),detail=document.getElementById("regularity-detail");if(!el&&!detail)return;let dates=[];try{dates=JSON.parse(localStorage.getItem(ACTIVITY_KEY)||"[]")}catch(e){}const weeks=[...new Set(dates.map(weekKey))].sort(),current=weekKey(isoDate());let streak=0,cursor=new Date(current+"T12:00:00");while(weeks.includes(isoDate(cursor))){streak++;cursor.setDate(cursor.getDate()-7)}if(el)el.innerHTML='<span class="flame">🔥</span> Série de régularité : <strong>'+streak+' semaine'+(streak>1?'s':'')+'</strong>';if(detail)detail.textContent=dates.length?'Dernière activité : '+dates.sort().slice(-1)[0]+' • une semaine compte dès qu’une validation ou une révision du carnet est effectuée.':'Aucune activité validée pour le moment.'}

  function save(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(saved)); }

  document.querySelectorAll('.check input[type=checkbox], .mastery input[type=checkbox]').forEach(cb=>{
    if(saved[cb.id]) cb.checked=true;
    cb.addEventListener('change',()=>{saved[cb.id]=cb.checked;if(cb.checked)logLearningActivity();save();updatePageProgress();updateDashboard();});
  });

  // Mobile navigation
  const navWrap=document.querySelector('header .nav');
  const toggle=document.querySelector('.menu-toggle');
  if(toggle && navWrap){
    toggle.addEventListener('click',()=>{
      const open=navWrap.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded',String(open));
    });
  }

  // Open a module when arriving via a hash
  if(location.hash){
    const target=document.querySelector(location.hash);
    if(target && target.tagName==='DETAILS') target.open=true;
  }

  // Per-page progress on autonomous pathways
  function updatePageProgress(){
    const list=document.querySelector('.module-list');
    if(!list) return;
    const checks=[...list.querySelectorAll('input[type=checkbox]')];
    if(!checks.length) return;
    let panel=document.getElementById('pageProgress');
    if(!panel){
      panel=document.createElement('div'); panel.id='pageProgress'; panel.className='progress-panel';
      panel.innerHTML='<div class="progress-row"><strong>Progression de cette matière</strong><strong class="pct">0 %</strong></div><div class="progress-track"><div class="progress-fill"></div></div><div class="btns"><a class="btn secondary continue-btn" href="#">Continuer au premier module incomplet</a></div>';
      list.parentNode.insertBefore(panel,list);
    }
    const done=checks.filter(c=>c.checked).length, pct=Math.round(done/checks.length*100);
    panel.querySelector('.pct').textContent=pct+' %'; panel.querySelector('.progress-fill').style.width=pct+'%';
    const firstIncomplete=[...list.querySelectorAll('details.module')].find(d=>[...d.querySelectorAll('input[type=checkbox]')].some(c=>!c.checked));
    const btn=panel.querySelector('.continue-btn');
    if(firstIncomplete){ btn.style.display='inline-flex'; btn.href='#'+firstIncomplete.id; btn.onclick=()=>{firstIncomplete.open=true}; }
    else { btn.textContent='Parcours validé ✓'; btn.removeAttribute('href'); btn.style.pointerEvents='none'; }
  }
  updatePageProgress();

  // Dashboard
  function updateDashboard(){
    const cards=[...document.querySelectorAll('.progress-card[data-ids]')];
    if(!cards.length) return;
    let total=0,done=0;
    cards.forEach(card=>{
      let ids=[]; try{ids=JSON.parse(card.dataset.ids)}catch(e){}
      const d=ids.filter(id=>saved[id]).length, pct=ids.length?Math.round(d/ids.length*100):0;
      total+=ids.length; done+=d;
      card.querySelector('.pc-pct').textContent=pct+' %'; card.querySelector('.progress-fill').style.width=pct+'%';
    });
    const pct=total?Math.round(done/total*100):0;
    const gp=document.getElementById('globalPct'), gf=document.getElementById('globalFill'), gc=document.getElementById('globalCount');
    if(gp) gp.textContent=pct+' %'; if(gf) gf.style.width=pct+'%'; if(gc) gc.textContent=done+' validations sur '+total;
  }
  updateDashboard();
  updateRegularity();

  const exportBtn=document.getElementById('exportProgress');
  if(exportBtn)exportBtn.addEventListener('click',()=>{let errors=[],activity=[];try{errors=JSON.parse(localStorage.getItem(ERROR_KEY)||"[]")}catch(e){}try{activity=JSON.parse(localStorage.getItem(ACTIVITY_KEY)||"[]")}catch(e){}const payload={version:2,exportedAt:new Date().toISOString(),checklist:saved,errors,activity};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='parcours-bac-francais-sauvegarde.json';a.click();URL.revokeObjectURL(a.href)});
  const importInput=document.getElementById('importProgress');
  if(importInput)importInput.addEventListener('change',async()=>{const f=importInput.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(data&&data.version===2){localStorage.setItem(STORAGE_KEY,JSON.stringify(data.checklist||{}));localStorage.setItem(ERROR_KEY,JSON.stringify(data.errors||[]));localStorage.setItem(ACTIVITY_KEY,JSON.stringify(data.activity||[]))}else{localStorage.setItem(STORAGE_KEY,JSON.stringify(data||{}))}location.reload()}catch(e){alert('Fichier de sauvegarde invalide.')}});
  const resetBtn=document.getElementById('resetProgress');
  if(resetBtn) resetBtn.addEventListener('click',()=>{
    if(confirm('Réinitialiser toutes les cases de progression ?')){ localStorage.removeItem(STORAGE_KEY); location.reload(); }
  });

  // Search page
  const search=document.getElementById('siteSearch');
  if(search && Array.isArray(window.SITE_SEARCH_INDEX)){
    const out=document.getElementById('searchResults'), count=document.getElementById('searchCount');
    const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    search.addEventListener('input',()=>{
      const q=norm(search.value.trim()); out.innerHTML='';
      if(q.length<2){count.textContent='Saisis au moins 2 caractères.';return;}
      const terms=q.split(/\s+/).filter(Boolean);
      const results=window.SITE_SEARCH_INDEX.filter(e=>{const hay=norm(e.title+' '+e.page+' '+e.excerpt);return terms.every(t=>hay.includes(t));}).slice(0,80);
      count.textContent=results.length+' résultat(s)';
      results.forEach(e=>{const d=document.createElement('div');d.className='search-result';d.innerHTML='<a href="'+e.url+'"><strong>'+e.title+'</strong></a><br><small>'+e.page+'</small><p>'+e.excerpt+'</p>';out.appendChild(d);});
    });
  }

  // Back to top
  const back=document.createElement('button'); back.className='back-top'; back.setAttribute('aria-label','Retour en haut'); back.textContent='↑'; document.body.appendChild(back);
  window.addEventListener('scroll',()=>back.classList.toggle('show',scrollY>700)); back.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
});
