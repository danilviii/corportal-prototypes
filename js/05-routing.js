"use strict";
/* ======================================================================
   Routing
   ====================================================================== */
function route(){
  const h = decodeURIComponent(location.hash.slice(1)) || '/requests/mine';
  const [p, qs] = h.split('?');
  const q = Object.fromEntries(new URLSearchParams(qs || ''));
  return {path:p, parts:p.split('/').filter(Boolean), q};
}
function href(path, q={}){ const qs = new URLSearchParams(Object.entries(q).filter(([k,v]) => v != null && v !== '')).toString(); return '#' + path + (qs ? '?' + qs : ''); }
function go(path, q={}){ const h = href(path, q); if (location.hash === h) render(); else location.hash = h; }
function setQ(patch){ const r = route(); const q = {...r.q, ...patch}; Object.keys(q).forEach(k => (q[k] == null || q[k] === '') && delete q[k]); go(r.path, q); }
window.addEventListener('hashchange', () => { UI.menu = false; render(); });
