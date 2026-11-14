// Local Storage + IndexedDB State Management & Domain Logic
import {
  DEFAULT_USER_SETTINGS,
  PROGRAMME_PHASES,
  DEFAULT_GYM_TEMPLATES,
  DEFAULT_RUNNING_PLAN,
  DEFAULT_HABITS,
  DEFAULT_MEAL_PRESETS,
  formatLocalDate,
  parseLocalDate,
  getTodayLocalStr,
  addDays,
  diffDays,
  getDayOfWeekIndex,
  getMondayOfWeek
} from './data.js';

const STORAGE_KEY = 'fitness_cut_tracker_state_v1';
const IDB_NAME = 'FitnessCutTrackerDB';
const IDB_STORE = 'stateStore';

export const FIREBASE_CONFIG = {
  projectId: 'abhin-cut-tracker-2026',
  appId: '1:292217013473:web:a8b3988494565aeb31e3a0',
  storageBucket: 'abhin-cut-tracker-2026.firebasestorage.app',
  apiKey: 'AIzaSyCdlsF8j8nttzcMgSHWDnv9L_dDNO-PZsU',
  authDomain: 'abhin-cut-tracker-2026.firebaseapp.com',
  messagingSenderId: '292217013473'
};

let firestoreDb = null;
let firestoreFns = null;
let cloudSyncTimer = null;
let lastCloudSyncTime = null;
let cloudSyncStatus = 'Local + Cloud Ready';
let syncStatusListener = null;

function notifySyncStatus(statusText) {
  cloudSyncStatus = statusText;
  if (typeof syncStatusListener === 'function') {
    syncStatusListener(cloudSyncStatus, lastCloudSyncTime);
  }
}

export function getCloudSyncStatus() {
  return { status: cloudSyncStatus, lastSyncedAt: lastCloudSyncTime };
}

export async function initFirebaseCloudSync(currentState, onRemoteDataLoaded, onStatusChange) {
  syncStatusListener = onStatusChange || null;
  if (typeof window === 'undefined') return;
  try {
    notifySyncStatus('Connecting to Firebase…');
    const appMod = await import('https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js');
    const fsMod = await import('https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js');
    const app = appMod.initializeApp(FIREBASE_CONFIG);
    firestoreDb = fsMod.getFirestore(app);
    firestoreFns = {
      doc: fsMod.doc,
      getDoc: fsMod.getDoc,
      setDoc: fsMod.setDoc
    };
    notifySyncStatus('☁️ Firebase Connected');

    // Check if remote document exists and pull if local has no logs yet
    const syncKey = currentState?.userSettings?.cloudSyncKey || 'abhin-cut-tracker-default';
    const docRef = firestoreFns.doc(firestoreDb, 'trackers', syncKey);
    const snap = await firestoreFns.getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.state) {
        const remoteState = typeof data.state === 'string' ? JSON.parse(data.state) : data.state;
        lastCloudSyncTime = data.updatedAt || new Date().toISOString();
        notifySyncStatus('☁️ Synced with Firebase');
        const hasLocalLogs = Object.keys(currentState.dailyLogs || {}).length > 0 ||
          (currentState.runLogs || []).length > 0 ||
          Object.keys(currentState.workoutSessions || {}).length > 0;
        if (!hasLocalLogs && typeof onRemoteDataLoaded === 'function') {
          onRemoteDataLoaded(mergeWithDefaults(remoteState));
        }
      }
    } else {
      await pushStateToCloudNow(currentState);
    }
  } catch (err) {
    console.warn('Firebase Cloud Sync offline or unavailable, using local storage:', err);
    notifySyncStatus('⚡ Local Offline Mode');
  }
}

export async function pushStateToCloudNow(state) {
  if (!firestoreDb || !firestoreFns) return false;
  try {
    notifySyncStatus('☁️ Syncing…');
    const syncKey = state?.userSettings?.cloudSyncKey || 'abhin-cut-tracker-default';
    const docRef = firestoreFns.doc(firestoreDb, 'trackers', syncKey);
    const nowIso = new Date().toISOString();
    await firestoreFns.setDoc(docRef, {
      state: JSON.stringify(state),
      updatedAt: nowIso,
      version: 1
    });
    lastCloudSyncTime = nowIso;
    notifySyncStatus('☁️ Synced to Firebase');
    return true;
  } catch (err) {
    console.warn('Cloud push error:', err);
    notifySyncStatus('⚠️ Local Saved (Cloud Offline)');
    return false;
  }
}

export async function pullStateFromCloudNow(syncKey = 'abhin-cut-tracker-default') {
  if (!firestoreDb || !firestoreFns) return null;
  try {
    notifySyncStatus('☁️ Pulling from Firebase…');
    const docRef = firestoreFns.doc(firestoreDb, 'trackers', syncKey);
    const snap = await firestoreFns.getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.state) {
        const parsed = typeof data.state === 'string' ? JSON.parse(data.state) : data.state;
        lastCloudSyncTime = data.updatedAt || new Date().toISOString();
        notifySyncStatus('☁️ Restored from Firebase');
        return mergeWithDefaults(parsed);
      }
    }
    notifySyncStatus('☁️ No Cloud Backup Found');
    return null;
  } catch (err) {
    console.warn('Cloud pull error:', err);
    notifySyncStatus('⚠️ Cloud Pull Failed');
    return null;
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function createInitialState() {
  // Determine default active date:
  // Use today's local date so the user can log immediately today, or jump to Programme Start (23 Nov 2026)
  const todayStr = getTodayLocalStr();
  return {
    version: 1,
    activeDate: todayStr,
    userSettings: deepClone(DEFAULT_USER_SETTINGS),
    gymTemplates: deepClone(DEFAULT_GYM_TEMPLATES),
    runningPlan: deepClone(DEFAULT_RUNNING_PLAN),
    habits: deepClone(DEFAULT_HABITS),
    mealPresets: deepClone(DEFAULT_MEAL_PRESETS),
    // Map of dateStr -> override/reschedule metadata
    // { status: 'planned'|'completed'|'modified'|'skipped', customTitle, customType, originalPlannedDate, rescheduledToDate, notes }
    calendarOverrides: {},
    // Map of dateStr -> DailyLog
    // { date, weightKg, caloriesKcal, proteinG, carbohydrateG, fatG, waterL, steps, sleepHours, notes, entries: [] }
    dailyLogs: {},
    // Map of dateStr -> WorkoutSession with embedded exerciseLogs
    workoutSessions: {},
    // Array of RunLog items
    runLogs: [],
    // Map of dateStr -> { [habitId]: boolean }
    habitLogs: {},
    // Map of dateStr -> MeasurementLog
    measurementLogs: {}
  };
}

// IndexedDB helper for extra durability
function saveToIndexedDB(state) {
  if (typeof indexedDB === 'undefined') return;
  try {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(state, STORAGE_KEY);
    };
  } catch (err) {
    console.warn('IndexedDB mirror skipped:', err);
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialState();
      saveState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return mergeWithDefaults(parsed);
  } catch (err) {
    console.error('Failed to load state from localStorage, initializing defaults:', err);
    return createInitialState();
  }
}

export function mergeWithDefaults(parsed) {
  const base = createInitialState();
  if (!parsed || typeof parsed !== 'object') return base;
  return {
    ...base,
    ...parsed,
    userSettings: { ...base.userSettings, ...(parsed.userSettings || {}) },
    gymTemplates: { ...base.gymTemplates, ...(parsed.gymTemplates || {}) },
    runningPlan: Array.isArray(parsed.runningPlan) && parsed.runningPlan.length === 6
      ? parsed.runningPlan
      : base.runningPlan,
    habits: Array.isArray(parsed.habits) && parsed.habits.length > 0
      ? parsed.habits
      : base.habits,
    mealPresets: Array.isArray(parsed.mealPresets)
      ? parsed.mealPresets
      : base.mealPresets,
    calendarOverrides: parsed.calendarOverrides || {},
    dailyLogs: parsed.dailyLogs || {},
    workoutSessions: parsed.workoutSessions || {},
    runLogs: Array.isArray(parsed.runLogs) ? parsed.runLogs : [],
    habitLogs: parsed.habitLogs || {},
    measurementLogs: parsed.measurementLogs || {}
  };
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    saveToIndexedDB(state);
    if (firestoreDb && firestoreFns) {
      if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
      cloudSyncTimer = setTimeout(() => {
        pushStateToCloudNow(state);
      }, 1200);
    }
  } catch (err) {
    console.error('Error saving state:', err);
  }
}

export function resetAllData() {
  const fresh = createInitialState();
  saveState(fresh);
  return fresh;
}

// Phase lookup for any date
export function getPhaseForDate(state, dateStr) {
  const start = state.userSettings.programmeStartDate || '2026-11-23';
  const end = state.userSettings.programmeEndDate || '2027-01-05';
  const offset = diffDays(start, dateStr);
  const totalDays = diffDays(start, end) + 1;

  if (offset < 0) {
    return {
      id: 'pre-programme',
      weekNumber: 0,
      name: 'Pre-Programme Prep',
      focus: `Starts ${ start } (${ Math.abs(offset) } day${ Math.abs(offset) === 1 ? '' : 's' } to go)`,
      isDeload: false,
      inProgramme: false,
      daysUntilStart: Math.abs(offset)
    };
  }
  if (offset >= totalDays) {
    return {
      id: 'post-programme',
      weekNumber: 8,
      name: 'Post-Programme Maintenance',
      focus: 'Sustaining habits & progressive training',
      isDeload: false,
      inProgramme: false
    };
  }

  const weekIdx = Math.floor(offset / 7); // 0..5 for Weeks 1..6, 6 for Final Assessment
  const matched = PROGRAMME_PHASES[Math.min(weekIdx, PROGRAMME_PHASES.length - 1)];
  return {
    ...matched,
    inProgramme: true,
    dayOfProgramme: offset + 1,
    totalProgrammeDays: totalDays,
    isStartDate: dateStr === start,
    isEndDate: dateStr === end
  };
}

// Base planned schedule for a given date before overrides
export function getBasePlanForDate(state, dateStr) {
  const phase = getPhaseForDate(state, dateStr);
  const dow = getDayOfWeekIndex(dateStr); // 0=Mon .. 6=Sun
  const start = state.userSettings.programmeStartDate || '2026-11-23';
  const end = state.userSettings.programmeEndDate || '2027-01-05';

  // Final assessment specific days (Jan 4 & Jan 5 2027, or last 2 days of programme)
  if (phase.id === 'final-assessment' || dateStr === addDays(end, -1) || dateStr === end) {
    if (dow === 0 || dateStr === '2027-01-04') {
      const tpl = state.gymTemplates['gym-assessment'] || DEFAULT_GYM_TEMPLATES['gym-assessment'];
      return {
        date: dateStr,
        category: 'gym',
        isAssessment: true,
        templateId: 'gym-assessment',
        title: 'Moderate Full-Body Gym (Assessment)',
        shortTitle: 'Gym (Moderate)',
        subtitle: 'Final assessment week: moderate volume, 2–3 RIR, no failure.',
        phase
      };
    }
    if (dow === 1 || dateStr === '2027-01-05') {
      return {
        date: dateStr,
        category: 'run',
        isAssessment: true,
        runSessionType: 'easy',
        plannedDistanceKm: 4,
        plannedDistanceLabel: '4 km easy',
        title: 'Easy Run & Final Assessment Review',
        shortTitle: 'Easy Run + Review',
        subtitle: '4 km conversational easy run + 6-week progress review & measurements.',
        phase
      };
    }
  }

  const weekNum = phase.weekNumber >= 1 && phase.weekNumber <= 6 ? phase.weekNumber : 1;
  const runWeek = state.runningPlan.find(w => Number(w.weekNumber) === weekNum) || state.runningPlan[0];
  const isDeload = Boolean(phase.isDeload);

  switch (dow) {
    case 0: // Monday
      return {
        date: dateStr,
        category: 'gym',
        templateId: 'gym-a',
        title: isDeload ? 'Full-body gym A (Consolidation -35%)' : 'Full-body gym A',
        shortTitle: 'Gym A',
        subtitle: isDeload
          ? 'Week 6 reduced volume: 30–40% fewer working sets, crisp technique.'
          : 'Bench press, Lat pulldown, Squat, Shoulder press, Arms & Plank.',
        isDeload,
        phase
      };
    case 1: // Tuesday
      return {
        date: dateStr,
        category: 'run',
        runSessionType: 'easy',
        plannedDistanceKm: Number(runWeek.easyKm) || 4,
        plannedDistanceLabel: runWeek.easyLabel || `${runWeek.easyKm} km`,
        title: `Easy Aerobic Run (${runWeek.easyLabel || runWeek.easyKm + ' km'})`,
        shortTitle: `Easy Run ${runWeek.easyLabel || runWeek.easyKm + 'k'}`,
        subtitle: 'Conversational pace, effort ~3–4/10.',
        isDeload,
        phase
      };
    case 2: // Wednesday
      return {
        date: dateStr,
        category: 'gym',
        templateId: 'gym-b',
        title: isDeload ? 'Full-body gym B (Consolidation -35%)' : 'Full-body gym B',
        shortTitle: 'Gym B',
        subtitle: isDeload
          ? 'Week 6 reduced volume: 30–40% fewer working sets, leave 2–3 RIR.'
          : 'Romanian deadlift, Incline press, Cable row, Leg press, Delts & Core.',
        isDeload,
        phase
      };
    case 3: // Thursday
      return {
        date: dateStr,
        category: 'run',
        runSessionType: runWeek.qualityType || 'interval',
        plannedDistanceKm: Number(runWeek.qualityEstimatedKm) || 5,
        plannedDistanceLabel: runWeek.qualityLabel,
        title: `Quality Run: ${runWeek.qualityLabel}`,
        shortTitle: runWeek.qualityLabel,
        subtitle: runWeek.qualityDetails || '10-min warm-up & cool-down. Easy jog/walk recovery between reps.',
        isDeload,
        phase
      };
    case 4: // Friday
      return {
        date: dateStr,
        category: 'gym',
        templateId: 'gym-c',
        title: isDeload ? 'Full-body gym C (Consolidation -35%)' : 'Full-body gym C',
        shortTitle: 'Gym C',
        subtitle: isDeload
          ? 'Week 6 reduced volume: 30–40% fewer working sets, focus on recovery.'
          : 'Bulgarian split squat, Chest-supported row, Machine press, Leg curl, Arms & Core.',
        isDeload,
        phase
      };
    case 5: // Saturday
      return {
        date: dateStr,
        category: 'rest',
        title: 'Rest and Mobility',
        shortTitle: 'Rest & Mobility',
        subtitle: 'Active recovery, light walking, 5–10 mins mobility & hydration.',
        isDeload,
        phase
      };
    case 6: // Sunday
    default:
      return {
        date: dateStr,
        category: 'run',
        runSessionType: 'long',
        plannedDistanceKm: Number(runWeek.longKm) || 7,
        plannedDistanceLabel: runWeek.longLabel || `${runWeek.longKm} km`,
        title: `Long Easy Run (${runWeek.longLabel || runWeek.longKm + ' km'})`,
        shortTitle: `Long Run ${runWeek.longLabel || runWeek.longKm + 'k'}`,
        subtitle: 'Relaxed conversational effort (3–4/10). Scale conservatively to recent base.',
        isDeload,
        phase
      };
  }
}

export function getPlannedSessionForDate(state, dateStr) {
  const base = getBasePlanForDate(state, dateStr);
  const override = state.calendarOverrides[dateStr] || {};
  const workoutSession = state.workoutSessions[dateStr];
  const runsOnDate = state.runLogs.filter(r => r.date === dateStr);

  // Determine effective status
  let status = override.status || 'planned';
  if (workoutSession && workoutSession.status && workoutSession.status !== 'planned') {
    status = workoutSession.status;
  } else if (runsOnDate.length > 0 && base.category === 'run') {
    status = runsOnDate[0].status || 'completed';
  }

  return {
    ...base,
    title: override.customTitle || base.title,
    shortTitle: override.customShortTitle || base.shortTitle,
    subtitle: override.customSubtitle || base.subtitle,
    category: override.customCategory || base.category,
    templateId: override.customTemplateId || base.templateId,
    plannedDistanceKm: override.customDistanceKm !== undefined ? Number(override.customDistanceKm) : base.plannedDistanceKm,
    status,
    originalPlannedDate: override.originalPlannedDate || dateStr,
    rescheduledToDate: override.rescheduledToDate || null,
    rescheduledFromDate: override.rescheduledFromDate || null,
    notes: override.notes || (workoutSession ? workoutSession.notes : '') || ''
  };
}

// Reschedule a session from sourceDate to targetDate while preserving originalPlannedDate
export function rescheduleSession(state, sourceDate, targetDate, mode = 'swap') {
  if (!sourceDate || !targetDate || sourceDate === targetDate) return state;
  const sourceSession = getPlannedSessionForDate(state, sourceDate);
  const targetSession = getPlannedSessionForDate(state, targetDate);

  const prevSourceOverride = state.calendarOverrides[sourceDate] || {};
  const prevTargetOverride = state.calendarOverrides[targetDate] || {};

  if (mode === 'swap') {
    state.calendarOverrides[targetDate] = {
      ...prevTargetOverride,
      customTitle: sourceSession.title,
      customShortTitle: sourceSession.shortTitle,
      customSubtitle: sourceSession.subtitle,
      customCategory: sourceSession.category,
      customTemplateId: sourceSession.templateId,
      customDistanceKm: sourceSession.plannedDistanceKm,
      originalPlannedDate: sourceSession.originalPlannedDate || sourceDate,
      rescheduledFromDate: sourceDate,
      status: sourceSession.status === 'completed' ? 'completed' : 'planned'
    };
    state.calendarOverrides[sourceDate] = {
      ...prevSourceOverride,
      customTitle: targetSession.title,
      customShortTitle: targetSession.shortTitle,
      customSubtitle: targetSession.subtitle,
      customCategory: targetSession.category,
      customTemplateId: targetSession.templateId,
      customDistanceKm: targetSession.plannedDistanceKm,
      originalPlannedDate: targetSession.originalPlannedDate || targetDate,
      rescheduledToDate: targetDate,
      status: 'planned'
    };
  } else {
    // Move source session to targetDate, mark sourceDate as Rest / Rescheduled
    state.calendarOverrides[targetDate] = {
      ...prevTargetOverride,
      customTitle: sourceSession.title,
      customShortTitle: sourceSession.shortTitle,
      customSubtitle: sourceSession.subtitle,
      customCategory: sourceSession.category,
      customTemplateId: sourceSession.templateId,
      customDistanceKm: sourceSession.plannedDistanceKm,
      originalPlannedDate: sourceSession.originalPlannedDate || sourceDate,
      rescheduledFromDate: sourceDate,
      status: 'planned'
    };
    state.calendarOverrides[sourceDate] = {
      ...prevSourceOverride,
      customTitle: 'Rest Day (Rescheduled)',
      customShortTitle: 'Rescheduled',
      customSubtitle: `Moved "${sourceSession.shortTitle}" to ${targetDate} (Originally planned: ${sourceSession.originalPlannedDate || sourceDate})`,
      customCategory: 'rest',
      customTemplateId: null,
      originalPlannedDate: sourceSession.originalPlannedDate || sourceDate,
      rescheduledToDate: targetDate,
      status: 'modified'
    };
  }

  saveState(state);
  return state;
}

// Get or initialize a WorkoutSession for a given date
export function getOrCreateWorkoutSession(state, dateStr, optionalTemplateId = null) {
  if (state.workoutSessions[dateStr]) {
    return state.workoutSessions[dateStr];
  }
  const planned = getPlannedSessionForDate(state, dateStr);
  const templateId = optionalTemplateId || planned.templateId || 'gym-a';
  const template = state.gymTemplates[templateId] || state.gymTemplates['gym-a'];
  const isDeload = Boolean(planned.isDeload || planned.phase?.isDeload);

  const exercises = (template.exercises || []).map((ex, idx) => {
    const numSets = isDeload ? (ex.deloadSets || Math.max(1, Math.round(ex.plannedSets * 0.65))) : ex.plannedSets;
    const lastRef = getLastUsedExercisePerformance(state, ex.name, dateStr);
    const sets = [];
    for (let s = 1; s <= numSets; s++) {
      sets.push({
        setNumber: s,
        reps: ex.isTimed ? 45 : parseDefaultRepTarget(ex.repTarget),
        weightKg: lastRef ? lastRef.weightKg : '',
        durationSeconds: ex.isTimed ? 45 : null,
        rpe: 8,
        completed: false
      });
    }
    return {
      id: `${dateStr}-${ex.id || idx}`,
      exerciseName: ex.name,
      plannedSets: numSets,
      repTarget: ex.repTarget,
      isCompound: Boolean(ex.isCompound),
      isTimed: Boolean(ex.isTimed),
      defaultRestSec: ex.defaultRestSec || 90,
      completed: false,
      notes: '',
      sets
    };
  });

  const session = {
    id: `ws-${dateStr}`,
    date: dateStr,
    templateId,
    type: template.name,
    status: 'planned',
    isDeload,
    originalPlannedDate: planned.originalPlannedDate || dateStr,
    notes: '',
    completedAt: null,
    exercises
  };

  state.workoutSessions[dateStr] = session;
  saveState(state);
  return session;
}

function parseDefaultRepTarget(repTargetStr) {
  if (!repTargetStr) return 10;
  const match = String(repTargetStr).match(/(\d+)/);
  return match ? Number(match[1]) : 10;
}

// Find last-used weight and reps for an exercise name before or across sessions
export function getLastUsedExercisePerformance(state, exerciseName, excludeDateStr = null) {
  if (!exerciseName) return null;
  const targetName = exerciseName.trim().toLowerCase();
  const dates = Object.keys(state.workoutSessions).sort().reverse();

  for (const d of dates) {
    if (excludeDateStr && d === excludeDateStr) continue;
    const ws = state.workoutSessions[d];
    if (!ws || !Array.isArray(ws.exercises)) continue;
    for (const ex of ws.exercises) {
      if ((ex.exerciseName || '').trim().toLowerCase() === targetName) {
        // Find the heaviest or last completed set with a weight > 0
        const validSets = (ex.sets || []).filter(s => s.completed && s.weightKg !== '' && Number(s.weightKg) >= 0);
        if (validSets.length > 0) {
          const best = validSets[validSets.length - 1];
          return {
            date: d,
            weightKg: Number(best.weightKg),
            reps: best.reps,
            rpe: best.rpe
          };
        }
      }
    }
  }
  return null;
}

// Pace calculation helper
export function calculatePace(distanceKm, durationSeconds) {
  const dist = Number(distanceKm);
  const dur = Number(durationSeconds);
  if (!dist || dist <= 0 || !dur || dur <= 0) {
    return { paceFormatted: '—', secPerKm: 0 };
  }
  const secPerKm = Math.round(dur / dist);
  const mins = Math.floor(secPerKm / 60);
  const secs = String(secPerKm % 60).padStart(2, '0');
  return {
    paceFormatted: `${mins}:${secs} /km`,
    secPerKm
  };
}

export function formatDurationHms(durationSeconds) {
  const total = Math.max(0, Math.round(Number(durationSeconds) || 0));
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function parseDurationInput(minutesVal, secondsVal, hoursVal = 0) {
  const h = Math.max(0, Number(hoursVal) || 0);
  const m = Math.max(0, Number(minutesVal) || 0);
  const s = Math.max(0, Number(secondsVal) || 0);
  return Math.round(h * 3600 + m * 60 + s);
}

// Get or create DailyLog for a date
export function getDailyLog(state, dateStr) {
  const existing = state.dailyLogs[dateStr];
  if (existing) {
    return existing;
  }
  return {
    date: dateStr,
    weightKg: null,
    caloriesKcal: 0,
    proteinG: 0,
    carbohydrateG: 0,
    fatG: 0,
    waterL: 0,
    steps: null,
    sleepHours: null,
    notes: '',
    entries: []
  };
}

export function saveDailyLog(state, dateStr, updates) {
  const current = getDailyLog(state, dateStr);
  const updated = { ...current, ...updates, date: dateStr };
  state.dailyLogs[dateStr] = updated;

  // Sync weight & sleep with measurementLogs if provided
  if (updates.weightKg !== undefined && updates.weightKg !== null && updates.weightKg !== '') {
    const mLog = state.measurementLogs[dateStr] || { date: dateStr };
    mLog.weightKg = Number(updates.weightKg);
    state.measurementLogs[dateStr] = mLog;
  }
  if (updates.sleepHours !== undefined && updates.sleepHours !== null && updates.sleepHours !== '') {
    const mLog = state.measurementLogs[dateStr] || { date: dateStr };
    mLog.sleepHours = Number(updates.sleepHours);
    state.measurementLogs[dateStr] = mLog;
  }

  saveState(state);
  return updated;
}

export function addNutritionEntry(state, dateStr, entry) {
  const log = getDailyLog(state, dateStr);
  const newEntry = {
    id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: entry.name || 'Macro Entry',
    caloriesKcal: Math.max(0, Number(entry.caloriesKcal) || 0),
    proteinG: Math.max(0, Number(entry.proteinG) || 0),
    carbohydrateG: Math.max(0, Number(entry.carbohydrateG) || 0),
    fatG: Math.max(0, Number(entry.fatG) || 0),
    waterL: Math.max(0, Number(entry.waterL) || 0),
    createdAt: new Date().toISOString()
  };
  log.entries = Array.isArray(log.entries) ? [...log.entries, newEntry] : [newEntry];
  recalculateDailyTotalsFromEntries(log);
  state.dailyLogs[dateStr] = log;
  saveState(state);
  return log;
}

export function deleteNutritionEntry(state, dateStr, entryId) {
  const log = getDailyLog(state, dateStr);
  if (!Array.isArray(log.entries)) return log;
  log.entries = log.entries.filter(e => e.id !== entryId);
  recalculateDailyTotalsFromEntries(log);
  state.dailyLogs[dateStr] = log;
  saveState(state);
  return log;
}

export function recalculateDailyTotalsFromEntries(log) {
  if (!Array.isArray(log.entries)) return;
  let cal = 0, pro = 0, carb = 0, fat = 0, entryWater = 0;
  for (const e of log.entries) {
    cal += Number(e.caloriesKcal) || 0;
    pro += Number(e.proteinG) || 0;
    carb += Number(e.carbohydrateG) || 0;
    fat += Number(e.fatG) || 0;
    entryWater += Number(e.waterL) || 0;
  }
  log.caloriesKcal = Math.round(cal);
  log.proteinG = Math.round(pro * 10) / 10;
  log.carbohydrateG = Math.round(carb * 10) / 10;
  log.fatG = Math.round(fat * 10) / 10;
  if (entryWater > 0) {
    log.waterL = Math.round(((Number(log.manualWaterL) || 0) + entryWater) * 100) / 100;
  }
}

// Get 7-day rolling weight average up to dateStr
export function getWeightTrendSummary(state, referenceDateStr) {
  // Collect all dates that have a weight logged in dailyLogs or measurementLogs
  const weightMap = {};
  for (const [d, log] of Object.entries(state.dailyLogs)) {
    if (log && log.weightKg !== null && log.weightKg !== undefined && log.weightKg !== '' && Number(log.weightKg) > 0) {
      weightMap[d] = Number(log.weightKg);
    }
  }
  for (const [d, m] of Object.entries(state.measurementLogs)) {
    if (m && m.weightKg !== null && m.weightKg !== undefined && m.weightKg !== '' && Number(m.weightKg) > 0) {
      weightMap[d] = Number(m.weightKg);
    }
  }

  const allSortedDates = Object.keys(weightMap).sort();
  if (allSortedDates.length === 0) {
    return {
      latestWeightKg: null,
      latestDate: null,
      rolling7DayAvgKg: null,
      prev7DayAvgKg: null,
      weeklyChangeKg: null,
      totalEntries: 0,
      series: []
    };
  }

  // Build series with 7-day rolling average for each logged point
  const series = allSortedDates.map(d => {
    const windowStart = addDays(d, -6);
    const windowVals = allSortedDates
      .filter(k => k >= windowStart && k <= d)
      .map(k => weightMap[k]);
    const avg = windowVals.reduce((a, b) => a + b, 0) / windowVals.length;
    return {
      date: d,
      weightKg: weightMap[d],
      rollingAvgKg: Math.round(avg * 100) / 100
    };
  });

  const upToRef = series.filter(pt => pt.date <= referenceDateStr);
  const latestPt = upToRef.length > 0 ? upToRef[upToRef.length - 1] : series[series.length - 1];

  // Calculate previous 7-day window average for trend comparison
  const refDate = latestPt.date;
  const prevWindowStart = addDays(refDate, -13);
  const prevWindowEnd = addDays(refDate, -7);
  const prevVals = allSortedDates
    .filter(k => k >= prevWindowStart && k <= prevWindowEnd)
    .map(k => weightMap[k]);
  const prev7DayAvgKg = prevVals.length > 0
    ? Math.round((prevVals.reduce((a, b) => a + b, 0) / prevVals.length) * 100) / 100
    : null;

  const weeklyChangeKg = prev7DayAvgKg !== null
    ? Math.round((latestPt.rollingAvgKg - prev7DayAvgKg) * 100) / 100
    : null;

  return {
    latestWeightKg: latestPt.weightKg,
    latestDate: latestPt.date,
    rolling7DayAvgKg: latestPt.rollingAvgKg,
    prev7DayAvgKg,
    weeklyChangeKg,
    totalEntries: allSortedDates.length,
    series
  };
}

// Nutrition analytics & warnings
export function getNutritionSummary(state, dateStr) {
  const settings = state.userSettings;
  const todayLog = getDailyLog(state, dateStr);

  // Weekly window (last 7 days up to dateStr)
  const loggedDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(dateStr, -i);
    const l = state.dailyLogs[d];
    if (l && (Number(l.caloriesKcal) > 0 || Number(l.proteinG) > 0)) {
      loggedDays.push(l);
    }
  }

  const avgCalories = loggedDays.length > 0
    ? Math.round(loggedDays.reduce((s, x) => s + (Number(x.caloriesKcal) || 0), 0) / loggedDays.length)
    : 0;
  const avgProtein = loggedDays.length > 0
    ? Math.round(loggedDays.reduce((s, x) => s + (Number(x.proteinG) || 0), 0) / loggedDays.length)
    : 0;

  // Warnings:
  // 1) Repeatedly missing protein (< 135g on 2+ logged days in last 7 days, or today calories >= 1600 with protein < 110g)
  // 2) Unusually low calorie intake (< 1500 kcal on a logged day)
  const warnings = [];
  const lowProteinDays = loggedDays.filter(d => Number(d.caloriesKcal) >= 1200 && Number(d.proteinG) < (settings.proteinTargetG - 15));
  if (lowProteinDays.length >= 2) {
    warnings.push({
      type: 'protein-warning',
      title: 'Protein Target Repeatedly Missed',
      message: `Protein was below ${settings.proteinTargetG - 15} g on ${lowProteinDays.length} recent logged days (weekly average: ${avgProtein} g vs ${settings.proteinTargetG} g target). Prioritise protein portions to help retain muscle during the cut.`
    });
  } else if (Number(todayLog.caloriesKcal) >= 1600 && Number(todayLog.proteinG) < 110) {
    warnings.push({
      type: 'protein-today',
      title: 'Low Protein Relative to Calories Today',
      message: `You have logged ${todayLog.caloriesKcal} kcal today with ${todayLog.proteinG} g protein. Aim for a protein-dense final meal or shake to reach the 140–160 g range.`
    });
  }

  const veryLowCalDays = loggedDays.filter(d => Number(d.caloriesKcal) > 0 && Number(d.caloriesKcal) < 1500);
  if (Number(todayLog.caloriesKcal) > 0 && Number(todayLog.caloriesKcal) < 1500) {
    warnings.push({
      type: 'low-calorie-warning',
      title: 'Unusually Low Calorie Intake Today',
      message: `Today's logged total is ${todayLog.caloriesKcal} kcal (target: ${settings.calorieTarget} kcal). If you have finished logging for the day, avoid aggressive undereating — steep deficits increase fatigue, impair running recovery, and risk muscle loss.`
    });
  } else if (veryLowCalDays.length >= 2) {
    warnings.push({
      type: 'low-calorie-trend',
      title: 'Low Weekly Calorie Trend Detected',
      message: `${veryLowCalDays.length} recent days were under 1,500 kcal. Sustainable fat loss with 3 gym + 3 run sessions per week requires adequate fuelling around ${settings.calorieTarget} kcal.`
    });
  }

  return {
    todayLog,
    targets: {
      calories: Number(settings.calorieTarget) || 2100,
      protein: Number(settings.proteinTargetG) || 150,
      carbs: Number(settings.carbohydrateTargetG) || 232,
      fat: Number(settings.fatTargetG) || 60,
      water: Number(settings.waterTargetL) || 3.0
    },
    remaining: {
      calories: (Number(settings.calorieTarget) || 2100) - (Number(todayLog.caloriesKcal) || 0),
      protein: Math.round(((Number(settings.proteinTargetG) || 150) - (Number(todayLog.proteinG) || 0)) * 10) / 10,
      carbs: Math.round(((Number(settings.carbohydrateTargetG) || 232) - (Number(todayLog.carbohydrateG) || 0)) * 10) / 10,
      fat: Math.round(((Number(settings.fatTargetG) || 60) - (Number(todayLog.fatG) || 0)) * 10) / 10
    },
    macroArithmeticKcal: (Number(settings.proteinTargetG) * 4) + (Number(settings.fatTargetG) * 9) + (Number(settings.carbohydrateTargetG) * 4),
    loggedTodayMacroKcal: Math.round((Number(todayLog.proteinG) * 4) + (Number(todayLog.fatG) * 9) + (Number(todayLog.carbohydrateG) * 4)),
    weeklyAvgCalories: avgCalories,
    weeklyAvgProtein: avgProtein,
    loggedDaysCount: loggedDays.length,
    warnings
  };
}

// Evaluate automatic status suggestions for daily habits
export function getHabitStatusForDate(state, dateStr) {
  const settings = state.userSettings;
  const daily = getDailyLog(state, dateStr);
  const manualChecks = state.habitLogs[dateStr] || {};
  const plannedSession = getPlannedSessionForDate(state, dateStr);

  const autoMet = {
    protein: Number(daily.proteinG) >= 140,
    calories: Number(daily.caloriesKcal) >= (settings.calorieTarget - 250) && Number(daily.caloriesKcal) <= (settings.calorieTarget + 200),
    workout: plannedSession.status === 'completed' || (plannedSession.category === 'rest' && Boolean(manualChecks['habit-workout'])),
    steps: Number(daily.steps) >= (settings.stepTargetMin || 8000),
    water: Number(daily.waterL) >= (settings.waterTargetMinL || 2.5),
    sleep: Number(daily.sleepHours) >= (settings.sleepTargetMinHours || 7.5),
    weight: daily.weightKg !== null && daily.weightKg !== undefined && daily.weightKg !== '' && Number(daily.weightKg) > 0,
    meals: Array.isArray(daily.entries) && daily.entries.length >= 3
  };

  const activeHabits = state.habits.filter(h => h.active !== false);
  const items = activeHabits.map(h => {
    const manual = manualChecks[h.id];
    const auto = h.autoRule ? Boolean(autoMet[h.autoRule]) : false;
    const completed = manual !== undefined ? Boolean(manual) : auto;
    return {
      ...h,
      completed,
      isAutoSuggested: auto && manual === undefined
    };
  });

  const coreItems = items.filter(i => i.category === 'core');
  const completedCount = items.filter(i => i.completed).length;
  const pct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return {
    items,
    coreItems,
    completedCount,
    totalCount: items.length,
    completionPct: pct
  };
}

export function toggleHabitForDate(state, dateStr, habitId, explicitValue = null) {
  if (!state.habitLogs[dateStr]) {
    state.habitLogs[dateStr] = {};
  }
  const currentStatus = getHabitStatusForDate(state, dateStr);
  const found = currentStatus.items.find(i => i.id === habitId);
  const nextVal = explicitValue !== null ? Boolean(explicitValue) : !(found ? found.completed : false);
  state.habitLogs[dateStr][habitId] = nextVal;
  saveState(state);
  return state;
}

// Weekly training summary for the week containing dateStr
export function getWeeklyTrainingSummary(state, dateStr) {
  const monday = getMondayOfWeek(dateStr);
  let gymCompleted = 0;
  let gymPlanned = 0;
  let runsCompleted = 0;
  let runsPlanned = 0;
  let totalRunKm = 0;
  let plannedRunKm = 0;

  for (let i = 0; i < 7; i++) {
    const d = addDays(monday, i);
    const session = getPlannedSessionForDate(state, d);
    if (session.category === 'gym') {
      gymPlanned++;
      if (session.status === 'completed' || session.status === 'modified') {
        gymCompleted++;
      }
    } else if (session.category === 'run') {
      runsPlanned++;
      plannedRunKm += Number(session.plannedDistanceKm) || 0;
    }

    const dayRuns = state.runLogs.filter(r => r.date === d && (r.status === 'completed' || r.status === 'modified'));
    if (dayRuns.length > 0) {
      runsCompleted += dayRuns.length;
      for (const r of dayRuns) {
        totalRunKm += Number(r.distanceKm) || 0;
      }
    } else if (session.category === 'run' && session.status === 'completed') {
      runsCompleted++;
      totalRunKm += Number(session.plannedDistanceKm) || 0;
    }
  }

  return {
    weekStart: monday,
    weekEnd: addDays(monday, 6),
    gymCompleted,
    gymPlanned,
    runsCompleted,
    runsPlanned,
    totalRunKm: Math.round(totalRunKm * 10) / 10,
    plannedRunKm: Math.round(plannedRunKm * 10) / 10
  };
}

// Find next upcoming session after dateStr
export function getNextSessionAfter(state, dateStr) {
  for (let i = 1; i <= 14; i++) {
    const d = addDays(dateStr, i);
    const s = getPlannedSessionForDate(state, d);
    if (s.category === 'gym' || s.category === 'run') {
      return s;
    }
  }
  return getPlannedSessionForDate(state, addDays(dateStr, 1));
}

// Export all data as JSON string
export function exportStateAsJson(state) {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: '6-Week Fitness Cut & Training Tracker',
    state
  };
  return JSON.stringify(payload, null, 2);
}

// CSV Export generator
export function generateCsvExport(state, exportType = 'daily') {
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  if (exportType === 'daily') {
    const headers = [
      'Date', 'Weight (kg)', 'Calories (kcal)', 'Protein (g)', 'Carbs (g)', 'Fat (g)',
      'Water (L)', 'Steps', 'Sleep (hrs)', 'Waist (cm)', 'Chest (cm)', 'Hips (cm)',
      'Resting HR (bpm)', 'Body Fat Est (%)', 'Notes'
    ];
    const allDates = new Set([
      ...Object.keys(state.dailyLogs),
      ...Object.keys(state.measurementLogs)
    ]);
    const sortedDates = Array.from(allDates).sort();
    const rows = sortedDates.map(d => {
      const dl = state.dailyLogs[d] || {};
      const ml = state.measurementLogs[d] || {};
      return [
        d,
        dl.weightKg ?? ml.weightKg ?? '',
        dl.caloriesKcal ?? '',
        dl.proteinG ?? '',
        dl.carbohydrateG ?? '',
        dl.fatG ?? '',
        dl.waterL ?? '',
        dl.steps ?? '',
        dl.sleepHours ?? ml.sleepHours ?? '',
        ml.waistCm ?? '',
        ml.chestCm ?? '',
        ml.hipsCm ?? '',
        ml.restingHeartRate ?? '',
        ml.bodyFatEstimate ?? '',
        dl.notes || ml.notes || ''
      ].map(escapeCsv).join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  }

  if (exportType === 'runs') {
    const headers = [
      'Date', 'Session Type', 'Distance (km)', 'Duration (sec)', 'Formatted Duration',
      'Average Pace', 'Avg Heart Rate (bpm)', 'Effort (1-10)', 'Route / Surface', 'Status', 'Notes'
    ];
    const sortedRuns = [...state.runLogs].sort((a, b) => a.date.localeCompare(b.date));
    const rows = sortedRuns.map(r => [
      r.date,
      r.sessionType,
      r.distanceKm,
      r.durationSeconds,
      formatDurationHms(r.durationSeconds),
      r.averagePace,
      r.averageHeartRate ?? '',
      r.effort ?? '',
      r.routeSurface ?? '',
      r.status ?? 'completed',
      r.notes ?? ''
    ].map(escapeCsv).join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  if (exportType === 'workouts') {
    const headers = [
      'Date', 'Workout Type', 'Session Status', 'Exercise Name', 'Set Number',
      'Reps / Seconds', 'Weight (kg)', 'RPE', 'Set Completed', 'Exercise Notes'
    ];
    const rows = [];
    const sortedDates = Object.keys(state.workoutSessions).sort();
    for (const d of sortedDates) {
      const ws = state.workoutSessions[d];
      if (!ws || !Array.isArray(ws.exercises)) continue;
      for (const ex of ws.exercises) {
        for (const s of (ex.sets || [])) {
          rows.push([
            d,
            ws.type,
            ws.status,
            ex.exerciseName,
            s.setNumber,
            s.reps,
            s.weightKg,
            s.rpe ?? '',
            s.completed ? 'Yes' : 'No',
            ex.notes || ws.notes || ''
          ].map(escapeCsv).join(','));
        }
      }
    }
    return [headers.join(','), ...rows].join('\n');
  }

  if (exportType === 'habits') {
    const activeHabits = state.habits;
    const headers = ['Date', ...activeHabits.map(h => h.title), 'Completion %'];
    const sortedDates = Object.keys(state.habitLogs).sort();
    const rows = sortedDates.map(d => {
      const status = getHabitStatusForDate(state, d);
      const cols = activeHabits.map(h => {
        const item = status.items.find(i => i.id === h.id);
        return item && item.completed ? '1' : '0';
      });
      return [d, ...cols, `${status.completionPct}%`].map(escapeCsv).join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  }

  return '';
}
