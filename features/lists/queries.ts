import { getListStats, type ListStats } from "@/domain/list-stats";
import type { TaskList } from "@/domain/list";
import type { Task } from "@/domain/task";
import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";

export type ListWithStats = TaskList & {
  stats: ListStats;
};

export type ListsSummary = {
  lists: number;
  tasks: number;
  overdue: number;
};

function groupByListId(tasks: Task[]): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>();

  for (const task of tasks) {
    const existing = grouped.get(task.listId);
    if (existing) existing.push(task);
    else grouped.set(task.listId, [task]);
  }

  return grouped;
}

export async function getLists(query = ""): Promise<ListWithStats[]> {
  await requireSession();

  const [lists, tasks] = await Promise.all([db.lists.findAll(), db.tasks.findAll()]);
  const now = new Date();
  const tasksByList = groupByListId(tasks);
  const normalizedQuery = query.trim().toLowerCase();

  return lists
    .filter((list) => list.name.toLowerCase().includes(normalizedQuery))
    .map((list) => ({ ...list, stats: getListStats(tasksByList.get(list.id) ?? [], now) }));
}

export async function getListsSummary(): Promise<ListsSummary> {
  await requireSession();

  const [lists, tasks] = await Promise.all([db.lists.findAll(), db.tasks.findAll()]);
  const now = new Date();

  return {
    lists: lists.length,
    tasks: tasks.length,
    overdue: getListStats(tasks, now).counters.overdue,
  };
}
