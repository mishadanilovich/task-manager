import { isOverdue, TASK_PRIORITY_WEIGHT, type Task } from "./task";

function compareDueAt(a: Date | null, b: Date | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;

  return a.getTime() - b.getTime();
}

function compareOpenTasks(a: Task, b: Task, now: Date): number {
  const overdueDiff = Number(isOverdue(b, now)) - Number(isOverdue(a, now));
  if (overdueDiff !== 0) return overdueDiff;

  const dueDiff = compareDueAt(a.dueAt, b.dueAt);
  if (dueDiff !== 0) return dueDiff;

  return TASK_PRIORITY_WEIGHT[b.priority] - TASK_PRIORITY_WEIGHT[a.priority];
}

function compareDoneTasks(a: Task, b: Task): number {
  return b.updatedAt.getTime() - a.updatedAt.getTime();
}

export function compareTasks(a: Task, b: Task, now: Date): number {
  const doneDiff = Number(a.status === "done") - Number(b.status === "done");
  if (doneDiff !== 0) return doneDiff;

  const byGroup = a.status === "done" ? compareDoneTasks(a, b) : compareOpenTasks(a, b, now);
  if (byGroup !== 0) return byGroup;

  return a.title.localeCompare(b.title, "ru");
}

export function sortTasks(tasks: readonly Task[], now: Date): Task[] {
  return [...tasks].sort((a, b) => compareTasks(a, b, now));
}
