import type { Task, TaskPriority, TaskStatus } from "./task";

type TaskOverrides = {
  id?: string;
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueAt?: Date | null;
  updatedAt?: Date;
};

export function makeTask(overrides: TaskOverrides = {}): Task {
  const createdAt = new Date("2026-09-01T09:00:00Z");

  return {
    id: overrides.id ?? overrides.title ?? "task",
    listId: "list",
    title: overrides.title ?? "Задача",
    description: "",
    status: overrides.status ?? "new",
    priority: overrides.priority ?? "medium",
    dueAt: overrides.dueAt === undefined ? null : overrides.dueAt,
    createdAt,
    updatedAt: overrides.updatedAt ?? createdAt,
  };
}
