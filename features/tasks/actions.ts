"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { combineDueAt } from "@/domain/deadline";
import { taskFormSchema, taskStatusSchema } from "@/domain/schemas";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";

const invalidForm = (error: z.ZodError) =>
  actionError("Проверьте поля формы", z.flattenError(error).fieldErrors);

function revalidateList(listId: string) {
  revalidatePath("/lists");
  revalidatePath(`/lists/${listId}`);
}

export async function createTask(
  listId: string,
  values: unknown,
): Promise<ActionResult<{ id: string }>> {
  await requireSession();

  const parsed = taskFormSchema.safeParse(values);
  if (!parsed.success) return invalidForm(parsed.error);

  const list = await db.lists.findById(listId);
  if (!list) return actionError("Список не найден");

  const { dueDate, dueTime, ...rest } = parsed.data;
  const task = await db.tasks.create({ ...rest, listId, dueAt: combineDueAt(dueDate, dueTime) });
  revalidateList(listId);

  return actionOk({ id: task.id });
}

export async function updateTask(
  taskId: string,
  values: unknown,
): Promise<ActionResult<{ id: string }>> {
  await requireSession();

  const parsed = taskFormSchema.safeParse(values);
  if (!parsed.success) return invalidForm(parsed.error);

  const { dueDate, dueTime, ...rest } = parsed.data;
  const task = await db.tasks.update(taskId, { ...rest, dueAt: combineDueAt(dueDate, dueTime) });
  if (!task) return actionError("Задача не найдена");

  revalidateList(task.listId);

  return actionOk({ id: task.id });
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  await requireSession();

  const task = await db.tasks.findById(taskId);
  if (!task || !(await db.tasks.remove(taskId))) return actionError("Задача не найдена");

  revalidateList(task.listId);

  return actionOk();
}

export async function updateTaskStatus(taskId: string, status: unknown): Promise<ActionResult> {
  await requireSession();

  const parsed = taskStatusSchema.safeParse(status);
  if (!parsed.success) return actionError("Неизвестный статус задачи");

  const task = await db.tasks.update(taskId, { status: parsed.data });
  if (!task) return actionError("Задача не найдена");

  revalidateList(task.listId);

  return actionOk();
}
