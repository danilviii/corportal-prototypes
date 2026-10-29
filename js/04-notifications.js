"use strict";
/* ======================================================================
   Notifications (FR-28…FR-31)
   ====================================================================== */
function pushN(to, text, reqId, kind='bell'){ const n={id:'n'+Date.now()+Math.random().toString(36).slice(2,6), to, at:nowIso(), kind, text, req:reqId, read:false}; S.notifs.push(n); return n; }
function externals(r){ return uniq([r.requesterId, ...r.participantIds]); }
function nComment(r, author){
  uniq([...externals(r), ...r.executorIds]).filter(u => u !== author).forEach(u => pushN(u, `${pname(author)} прокомментировал(а) заявку «${r.title}»`, r.id));
}
function nStatus(r, by){
  const st = stOf(r);
  externals(r).filter(u => u !== by && !r.executorIds.includes(u)).forEach(u => pushN(u, `Статус заявки «${r.title}»: ${st.name}`, r.id));
  r.executorIds.filter(u => u !== by).forEach(u => pushN(u, `${pname(by)} сменил(а) статус заявки «${r.title}»: ${st.name}`, r.id));
}
function nDeadline(r, by){ r.executorIds.filter(u => u !== by).forEach(u => pushN(u, `${pname(by)} изменил(а) срок заявки «${r.title}»: ${r.deadline ? fmtDT(r.deadline) : 'без срока'}`, r.id)); }
function nExecutors(r, by, added, removed){
  const all = uniq([...r.executorIds, ...removed]).filter(u => u !== by);
  all.forEach(u => {
    const parts = [];
    if (added.length) parts.push(`назначен(ы): ${added.map(pname).join(', ')}`);
    if (removed.length) parts.push(`сняты: ${removed.map(pname).join(', ')}`);
    pushN(u, `Исполнители заявки «${r.title}» изменены (${pname(by)}): ${parts.join('; ')}`, r.id);
  });
}
function nNew(r){
  const t = typ(r.typeId), p = proj(r.projectId);
  r.executorIds.forEach(u => { const n=pushN(u, `Пришла новая заявка №${r.id} — ${r.title}`, r.id, 'mail'); n.mail={space:space(p.spaceId).name,project:p.name,type:t.name,reporter:pname(r.requesterId),createdAt:r.createdAt}; });
  Object.keys(S.subs).filter(k => S.subs[k] && k.endsWith(':' + p.id)).map(k => k.split(':')[0])
    .filter(u => (internal(u, p.id) || isAdmin(u)) && !r.executorIds.includes(u) && u !== r.requesterId)
    .forEach(u => pushN(u, `Новая заявка в проекте «${p.name}»: «${r.title}»`, r.id));
}
function hist(r, by, text){ r.history.push({at:nowIso(), by, text}); }
function toast(text){ const id = Math.random(); UI.toasts.push({id, text}); renderToasts(); setTimeout(() => { UI.toasts = UI.toasts.filter(t => t.id !== id); renderToasts(); }, 4200); }
