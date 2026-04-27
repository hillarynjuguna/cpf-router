import {
  NODES,
  getChecklistForSource,
  getRoutingDecision,
  parseRawToCPF,
  detectSecondOrderSynthesis,
  allChecklistCleared,
  buildExportPacket,
  escapeHTML,
  pickNodeBadgeClass,
  PASTE_HINTS
} from './rules.js';

import {
  loadPrefs,
  savePrefs,
  saveSession,
  listSessions
} from './storage.js';

const state = {
  ache: '',
  sourceNode: '',
  targetNode: '',
  rawInput: '',
  cpf: {
    objective: '',
    state: '',
    insights: '',
    unresolved: '',
    next: '',
    meta: {}
  },
  checklist: [],
  checklistState: {},
  sessionId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  // Chain metadata for multi-hop provenance
  hopCount: 1,
  parentSessionId: null,
  lineage: [],
  attestor: 'τ_UNKNOWN',
  attestorStandard: 'manual'
};

const els = {};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  cacheEls();
  bindEvents();
  await hydrate();
  await handleIncomingShare();
  renderAll();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
    navigator.serviceWorker.addEventListener('message', ({ data }) => {
      if (data?.type === 'SW_UPDATED') {
        showToast('App updated — reload for latest version', 3000);
      }
    });
  }
}

function cacheEls() {
  const ids = [
    'ache-display', 'route-nodes', 'risk-indicator', 'vault-btn',
    'source-chips', 'target-chips', 'raw-input', 'paste-from-label',
    'paste-char-count', 'parse-quality', 'source-node-hint',
    'cpf-objective', 'cpf-state', 'cpf-insights', 'cpf-unresolved', 'cpf-next',
    'conf-objective', 'conf-state', 'conf-insights', 'conf-unresolved', 'conf-next',
    'export-preview', 'cpf-tag-block', 'full-cpf-block',
    'checklist-area', 'checklist-status', 'handoff-status', 'progress-fill', 'checklist-items',
    'routing-guard', 'clear-btn', 'copy-ai-btn', 'copy-json-btn', 'next-hop-btn',
    'copy-toast', 'vault-modal', 'close-vault-btn', 'vault-list',
    'attestor-input', 'attestor-standard'
  ];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) els[id] = el;
  }
}

function bindEvents() {
  const cpfFields = ['cpf-objective', 'cpf-state', 'cpf-insights', 'cpf-unresolved', 'cpf-next'];
  for (const id of cpfFields) {
    els[id].addEventListener('input', () => {
      syncCPFInputs();
      autoGrow(els[id]);
      renderExportPreview();
      saveDraft();
    });
    els[id].addEventListener('focus', () => highlightSource(id));
    els[id].addEventListener('blur', () => clearSourceHighlight());
  }

  els['raw-input'].addEventListener('input', () => {
    onRawInput();
    saveDraft();
  });

  els['ache-display'].addEventListener('click', startAcheEdit);
  els['ache-display'].addEventListener('blur', finishAcheEdit);
  els['ache-display'].addEventListener('keydown', e => { 
    if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } 
  });

  els['clear-btn'].addEventListener('click', clearAll);
  els['copy-ai-btn'].addEventListener('click', () => copyPacket('ai'));
  els['copy-json-btn'].addEventListener('click', () => copyPacket('json'));
  els['next-hop-btn'].addEventListener('click', startNextHop);
  els['vault-btn'].addEventListener('click', openVault);
  els['close-vault-btn'].addEventListener('click', () => { els['vault-modal'].style.display = 'none'; });

  // Operator identity
  els['attestor-input'].addEventListener('change', () => {
    state.attestor = els['attestor-input'].value.trim() || 'τ_UNKNOWN';
    savePrefs({ attestor: state.attestor });
  });
  els['attestor-standard'].addEventListener('change', () => {
    state.attestorStandard = els['attestor-standard'].value;
    savePrefs({ attestorStandard: state.attestorStandard });
  });
}

async function saveDraft() {
  const draft = {
    rawInput: state.rawInput,
    cpf: state.cpf,
    hopCount: state.hopCount,
    parentSessionId: state.parentSessionId,
    lineage: state.lineage
  };
  await savePrefs({ draft });
}

function autoGrow(el) {
  if (!window.CSS || !CSS.supports('field-sizing', 'content')) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }
}

async function hydrate() {
  const prefs = await loadPrefs();
  state.ache = prefs.ache || '';
  state.checklistState = prefs.checklistState || {};
  state.attestor = prefs.attestor || 'τ_UNKNOWN';
  state.attestorStandard = prefs.attestorStandard || 'manual';
  
  if (prefs.draft) {
    state.rawInput = prefs.draft.rawInput || '';
    state.cpf = prefs.draft.cpf || state.cpf;
    state.hopCount = prefs.draft.hopCount || 1;
    state.parentSessionId = prefs.draft.parentSessionId || null;
    state.lineage = prefs.draft.lineage || [];
  }

  if (!state.sourceNode && prefs.lastTargetNode) {
    state.sourceNode = prefs.lastTargetNode;
  }
}

async function handleIncomingShare() {
  const url = new URL(window.location.href);
  const title = url.searchParams.get('title');
  const text = url.searchParams.get('text');
  const sharedUrl = url.searchParams.get('url');

  let incoming = '';
  if (text) incoming += text;
  if (sharedUrl) incoming += (incoming ? '\n\n' : '') + sharedUrl;
  
  if (title && (!text || !text.includes(title))) {
    incoming = `[Shared: ${title}]\n\n` + incoming;
  }

  if (incoming.trim()) {
    state.rawInput = incoming.trim();
    onRawInput();
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function renderAll() {
  renderAche();
  renderRouteHeader();
  renderChips('source-chips', state.sourceNode, selectSource);
  renderChips('target-chips', state.targetNode, selectTarget);
  renderSourceContext();
  renderChecklistArea();
  syncFormFields();
  renderExportPreview();
  updateButtonStates();
  
  // Attestor UI sync
  if (els['attestor-input']) {
    els['attestor-input'].value = state.attestor === 'τ_UNKNOWN' ? '' : state.attestor;
  }
  if (els['attestor-standard']) {
    els['attestor-standard'].value = state.attestorStandard;
  }
}

function renderAche() {
  if (state.ache) {
    els['ache-display'].textContent = state.ache;
    els['ache-display'].classList.remove('placeholder');
  } else {
    els['ache-display'].textContent = 'No anchor set — tap to set your core query';
    els['ache-display'].classList.add('placeholder');
  }
}

function startAcheEdit() {
  if (!state.ache) {
    els['ache-display'].textContent = '';
    els['ache-display'].classList.remove('placeholder');
  }
  els['ache-display'].contentEditable = 'true';
  els['ache-display'].focus();
}

async function finishAcheEdit() {
  els['ache-display'].contentEditable = 'false';
  const val = els['ache-display'].textContent.trim();
  state.ache = val;
  renderAche();
  await savePrefs({ ache: state.ache, checklistState: state.checklistState });
}

function renderRouteHeader() {
  const s = NODES[state.sourceNode]?.label || '—';
  const t = NODES[state.targetNode]?.label || '—';
  els['route-nodes'].textContent = `${s} → ${t}`;
  
  const risk = NODES[state.targetNode]?.risk || 'none';
  const riskMap = { critical: 'var(--red)', high: '#C87030', medium: '#C8A030', low: 'var(--green)', tau: 'var(--amber)' };
  els['risk-indicator'].style.background = riskMap[risk] || 'var(--text3)';
}

function renderChips(containerId, selectedId, onSelect) {
  const container = els[containerId];
  container.innerHTML = Object.entries(NODES).map(([id, node]) => {
    const selected = selectedId === id ? 'selected' : '';
    return `
      <button type="button" class="chip ${selected}" data-id="${id}" style="--chip-color:${node.color}">
        <div class="chip-name">${escapeHTML(node.label)}</div>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.chip').forEach(button => {
    button.addEventListener('click', () => onSelect(button.dataset.id));
  });
}

function selectSource(id) {
  if (state.sourceNode === id) return;
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

function renderSourceContext() {
  const node = NODES[state.sourceNode];
  els['paste-from-label'].textContent = node ? node.label.toUpperCase() : '—';
  els['source-node-hint'].textContent = node ? `💡 ${PASTE_HINTS[state.sourceNode] || 'Review output for context.'}` : '';
}

function ensureChecklistForRoute() {
  if (!state.sourceNode || !state.targetNode) {
    state.checklist = [];
    return;
  }
  const routeKey = `${state.sourceNode}→${state.targetNode}`;
  const checklist = state.checklistState[routeKey];
  const expectedLength = getChecklistForSource(state.sourceNode).length;
  if (Array.isArray(checklist) && checklist.length === expectedLength) {
    state.checklist = checklist.slice();
  } else {
    state.checklist = getChecklistForSource(state.sourceNode).map(() => false);
  }
}

function renderChecklistArea() {
  const show = state.sourceNode && state.targetNode;
  els['checklist-area'].style.display = show ? 'block' : 'none';
  if (!show) return;

  const checklist = getChecklistForSource(state.sourceNode);
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
  updateChecklistProgress();
}

async function toggleCheck(index) {
  state.checklist[index] = !state.checklist[index];
  const routeKey = `${state.sourceNode}→${state.targetNode}`;
  state.checklistState[routeKey] = state.checklist.slice();
  await savePrefs({ ache: state.ache, checklistState: state.checklistState });
  renderChecklistArea();
  updateButtonStates();
}

function updateChecklistProgress() {
  const done = state.checklist.filter(Boolean).length;
  const total = state.checklist.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  els['checklist-status'].textContent = `${done}/${total}`;
  els['progress-fill'].style.width = `${pct}%`;
  const ready = total > 0 && done === total;
  els['handoff-status'].textContent = ready ? 'τ-VERIFIED' : 'NOT READY';
  els['handoff-status'].style.color = ready ? 'var(--green)' : 'var(--text3)';
}

function onRawInput() {
  state.rawInput = els['raw-input'].value;
  const chars = state.rawInput.length;
  
  // Auto-parse if we have enough content and it changed significantly
  if (chars > 20) {
    const result = parseRawToCPF(state.rawInput, state.ache, state.targetNode);
    
    if (result._classified) {
      const bridges = detectSecondOrderSynthesis(result._classified, 'standard');
      if (bridges.length > 0) {
        const bridgeText = bridges.map(b => `${b.tag} ${b.text}`).join('\n');
        result.insights = result.insights ? `${result.insights}\n\n[SYNTHESIS DETECTED]\n${bridgeText}` : bridgeText;
      }
    }

    state.cpf = result;
    syncFormFields();
    
    // Quality Signal
    const q = result.quality || 0.5;
    
    let label = 'LOW SIGNAL';
    let color = 'var(--red)';
    if (q >= 0.75) { label = 'HIGH SIGNAL'; color = 'var(--green)'; }
    else if (q >= 0.4) { label = 'MID SIGNAL'; color = 'var(--yellow)'; }
    
    els['parse-quality'].textContent = label;
    els['parse-quality'].style.color = color;
    els['parse-quality'].style.display = 'inline';
    els['paste-char-count'].textContent = `${chars.toLocaleString()} chars`;
  } else {
    els['parse-quality'].style.display = 'none';
    els['paste-char-count'].textContent = `${chars.toLocaleString()} chars`;
  }

  updateButtonStates();
  renderExportPreview();
}

function syncCPFInputs() {
  const fields = ['objective', 'state', 'insights', 'unresolved'];
  fields.forEach(f => {
    state.cpf[f] = els[`cpf-${f}`].value;
    if (state.cpf.meta && state.cpf.meta[f]) {
      state.cpf.meta[f].span = null;
      state.cpf.meta[f].confidence = Math.min(state.cpf.meta[f].confidence, 0.5);
    }
  });
  // NEXT TASK: rebuild structured from edited text
  const nextVal = els['cpf-next'].value;
  if (typeof state.cpf.next === 'object') {
    state.cpf.next.rawDirective = nextVal;
    state.cpf.next.confidence = 0.5;
  } else {
    state.cpf.next = nextVal;
  }
  if (state.cpf.meta && state.cpf.meta.next) {
    state.cpf.meta.next.span = null;
    state.cpf.meta.next.confidence = 0.5;
  }
}

function syncFormFields() {
  els['raw-input'].value = state.rawInput;
  const fields = ['objective', 'state', 'insights', 'unresolved', 'next'];
  fields.forEach(f => {
    let val;
    if (f === 'next' && typeof state.cpf.next === 'object') {
      const n = state.cpf.next;
      val = n.rawDirective || '';
      // Show structured info in placeholder-like display
      if (n.taskType && n.taskType !== 'unspecified') {
        const prefix = `[${n.taskType.toUpperCase()}]`;
        val = val ? `${prefix} ${val}` : prefix;
      }
    } else {
      val = state.cpf[f] || '';
    }
    els[`cpf-${f}`].value = val;
    autoGrow(els[`cpf-${f}`]);
    
    // Confidence Display
    const meta = state.cpf.meta && state.cpf.meta[f];
    const badge = els[`conf-${f}`];
    if (badge && meta) {
      const conf = meta.confidence;
      badge.textContent = conf >= 0.8 ? 'HIGH' : (conf >= 0.4 ? 'MID' : 'LOW');
      badge.className = 'conf-badge show ' + (conf >= 0.8 ? 'conf-high' : (conf >= 0.4 ? 'conf-mid' : 'conf-low'));
      badge.title = `Source Confidence: ${Math.round(conf * 100)}%`;
    } else if (badge) {
      badge.classList.remove('show');
    }
  });
  autoGrow(els['raw-input']);
}

function highlightSource(fieldId) {
  const fieldKey = fieldId.replace('cpf-', '');
  const meta = state.cpf.meta && state.cpf.meta[fieldKey];
  if (meta && meta.span) {
    const { start, end } = meta.span;
    const rawInputEl = els['raw-input'];
    
    // Set selection
    rawInputEl.setSelectionRange(start, end);
    rawInputEl.classList.add('source-highlight');
    
    // Scroll to selection (more accurate using line ratios)
    const lines = rawInputEl.value.split('\n');
    const textBefore = rawInputEl.value.substring(0, start);
    const lineIndex = textBefore.split('\n').length - 1;
    const linePct = lineIndex / lines.length;
    rawInputEl.scrollTop = (rawInputEl.scrollHeight * linePct) - 60;
    
    // Pulse effect on the badge
    const badge = els[`conf-${fieldKey}`];
    if (badge) {
      badge.style.transform = 'scale(1.1)';
      setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
  }
}

function clearSourceHighlight() {
  els['raw-input'].classList.remove('source-highlight');
}

async function renderExportPreview() {
  const ready = state.rawInput.length > 20 && state.sourceNode && state.targetNode;
  els['export-preview'].style.display = ready ? 'block' : 'none';
  if (!ready) return;

  const packet = await buildExportPacket({
    sourceNode: state.sourceNode,
    targetNode: state.targetNode,
    cpf: state.cpf,
    checklist: state.checklist,
    sessionId: state.sessionId,
    rawInput: state.rawInput,
    hopCount: state.hopCount,
    parentSessionId: state.parentSessionId,
    lineage: state.lineage,
    attestor: state.attestor,
    attestorStandard: state.attestorStandard
  });

  const lines = packet.provenance.split('\n');
  els['cpf-tag-block'].innerHTML = lines.map(line => {
    const idx = line.indexOf(':');
    if (idx < 0) return `${escapeHTML(line)}<br>`;
    const key = escapeHTML(line.slice(0, idx));
    const value = escapeHTML(line.slice(idx + 1));
    const cls = (line.includes('⚠') || line.includes('NO')) ? 'tag-warn' : line.includes('YES') ? 'tag-ok' : 'tag-val';
    return `<span class="tag-key">${key}</span>:<span class="${cls}">${value}</span><br>`;
  }).join('');

  els['full-cpf-block'].textContent = packet.humanText + '\n\n━━━ JSON PAYLOAD ━━━\n\n' + packet.jsonText;
}

function updateButtonStates() {
  const hasInput = state.rawInput.trim().length > 20;
  const hasNodes = state.sourceNode && state.targetNode;
  const verified = allChecklistCleared(state.checklist);
  
  const ready = hasInput && hasNodes && verified;
  
  els['copy-ai-btn'].classList.toggle('btn-disabled', !ready);
  els['copy-json-btn'].classList.toggle('btn-disabled', !ready);
  els['next-hop-btn'].classList.toggle('btn-disabled', !ready);
}

function clearAll() {
  if (!confirm('Clear all inputs and reset session?')) return;
  state.rawInput = '';
  state.sourceNode = '';
  state.targetNode = '';
  state.cpf = { objective: '', state: '', insights: '', unresolved: '', next: '' };
  state.checklist = [];
  state.sessionId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  renderAll();
}

async function copyPacket(type) {
  const packet = await buildExportPacket({
    sourceNode: state.sourceNode,
    targetNode: state.targetNode,
    cpf: state.cpf,
    checklist: state.checklist,
    sessionId: state.sessionId,
    rawInput: state.rawInput,
    hopCount: state.hopCount,
    parentSessionId: state.parentSessionId,
    lineage: state.lineage,
    attestor: state.attestor,
    attestorStandard: state.attestorStandard
  });

  const text = type === 'ai' ? packet.humanText : packet.jsonText;

  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied ${type.toUpperCase()}`);
    await saveSession({
      id: state.sessionId,
      timestamp: new Date().toISOString(),
      source: state.sourceNode,
      target: state.targetNode,
      cpf: state.cpf,
      hopCount: state.hopCount,
      lineage: state.lineage
    });
    await savePrefs({
      ache: state.ache,
      checklistState: state.checklistState,
      lastTargetNode: state.targetNode,
      attestor: state.attestor,
      attestorStandard: state.attestorStandard
    });
  } catch (err) {
    console.error('Clipboard error', err);
  }
}

function startNextHop() {
  if (!state.targetNode) return;
  const prevSessionId = state.sessionId;
  const prevSource = state.sourceNode;
  
  // Advance chain metadata
  state.lineage = state.lineage.concat([prevSource]);
  state.parentSessionId = prevSessionId;
  state.hopCount = state.hopCount + 1;
  state.sessionId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  
  state.sourceNode = state.targetNode;
  state.targetNode = '';
  state.rawInput = '';
  state.cpf = { objective: state.ache, state: '', insights: '', unresolved: '', next: '', meta: {} };
  state.checklist = [];
  renderAll();
  saveDraft();
}

function showToast(msg = 'Copied', duration = 1600) {
  els['copy-toast'].textContent = msg;
  els['copy-toast'].classList.add('show');
  setTimeout(() => els['copy-toast'].classList.remove('show'), duration);
}

async function openVault() {
  els['vault-modal'].style.display = 'block';
  els['vault-list'].innerHTML = '<div class="empty-state">Loading...</div>';
  const sessions = await listSessions(10);
  if (!sessions.length) {
    els['vault-list'].innerHTML = '<div class="empty-state">No saved sessions.</div>';
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
      const s = sessions[Number(el.dataset.index)];
      state.sessionId = s.id || crypto.randomUUID();
      state.sourceNode = s.source;
      state.targetNode = s.target;
      state.cpf = s.cpf || { objective: '', state: '', insights: '', unresolved: '', next: '' };
      ensureChecklistForRoute();
      renderAll();
      els['vault-modal'].style.display = 'none';
    });
  });
}
