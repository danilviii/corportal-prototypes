"use strict";
/* ======================================================================
   Pickers / confirm / notifications
   ====================================================================== */
function renderPicker(){
  const pk = UI.picker; const r = req(pk.id); const u = me();
  if (pk.k === 'part') {
    const q = (pk.q || '').toLowerCase();
    const cand = S.people.filter(p => p.id !== r.requesterId && !r.participantIds.includes(p.id) && (!q || p.name.toLowerCase().includes(q)));
    return `<div class="ovl top"><div class="mdl w-sm"><div class="mh"><h2>Добавить участника запроса</h2>${fr(26)}<button class="btn btn-n btn-i btn-sm" data-a="pk-close">${icon('x',14)}</button></div>
      <div class="mb"><input class="inp w100" id="pkSearch" data-i="pk-search" placeholder="Поиск сотрудника" value="${esc(pk.q||'')}" style="margin-bottom:8px">
      <div class="plist" id="pkList">${cand.map(p => `<button class="pi" data-a="part-add" data-u="${p.id}">${av(p.id,24)}<span><b>${esc(p.name)}</b><br><span class="muted" style="font-size:11.5px">${esc(p.pos)}</span></span></button>`).join('') || '<div class="pad muted">Никого не найдено</div>'}</div>
      <div class="hint ph">Добавить можно любого сотрудника портала. Он увидит упрощённую карточку только этой заявки.</div></div></div></div>`;
  }
  const scope = assignScope(u, r);
  const sel = pk.sel;
  const inScope = uniq(scope.groups.flatMap(g => g.people));
  const outside = r.executorIds.filter(e => !inScope.includes(e));
  return `<div class="ovl top"><div class="mdl w-sm"><div class="mh"><h2>Исполнители заявки</h2>${fr(25)}<button class="btn btn-n btn-i btn-sm" data-a="pk-close">${icon('x',14)}</button></div>
    <div class="mb"><div class="hint" style="margin:0 0 8px">${scope.who === 'space' ? 'Руководитель пространства назначает исполнителей из состава любого проекта пространства.' : 'Руководитель проекта назначает исполнителями руководителя и участников своего проекта.'} Людей вне пространства назначить нельзя.</div>
    <div class="plist">${scope.groups.map(g => `<div class="pg">${esc(g.title)}</div>${g.people.map(pid => `<label><input type="checkbox" data-c="pk-sel" value="${pid}" ${sel.includes(pid)?'checked':''}>${av(pid,22)}<span>${esc(pname(pid))}${pid===u?' <span class="muted">(вы)</span>':''}<br><span class="muted" style="font-size:11px">${esc(person(pid).pos)}</span></span></label>`).join('')}`).join('')}
      ${outside.length ? `<div class="pg">Не в составе проекта (ушли из проекта)</div>${outside.map(pid => `<label><input type="checkbox" data-c="pk-sel" value="${pid}" ${sel.includes(pid)?'checked':''}>${av(pid,22)}<span>${esc(pname(pid))}<br><span class="muted" style="font-size:11px">можно только снять ${fr(27)}</span></span></label>`).join('')}` : ''}
    </div></div>
    <div class="mf"><button class="btn btn-n" data-a="pk-close">Отмена</button><button class="btn btn-p" data-a="pk-apply">Сохранить</button></div></div></div>`;
}
function renderConfirm(){
  const c = UI.confirm;
  return `<div class="ovl top"><div class="mdl w-sm"><div class="mh"><h2>${esc(c.title)}</h2></div><div class="mb">${c.text}</div>
    <div class="mf"><button class="btn btn-n" data-a="cf-no">Отмена</button><button class="btn btn-p" data-a="cf-yes">${esc(c.ok)}</button></div></div></div>`;
}
function renderNotif(){
  const u = me();
  const list = S.notifs.filter(n => n.to === u).sort((a,b) => b.at.localeCompare(a.at));
  const subsProjects = S.projects.filter(p => internal(u, p.id) || isAdmin(u));
  return `<div class="notif"><div class="mh"><h2>Уведомления</h2>${fr(28,29,30)}<button class="btn btn-g btn-sm" data-a="n-readall">Прочитать все</button><button class="btn btn-n btn-i btn-sm" data-a="notif">${icon('x',14)}</button></div>
    <div class="nl">${list.length ? list.map(n => `<div class="ni ${n.read?'':'unread'}" data-a="n-open" data-id="${n.id}"><div class="nic ${n.kind==='mail'?'mail':''}">${icon(n.kind==='mail'?'mail':'bell',15)}</div>
      <div style="flex:1;min-width:0"><div class="nt">${esc(n.text)}</div>${n.mail ? `<div class="hint" style="margin:6px 0">${esc(n.mail.space)} / ${esc(n.mail.project)} · ${esc(n.mail.type)}<br>Заявитель: ${esc(n.mail.reporter)}<br>Подана: ${fmtDT(n.mail.createdAt)}<br><a href="${href('/requests/mine',{card:n.req})}" data-a="n-open" data-id="${n.id}">Открыть заявку №${n.req}</a></div>` : ''}<div class="muted" style="font-size:11px;margin-top:2px">${n.kind==='mail'?'Письмо · ':''}${fmtDT(n.at)}</div></div>${n.read?'':'<span class="dot"></span>'}</div>`).join('') : '<div class="pad muted">Уведомлений нет</div>'}</div>
    ${subsProjects.length ? `<div style="border-top:1px solid var(--border);padding:10px 12px"><div class="secT" style="font-size:12px">Подписка на новые заявки ${fr(31)}</div>
      ${subsProjects.map(p => `<div style="display:flex;align-items:center;gap:8px;padding:4px 0"><span style="flex:1;font-size:12.5px">${esc(space(p.spaceId).name)} · ${esc(p.name)}</span><label class="switch"><input type="checkbox" data-c="subs" data-pid="${p.id}" ${S.subs[u+':'+p.id]?'checked':''}><span class="tr"></span></label></div>`).join('')}
      <div class="hint">Личная настройка. По умолчанию выключена.</div></div>` : ''}
  </div>`;
}
