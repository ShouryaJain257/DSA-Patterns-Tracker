// ---------- Cloud sync (Google Sign-In + Firestore) ----------
// This file is optional: if firebase-config.js hasn't been filled in, or the
// Firebase SDK didn't load, sync quietly stays disabled and the app keeps
// working purely off localStorage/IndexedDB as before.
(function () {
  if (typeof firebase === "undefined") {
    console.warn("Firebase SDK not loaded; cloud sync disabled.");
    return;
  }
  if (!window.FIREBASE_CONFIG || window.FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") {
    console.warn("firebase-config.js not filled in yet; cloud sync disabled.");
    return;
  }

  firebase.initializeApp(window.FIREBASE_CONFIG);
  const auth = firebase.auth();
  const db = firebase.firestore();

  let currentUser = null;
  let unsubscribeSnapshot = null;
  let pushTimer = null;
  let applyingRemote = false;

  function debouncedPush() {
    if (applyingRemote || !currentUser) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushToCloud, 900);
  }
  window.onLocalDataChange = debouncedPush;

  // ---- Merge helpers: never silently drop local-only data ----
  function mergeCounts(local, remote) {
    const out = Object.assign({}, remote);
    Object.keys(local).forEach(date => {
      out[date] = Math.max(out[date] || 0, local[date] || 0);
    });
    return out;
  }

  function mergeProgress(local, remote) {
    const out = Object.assign({}, remote);
    Object.keys(local).forEach(key => {
      const l = local[key];
      const r = out[key];
      if (!r || !r.last || (l.last && l.last > r.last)) out[key] = l;
    });
    return out;
  }

  function mergeNotes(local, remote) {
    const out = Object.assign({}, remote);
    Object.keys(local).forEach(key => {
      const l = local[key];
      const r = out[key];
      if (!r) { out[key] = l; return; }
      if (l.savedAt && (!r.savedAt || l.savedAt > r.savedAt)) out[key] = Object.assign({}, r, l);
    });
    return out;
  }

  function applyMerged(cloud) {
    applyingRemote = true;
    progress = mergeProgress(progress, cloud.progress || {});
    activityCounts = mergeCounts(activityCounts, cloud.activityCounts || {});
    notes = mergeNotes(notes, cloud.notes || {});
    saveJSON(PROGRESS_KEY, progress);
    saveJSON(ACTIVITY_KEY, activityCounts);
    saveJSON(NOTES_KEY, notes);
    applyingRemote = false;
    renderAll(false);
  }

  async function pullAndMerge() {
    if (!currentUser) return;
    try {
      const snap = await db.collection("users").doc(currentUser.uid).get();
      applyMerged(snap.exists ? snap.data() : {});
      pushToCloud();
    } catch (err) {
      console.warn("Cloud sync pull failed", err);
    }
  }

  async function pushToCloud() {
    if (!currentUser) return;
    try {
      await db.collection("users").doc(currentUser.uid).set({
        progress,
        activityCounts,
        notes,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn("Cloud sync push failed", err);
    }
  }

  function listenRemote() {
    if (unsubscribeSnapshot) unsubscribeSnapshot();
    unsubscribeSnapshot = db.collection("users").doc(currentUser.uid)
      .onSnapshot(snap => { if (snap.exists) applyMerged(snap.data()); });
  }

  function updateSyncButton() {
    const btn = document.getElementById("sync-btn");
    const label = document.getElementById("sync-label");
    if (!btn || !label) return;
    if (currentUser) {
      const firstName = currentUser.displayName ? currentUser.displayName.split(" ")[0] : "Synced";
      label.textContent = firstName;
      btn.classList.add("active");
      btn.title = "Signed in \u2014 click to sign out";
    } else {
      label.textContent = "Sign in to sync";
      btn.classList.remove("active");
      btn.title = "Sign in with Google to sync progress across devices";
    }
  }

  auth.onAuthStateChanged(async user => {
    currentUser = user;
    updateSyncButton();
    if (user) {
      await pullAndMerge();
      listenRemote();
    } else if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }
  });

  const btn = document.getElementById("sync-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      if (currentUser) {
        auth.signOut();
      } else {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => {
          alert("Sign-in failed: " + err.message);
        });
      }
    });
  }
})();
