import type { TaskList } from "@/domain/list";
import type { Task, TaskPriority, TaskStatus } from "@/domain/task";

export type NewTask = {
  listId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: Date | null;
};

export type TaskPatch = Partial<Omit<NewTask, "listId">>;

export type ListsRepository = {
  findAll(): Promise<TaskList[]>;
  findById(id: string): Promise<TaskList | null>;
  create(name: string): Promise<TaskList>;
  rename(id: string, name: string): Promise<TaskList | null>;
  remove(id: string): Promise<boolean>;
};

export type TasksRepository = {
  findAll(): Promise<Task[]>;
  findByListId(listId: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(input: NewTask): Promise<Task>;
  update(id: string, patch: TaskPatch): Promise<Task | null>;
  remove(id: string): Promise<boolean>;
};

export type Database = {
  lists: ListsRepository;
  tasks: TasksRepository;
};
