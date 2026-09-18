"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { listFormSchema } from "@/domain/schemas";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import { requireSession } from "@/server/auth/session";
import { db } from "@/server/db";

export type SavedList = { id: string; name: string };

const invalidForm = (error: z.ZodError) =>
  actionError("Проверьте поля формы", z.flattenError(error).fieldErrors);

export async function createList(values: unknown): Promise<ActionResult<SavedList>> {
  await requireSession();

  const parsed = listFormSchema.safeParse(values);
  if (!parsed.success) return invalidForm(parsed.error);

  const list = await db.lists.create(parsed.data.name);
  revalidatePath("/lists");

  return actionOk({ id: list.id, name: list.name });
}

export async function renameList(id: string, values: unknown): Promise<ActionResult<SavedList>> {
  await requireSession();

  const parsed = listFormSchema.safeParse(values);
  if (!parsed.success) return invalidForm(parsed.error);

  const renamed = await db.lists.rename(id, parsed.data.name);
  if (!renamed) return actionError("Список не найден");

  revalidatePath("/lists");
  revalidatePath(`/lists/${id}`);

  return actionOk({ id: renamed.id, name: renamed.name });
}

export async function deleteList(id: string): Promise<ActionResult> {
  await requireSession();

  const removed = await db.lists.remove(id);
  if (!removed) return actionError("Список не найден");

  revalidatePath("/lists");

  return actionOk();
}
