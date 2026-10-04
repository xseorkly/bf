
document.addEventListener("DOMContentLoaded",()=>{
  const DATA=window.MODULE_ACTIONS||{};
  document.querySelectorAll("details.module[id]").forEach(mod=>{
    const mid=mod.id, d=DATA[mid];
    if(!d)return;
    const stages=mod.querySelectorAll(".stage-grid .stage");
    if(stages.length<4)return;

    const links=(arr,kind)=>`<div class="action-links">${(arr||[]).slice(0,3).map(x=>
      `<a class="action-link ${kind}" href="${x.url}" ${x.url.startsWith("http")?'target="_blank" rel="noopener"':''}>${x.title} ↗</a>`
    ).join("")}</div>`;

    stages[0].classList.add("action-stage");
    stages[0].innerHTML=`<b>1. Cours — ouvrir directement</b>${links(d.courses,"course")}<div class="stage-help">Commence par le premier lien. Le deuxième sert d'alternative ou d'approfondissement.</div>`;

    stages[1].classList.add("action-stage");
    stages[1].innerHTML=`<b>2. Exercices — faire maintenant</b>${links(d.exercises,"exercise")}<div class="stage-help">Faire au moins un exercice sans regarder la correction.</div>`;

    stages[2].classList.add("action-stage");
    stages[2].innerHTML=`<b>3. Évaluation — chronométrée</b><div class="action-links"><a class="action-link eval" href="${d.evaluation_url}">Ouvrir l'évaluation guidée (${d.eval_minutes} min) →</a></div><div class="stage-help">${d.eval_note||""}</div>`;

    stages[3].classList.add("action-stage");
    stages[3].innerHTML=`<b>4. Annales — appliquer au bac</b><div class="action-links"><a class="action-link annale" href="${d.annales_url}">Voir les annales déjà filtrées pour ce chapitre →</a></div><div class="stage-help">Choisir ensuite une annale, noter le score et ajouter les erreurs au carnet.</div>`;
  });
});
