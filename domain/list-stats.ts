import { getDeadlineState } from "./deadline";
import { isOpen, isOverdue, type Task } from "./task";

export type ListCounters = {
  new: number;
  in_progress: number;
  done: number;
  overdue: number;
  total: number;
};

export type ListIndicator = "overdue" | "soon" | "complete" | "neutral";

export type ListStats = {
  counters: ListCounters;
  progress: number;
  indicator: ListIndicator;
  nearestDueAt: Date | null;
};

function countTasks(tasks: readonly Task[], now: Date): ListCounters {
  const counters: ListCounters = {
    new: 0,
    in_progress: 0,
    done: 0,
    overdue: 0,
    total: tasks.length,
  };

  for (const task of tasks) {
    counters[task.status] += 1;
    if (isOverdue(task, now)) counters.overdue += 1;
  }

  return counters;
}

function getProgress({ done, total }: ListCounters): number {
  if (total === 0) return 0;
  if (done === total) return 100;

  return Math.min(Math.round((done / total) * 100), 99);
}

function getNearestDueAt(tasks: readonly Task[]): Date | null {
  const dueDates = tasks
    .filter(isOpen)
    .flatMap((task) => (task.dueAt === null ? [] : [task.dueAt]));
  if (dueDates.length === 0) return null;

  return dueDates.reduce((nearest, dueAt) => (dueAt < nearest ? dueAt : nearest));
}

function getIndicator(tasks: readonly Task[], counters: ListCounters, now: Date): ListIndicator {
  if (counters.overdue > 0) return "overdue";
  if (tasks.some((task) => getDeadlineState(task, now) === "soon")) return "soon";
  if (counters.total > 0 && counters.done === counters.total) return "complete";

  return "neutral";
}

export function getListStats(tasks: readonly Task[], now: Date): ListStats {
  const counters = countTasks(tasks, now);

  return {
    counters,
    progress: getProgress(counters),
    indicator: getIndicator(tasks, counters, now),
    nearestDueAt: getNearestDueAt(tasks),
  };
}
