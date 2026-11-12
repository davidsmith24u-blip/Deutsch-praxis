// SM-2-lite spaced repetition scheduling.

export type Rating = "again" | "hard" | "good" | "easy";

export interface SrsState {
  intervalDays: number;
  ease: number;
  reps: number;
  lapses: number;
  dueAt: Date;
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * Simplified SM-2:
 * - again: rep failed → interval resets to 10 minutes, ease -0.2 (min 1.3), lapse++
 * - hard:  interval * 1.2, ease -0.15
 * - good:  interval * ease (first success → 1 day)
 * - easy:  interval * ease * 1.3, ease +0.15
 */
export function schedule(prev: { interval_days: number; ease: number; reps: number; lapses: number }, rating: Rating, now = new Date()): SrsState {
  let { interval_days, ease, reps, lapses } = prev;
  let ms: number;

  if (rating === "again") {
    ease = Math.max(1.3, ease - 0.2);
    lapses += 1;
    reps = 0;
    interval_days = 0;
    ms = 10 * 60 * 1000; // 10 minutes
  } else {
    reps += 1;
    if (rating === "hard") {
      ease = Math.max(1.3, ease - 0.15);
      ms = interval_days > 0 ? interval_days * 1.2 * DAY : 6 * 60 * 60 * 1000;
    } else if (rating === "good") {
      ms = interval_days > 0 ? interval_days * ease * DAY : DAY;
    } else {
      // easy
      ease = Math.min(3.0, ease + 0.15);
      ms = interval_days > 0 ? interval_days * ease * 1.3 * DAY : 3 * DAY;
    }
    if (ms >= DAY) interval_days = Math.max(1, Math.round(ms / DAY));
  }

  return {
    intervalDays: interval_days,
    ease: Math.round(ease * 100) / 100,
    reps,
    lapses,
    dueAt: new Date(now.getTime() + ms),
  };
}
