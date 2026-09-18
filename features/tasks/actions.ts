"use server";

import { revalidatePath } from "next/cache";

import { taskStatusSchema } from "@/domain/schemas";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";

export async function updateTaskStatus(taskId: string, status: unknown): Promise<ActionResult> {
  await requireSession();

  const parsed = taskStatusSchema.safeParse(status);
  if (!parsed.success) return actionError("Неизвестный статус задачи");

  const task = await db.tasks.update(taskId, { status: parsed.data });
  if (!task) return actionError("Задача не найдена");

  revalidatePath("/lists");
  revalidatePath(`/lists/${task.listId}`);
  revalidatePath(`/tasks/${taskId}`);

  return actionOk();
}
