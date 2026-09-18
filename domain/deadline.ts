import { isOpen, type Task } from "./task";

export const SOON_WINDOW_HOURS = 48;

const HOUR_MS = 60 * 60 * 1000;
const SOON_WINDOW_MS = SOON_WINDOW_HOURS * HOUR_MS;

export type DeadlineState = "none" | "overdue" | "soon" | "scheduled";

export type DeadlineDistance = {
  direction: "past" | "future";
  unit: "hour" | "day";
  value: number;
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function calendarDaysBetween(from: Date, to: Date): number {
  const diff = startOfDay(to).getTime() - startOfDay(from).getTime();

  return Math.round(diff / (24 * HOUR_MS));
}

export function getDeadlineState(task: Task, now: Date): DeadlineState {
  if (task.dueAt === null || !isOpen(task)) return "none";

  const remaining = task.dueAt.getTime() - now.getTime();
  if (remaining < 0) return "overdue";
  if (remaining <= SOON_WINDOW_MS) return "soon";

  return "scheduled";
}

export function getDeadlineDistance(dueAt: Date, now: Date): DeadlineDistance {
  const diff = dueAt.getTime() - now.getTime();
  const direction = diff < 0 ? "past" : "future";
  const absDiff = Math.abs(diff);

  if (absDiff < 24 * HOUR_MS) {
    return { direction, unit: "hour", value: Math.floor(absDiff / HOUR_MS) };
  }

  return { direction, unit: "day", value: Math.abs(calendarDaysBetween(now, dueAt)) };
}

const END_OF_DAY = { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 } as const;

function isEndOfDay(date: Date): boolean {
  return (
    date.getHours() === END_OF_DAY.hours &&
    date.getMinutes() === END_OF_DAY.minutes &&
    date.getSeconds() === END_OF_DAY.seconds &&
    date.getMilliseconds() === END_OF_DAY.milliseconds
  );
}

export function combineDueAt(dueDate: string | null, dueTime: string | null): Date | null {
  if (dueDate === null) return null;

  const [year, month, day] = dueDate.split("-").map(Number);
  if (dueTime === null) {
    return new Date(
      year,
      month - 1,
      day,
      END_OF_DAY.hours,
      END_OF_DAY.minutes,
      END_OF_DAY.seconds,
      END_OF_DAY.milliseconds,
    );
  }

  const [hours, minutes] = dueTime.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}

export function splitDueAt(dueAt: Date | null): { dueDate: string | null; dueTime: string | null } {
  if (dueAt === null) return { dueDate: null, dueTime: null };

  const pad = (value: number) => String(value).padStart(2, "0");
  const dueDate = `${dueAt.getFullYear()}-${pad(dueAt.getMonth() + 1)}-${pad(dueAt.getDate())}`;
  return {
    dueDate,
    dueTime: isEndOfDay(dueAt) ? null : `${pad(dueAt.getHours())}:${pad(dueAt.getMinutes())}`,
  };
}
