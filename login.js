document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.ACCESS_CONFIG || {};
  const safeGet = (store, key) => { try { return store.getItem(key); } catch(e) { return null; } };
  const safeSet = (store, key, val) => { try { store.setItem(key, val); } catch(e) {} };
  const safeRemove = (store, key) => { try { store.removeItem(key); } catch(e) {} };

  function cookieRole(){
    const m = document.cookie.match(/(?:^|; )bac_fr_role=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function persistRole(role){
    safeSet(localStorage, "bac_fr_role", role);
    safeSet(sessionStorage, "bac_fr_role", role);
    safeSet(localStorage, "bac_fr_role_label", cfg[role]?.label || role);
    try { document.cookie = "bac_fr_role=" + encodeURIComponent(role) + "; path=/; SameSite=Lax"; } catch(e) {}
  }
  function clearRole(){
    [localStorage,sessionStorage].forEach(s=>{ safeRemove(s,"bac_fr_role"); safeRemove(s,"bac_fr_role_label"); safeRemove(s,"bac_fr_login_at"); });
    try { document.cookie = "bac_fr_role=; Max-Age=0; path=/; SameSite=Lax"; } catch(e) {}
  }
  function landing(role){
    const base = cfg[role]?.landing || "index.html";
    return base + "?role=" + encodeURIComponent(role);
  }

  const storedRole = safeGet(localStorage,"bac_fr_role") || safeGet(sessionStorage,"bac_fr_role") || cookieRole();
  const quick = document.getElementById("quick-access");
  if (storedRole && cfg[storedRole] && quick) {
    quick.hidden = false;
    const who = document.getElementById("quick-role");
    if (who) who.textContent = cfg[storedRole].label;
    const go = document.getElementById("quick-go");
    if (go) {
      go.href = landing(storedRole);
      go.addEventListener("click", () => persistRole(storedRole));
    }
  }

  document.querySelectorAll("[data-login-role]").forEach(form => {
    const role = form.dataset.loginRole;
    const input = form.querySelector('input[type="password"]');
    const error = form.querySelector(".login-error");
    const reveal = form.querySelector(".reveal-password");

    if (reveal && input) reveal.addEventListener("change", () => { input.type = reveal.checked ? "text" : "password"; });

    form.addEventListener("submit", ev => {
      ev.preventDefault();
      const expected = cfg[role]?.password || "";
      const entered = (input?.value || "").trim().toUpperCase();
      if (entered === expected.toUpperCase()) {
        persistRole(role);
        safeSet(localStorage,"bac_fr_login_at",new Date().toISOString());
        safeSet(sessionStorage,"bac_fr_login_at",new Date().toISOString());
        window.location.assign(landing(role));
      } else {
        if (error) { error.hidden = false; error.textContent = "Mot de passe incorrect."; }
        if (input) { input.focus(); input.select(); }
      }
    });
  });

  document.querySelectorAll("[data-clear-session]").forEach(btn => btn.addEventListener("click", () => { clearRole(); location.replace("index.html"); }));
});
