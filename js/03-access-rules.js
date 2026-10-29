"use strict";
/* ======================================================================
   Access rules (PRD FR-17…FR-26)
   ====================================================================== */
const me = () => UI.user;
const isAdmin = u => S.admins.includes(u);
const isSpaceLead = (u, sid) => { const s = space(sid); return !!s && s.leadId === u; };
const isProjLead = (u, pid) => { const p = proj(pid); return !!p && p.leadId === u; };
const canSpaceSettings = (u, sid) => !!space(sid) && (isAdmin(u) || isSpaceLead(u, sid));
const canCreateProject = (u, sid) => !!space(sid) && (isAdmin(u) || isSpaceLead(u, sid));
const isMember = (u, pid) => { const p = proj(pid); return !!p && p.memberIds.includes(u); };
const internal = (u, pid) => { const p = proj(pid); return !!p && (p.leadId === u || p.memberIds.includes(u) || isSpaceLead(u, p.spaceId)); };
const canView = (u, pid) => internal(u, pid) || isAdmin(u);
const canProjSettings = (u, pid) => { const p = proj(pid); return !!p && (isAdmin(u) || p.leadId === u || isSpaceLead(u, p.spaceId)); };
function rr(u, r){ return {req: r.requesterId === u, part: r.participantIds.includes(u), exec: r.executorIds.includes(u)}; }
function access(u, r){ const x = rr(u, r); if (x.exec || canView(u, r.projectId)) return 'full'; if (x.req || x.part) return 'simple'; return 'none'; }
const canManageRequest = (u, r) => isAdmin(u) || isProjLead(u, r.projectId) || isSpaceLead(u, proj(r.projectId).spaceId);
const canComment = (u, r) => { const x = rr(u, r); return x.req || x.part || x.exec || canManageRequest(u, r); };
const canWork = (u, r) => rr(u, r).exec || canManageRequest(u, r);
const canTake = (u, r) => isMember(u, r.projectId) && !r.executorIds.includes(u) && !isDone(r);
function assignScope(u, r){
  const p = proj(r.projectId);
  if (isSpaceLead(u, p.spaceId) || isAdmin(u)) {
    const groups = S.projects.filter(x => x.spaceId === p.spaceId).map(x => ({title: x.name + (x.id === p.id ? ' (проект заявки)' : ''), people: uniq([x.leadId, ...x.memberIds])}));
    groups.unshift({title:isAdmin(u) ? 'Администратор' : 'Руководитель пространства', people:[u]});
    return {who:'space', groups};
  }
  if (p.leadId === u) return {who:'project', groups:[{title:p.name, people: uniq([p.leadId, ...p.memberIds])}]};
  return null;
}
const canAddPart = (u, r) => { const x = rr(u, r); return x.req || x.part || x.exec || canManageRequest(u, r); };
const canRmPart = (u, r, pid) => { const x = rr(u, r); return x.req || x.exec || canManageRequest(u, r) || (x.part && pid === u); };
function queueTree(u){
  return S.spaces.map(s => {
    const lead = s.leadId === u;
    const ps = S.projects.filter(p => p.spaceId === s.id && (lead || isAdmin(u) || p.leadId === u || p.memberIds.includes(u)));
    return {space:s, lead, projects:ps};
  }).filter(x => x.lead || isAdmin(u) || x.projects.length);
}
function setProjLead(p, lead){
  if (!lead || lead === p.leadId) return;
  const prev = p.leadId;
  p.memberIds = uniq([...p.memberIds.filter(m => m !== lead), prev]);
  p.leadId = lead;
}
const fileChips = list => (list || []).map(x => `<span class="fchip">${icon('file',12)}${esc(x)}</span>`).join(' ');
const visibleTypes = pid => S.types.filter(t => t.projectId === pid && !t.hidden);
const typeFields = t => t.fields.filter(x => { const f = fld(x.f); return f && !f.hidden; });
