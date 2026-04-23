export const NODES = Object.freeze({
  perplexity: {
    label: 'Perplexity',
    layer: 'L1',
    risk: 'high',
    riskClass: 'risk-high',
    color: '#4A7AB8',
    role: 'Retrieval Portal',
    layerNote: 'Signal intake only',
    bypass: 'L3 synthesis / contested topics / analytical depth'
  },
  grok: {
    label: 'Grok',
    layer: 'L1',
    risk: 'high',
    riskClass: 'risk-high',
    color: '#7A68C8',
    role: 'Social Signal Detector',
    layerNote: 'Social/cultural signals only',
    bypass: 'Factual verification / representativeness-critical tasks'
  },
  kimi: {
    label: 'Kimi',
    layer: 'L2',
    risk: 'critical',
    riskClass: 'risk-critical',
    color: '#2A9268',
    role: 'Long-Context Indexer',
    layerNote: 'Corpus extraction only',
    bypass: 'Never direct to L3 — always interpose Claude'
  },
  qwen: {
    label: 'Qwen',
    layer: 'L2/L5',
    risk: 'medium',
    riskClass: 'risk-medium',
    color: '#C88A2A',
    role: 'Multilingual Bridge',
    layerNote: 'Corpus + code',
    bypass: 'Governance/policy analysis touching China-adjacent topics'
  },
  manus: {
    label: 'Manus',
    layer: 'L6',
    risk: 'high',
    riskClass: 'risk-high',
    color: '#C05030',
    role: 'Agentic Executor',
    layerNote: 'L6 agentic execution only',
    bypass: 'Synthesis / normative judgment / ambiguous objectives'
  },
  gemini: {
    label: 'Gemini',
    layer: 'L2–L3',
    risk: 'low',
    riskClass: 'risk-low',
    color: '#4A8B6A',
    role: 'Multimodal Corpus',
    layerNote: 'Corpus + synthesis',
    bypass: 'Tasks requiring deep normative governance reasoning'
  },
  chatgpt: {
    label: 'ChatGPT',
    layer: 'L4',
    risk: 'low',
    riskClass: 'risk-low',
    color: '#5A8A5A',
    role: 'User-Facing Generation',
    layerNote: 'Multimodal generation',
    bypass: 'Sovereign synthesis / accuracy-critical normative reasoning'
  },
  claude: {
    label: 'Claude',
    layer: 'L3',
    risk: 'tau',
    riskClass: 'risk-tau',
    color: '#C8973A',
    role: 'τ-Node Sovereign',
    layerNote: 'Reasoning / synthesis / governance',
    bypass: 'N/A — sovereign node'
  },
  deepseek: {
    label: 'DeepSeek',
    layer: 'L3/L5',
    risk: 'medium',
    riskClass: 'risk-medium',
    color: '#6A6A9A',
    role: 'Technical Reasoning',
    layerNote: 'Technical reasoning + code',
    bypass: 'China-adjacent governance analysis / normative reasoning'
  }
});

export const CHECKLISTS = Object.freeze({
  perplexity: [
    'Statistics traced to primary source — not secondary aggregator',
    'Contradictions preserved in output, not synthesized away',
    'Source publication dates checked — recency bias assessed',
    '[SYNTHESIS] connective tissue identified and isolated from retrieval'
  ],
  grok: [
    'Claims tagged [X-PLATFORM SIGNAL, NON-REPRESENTATIVE] in CPF',
    'Output register is neutral — no X-platform rhetorical style bleeding',
    'Capture timestamp noted — signal freshness verified (<72hrs)',
    'Political framing assessed for post-2022 ownership-era skew'
  ],
  kimi: [
    '≥20% of claims sample-verified against source document passages',
    '[INFERRED] tags reviewed — none presented as extracted fact',
    'Contradictions preserved, not silently resolved through synthesis',
    'Synthesis layer will be interposed — Kimi output not entering CPF directly'
  ],
  qwen: [
    '[OMISSION] flags reviewed — silent gaps on China-adjacent topics checked',
    'Topic coverage manually verified against known censored domains',
    'Code outputs reviewed against constraint intent, not just syntactic correctness',
    'Normative inference tagged — not treated as factual extraction'
  ],
  manus: [
    'Coverage completeness vs. stated scope verified — no silent partial completion',
    '3–5 key source citations sample-verified against primary sources',
    'Domain bias checked — paywall-inaccessible sources systematically absent?',
    'Expected edge cases: halt-flagged vs. silently passed through?'
  ],
  claude: [
    'Output preserves original ache without normative drift',
    'Excessive hedging checked — conclusions not undermined by over-qualification',
    'Theoretical claims grounded in corpus — not free-floating framework generation',
    'Sovereign synthesis posture maintained — no sycophantic compliance artifacts'
  ],
  deepseek: [
    'Reasoning chain audited — premises verified, not just conclusions',
    'Over-literal compliance checked — instruction syntax vs. intent',
    'China-adjacent topic coverage gaps checked (parallel to Qwen risk)',
    'Technical outputs validated against domain constraints beyond syntax'
  ],
  gemini: [
    'Cross-modal synthesis verified — no false coherence between modalities',
    'Confident-hedging paradox checked — certainty claims evaluated',
    'Google ecosystem bias assessed — coverage gaps in non-Google domains?',
    'Output depth appropriate to task — breadth-over-depth trade-off acceptable here?'
  ],
  chatgpt: [
    'Sycophantic drift checked — approval-seeking over accuracy signals',
    'Safety theater identified — legitimate analytical complexity not flattened',
    'RLHF polish does not mask underlying analytical gaps',
    'User-facing output still contains original analytical substance from CPF'
  ]
});

export const LAYER_ROUTING_RULES = Object.freeze({
  kimi: {
    forbidden_target_layers: [3, 4, 5, 6],
    warning: 'Kimi → L3+ routing is prohibited. Interpose Claude (τ-node) at L3 before CPF synthesis.'
  },
  perplexity: {
    forbidden_target_layers: [3, 4, 5, 6],
    warning: 'Perplexity → L3+ routing carries citation-laundering risk. Use as L1 input only.'
  },
  grok: {
    forbidden_target_layers: [3, 4, 5, 6],
    warning: 'Grok → L3+ routing risks platform-demographic contamination. Tag X-platform signals first.'
  }
});

const LAYER_RANGES = Object.freeze({
  'L1': [1, 1],
  'L2': [2, 2],
  'L2/L5': [2, 5],
  'L2–L3': [2, 3],
  'L3': [3, 3],
  'L3/L5': [3, 5],
  'L4': [4, 4],
  'L5': [5, 5],
  'L6': [6, 6]
});

export function escapeHTML(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function normalizeLayerNumber(layer) {
  const range = LAYER_RANGES[layer];
  if (!range) return null;
  return range[0];
}

export function getChecklistForSource(sourceId) {
  return CHECKLISTS[sourceId] ?? CHECKLISTS.claude;
}

export function getRoutingDecision(sourceId, targetId) {
  const source = NODES[sourceId];
  const target = NODES[targetId];
  if (!source || !target) {
    return {
      allowed: false,
      reason: 'Missing source or target node.'
    };
  }
  const rules = LAYER_ROUTING_RULES[sourceId];
  if (!rules) return { allowed: true, reason: '' };

  const targetRange = target.layer.split(/[\/\–\-]/).map(part => {
    const n = Number.parseInt(part.replace(/[^\d]/g, ''), 10);
    return Number.isFinite(n) ? n : null;
  }).filter(Boolean);

  const targetMax = targetRange.length ? Math.max(...targetRange) : normalizeLayerNumber(target.layer);
  const blocked = rules.forbidden_target_layers.includes(targetMax);

  return {
    allowed: !blocked,
    reason: blocked ? rules.warning : '',
    source,
    target,
    targetMax
  };
}

export function parseRawToCPF(raw, ache = '') {
  const cleaned = String(raw ?? '').trim();
  const lines = cleaned.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

  const firstBlock = lines.slice(0, 3).join(' ').slice(0, 260);
  const middleBlock = lines.slice(Math.floor(lines.length * 0.2), Math.floor(lines.length * 0.7)).join(' ').slice(0, 360);
  const lastBlock = lines.slice(-3).join(' ').slice(0, 260);

  const objective = ache ? String(ache).trim() : inferObjective(cleaned);
  return {
    objective,
    state: firstBlock,
    insights: middleBlock,
    unresolved: lastBlock,
    next: inferNextTask(cleaned),
    sourceLength: cleaned.length
  };
}

function inferObjective(raw) {
  const firstSentence = raw.split(/(?<=[.!?])\s+/)[0] ?? '';
  return firstSentence.slice(0, 220);
}

function inferNextTask(raw) {
  const lines = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const questionLines = lines.filter(line => /\?|unclear|open|next|follow[- ]?up|need/i.test(line));
  return (questionLines[0] ?? lines.at(-1) ?? '').slice(0, 220);
}

export function serializeChecklist(checklistBooleans) {
  return Array.isArray(checklistBooleans) ? checklistBooleans.map(Boolean) : [];
}

export function allChecklistCleared(checklistBooleans) {
  const checklist = serializeChecklist(checklistBooleans);
  return checklist.length > 0 && checklist.every(Boolean);
}

export function buildProvenanceTag({
  sourceNode,
  targetNode,
  checklist,
  sessionId,
  timestamp = new Date().toISOString()
}) {
  const source = NODES[sourceNode];
  const target = NODES[targetNode];
  const verified = allChecklistCleared(checklist) ? 'YES' : 'NO';
  const riskWarn = source?.risk === 'critical' ? ' ⚠ CRITICAL' : source?.risk === 'high' ? ' ⚠ HIGH' : '';

  return {
    verified,
    block:
`[${(source?.label ?? 'UNKNOWN').toUpperCase()}:${timestamp}]
[LAYER:${source?.layer ?? '—'} → ${target?.layer ?? '—'}]
[SOURCE_RISK:${(source?.risk ?? '—').toUpperCase()}${riskWarn}]
[CHECKLIST_CLEARED:${verified}]
[τ_VERIFIED:${verified}]
[HANDOFF_TO:${(target?.label ?? 'UNKNOWN').toUpperCase()}:${target?.layer ?? '—'}]
[SESSION:${sessionId}]`
  };
}

export function buildPPDTemplate(nodeId) {
  const templates = {
    perplexity: `ROLE: Citation retrieval system
BOUNDARY: Return current web state with source attribution only — no synthesis
FAILURE FLAG: Flag [SYNTHESIS] on any interpretive connective tissue
CONSTRAINT: Prefer primary sources; mark secondary aggregators explicitly`,
    grok: `ROLE: Social discourse monitor
BOUNDARY: Report X/Twitter discourse patterns only — no interpretation
FAILURE FLAG: Maintain neutral register; do not adopt X-platform rhetorical style
CONSTRAINT: Distinguish high-follower vs. volume signals; tag all claims [X-PLATFORM SIGNAL]`,
    kimi: `ROLE: Document indexing and extraction engine
BOUNDARY: Extraction and structuring only — no synthesis, no interpretation
FAILURE FLAG: Mark all cross-document inference as [INFERRED]; flag contradictions rather than resolving
CONSTRAINT: Return structured extraction with document-level provenance per claim`,
    qwen: `ROLE: Structured corpus processor / multilingual extraction engine
BOUNDARY: Process and structure — flag normative inference as [INFERENCE]
FAILURE FLAG: Disclose any content gaps with [OMISSION: topic] rather than silent omission
CONSTRAINT: Do not interpret governance or policy content; extract and structure only`,
    manus: `ROLE: Bounded autonomous task executor
BOUNDARY: Well-scoped deliverable only — halt and report on ambiguity rather than proceeding
FAILURE FLAG: Do not generate plausible-looking outputs to fill gaps; incomplete = flagged incomplete
CONSTRAINT: Define success criteria before execution; flag paywalled/inaccessible sources`,
    claude: `ROLE: τ-Node sovereign synthesis
BOUNDARY: Normative reasoning, governance analysis, structural synthesis
FAILURE FLAG: Avoid excessive hedging that undermines conclusions; maintain epistemic directness
CONSTRAINT: Preserve the original ache; do not allow compliance artifacts to deflect core inquiry`,
    deepseek: `ROLE: Technical reasoning and chain-of-thought engine
BOUNDARY: Logical/mathematical/technical problems with auditable reasoning traces
FAILURE FLAG: Verify premises, not just conclusions; flag over-literal compliance artifacts
CONSTRAINT: Expose assumptions explicitly; mark uncertainty in reasoning chain`,
    gemini: `ROLE: Multimodal corpus synthesis
BOUNDARY: Cross-modal integration and broad knowledge synthesis
FAILURE FLAG: Flag confident-hedging paradox; verify cross-modal claims independently
CONSTRAINT: Assess Google ecosystem coverage bias for domain balance`,
    chatgpt: `ROLE: User-facing output generation and communication
BOUNDARY: L4 generation only — final polish layer, not analytical reasoning
FAILURE FLAG: Check for sycophantic drift; preserve analytical substance from CPF
CONSTRAINT: Do not smooth away nuance for readability; flag safety theater responses`
  };
  return templates[nodeId] ?? `ROLE: General processing
BOUNDARY: Follow CPF objective
FAILURE FLAG: Preserve original ache; flag context drift`;
}

export async function buildExportPacket({
  sourceNode,
  targetNode,
  cpf,
  checklist,
  sessionId,
  rawInput
}) {
  const source = NODES[sourceNode];
  const target = NODES[targetNode];
  if (!source || !target) {
    throw new Error('Cannot build packet without valid source and target nodes.');
  }
  const provenance = buildProvenanceTag({ sourceNode, targetNode, checklist, sessionId });
  const ppd = buildPPDTemplate(targetNode);

  const humanText =
`━━━ CPF PACKET ━━━

[OBJECTIVE]
${cpf.objective || '—'}

[CURRENT STATE]
${cpf.state || '—'}

[KEY INSIGHTS]
${cpf.insights || '—'}

[UNRESOLVED QUESTIONS]
${cpf.unresolved || '—'}

[NEXT TASK]
${cpf.next || '—'}

━━━ PROVENANCE ━━━

${provenance.block}

━━━ PPD TEMPLATE ━━━

${ppd}`;

  const payload = {
    meta: {
      sessionId,
      exportedAt: new Date().toISOString(),
      source: sourceNode,
      target: targetNode,
      sourceLayer: source.layer,
      targetLayer: target.layer,
      checklistCleared: allChecklistCleared(checklist)
    },
    cpf: {
      objective: cpf.objective || '',
      state: cpf.state || '',
      insights: cpf.insights || '',
      unresolved: cpf.unresolved || '',
      next: cpf.next || ''
    },
    provenance: provenance.block,
    rawInputHash: await sha256Hex(rawInput ?? ''),
    ppd,
  };

  const jsonText = JSON.stringify(payload, null, 2);

  return {
    humanText,
    jsonText,
    provenance: provenance.block,
    payload
  };
}

export async function sha256Hex(input) {
  const bytes = new TextEncoder().encode(String(input ?? ''));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function pickNodeBadgeClass(risk) {
  return `badge-risk-${risk}`;
}
