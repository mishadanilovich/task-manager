import type { TaskList } from "@/domain/list";
import type { Task } from "@/domain/task";

import type { Database, NewTask, TaskPatch } from "./repository";

export type MemoryData = {
  lists: TaskList[];
  tasks: Task[];
};

export type MemoryDatabaseOptions = {
  latencyMs?: number;
  createId?: () => string;
};

const clone = <T extends object>(entity: T): T => ({ ...entity });

function delay(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();

  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createMemoryDatabase(
  data: MemoryData,
  { latencyMs = 0, createId = () => crypto.randomUUID() }: MemoryDatabaseOptions = {},
): Database {
  const lists = new Map(data.lists.map((list) => [list.id, list]));
  const tasks = new Map(data.tasks.map((task) => [task.id, task]));

  const wait = () => delay(latencyMs);

  return {
    lists: {
      async findAll() {
        await wait();

        return [...lists.values()].map(clone);
      },

      async findById(id) {
        await wait();
        const list = lists.get(id);

        return list ? clone(list) : null;
      },

      async create(name) {
        await wait();
        const now = new Date();
        const list: TaskList = { id: createId(), name, createdAt: now, updatedAt: now };
        lists.set(list.id, list);

        return clone(list);
      },

      async rename(id, name) {
        await wait();
        const list = lists.get(id);
        if (!list) return null;

        const renamed: TaskList = { ...list, name, updatedAt: new Date() };
        lists.set(id, renamed);

        return clone(renamed);
      },

      async remove(id) {
        await wait();
        if (!lists.delete(id)) return false;

        for (const [taskId, task] of tasks) {
          if (task.listId === id) tasks.delete(taskId);
        }

        return true;
      },
    },

    tasks: {
      async findAll() {
        await wait();

        return [...tasks.values()].map(clone);
      },

      async findByListId(listId) {
        await wait();

        return [...tasks.values()].filter((task) => task.listId === listId).map(clone);
      },

      async findById(id) {
        await wait();
        const task = tasks.get(id);

        return task ? clone(task) : null;
      },

      async create(input: NewTask) {
        await wait();
        const now = new Date();
        const task: Task = { ...input, id: createId(), createdAt: now, updatedAt: now };
        tasks.set(task.id, task);

        return clone(task);
      },

      async update(id, patch: TaskPatch) {
        await wait();
        const task = tasks.get(id);
        if (!task) return null;

        const updated: Task = { ...task, ...patch, updatedAt: new Date() };
        tasks.set(id, updated);

        return clone(updated);
      },

      async remove(id) {
        await wait();

        return tasks.delete(id);
      },
    },
  };
}
