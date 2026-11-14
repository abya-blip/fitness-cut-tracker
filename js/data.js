// Source of truth for the 6-Week Fitness Cut & Training Tracker
// Programme dates: Monday, 23 November 2026 -- Tuesday, 5 January 2027

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatLocalDate(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseLocalDate(dateStr) {
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

export function getTodayLocalStr() {
  return formatLocalDate(new Date());
}

export function addDays(dateStr, deltaDays) {
  const dt = parseLocalDate(dateStr);
  dt.setDate(dt.getDate() + Number(deltaDays));
  return formatLocalDate(dt);
}

export function diffDays(startStr, endStr) {
  const s = parseLocalDate(startStr);
  const e = parseLocalDate(endStr);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatHumanDate(dateStr, options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) {
  const dt = parseLocalDate(dateStr);
  return dt.toLocaleDateString('en-GB', options);
}

export function formatShortDate(dateStr) {
  const dt = parseLocalDate(dateStr);
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function getDayOfWeekIndex(dateStr) {
  // Returns 0 for Monday ... 6 for Sunday
  const dt = parseLocalDate(dateStr);
  const jsDay = dt.getDay(); // 0 = Sun, 1 = Mon, ...
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function getMondayOfWeek(dateStr) {
  const idx = getDayOfWeekIndex(dateStr);
  return addDays(dateStr, -idx);
}

export const DEFAULT_USER_SETTINGS = {
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

export const PROGRAMME_PHASES = [
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

export const DEFAULT_GYM_TEMPLATES = {
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

export const DEFAULT_RUNNING_PLAN = [
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

export const DEFAULT_HABITS = [
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

export const DEFAULT_MEAL_PRESETS = [
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

export const GYM_GUIDANCE_ITEMS = [
  'Warm up for 5–10 minutes before starting working sets.',
  'Keep approximately 2 repetitions in reserve (2 RIR / RPE 8) on most working sets.',
  'Rest 2–3 minutes on compound lifts and 60–90 seconds on isolation work.',
  'Increase load gradually only when the top of the rep range is completed with good technique.',
  'Reduce lower-body volume if running fatigue is interfering with recovery.',
  'Do not train through persistent pain.'
];

export const RUNNING_EFFORT_GUIDANCE = [
  { type: 'Easy', effort: '3–4 / 10', description: 'Conversational pace; you can speak in full sentences comfortably.' },
  { type: 'Tempo', effort: '7 / 10', description: 'Comfortably hard sustained rhythm; short phrases only.' },
  { type: 'Intervals', effort: '8 / 10', description: 'Controlled hard effort with easy jog/walk recovery; not all-out sprinting.' }
];

export const PROGRESS_RULES = [
  'A gradual trend around 0.4–0.7 kg per week was the initial working range, not a guaranteed outcome.',
  'Review after 14 days rather than reacting to a few daily readings.',
  'If weight is falling very quickly and recovery is poor, reassess intake and training.',
  'If there is no downward trend for two consecutive weeks despite consistent logging, review tracking accuracy and activity before making a small adjustment.',
  'Calories are never automatically reduced by the app; any target adjustment requires your explicit confirmation.'
];

export const RECOVERY_AND_SAFETY_NOTES = {
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
