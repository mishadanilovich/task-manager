export const TASK_STATUSES = ["new", "in_progress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export type Task = {
  id: string;
  listId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function isOpen(task: Task): boolean {
  return task.status !== "done";
}
