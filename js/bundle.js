// Bundled 6-Week Fitness Cut & Training Tracker (Auto-generated)
(function() {
"use strict";

// --- js/data.js ---
// Source of truth for the 6-Week Fitness Cut & Training Tracker
// Programme dates: Monday, 23 November 2026 -- Tuesday, 5 January 2027

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatLocalDate(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseLocalDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  }
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  }
  return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
}

function getTodayLocalStr() {
  return formatLocalDate(new Date());
}

function addDays(dateStr, deltaDays) {
  const dt = parseLocalDate(dateStr);
  dt.setDate(dt.getDate() + Number(deltaDays));
  return formatLocalDate(dt);
}

function diffDays(startStr, endStr) {
  const s = parseLocalDate(startStr);
  const e = parseLocalDate(endStr);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

function formatHumanDate(dateStr, options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) {
  const dt = parseLocalDate(dateStr);
  return dt.toLocaleDateString('en-GB', options);
}

function formatShortDate(dateStr) {
  const dt = parseLocalDate(dateStr);
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getDayOfWeekIndex(dateStr) {
  // Returns 0 for Monday ... 6 for Sunday
  const dt = parseLocalDate(dateStr);
  const jsDay = dt.getDay(); // 0 = Sun, 1 = Mon, ...
  return jsDay === 0 ? 6 : jsDay - 1;
}

function getMondayOfWeek(dateStr) {
  const idx = getDayOfWeekIndex(dateStr);
  return addDays(dateStr, -idx);
}

const DEFAULT_USER_SETTINGS = {
  id: 'user-profile-1',
  heightCm: 172,
  startingWeightKg: 75.0,
  estimatedBodyFatPct: 30,
  targetWeightMinKg: 71.0,
  targetWeightMaxKg: 73.0,
  calorieTarget: 2100,
  proteinTargetG: 150,
  fatTargetG: 60,
  carbohydrateTargetG: 232,
  stepTargetMin: 8000,
  stepTargetMax: 10000,
  stepTarget: 9000,
  waterTargetMinL: 2.5,
  waterTargetMaxL: 3.5,
  waterTargetL: 3.0,
  sleepTargetMinHours: 7.5,
  sleepTargetMaxHours: 9.0,
  sleepTargetHours: 8.0,
  programmeStartDate: '2026-11-23',
  programmeEndDate: '2027-01-05',
  currentWeeklyRunKm: null, // User to confirm
  recentLongRunKm: null,    // User to confirm
  runningBaseConfirmed: false,
  weightUnit: 'kg',
  distanceUnit: 'km',
  lengthUnit: 'cm',
  timeFormat: '24h',
  theme: 'dark',
  trainingStructureNote: '3 gym + 3 runs + 1 recovery day per week'
};

const PROGRAMME_PHASES = [
  {
    id: 'week-1',
    weekNumber: 1,
    name: 'Week 1',
    startDate: '2026-11-23',
    endDate: '2026-11-29',
    dateLabel: 'Nov 23–29',
    focus: 'Adaptation and routine',
    isDeload: false
  },
  {
    id: 'week-2',
    weekNumber: 2,
    name: 'Week 2',
    startDate: '2026-11-30',
    endDate: '2026-12-06',
    dateLabel: 'Nov 30–Dec 6',
    focus: 'Foundation and consistency',
    isDeload: false
  },
  {
    id: 'week-3',
    weekNumber: 3,
    name: 'Week 3',
    startDate: '2026-12-07',
    endDate: '2026-12-13',
    dateLabel: 'Dec 7–13',
    focus: 'Progressive overload',
    isDeload: false
  },
  {
    id: 'week-4',
    weekNumber: 4,
    name: 'Week 4',
    startDate: '2026-12-14',
    endDate: '2026-12-20',
    dateLabel: 'Dec 14–20',
    focus: 'Conditioning',
    isDeload: false
  },
  {
    id: 'week-5',
    weekNumber: 5,
    name: 'Week 5',
    startDate: '2026-12-21',
    endDate: '2026-12-27',
    dateLabel: 'Dec 21–27',
    focus: 'Peak training, if recovery is good',
    isDeload: false
  },
  {
    id: 'week-6',
    weekNumber: 6,
    name: 'Week 6',
    startDate: '2026-12-28',
    endDate: '2027-01-03',
    dateLabel: 'Dec 28–Jan 3',
    focus: 'Consolidation and reduced fatigue',
    isDeload: true
  },
  {
    id: 'final-assessment',
    weekNumber: 7,
    name: 'Final assessment',
    startDate: '2027-01-04',
    endDate: '2027-01-05',
    dateLabel: 'Jan 4–5',
    focus: 'Moderate session and progress review',
    isDeload: true
  }
];

const DEFAULT_GYM_TEMPLATES = {
  'gym-a': {
    id: 'gym-a',
    name: 'Full-body gym A',
    dayLabel: 'Monday',
    description: 'Horizontal push, vertical pull, squat pattern, overhead press, arms & core stability.',
    exercises: [
      { id: 'ex-a1', name: 'Barbell bench press', plannedSets: 3, deloadSets: 2, repTarget: '8–10', isCompound: true, defaultRestSec: 150 },
      { id: 'ex-a2', name: 'Lat pulldown', plannedSets: 3, deloadSets: 2, repTarget: '10–12', isCompound: true, defaultRestSec: 120 },
      { id: 'ex-a3', name: 'Squat', plannedSets: 3, deloadSets: 2, repTarget: '8–10', isCompound: true, defaultRestSec: 180 },
      { id: 'ex-a4', name: 'Dumbbell shoulder press', plannedSets: 3, deloadSets: 2, repTarget: '10', isCompound: true, defaultRestSec: 120 },
      { id: 'ex-a5', name: 'Cable triceps pushdown', plannedSets: 2, deloadSets: 1, repTarget: '12', isCompound: false, defaultRestSec: 75 },
      { id: 'ex-a6', name: 'Dumbbell curls', plannedSets: 2, deloadSets: 1, repTarget: '12', isCompound: false, defaultRestSec: 75 },
      { id: 'ex-a7', name: 'Plank', plannedSets: 3, deloadSets: 2, repTarget: '40–60 seconds', isCompound: false, isTimed: true, defaultRestSec: 60 }
    ]
  },
  'gym-b': {
    id: 'gym-b',
    name: 'Full-body gym B',
    dayLabel: 'Wednesday',
    description: 'Hip hinge, incline press, horizontal row, leg press, delts, core & rear delts.',
    exercises: [
      { id: 'ex-b1', name: 'Romanian deadlift', plannedSets: 3, deloadSets: 2, repTarget: '8–10', isCompound: true, defaultRestSec: 150 },
      { id: 'ex-b2', name: 'Incline dumbbell press', plannedSets: 3, deloadSets: 2, repTarget: '10', isCompound: true, defaultRestSec: 120 },
      { id: 'ex-b3', name: 'Seated cable row', plannedSets: 3, deloadSets: 2, repTarget: '10–12', isCompound: true, defaultRestSec: 120 },
      { id: 'ex-b4', name: 'Leg press', plannedSets: 3, deloadSets: 2, repTarget: '10', isCompound: true, defaultRestSec: 150 },
      { id: 'ex-b5', name: 'Lateral raises', plannedSets: 3, deloadSets: 2, repTarget: '12–15', isCompound: false, defaultRestSec: 75 },
      { id: 'ex-b6', name: 'Hanging knee raises', plannedSets: 3, deloadSets: 2, repTarget: '12', isCompound: false, defaultRestSec: 75 },
      { id: 'ex-b7', name: 'Face pulls', plannedSets: 2, deloadSets: 1, repTarget: '15', isCompound: false, defaultRestSec: 60 }
    ]
  },
  'gym-c': {
    id: 'gym-c',
    name: 'Full-body gym C',
    dayLabel: 'Friday',
    description: 'Unilateral leg work, chest-supported row, machine press, hamstrings, delts, arms & abs.',
    exercises: [
      { id: 'ex-c1', name: 'Bulgarian split squat', plannedSets: 2, deloadSets: 1, repTarget: '10 each leg', isCompound: true, defaultRestSec: 120 },
      { id: 'ex-c2', name: 'Chest-supported row', plannedSets: 3, deloadSets: 2, repTarget: '10', isCompound: true, defaultRestSec: 120 },
      { id: 'ex-c3', name: 'Machine chest press', plannedSets: 3, deloadSets: 2, repTarget: '10', isCompound: true, defaultRestSec: 120 },
      { id: 'ex-c4', name: 'Leg curl', plannedSets: 2, deloadSets: 1, repTarget: '12', isCompound: false, defaultRestSec: 90 },
      { id: 'ex-c5', name: 'Lateral raises', plannedSets: 3, deloadSets: 2, repTarget: '15', isCompound: false, defaultRestSec: 75 },
      { id: 'ex-c6', name: 'Biceps curls', plannedSets: 2, deloadSets: 1, repTarget: '12', isCompound: false, defaultRestSec: 75 },
      { id: 'ex-c7', name: 'Triceps extensions', plannedSets: 2, deloadSets: 1, repTarget: '12', isCompound: false, defaultRestSec: 75 },
      { id: 'ex-c8', name: 'Cable crunches', plannedSets: 3, deloadSets: 2, repTarget: '15', isCompound: false, defaultRestSec: 60 }
    ]
  },
  'gym-assessment': {
    id: 'gym-assessment',
    name: 'Moderate full-body gym session (Final Assessment)',
    dayLabel: 'Monday, 4 Jan',
    description: 'Moderate consolidation session (~35% reduced volume, 2–3 RIR). Do not train to exhaustion.',
    exercises: [
      { id: 'ex-f1', name: 'Barbell bench press', plannedSets: 2, deloadSets: 2, repTarget: '8–10', isCompound: true, defaultRestSec: 150 },
      { id: 'ex-f2', name: 'Lat pulldown', plannedSets: 2, deloadSets: 2, repTarget: '10–12', isCompound: true, defaultRestSec: 120 },
      { id: 'ex-f3', name: 'Squat', plannedSets: 2, deloadSets: 2, repTarget: '8–10', isCompound: true, defaultRestSec: 150 },
      { id: 'ex-f4', name: 'Dumbbell shoulder press', plannedSets: 2, deloadSets: 2, repTarget: '10', isCompound: true, defaultRestSec: 120 },
      { id: 'ex-f5', name: 'Seated cable row', plannedSets: 2, deloadSets: 2, repTarget: '10–12', isCompound: true, defaultRestSec: 120 },
      { id: 'ex-f6', name: 'Plank', plannedSets: 2, deloadSets: 2, repTarget: '40–60 seconds', isCompound: false, isTimed: true, defaultRestSec: 60 }
    ]
  }
};

const DEFAULT_RUNNING_PLAN = [
  {
    weekNumber: 1,
    easyKm: 4,
    easyLabel: '4 km',
    qualityLabel: '4 × 2 min fast',
    qualityType: 'interval',
    qualityEstimatedKm: 4.5,
    qualityDetails: '10-min easy warm-up + 4 × 2 min fast (effort 8/10) with 2 min easy jog/walk recovery + 10-min cool-down.',
    longKm: 7,
    longLabel: '7 km'
  },
  {
    weekNumber: 2,
    easyKm: 5,
    easyLabel: '5 km',
    qualityLabel: '5 × 2 min fast',
    qualityType: 'interval',
    qualityEstimatedKm: 5.0,
    qualityDetails: '10-min easy warm-up + 5 × 2 min fast (effort 8/10) with 2 min easy jog/walk recovery + 10-min cool-down.',
    longKm: 8,
    longLabel: '8 km'
  },
  {
    weekNumber: 3,
    easyKm: 5,
    easyLabel: '5 km',
    qualityLabel: '3 × 5 min tempo',
    qualityType: 'tempo',
    qualityEstimatedKm: 5.5,
    qualityDetails: '10-min easy warm-up + 3 × 5 min tempo (comfortably hard, effort 7/10) with 2 min easy jog recovery + 10-min cool-down.',
    longKm: 9,
    longLabel: '9 km'
  },
  {
    weekNumber: 4,
    easyKm: 5,
    easyLabel: '5 km',
    qualityLabel: '5 × 3 min fast',
    qualityType: 'interval',
    qualityEstimatedKm: 5.5,
    qualityDetails: '10-min easy warm-up + 5 × 3 min fast (controlled hard effort 8/10) with 2 min easy jog/walk recovery + 10-min cool-down.',
    longKm: 10,
    longLabel: '10 km'
  },
  {
    weekNumber: 5,
    easyKm: 6,
    easyLabel: '6 km',
    qualityLabel: '3 × 6 min tempo',
    qualityType: 'tempo',
    qualityEstimatedKm: 6.0,
    qualityDetails: '10-min easy warm-up + 3 × 6 min tempo (comfortably hard, effort 7/10) with 2 min easy jog recovery + 10-min cool-down.',
    longKm: 11,
    longLabel: '10–12 km'
  },
  {
    weekNumber: 6,
    easyKm: 4,
    easyLabel: '4 km',
    qualityLabel: '4 × 2 min controlled',
    qualityType: 'interval',
    qualityEstimatedKm: 4.0,
    qualityDetails: 'Week 6 consolidation: 10-min easy warm-up + 4 × 2 min controlled rhythm (effort 6–7/10) with full recovery + 10-min cool-down.',
    longKm: 7.5,
    longLabel: '7–8 km'
  }
];

const DEFAULT_HABITS = [
  {
    id: 'habit-protein',
    title: 'Hit protein target (140–160 g range around 150 g target)',
    category: 'core',
    active: true,
    autoRule: 'protein'
  },
  {
    id: 'habit-calories',
    title: 'Stay reasonably close to calorie target',
    category: 'core',
    active: true,
    autoRule: 'calories'
  },
  {
    id: 'habit-workout',
    title: 'Complete the scheduled workout, or record a planned rest day',
    category: 'core',
    active: true,
    autoRule: 'workout'
  },
  {
    id: 'habit-steps',
    title: 'Reach an appropriate step target (8,000–10,000)',
    category: 'core',
    active: true,
    autoRule: 'steps'
  },
  {
    id: 'habit-water',
    title: 'Drink enough water (2.5–3.5 L)',
    category: 'core',
    active: true,
    autoRule: 'water'
  },
  {
    id: 'habit-sleep',
    title: 'Get sufficient sleep (7.5–9 hours)',
    category: 'core',
    active: true,
    autoRule: 'sleep'
  },
  {
    id: 'habit-weight',
    title: 'Record morning body weight',
    category: 'core',
    active: true,
    autoRule: 'weight'
  },
  // Additional optional habits from Section 8
  {
    id: 'habit-mobility',
    title: '5–10 minutes mobility',
    category: 'optional',
    active: true,
    autoRule: null
  },
  {
    id: 'habit-clothes',
    title: 'Prepare gym/running clothes',
    category: 'optional',
    active: true,
    autoRule: null
  },
  {
    id: 'habit-meals-logged',
    title: 'Log all meals',
    category: 'optional',
    active: true,
    autoRule: 'meals'
  },
  {
    id: 'habit-stretch',
    title: 'Stretch or cool down after training',
    category: 'optional',
    active: true,
    autoRule: null
  }
];

const DEFAULT_MEAL_PRESETS = [
  {
    id: 'preset-whey',
    name: 'Whey Protein Shake (1 scoop)',
    caloriesKcal: 120,
    proteinG: 24,
    carbohydrateG: 3,
    fatG: 1.5
  },
  {
    id: 'preset-eggs',
    name: '2 Whole Eggs + 3 Egg Whites',
    caloriesKcal: 195,
    proteinG: 23,
    carbohydrateG: 1,
    fatG: 10
  },
  {
    id: 'preset-chicken',
    name: 'Grilled Chicken Breast (150g cooked)',
    caloriesKcal: 248,
    proteinG: 46,
    carbohydrateG: 0,
    fatG: 5.4
  },
  {
    id: 'preset-yogurt',
    name: 'High-Protein Greek Yogurt / Skyr (200g)',
    caloriesKcal: 130,
    proteinG: 20,
    carbohydrateG: 8,
    fatG: 2
  },
  {
    id: 'preset-paneer-tofu',
    name: 'Low-fat Paneer / Firm Tofu (150g)',
    caloriesKcal: 210,
    proteinG: 24,
    carbohydrateG: 4,
    fatG: 11
  },
  {
    id: 'preset-dal-rice',
    name: 'Cooked Rice (150g) + Dal Bowl',
    caloriesKcal: 375,
    proteinG: 14,
    carbohydrateG: 68,
    fatG: 4.5
  },
  {
    id: 'preset-oats',
    name: 'Oats (60g) + Milk + Berries',
    caloriesKcal: 340,
    proteinG: 14,
    carbohydrateG: 54,
    fatG: 7
  }
];

const GYM_GUIDANCE_ITEMS = [
  'Warm up for 5–10 minutes before starting working sets.',
  'Keep approximately 2 repetitions in reserve (2 RIR / RPE 8) on most working sets.',
  'Rest 2–3 minutes on compound lifts and 60–90 seconds on isolation work.',
  'Increase load gradually only when the top of the rep range is completed with good technique.',
  'Reduce lower-body volume if running fatigue is interfering with recovery.',
  'Do not train through persistent pain.'
];

const RUNNING_EFFORT_GUIDANCE = [
  { type: 'Easy', effort: '3–4 / 10', description: 'Conversational pace; you can speak in full sentences comfortably.' },
  { type: 'Tempo', effort: '7 / 10', description: 'Comfortably hard sustained rhythm; short phrases only.' },
  { type: 'Intervals', effort: '8 / 10', description: 'Controlled hard effort with easy jog/walk recovery; not all-out sprinting.' }
];

const PROGRESS_RULES = [
  'A gradual trend around 0.4–0.7 kg per week was the initial working range, not a guaranteed outcome.',
  'Review after 14 days rather than reacting to a few daily readings.',
  'If weight is falling very quickly and recovery is poor, reassess intake and training.',
  'If there is no downward trend for two consecutive weeks despite consistent logging, review tracking accuracy and activity before making a small adjustment.',
  'Calories are never automatically reduced by the app; any target adjustment requires your explicit confirmation.'
];

const RECOVERY_AND_SAFETY_NOTES = {
  reminders: [
    'Sleep target: 7.5–9 hours per night.',
    'Take one full recovery and mobility day each week (Saturday by default).',
    'Hydration target: approximately 2.5–3.5 L/day, adjusted for heat, sweat and individual needs.',
    'Daily steps target: 8,000–10,000 as a flexible guide.',
    'Avoid forcing steps or workouts when unusually fatigued or under-recovered.',
    'Stop exercise immediately and seek appropriate medical advice for concerning symptoms such as chest pain, fainting, unusual breathlessness or persistent injury pain.'
  ],
  supplements: [
    'Whey protein can help meet daily protein needs conveniently, but is not essential if whole-food protein is sufficient.',
    'Creatine monohydrate (3–5 g/day) is optional for healthy adults; users with relevant medical concerns should consult a clinician.',
    'Caffeine is optional and should be limited if it affects sleep quality or causes jitteriness/side effects.',
    'Electrolytes may be useful for longer runs or particularly hot/sweaty sessions.',
    'Do not use "fat burners" — they are unnecessary and often carry side effects.'
  ]
};


// --- js/store.js ---
// Local Storage + IndexedDB State Management & Domain Logic


const STORAGE_KEY = 'fitness_cut_tracker_state_v1';
const IDB_NAME = 'FitnessCutTrackerDB';
const IDB_STORE = 'stateStore';

const FIREBASE_CONFIG = {
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

function getCloudSyncStatus() {
  return { status: cloudSyncStatus, lastSyncedAt: lastCloudSyncTime };
}

async function initFirebaseCloudSync(currentState, onRemoteDataLoaded, onStatusChange) {
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

async function pushStateToCloudNow(state) {
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

async function pullStateFromCloudNow(syncKey = 'abhin-cut-tracker-default') {
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

function createInitialState() {
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

function loadState() {
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

function mergeWithDefaults(parsed) {
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

function saveState(state) {
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

function resetAllData() {
  const fresh = createInitialState();
  saveState(fresh);
  return fresh;
}

// Phase lookup for any date
function getPhaseForDate(state, dateStr) {
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
function getBasePlanForDate(state, dateStr) {
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

function getPlannedSessionForDate(state, dateStr) {
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
function rescheduleSession(state, sourceDate, targetDate, mode = 'swap') {
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
function getOrCreateWorkoutSession(state, dateStr, optionalTemplateId = null) {
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
function getLastUsedExercisePerformance(state, exerciseName, excludeDateStr = null) {
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
function calculatePace(distanceKm, durationSeconds) {
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

function formatDurationHms(durationSeconds) {
  const total = Math.max(0, Math.round(Number(durationSeconds) || 0));
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function parseDurationInput(minutesVal, secondsVal, hoursVal = 0) {
  const h = Math.max(0, Number(hoursVal) || 0);
  const m = Math.max(0, Number(minutesVal) || 0);
  const s = Math.max(0, Number(secondsVal) || 0);
  return Math.round(h * 3600 + m * 60 + s);
}

// Get or create DailyLog for a date
function getDailyLog(state, dateStr) {
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

function saveDailyLog(state, dateStr, updates) {
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

function addNutritionEntry(state, dateStr, entry) {
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

function deleteNutritionEntry(state, dateStr, entryId) {
  const log = getDailyLog(state, dateStr);
  if (!Array.isArray(log.entries)) return log;
  log.entries = log.entries.filter(e => e.id !== entryId);
  recalculateDailyTotalsFromEntries(log);
  state.dailyLogs[dateStr] = log;
  saveState(state);
  return log;
}

function recalculateDailyTotalsFromEntries(log) {
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
function getWeightTrendSummary(state, referenceDateStr) {
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
function getNutritionSummary(state, dateStr) {
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
function getHabitStatusForDate(state, dateStr) {
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

function toggleHabitForDate(state, dateStr, habitId, explicitValue = null) {
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
function getWeeklyTrainingSummary(state, dateStr) {
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
function getNextSessionAfter(state, dateStr) {
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
function exportStateAsJson(state) {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: '6-Week Fitness Cut & Training Tracker',
    state
  };
  return JSON.stringify(payload, null, 2);
}

// CSV Export generator
function generateCsvExport(state, exportType = 'daily') {
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


// --- js/charts.js ---
// Accessible, responsive SVG Chart Renderers for all 6 Progress Charts



function renderEmptyChartState(title, message, icon = '📊', actionHtml = '') {
  return `
    <div class="chart-empty-state" role="status">
      <span class="chart-empty-icon" aria-hidden="true">${icon}</span>
      <p class="chart-empty-title">${escapeHtml(title)}</p>
      <p class="chart-empty-sub">${escapeHtml(message)}</p>
      ${actionHtml ? `<div style="margin-top:8px;">${actionHtml}</div>` : ''}
    </div>
  `;
}

// 1. Daily Weight Points & 7-Day Rolling Average
function renderWeightChartSvg(state) {
  const trend = getWeightTrendSummary(state, '2099-12-31');
  const series = trend.series;
  if (!series || series.length === 0) {
    return renderEmptyChartState(
      'No weight entries logged yet',
      'Log your morning body weight on the Dashboard, Quick Log, or Progress tab to view daily points and your 7-day rolling average.',
      '⚖️',
      `<button type="button" class="btn-secondary btn-sm" data-action="open-quick-log">+ Log Morning Weight</button>`
    );
  }

  const w = 640;
  const h = 260;
  const pad = { top: 24, right: 28, bottom: 42, left: 54 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const targetMin = Number(state.userSettings.targetWeightMinKg) || 71;
  const targetMax = Number(state.userSettings.targetWeightMaxKg) || 73;
  const allVals = [
    ...series.map(d => d.weightKg),
    ...series.map(d => d.rollingAvgKg),
    targetMin,
    targetMax
  ].filter(v => v > 0);

  const minY = Math.floor(Math.min(...allVals) - 1.0);
  const maxY = Math.ceil(Math.max(...allVals) + 1.0);
  const rangeY = Math.max(2, maxY - minY);

  const xPos = (idx) => series.length === 1
    ? pad.left + plotW / 2
    : pad.left + (idx / (series.length - 1)) * plotW;
  const yPos = (val) => pad.top + plotH - ((val - minY) / rangeY) * plotH;

  const gridSteps = 4;
  let gridHtml = '';
  for (let i = 0; i <= gridSteps; i++) {
    const val = minY + (rangeY * i) / gridSteps;
    const y = yPos(val);
    gridHtml += `
      <line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" class="chart-grid-line" />
      <text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" class="chart-axis-text">${val.toFixed(1)} kg</text>
    `;
  }

  const bandTop = yPos(Math.min(maxY, targetMax));
  const bandBottom = yPos(Math.max(minY, targetMin));
  const bandHeight = Math.max(0, bandBottom - bandTop);

  const avgPoints = series.map((pt, i) => `${xPos(i)},${yPos(pt.rollingAvgKg)}`).join(' ');
  const areaPoints = series.length > 1
    ? `${xPos(0)},${pad.top + plotH} ${avgPoints} ${xPos(series.length - 1)},${pad.top + plotH}`
    : '';

  const labelIndexes = new Set([0, Math.floor((series.length - 1) / 2), series.length - 1]);
  let xLabelsHtml = '';
  labelIndexes.forEach(idx => {
    if (series[idx]) {
      xLabelsHtml += `<text x="${xPos(idx)}" y="${h - 12}" text-anchor="middle" class="chart-axis-text">${formatShortDate(series[idx].date)}</text>`;
    }
  });

  let dotsHtml = '';
  series.forEach((pt, i) => {
    const cx = xPos(i);
    const cyRaw = yPos(pt.weightKg);
    const cyAvg = yPos(pt.rollingAvgKg);
    dotsHtml += `
      <circle cx="${cx}" cy="${cyRaw}" r="4.5" class="chart-dot-raw">
        <title>${pt.date}: ${pt.weightKg} kg (Daily reading)</title>
      </circle>
      <circle cx="${cx}" cy="${cyAvg}" r="4" class="chart-dot-avg">
        <title>${pt.date}: ${pt.rollingAvgKg} kg (7-day rolling avg)</title>
      </circle>
    `;
  });

  return `
    <div class="svg-chart-wrapper">
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-swatch swatch-raw"></span> Daily Scale Weight (kg)</span>
        <span class="legend-item"><span class="legend-swatch swatch-avg"></span> 7-Day Rolling Average (kg)</span>
        <span class="legend-item"><span class="legend-swatch swatch-band"></span> Provisional Goal Range (${targetMin}–${targetMax} kg)</span>
      </div>
      <svg viewBox="0 0 ${w} ${h}" class="responsive-svg-chart" role="img" aria-label="Body weight and 7-day rolling average chart">
        <title>Daily Body Weight & 7-Day Rolling Average</title>
        <defs>
          <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.28" />
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        ${bandHeight > 0 ? `<rect x="${pad.left}" y="${bandTop}" width="${plotW}" height="${bandHeight}" class="chart-goal-band" />` : ''}
        ${gridHtml}
        ${series.length > 1 ? `<polygon points="${areaPoints}" fill="url(#weightAreaGrad)" />` : ''}
        ${series.length > 1 ? `<polyline fill="none" points="${avgPoints}" class="chart-line-avg" />` : ''}
        ${dotsHtml}
        ${xLabelsHtml}
      </svg>
    </div>
  `;
}

// 2. Waist Measurement Over Time
function renderWaistChartSvg(state) {
  const entries = Object.values(state.measurementLogs)
    .filter(m => m && m.waistCm !== null && m.waistCm !== undefined && m.waistCm !== '' && Number(m.waistCm) > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (entries.length === 0) {
    return renderEmptyChartState(
      'No waist measurements logged yet',
      'Record your weekly waist measurement (cm) in the Body Measurements card to track circumference reduction over time.',
      '📏'
    );
  }

  const w = 640;
  const h = 240;
  const pad = { top: 24, right: 28, bottom: 42, left: 54 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const vals = entries.map(e => Number(e.waistCm));
  const minY = Math.floor(Math.min(...vals) - 2);
  const maxY = Math.ceil(Math.max(...vals) + 2);
  const rangeY = Math.max(4, maxY - minY);

  const xPos = (idx) => entries.length === 1
    ? pad.left + plotW / 2
    : pad.left + (idx / (entries.length - 1)) * plotW;
  const yPos = (val) => pad.top + plotH - ((val - minY) / rangeY) * plotH;

  let gridHtml = '';
  for (let i = 0; i <= 4; i++) {
    const val = minY + (rangeY * i) / 4;
    const y = yPos(val);
    gridHtml += `
      <line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" class="chart-grid-line" />
      <text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" class="chart-axis-text">${val.toFixed(1)} cm</text>
    `;
  }

  const pts = entries.map((e, i) => `${xPos(i)},${yPos(Number(e.waistCm))}`).join(' ');
  const areaPts = entries.length > 1
    ? `${xPos(0)},${pad.top + plotH} ${pts} ${xPos(entries.length - 1)},${pad.top + plotH}`
    : '';

  let dotsHtml = '';
  entries.forEach((e, i) => {
    const cx = xPos(i);
    const cy = yPos(Number(e.waistCm));
    dotsHtml += `
      <circle cx="${cx}" cy="${cy}" r="5" class="chart-dot-waist">
        <title>${e.date}: Waist ${e.waistCm} cm</title>
      </circle>
      <text x="${cx}" y="${cy - 10}" text-anchor="middle" class="chart-value-label">${Number(e.waistCm).toFixed(1)}</text>
    `;
  });

  const labelIndexes = new Set([0, Math.floor((entries.length - 1) / 2), entries.length - 1]);
  let xLabelsHtml = '';
  labelIndexes.forEach(idx => {
    if (entries[idx]) {
      xLabelsHtml += `<text x="${xPos(idx)}" y="${h - 12}" text-anchor="middle" class="chart-axis-text">${formatShortDate(entries[idx].date)}</text>`;
    }
  });

  return `
    <div class="svg-chart-wrapper">
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-swatch swatch-waist"></span> Waist Circumference (cm)</span>
      </div>
      <svg viewBox="0 0 ${w} ${h}" class="responsive-svg-chart" role="img" aria-label="Waist measurement over time chart">
        <title>Waist Measurement Over Time (cm)</title>
        <defs>
          <linearGradient id="waistAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.24" />
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        ${gridHtml}
        ${entries.length > 1 ? `<polygon points="${areaPts}" fill="url(#waistAreaGrad)" />` : ''}
        ${entries.length > 1 ? `<polyline fill="none" points="${pts}" class="chart-line-waist" />` : ''}
        ${dotsHtml}
        ${xLabelsHtml}
      </svg>
    </div>
  `;
}

// 3. Calories and Protein by Day
function renderNutritionChartSvg(state) {
  const entries = Object.values(state.dailyLogs)
    .filter(d => d && (Number(d.caloriesKcal) > 0 || Number(d.proteinG) > 0))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  if (entries.length === 0) {
    return renderEmptyChartState(
      'No nutrition days logged yet',
      'Log your daily calories and protein in the Nutrition tab to compare daily intake against your 2,100 kcal and 150 g protein targets.',
      '🥗',
      `<button type="button" class="btn-secondary btn-sm" data-nav-trigger="nutrition">Go to Nutrition Logger →</button>`
    );
  }

  const w = 640;
  const h = 260;
  const pad = { top: 24, right: 48, bottom: 42, left: 54 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const calTarget = Number(state.userSettings.calorieTarget) || 2100;
  const proTarget = Number(state.userSettings.proteinTargetG) || 150;

  const maxCal = Math.max(calTarget * 1.25, ...entries.map(e => Number(e.caloriesKcal) || 0), 2600);
  const maxPro = Math.max(proTarget * 1.35, ...entries.map(e => Number(e.proteinG) || 0), 200);

  const yCal = (val) => pad.top + plotH - (Math.min(val, maxCal) / maxCal) * plotH;
  const yPro = (val) => pad.top + plotH - (Math.min(val, maxPro) / maxPro) * plotH;

  const slotW = plotW / entries.length;
  const barW = Math.min(28, Math.max(8, slotW * 0.45));

  let barsHtml = '';
  let proPts = [];

  entries.forEach((e, i) => {
    const cx = pad.left + slotW * i + slotW / 2;
    const cal = Number(e.caloriesKcal) || 0;
    const pro = Number(e.proteinG) || 0;
    const barTop = yCal(cal);
    const barH = Math.max(2, pad.top + plotH - barTop);

    const py = yPro(pro);
    proPts.push(`${cx},${py}`);

    barsHtml += `
      <rect x="${cx - barW / 2}" y="${barTop}" width="${barW}" height="${barH}" rx="4" class="chart-bar-cal">
        <title>${e.date}: ${cal} kcal / ${pro}g protein</title>
      </rect>
      <circle cx="${cx}" cy="${py}" r="4.5" class="chart-dot-pro">
        <title>${e.date}: ${pro} g protein (Target: ${proTarget} g)</title>
      </circle>
    `;
    if (entries.length <= 8 || i % 2 === 0 || i === entries.length - 1) {
      barsHtml += `<text x="${cx}" y="${h - 12}" text-anchor="middle" class="chart-axis-text">${formatShortDate(e.date)}</text>`;
    }
  });

  const calTargetY = yCal(calTarget);
  const proTargetY = yPro(proTarget);

  return `
    <div class="svg-chart-wrapper">
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-swatch swatch-cal"></span> Daily Calories (kcal, target ${calTarget})</span>
        <span class="legend-item"><span class="legend-swatch swatch-pro"></span> Daily Protein (g, target ${proTarget}g)</span>
      </div>
      <svg viewBox="0 0 ${w} ${h}" class="responsive-svg-chart" role="img" aria-label="Daily calories and protein chart">
        <title>Daily Calories and Protein vs Targets</title>
        <line x1="${pad.left}" y1="${calTargetY}" x2="${w - pad.right}" y2="${calTargetY}" class="chart-target-line-cal" />
        <text x="${pad.left - 6}" y="${calTargetY + 4}" text-anchor="end" class="chart-axis-text">${calTarget} kcal</text>
        <line x1="${pad.left}" y1="${proTargetY}" x2="${w - pad.right}" y2="${proTargetY}" class="chart-target-line-pro" />
        <text x="${w - pad.right + 6}" y="${proTargetY + 4}" text-anchor="start" class="chart-axis-text">${proTarget}g P</text>
        ${barsHtml}
        ${proPts.length > 1 ? `<polyline fill="none" points="${proPts.join(' ')}" class="chart-line-pro" />` : ''}
      </svg>
    </div>
  `;
}

// 4. Weekly Running Distance
function renderWeeklyRunningChartSvg(state) {
  const weeks = state.runningPlan.map((rw, idx) => {
    const phase = PROGRAMME_PHASES[idx] || { startDate: addDays('2026-11-23', idx * 7), endDate: addDays('2026-11-29', idx * 7) };
    const plannedKm = Math.round(((Number(rw.easyKm) || 0) + (Number(rw.qualityEstimatedKm) || 0) + (Number(rw.longKm) || 0)) * 10) / 10;
    const actualKm = state.runLogs
      .filter(r => r.date >= phase.startDate && r.date <= phase.endDate && r.status !== 'skipped')
      .reduce((sum, r) => sum + (Number(r.distanceKm) || 0), 0);
    return {
      label: `W${rw.weekNumber}`,
      plannedKm,
      actualKm: Math.round(actualKm * 10) / 10
    };
  });

  const outOfPhaseRuns = state.runLogs.filter(r => r.date < '2026-11-23' || r.date > '2027-01-03');
  if (outOfPhaseRuns.length > 0) {
    const extraKm = outOfPhaseRuns.reduce((s, r) => s + (Number(r.distanceKm) || 0), 0);
    weeks.unshift({
      label: 'Prep/Other',
      plannedKm: Number(state.userSettings.currentWeeklyRunKm) || 12,
      actualKm: Math.round(extraKm * 10) / 10
    });
  }

  const w = 640;
  const h = 250;
  const pad = { top: 26, right: 24, bottom: 42, left: 48 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const maxKm = Math.ceil(Math.max(25, ...weeks.map(x => Math.max(x.plannedKm, x.actualKm))) + 2);
  const yPos = (val) => pad.top + plotH - (val / maxKm) * plotH;

  let gridHtml = '';
  for (let i = 0; i <= 4; i++) {
    const val = Math.round((maxKm * i) / 4);
    const y = yPos(val);
    gridHtml += `
      <line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" class="chart-grid-line" />
      <text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" class="chart-axis-text">${val} km</text>
    `;
  }

  const slotW = plotW / weeks.length;
  const barW = Math.min(22, slotW * 0.32);

  let barsHtml = '';
  weeks.forEach((wk, i) => {
    const cx = pad.left + slotW * i + slotW / 2;
    const yPlan = yPos(wk.plannedKm);
    const hPlan = Math.max(2, pad.top + plotH - yPlan);
    const yAct = yPos(wk.actualKm);
    const hAct = Math.max(2, pad.top + plotH - yAct);

    barsHtml += `
      <rect x="${cx - barW - 2}" y="${yPlan}" width="${barW}" height="${hPlan}" rx="4" class="chart-bar-planned">
        <title>${wk.label} Planned: ${wk.plannedKm} km</title>
      </rect>
      <rect x="${cx + 2}" y="${yAct}" width="${barW}" height="${hAct}" rx="4" class="chart-bar-actual">
        <title>${wk.label} Logged: ${wk.actualKm} km</title>
      </rect>
      <text x="${cx + 2 + barW / 2}" y="${yAct - 6}" text-anchor="middle" class="chart-value-label">${wk.actualKm > 0 ? wk.actualKm : ''}</text>
      <text x="${cx}" y="${h - 12}" text-anchor="middle" class="chart-axis-text">${wk.label}</text>
    `;
  });

  return `
    <div class="svg-chart-wrapper">
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-swatch swatch-planned"></span> Provisional Planned Distance (km)</span>
        <span class="legend-item"><span class="legend-swatch swatch-actual"></span> Logged Weekly Distance (km)</span>
      </div>
      <svg viewBox="0 0 ${w} ${h}" class="responsive-svg-chart" role="img" aria-label="Weekly running distance chart">
        <title>Weekly Running Distance (km)</title>
        ${gridHtml}
        ${barsHtml}
      </svg>
    </div>
  `;
}

// 5. Gym Exercise Load / Performance History
function renderGymLoadChartSvg(state, selectedExerciseName = 'Barbell bench press') {
  const target = (selectedExerciseName || 'Barbell bench press').trim().toLowerCase();
  const points = [];

  const sortedDates = Object.keys(state.workoutSessions).sort();
  for (const d of sortedDates) {
    const ws = state.workoutSessions[d];
    if (!ws || !Array.isArray(ws.exercises)) continue;
    for (const ex of ws.exercises) {
      if ((ex.exerciseName || '').trim().toLowerCase() === target) {
        const completedSets = (ex.sets || []).filter(s => s.completed);
        if (completedSets.length > 0) {
          const topWeight = Math.max(...completedSets.map(s => Number(s.weightKg) || 0));
          const totalReps = completedSets.reduce((acc, s) => acc + (Number(s.reps) || 0), 0);
          points.push({
            date: d,
            topWeightKg: topWeight,
            totalReps,
            setsCount: completedSets.length
          });
        }
      }
    }
  }

  if (points.length === 0) {
    return renderEmptyChartState(
      `No completed sets logged for "${selectedExerciseName}" yet`,
      'Complete and check off working sets in the Workout tab to track load progression and volume history for this lift.',
      '🏋️',
      `<button type="button" class="btn-secondary btn-sm" data-nav-trigger="workout">Open Gym Logger →</button>`
    );
  }

  const w = 640;
  const h = 240;
  const pad = { top: 26, right: 28, bottom: 42, left: 54 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const vals = points.map(p => p.topWeightKg);
  const minY = Math.max(0, Math.floor(Math.min(...vals) - 5));
  const maxY = Math.ceil(Math.max(...vals) + 5);
  const rangeY = Math.max(10, maxY - minY);

  const xPos = (idx) => points.length === 1
    ? pad.left + plotW / 2
    : pad.left + (idx / (points.length - 1)) * plotW;
  const yPos = (val) => pad.top + plotH - ((val - minY) / rangeY) * plotH;

  let gridHtml = '';
  for (let i = 0; i <= 4; i++) {
    const val = minY + (rangeY * i) / 4;
    const y = yPos(val);
    gridHtml += `
      <line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" class="chart-grid-line" />
      <text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" class="chart-axis-text">${Math.round(val)} kg</text>
    `;
  }

  const polyPts = points.map((p, i) => `${xPos(i)},${yPos(p.topWeightKg)}`).join(' ');
  const areaPts = points.length > 1
    ? `${xPos(0)},${pad.top + plotH} ${polyPts} ${xPos(points.length - 1)},${pad.top + plotH}`
    : '';

  let dotsHtml = '';
  points.forEach((p, i) => {
    const cx = xPos(i);
    const cy = yPos(p.topWeightKg);
    dotsHtml += `
      <circle cx="${cx}" cy="${cy}" r="5" class="chart-dot-gym">
        <title>${p.date}: ${p.topWeightKg} kg (${p.setsCount} sets, ${p.totalReps} total reps)</title>
      </circle>
      <text x="${cx}" y="${cy - 10}" text-anchor="middle" class="chart-value-label">${p.topWeightKg}kg</text>
      <text x="${cx}" y="${h - 12}" text-anchor="middle" class="chart-axis-text">${formatShortDate(p.date)}</text>
    `;
  });

  return `
    <div class="svg-chart-wrapper">
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-swatch swatch-gym"></span> Top Working Set Load (${escapeHtml(selectedExerciseName)}, kg)</span>
      </div>
      <svg viewBox="0 0 ${w} ${h}" class="responsive-svg-chart" role="img" aria-label="Gym exercise load progression chart">
        <title>Load History for ${escapeHtml(selectedExerciseName)}</title>
        <defs>
          <linearGradient id="gymAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.26" />
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        ${gridHtml}
        ${points.length > 1 ? `<polygon points="${areaPts}" fill="url(#gymAreaGrad)" />` : ''}
        ${points.length > 1 ? `<polyline fill="none" points="${polyPts}" class="chart-line-gym" />` : ''}
        ${dotsHtml}
      </svg>
    </div>
  `;
}

// 6. Habit Completion by Week
function renderHabitWeeklyChartSvg(state) {
  const weekBuckets = PROGRAMME_PHASES.slice(0, 6).map(phase => {
    let totalPct = 0;
    let daysCount = 0;
    for (let i = 0; i < 7; i++) {
      const d = addDays(phase.startDate, i);
      const status = getHabitStatusForDate(state, d);
      if (status.completedCount > 0 || state.habitLogs[d] || state.dailyLogs[d]) {
        totalPct += status.completionPct;
        daysCount++;
      }
    }
    const avgPct = daysCount > 0 ? Math.round(totalPct / daysCount) : 0;
    return {
      label: `W${phase.weekNumber}`,
      avgPct,
      daysCount
    };
  });

  const preDays = Object.keys(state.habitLogs).filter(d => d < '2026-11-23');
  if (preDays.length > 0) {
    const sum = preDays.reduce((acc, d) => acc + getHabitStatusForDate(state, d).completionPct, 0);
    weekBuckets.unshift({
      label: 'Prep',
      avgPct: Math.round(sum / preDays.length),
      daysCount: preDays.length
    });
  }

  const w = 640;
  const h = 230;
  const pad = { top: 24, right: 24, bottom: 40, left: 48 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const yPos = (pct) => pad.top + plotH - (pct / 100) * plotH;

  let gridHtml = '';
  [0, 25, 50, 75, 100].forEach(pct => {
    const y = yPos(pct);
    gridHtml += `
      <line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" class="chart-grid-line" />
      <text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" class="chart-axis-text">${pct}%</text>
    `;
  });

  const slotW = plotW / weekBuckets.length;
  const barW = Math.min(34, slotW * 0.5);

  let barsHtml = '';
  weekBuckets.forEach((b, i) => {
    const cx = pad.left + slotW * i + slotW / 2;
    const y = yPos(b.avgPct);
    const bh = Math.max(3, pad.top + plotH - y);
    barsHtml += `
      <rect x="${cx - barW / 2}" y="${y}" width="${barW}" height="${bh}" rx="4" class="chart-bar-habit">
        <title>${b.label}: ${b.avgPct}% average completion (${b.daysCount} active days)</title>
      </rect>
      <text x="${cx}" y="${y - 6}" text-anchor="middle" class="chart-value-label">${b.avgPct}%</text>
      <text x="${cx}" y="${h - 12}" text-anchor="middle" class="chart-axis-text">${b.label}</text>
    `;
  });

  return `
    <div class="svg-chart-wrapper">
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-swatch swatch-habit"></span> Weekly Habit Consistency (%)</span>
      </div>
      <svg viewBox="0 0 ${w} ${h}" class="responsive-svg-chart" role="img" aria-label="Habit completion by week chart">
        <title>Habit Completion by Week (%)</title>
        ${gridHtml}
        ${barsHtml}
      </svg>
    </div>
  `;
}


// --- js/app.js ---
// Main Application Controller & View Renderers






let appState = loadState();
let currentView = 'dashboard';
let calendarViewMode = 'week'; // 'week' | 'month'
let calendarMonthCursor = '2026-11-01'; // Used for month view navigation
let selectedChartExercise = 'Barbell bench press';
let editingRunId = null;

// Rest timer state
let restTimerInterval = null;
let restSecondsRemaining = 0;

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 3200);
}

function downloadFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 150);
}

// Theme Handling
function applyTheme(theme) {
  const cleanTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', cleanTheme);
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = cleanTheme === 'dark' ? '☀️' : '🌙';
  }
}

// Rest Timer Functions
function startRestTimer(seconds) {
  if (restTimerInterval) clearInterval(restTimerInterval);
  restSecondsRemaining = Math.max(1, Number(seconds) || 90);
  updateRestTimerUi();

  const popover = document.getElementById('rest-timer-popover');
  if (popover) popover.classList.add('hidden');

  restTimerInterval = setInterval(() => {
    restSecondsRemaining--;
    if (restSecondsRemaining <= 0) {
      clearInterval(restTimerInterval);
      restTimerInterval = null;
      restSecondsRemaining = 0;
      updateRestTimerUi();
      showToast('⏱️ Rest complete! Ready for your next set.');
    } else {
      updateRestTimerUi();
    }
  }, 1000);
}

function stopRestTimer() {
  if (restTimerInterval) {
    clearInterval(restTimerInterval);
    restTimerInterval = null;
  }
  restSecondsRemaining = 0;
  updateRestTimerUi();
}

function updateRestTimerUi() {
  const display = document.getElementById('rest-timer-display');
  const btn = document.getElementById('btn-toggle-timer-menu');
  if (!display || !btn) return;
  if (restSecondsRemaining > 0) {
    const m = Math.floor(restSecondsRemaining / 60);
    const s = String(restSecondsRemaining % 60).padStart(2, '0');
    display.textContent = `${m}:${s}`;
    btn.classList.add('timer-active');
  } else {
    display.textContent = 'Rest Timer';
    btn.classList.remove('timer-active');
  }
}

// Category & Status Badge Helpers (Accessible: Icon + Text + Border)
function renderCategoryBadge(category, isAssessment = false) {
  if (isAssessment) {
    return `<span class="badge badge-assess"><span aria-hidden="true">🎯</span> Assessment</span>`;
  }
  switch (category) {
    case 'gym':
      return `<span class="badge badge-gym"><span aria-hidden="true">🏋️</span> Gym</span>`;
    case 'run':
      return `<span class="badge badge-run"><span aria-hidden="true">🏃</span> Run</span>`;
    case 'rest':
    default:
      return `<span class="badge badge-rest"><span aria-hidden="true">🧘</span> Recovery</span>`;
  }
}

function renderStatusBadge(status) {
  switch (status) {
    case 'completed':
      return `<span class="badge badge-completed"><span aria-hidden="true">✓</span> Completed</span>`;
    case 'modified':
      return `<span class="badge badge-modified"><span aria-hidden="true">✎</span> Modified</span>`;
    case 'skipped':
      return `<span class="badge badge-skipped"><span aria-hidden="true">⏭</span> Skipped</span>`;
    case 'planned':
    default:
      return `<span class="badge badge-planned"><span aria-hidden="true">○</span> Planned</span>`;
  }
}

// Global Header & Navigation Sync
function syncHeaderAndNavigation() {
  const dateInput = document.getElementById('global-date-input');
  const dateHuman = document.getElementById('global-date-human');
  const phaseBadge = document.getElementById('global-phase-badge');
  const progRange = document.getElementById('header-programme-range');
  const sidebarProfile = document.getElementById('sidebar-profile-summary');

  if (dateInput && dateInput.value !== appState.activeDate) {
    dateInput.value = appState.activeDate;
  }
  if (dateHuman) {
    const todayStr = getTodayLocalStr();
    const suffix = appState.activeDate === todayStr ? ' (Today)' : '';
    dateHuman.textContent = formatHumanDate(appState.activeDate) + suffix;
  }
  const phase = getPhaseForDate(appState, appState.activeDate);
  if (phaseBadge) {
    phaseBadge.textContent = phase.inProgramme
      ? `${phase.name}: ${phase.focus}`
      : `${phase.name}`;
  }
  if (progRange) {
    const s = formatShortDate(appState.userSettings.programmeStartDate);
    const e = formatHumanDate(appState.userSettings.programmeEndDate, { day: 'numeric', month: 'short', year: 'numeric' });
    progRange.textContent = `Programme: ${s} 2026 – ${e}`;
  }

  // Update active nav buttons across desktop sidebar, mobile top pills, and mobile bottom bar
  document.querySelectorAll('[data-nav]').forEach((btn) => {
    const target = btn.getAttribute('data-nav');
    if (target === currentView) {
      btn.classList.add('active');
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.classList.remove('active');
      btn.removeAttribute('aria-current');
    }
  });

  if (sidebarProfile) {
    const us = appState.userSettings;
    const trend = getWeightTrendSummary(appState, appState.activeDate);
    const currWeight = trend.latestWeightKg ? `${trend.latestWeightKg} kg` : `${us.startingWeightKg} kg (start)`;
    sidebarProfile.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:800; color:var(--text-primary); font-size:0.86rem;">Athlete Telemetry</span>
        <span class="badge badge-completed" style="font-size:0.68rem; padding:2px 7px;">Active</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px;">
        <div style="background:var(--bg-surface); padding:6px 8px; border-radius:6px; border:1px solid var(--border-subtle);">
          <div style="font-size:0.68rem; color:var(--text-muted);">Weight</div>
          <div style="font-weight:700; color:var(--text-primary);">${currWeight}</div>
        </div>
        <div style="background:var(--bg-surface); padding:6px 8px; border-radius:6px; border:1px solid var(--border-subtle);">
          <div style="font-size:0.68rem; color:var(--text-muted);">7d Avg</div>
          <div style="font-weight:700; color:var(--accent-primary);">${trend.rolling7DayAvgKg ? trend.rolling7DayAvgKg + ' kg' : '—'}</div>
        </div>
      </div>
      <div>Height: <strong>${us.heightCm} cm</strong> · Goal: <strong>${us.targetWeightMinKg}–${us.targetWeightMaxKg} kg</strong></div>
      <div style="margin-top:3px;">Daily Target: <strong>${us.calorieTarget} kcal</strong> · <strong>${us.proteinTargetG}g P</strong></div>
    `;
  }

  const cloudLabel = document.getElementById('header-cloud-label');
  if (cloudLabel) {
    cloudLabel.textContent = getCloudSyncStatus().status;
  }
}

function navigateTo(viewName, optionalDate = null) {
  if (optionalDate) {
    appState.activeDate = optionalDate;
    saveState(appState);
  }
  currentView = viewName;
  syncHeaderAndNavigation();
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function setActiveDate(dateStr) {
  if (!dateStr) return;
  appState.activeDate = dateStr;
  saveState(appState);
  syncHeaderAndNavigation();
  renderCurrentView();
}

function renderCurrentView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  switch (currentView) {
    case 'dashboard':
      container.innerHTML = renderDashboardView();
      break;
    case 'calendar':
      container.innerHTML = renderCalendarView();
      break;
    case 'workout':
      container.innerHTML = renderWorkoutView();
      break;
    case 'running':
      container.innerHTML = renderRunningView();
      break;
    case 'nutrition':
      container.innerHTML = renderNutritionView();
      break;
    case 'habits':
      container.innerHTML = renderHabitsView();
      break;
    case 'progress':
      container.innerHTML = renderProgressView();
      break;
    case 'settings':
      container.innerHTML = renderSettingsView();
      break;
    default:
      container.innerHTML = renderDashboardView();
      break;
  }
}

// ============================================================================
// 1. DASHBOARD VIEW (Section 11)
// ============================================================================
function renderDashboardView() {
  const dateStr = appState.activeDate;
  const phase = getPhaseForDate(appState, dateStr);
  const planned = getPlannedSessionForDate(appState, dateStr);
  const nut = getNutritionSummary(appState, dateStr);
  const weightTrend = getWeightTrendSummary(appState, dateStr);
  const habitsStatus = getHabitStatusForDate(appState, dateStr);
  const weekSummary = getWeeklyTrainingSummary(appState, dateStr);
  const nextSession = getNextSessionAfter(appState, dateStr);
  const dailyLog = nut.todayLog;

  const calPct = Math.min(100, Math.round((nut.todayLog.caloriesKcal / nut.targets.calories) * 100));
  const proPct = Math.min(100, Math.round((nut.todayLog.proteinG / nut.targets.protein) * 100));
  const carbPct = Math.min(100, Math.round((nut.todayLog.carbohydrateG / nut.targets.carbs) * 100));
  const fatPct = Math.min(100, Math.round((nut.todayLog.fatG / nut.targets.fat) * 100));
  const waterPct = Math.min(100, Math.round((nut.todayLog.waterL / nut.targets.water) * 100));

  const preProgBanner = !phase.inProgramme && phase.id === 'pre-programme' ? `
    <div class="alert-banner alert-info" style="margin-bottom: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <strong>📅 Pre-Programme Preparation (${phase.daysUntilStart} days until start):</strong>
          The 6-week programme runs from <strong>Monday, 23 November 2026</strong> to <strong>Tuesday, 5 January 2027</strong>. You can log baseline weight, nutrition, habits and runs today, or preview Day 1 now.
        </div>
        <button type="button" class="btn-primary btn-sm" data-action="jump-date" data-date="2026-11-23">View Day 1 (23 Nov)</button>
      </div>
    </div>
  ` : '';

  const runBaseBanner = !appState.userSettings.runningBaseConfirmed ? `
    <div class="alert-banner alert-warn" style="margin-bottom: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <strong>🏃 Confirm Your Current Running Base:</strong>
          You have completed two half-marathons, but your current weekly mileage and recent comfortable long-run distance are unconfirmed. Confirm them to scale the provisional running schedule safely.
        </div>
        <button type="button" class="btn-secondary btn-sm" data-nav-trigger="running">Confirm in Running →</button>
      </div>
    </div>
  ` : '';

  const rescheduleNote = planned.originalPlannedDate && planned.originalPlannedDate !== dateStr
    ? `<div style="font-size:0.8rem; color:var(--status-modified);">⇄ Rescheduled from original planned date: <strong>${planned.originalPlannedDate}</strong></div>`
    : '';

  const startSessionTarget = planned.category === 'gym'
    ? 'workout'
    : (planned.category === 'run' ? 'running' : 'habits');

  // Compute programme timeline progress (Day 1 to Day 44)
  const progStart = appState.userSettings.programmeStartDate || '2026-11-23';
  const progEnd = appState.userSettings.programmeEndDate || '2027-01-05';
  const totalProgDays = 44;
  let timelineHeadline = '';
  let timelineSub = '';
  if (dateStr < progStart) {
    timelineHeadline = `T-${phase.daysUntilStart || 0} Days`;
    timelineSub = `Starts 23 Nov 2026 (44-day cut)`;
  } else if (dateStr > progEnd) {
    timelineHeadline = `44 / 44 Days`;
    timelineSub = `Programme Completed`;
  } else {
    const dayIdx = Math.max(1, Math.min(totalProgDays, Math.round((parseLocalDate(dateStr) - parseLocalDate(progStart)) / 86400000) + 1));
    timelineHeadline = `Day ${dayIdx} / ${totalProgDays}`;
    timelineSub = `${phase.name} · ${Math.round((dayIdx / totalProgDays) * 100)}% elapsed`;
  }

  // SVG Ring helper (r = 21 => circumference = 131.95)
  const ringCirc = 131.95;
  const calOffset = (ringCirc - (calPct / 100) * ringCirc).toFixed(1);
  const proOffset = (ringCirc - (proPct / 100) * ringCirc).toFixed(1);

  return `
    <div class="section-header">
      <div>
        <h2 class="section-title">Dashboard — ${escapeHtml(formatHumanDate(dateStr))}</h2>
        <p class="section-subtitle">${escapeHtml(phase.name)} · ${escapeHtml(phase.focus)}</p>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button type="button" class="btn-secondary btn-sm" data-nav-trigger="calendar">📅 Full Calendar</button>
        <button type="button" class="btn-primary btn-sm" data-action="open-quick-log">+ Quick Log</button>
      </div>
    </div>

    <!-- Hero Telemetry Strip -->
    <div class="telemetry-strip" role="region" aria-label="Daily performance telemetry">
      <div class="telemetry-pill-card">
        <div>
          <div class="telemetry-label">Programme Timeline</div>
          <div class="telemetry-val">${escapeHtml(timelineHeadline)}</div>
          <div class="telemetry-sub">${escapeHtml(timelineSub)}</div>
        </div>
        <span style="font-size:1.5rem;" aria-hidden="true">🗓️</span>
      </div>
      <div class="telemetry-pill-card">
        <div>
          <div class="telemetry-label">Calorie Budget</div>
          <div class="telemetry-val">${nut.remaining.calories >= 0 ? nut.remaining.calories + ' kcal' : '+' + Math.abs(nut.remaining.calories) + ' kcal'}</div>
          <div class="telemetry-sub">${nut.remaining.calories >= 0 ? 'Remaining of ' + nut.targets.calories + ' kcal' : 'Over ' + nut.targets.calories + ' kcal target'}</div>
        </div>
        <span style="font-size:1.5rem;" aria-hidden="true">🔥</span>
      </div>
      <div class="telemetry-pill-card">
        <div>
          <div class="telemetry-label">Protein Priority</div>
          <div class="telemetry-val">${nut.todayLog.proteinG}g / ${nut.targets.protein}g</div>
          <div class="telemetry-sub">${proPct}% of daily target</div>
        </div>
        <span style="font-size:1.5rem;" aria-hidden="true">🥩</span>
      </div>
      <div class="telemetry-pill-card">
        <div>
          <div class="telemetry-label">Daily Checklist</div>
          <div class="telemetry-val">${habitsStatus.completedCount} / ${habitsStatus.totalCount}</div>
          <div class="telemetry-sub">${habitsStatus.completionPct}% habits completed</div>
        </div>
        <span style="font-size:1.5rem;" aria-hidden="true">☑️</span>
      </div>
    </div>

    ${preProgBanner}
    ${runBaseBanner}

    <div class="dashboard-grid">
      <!-- Card 1: Today's Plan -->
      <section class="card card-accent-gym" aria-labelledby="dash-plan-title">
        <div class="card-header">
          <h3 class="card-title" id="dash-plan-title">1. Today's Plan</h3>
          <div style="display:flex; gap:6px; align-items:center;">
            ${renderCategoryBadge(planned.category, planned.isAssessment)}
            ${renderStatusBadge(planned.status)}
          </div>
        </div>
        <div>
          <div style="font-size:1.15rem; font-weight:700; margin-bottom:4px;">${escapeHtml(planned.title)}</div>
          <p style="margin:0; font-size:0.88rem; color:var(--text-secondary);">${escapeHtml(planned.subtitle)}</p>
          ${rescheduleNote}
        </div>
        <div class="form-actions" style="margin-top:auto;">
          <button type="button" class="btn-primary" data-nav-trigger="${startSessionTarget}">
            ${planned.category === 'gym' ? '🏋️ Open Gym Session' : (planned.category === 'run' ? '🏃 Log Run Session' : '🧘 Open Recovery Checklist')}
          </button>
          <button type="button" class="btn-success btn-sm" data-action="quick-session-status" data-date="${dateStr}" data-status="completed">
            ✓ Complete
          </button>
          <button type="button" class="btn-secondary btn-sm" data-action="open-reschedule-modal" data-date="${dateStr}">
            ⇄ Reschedule
          </button>
          <button type="button" class="btn-secondary btn-sm" data-action="quick-session-status" data-date="${dateStr}" data-status="skipped">
            ⏭ Skip
          </button>
        </div>
      </section>

      <!-- Card 2: Daily Nutrition -->
      <section class="card card-accent-blue" aria-labelledby="dash-nut-title">
        <div class="card-header">
          <h3 class="card-title" id="dash-nut-title">2. Daily Nutrition</h3>
          <button type="button" class="btn-secondary btn-sm" data-nav-trigger="nutrition">Log Macros →</button>
        </div>

        <!-- Visual Macro Rings for Calories & Protein -->
        <div class="macro-rings-row">
          <div class="macro-ring-box">
            <svg class="ring-svg" viewBox="0 0 52 52" aria-hidden="true">
              <circle class="ring-bg" cx="26" cy="26" r="21" />
              <circle class="ring-meter" cx="26" cy="26" r="21" stroke="#3b82f6" stroke-dasharray="${ringCirc}" stroke-dashoffset="${calOffset}" />
            </svg>
            <div>
              <div style="font-size:0.73rem; color:var(--text-secondary); font-weight:600;">Calories (${calPct}%)</div>
              <div class="mono-num" style="font-size:0.98rem; font-weight:800;">${nut.todayLog.caloriesKcal} <span style="font-size:0.75rem; color:var(--text-muted); font-weight:500;">/ ${nut.targets.calories}</span></div>
              <div style="font-size:0.71rem; color:var(--text-muted);">${nut.remaining.calories >= 0 ? nut.remaining.calories + ' kcal left' : Math.abs(nut.remaining.calories) + ' kcal over'}</div>
            </div>
          </div>

          <div class="macro-ring-box">
            <svg class="ring-svg" viewBox="0 0 52 52" aria-hidden="true">
              <circle class="ring-bg" cx="26" cy="26" r="21" />
              <circle class="ring-meter" cx="26" cy="26" r="21" stroke="#8b5cf6" stroke-dasharray="${ringCirc}" stroke-dashoffset="${proOffset}" />
            </svg>
            <div>
              <div style="font-size:0.73rem; color:var(--text-secondary); font-weight:600;">Protein (${proPct}%)</div>
              <div class="mono-num" style="font-size:0.98rem; font-weight:800;">${nut.todayLog.proteinG}g <span style="font-size:0.75rem; color:var(--text-muted); font-weight:500;">/ ${nut.targets.protein}g</span></div>
              <div style="font-size:0.71rem; color:var(--text-muted);">${nut.remaining.protein >= 0 ? nut.remaining.protein + 'g remaining' : '+' + Math.abs(nut.remaining.protein) + 'g'}</div>
            </div>
          </div>
        </div>

        <div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr; gap:8px;">
          <div class="progress-group">
            <div class="progress-label-row" style="font-size:0.76rem;">
              <span>Carbs</span><span>${nut.todayLog.carbohydrateG}/${nut.targets.carbs}g</span>
            </div>
            <div class="progress-track"><div class="progress-fill fill-carbs" style="width:${carbPct}%"></div></div>
          </div>
          <div class="progress-group">
            <div class="progress-label-row" style="font-size:0.76rem;">
              <span>Fat</span><span>${nut.todayLog.fatG}/${nut.targets.fat}g</span>
            </div>
            <div class="progress-track"><div class="progress-fill fill-fat" style="width:${fatPct}%"></div></div>
          </div>
          <div class="progress-group">
            <div class="progress-label-row" style="font-size:0.76rem;">
              <span>Water</span><span>${nut.todayLog.waterL}/${nut.targets.water}L</span>
            </div>
            <div class="progress-track"><div class="progress-fill fill-water" style="width:${waterPct}%"></div></div>
          </div>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:auto;">
          <button type="button" class="btn-chip" data-action="quick-water" data-water="0.25">+250 ml Water</button>
          <button type="button" class="btn-chip" data-action="quick-water" data-water="0.5">+500 ml Water</button>
          <button type="button" class="btn-chip" data-action="quick-preset-whey">+ Whey Shake (24g P)</button>
        </div>
      </section>

      <!-- Card 3: Weight Trend -->
      <section class="card card-accent-amber" aria-labelledby="dash-weight-title">
        <div class="card-header">
          <h3 class="card-title" id="dash-weight-title">3. Weight Trend</h3>
          <button type="button" class="btn-secondary btn-sm" data-nav-trigger="progress">Charts →</button>
        </div>

        <div class="stat-grid">
          <div class="stat-box">
            <div class="stat-label">Latest Scale Weight</div>
            <div class="stat-value">${weightTrend.latestWeightKg !== null ? weightTrend.latestWeightKg + ' kg' : '—'}</div>
            <div class="stat-sub">${weightTrend.latestDate ? formatShortDate(weightTrend.latestDate) : `Start: ${appState.userSettings.startingWeightKg} kg`}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">7-Day Rolling Avg</div>
            <div class="stat-value">${weightTrend.rolling7DayAvgKg !== null ? weightTrend.rolling7DayAvgKg + ' kg' : '—'}</div>
            <div class="stat-sub">${weightTrend.weeklyChangeKg !== null ? (weightTrend.weeklyChangeKg > 0 ? `+${weightTrend.weeklyChangeKg} kg vs prior 7d` : `${weightTrend.weeklyChangeKg} kg vs prior 7d`) : 'Needs 7d history'}</div>
          </div>
        </div>

        <form class="inline-weight-form" data-form="dashboard-weight" style="display:flex; gap:8px; align-items:flex-end; margin-top:auto;">
          <div style="flex:1;">
            <label for="dash-weight-input">Morning Weight (${dateStr}, kg)</label>
            <input type="number" step="0.1" min="30" max="250" id="dash-weight-input" name="weightKg" placeholder="e.g. 74.8" value="${dailyLog.weightKg ?? ''}" required />
          </div>
          <button type="submit" class="btn-primary">Save Weight</button>
        </form>
      </section>

      <!-- Card 4: Today's Habits -->
      <section class="card card-accent-green" aria-labelledby="dash-habits-title">
        <div class="card-header">
          <h3 class="card-title" id="dash-habits-title">4. Today's Habits (${habitsStatus.completionPct}%)</h3>
          <button type="button" class="btn-secondary btn-sm" data-nav-trigger="habits">All Habits →</button>
        </div>

        <div class="progress-group">
          <div class="progress-label-row">
            <span>Daily Checklist</span>
            <span><strong>${habitsStatus.completedCount}</strong> / ${habitsStatus.totalCount} completed</span>
          </div>
          <div class="progress-track"><div class="progress-fill fill-success" style="width:${habitsStatus.completionPct}%"></div></div>
        </div>

        <div class="habit-list" style="max-height: 220px; overflow-y:auto;">
          ${habitsStatus.coreItems.map(h => `
            <div class="habit-row ${h.completed ? 'habit-completed' : ''}" style="padding:6px 10px;">
              <button type="button" class="habit-check-btn" data-action="toggle-habit" data-habit-id="${h.id}" style="min-height:36px; font-size:0.86rem;">
                <span class="habit-box" aria-hidden="true">${h.completed ? '✓' : ''}</span>
                <span>${escapeHtml(h.title)}</span>
              </button>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Card 5: This Week's Training -->
      <section class="card card-accent-run" aria-labelledby="dash-week-title">
        <div class="card-header">
          <h3 class="card-title" id="dash-week-title">5. This Week's Training</h3>
          <span class="badge badge-planned">${formatShortDate(weekSummary.weekStart)} – ${formatShortDate(weekSummary.weekEnd)}</span>
        </div>

        <div class="stat-grid">
          <div class="stat-box">
            <div class="stat-label">Gym Sessions</div>
            <div class="stat-value">${weekSummary.gymCompleted} / ${weekSummary.gymPlanned}</div>
            <div class="stat-sub">Target: 3 / week</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Run Sessions</div>
            <div class="stat-value">${weekSummary.runsCompleted} / ${weekSummary.runsPlanned}</div>
            <div class="stat-sub">Target: 3 / week</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Weekly Mileage</div>
            <div class="stat-value">${weekSummary.totalRunKm} km</div>
            <div class="stat-sub">Planned: ~${weekSummary.plannedRunKm} km</div>
          </div>
        </div>

        <div style="font-size:0.84rem; color:var(--text-secondary); display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <span>👟 Steps today: <strong>${dailyLog.steps ?? 'Not logged'}</strong> (Target 8–10k)</span>
          <span>😴 Sleep: <strong>${dailyLog.sleepHours ? dailyLog.sleepHours + ' hrs' : 'Not logged'}</strong> (Target 7.5–9h)</span>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:auto;">
          <button type="button" class="btn-chip" data-action="quick-steps" data-steps="2000">+2,000 Steps</button>
          <button type="button" class="btn-chip" data-action="quick-steps" data-steps-set="9000">Set 9,000 Steps</button>
          <button type="button" class="btn-chip" data-action="quick-sleep" data-sleep="8">Set 8.0h Sleep</button>
        </div>
      </section>

      <!-- Card 6: Next Session -->
      <section class="card card-accent-gym" aria-labelledby="dash-next-title">
        <div class="card-header">
          <h3 class="card-title" id="dash-next-title">6. Next Session</h3>
          ${renderCategoryBadge(nextSession.category, nextSession.isAssessment)}
        </div>
        <div>
          <div style="font-size:0.84rem; color:var(--text-secondary); font-weight:600;">${formatHumanDate(nextSession.date)}</div>
          <div style="font-size:1.1rem; font-weight:700; margin:4px 0;">${escapeHtml(nextSession.title)}</div>
          <p style="margin:0; font-size:0.86rem; color:var(--text-secondary);">${escapeHtml(nextSession.subtitle)}</p>
        </div>
        <div class="form-actions" style="margin-top:auto;">
          <button type="button" class="btn-secondary btn-sm" data-action="jump-date" data-date="${nextSession.date}">
            Jump to ${formatShortDate(nextSession.date)} →
          </button>
        </div>
      </section>

      <!-- Card 7: Quick Log (Full Width or Grid Card) -->
      <section class="card card-full" aria-labelledby="dash-quicklog-title">
        <div class="card-header">
          <h3 class="card-title" id="dash-quicklog-title">7. Quick Log (${dateStr})</h3>
          <span style="font-size:0.8rem; color:var(--text-secondary);">Fast entry for macros, steps, sleep &amp; hydration</span>
        </div>
        <form data-form="dashboard-quick-multi" class="form-grid">
          <div>
            <label for="ql-cal">Add Calories (kcal)</label>
            <input type="number" id="ql-cal" name="caloriesKcal" min="0" max="5000" placeholder="e.g. 550" />
          </div>
          <div>
            <label for="ql-pro">Add Protein (g)</label>
            <input type="number" step="0.5" id="ql-pro" name="proteinG" min="0" max="300" placeholder="e.g. 40" />
          </div>
          <div>
            <label for="ql-carb">Add Carbs (g)</label>
            <input type="number" step="0.5" id="ql-carb" name="carbohydrateG" min="0" max="500" placeholder="e.g. 60" />
          </div>
          <div>
            <label for="ql-fat">Add Fat (g)</label>
            <input type="number" step="0.5" id="ql-fat" name="fatG" min="0" max="200" placeholder="e.g. 15" />
          </div>
          <div>
            <label for="ql-steps">Daily Steps Total</label>
            <input type="number" id="ql-steps" name="steps" min="0" max="50000" placeholder="e.g. 9200" value="${dailyLog.steps ?? ''}" />
          </div>
          <div>
            <label for="ql-sleep">Sleep (hours)</label>
            <input type="number" step="0.25" id="ql-sleep" name="sleepHours" min="0" max="24" placeholder="e.g. 8.0" value="${dailyLog.sleepHours ?? ''}" />
          </div>
          <div style="display:flex; align-items:flex-end;">
            <button type="submit" class="btn-primary" style="width:100%;">Save Quick Entry</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

// ============================================================================
// 2. CALENDAR VIEW (Section 7)
// ============================================================================
function renderCalendarView() {
  const startStr = appState.userSettings.programmeStartDate || '2026-11-23';
  const endStr = appState.userSettings.programmeEndDate || '2027-01-05';

  // Count completed vs planned across the 44 programme days
  let totalProgDays = 0;
  let completedSessions = 0;
  let modifiedSessions = 0;
  let skippedSessions = 0;
  let plannedTrainingDays = 0;

  let cursor = startStr;
  while (cursor <= endStr) {
    totalProgDays++;
    const s = getPlannedSessionForDate(appState, cursor);
    if (s.category === 'gym' || s.category === 'run') {
      plannedTrainingDays++;
    }
    if (s.status === 'completed') completedSessions++;
    else if (s.status === 'modified') modifiedSessions++;
    else if (s.status === 'skipped') skippedSessions++;
    cursor = addDays(cursor, 1);
  }

  const phasesHtml = PROGRAMME_PHASES.map(p => {
    const isCurrent = appState.activeDate >= p.startDate && appState.activeDate <= p.endDate;
    return `
      <button type="button" class="btn-chip ${isCurrent ? 'active' : ''}" data-action="jump-date" data-date="${p.startDate}">
        <strong>${escapeHtml(p.name)}</strong> (${escapeHtml(p.dateLabel)}): ${escapeHtml(p.focus)}
      </button>
    `;
  }).join('');

  let mainCalendarHtml = '';
  if (calendarViewMode === 'week') {
    const monday = getMondayOfWeek(appState.activeDate);
    const weekPhase = getPhaseForDate(appState, monday);
    const dayCards = [];

    for (let i = 0; i < 7; i++) {
      const d = addDays(monday, i);
      const s = getPlannedSessionForDate(appState, d);
      const isSelected = d === appState.activeDate;
      const isStart = d === startStr;
      const isEnd = d === endStr;

      let milestoneBanner = '';
      if (isStart) {
        milestoneBanner = `<div class="badge badge-assess" style="margin-bottom:4px;">🏁 PROGRAMME START (23 Nov 2026)</div>`;
      } else if (isEnd) {
        milestoneBanner = `<div class="badge badge-assess" style="margin-bottom:4px;">🏆 PROGRAMME END &amp; FINAL ASSESSMENT (5 Jan 2027)</div>`;
      }

      const origNote = s.originalPlannedDate && s.originalPlannedDate !== d
        ? `<div style="font-size:0.75rem; color:var(--status-modified);">Originally planned: ${s.originalPlannedDate}</div>`
        : '';

      const openTarget = s.category === 'gym' ? 'workout' : (s.category === 'run' ? 'running' : 'habits');

      dayCards.push(`
        <div class="day-card ${isSelected ? 'is-active-date' : ''} ${(isStart || isEnd) ? 'is-start-end' : ''}">
          <div>
            ${milestoneBanner}
            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:6px;">
              <strong style="font-size:0.92rem;">${formatHumanDate(d, { weekday: 'short', day: 'numeric', month: 'short' })}</strong>
              ${renderCategoryBadge(s.category, s.isAssessment)}
            </div>
            <div style="margin-bottom:6px;">${renderStatusBadge(s.status)}</div>
            <div style="font-weight:700; font-size:1rem; margin-bottom:4px;">${escapeHtml(s.title)}</div>
            <p style="margin:0; font-size:0.82rem; color:var(--text-secondary);">${escapeHtml(s.subtitle)}</p>
            ${origNote}
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:6px; padding-top:8px; border-top:1px solid var(--border-subtle);">
            <button type="button" class="btn-primary btn-sm" data-action="open-day-session" data-date="${d}" data-target="${openTarget}">
              Open
            </button>
            <button type="button" class="btn-secondary btn-sm" data-action="quick-session-status" data-date="${d}" data-status="completed" title="Mark Completed">
              ✓
            </button>
            <button type="button" class="btn-secondary btn-sm" data-action="open-edit-day-modal" data-date="${d}" title="Edit or Modify Day">
              ✎ Edit
            </button>
            <button type="button" class="btn-secondary btn-sm" data-action="open-reschedule-modal" data-date="${d}" title="Reschedule Session">
              ⇄
            </button>
            <button type="button" class="btn-secondary btn-sm" data-action="quick-session-status" data-date="${d}" data-status="skipped" title="Mark Skipped">
              ⏭
            </button>
          </div>
        </div>
      `);
    }

    mainCalendarHtml = `
      <div class="card" style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h3 class="card-title">Week of ${formatHumanDate(monday)} – ${formatHumanDate(addDays(monday, 6))}</h3>
            <p style="margin:2px 0 0; font-size:0.85rem; color:var(--text-secondary);">${escapeHtml(weekPhase.name)} — Focus: ${escapeHtml(weekPhase.focus)}</p>
          </div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-secondary btn-sm" data-action="jump-date" data-date="${addDays(monday, -7)}">◀ Prev Week</button>
            <button type="button" class="btn-secondary btn-sm" data-action="jump-date" data-date="${addDays(monday, 7)}">Next Week ▶</button>
          </div>
        </div>
      </div>
      <div class="week-cards-grid">
        ${dayCards.join('')}
      </div>
    `;
  } else {
    // Month View
    const dt = parseLocalDate(calendarMonthCursor);
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const firstDayOfMonth = formatLocalDate(new Date(year, month, 1, 12, 0, 0));
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = getDayOfWeekIndex(firstDayOfMonth); // 0=Mon..6=Sun
    const monthLabel = dt.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    const cells = [];
    for (let b = 0; b < startOffset; b++) {
      cells.push(`<div class="month-cell is-outside-prog" aria-hidden="true"></div>`);
    }
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const d = formatLocalDate(new Date(year, month, dayNum, 12, 0, 0));
      const s = getPlannedSessionForDate(appState, d);
      const inProg = d >= startStr && d <= endStr;
      const isSelected = d === appState.activeDate;
      const isStart = d === startStr;
      const isEnd = d === endStr;

      const statusSymbol = s.status === 'completed' ? '✓' : (s.status === 'modified' ? '✎' : (s.status === 'skipped' ? '⏭' : ''));
      const catIcon = s.isAssessment ? '🎯' : (s.category === 'gym' ? '🏋️' : (s.category === 'run' ? '🏃' : '🧘'));

      cells.push(`
        <button type="button" class="month-cell ${!inProg ? 'is-outside-prog' : ''} ${isSelected ? 'is-selected' : ''}" data-action="select-month-day" data-date="${d}">
          <div class="month-cell-top">
            <span>${dayNum} ${isStart ? '🏁' : ''}${isEnd ? '🏆' : ''}</span>
            <span>${catIcon} ${statusSymbol}</span>
          </div>
          <div class="month-cell-title">${escapeHtml(s.shortTitle || s.title)}</div>
          <div>${renderStatusBadge(s.status)}</div>
        </button>
      `);
    }

    mainCalendarHtml = `
      <div class="card" style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <h3 class="card-title">${escapeHtml(monthLabel)}</h3>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="btn-chip ${calendarMonthCursor.startsWith('2026-11') ? 'active' : ''}" data-action="set-cal-month" data-month="2026-11-01">Nov 2026</button>
            <button type="button" class="btn-chip ${calendarMonthCursor.startsWith('2026-12') ? 'active' : ''}" data-action="set-cal-month" data-month="2026-12-01">Dec 2026</button>
            <button type="button" class="btn-chip ${calendarMonthCursor.startsWith('2027-01') ? 'active' : ''}" data-action="set-cal-month" data-month="2027-01-01">Jan 2027</button>
          </div>
        </div>
      </div>

      <div class="month-grid">
        <div class="month-weekday-header">Mon</div>
        <div class="month-weekday-header">Tue</div>
        <div class="month-weekday-header">Wed</div>
        <div class="month-weekday-header">Thu</div>
        <div class="month-weekday-header">Fri</div>
        <div class="month-weekday-header">Sat</div>
        <div class="month-weekday-header">Sun</div>
        ${cells.join('')}
      </div>
    `;
  }

  return `
    <div class="section-header">
      <div>
        <h2 class="section-title">Programme Calendar (23 Nov 2026 – 5 Jan 2027)</h2>
        <p class="section-subtitle">
          <strong>${completedSessions}</strong> completed · <strong>${modifiedSessions}</strong> modified · <strong>${skippedSessions}</strong> skipped · <strong>${plannedTrainingDays}</strong> planned training sessions across ${totalProgDays} days
        </p>
      </div>
      <div style="display:flex; gap:8px;">
        <button type="button" class="btn-secondary btn-sm ${calendarViewMode === 'week' ? 'active' : ''}" data-action="toggle-cal-mode" data-mode="week">Week View</button>
        <button type="button" class="btn-secondary btn-sm ${calendarViewMode === 'month' ? 'active' : ''}" data-action="toggle-cal-mode" data-mode="month">Month View</button>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <div style="font-size:0.84rem; font-weight:700; color:var(--text-secondary);">Jump to Programme Phase:</div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">
        ${phasesHtml}
      </div>
    </div>

    ${mainCalendarHtml}
  `;
}

// ============================================================================
// 3. WORKOUT VIEW (Section 5)
// ============================================================================
function renderWorkoutView() {
  const dateStr = appState.activeDate;
  const planned = getPlannedSessionForDate(appState, dateStr);
  const session = getOrCreateWorkoutSession(appState, dateStr);

  // Compute live workout telemetry
  let totalSetsCount = 0;
  let completedSetsCount = 0;
  let totalVolumeKg = 0;
  let completedExCount = 0;
  const totalExCount = (session.exercises || []).length;

  (session.exercises || []).forEach(ex => {
    if (ex.completed) completedExCount++;
    (ex.sets || []).forEach(st => {
      totalSetsCount++;
      if (st.completed) {
        completedSetsCount++;
        const w = Number(st.weightKg) || 0;
        const r = Number(st.reps) || 0;
        if (!ex.isTimed && w > 0 && r > 0) {
          totalVolumeKg += w * r;
        }
      }
    });
  });
  const setsProgressPct = totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

  const exercisesHtml = (session.exercises || []).map((ex, exIdx) => {
    const lastRef = getLastUsedExercisePerformance(appState, ex.exerciseName, dateStr);
    const refText = lastRef
      ? `Last reference: <strong>${lastRef.weightKg} kg × ${lastRef.reps}</strong> (${formatShortDate(lastRef.date)}) — reference only`
      : `No previous weight logged — choose a conservative working load (~2 RIR)`;

    const setsRows = (ex.sets || []).map((st, sIdx) => `
      <tr>
        <td><strong>#${st.setNumber}</strong></td>
        <td>
          <div class="weight-stepper-cell">
            <button type="button" class="btn-step-mini" data-action="step-set-weight" data-ex-idx="${exIdx}" data-set-idx="${sIdx}" data-delta="-2.5" title="-2.5 kg">-2.5</button>
            <input type="number" step="0.5" min="0" max="500" class="set-input"
              aria-label="${escapeHtml(ex.exerciseName)} Set ${st.setNumber} Weight kg"
              data-action="update-set-field" data-ex-idx="${exIdx}" data-set-idx="${sIdx}" data-field="weightKg"
              placeholder="kg" value="${st.weightKg ?? ''}" />
            <button type="button" class="btn-step-mini" data-action="step-set-weight" data-ex-idx="${exIdx}" data-set-idx="${sIdx}" data-delta="2.5" title="+2.5 kg">+2.5</button>
          </div>
        </td>
        <td>
          <input type="number" step="1" min="0" max="600" class="set-input"
            aria-label="${escapeHtml(ex.exerciseName)} Set ${st.setNumber} ${ex.isTimed ? 'Seconds' : 'Reps'}"
            data-action="update-set-field" data-ex-idx="${exIdx}" data-set-idx="${sIdx}" data-field="reps"
            placeholder="${ex.isTimed ? 'sec' : 'reps'}" value="${st.reps ?? ''}" />
        </td>
        <td>
          <input type="number" step="0.5" min="1" max="10" class="set-input"
            aria-label="${escapeHtml(ex.exerciseName)} Set ${st.setNumber} RPE"
            data-action="update-set-field" data-ex-idx="${exIdx}" data-set-idx="${sIdx}" data-field="rpe"
            placeholder="8" value="${st.rpe ?? ''}" />
        </td>
        <td>
          <button type="button" class="btn-set-check ${st.completed ? 'checked' : ''}"
            data-action="toggle-set-complete" data-ex-idx="${exIdx}" data-set-idx="${sIdx}" data-rest="${ex.defaultRestSec || 90}"
            aria-label="Mark Set ${st.setNumber} completed">
            ${st.completed ? '✓ Done' : 'Done'}
          </button>
        </td>
        <td>
          <button type="button" class="btn-icon btn-sm" data-action="remove-set" data-ex-idx="${exIdx}" data-set-idx="${sIdx}" title="Delete Set" aria-label="Delete Set ${st.setNumber}">✕</button>
        </td>
      </tr>
    `).join('');

    return `
      <div class="exercise-card ${ex.completed ? 'exercise-done' : ''}">
        <div class="exercise-top-bar">
          <div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <h3 style="margin:0; font-size:1.05rem;">${exIdx + 1}. ${escapeHtml(ex.exerciseName)}</h3>
              <span class="badge badge-gym">${ex.plannedSets} sets × ${escapeHtml(ex.repTarget)}</span>
              ${ex.isCompound ? `<span class="badge badge-planned">Compound (Rest 2–3m)</span>` : `<span class="badge badge-planned">Isolation (Rest 60–90s)</span>`}
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">
              ${refText}
              ${lastRef ? `<button type="button" class="btn-chip" style="min-height:26px; padding:2px 8px; margin-left:6px;" data-action="apply-ref-weight" data-ex-idx="${exIdx}" data-weight="${lastRef.weightKg}">Prefill ${lastRef.weightKg} kg</button>` : ''}
            </div>
          </div>

          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            <button type="button" class="btn-chip ${ex.completed ? 'active' : ''}" data-action="toggle-exercise-complete" data-ex-idx="${exIdx}">
              ${ex.completed ? '✓ Exercise Completed' : 'Mark All Sets Done'}
            </button>
            <button type="button" class="btn-icon btn-sm" data-action="move-exercise" data-ex-idx="${exIdx}" data-dir="-1" title="Move Up" aria-label="Move Exercise Up">↑</button>
            <button type="button" class="btn-icon btn-sm" data-action="move-exercise" data-ex-idx="${exIdx}" data-dir="1" title="Move Down" aria-label="Move Exercise Down">↓</button>
            <button type="button" class="btn-icon btn-sm" data-action="substitute-exercise" data-ex-idx="${exIdx}" title="Substitute or Rename Exercise" aria-label="Substitute Exercise">✎</button>
            <button type="button" class="btn-icon btn-sm" data-action="remove-exercise" data-ex-idx="${exIdx}" title="Remove Exercise" aria-label="Remove Exercise">🗑</button>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table class="sets-table">
            <thead>
              <tr>
                <th>Set</th>
                <th>Weight (kg)</th>
                <th>${ex.isTimed ? 'Duration (sec)' : 'Reps'}</th>
                <th>RPE (1–10)</th>
                <th>Complete</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${setsRows}
            </tbody>
          </table>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-top:8px;">
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-secondary btn-sm" data-action="add-set" data-ex-idx="${exIdx}">+ Add Set</button>
            <button type="button" class="btn-chip" data-rest-sec="${ex.defaultRestSec || 90}">⏱️ Start ${ex.defaultRestSec || 90}s Rest</button>
          </div>
          <div style="flex:1; min-width:200px;">
            <input type="text" placeholder="Exercise notes (cues, machine setting, knee/shoulder comfort)…"
              aria-label="${escapeHtml(ex.exerciseName)} notes"
              data-action="update-exercise-notes" data-ex-idx="${exIdx}"
              value="${escapeHtml(ex.notes || '')}" style="min-height:36px; font-size:0.84rem;" />
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="section-header">
      <div>
        <h2 class="section-title">Gym Workout Logger — ${formatHumanDate(dateStr)}</h2>
        <p class="section-subtitle">
          Session: <strong>${escapeHtml(session.type)}</strong>
          ${session.isDeload ? `<span class="badge badge-assess" style="margin-left:6px;">Week 6 / Consolidation: ~35% Reduced Working Sets</span>` : ''}
        </p>
      </div>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button type="button" class="btn-chip ${session.templateId === 'gym-a' ? 'active' : ''}" data-action="switch-workout-template" data-template="gym-a">Load Gym A (Mon)</button>
        <button type="button" class="btn-chip ${session.templateId === 'gym-b' ? 'active' : ''}" data-action="switch-workout-template" data-template="gym-b">Load Gym B (Wed)</button>
        <button type="button" class="btn-chip ${session.templateId === 'gym-c' ? 'active' : ''}" data-action="switch-workout-template" data-template="gym-c">Load Gym C (Fri)</button>
        <button type="button" class="btn-chip ${session.templateId === 'gym-assessment' ? 'active' : ''}" data-action="switch-workout-template" data-template="gym-assessment">Load Assessment</button>
      </div>
    </div>

    <!-- Live Session Telemetry Strip -->
    <div class="telemetry-strip" role="region" aria-label="Workout session progress">
      <div class="telemetry-pill-card">
        <div style="flex:1;">
          <div class="telemetry-label">Working Sets Completed</div>
          <div class="telemetry-val">${completedSetsCount} / ${totalSetsCount} (${setsProgressPct}%)</div>
          <div class="progress-track" style="margin-top:6px; height:6px;">
            <div class="progress-fill fill-success" style="width:${setsProgressPct}%"></div>
          </div>
        </div>
      </div>
      <div class="telemetry-pill-card">
        <div>
          <div class="telemetry-label">Exercises Completed</div>
          <div class="telemetry-val">${completedExCount} / ${totalExCount}</div>
          <div class="telemetry-sub">Full-Body Session</div>
        </div>
        <span style="font-size:1.5rem;" aria-hidden="true">🏋️</span>
      </div>
      <div class="telemetry-pill-card">
        <div>
          <div class="telemetry-label">Logged Session Volume</div>
          <div class="telemetry-val">${Math.round(totalVolumeKg).toLocaleString()} kg</div>
          <div class="telemetry-sub">Weight × Reps across completed sets</div>
        </div>
        <span style="font-size:1.5rem;" aria-hidden="true">⚡</span>
      </div>
    </div>

    <!-- Training Guidance Banner -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <h3 class="card-title">💡 Gym Training &amp; Auto-Regulation Guidance</h3>
        ${renderStatusBadge(session.status)}
      </div>
      <ul style="margin:0; padding-left:20px; font-size:0.86rem; color:var(--text-secondary); display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:4px 16px;">
        ${GYM_GUIDANCE_ITEMS.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </div>

    <!-- Exercises List -->
    <div>
      ${exercisesHtml}
    </div>

    <!-- Add Exercise Card -->
    <div class="card" style="margin-bottom:16px;">
      <h3 class="card-title">+ Add or Substitute an Exercise</h3>
      <form data-form="add-workout-exercise" class="form-grid">
        <div>
          <label for="new-ex-name">Exercise Name</label>
          <input type="text" id="new-ex-name" name="exerciseName" placeholder="e.g. Goblet Squat or Dumbbell Row" required />
        </div>
        <div>
          <label for="new-ex-sets">Planned Sets</label>
          <input type="number" id="new-ex-sets" name="plannedSets" min="1" max="10" value="3" required />
        </div>
        <div>
          <label for="new-ex-reps">Rep Target</label>
          <input type="text" id="new-ex-reps" name="repTarget" value="10–12" required />
        </div>
        <div style="display:flex; align-items:flex-end;">
          <button type="submit" class="btn-secondary" style="width:100%;">+ Add Exercise to Session</button>
        </div>
      </form>
    </div>

    <!-- Session Completion & Notes -->
    <div class="card">
      <h3 class="card-title">Finish &amp; Save Workout Session</h3>
      <div>
        <label for="workout-session-notes">Session Notes (energy levels, lower-body fatigue vs running, adjustments)</label>
        <textarea id="workout-session-notes" data-action="update-workout-session-notes" placeholder="Optional workout notes…">${escapeHtml(session.notes || '')}</textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-success" data-action="set-workout-status" data-status="completed">✓ Complete Workout Session</button>
        <button type="button" class="btn-secondary" data-action="set-workout-status" data-status="modified">✎ Save as Modified</button>
        <button type="button" class="btn-secondary" data-action="set-workout-status" data-status="skipped">⏭ Mark Session Skipped</button>
        <button type="button" class="btn-secondary" data-action="open-reschedule-modal" data-date="${dateStr}">⇄ Reschedule Session</button>
      </div>
    </div>
  `;
}

// ============================================================================
// 4. RUNNING VIEW (Section 6)
// ============================================================================
function renderRunningView() {
  const dateStr = appState.activeDate;
  const planned = getPlannedSessionForDate(appState, dateStr);
  const phase = getPhaseForDate(appState, dateStr);
  const us = appState.userSettings;

  // Check if editing an existing run or creating a new run for activeDate
  const existingRun = editingRunId
    ? appState.runLogs.find(r => r.id === editingRunId)
    : appState.runLogs.find(r => r.date === dateStr);

  const defaultType = existingRun
    ? existingRun.sessionType
    : (planned.runSessionType || 'easy');
  const defaultDist = existingRun
    ? existingRun.distanceKm
    : (planned.category === 'run' ? (planned.plannedDistanceKm || 5) : 5);
  const defaultDurSec = existingRun ? existingRun.durationSeconds : Math.round(defaultDist * 360); // default 6:00/km
  const defaultMins = Math.floor(defaultDurSec / 60);
  const defaultSecs = defaultDurSec % 60;
  const livePace = calculatePace(defaultDist, defaultDurSec).paceFormatted;

  // Scaling check advisory if recentLongRunKm is set and planned long run exceeds it
  let scalingWarningHtml = '';
  if (us.recentLongRunKm && Number(us.recentLongRunKm) > 0) {
    const maxPlannedLong = Math.max(...appState.runningPlan.map(w => Number(w.longKm) || 0));
    if (maxPlannedLong > Number(us.recentLongRunKm) + 2) {
      scalingWarningHtml = `
        <div class="alert-banner alert-warn">
          <strong>⚠️ Conservative Scaling Advisory:</strong> Your recent comfortable long run is <strong>${us.recentLongRunKm} km</strong>, whereas the provisional schedule reaches <strong>${maxPlannedLong} km</strong>. Do not force distances that exceed your current base—use the "Auto-Scale Schedule to My Base" button below or edit individual weeks.
        </div>
      `;
    }
  }

  const runScheduleRows = appState.runningPlan.map((rw, idx) => {
    const isCurrentWeek = phase.weekNumber === rw.weekNumber;
    return `
      <tr style="${isCurrentWeek ? 'background:var(--accent-primary-soft); font-weight:600;' : ''}">
        <td><strong>Week ${rw.weekNumber}</strong> ${isCurrentWeek ? '<span class="badge badge-run">Current</span>' : ''}</td>
        <td>${escapeHtml(rw.easyLabel || rw.easyKm + ' km')}</td>
        <td>
          <div><strong>${escapeHtml(rw.qualityLabel)}</strong></div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">${escapeHtml(rw.qualityDetails || '')}</div>
        </td>
        <td>${escapeHtml(rw.longLabel || rw.longKm + ' km')}</td>
      </tr>
    `;
  }).join('');

  const sortedRuns = [...appState.runLogs].sort((a, b) => b.date.localeCompare(a.date));
  const runHistoryHtml = sortedRuns.length === 0
    ? `<p style="color:var(--text-secondary); font-size:0.9rem; margin:0;">No runs logged yet. Use the form above to log your first aerobic, tempo, interval, or long run.</p>`
    : `
      <div style="overflow-x:auto;">
        <table class="sets-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Distance</th>
              <th>Duration</th>
              <th>Avg Pace</th>
              <th>HR / Effort</th>
              <th>Route / Surface</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${sortedRuns.map(r => `
              <tr>
                <td><strong>${r.date}</strong></td>
                <td><span class="badge badge-run">${escapeHtml(r.sessionType)}</span></td>
                <td><strong>${r.distanceKm} km</strong></td>
                <td>${formatDurationHms(r.durationSeconds)}</td>
                <td><strong>${escapeHtml(r.averagePace)}</strong></td>
                <td>${r.averageHeartRate ? r.averageHeartRate + ' bpm · ' : ''}Effort ${r.effort || '—'}/10</td>
                <td>${escapeHtml(r.routeSurface || '—')}</td>
                <td>${renderStatusBadge(r.status || 'completed')}</td>
                <td>
                  <div style="display:flex; gap:4px;">
                    <button type="button" class="btn-secondary btn-sm" data-action="edit-run-log" data-run-id="${r.id}">Edit</button>
                    <button type="button" class="btn-danger btn-sm" data-action="delete-run-log" data-run-id="${r.id}">✕</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

  return `
    <div class="section-header">
      <div>
        <h2 class="section-title">Running Tracker &amp; 6-Week Provisional Plan</h2>
        <p class="section-subtitle">Quality sessions include a 10-min warm-up &amp; cool-down with easy jog/walk recovery between reps.</p>
      </div>
    </div>

    <!-- Running Base Confirmation Card -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <h3 class="card-title">1. Running Background &amp; Conservative Base Settings</h3>
        <span class="badge ${us.runningBaseConfirmed ? 'badge-completed' : 'badge-modified'}">
          ${us.runningBaseConfirmed ? '✓ Base Confirmed' : 'Confirmation Needed'}
        </span>
      </div>
      <p style="margin:0; font-size:0.86rem; color:var(--text-secondary);">
        Background: Completed two half-marathons. Confirm your current weekly mileage and recent comfortable long-run distance below so the provisional plan can be scaled conservatively without interfering with gym recovery.
      </p>
      ${scalingWarningHtml}
      <form data-form="running-base-form" class="form-grid">
        <div>
          <label for="run-base-weekly">Current Weekly Mileage (km/week)</label>
          <input type="number" step="0.5" min="0" max="150" id="run-base-weekly" name="currentWeeklyRunKm" placeholder="e.g. 15" value="${us.currentWeeklyRunKm ?? ''}" required />
        </div>
        <div>
          <label for="run-base-long">Recent Comfortable Long Run (km)</label>
          <input type="number" step="0.5" min="0" max="45" id="run-base-long" name="recentLongRunKm" placeholder="e.g. 7" value="${us.recentLongRunKm ?? ''}" required />
        </div>
        <div style="display:flex; align-items:flex-end; gap:8px;">
          <button type="submit" class="btn-primary">Save Base Mileage</button>
          <button type="button" class="btn-secondary" data-action="auto-scale-running-plan" title="Scale provisional distances conservatively to match your recent long run">Scale Plan to My Base</button>
        </div>
      </form>
    </div>

    <div class="dashboard-grid" style="margin-bottom:16px;">
      <!-- Log Run Form -->
      <section class="card" aria-labelledby="run-log-form-title">
        <div class="card-header">
          <h3 class="card-title" id="run-log-form-title">${existingRun ? `Edit Run (${existingRun.date})` : `2. Log Run (${dateStr})`}</h3>
          <span class="badge badge-run" id="live-pace-badge">Pace: ${livePace}</span>
        </div>

        <form data-form="run-log-form" id="run-logger-form">
          <input type="hidden" name="runId" value="${existingRun ? existingRun.id : ''}" />
          <div class="form-grid">
            <div>
              <label for="run-date">Date</label>
              <input type="date" id="run-date" name="date" value="${existingRun ? existingRun.date : dateStr}" required />
            </div>
            <div>
              <label for="run-type">Session Type</label>
              <select id="run-type" name="sessionType">
                <option value="easy" ${defaultType === 'easy' ? 'selected' : ''}>Easy Aerobic Run (3–4/10)</option>
                <option value="interval" ${defaultType === 'interval' ? 'selected' : ''}>Intervals (8/10 controlled)</option>
                <option value="tempo" ${defaultType === 'tempo' ? 'selected' : ''}>Tempo Run (7/10)</option>
                <option value="long" ${defaultType === 'long' ? 'selected' : ''}>Long Easy Run (3–4/10)</option>
                <option value="recovery" ${defaultType === 'recovery' ? 'selected' : ''}>Recovery Jog</option>
                <option value="other" ${defaultType === 'other' ? 'selected' : ''}>Other / Assessment</option>
              </select>
            </div>
            <div>
              <label for="run-dist">Distance (km)</label>
              <input type="number" step="0.01" min="0.1" max="100" id="run-dist" name="distanceKm" value="${defaultDist}" required />
            </div>
            <div>
              <label for="run-mins">Duration (Minutes)</label>
              <input type="number" step="1" min="0" max="600" id="run-mins" name="durationMinutes" value="${defaultMins}" required />
            </div>
            <div>
              <label for="run-secs">Duration (Seconds)</label>
              <input type="number" step="1" min="0" max="59" id="run-secs" name="durationSecondsPart" value="${defaultSecs}" required />
            </div>
            <div>
              <label for="run-pace-readonly">Calculated Avg Pace</label>
              <input type="text" id="run-pace-readonly" value="${livePace}" readonly aria-readonly="true" style="font-weight:700; color:var(--accent-primary);" />
            </div>
            <div>
              <label for="run-hr">Avg Heart Rate (bpm, optional)</label>
              <input type="number" min="40" max="230" id="run-hr" name="averageHeartRate" placeholder="e.g. 148" value="${existingRun?.averageHeartRate ?? ''}" />
            </div>
            <div>
              <label for="run-effort">Effort Rating (1–10)</label>
              <input type="number" min="1" max="10" id="run-effort" name="effort" value="${existingRun?.effort ?? (defaultType === 'easy' || defaultType === 'long' ? 4 : (defaultType === 'tempo' ? 7 : 8))}" required />
            </div>
            <div>
              <label for="run-surface">Route / Surface</label>
              <input type="text" id="run-surface" name="routeSurface" placeholder="Road, Park, Track, Treadmill…" value="${escapeHtml(existingRun?.routeSurface ?? 'Road')}" />
            </div>
            <div>
              <label for="run-status">Session Status</label>
              <select id="run-status" name="status">
                <option value="completed" ${(!existingRun || existingRun.status === 'completed') ? 'selected' : ''}>Completed</option>
                <option value="modified" ${existingRun?.status === 'modified' ? 'selected' : ''}>Modified</option>
                <option value="skipped" ${existingRun?.status === 'skipped' ? 'selected' : ''}>Skipped</option>
              </select>
            </div>
          </div>

          <div style="margin-top:10px;">
            <label for="run-notes">Run Notes (splits, breathing, legs, weather)</label>
            <textarea id="run-notes" name="notes" placeholder="Optional notes…">${escapeHtml(existingRun?.notes ?? '')}</textarea>
          </div>

          <div id="run-validation-msg" class="alert-banner alert-safety hidden" style="margin-top:8px;"></div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">💾 Save Run Log</button>
            ${existingRun ? `<button type="button" class="btn-secondary" data-action="cancel-edit-run">Cancel Edit</button>` : ''}
          </div>
        </form>
      </section>

      <!-- Provisional Schedule & Effort Guidance -->
      <section class="card" aria-labelledby="run-plan-table-title">
        <div class="card-header">
          <h3 class="card-title" id="run-plan-table-title">3. 6-Week Running Programme</h3>
          <button type="button" class="btn-secondary btn-sm" data-nav-trigger="settings">Edit Plan in Settings →</button>
        </div>

        <div style="overflow-x:auto;">
          <table class="sets-table">
            <thead>
              <tr>
                <th>Week</th>
                <th>Tue: Easy Run</th>
                <th>Thu: Quality Session</th>
                <th>Sun: Long Run</th>
              </tr>
            </thead>
            <tbody>
              ${runScheduleRows}
              <tr>
                <td><strong>Jan 5</strong></td>
                <td colspan="3">Easy Run (4 km) &amp; Final Assessment Progress Review</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top:auto; padding-top:8px; border-top:1px solid var(--border-subtle);">
          <div style="font-size:0.82rem; font-weight:700; margin-bottom:6px;">Effort Guidance:</div>
          ${RUNNING_EFFORT_GUIDANCE.map(g => `
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:3px;">
              • <strong>${escapeHtml(g.type)} (${escapeHtml(g.effort)}):</strong> ${escapeHtml(g.description)}
            </div>
          `).join('')}
        </div>
      </section>
    </div>

    <!-- Logged Runs History -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Logged Runs History (${sortedRuns.length})</h3>
      </div>
      ${runHistoryHtml}
    </div>
  `;
}

// ============================================================================
// 5. NUTRITION VIEW (Section 4)
// ============================================================================
function renderNutritionView() {
  const dateStr = appState.activeDate;
  const nut = getNutritionSummary(appState, dateStr);
  const log = nut.todayLog;

  const calPct = Math.min(100, Math.round((log.caloriesKcal / nut.targets.calories) * 100));
  const proPct = Math.min(100, Math.round((log.proteinG / nut.targets.protein) * 100));
  const carbPct = Math.min(100, Math.round((log.carbohydrateG / nut.targets.carbs) * 100));
  const fatPct = Math.min(100, Math.round((log.fatG / nut.targets.fat) * 100));
  const waterPct = Math.min(100, Math.round((log.waterL / nut.targets.water) * 100));

  const warningsHtml = nut.warnings.map(w => `
    <div class="alert-banner alert-warn" style="margin-bottom:12px;">
      <strong>⚠️ ${escapeHtml(w.title)}:</strong> ${escapeHtml(w.message)}
    </div>
  `).join('');

  const entriesList = Array.isArray(log.entries) && log.entries.length > 0
    ? `
      <div style="overflow-x:auto;">
        <table class="sets-table">
          <thead>
            <tr>
              <th>Meal / Portion Note</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fat</th>
              <th>Water</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${log.entries.map(e => `
              <tr>
                <td><strong>${escapeHtml(e.name)}</strong></td>
                <td>${e.caloriesKcal} kcal</td>
                <td><strong>${e.proteinG} g</strong></td>
                <td>${e.carbohydrateG} g</td>
                <td>${e.fatG} g</td>
                <td>${e.waterL ? e.waterL + ' L' : '—'}</td>
                <td>
                  <button type="button" class="btn-danger btn-sm" data-action="delete-meal-entry" data-entry-id="${e.id}">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
    : `<p style="margin:0; font-size:0.88rem; color:var(--text-secondary);">No individual meal/portion entries logged for ${dateStr} yet. Log a portion above, tap a Quick-Add preset, or edit daily totals directly.</p>`;

  return `
    <div class="section-header">
      <div>
        <h2 class="section-title">Nutrition &amp; Macro Tracker — ${formatHumanDate(dateStr)}</h2>
        <p class="section-subtitle">Portion &amp; macro control without requiring a rigid meal plan or barcode scanner.</p>
      </div>
    </div>

    ${warningsHtml}

    <div class="dashboard-grid" style="margin-bottom:16px;">
      <!-- Daily Totals vs Targets -->
      <section class="card" aria-labelledby="nut-totals-title">
        <div class="card-header">
          <h3 class="card-title" id="nut-totals-title">1. Daily Totals vs Targets</h3>
          <span class="badge badge-planned">7d Avg: ${nut.weeklyAvgCalories} kcal · ${nut.weeklyAvgProtein}g P</span>
        </div>

        <div class="progress-group">
          <div class="progress-label-row">
            <span>Calories</span>
            <span><strong>${log.caloriesKcal}</strong> / ${nut.targets.calories} kcal (${nut.remaining.calories >= 0 ? nut.remaining.calories + ' kcal remaining' : Math.abs(nut.remaining.calories) + ' kcal over'})</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${calPct}%"></div></div>
        </div>

        <div class="progress-group">
          <div class="progress-label-row">
            <span>Protein (140–160g goal band)</span>
            <span><strong>${log.proteinG} g</strong> / ${nut.targets.protein} g (${nut.remaining.protein >= 0 ? nut.remaining.protein + ' g remaining' : '+' + Math.abs(nut.remaining.protein) + ' g'})</span>
          </div>
          <div class="progress-track"><div class="progress-fill fill-protein" style="width:${proPct}%"></div></div>
        </div>

        <div class="progress-group">
          <div class="progress-label-row">
            <span>Carbohydrates</span>
            <span><strong>${log.carbohydrateG} g</strong> / ${nut.targets.carbs} g (${nut.remaining.carbs >= 0 ? nut.remaining.carbs + ' g remaining' : '+' + Math.abs(nut.remaining.carbs) + ' g'})</span>
          </div>
          <div class="progress-track"><div class="progress-fill fill-carbs" style="width:${carbPct}%"></div></div>
        </div>

        <div class="progress-group">
          <div class="progress-label-row">
            <span>Fat</span>
            <span><strong>${log.fatG} g</strong> / ${nut.targets.fat} g (${nut.remaining.fat >= 0 ? nut.remaining.fat + ' g remaining' : '+' + Math.abs(nut.remaining.fat) + ' g'})</span>
          </div>
          <div class="progress-track"><div class="progress-fill fill-fat" style="width:${fatPct}%"></div></div>
        </div>

        <div class="progress-group">
          <div class="progress-label-row">
            <span>Hydration (Target 2.5–3.5 L)</span>
            <span><strong>${log.waterL} L</strong> / ${nut.targets.water} L</span>
          </div>
          <div class="progress-track"><div class="progress-fill fill-water" style="width:${waterPct}%"></div></div>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">
          <button type="button" class="btn-chip" data-action="quick-water" data-water="0.25">+250 ml</button>
          <button type="button" class="btn-chip" data-action="quick-water" data-water="0.5">+500 ml</button>
          <button type="button" class="btn-chip" data-action="quick-water" data-water="0.75">+750 ml</button>
          <button type="button" class="btn-chip" data-action="quick-water" data-water="-0.25">-250 ml</button>
        </div>

        <div class="alert-banner" style="font-size:0.78rem; margin-top:auto;">
          <strong>Macro Arithmetic Note (4/9/4 kcal/g):</strong>
          Target macros (${nut.targets.protein}g P × 4 + ${nut.targets.fat}g F × 9 + ${nut.targets.carbs}g C × 4) = <strong>${nut.macroArithmeticKcal} kcal</strong> vs your set Calorie Target of <strong>${nut.targets.calories} kcal</strong>.
          Today's logged macros equal <strong>${nut.loggedTodayMacroKcal} kcal</strong>.
        </div>
      </section>

      <!-- Log Macros / Meal Portion -->
      <section class="card" aria-labelledby="nut-add-title">
        <div class="card-header">
          <h3 class="card-title" id="nut-add-title">2. Log Macros / Meal Portion</h3>
          <button type="button" class="btn-chip" id="btn-calc-meal-kcal">Calc kcal from P/C/F (4/9/4)</button>
        </div>

        <form data-form="add-nutrition-entry" id="nutrition-entry-form">
          <div class="form-grid">
            <div style="grid-column: 1 / -1;">
              <label for="meal-name">Meal Name / Notes (optional)</label>
              <input type="text" id="meal-name" name="name" placeholder="e.g. Lunch portion, Post-gym shake, Dinner macros…" />
            </div>
            <div>
              <label for="meal-pro">Protein (g)</label>
              <input type="number" step="0.5" min="0" max="300" id="meal-pro" name="proteinG" placeholder="0" required />
            </div>
            <div>
              <label for="meal-carb">Carbohydrates (g)</label>
              <input type="number" step="0.5" min="0" max="500" id="meal-carb" name="carbohydrateG" placeholder="0" required />
            </div>
            <div>
              <label for="meal-fat">Fat (g)</label>
              <input type="number" step="0.5" min="0" max="200" id="meal-fat" name="fatG" placeholder="0" required />
            </div>
            <div>
              <label for="meal-cal">Calories (kcal)</label>
              <input type="number" step="1" min="0" max="5000" id="meal-cal" name="caloriesKcal" placeholder="Auto or manual" required />
            </div>
            <div>
              <label for="meal-water">Water (L, optional)</label>
              <input type="number" step="0.1" min="0" max="10" id="meal-water" name="waterL" placeholder="0.0" />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">+ Add Entry to ${dateStr}</button>
            <button type="button" class="btn-secondary" id="btn-save-as-preset">Save as Quick-Add Preset</button>
          </div>
        </form>

        <hr style="border:none; border-top:1px solid var(--border-subtle); width:100%; margin:8px 0;" />

        <div style="font-size:0.84rem; font-weight:700; color:var(--text-secondary);">Or Edit Direct Daily Totals (${dateStr}):</div>
        <form data-form="direct-daily-macros" class="form-grid">
          <div>
            <label for="dir-cal">Total kcal</label>
            <input type="number" id="dir-cal" name="caloriesKcal" min="0" value="${log.caloriesKcal}" />
          </div>
          <div>
            <label for="dir-pro">Total Protein (g)</label>
            <input type="number" step="0.5" id="dir-pro" name="proteinG" min="0" value="${log.proteinG}" />
          </div>
          <div>
            <label for="dir-carb">Total Carbs (g)</label>
            <input type="number" step="0.5" id="dir-carb" name="carbohydrateG" min="0" value="${log.carbohydrateG}" />
          </div>
          <div>
            <label for="dir-fat">Total Fat (g)</label>
            <input type="number" step="0.5" id="dir-fat" name="fatG" min="0" value="${log.fatG}" />
          </div>
          <div>
            <label for="dir-water">Total Water (L)</label>
            <input type="number" step="0.1" id="dir-water" name="waterL" min="0" value="${log.waterL}" />
          </div>
          <div style="display:flex; align-items:flex-end;">
            <button type="submit" class="btn-secondary" style="width:100%;">Update Totals</button>
          </div>
        </form>
      </section>
    </div>

    <!-- Quick-Add Presets (Editable) -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <h3 class="card-title">3. Quick-Add Food &amp; Portion List (Tap to Log)</h3>
        <span style="font-size:0.78rem; color:var(--text-secondary);">Editable presets</span>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${appState.mealPresets.map(p => `
          <div style="display:inline-flex; align-items:center; background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:999px; padding:2px 6px 2px 12px; gap:6px;">
            <button type="button" data-action="log-meal-preset" data-preset-id="${p.id}" style="background:transparent; border:none; color:var(--text-primary); font-weight:600; font-size:0.82rem; cursor:pointer; padding:6px 0;">
              + ${escapeHtml(p.name)} <span style="color:var(--text-secondary);">(${p.caloriesKcal} kcal · ${p.proteinG}g P)</span>
            </button>
            <button type="button" data-action="delete-meal-preset" data-preset-id="${p.id}" title="Remove preset" aria-label="Remove ${escapeHtml(p.name)} preset" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:0.85rem; padding:4px;">✕</button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Logged Entries on Selected Date -->
    <div class="card">
      <h3 class="card-title">4. Logged Entries for ${dateStr}</h3>
      ${entriesList}
    </div>
  `;
}

// ============================================================================
// 6. TO-DO & HABITS VIEW (Section 8)
// ============================================================================
function renderHabitsView() {
  const dateStr = appState.activeDate;
  const status = getHabitStatusForDate(appState, dateStr);
  const monday = getMondayOfWeek(dateStr);

  // Calculate active days & non-shaming streak
  let streak = 0;
  let cursor = dateStr;
  for (let i = 0; i < 60; i++) {
    const st = getHabitStatusForDate(appState, cursor);
    if (st.completedCount >= 3) {
      streak++;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }
  const totalLoggedDays = new Set([
    ...Object.keys(appState.habitLogs),
    ...Object.keys(appState.dailyLogs)
  ]).size;

  // Weekly consistency matrix
  const weekDays = [];
  let weekTotalChecks = 0;
  let weekPossibleChecks = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDays(monday, i);
    const st = getHabitStatusForDate(appState, d);
    weekTotalChecks += st.completedCount;
    weekPossibleChecks += st.totalCount;
    weekDays.push({ date: d, status: st });
  }
  const weeklyConsistencyPct = weekPossibleChecks > 0 ? Math.round((weekTotalChecks / weekPossibleChecks) * 100) : 0;

  const coreList = status.items.filter(i => i.category === 'core');
  const optionalList = status.items.filter(i => i.category !== 'core');

  const renderHabitRow = (h) => `
    <div class="habit-row ${h.completed ? 'habit-completed' : ''}">
      <button type="button" class="habit-check-btn" data-action="toggle-habit" data-habit-id="${h.id}">
        <span class="habit-box" aria-hidden="true">${h.completed ? '✓' : ''}</span>
        <span>
          ${escapeHtml(h.title)}
          ${h.isAutoSuggested ? `<span class="badge badge-completed" style="margin-left:6px;">Auto-verified from logs</span>` : ''}
        </span>
      </button>
      <div style="display:flex; gap:4px;">
        <button type="button" class="btn-icon btn-sm" data-action="edit-habit-title" data-habit-id="${h.id}" title="Edit Habit" aria-label="Edit ${escapeHtml(h.title)}">✎</button>
        <button type="button" class="btn-icon btn-sm" data-action="delete-habit" data-habit-id="${h.id}" title="Delete Habit" aria-label="Delete ${escapeHtml(h.title)}">🗑</button>
      </div>
    </div>
  `;

  return `
    <div class="section-header">
      <div>
        <h2 class="section-title">Daily To-Do &amp; Habit Tracker — ${formatHumanDate(dateStr)}</h2>
        <p class="section-subtitle">Consistent daily actions build results. Missed a day? Resume today without resetting your cumulative progress.</p>
      </div>
      <button type="button" class="btn-secondary btn-sm" data-action="auto-sync-habits" data-date="${dateStr}">
        ⚡ Sync Checks from Today's Logs
      </button>
    </div>

    <div class="stat-grid" style="margin-bottom:16px;">
      <div class="stat-box">
        <div class="stat-label">Today's Completion</div>
        <div class="stat-value">${status.completionPct}%</div>
        <div class="stat-sub">${status.completedCount} of ${status.totalCount} habits done</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Weekly Consistency</div>
        <div class="stat-value">${weeklyConsistencyPct}%</div>
        <div class="stat-sub">Week of ${formatShortDate(monday)}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Current Momentum Streak</div>
        <div class="stat-value">${streak} day${streak === 1 ? '' : 's'}</div>
        <div class="stat-sub">≥3 habits/day</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Total Active Days</div>
        <div class="stat-value">${totalLoggedDays}</div>
        <div class="stat-sub">Cumulative progress saved</div>
      </div>
    </div>

    <div class="dashboard-grid" style="margin-bottom:16px;">
      <section class="card" aria-labelledby="core-habits-title">
        <div class="card-header">
          <h3 class="card-title" id="core-habits-title">Core Daily Habits (7)</h3>
          <span class="badge badge-completed">${coreList.filter(i => i.completed).length} / ${coreList.length}</span>
        </div>
        <div class="habit-list">
          ${coreList.map(renderHabitRow).join('')}
        </div>
      </section>

      <section class="card" aria-labelledby="opt-habits-title">
        <div class="card-header">
          <h3 class="card-title" id="opt-habits-title">Additional / Bonus Habits</h3>
          <span class="badge badge-planned">${optionalList.filter(i => i.completed).length} / ${optionalList.length}</span>
        </div>
        <div class="habit-list">
          ${optionalList.map(renderHabitRow).join('')}
        </div>

        <form data-form="add-custom-habit" style="margin-top:auto; padding-top:12px; border-top:1px solid var(--border-subtle); display:flex; gap:8px; flex-wrap:wrap;">
          <input type="text" name="title" placeholder="Add new custom habit…" required style="flex:1; min-width:180px;" aria-label="New habit title" />
          <select name="category" style="width:auto;" aria-label="Habit category">
            <option value="core">Core</option>
            <option value="optional" selected>Bonus / Optional</option>
          </select>
          <button type="submit" class="btn-primary btn-sm">+ Add Habit</button>
        </form>
      </section>
    </div>

    <!-- 7-Day Habit Consistency Grid -->
    <div class="card">
      <h3 class="card-title">This Week's Habit Consistency (${formatShortDate(monday)} – ${formatShortDate(addDays(monday, 6))})</h3>
      <div style="overflow-x:auto;">
        <table class="sets-table">
          <thead>
            <tr>
              <th>Habit</th>
              ${weekDays.map(wd => `<th style="text-align:center;">${formatHumanDate(wd.date, { weekday: 'short', day: 'numeric' })}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${status.items.map(h => `
              <tr>
                <td><strong>${escapeHtml(h.title)}</strong></td>
                ${weekDays.map(wd => {
                  const found = wd.status.items.find(x => x.id === h.id);
                  const done = found && found.completed;
                  return `<td style="text-align:center;">
                    <button type="button" class="btn-chip ${done ? 'active' : ''}" data-action="toggle-habit-date" data-date="${wd.date}" data-habit-id="${h.id}" aria-label="${escapeHtml(h.title)} on ${wd.date}">
                      ${done ? '✓' : '·'}
                    </button>
                  </td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================================
// 7. PROGRESS & CHARTS VIEW (Sections 9 & 10)
// ============================================================================
function renderProgressView() {
  const dateStr = appState.activeDate;
  const daily = getDailyLog(appState, dateStr);
  const mLog = appState.measurementLogs[dateStr] || {};
  const weightTrend = getWeightTrendSummary(appState, dateStr);
  const isMonday = getDayOfWeekIndex(dateStr) === 0;

  // Gather unique exercise names for Exercise Load History Chart dropdown
  const exerciseNamesSet = new Set([
    'Barbell bench press', 'Lat pulldown', 'Squat', 'Dumbbell shoulder press',
    'Romanian deadlift', 'Incline dumbbell press', 'Seated cable row', 'Leg press',
    'Bulgarian split squat', 'Chest-supported row', 'Machine chest press'
  ]);
  Object.values(appState.workoutSessions).forEach(ws => {
    (ws.exercises || []).forEach(ex => {
      if (ex.exerciseName) exerciseNamesSet.add(ex.exerciseName);
    });
  });
  const exerciseOptions = Array.from(exerciseNamesSet);

  const measurementEntries = Object.values(appState.measurementLogs)
    .filter(m => m && (m.weightKg || m.waistCm || m.chestCm || m.hipsCm || m.restingHeartRate || m.bodyFatEstimate || m.photoReference))
    .sort((a, b) => b.date.localeCompare(a.date));

  return `
    <div class="section-header">
      <div>
        <h2 class="section-title">Progress, Body Measurements &amp; Analytics</h2>
        <p class="section-subtitle">Compare 7-day rolling weight averages rather than single-day scale fluctuations (water, glycogen, food volume).</p>
      </div>
    </div>

    <!-- Weekly Weigh-in & Measurement Prompt -->
    <div class="alert-banner ${isMonday ? 'alert-info' : ''}" style="margin-bottom:16px;">
      <strong>📏 Weekly Measurement Check-In (${isMonday ? 'Today is Monday!' : 'Recommended Every Monday Morning'}):</strong>
      Record body weight and waist circumference on Monday mornings after waking and using the bathroom, before eating or drinking, for consistent comparisons.
    </div>

    <!-- Log Body Measurements Form -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <h3 class="card-title">Log Body Measurements &amp; Private Progress Photo (${dateStr})</h3>
        <span class="badge badge-planned">Stored locally on device</span>
      </div>
      <form data-form="measurement-log-form">
        <div class="form-grid">
          <div>
            <label for="meas-weight">Body Weight (kg)</label>
            <input type="number" step="0.1" min="30" max="250" id="meas-weight" name="weightKg" placeholder="e.g. 74.5" value="${mLog.weightKg ?? daily.weightKg ?? ''}" />
          </div>
          <div>
            <label for="meas-waist">Waist (cm)</label>
            <input type="number" step="0.1" min="40" max="200" id="meas-waist" name="waistCm" placeholder="e.g. 88.0" value="${mLog.waistCm ?? ''}" />
          </div>
          <div>
            <label for="meas-chest">Chest (cm)</label>
            <input type="number" step="0.1" min="50" max="200" id="meas-chest" name="chestCm" placeholder="e.g. 100.0" value="${mLog.chestCm ?? ''}" />
          </div>
          <div>
            <label for="meas-hips">Hips (cm)</label>
            <input type="number" step="0.1" min="50" max="200" id="meas-hips" name="hipsCm" placeholder="e.g. 97.0" value="${mLog.hipsCm ?? ''}" />
          </div>
          <div>
            <label for="meas-rhr">Resting Heart Rate (bpm)</label>
            <input type="number" min="30" max="150" id="meas-rhr" name="restingHeartRate" placeholder="e.g. 58" value="${mLog.restingHeartRate ?? ''}" />
          </div>
          <div>
            <label for="meas-sleep">Average Sleep (hours)</label>
            <input type="number" step="0.25" min="0" max="24" id="meas-sleep" name="sleepHours" placeholder="e.g. 8.0" value="${mLog.sleepHours ?? daily.sleepHours ?? ''}" />
          </div>
          <div>
            <label for="meas-bf">Body-Fat Estimate (%, user est.)</label>
            <input type="number" step="0.5" min="3" max="65" id="meas-bf" name="bodyFatEstimate" placeholder="e.g. 29.5" value="${mLog.bodyFatEstimate ?? ''}" />
          </div>
          <div>
            <label for="meas-photo">Progress Photo (Optional, Private)</label>
            <input type="file" accept="image/*" id="meas-photo" data-action="upload-progress-photo" style="padding:6px;" />
          </div>
        </div>
        ${mLog.photoReference ? `
          <div style="margin-top:10px; display:flex; align-items:center; gap:12px;">
            <img src="${mLog.photoReference}" alt="Progress photo for ${dateStr}" style="width:72px; height:72px; object-fit:cover; border-radius:8px; border:1px solid var(--border-strong);" />
            <button type="button" class="btn-danger btn-sm" data-action="remove-progress-photo" data-date="${dateStr}">Remove Photo</button>
          </div>
        ` : ''}
        <div class="form-actions">
          <button type="submit" class="btn-primary">💾 Save Measurements for ${dateStr}</button>
        </div>
      </form>
    </div>

    <!-- 6 Required Interactive Charts Grid -->
    <div class="dashboard-grid" style="margin-bottom:16px;">
      <!-- Chart 1: Weight & 7-Day Rolling Avg -->
      <section class="card" aria-labelledby="chart-weight-title">
        <div class="card-header">
          <h3 class="card-title" id="chart-weight-title">1. Daily Weight &amp; 7-Day Rolling Average</h3>
          <span class="badge badge-planned">7d Avg: ${weightTrend.rolling7DayAvgKg ? weightTrend.rolling7DayAvgKg + ' kg' : '—'}</span>
        </div>
        ${renderWeightChartSvg(appState)}
        <p style="margin:0; font-size:0.78rem; color:var(--text-secondary);">
          Short-term scale changes reflect water, glycogen, sodium, and food volume—never assume a single day's drop or spike is all fat. Optional goal range: ${appState.userSettings.targetWeightMinKg}–${appState.userSettings.targetWeightMaxKg} kg.
        </p>
      </section>

      <!-- Chart 2: Waist Measurement Over Time -->
      <section class="card" aria-labelledby="chart-waist-title">
        <div class="card-header">
          <h3 class="card-title" id="chart-waist-title">2. Waist Measurement Over Time (cm)</h3>
        </div>
        ${renderWaistChartSvg(appState)}
      </section>

      <!-- Chart 3: Calories and Protein by Day -->
      <section class="card" aria-labelledby="chart-nut-title">
        <div class="card-header">
          <h3 class="card-title" id="chart-nut-title">3. Calories &amp; Protein by Day</h3>
        </div>
        ${renderNutritionChartSvg(appState)}
      </section>

      <!-- Chart 4: Weekly Running Distance -->
      <section class="card" aria-labelledby="chart-run-title">
        <div class="card-header">
          <h3 class="card-title" id="chart-run-title">4. Weekly Running Distance (km)</h3>
        </div>
        ${renderWeeklyRunningChartSvg(appState)}
      </section>

      <!-- Chart 5: Gym Exercise Load / Performance History -->
      <section class="card" aria-labelledby="chart-gym-title">
        <div class="card-header" style="flex-wrap:wrap;">
          <h3 class="card-title" id="chart-gym-title">5. Gym Exercise Load History</h3>
          <select aria-label="Select exercise for load chart" data-action="change-chart-exercise" style="width:auto; min-height:34px; font-size:0.82rem;">
            ${exerciseOptions.map(name => `<option value="${escapeHtml(name)}" ${name === selectedChartExercise ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')}
          </select>
        </div>
        ${renderGymLoadChartSvg(appState, selectedChartExercise)}
      </section>

      <!-- Chart 6: Habit Completion by Week -->
      <section class="card" aria-labelledby="chart-habit-title">
        <div class="card-header">
          <h3 class="card-title" id="chart-habit-title">6. Habit Completion by Week (%)</h3>
        </div>
        ${renderHabitWeeklyChartSvg(appState)}
      </section>
    </div>

    <!-- Progress Rules & Recovery/Supplement Guidance (Sections 9 & 10) -->
    <div class="dashboard-grid" style="margin-bottom:16px;">
      <section class="card" aria-labelledby="prog-rules-title">
        <h3 class="card-title" id="prog-rules-title">📋 Evidence-Based Progress &amp; Adjustment Rules</h3>
        <ul style="margin:0; padding-left:20px; font-size:0.86rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
          ${PROGRESS_RULES.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
        </ul>
      </section>

      <section class="card" aria-labelledby="rec-safety-title">
        <h3 class="card-title" id="rec-safety-title">🛡️ Recovery, Safety &amp; Supplement Notes</h3>
        <div style="font-size:0.84rem; font-weight:700;">Recovery &amp; Medical Safety Reminders:</div>
        <ul style="margin:0; padding-left:20px; font-size:0.83rem; color:var(--text-secondary);">
          ${RECOVERY_AND_SAFETY_NOTES.reminders.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
        </ul>
        <div style="font-size:0.84rem; font-weight:700; margin-top:6px;">Optional Supplement Notes:</div>
        <ul style="margin:0; padding-left:20px; font-size:0.83rem; color:var(--text-secondary);">
          ${RECOVERY_AND_SAFETY_NOTES.supplements.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
        </ul>
      </section>
    </div>

    <!-- Logged Measurements History Table -->
    <div class="card">
      <h3 class="card-title">Logged Measurements History (${measurementEntries.length})</h3>
      ${measurementEntries.length === 0 ? `<p style="margin:0; font-size:0.88rem; color:var(--text-secondary);">No measurements logged yet.</p>` : `
        <div style="overflow-x:auto;">
          <table class="sets-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th>Waist (cm)</th>
                <th>Chest (cm)</th>
                <th>Hips (cm)</th>
                <th>RHR (bpm)</th>
                <th>Sleep (h)</th>
                <th>Est. BF%</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              ${measurementEntries.map(m => `
                <tr>
                  <td><strong>${m.date}</strong></td>
                  <td>${m.weightKg ?? '—'}</td>
                  <td>${m.waistCm ?? '—'}</td>
                  <td>${m.chestCm ?? '—'}</td>
                  <td>${m.hipsCm ?? '—'}</td>
                  <td>${m.restingHeartRate ?? '—'}</td>
                  <td>${m.sleepHours ?? '—'}</td>
                  <td>${m.bodyFatEstimate ? m.bodyFatEstimate + '%' : '—'}</td>
                  <td>${m.photoReference ? `<img src="${m.photoReference}" alt="Progress ${m.date}" style="width:36px; height:36px; object-fit:cover; border-radius:4px;" />` : '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

// ============================================================================
// 8. SETTINGS VIEW (Section 13)
// ============================================================================
function renderSettingsView() {
  const us = appState.userSettings;
  const macroCalcKcal = (Number(us.proteinTargetG) * 4) + (Number(us.fatTargetG) * 9) + (Number(us.carbohydrateTargetG) * 4);

  return `
    <div class="section-header">
      <div>
        <h2 class="section-title">Settings, Programme Customisation &amp; Data Backup</h2>
        <p class="section-subtitle">Edit targets, gym templates, running schedule, units, or export/import your local data.</p>
      </div>
    </div>

    <!-- 1. Profile & Daily Targets -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <h3 class="card-title">1. Profile, Calorie &amp; Macro Targets</h3>
        <span class="badge badge-planned">Macro Sum (4/9/4): ${macroCalcKcal} kcal</span>
      </div>

      <form data-form="settings-profile-form">
        <div class="form-grid">
          <div>
            <label for="set-start-weight">Start Weight (kg)</label>
            <input type="number" step="0.1" id="set-start-weight" name="startingWeightKg" value="${us.startingWeightKg}" required />
          </div>
          <div>
            <label for="set-height">Height (cm)</label>
            <input type="number" id="set-height" name="heightCm" value="${us.heightCm}" required />
          </div>
          <div>
            <label for="set-bf">Initial Body Fat Estimate (%)</label>
            <input type="number" step="0.5" id="set-bf" name="estimatedBodyFatPct" value="${us.estimatedBodyFatPct}" />
          </div>
          <div>
            <label for="set-goal-min">Optional Goal Weight Min (kg)</label>
            <input type="number" step="0.5" id="set-goal-min" name="targetWeightMinKg" value="${us.targetWeightMinKg}" />
          </div>
          <div>
            <label for="set-goal-max">Optional Goal Weight Max (kg)</label>
            <input type="number" step="0.5" id="set-goal-max" name="targetWeightMaxKg" value="${us.targetWeightMaxKg}" />
          </div>
          <div>
            <label for="set-cal">Daily Calorie Target (kcal)</label>
            <input type="number" id="set-cal" name="calorieTarget" value="${us.calorieTarget}" required />
          </div>
          <div>
            <label for="set-pro">Protein Target (g)</label>
            <input type="number" id="set-pro" name="proteinTargetG" value="${us.proteinTargetG}" required />
          </div>
          <div>
            <label for="set-fat">Fat Target (g)</label>
            <input type="number" id="set-fat" name="fatTargetG" value="${us.fatTargetG}" required />
          </div>
          <div>
            <label for="set-carb">Carbohydrate Target (g)</label>
            <input type="number" id="set-carb" name="carbohydrateTargetG" value="${us.carbohydrateTargetG}" required />
          </div>
          <div>
            <label for="set-steps">Daily Steps Target</label>
            <input type="number" id="set-steps" name="stepTarget" value="${us.stepTarget}" required />
          </div>
          <div>
            <label for="set-water">Daily Water Target (L)</label>
            <input type="number" step="0.1" id="set-water" name="waterTargetL" value="${us.waterTargetL}" required />
          </div>
          <div>
            <label for="set-sleep">Daily Sleep Target (hours)</label>
            <input type="number" step="0.5" id="set-sleep" name="sleepTargetHours" value="${us.sleepTargetHours}" required />
          </div>
          <div>
            <label for="set-prog-start">Programme Start Date</label>
            <input type="date" id="set-prog-start" name="programmeStartDate" value="${us.programmeStartDate}" required />
          </div>
          <div>
            <label for="set-prog-end">Programme End Date</label>
            <input type="date" id="set-prog-end" name="programmeEndDate" value="${us.programmeEndDate}" required />
          </div>
          <div>
            <label for="set-units">Unit System</label>
            <select id="set-units" name="weightUnit">
              <option value="kg" ${us.weightUnit === 'kg' ? 'selected' : ''}>Metric (kg / km / cm)</option>
              <option value="lb" ${us.weightUnit === 'lb' ? 'selected' : ''}>Imperial Labels (lb / mi / in)</option>
            </select>
          </div>
          <div>
            <label for="set-time-fmt">Preferred Time Format</label>
            <select id="set-time-fmt" name="timeFormat">
              <option value="24h" ${us.timeFormat === '24h' ? 'selected' : ''}>24-hour (18:00)</option>
              <option value="12h" ${us.timeFormat === '12h' ? 'selected' : ''}>12-hour (6:00 PM)</option>
            </select>
          </div>
        </div>

        <div class="alert-banner" style="margin-top:12px; font-size:0.82rem;">
          <strong>Macro Arithmetic Transparency:</strong>
          <span id="settings-macro-calc-note">${us.proteinTargetG}g P + ${us.fatTargetG}g F + ${us.carbohydrateTargetG}g C = <strong>${macroCalcKcal} kcal</strong> (at 4/9/4 kcal/g). Changing your Calorie Target will never silently alter your macro targets.</span>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">💾 Save Profile &amp; Target Settings</button>
          <button type="button" class="btn-secondary" id="btn-sync-cal-to-macros">Set Calorie Target to Macro Sum (${macroCalcKcal} kcal)</button>
        </div>
      </form>
    </div>

    <!-- 2. Edit 6-Week Running Plan -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <h3 class="card-title">2. Customise 6-Week Running Schedule</h3>
      </div>
      <form data-form="settings-running-plan-form">
        <div style="overflow-x:auto;">
          <table class="sets-table">
            <thead>
              <tr>
                <th>Week</th>
                <th>Tue Easy Run (km)</th>
                <th>Thu Quality Session Label</th>
                <th>Quality Est. Distance (km)</th>
                <th>Sun Long Run (km)</th>
              </tr>
            </thead>
            <tbody>
              ${appState.runningPlan.map((rw, idx) => `
                <tr>
                  <td><strong>Week ${rw.weekNumber}</strong></td>
                  <td><input type="number" step="0.5" name="easyKm_${idx}" value="${rw.easyKm}" class="set-input" /></td>
                  <td><input type="text" name="qualityLabel_${idx}" value="${escapeHtml(rw.qualityLabel)}" /></td>
                  <td><input type="number" step="0.5" name="qualityEstimatedKm_${idx}" value="${rw.qualityEstimatedKm}" class="set-input" /></td>
                  <td><input type="number" step="0.5" name="longKm_${idx}" value="${rw.longKm}" class="set-input" /></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">💾 Save 6-Week Running Schedule</button>
        </div>
      </form>
    </div>

    <!-- 3. Edit Master Gym Workout Templates -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <h3 class="card-title">3. Customise Master Gym Templates (A / B / C)</h3>
        <span style="font-size:0.8rem; color:var(--text-secondary);">Edits apply to future/unstarted workout sessions</span>
      </div>
      <div class="dashboard-grid">
        ${['gym-a', 'gym-b', 'gym-c'].map(tplKey => {
          const tpl = appState.gymTemplates[tplKey];
          return `
            <div style="background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:12px;">
              <div style="font-weight:700; margin-bottom:8px;">${escapeHtml(tpl.name)} (${escapeHtml(tpl.dayLabel)})</div>
              ${tpl.exercises.map((ex, eIdx) => `
                <div style="display:grid; grid-template-columns: 1fr 58px 80px; gap:6px; margin-bottom:6px; align-items:center;">
                  <input type="text" value="${escapeHtml(ex.name)}" data-action="edit-tpl-ex" data-tpl="${tplKey}" data-idx="${eIdx}" data-field="name" aria-label="${tpl.name} exercise ${eIdx + 1} name" style="min-height:36px; font-size:0.82rem;" />
                  <input type="number" min="1" max="10" value="${ex.plannedSets}" data-action="edit-tpl-ex" data-tpl="${tplKey}" data-idx="${eIdx}" data-field="plannedSets" aria-label="Planned sets" style="min-height:36px; font-size:0.82rem; text-align:center;" />
                  <input type="text" value="${escapeHtml(ex.repTarget)}" data-action="edit-tpl-ex" data-tpl="${tplKey}" data-idx="${eIdx}" data-field="repTarget" aria-label="Rep target" style="min-height:36px; font-size:0.82rem;" />
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- 4. Firebase Cloud Firestore Sync & Local Backup (JSON / CSV) -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <h3 class="card-title">4. Firebase Cloud Sync &amp; Local Backups (JSON / CSV)</h3>
        <span class="badge badge-completed" id="settings-cloud-status">${escapeHtml(getCloudSyncStatus().status)}</span>
      </div>
      <p style="margin:0; font-size:0.86rem; color:var(--text-secondary);">
        Connected to Firebase project <strong>abhin-cut-tracker-2026</strong> (Cloud Firestore + LocalStorage + IndexedDB). Changes sync automatically while online and work offline at the gym.
      </p>
      <div class="form-actions">
        <button type="button" class="btn-primary" data-action="cloud-push-now">☁️ Sync to Firebase Now</button>
        <button type="button" class="btn-secondary" data-action="cloud-pull-now">⬇ Pull Latest from Firebase</button>
        <button type="button" class="btn-secondary" data-action="export-json">⬇ Export All Data (JSON)</button>
        <label class="btn-secondary" style="margin:0; cursor:pointer;">
          ⬆ Import JSON Backup File
          <input type="file" accept=".json,application/json" data-action="import-json-file" class="sr-only" />
        </label>
      </div>
      <div class="form-actions" style="margin-top:6px;">
        <button type="button" class="btn-secondary btn-sm" data-action="export-csv" data-csv-type="daily">📊 Export Daily &amp; Measurements CSV</button>
        <button type="button" class="btn-secondary btn-sm" data-action="export-csv" data-csv-type="workouts">🏋️ Export Gym Sets CSV</button>
        <button type="button" class="btn-secondary btn-sm" data-action="export-csv" data-csv-type="runs">🏃 Export Running Log CSV</button>
        <button type="button" class="btn-secondary btn-sm" data-action="export-csv" data-csv-type="habits">☑️ Export Habits CSV</button>
      </div>
    </div>

    <!-- 5. Reset Option with Explicit Confirmation -->
    <div class="card" style="border-color:var(--status-danger);">
      <h3 class="card-title" style="color:var(--status-danger);">5. Reset All Tracker Data</h3>
      <p style="margin:0; font-size:0.86rem; color:var(--text-secondary);">
        Erase all logged workouts, runs, nutrition entries, measurements, and custom settings and restore the factory initial 6-week programme. Requires explicit confirmation.
      </p>
      <div class="form-actions">
        <button type="button" class="btn-danger" data-action="open-reset-confirm-modal">⚠️ Reset All Data…</button>
      </div>
    </div>
  `;
}

// ============================================================================
// MODALS (Quick Log, Reschedule Session, Edit Calendar Day, Reset Confirmation)
// ============================================================================
function openModal(htmlContent) {
  const backdrop = document.getElementById('modal-backdrop');
  const content = document.getElementById('modal-content');
  if (!backdrop || !content) return;
  content.innerHTML = htmlContent;
  backdrop.classList.remove('hidden');
}

function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) backdrop.classList.add('hidden');
}

function openQuickLogModal() {
  const dateStr = appState.activeDate;
  const daily = getDailyLog(appState, dateStr);
  openModal(`
    <div class="card-header" style="margin-bottom:12px;">
      <h3 class="card-title" id="modal-title">⚡ Quick Log (${dateStr})</h3>
      <button type="button" class="btn-icon btn-sm" data-action="close-modal" aria-label="Close modal">✕</button>
    </div>
    <form data-form="modal-quick-log">
      <div class="form-grid">
        <div>
          <label for="mql-weight">Morning Weight (kg)</label>
          <input type="number" step="0.1" id="mql-weight" name="weightKg" value="${daily.weightKg ?? ''}" placeholder="e.g. 74.8" />
        </div>
        <div>
          <label for="mql-water">Add Water (L)</label>
          <input type="number" step="0.25" id="mql-water" name="addWaterL" placeholder="e.g. 0.5" />
        </div>
        <div>
          <label for="mql-cal">Add Calories (kcal)</label>
          <input type="number" id="mql-cal" name="addCaloriesKcal" placeholder="e.g. 450" />
        </div>
        <div>
          <label for="mql-pro">Add Protein (g)</label>
          <input type="number" step="0.5" id="mql-pro" name="addProteinG" placeholder="e.g. 35" />
        </div>
        <div>
          <label for="mql-carb">Add Carbs (g)</label>
          <input type="number" step="0.5" id="mql-carb" name="addCarbsG" placeholder="e.g. 45" />
        </div>
        <div>
          <label for="mql-fat">Add Fat (g)</label>
          <input type="number" step="0.5" id="mql-fat" name="addFatG" placeholder="e.g. 12" />
        </div>
        <div>
          <label for="mql-steps">Daily Steps</label>
          <input type="number" id="mql-steps" name="steps" value="${daily.steps ?? ''}" placeholder="e.g. 8500" />
        </div>
        <div>
          <label for="mql-sleep">Sleep (hours)</label>
          <input type="number" step="0.25" id="mql-sleep" name="sleepHours" value="${daily.sleepHours ?? ''}" placeholder="e.g. 8.0" />
        </div>
      </div>
      <div class="form-actions" style="margin-top:16px;">
        <button type="submit" class="btn-primary">Save Quick Log</button>
        <button type="button" class="btn-secondary" data-action="close-modal">Cancel</button>
      </div>
    </form>
  `);
}

function openRescheduleModal(sourceDate) {
  const session = getPlannedSessionForDate(appState, sourceDate);
  const nextDay = addDays(sourceDate, 1);
  openModal(`
    <div class="card-header" style="margin-bottom:12px;">
      <h3 class="card-title" id="modal-title">⇄ Reschedule Session (${sourceDate})</h3>
      <button type="button" class="btn-icon btn-sm" data-action="close-modal" aria-label="Close modal">✕</button>
    </div>
    <p style="font-size:0.88rem; color:var(--text-secondary);">
      Session: <strong>${escapeHtml(session.title)}</strong><br/>
      Original planned date (<strong>${session.originalPlannedDate || sourceDate}</strong>) will be preserved for your records.
    </p>
    <form data-form="reschedule-session-form">
      <input type="hidden" name="sourceDate" value="${sourceDate}" />
      <div class="form-grid">
        <div>
          <label for="resched-target">Target Date</label>
          <input type="date" id="resched-target" name="targetDate" value="${nextDay}" required />
        </div>
        <div>
          <label for="resched-mode">Reschedule Mode</label>
          <select id="resched-mode" name="mode">
            <option value="swap">Swap sessions between these two dates</option>
            <option value="move">Move to target date &amp; mark ${sourceDate} as Rest</option>
          </select>
        </div>
      </div>
      <div class="form-actions" style="margin-top:16px;">
        <button type="submit" class="btn-primary">Confirm Reschedule</button>
        <button type="button" class="btn-secondary" data-action="close-modal">Cancel</button>
      </div>
    </form>
  `);
}

function openEditDayModal(dateStr) {
  const session = getPlannedSessionForDate(appState, dateStr);
  openModal(`
    <div class="card-header" style="margin-bottom:12px;">
      <h3 class="card-title" id="modal-title">✎ Edit / Modify Planned Session (${dateStr})</h3>
      <button type="button" class="btn-icon btn-sm" data-action="close-modal" aria-label="Close modal">✕</button>
    </div>
    <form data-form="edit-calendar-day-form">
      <input type="hidden" name="date" value="${dateStr}" />
      <div class="form-grid">
        <div style="grid-column: 1 / -1;">
          <label for="ed-title">Session Title</label>
          <input type="text" id="ed-title" name="customTitle" value="${escapeHtml(session.title)}" required />
        </div>
        <div>
          <label for="ed-cat">Category</label>
          <select id="ed-cat" name="customCategory">
            <option value="gym" ${session.category === 'gym' ? 'selected' : ''}>Gym Workout</option>
            <option value="run" ${session.category === 'run' ? 'selected' : ''}>Running</option>
            <option value="rest" ${session.category === 'rest' ? 'selected' : ''}>Rest &amp; Mobility</option>
          </select>
        </div>
        <div>
          <label for="ed-status">Status</label>
          <select id="ed-status" name="status">
            <option value="planned" ${session.status === 'planned' ? 'selected' : ''}>Planned</option>
            <option value="completed" ${session.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="modified" ${session.status === 'modified' ? 'selected' : ''}>Modified</option>
            <option value="skipped" ${session.status === 'skipped' ? 'selected' : ''}>Skipped</option>
          </select>
        </div>
        <div style="grid-column: 1 / -1;">
          <label for="ed-sub">Details / Notes</label>
          <input type="text" id="ed-sub" name="customSubtitle" value="${escapeHtml(session.subtitle)}" />
        </div>
      </div>
      <div class="form-actions" style="margin-top:16px;">
        <button type="submit" class="btn-primary">Save Day Changes</button>
        <button type="button" class="btn-secondary" data-action="close-modal">Cancel</button>
      </div>
    </form>
  `);
}

function openResetConfirmModal() {
  openModal(`
    <div class="card-header" style="margin-bottom:12px;">
      <h3 class="card-title" id="modal-title" style="color:var(--status-danger);">⚠️ Confirm Full Data Reset</h3>
      <button type="button" class="btn-icon btn-sm" data-action="close-modal" aria-label="Close modal">✕</button>
    </div>
    <p style="font-size:0.9rem; color:var(--text-secondary);">
      Are you sure you want to permanently erase all logged workouts, runs, nutrition entries, habits, and measurements? This action cannot be undone unless you have exported a JSON backup.
    </p>
    <form data-form="confirm-reset-form">
      <div>
        <label for="reset-confirm-input">Type <strong>RESET</strong> to confirm</label>
        <input type="text" id="reset-confirm-input" name="confirmText" placeholder="RESET" required />
      </div>
      <div class="form-actions" style="margin-top:16px;">
        <button type="submit" class="btn-danger">Erase All Data &amp; Restore Defaults</button>
        <button type="button" class="btn-secondary" data-action="close-modal">Cancel</button>
      </div>
    </form>
  `);
}

// ============================================================================
// EVENT DELEGATION & HANDLERS
// ============================================================================
function bindGlobalEvents() {
  // Navigation clicks
  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      const target = navBtn.getAttribute('data-nav');
      navigateTo(target);
      return;
    }

    const navTrigger = e.target.closest('[data-nav-trigger]');
    if (navTrigger) {
      const target = navTrigger.getAttribute('data-nav-trigger');
      navigateTo(target);
      return;
    }

    const restBtn = e.target.closest('[data-rest-sec]');
    if (restBtn) {
      const sec = Number(restBtn.getAttribute('data-rest-sec')) || 90;
      startRestTimer(sec);
      showToast(`⏱️ Rest timer started: ${sec}s`);
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      handleActionClick(actionEl, e);
    }
  });

  // Header controls
  document.getElementById('btn-prev-day')?.addEventListener('click', () => {
    setActiveDate(addDays(appState.activeDate, -1));
  });
  document.getElementById('btn-next-day')?.addEventListener('click', () => {
    setActiveDate(addDays(appState.activeDate, 1));
  });
  document.getElementById('global-date-input')?.addEventListener('change', (e) => {
    if (e.target.value) setActiveDate(e.target.value);
  });
  document.getElementById('btn-jump-today')?.addEventListener('click', () => {
    setActiveDate(getTodayLocalStr());
  });
  document.getElementById('btn-jump-prog-start')?.addEventListener('click', () => {
    setActiveDate(appState.userSettings.programmeStartDate || '2026-11-23');
  });
  document.getElementById('btn-open-quick-log')?.addEventListener('click', () => {
    openQuickLogModal();
  });
  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    appState.userSettings.theme = appState.userSettings.theme === 'light' ? 'dark' : 'light';
    saveState(appState);
    applyTheme(appState.userSettings.theme);
  });
  document.getElementById('btn-toggle-timer-menu')?.addEventListener('click', () => {
    document.getElementById('rest-timer-popover')?.classList.toggle('hidden');
  });
  document.getElementById('btn-cancel-timer')?.addEventListener('click', () => {
    stopRestTimer();
    document.getElementById('rest-timer-popover')?.classList.add('hidden');
  });

  // Live input listeners (Pace calculation, set updates, macro calc)
  document.addEventListener('input', (e) => {
    const target = e.target;

    // Live run pace calculation
    if (target.id === 'run-dist' || target.id === 'run-mins' || target.id === 'run-secs') {
      const dist = Number(document.getElementById('run-dist')?.value) || 0;
      const mins = Number(document.getElementById('run-mins')?.value) || 0;
      const secs = Number(document.getElementById('run-secs')?.value) || 0;
      const dur = parseDurationInput(mins, secs);
      const { paceFormatted } = calculatePace(dist, dur);
      const paceInput = document.getElementById('run-pace-readonly');
      const paceBadge = document.getElementById('live-pace-badge');
      if (paceInput) paceInput.value = paceFormatted;
      if (paceBadge) paceBadge.textContent = `Pace: ${paceFormatted}`;
    }

    // Gym set inline inputs
    if (target.dataset.action === 'update-set-field') {
      const exIdx = Number(target.dataset.exIdx);
      const setIdx = Number(target.dataset.setIdx);
      const field = target.dataset.field;
      const ws = appState.workoutSessions[appState.activeDate];
      if (ws && ws.exercises[exIdx] && ws.exercises[exIdx].sets[setIdx]) {
        ws.exercises[exIdx].sets[setIdx][field] = target.value === '' ? '' : Number(target.value);
        saveState(appState);
      }
    }

    if (target.dataset.action === 'update-exercise-notes') {
      const exIdx = Number(target.dataset.exIdx);
      const ws = appState.workoutSessions[appState.activeDate];
      if (ws && ws.exercises[exIdx]) {
        ws.exercises[exIdx].notes = target.value;
        saveState(appState);
      }
    }

    if (target.dataset.action === 'update-workout-session-notes') {
      const ws = appState.workoutSessions[appState.activeDate];
      if (ws) {
        ws.notes = target.value;
        saveState(appState);
      }
    }

    // Settings live macro sum preview
    if (target.id === 'set-pro' || target.id === 'set-fat' || target.id === 'set-carb') {
      const p = Number(document.getElementById('set-pro')?.value) || 0;
      const f = Number(document.getElementById('set-fat')?.value) || 0;
      const c = Number(document.getElementById('set-carb')?.value) || 0;
      const sum = p * 4 + f * 9 + c * 4;
      const noteEl = document.getElementById('settings-macro-calc-note');
      if (noteEl) {
        noteEl.innerHTML = `${p}g P + ${f}g F + ${c}g C = <strong>${sum} kcal</strong> (at 4/9/4 kcal/g). Changing your Calorie Target will never silently alter your macro targets.`;
      }
      const syncBtn = document.getElementById('btn-sync-cal-to-macros');
      if (syncBtn) {
        syncBtn.textContent = `Set Calorie Target to Macro Sum (${sum} kcal)`;
      }
    }
  });

  // Change listeners (file uploads, selects, template edits)
  document.addEventListener('change', (e) => {
    const target = e.target;
    if (target.dataset.action === 'change-chart-exercise') {
      selectedChartExercise = target.value;
      renderCurrentView();
    } else if (target.dataset.action === 'upload-progress-photo') {
      const file = target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const d = appState.activeDate;
        const mLog = appState.measurementLogs[d] || { date: d };
        mLog.photoReference = reader.result;
        appState.measurementLogs[d] = mLog;
        saveState(appState);
        renderCurrentView();
        showToast('📷 Progress photo attached locally.');
      };
      reader.readAsDataURL(file);
    } else if (target.dataset.action === 'import-json-file') {
      const file = target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          const importedState = parsed.state ? parsed.state : parsed;
          appState = mergeWithDefaults(importedState);
          saveState(appState);
          applyTheme(appState.userSettings.theme);
          syncHeaderAndNavigation();
          renderCurrentView();
          showToast('✅ JSON Backup restored successfully!');
        } catch (err) {
          showToast('❌ Invalid JSON backup file.');
        }
      };
      reader.readAsText(file);
    } else if (target.dataset.action === 'edit-tpl-ex') {
      const tplKey = target.dataset.tpl;
      const idx = Number(target.dataset.idx);
      const field = target.dataset.field;
      const tpl = appState.gymTemplates[tplKey];
      if (tpl && tpl.exercises[idx]) {
        tpl.exercises[idx][field] = field === 'plannedSets' ? Number(target.value) : target.value;
        saveState(appState);
        showToast('Template updated.');
      }
    }
  });

  // Form submissions
  document.addEventListener('submit', (e) => {
    const form = e.target;
    const formType = form.getAttribute('data-form');
    if (!formType) return;
    e.preventDefault();
    handleFormSubmit(formType, form);
  });
}

function handleActionClick(el, event) {
  const action = el.getAttribute('data-action');
  const dateStr = el.getAttribute('data-date') || appState.activeDate;

  switch (action) {
    case 'close-modal':
      closeModal();
      break;

    case 'open-quick-log':
      openQuickLogModal();
      break;

    case 'jump-date': {
      const targetDate = el.getAttribute('data-date');
      if (targetDate) setActiveDate(targetDate);
      break;
    }

    case 'open-day-session': {
      const targetDate = el.getAttribute('data-date');
      const targetView = el.getAttribute('data-target') || 'workout';
      navigateTo(targetView, targetDate);
      break;
    }

    case 'quick-session-status': {
      const status = el.getAttribute('data-status') || 'completed';
      if (!appState.calendarOverrides[dateStr]) {
        appState.calendarOverrides[dateStr] = {};
      }
      appState.calendarOverrides[dateStr].status = status;
      if (appState.workoutSessions[dateStr]) {
        appState.workoutSessions[dateStr].status = status;
        if (status === 'completed') {
          appState.workoutSessions[dateStr].completedAt = new Date().toISOString();
        }
      }
      if (status === 'completed') {
        toggleHabitForDate(appState, dateStr, 'habit-workout', true);
      }
      saveState(appState);
      renderCurrentView();
      showToast(`Session on ${dateStr} marked as ${status}.`);
      break;
    }

    case 'open-reschedule-modal':
      openRescheduleModal(dateStr);
      break;

    case 'open-edit-day-modal':
      openEditDayModal(dateStr);
      break;

    case 'toggle-cal-mode':
      calendarViewMode = el.getAttribute('data-mode') || 'week';
      renderCurrentView();
      break;

    case 'set-cal-month':
      calendarMonthCursor = el.getAttribute('data-month') || '2026-11-01';
      renderCurrentView();
      break;

    case 'select-month-day': {
      const d = el.getAttribute('data-date');
      if (d) {
        appState.activeDate = d;
        saveState(appState);
        syncHeaderAndNavigation();
        openEditDayModal(d);
      }
      break;
    }

    // Water & Quick Preset on Dashboard / Nutrition
    case 'add-rest-time': {
      const addSec = Number(el.getAttribute('data-sec')) || 30;
      startRestTimer(restSecondsRemaining + addSec);
      showToast(`⏱️ Added +${addSec}s to Rest Timer`);
      break;
    }

    case 'quick-steps': {
      const log = getDailyLog(appState, dateStr);
      const setExact = el.getAttribute('data-steps-set');
      const addDelta = Number(el.getAttribute('data-steps')) || 0;
      const nextSteps = setExact ? Number(setExact) : (Number(log.steps) || 0) + addDelta;
      saveDailyLog(appState, dateStr, { steps: nextSteps });
      if (nextSteps >= 8000) {
        toggleHabitForDate(appState, dateStr, 'habit-steps', true);
      }
      renderCurrentView();
      showToast(`👟 Steps updated: ${nextSteps.toLocaleString()} steps`);
      break;
    }

    case 'quick-sleep': {
      const hrs = Number(el.getAttribute('data-sleep')) || 8;
      saveDailyLog(appState, dateStr, { sleepHours: hrs });
      if (hrs >= 7.5) {
        toggleHabitForDate(appState, dateStr, 'habit-sleep', true);
      }
      renderCurrentView();
      showToast(`😴 Logged ${hrs} hours of sleep`);
      break;
    }

    case 'step-set-weight': {
      const exIdx = Number(el.getAttribute('data-ex-idx'));
      const setIdx = Number(el.getAttribute('data-set-idx'));
      const delta = Number(el.getAttribute('data-delta')) || 0;
      const ws = appState.workoutSessions[dateStr];
      if (ws && ws.exercises[exIdx] && ws.exercises[exIdx].sets[setIdx]) {
        const curr = Number(ws.exercises[exIdx].sets[setIdx].weightKg) || 0;
        ws.exercises[exIdx].sets[setIdx].weightKg = Math.max(0, Math.round((curr + delta) * 10) / 10);
        saveState(appState);
        renderCurrentView();
      }
      break;
    }

    case 'quick-water': {
      const delta = Number(el.getAttribute('data-water')) || 0.25;
      const log = getDailyLog(appState, dateStr);
      const nextWater = Math.max(0, Math.round(((Number(log.waterL) || 0) + delta) * 100) / 100);
      log.manualWaterL = nextWater;
      saveDailyLog(appState, dateStr, { waterL: nextWater, manualWaterL: nextWater });
      renderCurrentView();
      showToast(`💧 Hydration updated: ${nextWater} L`);
      break;
    }

    case 'quick-preset-whey': {
      const preset = appState.mealPresets[0] || {
        name: 'Whey Protein Shake',
        caloriesKcal: 120,
        proteinG: 24,
        carbohydrateG: 3,
        fatG: 1.5
      };
      addNutritionEntry(appState, dateStr, preset);
      renderCurrentView();
      showToast(`Added ${preset.name} (+${preset.proteinG}g P)`);
      break;
    }

    case 'log-meal-preset': {
      const pid = el.getAttribute('data-preset-id');
      const preset = appState.mealPresets.find(p => p.id === pid);
      if (preset) {
        addNutritionEntry(appState, dateStr, preset);
        renderCurrentView();
        showToast(`Logged ${preset.name} (${preset.caloriesKcal} kcal, ${preset.proteinG}g P)`);
      }
      break;
    }

    case 'delete-meal-preset': {
      const pid = el.getAttribute('data-preset-id');
      appState.mealPresets = appState.mealPresets.filter(p => p.id !== pid);
      saveState(appState);
      renderCurrentView();
      showToast('Removed preset.');
      break;
    }

    case 'delete-meal-entry': {
      const eid = el.getAttribute('data-entry-id');
      deleteNutritionEntry(appState, dateStr, eid);
      renderCurrentView();
      showToast('Deleted nutrition entry.');
      break;
    }

    // Habits
    case 'toggle-habit': {
      const hid = el.getAttribute('data-habit-id');
      toggleHabitForDate(appState, dateStr, hid);
      renderCurrentView();
      break;
    }

    case 'toggle-habit-date': {
      const hid = el.getAttribute('data-habit-id');
      const d = el.getAttribute('data-date');
      toggleHabitForDate(appState, d, hid);
      renderCurrentView();
      break;
    }

    case 'auto-sync-habits': {
      const st = getHabitStatusForDate(appState, dateStr);
      if (!appState.habitLogs[dateStr]) appState.habitLogs[dateStr] = {};
      st.items.forEach(item => {
        if (item.completed) {
          appState.habitLogs[dateStr][item.id] = true;
        }
      });
      saveState(appState);
      renderCurrentView();
      showToast('Synced habit checkmarks with today’s logged metrics.');
      break;
    }

    case 'edit-habit-title': {
      const hid = el.getAttribute('data-habit-id');
      const habit = appState.habits.find(h => h.id === hid);
      if (!habit) return;
      openModal(`
        <div class="card-header" style="margin-bottom:12px;">
          <h3 class="card-title" id="modal-title">✎ Edit Habit</h3>
          <button type="button" class="btn-icon btn-sm" data-action="close-modal">✕</button>
        </div>
        <form data-form="edit-habit-modal-form">
          <input type="hidden" name="habitId" value="${escapeHtml(hid)}" />
          <div>
            <label for="edit-habit-input">Habit Description</label>
            <input type="text" id="edit-habit-input" name="title" value="${escapeHtml(habit.title)}" required />
          </div>
          <div class="form-actions" style="margin-top:14px;">
            <button type="submit" class="btn-primary">Save Habit</button>
            <button type="button" class="btn-secondary" data-action="close-modal">Cancel</button>
          </div>
        </form>
      `);
      break;
    }

    case 'delete-habit': {
      const hid = el.getAttribute('data-habit-id');
      appState.habits = appState.habits.filter(h => h.id !== hid);
      saveState(appState);
      renderCurrentView();
      showToast('Habit deleted.');
      break;
    }

    // Workout actions
    case 'switch-workout-template': {
      const tplId = el.getAttribute('data-template');
      delete appState.workoutSessions[dateStr];
      getOrCreateWorkoutSession(appState, dateStr, tplId);
      renderCurrentView();
      showToast(`Loaded template: ${appState.gymTemplates[tplId]?.name || tplId}`);
      break;
    }

    case 'toggle-set-complete': {
      const exIdx = Number(el.getAttribute('data-ex-idx'));
      const setIdx = Number(el.getAttribute('data-set-idx'));
      const restSec = Number(el.getAttribute('data-rest')) || 90;
      const ws = appState.workoutSessions[dateStr];
      if (ws && ws.exercises[exIdx] && ws.exercises[exIdx].sets[setIdx]) {
        const setObj = ws.exercises[exIdx].sets[setIdx];
        setObj.completed = !setObj.completed;
        ws.exercises[exIdx].completed = ws.exercises[exIdx].sets.every(s => s.completed);
        saveState(appState);
        renderCurrentView();
        if (setObj.completed) {
          startRestTimer(restSec);
        }
      }
      break;
    }

    case 'toggle-exercise-complete': {
      const exIdx = Number(el.getAttribute('data-ex-idx'));
      const ws = appState.workoutSessions[dateStr];
      if (ws && ws.exercises[exIdx]) {
        const nextDone = !ws.exercises[exIdx].completed;
        ws.exercises[exIdx].completed = nextDone;
        (ws.exercises[exIdx].sets || []).forEach(s => { s.completed = nextDone; });
        saveState(appState);
        renderCurrentView();
      }
      break;
    }

    case 'apply-ref-weight': {
      const exIdx = Number(el.getAttribute('data-ex-idx'));
      const weight = Number(el.getAttribute('data-weight'));
      const ws = appState.workoutSessions[dateStr];
      if (ws && ws.exercises[exIdx]) {
        (ws.exercises[exIdx].sets || []).forEach(s => { s.weightKg = weight; });
        saveState(appState);
        renderCurrentView();
        showToast(`Prefilled ${weight} kg across sets.`);
      }
      break;
    }

    case 'add-set': {
      const exIdx = Number(el.getAttribute('data-ex-idx'));
      const ws = appState.workoutSessions[dateStr];
      if (ws && ws.exercises[exIdx]) {
        const sets = ws.exercises[exIdx].sets || [];
        const prev = sets[sets.length - 1] || { reps: 10, weightKg: '', rpe: 8 };
        sets.push({
          setNumber: sets.length + 1,
          reps: prev.reps,
          weightKg: prev.weightKg,
          rpe: prev.rpe,
          completed: false
        });
        ws.exercises[exIdx].completed = false;
        saveState(appState);
        renderCurrentView();
      }
      break;
    }

    case 'remove-set': {
      const exIdx = Number(el.getAttribute('data-ex-idx'));
      const setIdx = Number(el.getAttribute('data-set-idx'));
      const ws = appState.workoutSessions[dateStr];
      if (ws && ws.exercises[exIdx]) {
        ws.exercises[exIdx].sets.splice(setIdx, 1);
        ws.exercises[exIdx].sets.forEach((s, i) => { s.setNumber = i + 1; });
        saveState(appState);
        renderCurrentView();
      }
      break;
    }

    case 'move-exercise': {
      const exIdx = Number(el.getAttribute('data-ex-idx'));
      const dir = Number(el.getAttribute('data-dir'));
      const ws = appState.workoutSessions[dateStr];
      if (ws && ws.exercises) {
        const targetIdx = exIdx + dir;
        if (targetIdx >= 0 && targetIdx < ws.exercises.length) {
          const temp = ws.exercises[exIdx];
          ws.exercises[exIdx] = ws.exercises[targetIdx];
          ws.exercises[targetIdx] = temp;
          saveState(appState);
          renderCurrentView();
        }
      }
      break;
    }

    case 'substitute-exercise': {
      const exIdx = Number(el.getAttribute('data-ex-idx'));
      const ws = appState.workoutSessions[dateStr];
      if (!ws || !ws.exercises[exIdx]) return;
      const ex = ws.exercises[exIdx];
      openModal(`
        <div class="card-header" style="margin-bottom:12px;">
          <h3 class="card-title" id="modal-title">✎ Substitute or Rename Exercise</h3>
          <button type="button" class="btn-icon btn-sm" data-action="close-modal">✕</button>
        </div>
        <form data-form="substitute-exercise-modal-form">
          <input type="hidden" name="exIdx" value="${exIdx}" />
          <div class="form-grid">
            <div style="grid-column: 1 / -1;">
              <label for="sub-ex-name">Exercise Name</label>
              <input type="text" id="sub-ex-name" name="exerciseName" value="${escapeHtml(ex.exerciseName)}" required />
            </div>
            <div>
              <label for="sub-ex-reps">Rep Target</label>
              <input type="text" id="sub-ex-reps" name="repTarget" value="${escapeHtml(ex.repTarget)}" required />
            </div>
          </div>
          <div class="form-actions" style="margin-top:14px;">
            <button type="submit" class="btn-primary">Save Substitution</button>
            <button type="button" class="btn-secondary" data-action="close-modal">Cancel</button>
          </div>
        </form>
      `);
      break;
    }

    case 'remove-exercise': {
      const exIdx = Number(el.getAttribute('data-ex-idx'));
      const ws = appState.workoutSessions[dateStr];
      if (ws && ws.exercises) {
        ws.exercises.splice(exIdx, 1);
        saveState(appState);
        renderCurrentView();
        showToast('Exercise removed from session.');
      }
      break;
    }

    case 'set-workout-status': {
      const status = el.getAttribute('data-status') || 'completed';
      const ws = appState.workoutSessions[dateStr];
      if (ws) {
        ws.status = status;
        if (status === 'completed') {
          ws.completedAt = new Date().toISOString();
          (ws.exercises || []).forEach(ex => {
            ex.completed = true;
            (ex.sets || []).forEach(s => { s.completed = true; });
          });
          toggleHabitForDate(appState, dateStr, 'habit-workout', true);
        }
      }
      if (!appState.calendarOverrides[dateStr]) appState.calendarOverrides[dateStr] = {};
      appState.calendarOverrides[dateStr].status = status;
      saveState(appState);
      renderCurrentView();
      showToast(`Workout session marked as ${status}!`);
      break;
    }

    // Running actions
    case 'auto-scale-running-plan': {
      const baseLongInput = document.getElementById('run-base-long');
      const baseWeeklyInput = document.getElementById('run-base-weekly');
      const recentLong = Number(baseLongInput?.value || appState.userSettings.recentLongRunKm) || 6;
      const weeklyKm = Number(baseWeeklyInput?.value || appState.userSettings.currentWeeklyRunKm) || 12;

      appState.userSettings.recentLongRunKm = recentLong;
      appState.userSettings.currentWeeklyRunKm = weeklyKm;
      appState.userSettings.runningBaseConfirmed = true;

      // Scale weeks 1..6 conservatively starting from recentLong
      const easyBase = Math.max(3, Math.round(recentLong * 0.6 * 2) / 2);
      appState.runningPlan.forEach((rw, idx) => {
        if (idx === 5) {
          // Week 6 deload
          rw.easyKm = Math.max(3, Math.round(easyBase * 0.85 * 2) / 2);
          rw.easyLabel = `${rw.easyKm} km`;
          rw.longKm = Math.max(4, Math.round(recentLong * 0.9 * 2) / 2);
          rw.longLabel = `${rw.longKm} km`;
        } else {
          const progEasy = Math.min(easyBase + Math.floor(idx / 2) * 0.5, 6);
          const progLong = Math.min(recentLong + idx * 0.5, recentLong + 3);
          rw.easyKm = progEasy;
          rw.easyLabel = `${progEasy} km`;
          rw.longKm = progLong;
          rw.longLabel = `${progLong} km`;
        }
      });

      saveState(appState);
      renderCurrentView();
      showToast(`✅ Scaled 6-week running plan conservatively to your ${recentLong} km long-run base.`);
      break;
    }

    case 'edit-run-log':
      editingRunId = el.getAttribute('data-run-id');
      renderCurrentView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;

    case 'cancel-edit-run':
      editingRunId = null;
      renderCurrentView();
      break;

    case 'delete-run-log': {
      const rid = el.getAttribute('data-run-id');
      appState.runLogs = appState.runLogs.filter(r => r.id !== rid);
      if (editingRunId === rid) editingRunId = null;
      saveState(appState);
      renderCurrentView();
      showToast('Run log deleted.');
      break;
    }

    case 'remove-progress-photo': {
      const d = el.getAttribute('data-date') || dateStr;
      if (appState.measurementLogs[d]) {
        delete appState.measurementLogs[d].photoReference;
        saveState(appState);
        renderCurrentView();
        showToast('Photo removed.');
      }
      break;
    }

    // Export / Import / Reset in Settings
    case 'export-json': {
      const jsonStr = exportStateAsJson(appState);
      downloadFile(`fitness-cut-tracker-backup-${appState.activeDate}.json`, jsonStr, 'application/json');
      showToast('⬇ Exported JSON backup.');
      break;
    }

    case 'cloud-push-now': {
      pushStateToCloudNow(appState).then((ok) => {
        renderCurrentView();
        showToast(ok ? '☁️ Synced state to Firebase Cloud Firestore!' : '⚠️ Cloud sync unavailable (saved locally).');
      });
      break;
    }

    case 'cloud-pull-now': {
      pullStateFromCloudNow(appState?.userSettings?.cloudSyncKey).then((remote) => {
        if (remote) {
          appState = remote;
          saveState(appState);
          syncHeaderAndNavigation();
          renderCurrentView();
          showToast('☁️ Restored latest state from Firebase Cloud Firestore!');
        } else {
          showToast('No remote Firebase backup found yet.');
        }
      });
      break;
    }

    case 'export-csv': {
      const csvType = el.getAttribute('data-csv-type') || 'daily';
      const csvStr = generateCsvExport(appState, csvType);
      downloadFile(`fitness-tracker-${csvType}-${appState.activeDate}.csv`, csvStr, 'text/csv;charset=utf-8');
      showToast(`⬇ Exported ${csvType} CSV.`);
      break;
    }

    case 'open-reset-confirm-modal':
      openResetConfirmModal();
      break;

    default:
      break;
  }
}

// Button listeners inside rendered views that don't use data-action
document.addEventListener('click', (e) => {
  if (e.target.id === 'btn-calc-meal-kcal') {
    const p = Number(document.getElementById('meal-pro')?.value) || 0;
    const c = Number(document.getElementById('meal-carb')?.value) || 0;
    const f = Number(document.getElementById('meal-fat')?.value) || 0;
    const kcal = Math.round(p * 4 + c * 4 + f * 9);
    const calInput = document.getElementById('meal-cal');
    if (calInput) calInput.value = kcal;
    showToast(`Calculated ${kcal} kcal from ${p}g P / ${c}g C / ${f}g F.`);
  }

  if (e.target.id === 'btn-save-as-preset') {
    const name = document.getElementById('meal-name')?.value?.trim() || 'Custom Preset';
    const p = Number(document.getElementById('meal-pro')?.value) || 0;
    const c = Number(document.getElementById('meal-carb')?.value) || 0;
    const f = Number(document.getElementById('meal-fat')?.value) || 0;
    const kcal = Number(document.getElementById('meal-cal')?.value) || Math.round(p * 4 + c * 4 + f * 9);
    appState.mealPresets.push({
      id: `preset-${Date.now()}`,
      name,
      caloriesKcal: kcal,
      proteinG: p,
      carbohydrateG: c,
      fatG: f
    });
    saveState(appState);
    renderCurrentView();
    showToast(`Saved "${name}" to Quick-Add presets.`);
  }

  if (e.target.id === 'btn-sync-cal-to-macros') {
    const p = Number(document.getElementById('set-pro')?.value) || 0;
    const f = Number(document.getElementById('set-fat')?.value) || 0;
    const c = Number(document.getElementById('set-carb')?.value) || 0;
    const sum = Math.round(p * 4 + f * 9 + c * 4);
    const calEl = document.getElementById('set-cal');
    if (calEl) calEl.value = sum;
    showToast(`Calorie target input updated to ${sum} kcal. Click Save to apply.`);
  }
});

function handleFormSubmit(formType, form) {
  const fd = new FormData(form);
  const dateStr = appState.activeDate;

  switch (formType) {
    case 'dashboard-weight': {
      const w = Number(fd.get('weightKg'));
      if (w > 0) {
        saveDailyLog(appState, dateStr, { weightKg: w });
        toggleHabitForDate(appState, dateStr, 'habit-weight', true);
        renderCurrentView();
        syncHeaderAndNavigation();
        showToast(`⚖️ Saved morning weight: ${w} kg (${dateStr})`);
      }
      break;
    }

    case 'dashboard-quick-multi': {
      const addCal = Number(fd.get('caloriesKcal')) || 0;
      const addPro = Number(fd.get('proteinG')) || 0;
      const addCarb = Number(fd.get('carbohydrateG')) || 0;
      const addFat = Number(fd.get('fatG')) || 0;
      const steps = fd.get('steps') !== '' ? Number(fd.get('steps')) : null;
      const sleepHours = fd.get('sleepHours') !== '' ? Number(fd.get('sleepHours')) : null;

      if (addCal > 0 || addPro > 0 || addCarb > 0 || addFat > 0) {
        addNutritionEntry(appState, dateStr, {
          name: 'Quick Macro Entry',
          caloriesKcal: addCal || Math.round(addPro * 4 + addCarb * 4 + addFat * 9),
          proteinG: addPro,
          carbohydrateG: addCarb,
          fatG: addFat
        });
      }
      const updates = {};
      if (steps !== null) updates.steps = steps;
      if (sleepHours !== null) updates.sleepHours = sleepHours;
      if (Object.keys(updates).length > 0) {
        saveDailyLog(appState, dateStr, updates);
      }
      renderCurrentView();
      showToast('✅ Quick entry saved.');
      break;
    }

    case 'modal-quick-log': {
      const weightKg = fd.get('weightKg') !== '' ? Number(fd.get('weightKg')) : undefined;
      const addWaterL = Number(fd.get('addWaterL')) || 0;
      const addCal = Number(fd.get('addCaloriesKcal')) || 0;
      const addPro = Number(fd.get('addProteinG')) || 0;
      const addCarb = Number(fd.get('addCarbsG')) || 0;
      const addFat = Number(fd.get('addFatG')) || 0;
      const steps = fd.get('steps') !== '' ? Number(fd.get('steps')) : undefined;
      const sleepHours = fd.get('sleepHours') !== '' ? Number(fd.get('sleepHours')) : undefined;

      if (addCal > 0 || addPro > 0 || addCarb > 0 || addFat > 0) {
        addNutritionEntry(appState, dateStr, {
          name: 'Quick Log Entry',
          caloriesKcal: addCal || Math.round(addPro * 4 + addCarb * 4 + addFat * 9),
          proteinG: addPro,
          carbohydrateG: addCarb,
          fatG: addFat
        });
      }
      const current = getDailyLog(appState, dateStr);
      const updates = {};
      if (weightKg !== undefined && weightKg > 0) updates.weightKg = weightKg;
      if (addWaterL > 0) {
        updates.waterL = Math.round(((Number(current.waterL) || 0) + addWaterL) * 100) / 100;
        updates.manualWaterL = updates.waterL;
      }
      if (steps !== undefined) updates.steps = steps;
      if (sleepHours !== undefined) updates.sleepHours = sleepHours;
      saveDailyLog(appState, dateStr, updates);

      closeModal();
      syncHeaderAndNavigation();
      renderCurrentView();
      showToast('✅ Quick log saved!');
      break;
    }

    case 'add-workout-exercise': {
      const name = String(fd.get('exerciseName') || '').trim();
      const plannedSets = Math.max(1, Number(fd.get('plannedSets')) || 3);
      const repTarget = String(fd.get('repTarget') || '10').trim();
      if (!name) return;

      const ws = getOrCreateWorkoutSession(appState, dateStr);
      const lastRef = getLastUsedExercisePerformance(appState, name, dateStr);
      const sets = [];
      for (let i = 1; i <= plannedSets; i++) {
        sets.push({
          setNumber: i,
          reps: 10,
          weightKg: lastRef ? lastRef.weightKg : '',
          rpe: 8,
          completed: false
        });
      }
      ws.exercises.push({
        id: `${dateStr}-custom-${Date.now()}`,
        exerciseName: name,
        plannedSets,
        repTarget,
        isCompound: false,
        isTimed: false,
        defaultRestSec: 90,
        completed: false,
        notes: '',
        sets
      });
      saveState(appState);
      renderCurrentView();
      showToast(`Added "${name}" to session.`);
      break;
    }

    case 'substitute-exercise-modal-form': {
      const exIdx = Number(fd.get('exIdx'));
      const newName = String(fd.get('exerciseName') || '').trim();
      const newRep = String(fd.get('repTarget') || '').trim();
      const ws = appState.workoutSessions[dateStr];
      if (ws && ws.exercises[exIdx] && newName) {
        ws.exercises[exIdx].exerciseName = newName;
        if (newRep) ws.exercises[exIdx].repTarget = newRep;
        saveState(appState);
        closeModal();
        renderCurrentView();
        showToast(`Updated exercise to "${newName}".`);
      }
      break;
    }

    case 'running-base-form': {
      const wk = Number(fd.get('currentWeeklyRunKm'));
      const lg = Number(fd.get('recentLongRunKm'));
      appState.userSettings.currentWeeklyRunKm = wk;
      appState.userSettings.recentLongRunKm = lg;
      appState.userSettings.runningBaseConfirmed = true;
      saveState(appState);
      renderCurrentView();
      showToast('✅ Running base mileage confirmed and saved.');
      break;
    }

    case 'run-log-form': {
      const rDate = String(fd.get('date') || dateStr);
      const sessionType = String(fd.get('sessionType') || 'easy');
      const status = String(fd.get('status') || 'completed');
      const distanceKm = Number(fd.get('distanceKm'));
      const mins = Number(fd.get('durationMinutes')) || 0;
      const secs = Number(fd.get('durationSecondsPart')) || 0;
      const durationSeconds = parseDurationInput(mins, secs);
      const msgEl = document.getElementById('run-validation-msg');

      if (status !== 'skipped' && (!(distanceKm > 0) || !(durationSeconds > 0))) {
        if (msgEl) {
          msgEl.textContent = 'Validation Error: Distance (km) and Duration must both be positive numbers greater than zero.';
          msgEl.classList.remove('hidden');
        }
        return;
      }

      const { paceFormatted } = calculatePace(distanceKm, durationSeconds);
      const avgHr = fd.get('averageHeartRate') ? Number(fd.get('averageHeartRate')) : null;
      const effort = Number(fd.get('effort')) || 5;
      const routeSurface = String(fd.get('routeSurface') || '').trim();
      const notes = String(fd.get('notes') || '').trim();
      const existingId = String(fd.get('runId') || '').trim();

      const runPayload = {
        id: existingId || `run-${Date.now()}`,
        date: rDate,
        sessionType,
        distanceKm: Math.max(0, distanceKm),
        durationSeconds: Math.max(0, durationSeconds),
        averagePace: paceFormatted,
        averageHeartRate: avgHr,
        effort,
        routeSurface,
        notes,
        status
      };

      const idx = appState.runLogs.findIndex(r => r.id === runPayload.id);
      if (idx >= 0) {
        appState.runLogs[idx] = runPayload;
      } else {
        appState.runLogs.push(runPayload);
      }

      if (!appState.calendarOverrides[rDate]) appState.calendarOverrides[rDate] = {};
      appState.calendarOverrides[rDate].status = status;
      if (status === 'completed') {
        toggleHabitForDate(appState, rDate, 'habit-workout', true);
      }

      editingRunId = null;
      saveState(appState);
      renderCurrentView();
      showToast(`🏃 Saved run: ${distanceKm} km at ${paceFormatted}`);
      break;
    }

    case 'add-nutrition-entry': {
      const name = String(fd.get('name') || '').trim() || 'Macro Portion';
      const p = Number(fd.get('proteinG')) || 0;
      const c = Number(fd.get('carbohydrateG')) || 0;
      const f = Number(fd.get('fatG')) || 0;
      const rawCal = fd.get('caloriesKcal');
      const cal = rawCal !== '' && Number(rawCal) >= 0 ? Number(rawCal) : Math.round(p * 4 + c * 4 + f * 9);
      const waterL = Number(fd.get('waterL')) || 0;

      addNutritionEntry(appState, dateStr, {
        name,
        caloriesKcal: cal,
        proteinG: p,
        carbohydrateG: c,
        fatG: f,
        waterL
      });
      renderCurrentView();
      showToast(`🥗 Logged ${name} (${cal} kcal, ${p}g P)`);
      break;
    }

    case 'direct-daily-macros': {
      const cal = Number(fd.get('caloriesKcal')) || 0;
      const pro = Number(fd.get('proteinG')) || 0;
      const carb = Number(fd.get('carbohydrateG')) || 0;
      const fat = Number(fd.get('fatG')) || 0;
      const water = Number(fd.get('waterL')) || 0;
      saveDailyLog(appState, dateStr, {
        caloriesKcal: cal,
        proteinG: pro,
        carbohydrateG: carb,
        fatG: fat,
        waterL: water,
        manualWaterL: water
      });
      renderCurrentView();
      showToast('Updated daily nutrition totals.');
      break;
    }

    case 'add-custom-habit': {
      const title = String(fd.get('title') || '').trim();
      const category = String(fd.get('category') || 'optional');
      if (!title) return;
      appState.habits.push({
        id: `habit-custom-${Date.now()}`,
        title,
        category,
        active: true,
        autoRule: null
      });
      saveState(appState);
      renderCurrentView();
      showToast(`Added habit: "${title}"`);
      break;
    }

    case 'edit-habit-modal-form': {
      const hid = String(fd.get('habitId') || '');
      const title = String(fd.get('title') || '').trim();
      const habit = appState.habits.find(h => h.id === hid);
      if (habit && title) {
        habit.title = title;
        saveState(appState);
        closeModal();
        renderCurrentView();
        showToast('Habit updated.');
      }
      break;
    }

    case 'measurement-log-form': {
      const mLog = appState.measurementLogs[dateStr] || { date: dateStr };
      const fields = ['weightKg', 'waistCm', 'chestCm', 'hipsCm', 'restingHeartRate', 'sleepHours', 'bodyFatEstimate'];
      fields.forEach(f => {
        const val = fd.get(f);
        if (val !== null && val !== '') {
          mLog[f] = Number(val);
        }
      });
      appState.measurementLogs[dateStr] = mLog;

      const dailyUpdates = {};
      if (mLog.weightKg) {
        dailyUpdates.weightKg = mLog.weightKg;
        toggleHabitForDate(appState, dateStr, 'habit-weight', true);
      }
      if (mLog.sleepHours) dailyUpdates.sleepHours = mLog.sleepHours;
      if (Object.keys(dailyUpdates).length > 0) {
        saveDailyLog(appState, dateStr, dailyUpdates);
      } else {
        saveState(appState);
      }
      syncHeaderAndNavigation();
      renderCurrentView();
      showToast(`📏 Measurements saved for ${dateStr}.`);
      break;
    }

    case 'settings-profile-form': {
      // Important rule: changing calorieTarget never silently alters proteinTargetG, fatTargetG, carbohydrateTargetG
      const us = appState.userSettings;
      us.startingWeightKg = Number(fd.get('startingWeightKg')) || 75;
      us.heightCm = Number(fd.get('heightCm')) || 172;
      us.estimatedBodyFatPct = Number(fd.get('estimatedBodyFatPct')) || 30;
      us.targetWeightMinKg = Number(fd.get('targetWeightMinKg')) || 71;
      us.targetWeightMaxKg = Number(fd.get('targetWeightMaxKg')) || 73;
      us.calorieTarget = Number(fd.get('calorieTarget')) || 2100;
      us.proteinTargetG = Number(fd.get('proteinTargetG')) || 150;
      us.fatTargetG = Number(fd.get('fatTargetG')) || 60;
      us.carbohydrateTargetG = Number(fd.get('carbohydrateTargetG')) || 232;
      us.stepTarget = Number(fd.get('stepTarget')) || 9000;
      us.waterTargetL = Number(fd.get('waterTargetL')) || 3.0;
      us.sleepTargetHours = Number(fd.get('sleepTargetHours')) || 8.0;
      us.programmeStartDate = String(fd.get('programmeStartDate') || '2026-11-23');
      us.programmeEndDate = String(fd.get('programmeEndDate') || '2027-01-05');
      us.weightUnit = String(fd.get('weightUnit') || 'kg');
      us.timeFormat = String(fd.get('timeFormat') || '24h');

      saveState(appState);
      syncHeaderAndNavigation();
      renderCurrentView();
      showToast('⚙️ Profile and target settings saved.');
      break;
    }

    case 'settings-running-plan-form': {
      appState.runningPlan.forEach((rw, idx) => {
        const easy = Number(fd.get(`easyKm_${idx}`));
        const qLabel = String(fd.get(`qualityLabel_${idx}`) || '').trim();
        const qEst = Number(fd.get(`qualityEstimatedKm_${idx}`));
        const long = Number(fd.get(`longKm_${idx}`));
        if (easy > 0) {
          rw.easyKm = easy;
          rw.easyLabel = `${easy} km`;
        }
        if (qLabel) rw.qualityLabel = qLabel;
        if (qEst > 0) rw.qualityEstimatedKm = qEst;
        if (long > 0) {
          rw.longKm = long;
          rw.longLabel = `${long} km`;
        }
      });
      saveState(appState);
      renderCurrentView();
      showToast('🏃 6-week running schedule updated.');
      break;
    }

    case 'reschedule-session-form': {
      const sourceDate = String(fd.get('sourceDate') || '');
      const targetDate = String(fd.get('targetDate') || '');
      const mode = String(fd.get('mode') || 'swap');
      rescheduleSession(appState, sourceDate, targetDate, mode);
      closeModal();
      renderCurrentView();
      showToast(`⇄ Session rescheduled from ${sourceDate} to ${targetDate} (original planned date preserved).`);
      break;
    }

    case 'edit-calendar-day-form': {
      const d = String(fd.get('date') || dateStr);
      const customTitle = String(fd.get('customTitle') || '').trim();
      const customCategory = String(fd.get('customCategory') || 'gym');
      const status = String(fd.get('status') || 'planned');
      const customSubtitle = String(fd.get('customSubtitle') || '').trim();

      const prev = appState.calendarOverrides[d] || {};
      appState.calendarOverrides[d] = {
        ...prev,
        customTitle,
        customShortTitle: customTitle,
        customCategory,
        customSubtitle,
        status,
        originalPlannedDate: prev.originalPlannedDate || d
      };
      saveState(appState);
      closeModal();
      renderCurrentView();
      showToast(`Updated schedule for ${d}.`);
      break;
    }

    case 'confirm-reset-form': {
      const txt = String(fd.get('confirmText') || '').trim().toUpperCase();
      if (txt !== 'RESET') {
        showToast('Please type RESET in capital letters to confirm.');
        return;
      }
      appState = resetAllData();
      closeModal();
      syncHeaderAndNavigation();
      renderCurrentView();
      showToast('All data has been reset to factory defaults.');
      break;
    }

    default:
      break;
  }
}

// Initialize App
function initApp() {
  applyTheme(appState.userSettings.theme || 'dark');
  bindGlobalEvents();
  syncHeaderAndNavigation();
  renderCurrentView();

  initFirebaseCloudSync(
    appState,
    (remoteState) => {
      appState = remoteState;
      saveState(appState);
      applyTheme(appState.userSettings.theme || 'dark');
      syncHeaderAndNavigation();
      renderCurrentView();
      showToast('☁️ Loaded synced data from Firebase!');
    },
    (statusText) => {
      const el = document.getElementById('settings-cloud-status');
      if (el) el.textContent = statusText;
      const headerCloud = document.getElementById('header-cloud-label');
      if (headerCloud) headerCloud.textContent = statusText;
    }
  );

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', initApp);


})();
