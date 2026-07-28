// ---------- Storage ----------
const PROGRESS_KEY = "dsa-progress-v2";
const ACTIVITY_KEY = "dsa-activity-v2";

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch(e) { return fallback; }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); }
  catch(e) { /* storage unavailable */ }
}

let progress = loadJSON(PROGRESS_KEY, {});     // { probKey: {state, last} }
let activity = loadJSON(ACTIVITY_KEY, []);     // ["2026-07-28", ...]

// ---------- Date helpers ----------
function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,'0') + "-" + String(d.getDate()).padStart(2,'0');
}
function daysBetween(dateStr1, dateStr2) {
  const a = new Date(dateStr1 + "T00:00:00");
  const b = new Date(dateStr2 + "T00:00:00");
  return Math.round((b - a) / 86400000);
}
function recordActivity() {
  const t = todayStr();
  if (!activity.includes(t)) {
    activity.push(t);
    activity.sort();
    saveJSON(ACTIVITY_KEY, activity);
  }
}
function computeStreaks() {
  if (activity.length === 0) return { current: 0, longest: 0 };
  const set = new Set(activity);
  const today = todayStr();
  const yest = new Date(Date.now() - 86400000);
  const yestStr = yest.getFullYear() + "-" + String(yest.getMonth()+1).padStart(2,'0') + "-" + String(yest.getDate()).padStart(2,'0');

  let current = 0;
  let cursor = set.has(today) ? today : (set.has(yestStr) ? yestStr : null);
  if (cursor) {
    while (set.has(cursor)) {
      current++;
      const d = new Date(cursor + "T00:00:00");
      d.setDate(d.getDate() - 1);
      cursor = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,'0') + "-" + String(d.getDate()).padStart(2,'0');
    }
  }

  let longest = 1, run = 1;
  for (let i = 1; i < activity.length; i++) {
    if (daysBetween(activity[i-1], activity[i]) === 1) run++;
    else run = 1;
    longest = Math.max(longest, run);
  }
  longest = Math.max(longest, current);

  return { current, longest };
}

// ---------- Revision due logic ----------
const DUE_INTERVAL = { 1: 3, 2: 7, 3: 21 };

function isDue(entry) {
  if (!entry || entry.state === 0 || entry.state === undefined) return false;
  const interval = DUE_INTERVAL[entry.state];
  if (!interval) return false;
  return daysBetween(entry.last, todayStr()) >= interval;
}

// ---------- URL helper ----------
function leetSearchUrl(name) {
  const clean = name.replace(/^LC\s*\d+\s*—\s*/, '').replace(/^\d+\.\s*/, '');
  return `https://leetcode.com/problemset/?search=${encodeURIComponent(clean)}`;
}

// ---------- Tab state ----------
let currentTab = 'phase'; // 'phase' | 'pattern'
let ALL_PROBLEMS = [];

function buildIndex() {
  ALL_PROBLEMS = [];
  if (currentTab === 'phase') {
    PHASES.forEach((phase, pi) => {
      phase.topics.forEach((topic, ti) => {
        topic.subtopics.forEach((sub, si) => {
          sub.problems.forEach((prob, qi) => {
            const key = `ph-${pi}-${ti}-${si}-${qi}`;
            ALL_PROBLEMS.push({ key, name: prob[0], diff: prob[1], url: leetSearchUrl(prob[0]), pi, ti, si, qi });
          });
        });
      });
    });
  } else {
    PATTERNS.forEach((pattern, pi) => {
      pattern.problems.forEach((prob, qi) => {
        const key = `pt-${pi}-${qi}`;
        const realUrl = prob[2] && prob[2].length ? prob[2] : leetSearchUrl(prob[0]);
        ALL_PROBLEMS.push({ key, name: prob[0], diff: prob[1], url: realUrl, pi, ti: 0, si: 0, qi });
      });
    });
  }
}

// ---------- State cycling ----------
function cycleProblem(key) {
  const entry = progress[key] || { state: 0, last: null };
  entry.state = (entry.state + 1) % 4;
  entry.last = todayStr();
  progress[key] = entry;
  saveJSON(PROGRESS_KEY, progress);
  recordActivity();
  renderAll();
}

// ---------- Filters ----------
let filters = { oaMode: false, dueOnly: false, search: "" };

function matchesFilters(p) {
  const entry = progress[p.key];
  if (filters.oaMode && p.diff < 3) return false;
  if (filters.dueOnly && !isDue(entry)) return false;
  if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
  return true;
}

// ---------- Stats ----------
function renderStats() {
  const { current, longest } = computeStreaks();
  document.getElementById('streak-current').textContent = current;
  document.getElementById('streak-longest').textContent = longest;

  let dueCount = 0, solvedOrAbove = 0;
  ALL_PROBLEMS.forEach(p => {
    const entry = progress[p.key];
    if (isDue(entry)) dueCount++;
    if (entry && entry.state >= 1) solvedOrAbove++;
  });
  document.getElementById('due-count').textContent = dueCount;
  document.getElementById('solved-count').textContent = `${solvedOrAbove} / ${ALL_PROBLEMS.length}`;

  const pct = ALL_PROBLEMS.length ? Math.round((solvedOrAbove / ALL_PROBLEMS.length) * 100) : 0;
  document.getElementById('overall-bar').style.width = pct + '%';
  document.getElementById('overall-pct').textContent = pct + '%';

  document.getElementById('due-card').classList.toggle('stat-card--due', dueCount > 0);
}

// ---------- Problem row builder (shared) ----------
function buildProblemRow(p) {
  const entry = progress[p.key];
  const state = entry ? entry.state : 0;
  const due = isDue(entry);

  const row = document.createElement('div');
  row.className = `prob state-${state}`;
  row.innerHTML = `
    <span class="prob-dot"></span>
    <span class="prob-name">${p.name}</span>
    ${due ? '<span class="due-badge">DUE</span>' : ''}
    <span class="diff diff-${p.diff}">${'★'.repeat(p.diff)}</span>
    <a class="prob-link" href="${p.url}" target="_blank" rel="noopener" title="Open problem">↗</a>
  `;
  row.querySelector('.prob-name').addEventListener('click', () => cycleProblem(p.key));
  row.querySelector('.prob-dot').addEventListener('click', () => cycleProblem(p.key));
  return row;
}

// ---------- Phase tab rendering ----------
const expandedPhases = new Set();

function renderPhaseTab() {
  const container = document.getElementById('phases');
  container.innerHTML = '';
  const searching = filters.search.length > 0;

  PHASES.forEach((phase, pi) => {
    const phaseProblems = ALL_PROBLEMS.filter(p => p.pi === pi);
    const visibleProblems = phaseProblems.filter(matchesFilters);
    if (filters.search || filters.oaMode || filters.dueOnly) {
      if (visibleProblems.length === 0) return;
    }

    const solved = phaseProblems.filter(p => progress[p.key] && progress[p.key].state >= 1).length;
    const phasePct = phaseProblems.length ? Math.round((solved / phaseProblems.length) * 100) : 0;
    const isExpanded = expandedPhases.has(pi) || searching || filters.oaMode || filters.dueOnly;

    const phaseEl = document.createElement('div');
    phaseEl.className = 'phase' + (isExpanded ? ' expanded' : '');

    const head = document.createElement('div');
    head.className = 'phase-head';
    head.innerHTML = `
      <span class="phase-chevron">▶</span>
      <p class="phase-title">${phase.title}</p>
      <span class="phase-pct">${solved}/${phaseProblems.length} · ${phasePct}%</span>
    `;
    head.addEventListener('click', () => {
      if (expandedPhases.has(pi)) expandedPhases.delete(pi);
      else expandedPhases.add(pi);
      renderPhaseTab();
    });

    const body = document.createElement('div');
    body.className = 'phase-body';

    phase.topics.forEach((topic, ti) => {
      const topicProblems = phaseProblems.filter(p => p.ti === ti).filter(matchesFilters);
      if (topicProblems.length === 0) return;

      const topicEl = document.createElement('div');
      topicEl.className = 'topic';
      const topicHead = document.createElement('div');
      topicHead.className = 'topic-head';
      topicHead.innerHTML = `
        <span class="topic-name">${topic.name}</span>
        ${topic.resource ? `<a class="topic-resource" href="${topic.resource.url}" target="_blank" rel="noopener">▶ ${topic.resource.label}</a>` : ''}
        <span class="topic-count">${topicProblems.length} problems</span>
      `;
      topicEl.appendChild(topicHead);

      topic.subtopics.forEach((sub, si) => {
        const subProblems = topicProblems.filter(p => p.si === si);
        if (subProblems.length === 0) return;

        const subEl = document.createElement('div');
        subEl.className = 'subtopic';
        subEl.innerHTML = `<p class="subtopic-name">${sub.name}</p>`;
        const probsEl = document.createElement('div');
        probsEl.className = 'problems';
        subProblems.forEach(p => probsEl.appendChild(buildProblemRow(p)));
        subEl.appendChild(probsEl);
        topicEl.appendChild(subEl);
      });

      body.appendChild(topicEl);
    });

    phaseEl.appendChild(head);
    phaseEl.appendChild(body);
    container.appendChild(phaseEl);
  });
}

// ---------- Pattern tab rendering ----------
const expandedPatterns = new Set();

function renderPatternTab() {
  const container = document.getElementById('phases');
  container.innerHTML = '';
  const searching = filters.search.length > 0;

  PATTERNS.forEach((pattern, pi) => {
    const patProblems = ALL_PROBLEMS.filter(p => p.pi === pi);
    const visibleProblems = patProblems.filter(matchesFilters);
    if (filters.search || filters.oaMode || filters.dueOnly) {
      if (visibleProblems.length === 0) return;
    }

    const solved = patProblems.filter(p => progress[p.key] && progress[p.key].state >= 1).length;
    const patPct = patProblems.length ? Math.round((solved / patProblems.length) * 100) : 0;
    const isExpanded = expandedPatterns.has(pi) || searching || filters.oaMode || filters.dueOnly;

    const phaseEl = document.createElement('div');
    phaseEl.className = 'phase' + (isExpanded ? ' expanded' : '');

    const head = document.createElement('div');
    head.className = 'phase-head';
    head.innerHTML = `
      <span class="phase-chevron">▶</span>
      <p class="phase-title">${pattern.name}</p>
      ${pattern.resource ? `<a class="topic-resource" href="${pattern.resource.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">▶ ${pattern.resource.label}</a>` : ''}
      <span class="phase-pct">${solved}/${patProblems.length} · ${patPct}%</span>
    `;
    head.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (expandedPatterns.has(pi)) expandedPatterns.delete(pi);
      else expandedPatterns.add(pi);
      renderPatternTab();
    });

    const body = document.createElement('div');
    body.className = 'phase-body';
    const probsEl = document.createElement('div');
    probsEl.className = 'problems';
    visibleProblems.forEach(p => probsEl.appendChild(buildProblemRow(p)));
    body.appendChild(probsEl);

    phaseEl.appendChild(head);
    phaseEl.appendChild(body);
    container.appendChild(phaseEl);
  });
}

function renderPhases() {
  if (currentTab === 'phase') renderPhaseTab();
  else renderPatternTab();
}

function renderAll() {
  buildIndex();
  renderStats();
  renderPhases();
}

// ---------- Tab switching ----------
document.getElementById('tab-phase').addEventListener('click', () => switchTab('phase'));
document.getElementById('tab-pattern').addEventListener('click', () => switchTab('pattern'));

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-phase').classList.toggle('active', tab === 'phase');
  document.getElementById('tab-pattern').classList.toggle('active', tab === 'pattern');
  filters.search = '';
  document.getElementById('search').value = '';
  renderAll();
}

// ---------- Controls ----------
document.getElementById('search').addEventListener('input', (e) => {
  filters.search = e.target.value.trim();
  renderPhases();
});

document.getElementById('oa-mode-btn').addEventListener('click', (e) => {
  filters.oaMode = !filters.oaMode;
  e.target.classList.toggle('active', filters.oaMode);
  renderPhases();
});

document.getElementById('due-filter-btn').addEventListener('click', (e) => {
  filters.dueOnly = !filters.dueOnly;
  e.target.classList.toggle('active', filters.dueOnly);
  renderPhases();
});

let allExpanded = false;
document.getElementById('expand-all-btn').addEventListener('click', (e) => {
  allExpanded = !allExpanded;
  const set = currentTab === 'phase' ? expandedPhases : expandedPatterns;
  const list = currentTab === 'phase' ? PHASES : PATTERNS;
  if (allExpanded) {
    list.forEach((_, i) => set.add(i));
    e.target.textContent = 'Collapse All';
  } else {
    set.clear();
    e.target.textContent = 'Expand All';
  }
  renderPhases();
});

// ---------- Init ----------
renderAll();
