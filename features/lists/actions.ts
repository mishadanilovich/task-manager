"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { listFormSchema } from "@/domain/schemas";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";

const invalidForm = (error: z.ZodError) =>
  actionError("Проверьте поля формы", z.flattenError(error).fieldErrors);

export async function createList(values: unknown): Promise<ActionResult<{ id: string }>> {
  await requireSession();

  const parsed = listFormSchema.safeParse(values);
  if (!parsed.success) return invalidForm(parsed.error);

  const list = await db.lists.create(parsed.data.name);
  revalidatePath("/lists");

  return actionOk({ id: list.id });
}

export async function renameList(
  id: string,
  values: unknown,
): Promise<ActionResult<{ id: string }>> {
  await requireSession();

  const parsed = listFormSchema.safeParse(values);
  if (!parsed.success) return invalidForm(parsed.error);

  const renamed = await db.lists.rename(id, parsed.data.name);
  if (!renamed) return actionError("Список не найден");

  revalidatePath("/lists");
  revalidatePath(`/lists/${id}`);

  return actionOk({ id: renamed.id });
}

export async function deleteList(id: string): Promise<ActionResult> {
  await requireSession();

  const removed = await db.lists.remove(id);
  if (!removed) return actionError("Список не найден");

  revalidatePath("/lists");

  return actionOk();
}
