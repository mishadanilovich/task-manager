import type { Credentials } from "@/domain/schemas";

const DEFAULT_EMAIL = "admin@example.com";
const DEFAULT_PASSWORD = "Admin123!";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function verifyCredentials({ email, password }: Credentials): boolean {
  const expectedEmail = process.env.AUTH_EMAIL ?? DEFAULT_EMAIL;
  const expectedPassword = process.env.AUTH_PASSWORD ?? DEFAULT_PASSWORD;

  return normalizeEmail(email) === normalizeEmail(expectedEmail) && password === expectedPassword;
}
