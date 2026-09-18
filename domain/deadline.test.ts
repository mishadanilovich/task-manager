import { describe, expect, it } from "vitest";

import {
  combineDueAt,
  getDeadlineDistance,
  getDeadlineState,
  splitDueAt,
  SOON_WINDOW_HOURS,
} from "./deadline";
import { makeTask } from "./task-factory";

const now = new Date(2026, 8, 17, 12, 0);

const at = (...args: [number, number, number, number?, number?]) => new Date(...args);

describe("getDeadlineState", () => {
  it("возвращает none для задачи без дедлайна", () => {
    expect(getDeadlineState(makeTask(), now)).toBe("none");
  });

  it("возвращает none для выполненной задачи даже с прошедшим дедлайном", () => {
    const task = makeTask({ status: "done", dueAt: at(2026, 8, 10, 10, 0) });

    expect(getDeadlineState(task, now)).toBe("none");
  });

  it("возвращает overdue, когда дедлайн прошёл", () => {
    const task = makeTask({ dueAt: at(2026, 8, 17, 11, 59) });

    expect(getDeadlineState(task, now)).toBe("overdue");
  });

  it("возвращает soon в пределах 48 часов", () => {
    const task = makeTask({ dueAt: at(2026, 8, 19, 11, 0) });

    expect(getDeadlineState(task, now)).toBe("soon");
  });

  it("считает ровно 48 часов ещё окном soon", () => {
    const task = makeTask({ dueAt: at(2026, 8, 19, 12, 0) });

    expect(getDeadlineState(task, now)).toBe("soon");
    expect(SOON_WINDOW_HOURS).toBe(48);
  });

  it("возвращает scheduled за пределами окна", () => {
    const task = makeTask({ dueAt: at(2026, 8, 19, 12, 1) });

    expect(getDeadlineState(task, now)).toBe("scheduled");
  });
});

describe("getDeadlineDistance", () => {
  it("считает часы, когда до дедлайна меньше суток", () => {
    expect(getDeadlineDistance(at(2026, 8, 18, 6, 0), now)).toEqual({
      direction: "future",
      unit: "hour",
      value: 18,
    });
  });

  it("считает календарные дни, когда до дедлайна больше суток", () => {
    expect(getDeadlineDistance(at(2026, 8, 19, 16, 0), now)).toEqual({
      direction: "future",
      unit: "day",
      value: 2,
    });
  });

  it("считает просрочку в днях по календарю", () => {
    expect(getDeadlineDistance(at(2026, 8, 14, 18, 0), now)).toEqual({
      direction: "past",
      unit: "day",
      value: 3,
    });
  });

  it("считает свежую просрочку в часах", () => {
    expect(getDeadlineDistance(at(2026, 8, 17, 9, 30), now)).toEqual({
      direction: "past",
      unit: "hour",
      value: 2,
    });
  });
});

describe("combineDueAt и splitDueAt", () => {
  it("без времени ставит дедлайн на конец дня", () => {
    const dueAt = combineDueAt("2026-09-19", null);

    expect(dueAt?.getHours()).toBe(23);
    expect(dueAt?.getMinutes()).toBe(59);
    expect(dueAt?.getDate()).toBe(19);
  });

  it("со временем ставит дедлайн на указанный час", () => {
    const dueAt = combineDueAt("2026-09-19", "16:30");

    expect(dueAt?.getHours()).toBe(16);
    expect(dueAt?.getMinutes()).toBe(30);
  });

  it("без даты возвращает null", () => {
    expect(combineDueAt(null, "16:30")).toBeNull();
  });

  it("разбирает дедлайн с конца дня обратно в дату без времени", () => {
    expect(splitDueAt(combineDueAt("2026-09-19", null))).toEqual({
      dueDate: "2026-09-19",
      dueTime: null,
    });
  });

  it("сохраняет время 23:59, если его выбрал пользователь", () => {
    expect(splitDueAt(combineDueAt("2026-09-19", "23:59"))).toEqual({
      dueDate: "2026-09-19",
      dueTime: "23:59",
    });
  });

  it("отличает конец дня от выбранного времени по секундам", () => {
    expect(combineDueAt("2026-09-19", null)?.getSeconds()).toBe(59);
    expect(combineDueAt("2026-09-19", "23:59")?.getSeconds()).toBe(0);
  });

  it("разбирает дедлайн со временем обратно в дату и время", () => {
    expect(splitDueAt(combineDueAt("2026-09-19", "16:30"))).toEqual({
      dueDate: "2026-09-19",
      dueTime: "16:30",
    });
  });
});
