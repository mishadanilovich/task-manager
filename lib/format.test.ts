import { describe, expect, it } from "vitest";

import {
  formatDeadline,
  formatLists,
  formatOverdue,
  formatOverdueTasks,
  formatTasks,
  pluralize,
} from "./format";

describe("pluralize", () => {
  it.each([
    [1, "день"],
    [2, "дня"],
    [4, "дня"],
    [5, "дней"],
    [11, "дней"],
    [14, "дней"],
    [21, "день"],
    [22, "дня"],
    [25, "дней"],
    [0, "дней"],
  ])("%i → %s", (count, expected) => {
    expect(pluralize(count, ["день", "дня", "дней"])).toBe(expected);
  });
});

describe("счётчики", () => {
  it("склоняет списки", () => {
    expect(formatLists(1)).toBe("1 список");
    expect(formatLists(6)).toBe("6 списков");
  });

  it("склоняет задачи", () => {
    expect(formatTasks(2)).toBe("2 задачи");
    expect(formatTasks(47)).toBe("47 задач");
  });

  it("склоняет просроченные в сводке", () => {
    expect(formatOverdue(1)).toBe("1 просрочена");
    expect(formatOverdue(4)).toBe("4 просрочено");
  });

  it("склоняет просроченные внутри предложения", () => {
    expect(formatOverdueTasks(1)).toBe("1 просроченную");
    expect(formatOverdueTasks(2)).toBe("2 просроченные");
    expect(formatOverdueTasks(5)).toBe("5 просроченных");
  });
});

describe("formatDeadline", () => {
  it("описывает просрочку в днях", () => {
    expect(formatDeadline({ direction: "past", unit: "day", value: 3 })).toBe(
      "Просрочено на 3 дня",
    );
    expect(formatDeadline({ direction: "past", unit: "day", value: 1 })).toBe(
      "Просрочено на 1 день",
    );
  });

  it("описывает оставшееся время в часах", () => {
    expect(formatDeadline({ direction: "future", unit: "hour", value: 18 })).toBe("Через 18 часов");
    expect(formatDeadline({ direction: "future", unit: "hour", value: 1 })).toBe("Через 1 час");
  });

  it("описывает оставшиеся дни", () => {
    expect(formatDeadline({ direction: "future", unit: "day", value: 2 })).toBe("Через 2 дня");
    expect(formatDeadline({ direction: "future", unit: "day", value: 6 })).toBe("Через 6 дней");
  });

  it("сообщает про остаток меньше часа", () => {
    expect(formatDeadline({ direction: "future", unit: "hour", value: 0 })).toBe("Меньше часа");
    expect(formatDeadline({ direction: "past", unit: "hour", value: 0 })).toBe("Просрочено");
  });
});
