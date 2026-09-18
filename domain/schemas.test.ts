import { describe, expect, it } from "vitest";

import { credentialsSchema, listFormSchema, taskFormSchema } from "./schemas";

const validTask = {
  title: "Починить релизный пайплайн",
  description: "",
  status: "new",
  priority: "medium",
  dueDate: null,
  dueTime: null,
};

describe("credentialsSchema", () => {
  it("принимает корректные учётные данные", () => {
    const result = credentialsSchema.safeParse({
      email: "admin@example.com",
      password: "Admin123!",
    });

    expect(result.success).toBe(true);
  });

  it("отклоняет адрес без домена", () => {
    const result = credentialsSchema.safeParse({ email: "anna@stopka", password: "Admin123!" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Введите адрес целиком, например name@company.ru");
  });

  it("требует пароль не короче восьми символов", () => {
    const result = credentialsSchema.safeParse({ email: "admin@example.com", password: "123" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Не короче 8 символов");
  });
});

describe("listFormSchema", () => {
  it("обрезает пробелы вокруг названия", () => {
    const result = listFormSchema.parse({ name: "  Релиз 2.5  " });

    expect(result.name).toBe("Релиз 2.5");
  });

  it("отклоняет название из одних пробелов", () => {
    const result = listFormSchema.safeParse({ name: "   " });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Название обязательно");
  });

  it("отклоняет название длиннее 60 символов", () => {
    const result = listFormSchema.safeParse({ name: "я".repeat(61) });

    expect(result.success).toBe(false);
  });
});

describe("taskFormSchema", () => {
  it("принимает задачу без дедлайна", () => {
    const result = taskFormSchema.safeParse(validTask);

    expect(result.success).toBe(true);
  });

  it("требует название", () => {
    const result = taskFormSchema.safeParse({ ...validTask, title: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Название обязательно");
  });

  it("не принимает время без даты", () => {
    const result = taskFormSchema.safeParse({ ...validTask, dueTime: "18:00" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["dueDate"]);
  });

  it("принимает дату вместе со временем", () => {
    const result = taskFormSchema.safeParse({
      ...validTask,
      dueDate: "2026-09-19",
      dueTime: "16:00",
    });

    expect(result.success).toBe(true);
  });

  it("отклоняет неизвестный статус", () => {
    const result = taskFormSchema.safeParse({ ...validTask, status: "archived" });

    expect(result.success).toBe(false);
  });
});
