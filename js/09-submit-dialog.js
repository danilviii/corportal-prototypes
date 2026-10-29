"use strict";
/* ======================================================================
   Submit dialog (FR-7…FR-9, FR-24, FR-30)
   ====================================================================== */
function hl(text, q){ if (!q) return esc(text); const i = text.toLowerCase().indexOf(q.toLowerCase()); if (i < 0) return esc(text); return esc(text.slice(0,i)) + '<mark>' + esc(text.slice(i, i+q.length)) + '</mark>' + esc(text.slice(i+q.length)); }
function submitProjects(){ return S.spaces.map(s => ({s, ps: S.projects.filter(p => p.spaceId === s.id && visibleTypes(p.id).length)})).filter(g => g.ps.length); }
function submitList(){
  const st = UI.submit; const q = (st.q || '').trim().toLowerCase();
  const groups = submitProjects();
  if (!groups.length) return `<div class="empty" style="padding:30px"><p>Сейчас нет проектов, в которые можно подать заявку</p></div>`;
  if (!q) return groups.map(g => `<div class="sp-grp"><div class="sp-h"><span class="sp-ico">${icon('disc',15)}</span><b>${esc(g.s.name)}</b><span class="muted">пространство · ${g.ps.length} ${plural(g.ps.length,'проект','проекта','проектов')}</span></div>
    <div class="sp-list">${g.ps.map(p => { const n = visibleTypes(p.id).length; return `<button class="sp-proj" data-a="s-proj" data-pid="${p.id}">${icon('clip',15)}<b>${esc(p.name)}</b><span class="muted">${n} ${plural(n,'тип заявки','типа заявок','типов заявок')}</span>${icon('right',15)}</button>`; }).join('')}</div></div>`).join('');
  const ps = [], ts = [];
  groups.forEach(g => g.ps.forEach(p => { if (p.name.toLowerCase().includes(q)) ps.push(p); visibleTypes(p.id).forEach(x => { if (x.name.toLowerCase().includes(q)) ts.push(x); }); }));
  if (!ps.length && !ts.length) return `<div class="empty" style="padding:30px"><p>Ничего не найдено по запросу «${esc(st.q)}»</p></div>`;
  return `${ts.length ? `<div class="pgrp"><div class="pgrp-h">Типы заявок</div>${ts.map(x => { const pr = proj(x.projectId); return `<button class="trow" data-a="s-type" data-tid="${x.id}">${icon('tag',15)}<span class="pc-t"><b>${hl(x.name, st.q)}</b><span class="muted">${esc(space(pr.spaceId).name)} · ${esc(pr.name)}</span></span>${icon('right',15)}</button>`; }).join('')}</div>` : ''}
    ${ps.length ? `<div class="pgrp"><div class="pgrp-h">Проекты</div>${ps.map(pr => `<button class="trow" data-a="s-proj" data-pid="${pr.id}">${icon('clip',15)}<span class="pc-t"><b>${hl(pr.name, st.q)}</b><span class="muted">Пространство ${esc(space(pr.spaceId).name)}</span></span>${icon('right',15)}</button>`).join('')}</div>` : ''}`;
}
function submitSteps(step){
  const st = UI.submit; const pr = st.pid && proj(st.pid), ty = st.tid && typ(st.tid);
  const items = [['Проект', pr && pr.name], ['Тип заявки', ty && ty.name], ['Описание', null]];
  return `<div class="steps">${items.map(([l, v], i) => {
    const n = i + 1, cls = n < step ? 'done' : n === step ? 'on' : '';
    const inner = `<span class="sn">${n < step ? icon('ok',12) : n}</span><span class="sl"><span>${l}</span>${n < step && v ? `<b>${esc(v)}</b>` : ''}</span>`;
    return (i ? '<span class="sline"></span>' : '') + (n < step ? `<button class="step ${cls}" data-a="s-step" data-v="${n}" title="Изменить">${inner}</button>` : `<div class="step ${cls}">${inner}</div>`);
  }).join('')}</div>`;
}
function renderSubmit(){
  const st = UI.submit;
  if (st.pid && !visibleTypes(st.pid).length) st.pid = null;
  const step = st.tid ? 3 : st.pid ? 2 : 1;
  let body, foot;
  if (step === 1) {
    body = `<h3 class="sq">Куда подать заявку?</h3><div class="hint" style="margin:0 0 10px">Найдите пространство и выберите в нём проект, который решит вашу задачу. Или сразу найдите тип заявки поиском ${fr(8)}</div>
      <div style="position:relative;margin-bottom:14px"><span style="position:absolute;left:10px;top:8px;color:var(--muted)">${icon('search',15)}</span>
        <input class="inp w100" id="sSearch" data-i="s-search" placeholder="Поиск: например, «1С» или «доступ»" value="${esc(st.q||'')}" style="padding-left:32px"></div>
      <div id="sList">${submitList()}</div>`;
    foot = `<span class="grow"></span><button class="btn btn-n" data-a="s-close">Отмена</button>`;
  } else if (step === 2) {
    const pr = proj(st.pid);
    body = `<h3 class="sq">Что нужно сделать?</h3><div class="hint" style="margin:0 0 12px">Выберите тип заявки в проекте «${esc(pr.name)}». От типа зависит, какие поля нужно заполнить ${fr(8)}</div>
      <div>${visibleTypes(pr.id).map(x => `<button class="trow" data-a="s-type" data-tid="${x.id}">${icon('tag',15)}<span class="pc-t"><b>${esc(x.name)}</b></span>${icon('right',15)}</button>`).join('')}</div>`;
    foot = `<button class="btn btn-g" data-a="s-step" data-v="1">${icon('left',14)}Другой проект</button><span class="grow"></span><button class="btn btn-n" data-a="s-close">Отмена</button>`;
  } else {
    const ty = typ(st.tid);
    const e = st.errors || {}; const v = st.vals || {};
    body = `<h3 class="sq">Опишите заявку</h3><div class="hint" style="margin:0 0 12px">Поля со звёздочкой обязательны ${fr(9,13)}</div>
      <div class="frow"><label class="lbl2">Название<span class="req">*</span></label><input class="inp w100 ${e.title?'err':''}" id="sf_title" value="${esc(v.title||'')}" placeholder="Коротко, о чём заявка">${e.title?`<div class="errt">${e.title}</div>`:''}</div>
      <div class="frow"><label class="lbl2">Описание</label><textarea class="ta" id="sf_desc" rows="3" placeholder="Подробности">${esc(v.desc||'')}</textarea></div>
      <div class="frow"><label class="lbl2">Вложения</label><div class="fbox">${(v._files||[]).map((x, i) => `<span class="fchip">${icon('file',12)}${esc(x)}<button class="x" data-a="s-att-rm" data-i="${i}" title="Убрать файл">${icon('x',11)}</button></span>`).join('')}
        <label class="btn btn-n btn-sm" style="position:relative;overflow:hidden">${icon('clipfile',13)}Приложить файл<input type="file" multiple data-c="s-att" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label></div></div>
      ${typeFields(ty).map(x => { const f = fld(x.f); return `<div class="frow"><label class="lbl2">${esc(f.name)}${x.r?'<span class="req">*</span>':''}</label>
        ${fieldEditor(f, v[f.id], `data-sf="${f.id}"`, e[f.id])}${e[f.id]?`<div class="errt">${e[f.id]}</div>`:''}</div>`; }).join('')}`;
    foot = `<button class="btn btn-g" data-a="s-step" data-v="2">${icon('left',14)}Другой тип</button><span class="grow"></span><button class="btn btn-n" data-a="s-close">Отмена</button><button class="btn btn-p" data-a="s-send">${icon('send',14)}Отправить</button>`;
  }
  return `<div class="ovl top"><div class="mdl"><div class="mh"><h2>Новая заявка</h2>${fr(7,8)}<button class="btn btn-n btn-i btn-sm" data-a="s-close" title="Закрыть без создания">${icon('x',14)}</button></div>
    ${submitSteps(step)}<div class="mb">${body}</div><div class="mf">${foot}</div></div></div>`;
}
const canMoveTo = (u, r, st) => canWork(u, r) && st.id !== r.status;
function changeStatus(r, stId){
  const u = me(), st = reqSpace(r).statuses.find(s => s.id === stId);
  if (!st || !canMoveTo(u, r, st)) return;
  const apply = () => { r.status = st.id; hist(r, u, `сменил(а) статус: «${st.name}»`); nStatus(r, u); toast(`Статус «${st.name}». Заявитель и участники запроса получили уведомление`); };
  if (st.final && !isDone(r)) UI.confirm = {title:`Перевести в «${st.name}»?`, text:`Это завершающий статус: заявка сразу станет завершённой, подтверждение заявителя не нужно. Исполнитель, руководители и администратор могут вернуть её в работу ${fr(16)}.`, ok:st.name, run: apply};
  else apply();
}
function readSubmitVals(){
  const st = UI.submit; if (!st || !st.tid) return;
  const v = st.vals = st.vals || {};
  const ti = document.getElementById('sf_title'); if (ti) v.title = ti.value;
  const de = document.getElementById('sf_desc'); if (de) v.desc = de.value;
  document.querySelectorAll('[data-sf]').forEach(el => {
    const f = fld(el.dataset.sf);
    if (f.kind === 'multi') v[f.id] = [...el.querySelectorAll('input:checked')].map(i => i.value);
    else v[f.id] = el.value.trim();
  });
}
function doSubmit(){
  readSubmitVals();
  const st = UI.submit; const t = typ(st.tid); if(!t||t.hidden||!proj(t.projectId)){UI.submit=null;toast('Тип заявки больше недоступен. Выберите другой тип');render();return;} const v = st.vals; const errors = {};
  if (!v.title || !v.title.trim()) errors.title = 'Заполните название';
  typeFields(t).forEach(x => { if (x.r && isEmpty(v[x.f])) errors[x.f] = 'Обязательное поле'; });
  st.errors = errors;
  if (Object.keys(errors).length) { render(); toast('Заявка не создана: заполните обязательные поля'); return; }
  const u = me();
  const values = {}; const submitted = [];
  typeFields(t).forEach(x => { const val = v[x.f]; values[x.f] = val == null ? '' : val; if (!isEmpty(val)) submitted.push(x.f); });
  const r = {id: S.seq++, projectId: t.projectId, typeId: t.id, title: v.title.trim(), description: (v.desc||'').trim(), requesterId: u, participantIds: [], executorIds: t.exec.slice(),
    status: reqSpace({projectId:t.projectId}).statuses[0].id, createdAt: nowIso(), deadline:null, files: (v._files || []).slice(), values, submitted, links:[], comments:[], history:[]};
  r.deadline = projectDeadline(t.projectId, r.createdAt);
  hist(r, u, 'подал(а) заявку');
  hist(r, null, t.exec.length ? 'исполнители по умолчанию из типа: ' + t.exec.map(pname).join(', ') : 'на типе нет исполнителей по умолчанию, заявка ждёт в очереди');
  S.requests.push(r);
  nNew(r);
  UI.submit = null;
  toast(t.exec.length ? `Заявка №${r.id} создана. Письмо «Пришла новая заявка» отправлено: ${t.exec.map(pname).join(', ')}` : `Заявка №${r.id} создана без исполнителя и ждёт в очереди проекта`);
  const cur = route();
  if (cur.parts[0] !== 'requests' || cur.parts[1] === 'new') go('/requests/mine', {card: r.id}); else setQ({card: r.id});
}
