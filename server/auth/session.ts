import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "./cookie";

export type Session = {
  email: string;
};

export const getSession = cache(async (): Promise<Session | null> => {
  const email = (await cookies()).get(SESSION_COOKIE)?.value;

  return email ? { email } : null;
});

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");

  return session;
}

export async function startSession(email: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
