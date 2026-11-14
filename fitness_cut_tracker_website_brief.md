# 6-Week Fitness Cut & Training Tracker

## Website deployment brief for Antigravity

**Programme dates:** Monday, 23 November 2026 -- Tuesday, 5 January 2027
**Starting profile:** 75 kg, 172 cm, approximately 30% body fat (user estimate)
**Running background:** Completed two half-marathons; current weekly mileage and recent long-run distance still need to be confirmed.
**Primary goal:** Reduce body fat while retaining/building muscle, maintaining aerobic fitness, and building consistent habits.

------------------------------------------------------------------------

## 1. Product goal

Build a responsive personal fitness dashboard / progressive web app (PWA) that helps the user:

- Track daily body weight, waist measurements, calories and macros.
- Follow a combined gym and running programme.
- View each day's workout and mark exercises/sets as completed.
- Track runs, distance, duration, pace, effort and notes.
- Maintain a daily to-do / habit checklist.
- Review weekly progress with charts and summaries.
- See the full programme calendar from 23 November 2026 to 5 January 2027.
- Edit targets and workout details without changing source code.

This is a personal tracker, not a medical device. Do not promise a specific amount of fat loss or infer body-fat percentage from weight.

## 2. Important implementation requirements

1. Make the interface mobile-first, fast, clean and easy to use at the gym.
2. Use a calendar and dashboard as the main navigation.
3. Persist user data locally (for example, IndexedDB or local storage) so refreshes do not erase entries.
4. Include export/import of all user data as JSON and export of logs as CSV.
5. Use sensible empty states and validation.
6. All targets and programme data should be editable in the UI.
7. Do not require account creation or a backend for the first version.
8. Include a clear reset option with a confirmation step.
9. Use local date handling consistently; do not let UTC conversion shift a workout to the previous/next day.
10. Include a disclaimer that calorie and weight targets are estimates and should be adjusted based on real progress, recovery and professional advice where appropriate.

## 3. Main navigation

Create these sections:

- **Dashboard**
- **Calendar**
- **Workout**
- **Running**
- **Nutrition**
- **Progress**
- **To-do & Habits**
- **Settings**

The dashboard should show today's date, planned session, completion status, macro progress, current weight trend, next workout and a quick-add action.

## 4. Starting profile and targets

Use these as editable initial values:

| Setting | Initial value |
| --- | --- |
| Start weight | 75 kg |
| Height | 172 cm |
| Estimated body fat | 30% (user estimate) |
| Daily calorie target | 2,100 kcal |
| Protein target | 150 g |
| Fat target | 60 g |
| Carbohydrate target | 232 g |
| Daily steps target | 8,000--10,000 |
| Water target | 2.5--3.5 L |
| Sleep target | 7.5--9 hours |
| Training structure | 3 gym + 3 runs + 1 recovery day per week |

**Macro arithmetic note:** 150 g protein + 60 g fat + 232 g carbohydrates = 2,088 kcal using 4/9/4 kcal per gram. The initial plan used approximately 2,100 kcal. Display the calculated total transparently and allow the user to adjust macros. If the user enters a calorie target, do not silently change their macro targets.

The target weight discussed was approximately 71--73 kg by 5 January, but this is a provisional aspiration, not a guarantee. Show it as an optional goal range, not a required outcome. Emphasize gradual loss, muscle retention and recovery.

### Nutrition tracking

Allow the user to enter:
- Calories (kcal)
- Protein (g)
- Carbohydrates (g)
- Fat (g)
- Water (L)
- Optional meal name/notes

Provide quick-add entries and an editable food/meal list, but do not require a food database or barcode scanner in version one.

Show:
- Daily totals vs targets
- Remaining calories and macros
- Weekly average calories and protein
- A warning when the user repeatedly misses protein or has an unusually low calorie intake

The user cannot reliably choose the meals served, but can control portions/macros. The UI should therefore support logging macros directly without requiring a prescribed meal plan.

## 5. Weekly training structure

Repeat this schedule throughout the programme, with the phase-specific running distances below.

| Day | Session |
| --- | --- |
| Monday | Full-body gym A |
| Tuesday | Easy aerobic run |
| Wednesday | Full-body gym B |
| Thursday | Intervals or tempo run |
| Friday | Full-body gym C |
| Saturday | Rest and mobility |
| Sunday | Long easy run |

Allow the user to mark a session as completed, skipped or modified. Allow rescheduling without losing the original planned date.

### Monday -- Full-body A

| Exercise | Planned sets | Rep target |
| --- | --- | --- |
| Barbell bench press | 3 | 8--10 |
| Lat pulldown | 3 | 10--12 |
| Squat | 3 | 8--10 |
| Dumbbell shoulder press | 3 | 10 |
| Cable triceps pushdown | 2 | 12 |
| Dumbbell curls | 2 | 12 |
| Plank | 3 | 40--60 seconds |

### Wednesday -- Full-body B

| Exercise | Planned sets | Rep target |
| --- | --- | --- |
| Romanian deadlift | 3 | 8--10 |
| Incline dumbbell press | 3 | 10 |
| Seated cable row | 3 | 10--12 |
| Leg press | 3 | 10 |
| Lateral raises | 3 | 12--15 |
| Hanging knee raises | 3 | 12 |
| Face pulls | 2 | 15 |

### Friday -- Full-body C

| Exercise | Planned sets | Rep target |
| --- | --- | --- |
| Bulgarian split squat | 2 | 10 each leg |
| Chest-supported row | 3 | 10 |
| Machine chest press | 3 | 10 |
| Leg curl | 2 | 12 |
| Lateral raises | 3 | 15 |
| Biceps curls | 2 | 12 |
| Triceps extensions | 2 | 12 |
| Cable crunches | 3 | 15 |

### Gym logging behaviour

For each exercise, support:
- Exercise name
- Planned sets and rep range
- Actual sets
- Reps per set
- Weight used (kg)
- Optional RPE / reps in reserve
- Notes
- Exercise completion toggle

Prepopulate the planned exercises, but let the user add, remove, reorder or substitute exercises. Remember the last-used weight for each exercise and show it as a reference, not an instruction.

Training guidance displayed in the app:
- Warm up for 5--10 minutes.
- Keep approximately 2 repetitions in reserve on most working sets.
- Rest 2--3 minutes on compound lifts and 60--90 seconds on isolation work.
- Increase load gradually only when the top of the rep range is completed with good technique.
- Reduce lower-body volume if running fatigue is interfering with recovery.
- Do not train through persistent pain.

## 6. Running programme

The user has completed two half-marathons, but current mileage is unknown. The following is a **provisional schedule** and must be editable. Do not force these distances if they exceed the user's recent training base. Include a setting for current weekly mileage and recent comfortable long-run distance, and show a reminder to scale the plan conservatively.

| Week | Easy run | Quality session | Long easy run |
| --- | --- | --- | --- |
| Week 1 | 4 km | 4 × 2 min fast | 7 km |
| Week 2 | 5 km | 5 × 2 min fast | 8 km |
| Week 3 | 5 km | 3 × 5 min tempo | 9 km |
| Week 4 | 5 km | 5 × 3 min fast | 10 km |
| Week 5 | 6 km | 3 × 6 min tempo | 10--12 km |
| Week 6 | 4 km | 4 × 2 min controlled | 7--8 km |

Quality sessions include a 10-minute warm-up and cool-down. Recover between repetitions with easy jogging or walking.

Effort guidance:
- Easy: conversational, approximately 3--4/10 effort.
- Tempo: comfortably hard, approximately 7/10 effort.
- Intervals: controlled hard effort, approximately 8/10; not all-out sprinting.

### Running log fields

- Date
- Session type (easy / interval / tempo / long / recovery / other)
- Distance (km)
- Duration
- Calculated average pace
- Optional average heart rate
- Effort rating (1--10)
- Route / surface
- Notes
- Completed / modified / skipped

Calculate pace from duration and distance. Validate that distance and duration are positive. Allow manual entry; no GPS integration is required for version one.

## 7. Programme calendar and phases

The programme begins Monday, 23 November 2026 and ends Tuesday, 5 January 2027.

| Phase | Dates | Focus |
| --- | --- | --- |
| Week 1 | Nov 23--29 | Adaptation and routine |
| Week 2 | Nov 30--Dec 6 | Foundation and consistency |
| Week 3 | Dec 7--13 | Progressive overload |
| Week 4 | Dec 14--20 | Conditioning |
| Week 5 | Dec 21--27 | Peak training, if recovery is good |
| Week 6 | Dec 28--Jan 3 | Consolidation and reduced fatigue |
| Final assessment | Jan 4--5 | Moderate session and progress review |

Final days:
- Monday, 4 January: moderate full-body gym session.
- Tuesday, 5 January: easy run and final assessment.

For Week 6, reduce gym working sets by approximately 30--40% and reduce running intensity/volume. Do not schedule an exhausting final workout.

The calendar should:
- Display the planned activity for every date.
- Distinguish gym, run, rest and assessment days.
- Allow completion, skip, edit and reschedule actions.
- Show completed vs planned sessions.
- Support a week view and month view.
- Clearly identify the programme start and end dates.

## 8. Daily to-do and habit tracker

Prepopulate these daily habits, all editable:

- [ ] Hit protein target (140--160 g range around 150 g target)
- [ ] Stay reasonably close to calorie target
- [ ] Complete the scheduled workout, or record a planned rest day
- [ ] Reach an appropriate step target
- [ ] Drink enough water
- [ ] Get sufficient sleep
- [ ] Record morning body weight

Additional optional habits:
- 5--10 minutes mobility
- Prepare gym/running clothes
- Log all meals
- Stretch or cool down after training

Show daily completion percentage, weekly habit consistency and streaks. Do not shame the user for missed days; allow them to resume without resetting all progress.

## 9. Body measurements and progress

Allow logging by date:

| Metric | Unit |
| --- | --- |
| Body weight | kg |
| Waist | cm |
| Chest | cm |
| Hips | cm |
| Resting heart rate | bpm |
| Average sleep | hours |
| Optional body-fat estimate | % |
| Progress photo | image attachment, optional |

Prompt for a weekly measurement, ideally Monday morning under consistent conditions. Photos should be optional and private.

Charts:
- Daily weight points and 7-day rolling average
- Waist measurement over time
- Calories and protein by day
- Weekly running distance
- Gym exercise load / performance history
- Habit completion by week

Use a 7-day average for weight comparisons. Explain that short-term scale changes can reflect water, glycogen, food and other normal fluctuations. Do not claim that a short-term weight change is all fat.

Progress rules shown to the user:
- A gradual trend around 0.4--0.7 kg per week was the initial working range, not a guaranteed outcome.
- Review after 14 days rather than reacting to a few daily readings.
- If weight is falling very quickly and recovery is poor, reassess intake and training.
- If there is no downward trend for two consecutive weeks despite consistent logging, review tracking accuracy and activity before making a small adjustment.
- Do not automatically change calories; ask the user to confirm changes.

## 10. Recovery and safety

Show these general reminders:
- Sleep target: 7.5--9 hours.
- One recovery day each week.
- Hydration target: approximately 2.5--3.5 L, adjusted for heat, sweat and individual needs.
- Daily steps target: 8,000--10,000 as a flexible guide.
- Avoid forcing steps or workouts when unusually fatigued.
- Stop exercise and seek appropriate medical advice for concerning symptoms such as chest pain, fainting, unusual breathlessness or persistent injury pain.

Supplement notes (optional, not required):
- Whey protein can help meet protein needs but is not essential.
- Creatine monohydrate 3--5 g/day is optional for healthy adults; users with relevant medical concerns should consult a clinician.
- Caffeine is optional and should be limited if it affects sleep or causes side effects.
- Electrolytes may be useful for longer or particularly sweaty sessions.
- Do not recommend fat burners.

## 11. Dashboard layout

Suggested dashboard cards:
1. **Today's plan** -- workout/run/rest with Start Session and Complete actions.
2. **Daily nutrition** -- calories and macro progress bars.
3. **Weight trend** -- latest weight and 7-day average.
4. **Today's habits** -- checklist and completion percentage.
5. **This week's training** -- gym sessions, runs and total distance.
6. **Next session** -- upcoming activity and date.
7. **Quick log** -- weight, meal macros, water, run or gym entry.

Avoid clutter. On mobile, use a bottom navigation bar or compact menu. Make primary buttons large enough to tap during a workout.

## 12. Suggested data model

Use a local database with entities similar to:

### UserSettings
- id
- heightCm
- startingWeightKg
- calorieTarget
- proteinTargetG
- fatTargetG
- carbohydrateTargetG
- stepTarget
- waterTargetL
- sleepTargetHours
- programmeStartDate
- programmeEndDate
- currentWeeklyRunKm
- recentLongRunKm

### DailyLog
- date
- weightKg
- caloriesKcal
- proteinG
- carbohydrateG
- fatG
- waterL
- steps
- sleepHours
- notes

### WorkoutSession
- id
- date
- type
- status
- notes
- completedAt

### ExerciseLog
- id
- workoutSessionId
- exerciseName
- setNumber
- reps
- weightKg
- durationSeconds
- rpe
- notes

### RunLog
- id
- date
- sessionType
- distanceKm
- durationSeconds
- averagePace
- averageHeartRate
- effort
- notes
- status

### HabitLog
- date
- habitId
- completed

### MeasurementLog
- date
- waistCm
- chestCm
- hipsCm
- restingHeartRate
- bodyFatEstimate
- photoReference

## 13. Settings and user control

Provide settings to:
- Edit calorie and macro targets.
- Edit all workout exercises, sets and reps.
- Edit running distances and sessions.
- Change daily habits.
- Change programme dates if needed.
- Choose kg/km/cm and preferred time format.
- Export all data to JSON.
- Export logs to CSV.
- Import a previous JSON backup.
- Reset data after an explicit confirmation.

Do not hard-code the programme so tightly that a missed session breaks the calendar.

## 14. Design direction

Visual style:
- Modern athletic training dashboard.
- Dark theme by default, with a light theme option.
- Neutral background, restrained accent colours and clear contrast.
- Clean typography, simple cards and progress bars.
- Charts with readable axes and units.
- Minimal animation; prioritize speed and usability.
- Responsive layout for Android phones, tablets and desktop.

Accessibility:
- Good colour contrast.
- Do not use colour alone to communicate completion or workout type.
- Keyboard-accessible controls.
- Descriptive labels and validation messages.

## 15. Acceptance criteria

The first version is complete when:

- [ ] The app opens to a useful dashboard.
- [ ] The full date range from 23 Nov 2026 to 5 Jan 2027 is present.
- [ ] All gym workouts and exercises are preloaded.
- [ ] The six-week running plan is preloaded and editable.
- [ ] A user can log actual sets, reps and weights.
- [ ] A user can log runs and see calculated pace.
- [ ] A user can log calories and macros without selecting predefined meals.
- [ ] Daily habits can be checked off.
- [ ] Weight and measurements can be logged over time.
- [ ] Charts show trends from entered data.
- [ ] Data remains after refresh and app restart.
- [ ] JSON backup/restore and CSV export work.
- [ ] The interface works on a mobile screen.
- [ ] The user can edit targets and reschedule sessions.
- [ ] The app does not automatically prescribe aggressive calorie cuts or force unsafe training progressions.

## 16. Build order

Build in this order to get a usable product quickly:

1. Responsive shell, navigation and dashboard.
2. Programme calendar and preloaded workouts.
3. Gym session logging.
4. Running log and pace calculation.
5. Nutrition and macro tracker.
6. Daily habit checklist.
7. Weight and measurement tracking with charts.
8. Local persistence and backup/export.
9. Mobile polish, accessibility and testing.

**Important:** Keep version one simple and fully functional. Do not spend time on social features, leaderboards, AI meal recognition, GPS tracking or cloud accounts before the core tracking workflow works.
