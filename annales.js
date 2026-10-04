
document.addEventListener("DOMContentLoaded",()=>{
  const BANK=window.ANNALES_BANK||[];
  const PKEY="bac_fr_annales_progress";
  let progress={}; try{progress=JSON.parse(localStorage.getItem(PKEY)||"{}")}catch(e){}
  const save=()=>localStorage.setItem(PKEY,JSON.stringify(progress));
  const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

  function card(e,mini=false){
    const p=progress[e.id]||{};
    const compat=e.exact_current?'<span class="ab ok">référence actuelle</span>':'<span class="ab warn">archive / à contextualiser</span>';
    if(mini){
      return `<div class="mini-annale"><strong>${esc(e.title)}</strong>
      <span class="small">${esc(e.annee)} • ${esc(e.difficulte)} • ${esc(e.type)}</span>
      <a class="rlink" href="${e.url}" target="_blank" rel="noopener">Ouvrir ↗</a></div>`;
    }
    return `<article class="annale-card" data-id="${e.id}">
      <div class="annale-badges"><span class="ab year">${esc(e.annee)}</span><span class="ab diff">${esc(e.difficulte)}</span><span class="ab type">${esc(e.type)}</span>${compat}</div>
      <h3>${esc(e.title)}</h3>
      <div><strong>${esc(e.matiere)}</strong> — ${esc(e.chapitre)}</div>
      <div class="small">${esc(e.source)} • correction : ${esc(e.correction)}</div>
      ${e.note?`<p class="small">${esc(e.note)}</p>`:""}
      <div class="annale-actions"><a class="btn secondary" href="${e.url}" target="_blank" rel="noopener">Ouvrir le sujet / la banque ↗</a></div>
      <div class="annale-progress">
        <label><input type="checkbox" class="annale-done" ${p.done?"checked":""}/> Fait</label>
        <label>Score <input type="number" class="annale-score" min="0" max="20" step="0.5" value="${p.score??""}" placeholder="/20"/></label>
      </div>
    </article>`;
  }

  // Module pages: inject the most relevant annals automatically.
  document.querySelectorAll(".module-annales[data-module-id]").forEach(box=>{
    const mid=box.dataset.moduleId;
    const hits=BANK.filter(e=>(e.modules||[]).includes(mid));
    if(!hits.length){
      box.innerHTML='<h4>Annales liées</h4><p class="small">Pas de banque publique spécifique repérée pour ce module. Utilise le format officiel et les exercices du parcours.</p>';
      return;
    }
    hits.sort((a,b)=>String(b.annee).localeCompare(String(a.annee)) || (a.exact_current===b.exact_current?0:(a.exact_current?-1:1)));
    box.innerHTML=`<h4>Annales liées à ce module</h4><div class="module-annales-grid">${hits.slice(0,4).map(e=>card(e,true)).join("")}</div>
      <div class="btns"><a class="btn secondary" href="annales.html?module=${encodeURIComponent(mid)}">Voir toute la sélection liée →</a></div>`;
  });

  // Bank page
  const list=document.getElementById("annalesList");
  if(!list) return;
  const level=document.getElementById("fLevel"),subj=document.getElementById("fSubject"),
        chap=document.getElementById("fChapter"),diff=document.getElementById("fDifficulty"),
        year=document.getElementById("fYear"),kind=document.getElementById("fType"),
        text=document.getElementById("fText"),status=document.getElementById("fStatus"),
        count=document.getElementById("annalesCount"),annCount=document.getElementById("realAnnalesCount");

  function fill(sel,vals,label){
    const old=sel.value;
    sel.innerHTML=`<option value="">${label}</option>`+[...new Set(vals.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),"fr",{numeric:true})).map(v=>`<option>${esc(v)}</option>`).join("");
    if([...sel.options].some(o=>o.value===old))sel.value=old;
  }
  fill(subj,BANK.map(x=>x.matiere),"Toutes les matières");
  fill(diff,BANK.map(x=>x.difficulte),"Toutes difficultés");
  fill(year,BANK.map(x=>x.annee),"Toutes années");
  fill(kind,BANK.map(x=>x.type),"Tous types");

  const qs=new URLSearchParams(location.search);
  if(qs.get("niveau"))level.value=qs.get("niveau");
  if(qs.get("matiere"))subj.value=qs.get("matiere");
  if(qs.get("difficulte"))diff.value=qs.get("difficulte");
  if(qs.get("annee"))year.value=qs.get("annee");

  function render(){
    const module=qs.get("module")||"";
    let rows=BANK.filter(e=>{
      const p=progress[e.id]||{};
      const hay=(e.title+" "+e.matiere+" "+e.chapitre+" "+e.note+" "+e.source).toLowerCase();
      return (!module||(e.modules||[]).includes(module)) &&
        (!level.value||e.niveau===level.value) &&
        (!subj.value||e.matiere===subj.value) &&
        (!chap.value||e.chapitre===chap.value) &&
        (!diff.value||e.difficulte===diff.value) &&
        (!year.value||e.annee===year.value) &&
        (!kind.value||e.type===kind.value) &&
        (!status.value||(status.value==="done"?p.done:!p.done)) &&
        (!text.value.trim()||hay.includes(text.value.trim().toLowerCase()));
    });
    // Update chapter choices from current level+subject for usability.
    const possible=BANK.filter(e=>(!level.value||e.niveau===level.value)&&(!subj.value||e.matiere===subj.value));
    const oldChap=chap.value; fill(chap,possible.map(x=>x.chapitre),"Tous chapitres"); if([...chap.options].some(o=>o.value===oldChap))chap.value=oldChap;
    rows.sort((a,b)=>{
      const ay=parseInt(a.annee),by=parseInt(b.annee);
      if(!isNaN(ay)&&!isNaN(by)&&ay!==by)return by-ay;
      if(a.niveau!==b.niveau)return a.niveau.localeCompare(b.niveau);
      return a.matiere.localeCompare(b.matiere);
    });
    count.textContent=rows.length+" ressource"+(rows.length>1?"s":"");
    annCount.textContent=rows.filter(x=>x.annale).length+" annale"+(rows.filter(x=>x.annale).length>1?"s":"")+" / sujets d’entraînement";
    list.innerHTML=rows.length?rows.map(e=>card(e)).join(""):'<div class="empty-state">Aucune ressource ne correspond à ces filtres.</div>';
  }

  [level,subj,chap,diff,year,kind,status].forEach(x=>x.addEventListener("change",render));
  text.addEventListener("input",render);

  list.addEventListener("change",ev=>{
    const card=ev.target.closest(".annale-card"); if(!card)return;
    const id=card.dataset.id; progress[id]=progress[id]||{};
    if(ev.target.classList.contains("annale-done"))progress[id].done=ev.target.checked;
    if(ev.target.classList.contains("annale-score"))progress[id].score=ev.target.value;
    save();
  });
  render();
});
