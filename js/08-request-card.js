"use strict";
/* ======================================================================
   Request card (FR-17…FR-26)
   ====================================================================== */
function renderCard(id){
  const u = me(); const r = req(id);
  if (!r || access(u, r) === 'none') {
    return `<div class="ovl" data-a="close-card-bg"><div class="mdl w-sm" data-stop="1"><div class="mh"><h2>Нет доступа к заявке</h2><button class="btn btn-n btn-i btn-sm" data-a="close-card">${icon('x',14)}</button></div>
      <div class="mb"><div class="note lock">${icon('lock',16)}<div>Заявка №${esc(id)} вам недоступна. Заявку видят заявитель, участники запроса, исполнители, а также руководитель пространства, руководитель и участники её проекта ${fr(19,26)}</div></div></div></div></div>`;
  }
  return access(u, r) === 'full' ? renderFull(r) : renderSimple(r);
}
function fieldValue(f, v){
  if (isEmpty(v)) return '<span class="muted">—</span>';
  if (f.kind === 'string' && /^https?:\/\//.test(v)) return `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(v)}</a>`;
  if (Array.isArray(v)) return v.map(x => `<span class="pill p-grey">${esc(x)}</span>`).join(' ');
  return `<span style="white-space:pre-wrap">${esc(v)}</span>`;
}
function fieldEditor(f, v, attrs, err){
  const e = err ? ' err' : '';
  const arr = Array.isArray(v) ? v : [];
  if (Array.isArray(v) && f.kind !== 'multi') v = v.join(', ');
  if (f.kind === 'string') return `<input class="inp w100${e}" ${attrs} value="${esc(v||'')}">`;
  if (f.kind === 'number') return `<input class="inp w100${e}" type="number" inputmode="decimal" ${attrs} value="${esc(v||'')}">`;
  if (f.kind === 'bool') return `<select class="sel w100${e}" ${attrs}><option value="">Не выбрано</option>${['Да','Нет'].map(o => `<option ${v===o?'selected':''}>${o}</option>`).join('')}</select>`;
  if (f.kind === 'select') return `<select class="sel w100${e}" ${attrs}><option value="">Не выбрано</option>${f.options.map(o => `<option ${v===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
  if (f.kind === 'multi') return `<div class="ms${e}" ${attrs}>${f.options.map(o => `<label><input type="checkbox" value="${esc(o)}" ${arr.includes(o)?'checked':''}>${esc(o)}</label>`).join('')}</div>`;
  return '';
}
function commentsBlock(r, u){
  const list = r.comments.map(c => `<div class="cmt ${c.a===u?'me':''}">${av(c.a,28)}<div class="cb"><div class="ch"><b>${esc(pname(c.a))}</b><span class="muted tab-num">${fmtDT(c.at)}</span></div><div class="ct">${esc(c.text)}</div>
    ${c.files && c.files.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:5px">${c.files.map(x => `<span class="fchip">${icon('file',12)}${esc(x)}</span>`).join('')}</div>` : ''}</div></div>`).join('');
  const form = canComment(u, r)
    ? `<div class="cform"><textarea class="ta" id="cmtText" rows="3" placeholder="Напишите комментарий…"></textarea>
        <div class="row"><label class="btn btn-n btn-sm" style="position:relative;overflow:hidden">${icon('clipfile',13)}Файл<input type="file" id="cmtFiles" multiple data-c="cmt-files" style="position:absolute;inset:0;opacity:0;cursor:pointer"></label><span class="muted" id="cmtFilesL" style="flex:1;font-size:11.5px"></span>
        <button class="btn btn-p btn-sm" data-a="comment" data-id="${r.id}">${icon('send',13)}Отправить</button></div>
        ${isDone(r) ? `<div class="hint">Заявка завершена. Комментарий не вернёт её в работу ${fr(16)}</div>` : ''}</div>`
    : `<div class="cform"><div class="note lock">${icon('lock',15)}<div>Комментировать могут заявитель, участники запроса, исполнители, руководители проекта/пространства и администратор ${fr(17)}.${canTake(u,r) ? ' Возьмите заявку в работу, чтобы написать комментарий.' : assignScope(u,r) ? ' Назначьте себя исполнителем, чтобы написать комментарий.' : ''}</div></div></div>`;
  return `<div class="cmts">${list || '<div class="muted" style="text-align:center;padding:20px 0">Комментариев пока нет</div>'}</div>${form}`;
}
function participantsBlock(r, u){
  const open = !isDone(r);
  const chips = r.participantIds.map(p => pchip(p, open && p !== u && canRmPart(u, r, p) ? {rm:'part-rm', rid:r.id, rmTitle:'Убрать участника запроса'} : {})).join('');
  return `${chips || '<span class="muted">Нет</span>'}
    ${open && canAddPart(u, r) ? `<button class="btn btn-g btn-sm" data-a="picker" data-k="part" data-id="${r.id}">${icon('userplus',13)}Добавить</button>` : ''}
    ${open && r.participantIds.includes(u) ? `<button class="btn btn-n btn-sm" data-a="part-leave" data-id="${r.id}" data-u="${u}">${icon('logout',13)}Выйти</button>` : ''}`;
}
const doneNote = r => isDone(r) ? `<div class="note info" style="margin-bottom:10px">${icon('lock',16)}<div>Заявка завершена. В ней можно только писать комментарии${canWork(me(), r) ? ' и менять статус, в том числе вернуть её в работу' : ''}. Для изменения полей, срока, исполнителей и участников запроса сначала верните заявку в работу ${fr(16)}</div></div>` : '';
const filesSec = (r, full) => (r.files || []).length ? `<div class="sec"><div class="secT">${icon('clipfile',14)}Вложения ${full ? '<span class="muted ph" style="font-weight:500;font-size:11.5px">приложены при подаче, видит заявитель</span>' : fr(20)}</div><div style="display:flex;gap:6px;flex-wrap:wrap">${fileChips(r.files)}</div></div>` : '';
function renderSimple(r){
  const u = me(); const p = proj(r.projectId), t = typ(r.typeId);
  const shown = t.fields.filter(x => { const f = fld(x.f); return f && !f.hidden && r.submitted.includes(x.f); });
  const rolesTxt = rr(u, r).req ? 'Вы заявитель' : 'Вы участник запроса';
  return `<div class="ovl" data-a="close-card-bg"><div class="rc simple" data-stop="1">
    <div class="rch"><div class="path">${icon('inbox',14)}<span>${esc(p.name)}</span><span>·</span><span>${esc(t.name)}</span><span class="idn">#${r.id}</span>${fr('упрощённая карточка, FR-20')}</div>
      <span class="pill p-blue">${rolesTxt}</span><button class="btn btn-n btn-i btn-sm" data-a="close-card" title="Закрыть">${icon('x',14)}</button></div>
    <div class="rcb"><div class="rcl">
      ${doneNote(r)}<div class="sec"><h2 class="rct">${esc(r.title)}</h2><div style="display:flex;gap:6px;align-items:center;margin-bottom:10px">${stPill(r)}</div>
        <div class="desc">${r.description ? esc(r.description) : '<span class="muted">Описание не заполнено</span>'}</div></div>
      ${filesSec(r)}
      <div class="sec"><div class="secT">Данные заявки ${fr(20,22)}</div>
        <div class="fl"><div class="k">Заявитель</div><div class="v ro">${pchip(r.requesterId)}</div></div>
        <div class="fl"><div class="k">Создана</div><div class="v ro tab-num">${fmtDT(r.createdAt)}</div></div>
        <div class="fl"><div class="k">Проект</div><div class="v ro">${esc(p.name)}</div></div>
        <div class="fl"><div class="k">Тип заявки</div><div class="v ro">${esc(t.name)}</div></div>
        ${shown.map(x => { const f = fld(x.f); return `<div class="fl"><div class="k">${esc(f.name)}</div><div class="v ro">${fieldValue(f, r.values[x.f])}</div></div>`; }).join('')}
        <div class="hint ph" style="margin-top:6px">Показаны только поля, заполненные при подаче. Поля только для чтения.</div></div>
      <div class="sec"><div class="secT">${icon('users',15)}Участники запроса ${fr(26)}</div><div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">${participantsBlock(r, u)}</div>
        <div class="hint ph">Участник запроса видит эту заявку и может писать комментарии.${rr(u,r).part && !rr(u,r).req ? ' Вы можете убрать только себя.' : ''}</div></div>
    </div>
    <div class="rcr"><div class="rtabs"><button class="ptab on">Комментарии <span class="cnt">${r.comments.length}</span></button>${fr(22)}</div>${commentsBlock(r, u)}</div></div>
  </div></div>`;
}
function renderFull(r){
  const u = me(); const p = proj(r.projectId), t = typ(r.typeId), s = space(p.spaceId);
  const x = rr(u, r); const work = canWork(u, r); const done = isDone(r); const edit = work && !done; const scope = done ? null : assignScope(u, r);
  const noRole = !x.req && !x.part && !x.exec;
  const myRoles = [x.exec && 'исполнитель', x.req && 'заявитель', x.part && 'участник запроса'].filter(Boolean);
  const intRole = isSpaceLead(u, p.spaceId) ? 'руководитель пространства' : isProjLead(u, p.id) ? 'руководитель проекта' : isMember(u, p.id) ? 'участник проекта' : isAdmin(u) ? 'администратор' : '';
  const fieldsAll = t.fields.filter(y => { const f = fld(y.f); return f && !f.hidden; });
  const banner = noRole && !canManageRequest(u, r) ? `<div class="note warn" style="margin-bottom:8px">${icon('lock',16)}<div style="flex:1">У вас нет роли в этой заявке (вы ${intRole}). Карточка только для чтения ${fr(17)}.
      ${canTake(u,r) ? '' : scope ? ' Чтобы работать с заявкой, назначьте себя исполнителем.' : ''}</div>
      ${canTake(u,r) ? `<button class="btn btn-p btn-sm" data-a="take" data-id="${r.id}">${icon('userplus',13)}Взять в работу</button>` : ''}</div>` : '';
  const sp = reqSpace(r);
  const stChoices = sp.statuses;
  const statusCtl = work
    ? `<select class="sel sel-sm" data-c="status" data-id="${r.id}" style="width:auto">${stChoices.map(s => `<option value="${s.id}" ${s.id===r.status?'selected':''}>${esc(s.name)}${s.final?' — завершает заявку':''}</option>`).join('')}</select>${fr(15,16)}`
      + (isDone(r) ? `<span class="muted" style="font-size:11px">выберите незавершающий статус, чтобы вернуть заявку в работу</span>` : '')
    : stPill(r) + (isDone(r) ? `<span class="muted" style="font-size:11px">заявка завершена</span>` : '');
  const deadline = edit ? `<input type="datetime-local" aria-label="Крайний срок" class="inp inp-sm" data-c="deadline" data-id="${r.id}" value="${r.deadline ? (r.deadline.length === 10 ? r.deadline+'T00:00' : r.deadline) : ''}">` : `<span class="${r.deadline?'':'muted'}">${fmtDT(r.deadline)}</span>`;
  const execs = `${r.executorIds.map(e => pchip(e, scope ? {rm:'exec-rm', rid:r.id, rmTitle:'Снять исполнителя'} : {}) + (!scope && !done && e === u ? `<button class="btn btn-g btn-sm" data-a="exec-self" data-id="${r.id}" title="Снять себя с исполнителей заявки">${icon('logout',13)}Снять себя</button>` : '')).join('') || '<span class="pill p-yel">не назначен</span>'}
    ${scope ? `<button class="btn btn-g btn-sm" data-a="picker" data-k="exec" data-id="${r.id}">${icon('userplus',13)}Назначить</button>` : ''}
    ${canTake(u, r) ? `<button class="btn btn-s btn-sm" data-a="take" data-id="${r.id}">Взять в работу</button>` : ''}`;
  const left = `
    ${banner}${doneNote(r)}
    <div class="sec">${edit ? `<input class="inp w100" aria-label="Название заявки" data-c="request-title" data-id="${r.id}" value="${esc(r.title)}">` : `<h2 class="rct">${esc(r.title)}</h2>`}
      <div style="display:flex;gap:6px;align-items:center;margin-bottom:12px;flex-wrap:wrap"><span class="pill p-pur">Заявка</span><span class="muted">Ваша роль:</span><span class="pill p-blue">${esc([...myRoles, intRole].filter(Boolean).join(', ') || '—')}</span></div>
      <div class="props">
        <div class="prop"><div class="k">${icon('flag',14)}Статус</div><div class="v">${statusCtl}</div></div>
        <div class="prop"><div class="k">${icon('cal',14)}Крайний срок</div><div class="v">${deadline}</div></div>
        <div class="prop" style="grid-column:1/-1"><div class="k">${icon('user',14)}Исполнители ${fr(25)}</div><div class="v">${execs}</div></div>
        <div class="prop"><div class="k">${icon('user',14)}Заявитель</div><div class="v">${pchip(r.requesterId)}</div></div>
        <div class="prop"><div class="k">${icon('clock',14)}Создана</div><div class="v tab-num">${fmtDT(r.createdAt)}</div></div>
        <div class="prop" style="grid-column:1/-1"><div class="k">${icon('users',14)}Участники запроса ${fr(26)}</div><div class="v">${participantsBlock(r, u)}</div></div>
        <div class="prop"><div class="k">${icon('clip',14)}Проект</div><div class="v">${esc(p.name)}</div></div>
        <div class="prop"><div class="k">${icon('tag',14)}Тип заявки</div><div class="v">${esc(t.name)}</div></div>
      </div>
      <div class="hint ph" style="margin-top:8px">Наблюдателя и постановщика на заявке нет ${fr(23)}</div></div>
    <div class="sec"><div class="secT">Описание</div>${edit ? `<textarea class="ta" aria-label="Описание заявки" data-c="request-description" data-id="${r.id}">${esc(r.description)}</textarea>` : `<div class="desc">${r.description ? esc(r.description) : '<span class="muted">—</span>'}</div>`}</div>
    ${filesSec(r, true)}
    <div class="sec"><div class="secT">Поля заявки ${fr(13,18)}<span class="muted ph" style="font-weight:500;font-size:11.5px">все поля типа, в том числе пустые</span></div>
      ${fieldsAll.map(y => { const f = fld(y.f); const v = r.values[y.f]; const fromReq = r.submitted.includes(y.f);
        return `<div class="fl"><div class="k">${esc(f.name)}${y.r?'<span class="req">*</span>':''}<div class="ph" style="font-size:10.5px;font-weight:600;margin-top:2px;color:${fromReq?'#357f3e':'#a16207'}">${fromReq ? 'видит заявитель' : 'не заполнено при подаче, заявитель не видит'}</div></div>
          <div class="v ${edit?'':'ro'}">${edit ? fieldEditor(f, v, `data-c="fv" data-id="${r.id}" data-f="${f.id}"`) : fieldValue(f, v)}</div></div>`; }).join('') || '<span class="muted">В типе нет полей</span>'}</div>
    <div class="sec"><div class="secT">${icon('link',14)}Связанные задачи <span class="muted ph" style="font-weight:500;font-size:11.5px">заявитель не видит</span></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">${r.links.map(l => `<span class="chip" style="padding:0 6px">${icon('check',12)}${esc(l)}${edit?`<button class="x" data-a="link-rm" data-id="${r.id}" data-l="${esc(l)}">${icon('x',12)}</button>`:''}</span>`).join('') || '<span class="muted">Нет связей</span>'}
      ${edit ? `<select class="sel sel-sm" data-c="link-add" data-id="${r.id}"><option value="">+ Связать с задачей…</option>${LINKABLE_TASKS.filter(l => !r.links.includes(l)).map(l => `<option>${esc(l)}</option>`).join('')}</select>` : ''}</div></div>
    <div class="sec muted ph" style="font-size:12px">Чек-листы, результаты и учёт времени — как в карточке задачи сейчас. Подзадач нет ${fr(11)}</div>`;
  const right = UI.cardTab === 'history'
    ? `<div class="hist">${r.history.slice().reverse().map(h => `<div><span class="tm">${fmtDT(h.at)}</span><span>${h.by ? '<b>' + esc(pname(h.by)) + '</b> ' : '<span class="muted">Система:</span> '}${esc(h.text)}</span></div>`).join('')}</div>`
    : commentsBlock(r, u);
  return `<div class="ovl" data-a="close-card-bg"><div class="rc" data-stop="1">
    <div class="rch"><div class="path">${icon('disc',14)}<span>${esc(s.name)}</span><span>/</span>${icon('clip',14)}<span>${esc(p.name)}</span><span class="idn">#${r.id}</span>${fr('полная карточка, FR-17, FR-18')}</div>
      <div class="dd"><button class="btn btn-o btn-sm" data-a="menu">Действия ${icon('down',12)}</button>
        ${UI.menu ? `<div class="ddm"><button data-a="copy-link" data-id="${r.id}">${icon('link',14)}Скопировать ссылку</button>${edit?`<button data-a="menu-link">${icon('check',14)}Связать с задачей</button>`:''}
          <div class="hr ph"></div><div class="muted ph" style="padding:6px 8px;font-size:11.5px;line-height:1.4">Нет действий «Переместить», «Копировать», «Создать подзадачу», «Сохранить как шаблон» ${fr(11)}</div></div>` : ''}</div>
      <button class="btn btn-n btn-i btn-sm" data-a="close-card" title="Закрыть">${icon('x',14)}</button></div>
    <div class="rcb"><div class="rcl">${left}</div>
      <div class="rcr"><div class="rtabs"><button class="ptab ${UI.cardTab!=='history'?'on':''}" data-a="ctab" data-v="comments">Комментарии <span class="cnt">${r.comments.length}</span></button><button class="ptab ${UI.cardTab==='history'?'on':''}" data-a="ctab" data-v="history">История</button></div>${right}</div></div>
  </div></div>`;
}
