// ---------- Storage ----------
const PROGRESS_KEY = "dsa-progress-v3";
const ACTIVITY_KEY = "dsa-activity-v4";
const LEGACY_ACTIVITY_KEY = "dsa-activity-v3";
const NOTES_KEY = "dsa-notes-v1";

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch(e) { return fallback; }
}

function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); }
  catch(e) { /* storage unavailable */ }
}

let progress = loadJSON(PROGRESS_KEY, {});
let notes = loadJSON(NOTES_KEY, {});

// activityCounts: { "YYYY-MM-DD": numberOfActionsThatDay }
let activityCounts = loadJSON(ACTIVITY_KEY, null);
if (!activityCounts) {
  const legacy = loadJSON(LEGACY_ACTIVITY_KEY, []);
  activityCounts = {};
  if (Array.isArray(legacy)) legacy.forEach(d => { activityCounts[d] = 1; });
  saveJSON(ACTIVITY_KEY, activityCounts);
}

function activityDates() {
  return Object.keys(activityCounts).sort();
}

// ---------- IndexedDB (note file storage) ----------
const NOTES_DB_NAME = "dsa-notes-db";
const NOTES_STORE = "files";
let notesDBPromise = null;

function openNotesDB() {
  if (notesDBPromise) return notesDBPromise;
  notesDBPromise = new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error("IndexedDB unavailable")); return; }
    const req = indexedDB.open(NOTES_DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(NOTES_STORE)) {
        req.result.createObjectStore(NOTES_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return notesDBPromise;
}

async function saveNoteFile(key, file) {
  const db = await openNotesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTES_STORE, "readwrite");
    tx.objectStore(NOTES_STORE).put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getNoteFile(key) {
  const db = await openNotesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTES_STORE, "readonly");
    const req = tx.objectStore(NOTES_STORE).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteNoteFile(key) {
  const db = await openNotesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTES_STORE, "readwrite");
    tx.objectStore(NOTES_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function hasNote(key) {
  const n = notes[key];
  return Boolean(n && (n.link || n.fileName));
}

// ---------- Date helpers ----------
function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function daysBetween(dateStr1, dateStr2) {
  const a = new Date(dateStr1 + "T00:00:00");
  const b = new Date(dateStr2 + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

function recordActivity() {
  const t = todayStr();
  activityCounts[t] = (activityCounts[t] || 0) + 1;
  saveJSON(ACTIVITY_KEY, activityCounts);
}

function computeStreaks() {
  const dates = activityDates();
  if (dates.length === 0) return { current: 0, longest: 0 };
  const set = new Set(dates);
  const today = todayStr();
  const yest = new Date(Date.now() - 86400000);
  const yestStr = yest.getFullYear() + "-" + String(yest.getMonth() + 1).padStart(2, "0") + "-" + String(yest.getDate()).padStart(2, "0");

  let current = 0;
  let cursor = set.has(today) ? today : (set.has(yestStr) ? yestStr : null);
  while (cursor && set.has(cursor)) {
    current++;
    const d = new Date(cursor + "T00:00:00");
    d.setDate(d.getDate() - 1);
    cursor = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    if (daysBetween(dates[i - 1], dates[i]) === 1) run++;
    else run = 1;
    longest = Math.max(longest, run);
  }

  return { current, longest: Math.max(longest, current) };
}

// ---------- Revision due logic ----------
const DUE_INTERVAL = { 1: 3, 2: 7, 3: 21 };

function isDue(entry) {
  if (!entry || entry.state === 0 || entry.state === undefined || !entry.last) return false;
  const interval = DUE_INTERVAL[entry.state];
  return Boolean(interval) && daysBetween(entry.last, todayStr()) >= interval;
}

// ---------- URL helpers ----------
const URL_INDEX = buildUrlIndex();

function buildUrlIndex() {
  const byNumber = new Map();
  const byTitle = new Map();

  PATTERNS.forEach(pattern => {
    pattern.problems.forEach(prob => {
      if (!prob[2]) return;
      const number = extractProblemNumber(prob[0]);
      const titleKey = normalizeProblemTitle(prob[0]);
      if (number && !byNumber.has(number)) byNumber.set(number, prob[2]);
      if (titleKey && !byTitle.has(titleKey)) byTitle.set(titleKey, prob[2]);
    });
  });

  return { byNumber, byTitle };
}

function extractProblemNumber(name) {
  const match = String(name).match(/(?:^|\b)(?:LC\s*)?(\d{1,4})(?:\.|\s+-|\s+--|\s+\u2014|\s+\u2013|\s)/i);
  return match ? match[1] : "";
}

function normalizeProblemTitle(name) {
  return String(name)
    .replace(/^LC\s*\d+\s*(?:-|\u2014|\u2013)?\s*/i, "")
    .replace(/^\d+\.\s*/, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function slugifyLeetTitle(name) {
  return normalizeProblemTitle(name)
    .replace(/\bii\b/g, "ii")
    .replace(/\bi\b/g, "i")
    .replace(/\s+/g, "-");
}

function leetSearchUrl(name) {
  return `https://leetcode.com/problemset/?search=${encodeURIComponent(normalizeProblemTitle(name) || name)}`;
}

function webSearchUrl(name) {
  return `https://www.google.com/search?q=${encodeURIComponent(name + " coding problem")}`;
}

function resolveProblemLink(prob) {
  const name = Array.isArray(prob) ? prob[0] : prob.name;
  const explicit = Array.isArray(prob) ? prob[2] : prob.url;
  if (explicit) return { url: explicit, source: linkSource(explicit), exact: true };

  const number = extractProblemNumber(name);
  const titleKey = normalizeProblemTitle(name);
  if (number && URL_INDEX.byNumber.has(number)) {
    return { url: URL_INDEX.byNumber.get(number), source: "LeetCode", exact: true };
  }
  if (titleKey && URL_INDEX.byTitle.has(titleKey)) {
    return { url: URL_INDEX.byTitle.get(titleKey), source: linkSource(URL_INDEX.byTitle.get(titleKey)), exact: true };
  }
  if (/^LC\s*\d+/i.test(name)) {
    return { url: `https://leetcode.com/problems/${slugifyLeetTitle(name)}/`, source: "LeetCode", exact: true };
  }
  if (/\b(gfg|geeksforgeeks)\b/i.test(name)) {
    return { url: webSearchUrl(name), source: "GFG", exact: false };
  }

  return { url: leetSearchUrl(name), source: "Search", exact: false };
}

function linkSource(url) {
  if (/leetcode\.com/i.test(url)) return "LeetCode";
  if (/geeksforgeeks\.org/i.test(url)) return "GFG";
  if (/neetcode\.io/i.test(url)) return "NeetCode";
  return "Link";
}

function difficultyBand(diff) {
  if (diff <= 2) return "easy";
  if (diff === 3) return "medium";
  return "hard";
}

function statusName(state) {
  return ["New", "Solved", "Revising", "Mastered"][state || 0];
}

// ---------- Tab state ----------
let currentTab = "phase";
let ALL_PROBLEMS = [];

function buildIndex() {
  ALL_PROBLEMS = [];

  if (currentTab === "phase") {
    let sheetRow = 0;
    PHASES.forEach((phase, pi) => {
      phase.topics.forEach((topic, ti) => {
        topic.subtopics.forEach((sub, si) => {
          sub.problems.forEach((prob, qi) => {
            sheetRow++;
            const sheetUrl = typeof PHASE_LINKS_BY_ROW !== "undefined" ? PHASE_LINKS_BY_ROW[sheetRow] : "";
            const linkedProblem = sheetUrl ? [prob[0], prob[1], sheetUrl] : prob;
            const link = resolveProblemLink(linkedProblem);
            ALL_PROBLEMS.push({
              key: `ph-${pi}-${ti}-${si}-${qi}`,
              name: prob[0],
              diff: prob[1],
              url: link.url,
              source: link.source,
              exact: link.exact,
              sheetRow,
              group: phase.title,
              topic: topic.name,
              subtopic: sub.name,
              resource: topic.resource,
              pi,
              ti,
              si,
              qi
            });
          });
        });
      });
    });
  } else {
    PATTERNS.forEach((pattern, pi) => {
      pattern.problems.forEach((prob, qi) => {
        const link = resolveProblemLink(prob);
        ALL_PROBLEMS.push({
          key: `pt-${pi}-${qi}`,
          name: prob[0],
          diff: prob[1],
          url: link.url,
          source: link.source,
          exact: link.exact,
          group: pattern.name,
          topic: pattern.name,
          subtopic: pattern.name,
          resource: pattern.resource,
          pi,
          ti: 0,
          si: 0,
          qi
        });
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
  renderAll(false);
}

// ---------- Filters ----------
let filters = {
  oaMode: false,
  dueOnly: false,
  search: "",
  status: "all",
  difficulty: "all",
  group: "all",
  source: "all"
};

function matchesFilters(p) {
  const entry = progress[p.key] || { state: 0 };
  const due = isDue(entry);
  const haystack = `${p.name} ${p.group} ${p.topic} ${p.subtopic} ${p.source}`.toLowerCase();

  if (filters.oaMode && p.diff < 3) return false;
  if (filters.dueOnly && !due) return false;
  if (filters.search && !haystack.includes(filters.search.toLowerCase())) return false;
  if (filters.group !== "all" && p.group !== filters.group) return false;
  if (filters.source !== "all" && p.source.toLowerCase() !== filters.source) return false;
  if (filters.difficulty !== "all" && difficultyBand(p.diff) !== filters.difficulty) return false;

  if (filters.status === "new" && entry.state !== 0) return false;
  if (filters.status === "solved" && entry.state < 1) return false;
  if (filters.status === "revising" && entry.state !== 2) return false;
  if (filters.status === "mastered" && entry.state !== 3) return false;
  if (filters.status === "due" && !due) return false;

  return true;
}

function visibleProblems() {
  return ALL_PROBLEMS.filter(matchesFilters);
}

// ---------- Stats ----------
function renderStats() {
  const { current, longest } = computeStreaks();
  const visible = visibleProblems();
  let dueCount = 0;
  let solvedOrAbove = 0;

  ALL_PROBLEMS.forEach(p => {
    const entry = progress[p.key];
    if (isDue(entry)) dueCount++;
    if (entry && entry.state >= 1) solvedOrAbove++;
  });

  const pct = ALL_PROBLEMS.length ? Math.round((solvedOrAbove / ALL_PROBLEMS.length) * 100) : 0;
  document.getElementById("streak-current").textContent = current;
  document.getElementById("streak-longest").textContent = longest;
  document.getElementById("due-count").textContent = dueCount;
  document.getElementById("solved-count").textContent = `${solvedOrAbove} / ${ALL_PROBLEMS.length}`;
  document.getElementById("visible-count").textContent = visible.length;
  document.getElementById("overall-pct").textContent = `${pct}%`;
  document.getElementById("overall-ring").style.setProperty("--pct", `${pct}%`);
  document.getElementById("due-card").classList.toggle("is-hot", dueCount > 0);
  document.getElementById("result-meta").textContent = `${visible.length} of ${ALL_PROBLEMS.length} problems match your current filters.`;
  renderHeatmap();
}

// ---------- Heatmap ----------
const HEAT_WEEKS = 53;
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function heatLevel(count) {
  if (!count) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function formatHeatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function renderHeatmap() {
  const grid = document.getElementById("heatmap-grid");
  const monthsRow = document.getElementById("heatmap-months");
  const totalEl = document.getElementById("heatmap-total");
  if (!grid || !monthsRow) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDow = today.getDay();
  const totalDays = HEAT_WEEKS * 7;
  const start = new Date(today);
  start.setDate(start.getDate() - (totalDays - 1 - (6 - endDow)));

  grid.innerHTML = "";
  monthsRow.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${HEAT_WEEKS}, 1fr)`;
  monthsRow.style.gridTemplateColumns = `repeat(${HEAT_WEEKS}, 1fr)`;

  let yearTotal = 0;
  let lastMonth = -1;

  for (let week = 0; week < HEAT_WEEKS; week++) {
    const monthLabel = document.createElement("span");
    monthLabel.className = "heatmap-month";
    const col = document.createElement("div");
    col.className = "heatmap-col";

    for (let dow = 0; dow < 7; dow++) {
      const cellDate = new Date(start);
      cellDate.setDate(start.getDate() + week * 7 + dow);
      if (cellDate > today) {
        const spacer = document.createElement("span");
        spacer.className = "heatmap-cell heat-empty";
        col.appendChild(spacer);
        continue;
      }
      const dateStr = cellDate.getFullYear() + "-" + String(cellDate.getMonth() + 1).padStart(2, "0") + "-" + String(cellDate.getDate()).padStart(2, "0");
      const count = activityCounts[dateStr] || 0;
      yearTotal += count;

      if (dow === 0 && cellDate.getMonth() !== lastMonth) {
        monthLabel.textContent = MONTH_NAMES[cellDate.getMonth()];
        lastMonth = cellDate.getMonth();
      }

      const cell = document.createElement("span");
      cell.className = `heatmap-cell heat-${heatLevel(count)}`;
      cell.title = `${count} action${count === 1 ? "" : "s"} on ${formatHeatDate(dateStr)}`;
      col.appendChild(cell);
    }

    monthsRow.appendChild(monthLabel);
    grid.appendChild(col);
  }

  if (totalEl) totalEl.textContent = `${yearTotal} action${yearTotal === 1 ? "" : "s"} in the last year`;
}

function populateGroupFilter() {
  const groupFilter = document.getElementById("group-filter");
  const selected = groupFilter.value;
  const groups = [...new Set(ALL_PROBLEMS.map(p => p.group))];
  groupFilter.innerHTML = '<option value="all">All groups</option>';
  groups.forEach(group => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group.replace(/\s+/g, " ");
    groupFilter.appendChild(option);
  });
  groupFilter.value = groups.includes(selected) ? selected : "all";
  filters.group = groupFilter.value;
}

function renderFocusTitle() {
  const openFilters = [];
  if (filters.oaMode) openFilters.push("OA focus");
  if (filters.dueOnly || filters.status === "due") openFilters.push("revision due");
  if (filters.difficulty !== "all") openFilters.push(filters.difficulty);
  if (filters.group !== "all") openFilters.push(filters.group.split("·")[0].trim());
  document.getElementById("focus-title").textContent = openFilters.length
    ? `Focused on ${openFilters.join(" + ")}.`
    : "Choose a phase, filter the noise, solve one row.";
}

// ---------- Problem row builder ----------
function buildProblemRow(p) {
  const entry = progress[p.key] || { state: 0 };
  const due = isDue(entry);

  const row = document.createElement("div");
  row.className = `prob state-${entry.state || 0}`;

  const statusBtn = document.createElement("button");
  statusBtn.className = "prob-status";
  statusBtn.type = "button";
  statusBtn.title = `Status: ${statusName(entry.state)}. Click to change.`;
  statusBtn.addEventListener("click", () => cycleProblem(p.key));

  const main = document.createElement("button");
  main.className = "prob-main";
  main.type = "button";
  main.addEventListener("click", () => cycleProblem(p.key));

  const title = document.createElement("span");
  title.className = "prob-name";
  title.textContent = p.name;
  const meta = document.createElement("span");
  meta.className = "prob-meta";
  meta.textContent = `${p.topic} / ${p.source}${p.exact ? "" : " search"}`;
  main.append(title, meta);

  const badges = document.createElement("div");
  badges.className = "prob-badges";
  if (due) {
    const dueBadge = document.createElement("span");
    dueBadge.className = "due-badge";
    dueBadge.textContent = "Due";
    badges.appendChild(dueBadge);
  }
  const diff = document.createElement("span");
  diff.className = `diff diff-${p.diff}`;
  diff.textContent = difficultyBand(p.diff);
  badges.appendChild(diff);

  const link = document.createElement("a");
  link.className = "prob-link";
  link.href = p.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.title = p.exact ? "Open problem" : "Open search fallback";
  link.textContent = "Open";

  const notesBtn = document.createElement("button");
  notesBtn.className = "notes-btn" + (hasNote(p.key) ? " has-note" : "");
  notesBtn.type = "button";
  notesBtn.title = hasNote(p.key) ? "View/edit your notes" : "Add notes";
  notesBtn.setAttribute("aria-label", hasNote(p.key) ? "View or edit notes for this problem" : "Add notes for this problem");
  notesBtn.textContent = "\u{1F4DD}";
  notesBtn.addEventListener("click", () => openNotesModal(p.key, p.name));

  row.append(statusBtn, main, badges, notesBtn, link);
  return row;
}

// ---------- Phase tab rendering ----------
const expandedPhases = new Set();
const expandedPatterns = new Set();
const collapsedPhases = new Set();
const collapsedPatterns = new Set();
const expandedTopics = new Set();
const collapsedTopics = new Set();

function activeExpandedSet() {
  return currentTab === "phase" ? expandedPhases : expandedPatterns;
}

function hasActiveFilters() {
  return filters.search || filters.oaMode || filters.dueOnly || filters.status !== "all" ||
    filters.difficulty !== "all" || filters.group !== "all" || filters.source !== "all";
}

function isExpandedByMode(expandedSet, collapsedSet, key, forceOpen) {
  return forceOpen ? !collapsedSet.has(key) : expandedSet.has(key);
}

function toggleExpandedByMode(expandedSet, collapsedSet, key, forceOpen) {
  if (forceOpen) {
    if (collapsedSet.has(key)) collapsedSet.delete(key);
    else collapsedSet.add(key);
    return;
  }
  if (expandedSet.has(key)) expandedSet.delete(key);
  else expandedSet.add(key);
}

function createGroupHeader(title, solved, total, visible, isExpanded, onToggle, resource) {
  const head = document.createElement("div");
  head.className = "phase-head";

  const chevron = document.createElement("span");
  chevron.className = "phase-chevron";
  chevron.textContent = ">";

  const titleEl = document.createElement("div");
  titleEl.className = "phase-title-wrap";
  const name = document.createElement("p");
  name.className = "phase-title";
  name.textContent = title;
  const count = document.createElement("span");
  count.className = "phase-subtitle";
  count.textContent = `${visible} visible / ${total} total`;
  titleEl.append(name, count);

  const pct = total ? Math.round((solved / total) * 100) : 0;
  const meter = document.createElement("div");
  meter.className = "mini-meter";
  meter.innerHTML = `<span style="width:${pct}%"></span>`;

  if (resource) {
    const res = document.createElement("a");
    res.className = "topic-resource";
    res.href = resource.url;
    res.target = "_blank";
    res.rel = "noopener";
    res.textContent = resource.label;
    res.addEventListener("click", e => e.stopPropagation());
    titleEl.appendChild(res);
  }

  const pctEl = document.createElement("span");
  pctEl.className = "phase-pct";
  pctEl.textContent = `${solved}/${total} - ${pct}%`;

  head.append(chevron, titleEl, meter, pctEl);
  head.addEventListener("click", onToggle);
  head.setAttribute("aria-expanded", String(isExpanded));
  return head;
}

function renderPhaseTab() {
  const container = document.getElementById("phases");
  container.innerHTML = "";
  const forceOpen = hasActiveFilters();

  PHASES.forEach((phase, pi) => {
    const phaseProblems = ALL_PROBLEMS.filter(p => p.pi === pi);
    const visible = phaseProblems.filter(matchesFilters);
    if (forceOpen && visible.length === 0) return;

    const solved = phaseProblems.filter(p => progress[p.key] && progress[p.key].state >= 1).length;
    const isExpanded = isExpandedByMode(expandedPhases, collapsedPhases, pi, forceOpen);
    const phaseEl = document.createElement("section");
    phaseEl.className = "phase" + (isExpanded ? " expanded" : "");

    phaseEl.appendChild(createGroupHeader(
      phase.title,
      solved,
      phaseProblems.length,
      visible.length,
      isExpanded,
      () => {
        toggleExpandedByMode(expandedPhases, collapsedPhases, pi, forceOpen);
        renderPhaseTab();
      }
    ));

    const body = document.createElement("div");
    body.className = "phase-body";

    phase.topics.forEach((topic, ti) => {
      const topicProblems = phaseProblems.filter(p => p.ti === ti && matchesFilters(p));
      if (topicProblems.length === 0) return;

      const topicKey = `ph-${pi}-${ti}`;
      const topicExpanded = isExpandedByMode(expandedTopics, collapsedTopics, topicKey, forceOpen);
      const topicEl = document.createElement("article");
      topicEl.className = "topic" + (topicExpanded ? " expanded" : "");
      const topicHead = document.createElement("div");
      topicHead.className = "topic-head";
      const topicChevron = document.createElement("span");
      topicChevron.className = "topic-chevron";
      topicChevron.textContent = ">";
      const topicName = document.createElement("span");
      topicName.className = "topic-name";
      topicName.textContent = topic.name;
      const topicCount = document.createElement("span");
      topicCount.className = "topic-count";
      topicCount.textContent = `${topicProblems.length} problems`;
      topicHead.append(topicChevron, topicName);
      if (topic.resource) {
        const res = document.createElement("a");
        res.className = "topic-resource";
        res.href = topic.resource.url;
        res.target = "_blank";
        res.rel = "noopener";
        res.textContent = topic.resource.label;
        res.addEventListener("click", e => e.stopPropagation());
        topicHead.appendChild(res);
      }
      topicHead.appendChild(topicCount);
      topicHead.addEventListener("click", () => {
        toggleExpandedByMode(expandedTopics, collapsedTopics, topicKey, forceOpen);
        renderPhaseTab();
      });
      topicEl.appendChild(topicHead);

      const topicBody = document.createElement("div");
      topicBody.className = "topic-body";

      topic.subtopics.forEach((sub, si) => {
        const subProblems = topicProblems.filter(p => p.si === si);
        if (subProblems.length === 0) return;

        const subEl = document.createElement("div");
        subEl.className = "subtopic";
        const subName = document.createElement("p");
        subName.className = "subtopic-name";
        subName.textContent = sub.name;
        const probsEl = document.createElement("div");
        probsEl.className = "problems";
        subProblems.forEach(p => probsEl.appendChild(buildProblemRow(p)));
        subEl.append(subName, probsEl);
        topicBody.appendChild(subEl);
      });

      topicEl.appendChild(topicBody);
      body.appendChild(topicEl);
    });

    phaseEl.appendChild(body);
    container.appendChild(phaseEl);
  });

  renderEmptyState(container);
}

function renderPatternTab() {
  const container = document.getElementById("phases");
  container.innerHTML = "";
  const forceOpen = hasActiveFilters();

  PATTERNS.forEach((pattern, pi) => {
    const patProblems = ALL_PROBLEMS.filter(p => p.pi === pi);
    const visible = patProblems.filter(matchesFilters);
    if (forceOpen && visible.length === 0) return;

    const solved = patProblems.filter(p => progress[p.key] && progress[p.key].state >= 1).length;
    const isExpanded = isExpandedByMode(expandedPatterns, collapsedPatterns, pi, forceOpen);
    const phaseEl = document.createElement("section");
    phaseEl.className = "phase" + (isExpanded ? " expanded" : "");

    phaseEl.appendChild(createGroupHeader(
      pattern.name,
      solved,
      patProblems.length,
      visible.length,
      isExpanded,
      () => {
        toggleExpandedByMode(expandedPatterns, collapsedPatterns, pi, forceOpen);
        renderPatternTab();
      },
      pattern.resource
    ));

    const body = document.createElement("div");
    body.className = "phase-body";
    const probsEl = document.createElement("div");
    probsEl.className = "problems";
    visible.forEach(p => probsEl.appendChild(buildProblemRow(p)));
    body.appendChild(probsEl);
    phaseEl.append(body);
    container.appendChild(phaseEl);
  });

  renderEmptyState(container);
}

function renderEmptyState(container) {
  if (container.children.length > 0) return;
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = "No problems match these filters.";
  container.appendChild(empty);
}

function renderPhases() {
  renderFocusTitle();
  renderStats();
  if (currentTab === "phase") renderPhaseTab();
  else renderPatternTab();
}

function renderAll(shouldRefreshGroups = true) {
  buildIndex();
  if (shouldRefreshGroups) populateGroupFilter();
  document.querySelector("#tab-phase .tab-count").textContent = countPhaseProblems();
  document.querySelector("#tab-pattern .tab-count").textContent = countPatternProblems();
  renderPhases();
}

function countPhaseProblems() {
  return PHASES.reduce((total, phase) => total + phase.topics.reduce((topicTotal, topic) =>
    topicTotal + topic.subtopics.reduce((subTotal, sub) => subTotal + sub.problems.length, 0), 0), 0);
}

function countPatternProblems() {
  return PATTERNS.reduce((total, pattern) => total + pattern.problems.length, 0);
}

// ---------- Tab switching ----------
document.getElementById("tab-phase").addEventListener("click", () => switchTab("phase"));
document.getElementById("tab-pattern").addEventListener("click", () => switchTab("pattern"));

function switchTab(tab) {
  currentTab = tab;
  document.getElementById("tab-phase").classList.toggle("active", tab === "phase");
  document.getElementById("tab-pattern").classList.toggle("active", tab === "pattern");
  filters.search = "";
  filters.group = "all";
  document.getElementById("search").value = "";
  renderAll(true);
}

// ---------- Controls ----------
document.getElementById("search").addEventListener("input", e => {
  filters.search = e.target.value.trim();
  renderPhases();
});

document.getElementById("status-filter").addEventListener("change", e => {
  filters.status = e.target.value;
  filters.dueOnly = filters.status === "due" ? true : filters.dueOnly;
  document.getElementById("due-filter-btn").classList.toggle("active", filters.dueOnly);
  renderPhases();
});

document.getElementById("difficulty-filter").addEventListener("change", e => {
  filters.difficulty = e.target.value;
  renderPhases();
});

document.getElementById("group-filter").addEventListener("change", e => {
  filters.group = e.target.value;
  renderPhases();
});

document.getElementById("source-filter").addEventListener("change", e => {
  filters.source = e.target.value;
  renderPhases();
});

document.getElementById("oa-mode-btn").addEventListener("click", e => {
  filters.oaMode = !filters.oaMode;
  e.currentTarget.classList.toggle("active", filters.oaMode);
  renderPhases();
});

document.getElementById("due-filter-btn").addEventListener("click", e => {
  filters.dueOnly = !filters.dueOnly;
  e.currentTarget.classList.toggle("active", filters.dueOnly);
  if (!filters.dueOnly && filters.status === "due") {
    filters.status = "all";
    document.getElementById("status-filter").value = "all";
  }
  renderPhases();
});

document.getElementById("clear-filters-btn").addEventListener("click", () => {
  filters = { oaMode: false, dueOnly: false, search: "", status: "all", difficulty: "all", group: "all", source: "all" };
  document.getElementById("search").value = "";
  document.getElementById("status-filter").value = "all";
  document.getElementById("difficulty-filter").value = "all";
  document.getElementById("group-filter").value = "all";
  document.getElementById("source-filter").value = "all";
  document.getElementById("oa-mode-btn").classList.remove("active");
  document.getElementById("due-filter-btn").classList.remove("active");
  renderPhases();
});

let allExpanded = false;
document.getElementById("expand-all-btn").addEventListener("click", e => {
  allExpanded = !allExpanded;
  const set = activeExpandedSet();
  const list = currentTab === "phase" ? PHASES : PATTERNS;
  if (allExpanded) {
    list.forEach((_, i) => set.add(i));
    e.currentTarget.textContent = "Collapse all";
  } else {
    set.clear();
    e.currentTarget.textContent = "Expand all";
  }
  renderPhases();
});

// ---------- Notes modal ----------
const MAX_NOTE_FILE_BYTES = 15 * 1024 * 1024; // 15MB safety cap per file

let notesModalEls = null;
let currentNotesKey = null;

function initNotesModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "notes-modal-overlay";

  const card = document.createElement("div");
  card.className = "modal-card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-labelledby", "notes-modal-title");

  card.innerHTML = `
    <div class="modal-head">
      <p class="modal-title" id="notes-modal-title">Notes</p>
      <button type="button" class="modal-close" id="notes-modal-close" aria-label="Close notes">&times;</button>
    </div>
    <label class="modal-field">
      <span>Link (GitHub repo, gist, Drive doc, etc.)</span>
      <input type="url" id="notes-link-input" placeholder="https://github.com/you/your-solution">
    </label>
    <div class="modal-field">
      <span>File (stored in this browser only)</span>
      <div class="notes-file-row" id="notes-file-row">
        <span id="notes-file-status">No file attached</span>
      </div>
      <input type="file" id="notes-file-input" accept=".pdf,.md,.txt,.png,.jpg,.jpeg">
      <button type="button" class="ghost-btn" id="notes-file-remove" hidden>Remove file</button>
    </div>
    <p class="modal-hint">Files are stored locally in this browser (IndexedDB) and are not synced or backed up &mdash; they will not survive clearing site data or switching devices.</p>
    <div class="modal-actions">
      <button type="button" class="toggle-btn" id="notes-save-btn">Save link</button>
    </div>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", e => { if (e.target === overlay) closeNotesModal(); });
  document.getElementById("notes-modal-close").addEventListener("click", closeNotesModal);
  document.getElementById("notes-save-btn").addEventListener("click", saveNotesLink);
  document.getElementById("notes-file-input").addEventListener("change", handleNotesFileChange);
  document.getElementById("notes-file-remove").addEventListener("click", removeNotesFile);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeNotesModal();
  });

  notesModalEls = {
    overlay,
    title: document.getElementById("notes-modal-title"),
    linkInput: document.getElementById("notes-link-input"),
    fileStatus: document.getElementById("notes-file-status"),
    fileInput: document.getElementById("notes-file-input"),
    fileRemoveBtn: document.getElementById("notes-file-remove")
  };
}

function openNotesModal(key, name) {
  if (!notesModalEls) initNotesModal();
  currentNotesKey = key;
  const entry = notes[key] || {};
  notesModalEls.title.textContent = `Notes \u2014 ${name}`;
  notesModalEls.linkInput.value = entry.link || "";
  notesModalEls.fileInput.value = "";
  renderNotesFileStatus(entry);
  notesModalEls.overlay.classList.add("open");
  notesModalEls.linkInput.focus();
}

function closeNotesModal() {
  if (notesModalEls) notesModalEls.overlay.classList.remove("open");
  currentNotesKey = null;
  renderPhases();
}

function renderNotesFileStatus(entry) {
  notesModalEls.fileStatus.innerHTML = "";
  if (entry && entry.fileName) {
    const sizeKb = Math.max(1, Math.round((entry.fileSize || 0) / 1024));
    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${entry.fileName} (${sizeKb} KB)`;
    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.className = "ghost-btn";
    viewBtn.textContent = "View";
    viewBtn.addEventListener("click", viewNotesFile);
    notesModalEls.fileStatus.append(nameSpan, viewBtn);
    notesModalEls.fileRemoveBtn.hidden = false;
  } else {
    notesModalEls.fileStatus.textContent = "No file attached";
    notesModalEls.fileRemoveBtn.hidden = true;
  }
}

async function viewNotesFile() {
  if (!currentNotesKey) return;
  const file = await getNoteFile(currentNotesKey).catch(() => null);
  if (!file) { alert("Couldn't load the stored file."); return; }
  const url = URL.createObjectURL(file);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function saveNotesLink() {
  if (!currentNotesKey) return;
  const link = notesModalEls.linkInput.value.trim();
  const entry = notes[currentNotesKey] || {};
  if (link) entry.link = link;
  else delete entry.link;
  if (entry.link || entry.fileName) notes[currentNotesKey] = entry;
  else delete notes[currentNotesKey];
  saveJSON(NOTES_KEY, notes);
  closeNotesModal();
}

async function handleNotesFileChange(e) {
  const file = e.target.files[0];
  if (!file || !currentNotesKey) return;
  if (file.size > MAX_NOTE_FILE_BYTES) {
    alert(`That file is too large (${Math.round(file.size / 1024 / 1024)}MB). Keep attachments under ${Math.round(MAX_NOTE_FILE_BYTES / 1024 / 1024)}MB.`);
    e.target.value = "";
    return;
  }
  try {
    await saveNoteFile(currentNotesKey, file);
    const entry = notes[currentNotesKey] || {};
    entry.fileName = file.name;
    entry.fileType = file.type;
    entry.fileSize = file.size;
    entry.savedAt = todayStr();
    notes[currentNotesKey] = entry;
    saveJSON(NOTES_KEY, notes);
    renderNotesFileStatus(entry);
  } catch (err) {
    alert("Couldn't save that file in this browser's storage. It may be full, or IndexedDB may be unavailable (e.g. private browsing).");
  }
}

async function removeNotesFile() {
  if (!currentNotesKey) return;
  await deleteNoteFile(currentNotesKey).catch(() => {});
  const entry = notes[currentNotesKey];
  if (entry) {
    delete entry.fileName;
    delete entry.fileType;
    delete entry.fileSize;
    delete entry.savedAt;
    if (!entry.link) delete notes[currentNotesKey];
    saveJSON(NOTES_KEY, notes);
  }
  renderNotesFileStatus(notes[currentNotesKey] || {});
}

// ---------- Init ----------
renderAll();
