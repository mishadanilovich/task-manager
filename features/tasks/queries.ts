import { getListStats, type ListStats } from "@/domain/list-stats";
import type { TaskList } from "@/domain/list";
import { sortTasks } from "@/domain/sort-tasks";
import type { Task, TaskStatus } from "@/domain/task";
import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";

export type ListTasks = {
  list: TaskList;
  tasks: Task[];
  stats: ListStats;
  now: Date;
};

export async function getListTasks(
  listId: string,
  status: TaskStatus | null = null,
): Promise<ListTasks | null> {
  await requireSession();

  const list = await db.lists.findById(listId);
  if (!list) return null;

  const tasks = await db.tasks.findByListId(listId);
  const now = new Date();
  const visible = status ? tasks.filter((task) => task.status === status) : tasks;

  return { list, tasks: sortTasks(visible, now), stats: getListStats(tasks, now), now };
}

export async function getTask(taskId: string): Promise<{ task: Task; list: TaskList } | null> {
  await requireSession();

  const task = await db.tasks.findById(taskId);
  if (!task) return null;

  const list = await db.lists.findById(task.listId);
  if (!list) return null;

  return { task, list };
}
