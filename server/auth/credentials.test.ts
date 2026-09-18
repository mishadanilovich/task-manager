import { afterEach, describe, expect, it } from "vitest";

import { verifyCredentials } from "./credentials";

const demo = { email: "admin@example.com", password: "Admin123!" };

afterEach(() => {
  delete process.env.AUTH_EMAIL;
  delete process.env.AUTH_PASSWORD;
});

describe("verifyCredentials", () => {
  it("принимает демонстрационные учётные данные", () => {
    expect(verifyCredentials(demo)).toBe(true);
  });

  it("не зависит от регистра и пробелов в адресе", () => {
    expect(verifyCredentials({ ...demo, email: "  Admin@Example.com " })).toBe(true);
  });

  it("отклоняет неверный пароль", () => {
    expect(verifyCredentials({ ...demo, password: "admin123!" })).toBe(false);
  });

  it("отклоняет неизвестный адрес", () => {
    expect(verifyCredentials({ ...demo, email: "anna@stopka.ru" })).toBe(false);
  });

  it("использует учётные данные из переменных окружения", () => {
    process.env.AUTH_EMAIL = "anna@stopka.ru";
    process.env.AUTH_PASSWORD = "Sekret123!";

    expect(verifyCredentials({ email: "anna@stopka.ru", password: "Sekret123!" })).toBe(true);
    expect(verifyCredentials(demo)).toBe(false);
  });
});
