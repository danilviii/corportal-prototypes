"use strict";
/* ======================================================================
   Render: bar, app, scenarios
   ====================================================================== */
function render(){
  document.body.classList.toggle('nofr', !UI.fr);
  document.body.classList.toggle('noph', !UI.ph);
  document.getElementById('stage').classList.toggle('mobile', UI.mobile);
  renderBar(); renderApp(); renderScen(); save();
  const m = document.querySelector('.srow .ddm'), dt = m && m.parentElement.querySelector('.dots');
  if (m && dt) { const r = dt.getBoundingClientRect(); m.style.left = (r.right - 22) + 'px'; m.style.top = (r.bottom + 4) + 'px'; }
}
function renderBar(){
  const others = S.people.filter(p => !ROLES.some(r => r.u === p.id));
  document.getElementById('bar').innerHTML = `
    <span class="lbl">Прототип GP-3129 · смотреть как:</span>
    ${ROLES.map(r => `<button class="rb ${UI.user===r.u?'on':''}" data-a="role" data-u="${r.u}"><b>${esc(r.label)}</b><span>${esc(pname(r.u))}</span></button>`).join('')}
    <select data-c="role-other" title="Другие пользователи">
      <option value="">Другие…</option>
      ${others.map(p => `<option value="${p.id}" ${UI.user===p.id?'selected':''}>${esc(p.name)} — ${esc(p.pos)}</option>`).join('')}
    </select>
    <span class="sep"></span>
    <button class="bb" data-a="back">${icon('left',14)}Назад</button>
    <input id="openNum" placeholder="№ заявки" title="Открыть заявку по прямой ссылке"><button class="bb" data-a="open-num">Открыть</button>
    <button class="bb ${UI.mobile?'on':''}" data-a="mobile">${icon('phone',14)}Мобильный вид</button>
    <button class="bb ${UI.fr?'on':''}" data-a="fr">FR</button><button class="bb ${UI.ph?'on':''}" data-a="ph" title="Пояснения прототипа: «видит заявитель», «заявитель не видит», заметки по PRD">Подсказки</button>
    <button class="bb ${UI.scen?'on':''}" data-a="scen">${icon('book',14)}Сценарии</button>
    <button class="bb" data-a="reset">${icon('reset',14)}Сбросить данные</button>`;
}

function unreadCount(){ return S.notifs.filter(n => n.to === me() && !n.read).length; }

function renderApp(){
  const r = route();
  const sec = r.parts[0] || 'requests';
  syncSubmit(r);
  let mainHtml;
  try { mainHtml = renderMain(r); } catch(e) { console.error(e); mainHtml = `<div class="panel"><div class="pad">Ошибка отрисовки: ${esc(e.message)}</div></div>`; }
  const u = me();
  document.getElementById('app').innerHTML = `
    <nav class="rail">
      <div class="logo">O</div>
      <button title="Поиск">${icon('search',17)}</button>
      <button title="Пульс">${icon('pulse',17)}</button>
      <button title="Согласования">${icon('stamp',17)}</button>
      <button class="on" title="Трекер" data-a="nav" data-h="#/tasks">${icon('check',17)}</button>
      <button title="Магазин и каталог">${icon('cart',17)}</button>
      <button title="Обучение">${icon('cap',17)}</button>
      <button title="Сотрудники">${icon('users',17)}</button>
      <div class="sp"></div>
      <button data-a="notif" title="Уведомления" class="${UI.notifOpen?'on':''}">${icon('bell',17)}${unreadCount() ? `<span class="badge">${unreadCount()}</span>` : ''}</button>
      <button data-a="help" title="Помощь: подать заявку">${icon('help',17)}</button>
      <div title="${esc(pname(u))}">${av(u,28)}</div>
    </nav>
    ${renderSide(r, sec)}
    <div class="main">
      ${renderMobileHead(r)}
      ${mainHtml}
    </div>
    ${UI.notifOpen ? renderNotif() : ''}
    ${r.q.card ? renderCard(r.q.card) : ''}
    ${UI.spModal ? renderSpaceModal() : ''}
    ${UI.pjModal ? renderProjModal() : ''}
    ${UI.adminNew ? renderAdminNew() : ''}
    ${UI.adminEdit ? renderAdminEdit() : ''}
    ${UI.submit ? renderSubmit() : ''}
    ${UI.picker ? renderPicker() : ''}
    ${UI.confirm ? renderConfirm() : ''}
    <div class="toasts" id="toasts"></div>`;
  renderToasts();
  const ci = document.getElementById('cmtText'); if (ci && UI._focusCmt) { ci.focus(); UI._focusCmt = false; }
  const si = document.getElementById('sSearch'); if (si && UI._focusSearch) { si.focus(); UI._focusSearch = false; }
}
function renderToasts(){ const el = document.getElementById('toasts'); if (el) el.innerHTML = UI.toasts.map(t => `<div class="toast">${t.text}</div>`).join(''); }

function renderSide(r, sec){
  const u = me();
  const items = [
    ['tasks','Задачи','check'],['projects','Проекты','clip'],['spaces','Пространства','disc'],['requests','Заявки','inbox'],
    ['activity','Активность','activity'],['stats','Статистика','chart'],['checklists','Чек-листы','circlecheck'],['notes','Заметки','pen'],['mindmaps','Mind Maps','brain'],['settings','Настройки','gear']
  ];
  const menu = items.map(([k,l,i]) => `<button class="mi ${sec===k?'on':''}" data-a="nav" data-h="${k==='requests'?'#/requests/mine':'#/'+k}">${icon(i,15)}${l}${k==='requests'?fr(3):''}</button>`).join('');
  let below = '';
  if (sec === 'requests') {
    const v = r.parts[1] || 'mine';
    const cnt = k => listFor(u, k).length;
    below = `
      <button class="mi on" data-a="nav" data-h="#/requests/mine">${icon('inbox',15)}Заявки</button>
      <button class="sub ${v==='mine'?'on':''}" data-a="nav" data-h="#/requests/mine">Мои заявки <span class="muted">${cnt('mine')}</span></button>
      <button class="sub ${v==='participant'?'on':''}" data-a="nav" data-h="#/requests/participant">Я участник запроса <span class="muted">${cnt('participant')}</span></button>
      <div class="note ph" style="margin-top:10px">«Заявки» — только интерфейс заявителя. Заявки разбирают в «Задачах», в пространствах и проектах</div>`;
  } else {
    const tree = queueTree(u);
    below = `
      <button class="mi ${sec==='tasks'?'on':''}" data-a="nav" data-h="#/tasks">${icon('check',15)}Мои задачи</button>
      <button class="sub ${sec==='tasks'?'on':''}" data-a="nav" data-h="#/tasks">Список</button><button class="sub">Мой план</button><button class="sub">Сроки</button><button class="sub">Календарь</button>
      <div class="sgrp">Избранные</div><div class="sbox muted">Добавить в избранное</div>
      <div class="sgrp">Мои пространства 1</div><div class="sub">Мое пространство</div><div class="sub lvl2">Мой проект</div>
      <div class="sgrp">Общие пространства ${1 + tree.length}</div><div class="sub">IT CP</div><div class="sub lvl2">IT CP</div>
      ${tree.map(t => `<div class="srow ${r.path==='/spaces/'+t.space.id?'on':''}">
          <button class="sname" data-a="nav" data-h="#/spaces/${t.space.id}" title="Открыть пространство">${icon('disc',14)}<span class="ttx">${esc(t.space.name)}</span></button>
          <button class="dots ${UI.spMenu===t.space.id?'on':''}" data-a="sp-menu" data-sid="${t.space.id}" title="Действия с пространством">${icon('dots',15)}</button>
          ${UI.spMenu===t.space.id ? spaceMenu(t.space, canSpaceSettings(u, t.space.id)) : ''}</div>
        <div class="stree">${t.projects.map(p => `<div class="srow lvl2 ${r.parts[0]==='projects'&&r.parts[1]===p.id?'on':''}">
          <button class="sname" data-a="nav" data-h="#/projects/${p.id}" title="Открыть проект"><span class="ttx">${esc(p.name)}</span></button>
          <button class="dots ${UI.pjMenu===p.id?'on':''}" data-a="pj-menu" data-pid="${p.id}" title="Действия с проектом">${icon('dots',15)}</button>
          ${UI.pjMenu===p.id ? projMenu(p, canProjSettings(u, p.id)) : ''}</div>`).join('')}</div>`).join('')}
      ${tree.length ? `<div class="note ph" style="margin-top:10px">Пространства IT и HR видят их руководители, руководители и участники проектов и администратор</div>` : ''}`;
  }
  return `<aside class="side"><h3>Трекер <span class="muted">${icon('left',14)}</span></h3>${menu}<div class="hr"></div>${below}</aside>`;
}

function spaceMenu(s, lead){
  return `<div class="ddm" data-stop="1">
    <button data-a="sp-newtab" data-sid="${s.id}">${icon('ext',14)}Открыть в новой вкладке</button>
    <button data-a="sp-copy" data-sid="${s.id}">${icon('link',14)}Копировать ссылку</button>
    ${lead ? `<div class="hr"></div>
      <button data-a="admin-new" data-v="project" data-sid="${s.id}">${icon('plus',14)}Новый проект</button>
      <button data-a="sp-open" data-sid="${s.id}" data-tab="fields">${icon('case',14)}Поля пространства</button>
      <button data-a="sp-open" data-sid="${s.id}" data-tab="statuses">${icon('flag',14)}Статусы</button>
      <button data-a="sp-open" data-sid="${s.id}" data-tab="general">${icon('gear',14)}Настройки пространства</button>` : ''}
  </div>`;
}
function renderMobileHead(r){
  const sec = r.parts[0] || 'requests', v = r.parts[1] || 'mine';
  const tabs = sec === 'requests' ? [['mine','Мои заявки'],['participant','Я участник запроса']] : [];
  return `<div class="mhead">
    <div class="mt"><button class="btn btn-n btn-i btn-sm">${icon('menu',15)}</button><b>${sec === 'requests' ? 'Заявки' : 'Трекер'}</b>
      <button class="btn btn-n btn-i btn-sm" data-a="notif" style="position:relative">${icon('bell',15)}${unreadCount()?`<span class="badge" style="top:-4px;right:-4px">${unreadCount()}</span>`:''}</button>
      <button class="btn btn-p btn-sm" data-a="new-req">${icon('plus',13)}Заявка</button></div>
    ${tabs.length ? `<div class="mnav">${tabs.map(([k,l]) => `<button class="ptab ${v===k?'on':''}" data-a="nav" data-h="#/requests/${k}">${l}</button>`).join('')}</div>` : ''}
  </div>`;
}
