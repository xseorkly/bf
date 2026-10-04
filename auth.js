(() => {
  document.documentElement.classList.add("auth-loading");
  const labels={eleve:"Élève / candidat",formateur:"Formateur",responsable:"Responsable de centre"};
  const landings={eleve:"espace-eleve.html",formateur:"espace-formateur.html",responsable:"espace-responsable.html"};
  const validRoles=Object.keys(labels);
  const safeGet=(s,k)=>{try{return s.getItem(k)}catch(e){return null}};
  const safeSet=(s,k,v)=>{try{s.setItem(k,v)}catch(e){}};
  const safeRemove=(s,k)=>{try{s.removeItem(k)}catch(e){}};
  const cookieRole=()=>{const m=document.cookie.match(/(?:^|; )bac_fr_role=([^;]+)/);return m?decodeURIComponent(m[1]):null};
  const queryRole=()=>{try{return new URLSearchParams(location.search).get("role")}catch(e){return null}};
  function persist(role){
    safeSet(localStorage,"bac_fr_role",role);safeSet(sessionStorage,"bac_fr_role",role);
    try{document.cookie="bac_fr_role="+encodeURIComponent(role)+"; path=/; SameSite=Lax"}catch(e){}
  }
  function clear(){
    [localStorage,sessionStorage].forEach(s=>{safeRemove(s,"bac_fr_role");safeRemove(s,"bac_fr_role_label");safeRemove(s,"bac_fr_login_at")});
    try{document.cookie="bac_fr_role=; Max-Age=0; path=/; SameSite=Lax"}catch(e){}
  }
  function roleNow(){
    const q=queryRole();
    if(validRoles.includes(q)){persist(q);return q;}
    const r=safeGet(localStorage,"bac_fr_role")||safeGet(sessionStorage,"bac_fr_role")||cookieRole();
    return validRoles.includes(r)?r:null;
  }
  function withRole(href,role){
    if(!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("javascript:") || /^https?:\/\//i.test(href)) return href;
    try{
      const u=new URL(href,location.href);
      if(u.origin!==location.origin) return href;
      u.searchParams.set("role",role);
      return u.pathname.split("/").pop()+u.search+u.hash;
    }catch(e){return href;}
  }

  document.addEventListener("DOMContentLoaded",()=>{
    const body=document.body;
    const requiresAuth=body?.dataset.auth==="required";
    const allowed=(body?.dataset.roles||"eleve,formateur,responsable").split(",").map(x=>x.trim()).filter(Boolean);
    const role=roleNow();

    if(requiresAuth && (!role || !allowed.includes(role))){
      document.documentElement.classList.remove("auth-loading");
      location.replace("index.html");
      return;
    }

    if(role){
      // Keep the role on internal navigation so access works even when localStorage is unavailable.
      document.querySelectorAll('a[href]').forEach(a=>{
        const href=a.getAttribute('href');
        if(href && !a.hasAttribute('data-no-role')) a.setAttribute('href',withRole(href,role));
      });
      document.querySelectorAll("[data-my-space]").forEach(a=>a.href=landings[role]+"?role="+encodeURIComponent(role));
    }

    if(requiresAuth){
      const nav=document.querySelector('nav[aria-label="Navigation principale"]');
      if(nav && !nav.querySelector("[data-logout]")){
        const badge=document.createElement("span");badge.className="role-badge";badge.textContent=labels[role]||role;nav.appendChild(badge);
        const b=document.createElement("button");b.type="button";b.className="nav-logout";b.dataset.logout="1";b.textContent="Déconnexion";
        b.addEventListener("click",()=>{clear();location.replace("index.html")});nav.appendChild(b);
      }
    }

    document.querySelectorAll("[data-visible-roles]").forEach(el=>{
      const roles=el.dataset.visibleRoles.split(",").map(x=>x.trim());
      if(!roles.includes(role)) el.hidden=true;
    });
    document.documentElement.classList.remove("auth-loading");
  });
})();
