"use strict";
/* ======================================================================
   Helpers
   ====================================================================== */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = (n, s=16) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]||''}</svg>`;
const fr = (...n) => `<span class="fr" title="Требование PRD">${n.map(x => typeof x === 'number' ? 'FR-'+x : x).join(', ')}</span>`;
const person = id => S.people.find(p => p.id === id) || {id, name:id, pos:''};
const pname = id => person(id).name;
const proj = id => S.projects.find(p => p.id === id);
const space = id => S.spaces.find(s => s.id === id);
const typ = id => S.types.find(t => t.id === id);
const fld = id => S.fields.find(f => f.id === id);
const req = id => S.requests.find(r => String(r.id) === String(id));
const isEmpty = v => v == null || v === '' || (Array.isArray(v) && v.length === 0);
const uniq = a => [...new Set(a)];
function localIso(d){ const p = n => String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; }
function nowIso(){ return localIso(new Date()); }
function projectDeadline(pid, createdAt){
  const days = proj(pid).deadlineDays;
  if (!Number.isSafeInteger(days) || days < 1) return null;
  const date = new Date(createdAt); date.setDate(date.getDate() + days); return Number.isNaN(date.getTime()) ? null : localIso(date);
}
function fmtDT(iso){ if(!iso) return '—'; const [d,t] = iso.split('T'); const [y,m,dd] = d.split('-'); return `${dd}.${m}.${y}${t ? ', '+t : ''}`; }
function fmtD(iso){ if(!iso) return '—'; const [y,m,dd] = iso.slice(0,10).split('-'); return `${dd}.${m}.${y}`; }
const PALETTE = ['#2e60f2','#8b2ff1','#e15705','#357f3e','#d22422','#c58909','#0e7490','#be185d','#4f46e5','#0f766e','#9333ea','#b45309','#1d4ed8','#15803d'];
function av(id, s=22){ const p = person(id); const i = p.name.split(' ').map(w => w[0]).slice(0,2).join(''); const c = PALETTE[Math.abs([...id].reduce((a,ch)=>a*31+ch.charCodeAt(0),7)) % PALETTE.length]; return `<span class="av" style="width:${s}px;height:${s}px;background:${c};font-size:${Math.round(s*0.42)}px" title="${esc(p.name)}">${esc(i)}</span>`; }
function pchip(id, opts={}){ return `<span class="chip">${av(id,18)}<span class="nowrap">${esc(pname(id))}</span>${opts.rm ? `<button class="x" data-a="${opts.rm}" data-id="${opts.rid||''}" data-u="${id}" title="${esc(opts.rmTitle||'Убрать')}">${icon('x',12)}</button>` : ''}</span>`; }
const reqSpace = r => space(proj(r.projectId).spaceId);
const stOf = r => reqSpace(r).statuses.find(s => s.id === r.status) || {id:r.status, name:r.status};
const isDone = r => !!stOf(r).final;
function stPillS(sp, st){ const c = st.color || '#778297'; return `<span class="pill" style="background:${c}1f;color:${c}"><span class="sdot" style="background:${c}"></span>${esc(st.name)}</span>`; }
const stPill = r => stPillS(reqSpace(r), stOf(r));
