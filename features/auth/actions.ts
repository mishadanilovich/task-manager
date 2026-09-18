"use server";

import { redirect } from "next/navigation";

import { z } from "zod";

import { credentialsSchema } from "@/domain/schemas";
import { actionError, type ActionResult } from "@/lib/action-result";
import { verifyCredentials } from "@/server/auth/credentials";
import { endSession, startSession } from "@/server/auth/session";

export async function signIn(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return actionError("Проверьте поля формы", z.flattenError(parsed.error).fieldErrors);
  }

  if (!verifyCredentials(parsed.data)) {
    return actionError("Неверный email или пароль");
  }

  await startSession(parsed.data.email);
  redirect("/lists");
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/login");
}
