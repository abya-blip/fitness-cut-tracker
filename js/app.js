// Main Application Controller & View Renderers
import {
  escapeHtml,
  PROGRAMME_PHASES,
  GYM_GUIDANCE_ITEMS,
  RUNNING_EFFORT_GUIDANCE,
  PROGRESS_RULES,
  RECOVERY_AND_SAFETY_NOTES,
  formatLocalDate,
  parseLocalDate,
  getTodayLocalStr,
  addDays,
  formatHumanDate,
  formatShortDate,
  getDayOfWeekIndex,
  getMondayOfWeek
} from './data.js';

import {
  loadState,
  saveState,
  resetAllData,
  mergeWithDefaults,
  getPhaseForDate,
  getPlannedSessionForDate,
  rescheduleSession,
  getOrCreateWorkoutSession,
  getLastUsedExercisePerformance,
  calculatePace,
  formatDurationHms,
  parseDurationInput,
  getDailyLog,
  saveDailyLog,
  addNutritionEntry,
  deleteNutritionEntry,
  getWeightTrendSummary,
  getNutritionSummary,
  getHabitStatusForDate,
  toggleHabitForDate,
  getWeeklyTrainingSummary,
  getNextSessionAfter,
  exportStateAsJson,
  generateCsvExport,
  getCloudSyncStatus,
  initFirebaseCloudSync,
  pushStateToCloudNow,
  pullStateFromCloudNow
} from './store.js';

import {
  renderWeightChartSvg,
  renderWaistChartSvg,
  renderNutritionChartSvg,
  renderWeeklyRunningChartSvg,
  renderGymLoadChartSvg,
  renderHabitWeeklyChartSvg
} from './charts.js';

let appState = loadState();
let currentView = 'dashboard';
let calendarViewMode = 'week'; // 'week' | 'month'
let calendarMonthCursor = '2026-11-01'; // Used for month view navigation
let selectedChartExercise = 'Barbell bench press';
let editingRunId = null;

// Rest timer & PWA install state
let restTimerInterval = null;
let restSecondsRemaining = 0;
let deferredInstallPrompt = null;

export function showToast(message) {
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

export function navigateTo(viewName, optionalDate = null) {
  if (optionalDate) {
    appState.activeDate = optionalDate;
    saveState(appState);
  }
  currentView = viewName;
  syncHeaderAndNavigation();
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function setActiveDate(dateStr) {
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
            <input type="number" inputmode="decimal" step="0.1" min="30" max="250" id="dash-weight-input" name="weightKg" placeholder="e.g. 74.8" value="${dailyLog.weightKg ?? ''}" required />
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

        <div class="habit-list">
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
            <input type="number" inputmode="numeric" id="ql-cal" name="caloriesKcal" min="0" max="5000" placeholder="e.g. 550" />
          </div>
          <div>
            <label for="ql-pro">Add Protein (g)</label>
            <input type="number" inputmode="decimal" step="0.5" id="ql-pro" name="proteinG" min="0" max="300" placeholder="e.g. 40" />
          </div>
          <div>
            <label for="ql-carb">Add Carbs (g)</label>
            <input type="number" inputmode="decimal" step="0.5" id="ql-carb" name="carbohydrateG" min="0" max="500" placeholder="e.g. 60" />
          </div>
          <div>
            <label for="ql-fat">Add Fat (g)</label>
            <input type="number" inputmode="decimal" step="0.5" id="ql-fat" name="fatG" min="0" max="200" placeholder="e.g. 15" />
          </div>
          <div>
            <label for="ql-steps">Daily Steps Total</label>
            <input type="number" inputmode="numeric" id="ql-steps" name="steps" min="0" max="50000" placeholder="e.g. 9200" value="${dailyLog.steps ?? ''}" />
          </div>
          <div>
            <label for="ql-sleep">Sleep (hours)</label>
            <input type="number" inputmode="decimal" step="0.25" id="ql-sleep" name="sleepHours" min="0" max="24" placeholder="e.g. 8.0" value="${dailyLog.sleepHours ?? ''}" />
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
            <input type="number" inputmode="decimal" step="0.5" min="0" max="500" class="set-input"
              aria-label="${escapeHtml(ex.exerciseName)} Set ${st.setNumber} Weight kg"
              data-action="update-set-field" data-ex-idx="${exIdx}" data-set-idx="${sIdx}" data-field="weightKg"
              placeholder="kg" value="${st.weightKg ?? ''}" />
            <button type="button" class="btn-step-mini" data-action="step-set-weight" data-ex-idx="${exIdx}" data-set-idx="${sIdx}" data-delta="2.5" title="+2.5 kg">+2.5</button>
          </div>
        </td>
        <td>
          <input type="number" inputmode="numeric" step="1" min="0" max="600" class="set-input"
            aria-label="${escapeHtml(ex.exerciseName)} Set ${st.setNumber} ${ex.isTimed ? 'Seconds' : 'Reps'}"
            data-action="update-set-field" data-ex-idx="${exIdx}" data-set-idx="${sIdx}" data-field="reps"
            placeholder="${ex.isTimed ? 'sec' : 'reps'}" value="${st.reps ?? ''}" />
        </td>
        <td>
          <input type="number" inputmode="decimal" step="0.5" min="1" max="10" class="set-input"
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
          <input type="number" inputmode="numeric" id="new-ex-sets" name="plannedSets" min="1" max="10" value="3" required />
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
          <input type="number" inputmode="decimal" step="0.5" min="0" max="150" id="run-base-weekly" name="currentWeeklyRunKm" placeholder="e.g. 15" value="${us.currentWeeklyRunKm ?? ''}" required />
        </div>
        <div>
          <label for="run-base-long">Recent Comfortable Long Run (km)</label>
          <input type="number" inputmode="decimal" step="0.5" min="0" max="45" id="run-base-long" name="recentLongRunKm" placeholder="e.g. 7" value="${us.recentLongRunKm ?? ''}" required />
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
              <input type="number" inputmode="decimal" step="0.01" min="0.1" max="100" id="run-dist" name="distanceKm" value="${defaultDist}" required />
            </div>
            <div>
              <label for="run-mins">Duration (Minutes)</label>
              <input type="number" inputmode="numeric" step="1" min="0" max="600" id="run-mins" name="durationMinutes" value="${defaultMins}" required />
            </div>
            <div>
              <label for="run-secs">Duration (Seconds)</label>
              <input type="number" inputmode="numeric" step="1" min="0" max="59" id="run-secs" name="durationSecondsPart" value="${defaultSecs}" required />
            </div>
            <div>
              <label for="run-pace-readonly">Calculated Avg Pace</label>
              <input type="text" id="run-pace-readonly" value="${livePace}" readonly aria-readonly="true" style="font-weight:700; color:var(--accent-primary);" />
            </div>
            <div>
              <label for="run-hr">Avg Heart Rate (bpm, optional)</label>
              <input type="number" inputmode="numeric" min="40" max="230" id="run-hr" name="averageHeartRate" placeholder="e.g. 148" value="${existingRun?.averageHeartRate ?? ''}" />
            </div>
            <div>
              <label for="run-effort">Effort Rating (1–10)</label>
              <input type="number" inputmode="numeric" min="1" max="10" id="run-effort" name="effort" value="${existingRun?.effort ?? (defaultType === 'easy' || defaultType === 'long' ? 4 : (defaultType === 'tempo' ? 7 : 8))}" required />
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
              <input type="number" inputmode="decimal" step="0.5" min="0" max="300" id="meal-pro" name="proteinG" placeholder="0" required />
            </div>
            <div>
              <label for="meal-carb">Carbohydrates (g)</label>
              <input type="number" inputmode="decimal" step="0.5" min="0" max="500" id="meal-carb" name="carbohydrateG" placeholder="0" required />
            </div>
            <div>
              <label for="meal-fat">Fat (g)</label>
              <input type="number" inputmode="decimal" step="0.5" min="0" max="200" id="meal-fat" name="fatG" placeholder="0" required />
            </div>
            <div>
              <label for="meal-cal">Calories (kcal)</label>
              <input type="number" inputmode="numeric" step="1" min="0" max="5000" id="meal-cal" name="caloriesKcal" placeholder="Auto or manual" required />
            </div>
            <div>
              <label for="meal-water">Water (L, optional)</label>
              <input type="number" inputmode="decimal" step="0.1" min="0" max="10" id="meal-water" name="waterL" placeholder="0.0" />
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
            <input type="number" inputmode="numeric" id="dir-cal" name="caloriesKcal" min="0" value="${log.caloriesKcal}" />
          </div>
          <div>
            <label for="dir-pro">Total Protein (g)</label>
            <input type="number" inputmode="decimal" step="0.5" id="dir-pro" name="proteinG" min="0" value="${log.proteinG}" />
          </div>
          <div>
            <label for="dir-carb">Total Carbs (g)</label>
            <input type="number" inputmode="decimal" step="0.5" id="dir-carb" name="carbohydrateG" min="0" value="${log.carbohydrateG}" />
          </div>
          <div>
            <label for="dir-fat">Total Fat (g)</label>
            <input type="number" inputmode="decimal" step="0.5" id="dir-fat" name="fatG" min="0" value="${log.fatG}" />
          </div>
          <div>
            <label for="dir-water">Total Water (L)</label>
            <input type="number" inputmode="decimal" step="0.1" id="dir-water" name="waterL" min="0" value="${log.waterL}" />
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
            <input type="number" inputmode="decimal" step="0.1" min="30" max="250" id="meas-weight" name="weightKg" placeholder="e.g. 74.5" value="${mLog.weightKg ?? daily.weightKg ?? ''}" />
          </div>
          <div>
            <label for="meas-waist">Waist (cm)</label>
            <input type="number" inputmode="decimal" step="0.1" min="40" max="200" id="meas-waist" name="waistCm" placeholder="e.g. 88.0" value="${mLog.waistCm ?? ''}" />
          </div>
          <div>
            <label for="meas-chest">Chest (cm)</label>
            <input type="number" inputmode="decimal" step="0.1" min="50" max="200" id="meas-chest" name="chestCm" placeholder="e.g. 100.0" value="${mLog.chestCm ?? ''}" />
          </div>
          <div>
            <label for="meas-hips">Hips (cm)</label>
            <input type="number" inputmode="decimal" step="0.1" min="50" max="200" id="meas-hips" name="hipsCm" placeholder="e.g. 97.0" value="${mLog.hipsCm ?? ''}" />
          </div>
          <div>
            <label for="meas-rhr">Resting Heart Rate (bpm)</label>
            <input type="number" inputmode="numeric" min="30" max="150" id="meas-rhr" name="restingHeartRate" placeholder="e.g. 58" value="${mLog.restingHeartRate ?? ''}" />
          </div>
          <div>
            <label for="meas-sleep">Average Sleep (hours)</label>
            <input type="number" inputmode="decimal" step="0.25" min="0" max="24" id="meas-sleep" name="sleepHours" placeholder="e.g. 8.0" value="${mLog.sleepHours ?? daily.sleepHours ?? ''}" />
          </div>
          <div>
            <label for="meas-bf">Body-Fat Estimate (%, user est.)</label>
            <input type="number" inputmode="decimal" step="0.5" min="3" max="65" id="meas-bf" name="bodyFatEstimate" placeholder="e.g. 29.5" value="${mLog.bodyFatEstimate ?? ''}" />
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
            <input type="number" inputmode="decimal" step="0.1" id="set-start-weight" name="startingWeightKg" value="${us.startingWeightKg}" required />
          </div>
          <div>
            <label for="set-height">Height (cm)</label>
            <input type="number" inputmode="numeric" id="set-height" name="heightCm" value="${us.heightCm}" required />
          </div>
          <div>
            <label for="set-bf">Initial Body Fat Estimate (%)</label>
            <input type="number" inputmode="decimal" step="0.5" id="set-bf" name="estimatedBodyFatPct" value="${us.estimatedBodyFatPct}" />
          </div>
          <div>
            <label for="set-goal-min">Optional Goal Weight Min (kg)</label>
            <input type="number" inputmode="decimal" step="0.5" id="set-goal-min" name="targetWeightMinKg" value="${us.targetWeightMinKg}" />
          </div>
          <div>
            <label for="set-goal-max">Optional Goal Weight Max (kg)</label>
            <input type="number" inputmode="decimal" step="0.5" id="set-goal-max" name="targetWeightMaxKg" value="${us.targetWeightMaxKg}" />
          </div>
          <div>
            <label for="set-cal">Daily Calorie Target (kcal)</label>
            <input type="number" inputmode="numeric" id="set-cal" name="calorieTarget" value="${us.calorieTarget}" required />
          </div>
          <div>
            <label for="set-pro">Protein Target (g)</label>
            <input type="number" inputmode="numeric" id="set-pro" name="proteinTargetG" value="${us.proteinTargetG}" required />
          </div>
          <div>
            <label for="set-fat">Fat Target (g)</label>
            <input type="number" inputmode="numeric" id="set-fat" name="fatTargetG" value="${us.fatTargetG}" required />
          </div>
          <div>
            <label for="set-carb">Carbohydrate Target (g)</label>
            <input type="number" inputmode="numeric" id="set-carb" name="carbohydrateTargetG" value="${us.carbohydrateTargetG}" required />
          </div>
          <div>
            <label for="set-steps">Daily Steps Target</label>
            <input type="number" inputmode="numeric" id="set-steps" name="stepTarget" value="${us.stepTarget}" required />
          </div>
          <div>
            <label for="set-water">Daily Water Target (L)</label>
            <input type="number" inputmode="decimal" step="0.1" id="set-water" name="waterTargetL" value="${us.waterTargetL}" required />
          </div>
          <div>
            <label for="set-sleep">Daily Sleep Target (hours)</label>
            <input type="number" inputmode="decimal" step="0.5" id="set-sleep" name="sleepTargetHours" value="${us.sleepTargetHours}" required />
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
                  <td><input type="number" inputmode="decimal" step="0.5" name="easyKm_${idx}" value="${rw.easyKm}" class="set-input" /></td>
                  <td><input type="text" name="qualityLabel_${idx}" value="${escapeHtml(rw.qualityLabel)}" /></td>
                  <td><input type="number" inputmode="decimal" step="0.5" name="qualityEstimatedKm_${idx}" value="${rw.qualityEstimatedKm}" class="set-input" /></td>
                  <td><input type="number" inputmode="decimal" step="0.5" name="longKm_${idx}" value="${rw.longKm}" class="set-input" /></td>
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
                  <input type="number" inputmode="numeric" min="1" max="10" value="${ex.plannedSets}" data-action="edit-tpl-ex" data-tpl="${tplKey}" data-idx="${eIdx}" data-field="plannedSets" aria-label="Planned sets" style="min-height:36px; font-size:0.82rem; text-align:center;" />
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

export function closeModal() {
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
          <input type="number" inputmode="decimal" step="0.1" id="mql-weight" name="weightKg" value="${daily.weightKg ?? ''}" placeholder="e.g. 74.8" />
        </div>
        <div>
          <label for="mql-water">Add Water (L)</label>
          <input type="number" inputmode="decimal" step="0.25" id="mql-water" name="addWaterL" placeholder="e.g. 0.5" />
        </div>
        <div>
          <label for="mql-cal">Add Calories (kcal)</label>
          <input type="number" inputmode="numeric" id="mql-cal" name="addCaloriesKcal" placeholder="e.g. 450" />
        </div>
        <div>
          <label for="mql-pro">Add Protein (g)</label>
          <input type="number" inputmode="decimal" step="0.5" id="mql-pro" name="addProteinG" placeholder="e.g. 35" />
        </div>
        <div>
          <label for="mql-carb">Add Carbs (g)</label>
          <input type="number" inputmode="decimal" step="0.5" id="mql-carb" name="addCarbsG" placeholder="e.g. 45" />
        </div>
        <div>
          <label for="mql-fat">Add Fat (g)</label>
          <input type="number" inputmode="decimal" step="0.5" id="mql-fat" name="addFatG" placeholder="e.g. 12" />
        </div>
        <div>
          <label for="mql-steps">Daily Steps</label>
          <input type="number" inputmode="numeric" id="mql-steps" name="steps" value="${daily.steps ?? ''}" placeholder="e.g. 8500" />
        </div>
        <div>
          <label for="mql-sleep">Sleep (hours)</label>
          <input type="number" inputmode="decimal" step="0.25" id="mql-sleep" name="sleepHours" value="${daily.sleepHours ?? ''}" placeholder="e.g. 8.0" />
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

function openInstallAppModal() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  openModal(`
    <div class="card-header" style="margin-bottom:12px;">
      <h3 class="card-title" id="modal-title">📲 Install Cut Tracker on Your Phone</h3>
      <button type="button" class="btn-icon btn-sm" data-action="close-modal" aria-label="Close modal">✕</button>
    </div>
    ${isStandalone ? `
      <div class="alert-banner alert-info" style="margin-bottom:12px;">
        <strong>✓ Already Installed!</strong> You are currently running Cut Tracker as a standalone mobile web app.
      </div>
    ` : `
      <p style="font-size:0.9rem; color:var(--text-secondary); margin-top:0;">
        Add <strong>Cut Tracker</strong> to your home screen so it launches full-screen like a native app and works offline at the gym.
      </p>
    `}
    <div class="card" style="background:var(--bg-elevated); margin-bottom:10px; padding:14px;">
      <div style="font-weight:700; margin-bottom:6px;">🤖 Android (Chrome / Edge / Samsung Internet)</div>
      <ol style="margin:0; padding-left:18px; font-size:0.86rem; color:var(--text-secondary);">
        <li>Open <strong>https://abhin-cut-tracker-2026.web.app</strong> in Chrome.</li>
        <li>Tap the browser menu button <strong>⋮</strong> (top-right).</li>
        <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> → confirm <strong>Install</strong>.</li>
      </ol>
    </div>
    <div class="card" style="background:var(--bg-elevated); padding:14px;">
      <div style="font-weight:700; margin-bottom:6px;">🍎 iPhone / iPad (Safari)</div>
      <ol style="margin:0; padding-left:18px; font-size:0.86rem; color:var(--text-secondary);">
        <li>Open <strong>https://abhin-cut-tracker-2026.web.app</strong> in Safari.</li>
        <li>Tap the <strong>Share</strong> icon (square with upward arrow ⬆️).</li>
        <li>Scroll down and tap <strong>"Add to Home Screen"</strong> → tap <strong>Add</strong>.</li>
      </ol>
    </div>
    <div class="form-actions" style="margin-top:14px;">
      <button type="button" class="btn-primary" data-action="close-modal">Got it</button>
    </div>
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

    case 'install-pwa':
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((choice) => {
          if (choice && choice.outcome === 'accepted') {
            showToast('📲 Installing Cut Tracker app...');
          }
          deferredInstallPrompt = null;
          document.getElementById('btn-install-pwa')?.classList.remove('install-ready');
        }).catch(() => {
          openInstallAppModal();
        });
      } else {
        openInstallAppModal();
      }
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

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const installBtn = document.getElementById('btn-install-pwa');
    if (installBtn) {
      installBtn.classList.add('install-ready');
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const installBtn = document.getElementById('btn-install-pwa');
    if (installBtn) {
      installBtn.classList.remove('install-ready');
    }
    showToast('✅ App installed on your device!');
  });
}

document.addEventListener('DOMContentLoaded', initApp);
