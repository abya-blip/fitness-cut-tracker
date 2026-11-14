// Accessible, responsive SVG Chart Renderers for all 6 Progress Charts
import {
  escapeHtml,
  formatShortDate,
  addDays,
  PROGRAMME_PHASES
} from './data.js';
import {
  getWeightTrendSummary,
  getHabitStatusForDate,
  getPlannedSessionForDate
} from './store.js';

function renderEmptyChartState(title, message, icon = '📊') {
  return `
    <div class="chart-empty-state" role="status">
      <span class="chart-empty-icon" aria-hidden="true">${icon}</span>
      <p class="chart-empty-title">${escapeHtml(title)}</p>
      <p class="chart-empty-sub">${escapeHtml(message)}</p>
    </div>
  `;
}

// 1. Daily Weight Points & 7-Day Rolling Average
export function renderWeightChartSvg(state) {
  const trend = getWeightTrendSummary(state, '2099-12-31');
  const series = trend.series;
  if (!series || series.length === 0) {
    return renderEmptyChartState(
      'No weight entries logged yet',
      'Log your morning body weight on the Dashboard, Quick Log, or Progress tab to view daily points and your 7-day rolling average.',
      '⚖️'
    );
  }

  const w = 640;
  const h = 260;
  const pad = { top: 24, right: 28, bottom: 42, left: 52 };
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

  // Grid lines
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

  // Optional goal aspiration band (71-73 kg)
  const bandTop = yPos(Math.min(maxY, targetMax));
  const bandBottom = yPos(Math.max(minY, targetMin));
  const bandHeight = Math.max(0, bandBottom - bandTop);

  // Rolling 7-day average line path
  const avgPoints = series.map((pt, i) => `${xPos(i)},${yPos(pt.rollingAvgKg)}`).join(' ');

  // X-axis labels
  const labelIndexes = new Set([0, Math.floor((series.length - 1) / 2), series.length - 1]);
  let xLabelsHtml = '';
  labelIndexes.forEach(idx => {
    if (series[idx]) {
      xLabelsHtml += `<text x="${xPos(idx)}" y="${h - 12}" text-anchor="middle" class="chart-axis-text">${formatShortDate(series[idx].date)}</text>`;
    }
  });

  // Dots for daily weight & rolling avg
  let dotsHtml = '';
  series.forEach((pt, i) => {
    const cx = xPos(i);
    const cyRaw = yPos(pt.weightKg);
    const cyAvg = yPos(pt.rollingAvgKg);
    dotsHtml += `
      <circle cx="${cx}" cy="${cyRaw}" r="4.5" class="chart-dot-raw">
        <title>${pt.date}: ${pt.weightKg} kg (Daily reading)</title>
      </circle>
      <circle cx="${cx}" cy="${cyAvg}" r="3.5" class="chart-dot-avg">
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
        ${bandHeight > 0 ? `<rect x="${pad.left}" y="${bandTop}" width="${plotW}" height="${bandHeight}" class="chart-goal-band" />` : ''}
        ${gridHtml}
        ${series.length > 1 ? `<polyline fill="none" points="${avgPoints}" class="chart-line-avg" />` : ''}
        ${dotsHtml}
        ${xLabelsHtml}
      </svg>
    </div>
  `;
}

// 2. Waist Measurement Over Time
export function renderWaistChartSvg(state) {
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
        ${gridHtml}
        ${entries.length > 1 ? `<polyline fill="none" points="${pts}" class="chart-line-waist" />` : ''}
        ${dotsHtml}
        ${xLabelsHtml}
      </svg>
    </div>
  `;
}

// 3. Calories and Protein by Day
export function renderNutritionChartSvg(state) {
  const entries = Object.values(state.dailyLogs)
    .filter(d => d && (Number(d.caloriesKcal) > 0 || Number(d.proteinG) > 0))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14); // Show up to last 14 logged days for readability

  if (entries.length === 0) {
    return renderEmptyChartState(
      'No nutrition days logged yet',
      'Log your daily calories and protein in the Nutrition tab to compare daily intake against your 2,100 kcal and 150 g protein targets.',
      '🥗'
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
      <rect x="${cx - barW / 2}" y="${barTop}" width="${barW}" height="${barH}" rx="3" class="chart-bar-cal">
        <title>${e.date}: ${cal} kcal / ${pro}g protein</title>
      </rect>
      <circle cx="${cx}" cy="${py}" r="4" class="chart-dot-pro">
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
export function renderWeeklyRunningChartSvg(state) {
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

  // Also include pre-programme or current week if any runs exist outside W1-W6
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
      <rect x="${cx - barW - 2}" y="${yPlan}" width="${barW}" height="${hPlan}" rx="3" class="chart-bar-planned">
        <title>${wk.label} Planned: ${wk.plannedKm} km</title>
      </rect>
      <rect x="${cx + 2}" y="${yAct}" width="${barW}" height="${hAct}" rx="3" class="chart-bar-actual">
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
export function renderGymLoadChartSvg(state, selectedExerciseName = 'Barbell bench press') {
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
      '🏋️'
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
        ${gridHtml}
        ${points.length > 1 ? `<polyline fill="none" points="${polyPts}" class="chart-line-gym" />` : ''}
        ${dotsHtml}
      </svg>
    </div>
  `;
}

// 6. Habit Completion by Week
export function renderHabitWeeklyChartSvg(state) {
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

  // Also check current active week if pre-programme
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
