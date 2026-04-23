import {
  NODES,
  getChecklistForSource,
  getRoutingDecision,
  parseRawToCPF,
  allChecklistCleared,
  buildExportPacket,
  escapeHTML,
  pickNodeBadgeClass
} from './rules.js';

import {
  loadPrefs,
  savePrefs,
  saveSession,
  listSessions
} from './storage.js';

const state = {
  step: 1,
  totalSteps: 5,
  ache: '',
  sourceNode: '',
  targetNode: '',
  rawInput: '',
  cpf: {
    objective: '',
    state: '',
    insights: '',
    unresolved: '',
    next: ''
  },
  checklist: [],
  checklistState: {},
  sessionId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now())
};

const els = {};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  cacheEls();
  bindEvents();
  await hydrate();
  renderAll();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function cacheEls() {
  const ids = [
    'step-dots', 'step-label', 'ache-display', 'edit-ache-btn', 'ache-editor-slot',
    'source-chips', 'target-chips', 'source-node-info', 'raw-input', 'paste-from-label',
    'paste-char-count', 'cpf-objective', 'cpf-state', 'cpf-insights', 'cpf-unresolved', 'cpf-next',
    'routing-guard', 'target-selected-info', 'checklist-source-label', 'checklist-status',
    'handoff-status', 'progress-fill', 'checklist-items', 'cpf-tag-block', 'full-cpf-block',
    'footer-buttons', 'copy-toast', 'content', 'vault-btn', 'vault-modal', 'close-vault-btn', 'vault-list'
  ];
  for (const id of ids) els[id] = document.getElementById(id);
}

function bindEvents() {
  els['edit-ache-btn'].addEventListener('click', toggleAcheEditor);
  els['raw-input'].addEventListener('input', onRawInput);
  els['vault-btn'].addEventListener('click', openVault);
  els['close-vault-btn'].addEventListener('click', () => { els['vault-modal'].style.display = 'none'; });

  for (const id of ['cpf-objective', 'cpf-state', 'cpf-insights', 'cpf-unresolved', 'cpf-next']) {
    els[id].addEventListener('input', syncCPFInputs);
  }
}

async function hydrate() {
  const prefs = await loadPrefs();
  state.ache = prefs.ache || '';
  state.checklistState = prefs.checklistState || {};
  if (state.ache) els['edit-ache-btn'].textContent = 'EDIT';
}

function renderAll() {
  renderStepDots();
  renderAche();
  renderChips('source-chips', state.sourceNode, selectSource);
  renderChips('target-chips', state.targetNode, selectTarget);
  renderFooter();
  renderStepSpecific();
}

function renderStepDots() {
  els['step-dots'].innerHTML = Array.from({ length: state.totalSteps }, (_, i) => {
    const cls = i + 1 < state.step ? 'done' : i + 1 === state.step ? 'active' : '';
    return `<div class="step-dot ${cls}"></div>`;
  }).join('');
  els['step-label'].textContent = `STEP ${state.step} OF ${state.totalSteps}`;
}

function renderAche() {
  if (state.ache) {
    els['ache-display'].textContent = state.ache;
    els['ache-display'].classList.remove('placeholder');
  } else {
    els['ache-display'].textContent = 'No anchor set — tap EDIT to set your core query';
    els['ache-display'].classList.add('placeholder');
  }
}

function toggleAcheEditor() {
  const existing = document.getElementById('ache-input-wrap');
  if (existing) {
    existing.remove();
    els['edit-ache-btn'].textContent = state.ache ? 'EDIT' : 'SET';
    return;
  }

  const wrap = document.createElement('div');
  wrap.id = 'ache-input-wrap';
  wrap.style.cssText = 'margin-top:8px';
  wrap.innerHTML = `
    <textarea id="ache-input" rows="2" style="width:100%;font-size:13px;padding:10px;background:var(--bg3);border:1px solid var(--amber-dim);border-radius:var(--r);color:var(--text);resize:none;outline:none;font-family:inherit" placeholder="Your core query / original research ache...">${escapeHTML(state.ache)}</textarea>
    <button type="button" id="save-ache-btn" style="margin-top:6px;width:100%;padding:9px;background:var(--amber);color:#0C0C0A;border:none;border-radius:var(--r);font-size:12px;font-weight:800;cursor:pointer;letter-spacing:.06em">SET ANCHOR</button>
  `;
  els['ache-editor-slot'].replaceChildren(wrap);
  document.getElementById('save-ache-btn').addEventListener('click', saveAche);
  document.getElementById('ache-input').focus();
}

async function saveAche() {
  const input = document.getElementById('ache-input');
  const val = (input?.value || '').trim();
  state.ache = val;
  document.getElementById('ache-input-wrap')?.remove();
  els['edit-ache-btn'].textContent = state.ache ? 'EDIT' : 'SET';
  renderAche();
  await savePrefs({ ache: state.ache, checklistState: state.checklistState });
  renderFooter();
}

function renderChips(containerId, selectedId, onSelect) {
  const container = els[containerId];
  container.innerHTML = Object.entries(NODES).map(([id, node]) => {
    const selected = selectedId === id ? 'selected' : '';
    return `
      <button type="button" class="chip ${selected}" data-id="${id}" style="--chip-color:${node.color}">
        <div class="chip-risk ${node.riskClass}"></div>
        <div class="chip-name">${escapeHTML(node.label)}</div>
        <div class="chip-layer">${escapeHTML(node.layer)}</div>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.chip').forEach(button => {
    button.addEventListener('click', () => onSelect(button.dataset.id));
  });
}

function resetDependentStateOnSourceChange() {
  state.rawInput = '';
  state.cpf = { objective: '', state: '', insights: '', unresolved: '', next: '' };
  state.checklist = [];
  syncFormFields();
}

function selectSource(id) {
  if (state.sourceNode && state.sourceNode !== id) {
    resetDependentStateOnSourceChange();
  }
  state.sourceNode = id;
  renderAll();
}

function selectTarget(id) {
  state.targetNode = id;
  const decision = getRoutingDecision(state.sourceNode, state.targetNode);
  if (!decision.allowed) {
    els['routing-guard'].textContent = `⚠ ${decision.reason}`;
    els['routing-guard'].classList.add('show');
  } else {
    els['routing-guard'].textContent = '';
    els['routing-guard'].classList.remove('show');
  }
  ensureChecklistForRoute();
  renderAll();
}

function ensureChecklistForRoute() {
  if (!state.sourceNode || !state.targetNode) {
    state.checklist = [];
    return;
  }
  const routeKey = routeKeyOf(state.sourceNode, state.targetNode);
  const checklist = state.checklistState[routeKey];
  if (Array.isArray(checklist) && checklist.length === getChecklistForSource(state.sourceNode).length) {
    state.checklist = checklist.slice();
  } else {
    state.checklist = getChecklistForSource(state.sourceNode).map(() => false);
  }
}

function routeKeyOf(source, target) {
  return `${source}→${target}`;
}

function onRawInput() {
  state.rawInput = els['raw-input'].value;
  els['paste-char-count'].textContent = `${state.rawInput.length.toLocaleString()} chars`;
  renderFooter();
}

function syncCPFInputs() {
  state.cpf.objective = els['cpf-objective'].value;
  state.cpf.state = els['cpf-state'].value;
  state.cpf.insights = els['cpf-insights'].value;
  state.cpf.unresolved = els['cpf-unresolved'].value;
  state.cpf.next = els['cpf-next'].value;
}

function syncFormFields() {
  els['raw-input'].value = state.rawInput;
  els['paste-char-count'].textContent = `${state.rawInput.length.toLocaleString()} chars`;
  els['cpf-objective'].value = state.cpf.objective;
  els['cpf-state'].value = state.cpf.state;
  els['cpf-insights'].value = state.cpf.insights;
  els['cpf-unresolved'].value = state.cpf.unresolved;
  els['cpf-next'].value = state.cpf.next;
}

function renderStepSpecific() {
  for (const id of ['step-1', 'step-2', 'step-3', 'step-4', 'step-5']) {
    document.getElementById(id).classList.toggle('active', id === `step-${state.step}`);
  }

  if (state.step === 2) {
    renderSourceNodeInfo();
  } else if (state.step === 4) {
    renderTargetStep();
  } else if (state.step === 5) {
    renderExportStep();
  }
}

function renderSourceNodeInfo() {
  const node = NODES[state.sourceNode];
  if (!node) {
    els['source-node-info'].innerHTML = `<div class="empty-state">Select a source node first.</div>`;
    els['paste-from-label'].textContent = '—';
    return;
  }

  els['source-node-info'].innerHTML = `
    <div class="node-info-dot" style="background:${node.color}"></div>
    <div>
      <div class="node-info-name">${escapeHTML(node.label)}</div>
      <div class="node-info-role">${escapeHTML(node.role)}</div>
      <div class="node-info-badges">
        <span class="badge badge-layer">${escapeHTML(node.layer)}</span>
        <span class="badge badge-${node.risk === 'tau' ? 'tau' : pickNodeBadgeClass(node.risk)}">${node.risk.toUpperCase()} RISK</span>
      </div>
    </div>
  `;
  els['paste-from-label'].textContent = node.label.toUpperCase();
}

function renderTargetStep() {
  const routeReady = Boolean(state.sourceNode && state.targetNode);
  els['target-selected-info'].style.display = routeReady ? 'block' : 'none';
  if (!routeReady) return;

  els['checklist-source-label'].textContent = `${NODES[state.sourceNode]?.label || '—'} OUTPUT`;
  renderChecklist();
  updateChecklistProgress();
}

function renderChecklist() {
  const checklist = getChecklistForSource(state.sourceNode);
  if (!state.checklist.length || state.checklist.length !== checklist.length) {
    ensureChecklistForRoute();
  }

  els['checklist-items'].innerHTML = checklist.map((text, index) => {
    const checked = Boolean(state.checklist[index]);
    return `
      <div class="check-item ${checked ? 'checked' : ''}" data-index="${index}">
        <div class="check-box"><span class="check-mark">✓</span></div>
        <div class="check-text">${escapeHTML(text)}</div>
      </div>
    `;
  }).join('');

  els['checklist-items'].querySelectorAll('.check-item').forEach(el => {
    el.addEventListener('click', () => toggleCheck(Number(el.dataset.index)));
  });
}

async function toggleCheck(index) {
  state.checklist[index] = !state.checklist[index];
  const routeKey = routeKeyOf(state.sourceNode, state.targetNode);
  state.checklistState[routeKey] = state.checklist.slice();
  await savePrefs({ ache: state.ache, checklistState: state.checklistState });
  renderChecklist();
  updateChecklistProgress();
  renderFooter();
}

function updateChecklistProgress() {
  const done = state.checklist.filter(Boolean).length;
  const total = state.checklist.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  els['checklist-status'].textContent = `${done} of ${total} cleared`;
  els['progress-fill'].style.width = `${pct}%`;
  const ready = total > 0 && done === total;
  els['handoff-status'].textContent = ready ? 'τ-VERIFIED' : 'NOT READY';
  els['handoff-status'].style.color = ready ? 'var(--green)' : 'var(--text3)';
}

function canAdvance() {
  switch (state.step) {
    case 1:
      return Boolean(state.sourceNode);
    case 2:
      return state.rawInput.trim().length > 20;
    case 3:
      return true;
    case 4:
      return Boolean(state.targetNode) && allChecklistCleared(state.checklist);
    default:
      return true;
  }
}

function renderFooter() {
  const can = canAdvance();
  if (state.step === 1) {
    els['footer-buttons'].innerHTML = `
      <div></div>
      <button type="button" class="btn btn-primary ${can ? '' : 'btn-disabled'}" id="next-btn">SELECT SOURCE →</button>
    `;
  } else if (state.step === 5) {
    els['footer-buttons'].innerHTML = `
      <button type="button" class="btn btn-secondary" id="back-btn">← BACK</button>
      <button type="button" class="btn btn-success" id="copy-btn">COPY PACKET</button>
    `;
  } else {
    const nextLabel = state.step === 4 ? 'BUILD EXPORT →' : 'NEXT →';
    els['footer-buttons'].innerHTML = `
      <button type="button" class="btn btn-secondary" id="back-btn">← BACK</button>
      <button type="button" class="btn btn-primary ${can ? '' : 'btn-disabled'}" id="next-btn">${nextLabel}</button>
    `;
  }

  document.getElementById('back-btn')?.addEventListener('click', prevStep);
  document.getElementById('next-btn')?.addEventListener('click', nextStep);
  document.getElementById('copy-btn')?.addEventListener('click', copyPacket);
}

function prevStep() {
  if (state.step > 1) {
    state.step -= 1;
    renderAll();
  }
}

async function nextStep() {
  if (!canAdvance()) return;

  if (state.step === 2) {
    state.cpf = parseRawToCPF(state.rawInput, state.ache);
    syncFormFields();
  }

  if (state.step === 4) {
    await renderExportStep();
  }

  if (state.step < state.totalSteps) {
    state.step += 1;
    renderAll();
  }
}

async function renderExportStep() {
  try {
    const packet = await buildExportPacket({
      sourceNode: state.sourceNode,
      targetNode: state.targetNode,
      cpf: state.cpf,
      checklist: state.checklist,
      sessionId: state.sessionId,
      rawInput: state.rawInput
    });

    const lines = packet.provenance.split('\n');
    els['cpf-tag-block'].innerHTML = lines.map(line => {
      const idx = line.indexOf(':');
      if (idx < 0) {
        return `${escapeHTML(line)}<br>`;
      }
      const key = escapeHTML(line.slice(0, idx));
      const value = escapeHTML(line.slice(idx + 1));
      const isWarn = line.includes('⚠') || line.includes('NO');
      const isOk = line.includes('YES');
      const cls = isWarn ? 'tag-warn' : isOk ? 'tag-ok' : 'tag-val';
      return `<span class="tag-key">${key}</span>:<span class="${cls}">${value}</span><br>`;
    }).join('');

    els['full-cpf-block'].textContent = packet.humanText + '\n\n━━━ JSON PAYLOAD ━━━\n\n' + packet.jsonText;
  } catch (error) {
    els['full-cpf-block'].textContent = `Export error: ${error.message}`;
    els['cpf-tag-block'].textContent = '';
  }
}

async function copyPacket() {
  const packet = await buildExportPacket({
    sourceNode: state.sourceNode,
    targetNode: state.targetNode,
    cpf: state.cpf,
    checklist: state.checklist,
    sessionId: state.sessionId,
    rawInput: state.rawInput
  });

  const text = `${packet.humanText}\n\n━━━ JSON PAYLOAD ━━━\n\n${packet.jsonText}`;

  try {
    await navigator.clipboard.writeText(text);
    showToast();
    await saveSession({
      id: state.sessionId,
      timestamp: new Date().toISOString(),
      source: state.sourceNode,
      target: state.targetNode,
      cpf: state.cpf
    });
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast();
  }
}

function showToast() {
  els['copy-toast'].classList.add('show');
  setTimeout(() => els['copy-toast'].classList.remove('show'), 1600);
}

async function openVault() {
  els['vault-modal'].style.display = 'block';
  els['vault-list'].innerHTML = '<div class="empty-state">Loading...</div>';
  const sessions = await listSessions(10);
  if (!sessions.length) {
    els['vault-list'].innerHTML = '<div class="empty-state">No saved sessions found.</div>';
    return;
  }
  
  els['vault-list'].innerHTML = sessions.map((s, i) => {
    const d = new Date(s.timestamp);
    const timeStr = isNaN(d.getTime()) ? s.timestamp : d.toLocaleString();
    const source = NODES[s.source]?.label || s.source;
    const target = NODES[s.target]?.label || s.target;
    const obj = s.cpf?.objective || 'No objective set';
    return `
      <div class="vault-item" data-index="${i}">
        <div class="vault-item-time">${escapeHTML(timeStr)}</div>
        <div class="vault-item-route">${escapeHTML(source)} → ${escapeHTML(target)}</div>
        <div class="vault-item-ache">${escapeHTML(obj)}</div>
      </div>
    `;
  }).join('');

  els['vault-list'].querySelectorAll('.vault-item').forEach(el => {
    el.addEventListener('click', () => {
      restoreSession(sessions[Number(el.dataset.index)]);
      els['vault-modal'].style.display = 'none';
    });
  });
}

async function restoreSession(s) {
  state.sessionId = s.id || crypto.randomUUID();
  state.sourceNode = s.source;
  state.targetNode = s.target;
  state.cpf = s.cpf || { objective: '', state: '', insights: '', unresolved: '', next: '' };
  
  if (state.sourceNode && state.targetNode) {
     ensureChecklistForRoute(); 
  }

  state.step = 5;
  syncFormFields();
  renderAll();
  await renderExportStep();
}
