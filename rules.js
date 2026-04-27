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

export const PASTE_HINTS = Object.freeze({
  kimi: 'Watch for [INFERRED] tags — flag them before proceeding',
  qwen: 'Check for silent omissions on China-adjacent topics',
  perplexity: 'Verify citations trace to primary sources, not aggregators',
  grok: 'Check for X-platform rhetorical style in the output register',
  deepseek: 'Audit reasoning chain premises — verify assumptions explicitly',
  claude: 'Preserve original ache; ensure no sycophantic compliance artifacts',
  gemini: 'Flag confident-hedging paradox; verify cross-modal claims',
  chatgpt: 'Check for sycophantic drift; preserve analytical substance'
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

// ━━━ VOCABULARY EXCLUSION LIST ━━━
const EXCLUDED_BRIDGE_TERMS = new Set([
  'risk', 'model', 'system', 'data', 'ai', 'analysis', 'approach', 'method',
  'process', 'result', 'output', 'input', 'framework', 'structure', 'context',
  'information', 'level', 'type', 'case', 'issue', 'problem', 'solution',
  'value', 'state', 'change', 'set', 'point', 'form', 'part', 'way',
  'time', 'work', 'use', 'need', 'make', 'take', 'give', 'find', 'know',
  'think', 'see', 'come', 'want', 'look', 'thing', 'step', 'task', 'note'
]);

function segmentSentences(raw) {
  const blocks = raw.split(/\n{2,}/);
  const sentences = [];
  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (/^[-*\u2022\u25B8\u25B9\d+.)]\s/.test(line)) {
        const cleaned = line.replace(/^[-*\u2022\u25B8\u25B9\d+.)]\s*/, '').trim();
        if (cleaned.length > 5) {
          const start = raw.indexOf(line);
          sentences.push({ text: cleaned, raw: line, start, end: start + line.length });
        }
        continue;
      }
      const parts = line.split(/(?<=[.!?])\s+(?=[A-Z])/);
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.length < 8) continue;
        if (/^[0-9a-f-]{36}$/i.test(trimmed)) continue;
        if (/^[\d\s.,\-:#|]+$/.test(trimmed)) continue;
        const start = raw.indexOf(trimmed);
        sentences.push({ text: trimmed, raw: trimmed, start, end: start + trimmed.length });
      }
    }
  }
  return sentences;
}

const CLASSIFY_PATTERNS = {
  TELIC: {
    strong: /\b(aim|seek|determine|investigate|goal|objective|purpose|intent|trying to|in order to)\b/i,
    structural: /\b(we want|I want|the question is|this asks|how (?:can|do|should)|what (?:is|are) the)\b/i,
    mood: /^(?:To |In order to |The goal |Our objective )/i
  },
  ASSERTIVE: {
    strong: /\b(is|are|was|were|has been|have been|exists|established|confirmed|verified|documented)\b/i,
    structural: /\b(currently|at present|as of|the fact that|it is known|evidence shows)\b/i,
    tense: /\b(measured|observed|recorded|detected|found that|shows that|demonstrated)\b/i
  },
  INFERENTIAL: {
    strong: /\b(therefore|consequently|implies|suggests|indicates|because|thus|hence|as a result)\b/i,
    structural: /\b(this means|this suggests|we can infer|this compounds|the relationship between|correlat)/i,
    causal: /\b(leads to|causes|produces|enables|amplifies|reinforces|creates a|feedback loop)\b/i
  },
  LIMINAL: {
    strong: /\b(unclear|unknown|uncertain|ambiguous|unresolved|open question|remains to be|not yet|gap|limit)/i,
    structural: /\?$|\b(but|however|although|despite|nevertheless|yet|on the other hand)\b/i,
    epistemic: /\b(might|could|possibly|potentially|speculative|hypothetical|untested|provisional)\b/i
  },
  DIRECTIVE: {
    strong: /\b(must|should|need to|action required|next step|follow[- ]up|implement|deploy|execute)\b/i,
    structural: /\b(moving forward|going forward|the plan is|we will|to be done|action item|deliverable)\b/i,
    imperative: /^(Run|Execute|Implement|Deploy|Test|Verify|Check|Review|Ensure|Create|Build|Set up)/i
  }
};

function classifySentence(sentence) {
  const text = sentence.text;
  const scores = {};
  for (const [type, patterns] of Object.entries(CLASSIFY_PATTERNS)) {
    let score = 0;
    if (patterns.strong && patterns.strong.test(text)) score += 3;
    if (patterns.structural && patterns.structural.test(text)) score += 2;
    const thirdKey = Object.keys(patterns).find(k => k !== 'strong' && k !== 'structural');
    if (thirdKey && patterns[thirdKey].test(text)) score += 1;
    scores[type] = score;
  }
  let bestType = 'ASSERTIVE';
  let bestScore = 0;
  for (const [type, score] of Object.entries(scores)) {
    if (score > bestScore) { bestType = type; bestScore = score; }
  }
  if (bestScore === 0) {
    bestType = text.endsWith('?') ? 'LIMINAL' : 'ASSERTIVE';
  }
  if (scores.ASSERTIVE === scores.INFERENTIAL && scores.INFERENTIAL > 0) {
    bestType = CLASSIFY_PATTERNS.INFERENTIAL.causal.test(text) ? 'INFERENTIAL' : 'ASSERTIVE';
  }
  const confidence = bestScore >= 4 ? 0.9 : bestScore >= 2 ? 0.7 : bestScore >= 1 ? 0.4 : 0.2;
  return { ...sentence, type: bestType, confidence, scores };
}

function parseExplicitHeaders(raw) {
  const result = {};
  const defs = [
    { field: 'objective', re: /(?:#{1,3}\s*)?(?:\[)?(?:OBJECTIVE|GOAL|PURPOSE|AIM)(?:\])?[:\s-]+([\s\S]*?)(?=\n(?:#{1,3}\s*)?(?:\[)?(?:CURRENT STATE|KEY INSIGHTS|UNRESOLVED|NEXT TASK)|$)/i },
    { field: 'state', re: /(?:#{1,3}\s*)?(?:\[)?(?:CURRENT STATE|STATUS|CONTEXT|BACKGROUND)(?:\])?[:\s-]+([\s\S]*?)(?=\n(?:#{1,3}\s*)?(?:\[)?(?:KEY INSIGHTS|UNRESOLVED|NEXT TASK)|$)/i },
    { field: 'insights', re: /(?:#{1,3}\s*)?(?:\[)?(?:KEY INSIGHTS|FINDINGS|CONCLUSIONS|RESULTS)(?:\])?[:\s-]+([\s\S]*?)(?=\n(?:#{1,3}\s*)?(?:\[)?(?:UNRESOLVED|NEXT TASK)|$)/i },
    { field: 'unresolved', re: /(?:#{1,3}\s*)?(?:\[)?(?:UNRESOLVED|OPEN QUESTIONS|UNCERTAINTY|GAPS)(?:\])?[:\s-]+([\s\S]*?)(?=\n(?:#{1,3}\s*)?(?:\[)?(?:NEXT TASK)|$)/i },
    { field: 'next', re: /(?:#{1,3}\s*)?(?:\[)?(?:NEXT TASK|NEXT STEPS|ACTION ITEMS|FOLLOW-UP)(?:\])?[:\s-]+([\s\S]*?)$/i }
  ];
  for (const { field, re } of defs) {
    const match = raw.match(re);
    if (match && match[1].trim().length > 5) {
      const val = match[1].trim();
      const start = raw.indexOf(val);
      result[field] = { value: val, confidence: 0.95, span: { start, end: start + val.length } };
    }
  }
  return result;
}

function buildStructuredNext(rawDirective, targetNode, confidence) {
  if (!rawDirective || !rawDirective.trim()) {
    return { taskType: 'unspecified', receivingNode: targetNode, scope: '', successCondition: '', confidence: 0, rawDirective: '' };
  }
  let taskType = 'synthesis';
  if (/\b(extract|parse|retrieve|collect|index|gather)\b/i.test(rawDirective)) taskType = 'extraction';
  if (/\b(verify|validate|check|confirm|audit|test|assess)\b/i.test(rawDirective)) taskType = 'verification';
  if (/\b(generate|create|write|produce|draft|compose|build)\b/i.test(rawDirective)) taskType = 'generation';
  const scopeMatch = rawDirective.match(/\b(?:scope|focus|regarding|about|on)\s*[:\-]?\s*(.+?)(?:\.|$)/im);
  const successMatch = rawDirective.match(/\b(?:success|criteria|goal|achieve|deliver)\s*[:\-]?\s*(.+?)(?:\.|$)/im);
  return {
    taskType,
    receivingNode: targetNode || '',
    scope: scopeMatch ? scopeMatch[1].trim().slice(0, 200) : '',
    successCondition: successMatch ? successMatch[1].trim().slice(0, 200) : '',
    confidence: confidence || 0.2,
    rawDirective: rawDirective.slice(0, 500)
  };
}

function avgConf(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, x) => s + x.confidence, 0) / arr.length;
}

export function parseRawToCPF(raw, ache = '', targetNode = '') {
  const cleaned = String(raw ?? '').trim();
  if (!cleaned) {
    return {
      objective: ache, state: '', insights: '', unresolved: '', next: '',
      meta: {
        objective: { confidence: 1, span: null },
        state: { confidence: 0, span: null },
        insights: { confidence: 0, span: null },
        unresolved: { confidence: 0, span: null },
        next: { confidence: 0, span: null }
      }
    };
  }

  // Pass 1: Segment and classify
  const sentences = segmentSentences(cleaned);
  const classified = sentences.map(classifySentence);

  // Check for explicit section headers (high-confidence override)
  const headerParsed = parseExplicitHeaders(cleaned);

  // Pass 2: Aggregate by epistemological type
  const buckets = { TELIC: [], ASSERTIVE: [], INFERENTIAL: [], LIMINAL: [], DIRECTIVE: [] };
  for (const s of classified) { buckets[s.type].push(s); }
  for (const type of Object.keys(buckets)) {
    buckets[type].sort((a, b) => b.confidence - a.confidence);
  }

  const result = { objective: '', state: '', insights: '', unresolved: '', next: '', meta: {} };

  // OBJECTIVE
  const isAchePlaceholder = !ache || ache.includes('No anchor set') || !ache.trim();
  if (!isAchePlaceholder) {
    result.objective = ache;
    result.meta.objective = { confidence: 1, span: null, value: ache };
  } else if (headerParsed.objective) {
    result.objective = headerParsed.objective.value;
    result.meta.objective = headerParsed.objective;
  } else {
    const telics = buckets.TELIC.slice(0, 3);
    const telicText = telics.map(s => s.text).join(' ');
    result.objective = telicText || classified[0]?.text || '';
    result.meta.objective = { confidence: telics[0]?.confidence || 0.2, span: telics[0] ? { start: telics[0].start, end: telics[0].end } : null, value: result.objective };
  }

  // CURRENT STATE
  if (headerParsed.state) {
    result.state = headerParsed.state.value;
    result.meta.state = headerParsed.state;
  } else {
    const a = buckets.ASSERTIVE.slice(0, 8);
    result.state = a.map(s => s.text).join('\n');
    result.meta.state = { confidence: a[0] ? avgConf(a) : 0.1, span: a[0] ? { start: a[0].start, end: a.at(-1)?.end || a[0].end } : null, value: result.state };
  }

  // KEY INSIGHTS
  if (headerParsed.insights) {
    result.insights = headerParsed.insights.value;
    result.meta.insights = headerParsed.insights;
  } else {
    const inf = buckets.INFERENTIAL.slice(0, 6);
    result.insights = inf.map(s => s.text).join('\n');
    result.meta.insights = { confidence: inf[0] ? avgConf(inf) : 0.1, span: inf[0] ? { start: inf[0].start, end: inf.at(-1)?.end || inf[0].end } : null, value: result.insights };
  }

  // UNRESOLVED QUESTIONS
  if (headerParsed.unresolved) {
    result.unresolved = headerParsed.unresolved.value;
    result.meta.unresolved = headerParsed.unresolved;
  } else {
    const lim = buckets.LIMINAL.slice(0, 5);
    result.unresolved = lim.map(s => s.text).join('\n');
    result.meta.unresolved = { confidence: lim[0] ? avgConf(lim) : 0.1, span: lim[0] ? { start: lim[0].start, end: lim.at(-1)?.end || lim[0].end } : null, value: result.unresolved };
  }

  // NEXT TASK (structured)
  if (headerParsed.next) {
    result.next = buildStructuredNext(headerParsed.next.value, targetNode, headerParsed.next.confidence);
    result.meta.next = headerParsed.next;
  } else {
    const dirs = buckets.DIRECTIVE.slice(0, 4);
    const rawDir = dirs.map(s => s.text).join('\n');
    result.next = buildStructuredNext(rawDir, targetNode, dirs[0]?.confidence || 0.1);
    result.meta.next = { confidence: dirs[0]?.confidence || 0.1, span: dirs[0] ? { start: dirs[0].start, end: dirs.at(-1)?.end || dirs[0].end } : null, value: rawDir };
  }

  // Aggregate quality
  const metas = Object.values(result.meta);
  result.quality = metas.length > 0 ? metas.reduce((sum, m) => sum + (m.confidence || 0), 0) / metas.length : 0;

  // Attach classified sentences for downstream use (second-order synthesis)
  result._classified = classified;

  return result;
}


// ━━━ SECOND-ORDER SYNTHESIS DETECTION ━━━

export const SENSITIVITY_LEVELS = Object.freeze({
  conservative: { label: 'Conservative', threshold: 0.85, requireExplicit: true },
  standard: { label: 'Standard', threshold: 0.7, requireExplicit: false },
  exploratory: { label: 'Exploratory', threshold: 0.4, requireExplicit: false }
});

function extractSignificantTerms(text) {
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  return words.filter(w => !EXCLUDED_BRIDGE_TERMS.has(w));
}

function buildTopicClusters(sentences) {
  // Build term → sentence index mapping
  const termIndex = new Map();
  sentences.forEach((s, i) => {
    const terms = extractSignificantTerms(s.text);
    s._terms = new Set(terms);
    for (const t of terms) {
      if (!termIndex.has(t)) termIndex.set(t, new Set());
      termIndex.get(t).add(i);
    }
  });

  // Simple connected-component clustering via shared terms
  const visited = new Set();
  const clusters = [];

  for (let i = 0; i < sentences.length; i++) {
    if (visited.has(i)) continue;
    const cluster = [];
    const queue = [i];
    while (queue.length > 0) {
      const idx = queue.shift();
      if (visited.has(idx)) continue;
      visited.add(idx);
      cluster.push(idx);
      // Find neighbors: sentences sharing significant terms
      for (const term of sentences[idx]._terms) {
        const neighbors = termIndex.get(term);
        if (neighbors) {
          for (const n of neighbors) {
            if (!visited.has(n)) queue.push(n);
          }
        }
      }
    }
    if (cluster.length > 0) clusters.push(cluster);
  }

  return clusters;
}

export function detectSecondOrderSynthesis(classified, sensitivity = 'standard') {
  if (!classified || classified.length < 4) return [];

  const config = SENSITIVITY_LEVELS[sensitivity] || SENSITIVITY_LEVELS.standard;
  const inferential = classified.filter(s => s.type === 'INFERENTIAL' || s.type === 'LIMINAL');
  if (inferential.length < 2) return [];

  // Build clusters from all classified sentences
  const clusters = buildTopicClusters(classified);
  if (clusters.length < 2) return []; // Need at least 2 distinct clusters

  // Build cluster → term set mapping
  const clusterTerms = clusters.map(indices => {
    const terms = new Set();
    for (const i of indices) {
      if (classified[i]._terms) {
        for (const t of classified[i]._terms) terms.add(t);
      }
    }
    return terms;
  });

  // Find bridging statements: sentences whose terms span 2+ clusters
  const bridges = [];
  const EXPLICIT_CONNECTIVES = /\b(therefore|consequently|this compounds|combined with|intersect|amplif|feedback loop|reinforc|exacerbat)\b/i;

  for (const s of inferential) {
    const terms = s._terms;
    if (!terms || terms.size < 2) continue;

    const touchedClusters = new Set();
    for (let ci = 0; ci < clusterTerms.length; ci++) {
      for (const t of terms) {
        if (clusterTerms[ci].has(t)) { touchedClusters.add(ci); break; }
      }
    }

    if (touchedClusters.size >= 2) {
      const hasExplicit = EXPLICIT_CONNECTIVES.test(s.text);
      if (config.requireExplicit && !hasExplicit) continue;

      const bridgeConf = hasExplicit ? 0.9 : (touchedClusters.size / clusterTerms.length) * 0.8;
      if (bridgeConf >= config.threshold) {
        bridges.push({
          text: s.text,
          type: bridgeConf >= 0.7 ? 'COMPOUND' : 'CROSS_SOURCE',
          confidence: bridgeConf,
          tag: bridgeConf >= 0.7 ? '[COMPOUND]' : (bridgeConf >= config.threshold ? '[CROSS-SOURCE]' : '[SPECULATIVE]'),
          clustersSpanned: touchedClusters.size,
          span: { start: s.start, end: s.end }
        });
      }
    }
  }

  return bridges.sort((a, b) => b.confidence - a.confidence);
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
  timestamp = new Date().toISOString(),
  hopCount = 1,
  parentSessionId = null,
  lineage = [],
  attestor = 'τ_UNKNOWN',
  attestorStandard = 'manual',
  cpfHash = null
}) {
  const source = NODES[sourceNode];
  const target = NODES[targetNode];
  const verified = allChecklistCleared(checklist) ? 'YES' : 'NO';
  const riskWarn = source?.risk === 'critical' ? ' ⚠ CRITICAL' : source?.risk === 'high' ? ' ⚠ HIGH' : '';

  const lineageStr = lineage.length > 0
    ? lineage.map(id => (NODES[id]?.label || id).toLowerCase()).join('→')
    : (source?.label || 'unknown').toLowerCase();

  const verifiedLine = verified === 'YES'
    ? `[τ_VERIFIED:YES | ATTESTOR:${attestor} | STANDARD:${attestorStandard}]`
    : `[τ_VERIFIED:NO]`;

  const parentLine = parentSessionId
    ? `\n[PARENT_SESSION:${parentSessionId}]`
    : '';

  const hashLine = cpfHash
    ? `\n[CPF_HASH:${cpfHash}]`
    : '';

  return {
    verified,
    block:
`[SCHEMA:CPF/2.0]
[${(source?.label ?? 'UNKNOWN').toUpperCase()}:${timestamp}]
[HOP:${hopCount}]${parentLine}
[LINEAGE:${lineageStr}→${(target?.label || 'unknown').toLowerCase()}]
[LAYER:${source?.layer ?? '—'} → ${target?.layer ?? '—'}]
[SOURCE_RISK:${(source?.risk ?? '—').toUpperCase()}${riskWarn}]
[CHECKLIST_CLEARED:${verified}]
${verifiedLine}
[HANDOFF_TO:${(target?.label ?? 'UNKNOWN').toUpperCase()}:${target?.layer ?? '—'}]
[SESSION:${sessionId}]${hashLine}`
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
  rawInput,
  hopCount = 1,
  parentSessionId = null,
  lineage = [],
  attestor = 'τ_UNKNOWN',
  attestorStandard = 'manual'
}) {
  const source = NODES[sourceNode];
  const target = NODES[targetNode];
  if (!source || !target) {
    throw new Error('Cannot build packet without valid source and target nodes.');
  }

  // Compute CPF content hash for integrity
  const cpfContentStr = [cpf.objective, cpf.state, cpf.insights, cpf.unresolved,
    typeof cpf.next === 'object' ? JSON.stringify(cpf.next) : cpf.next].join('|');
  const cpfHash = await sha256Hex(cpfContentStr);

  const provenance = buildProvenanceTag({
    sourceNode, targetNode, checklist, sessionId,
    hopCount, parentSessionId, lineage,
    attestor, attestorStandard, cpfHash
  });
  const ppd = buildPPDTemplate(targetNode);

  // Serialize NEXT TASK — structured or flat
  const nextTaskDisplay = typeof cpf.next === 'object'
    ? `TYPE: ${cpf.next.taskType || '—'}
TO: ${(NODES[cpf.next.receivingNode]?.label || cpf.next.receivingNode || '—').toUpperCase()} (${NODES[cpf.next.receivingNode]?.layer || '—'})
SCOPE: ${cpf.next.scope || '—'}
SUCCESS: ${cpf.next.successCondition || '—'}
CONFIDENCE: ${cpf.next.confidence != null ? (cpf.next.confidence >= 0.7 ? 'HIGH' : cpf.next.confidence >= 0.4 ? 'MID' : 'LOW') : '—'}
DIRECTIVE: ${cpf.next.rawDirective || '—'}`
    : (cpf.next || '—');

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
${nextTaskDisplay}

━━━ PROVENANCE ━━━

${provenance.block}

━━━ PPD TEMPLATE ━━━

${ppd}`;

  const payload = {
    schema: 'CPF/2.0',
    meta: {
      sessionId,
      parentSessionId: parentSessionId || null,
      hopCount,
      lineage: lineage.concat([sourceNode]),
      exportedAt: new Date().toISOString(),
      source: sourceNode,
      target: targetNode,
      sourceLayer: source.layer,
      targetLayer: target.layer,
      checklistCleared: allChecklistCleared(checklist),
      attestor,
      attestorStandard
    },
    cpf: {
      objective: cpf.objective || '',
      state: cpf.state || '',
      insights: cpf.insights || '',
      unresolved: cpf.unresolved || '',
      next: cpf.next || ''
    },
    provenance: provenance.block,
    cpfHash,
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
