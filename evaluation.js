
document.addEventListener("DOMContentLoaded",()=>{
  const q=new URLSearchParams(location.search), mid=q.get("module"), d=(window.MODULE_ACTIONS||{})[mid];
  if(!d){document.getElementById("evalTitle").textContent="Module introuvable";return;}
  document.getElementById("evalTitle").textContent="Évaluation — "+d.title;
  document.getElementById("evalObjective").textContent=d.objective||"";
  document.getElementById("evalDuration").textContent=d.eval_minutes||45;
  document.getElementById("evalNote").textContent=d.eval_note||"Faire l'évaluation sans aide puis corriger.";
  const target=document.getElementById("evalExercises");
  target.innerHTML=(d.exercises||[]).slice(0,3).map(x=>`<a class="action-link exercise" href="${x.url}" ${x.url.startsWith("http")?'target="_blank" rel="noopener"':''}>${x.title} ↗</a>`).join("");
  const anns=(window.ANNALES_BANK||[]).filter(x=>(x.modules||[]).includes(mid)).slice(0,4);
  document.getElementById("evalAnnales").innerHTML=anns.map(x=>`<a class="action-link annale" href="${x.url}" target="_blank" rel="noopener">${x.title} (${x.annee}) ↗</a>`).join("")||`<a class="action-link annale" href="annales.html?module=${encodeURIComponent(mid)}">Voir la banque liée →</a>`;
  const key="bac_fr_module_eval_scores", input=document.getElementById("moduleEvalScore"), saved=document.getElementById("evalSaved");
  let scores={};try{scores=JSON.parse(localStorage.getItem(key)||"{}")}catch(e){}
  if(scores[mid]!==undefined)input.value=scores[mid];
  document.getElementById("saveEvalScore").addEventListener("click",()=>{
    if(input.value==="")return;
    scores[mid]=Number(input.value);localStorage.setItem(key,JSON.stringify(scores));saved.textContent="Score enregistré ✓";
  });
});
