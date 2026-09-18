import { describe, expect, it } from "vitest";

import { sortTasks } from "./sort-tasks";
import { makeTask } from "./task-factory";

const now = new Date("2026-09-17T12:00:00Z");

const at = (iso: string) => new Date(iso);

const titles = (tasks: ReturnType<typeof sortTasks>) => tasks.map((task) => task.title);

describe("sortTasks", () => {
  it("поднимает просроченные незавершённые задачи выше всех", () => {
    const sorted = sortTasks(
      [
        makeTask({ title: "Сегодня", dueAt: at("2026-09-17T18:00:00Z") }),
        makeTask({ title: "Просрочена", dueAt: at("2026-09-14T18:00:00Z") }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["Просрочена", "Сегодня"]);
  });

  it("ставит просроченную задачу выше даже при более низком приоритете", () => {
    const sorted = sortTasks(
      [
        makeTask({ title: "Срочная", priority: "high", dueAt: at("2026-09-20T10:00:00Z") }),
        makeTask({ title: "Просрочена", priority: "low", dueAt: at("2026-09-16T10:00:00Z") }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["Просрочена", "Срочная"]);
  });

  it("сортирует просроченные по давности: раньше дедлайн — выше", () => {
    const sorted = sortTasks(
      [
        makeTask({ title: "Вчера", dueAt: at("2026-09-16T10:00:00Z") }),
        makeTask({ title: "Неделю назад", dueAt: at("2026-09-10T10:00:00Z") }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["Неделю назад", "Вчера"]);
  });

  it("поднимает выше задачу с более близким дедлайном", () => {
    const sorted = sortTasks(
      [
        makeTask({ title: "Через неделю", dueAt: at("2026-09-24T10:00:00Z") }),
        makeTask({ title: "Завтра", dueAt: at("2026-09-18T10:00:00Z") }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["Завтра", "Через неделю"]);
  });

  it("при равных дедлайнах выше задача с большим приоритетом", () => {
    const dueAt = at("2026-09-19T10:00:00Z");
    const sorted = sortTasks(
      [
        makeTask({ title: "Низкий", priority: "low", dueAt }),
        makeTask({ title: "Высокий", priority: "high", dueAt }),
        makeTask({ title: "Средний", priority: "medium", dueAt }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["Высокий", "Средний", "Низкий"]);
  });

  it("опускает задачи без дедлайна ниже задач с дедлайном", () => {
    const sorted = sortTasks(
      [
        makeTask({ title: "Без срока", priority: "high" }),
        makeTask({ title: "Со сроком", priority: "low", dueAt: at("2026-09-30T10:00:00Z") }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["Со сроком", "Без срока"]);
  });

  it("сортирует задачи без дедлайна по приоритету", () => {
    const sorted = sortTasks(
      [
        makeTask({ title: "Низкий", priority: "low" }),
        makeTask({ title: "Высокий", priority: "high" }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["Высокий", "Низкий"]);
  });

  it("опускает выполненные задачи в конец списка", () => {
    const sorted = sortTasks(
      [
        makeTask({
          title: "Выполнена",
          status: "done",
          priority: "high",
          dueAt: at("2026-09-10T10:00:00Z"),
        }),
        makeTask({ title: "В работе", status: "in_progress", priority: "low" }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["В работе", "Выполнена"]);
  });

  it("не считает выполненную задачу просроченной", () => {
    const sorted = sortTasks(
      [
        makeTask({ title: "Открыта", dueAt: at("2026-09-25T10:00:00Z") }),
        makeTask({ title: "Закрыта", status: "done", dueAt: at("2026-09-01T10:00:00Z") }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["Открыта", "Закрыта"]);
  });

  it("сортирует выполненные по дате закрытия: свежие выше", () => {
    const sorted = sortTasks(
      [
        makeTask({
          title: "Закрыта 10.09",
          status: "done",
          updatedAt: at("2026-09-10T10:00:00Z"),
        }),
        makeTask({
          title: "Закрыта 12.09",
          status: "done",
          updatedAt: at("2026-09-12T10:00:00Z"),
        }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["Закрыта 12.09", "Закрыта 10.09"]);
  });

  it("при полном равенстве сортирует по названию", () => {
    const dueAt = at("2026-09-19T10:00:00Z");
    const sorted = sortTasks(
      [makeTask({ title: "Ящик", dueAt }), makeTask({ title: "Арка", dueAt })],
      now,
    );

    expect(titles(sorted)).toEqual(["Арка", "Ящик"]);
  });

  it("не изменяет исходный массив", () => {
    const tasks = [
      makeTask({ title: "Вторая", dueAt: at("2026-09-25T10:00:00Z") }),
      makeTask({ title: "Первая", dueAt: at("2026-09-18T10:00:00Z") }),
    ];

    sortTasks(tasks, now);

    expect(titles(tasks)).toEqual(["Вторая", "Первая"]);
  });

  it("считает задачу просроченной ровно после наступления дедлайна", () => {
    const sorted = sortTasks(
      [
        makeTask({ title: "Ровно сейчас", dueAt: now }),
        makeTask({ title: "Минуту назад", dueAt: at("2026-09-17T11:59:00Z") }),
      ],
      now,
    );

    expect(titles(sorted)).toEqual(["Минуту назад", "Ровно сейчас"]);
  });
});
