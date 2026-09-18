import { describe, expect, it } from "vitest";

import { getListStats } from "./list-stats";
import { makeTask } from "./task-factory";

const now = new Date(2026, 8, 17, 12, 0);

const at = (...args: [number, number, number, number?, number?]) => new Date(...args);

describe("счётчики", () => {
  it("считает задачи по статусам", () => {
    const { counters } = getListStats(
      [
        makeTask({ id: "1", status: "new" }),
        makeTask({ id: "2", status: "new" }),
        makeTask({ id: "3", status: "in_progress" }),
        makeTask({ id: "4", status: "done" }),
      ],
      now,
    );

    expect(counters).toEqual({ new: 2, in_progress: 1, done: 1, overdue: 0, total: 4 });
  });

  it("считает просроченными только незавершённые задачи", () => {
    const { counters } = getListStats(
      [
        makeTask({ id: "1", dueAt: at(2026, 8, 14, 18, 0) }),
        makeTask({ id: "2", status: "in_progress", dueAt: at(2026, 8, 16, 18, 0) }),
        makeTask({ id: "3", status: "done", dueAt: at(2026, 8, 10, 18, 0) }),
      ],
      now,
    );

    expect(counters.overdue).toBe(2);
  });

  it("возвращает нули для пустого списка", () => {
    const { counters } = getListStats([], now);

    expect(counters).toEqual({ new: 0, in_progress: 0, done: 0, overdue: 0, total: 0 });
  });
});

describe("прогресс", () => {
  it("считает долю выполненных в процентах", () => {
    const tasks = [
      ...Array.from({ length: 12 }, (_, index) => makeTask({ id: `d${index}`, status: "done" })),
      ...Array.from({ length: 6 }, (_, index) => makeTask({ id: `n${index}` })),
    ];

    expect(getListStats(tasks, now).progress).toBe(67);
  });

  it("возвращает 0 для пустого списка", () => {
    expect(getListStats([], now).progress).toBe(0);
  });

  it("возвращает 100 только когда закрыты все задачи", () => {
    const tasks = [makeTask({ id: "1", status: "done" }), makeTask({ id: "2", status: "done" })];

    expect(getListStats(tasks, now).progress).toBe(100);
  });

  it("не показывает 100 при округлении, если остались открытые задачи", () => {
    const tasks = [
      ...Array.from({ length: 199 }, (_, index) => makeTask({ id: `d${index}`, status: "done" })),
      makeTask({ id: "open" }),
    ];

    expect(getListStats(tasks, now).progress).toBe(99);
  });
});

describe("индикатор", () => {
  it("красный, когда есть просроченные задачи", () => {
    const tasks = [
      makeTask({ id: "1", dueAt: at(2026, 8, 14, 18, 0) }),
      makeTask({ id: "2", dueAt: at(2026, 8, 18, 18, 0) }),
    ];

    expect(getListStats(tasks, now).indicator).toBe("overdue");
  });

  it("жёлтый, когда ближайший дедлайн в пределах 48 часов", () => {
    const tasks = [makeTask({ id: "1", dueAt: at(2026, 8, 19, 0, 0) })];

    expect(getListStats(tasks, now).indicator).toBe("soon");
  });

  it("нейтральный, когда все дедлайны дальше 48 часов", () => {
    const tasks = [makeTask({ id: "1", dueAt: at(2026, 8, 25, 0, 0) })];

    expect(getListStats(tasks, now).indicator).toBe("neutral");
  });

  it("нейтральный для пустого списка", () => {
    expect(getListStats([], now).indicator).toBe("neutral");
  });

  it("complete, когда все задачи выполнены", () => {
    const tasks = [
      makeTask({ id: "1", status: "done", dueAt: at(2026, 8, 10, 18, 0) }),
      makeTask({ id: "2", status: "done" }),
    ];

    expect(getListStats(tasks, now).indicator).toBe("complete");
  });

  it("предпочитает просрочку близкому дедлайну", () => {
    const tasks = [
      makeTask({ id: "1", dueAt: at(2026, 8, 16, 18, 0) }),
      makeTask({ id: "2", dueAt: at(2026, 8, 18, 6, 0) }),
    ];

    expect(getListStats(tasks, now).indicator).toBe("overdue");
  });
});

describe("ближайший дедлайн", () => {
  it("возвращает самый ранний дедлайн среди открытых задач", () => {
    const tasks = [
      makeTask({ id: "1", dueAt: at(2026, 8, 25, 10, 0) }),
      makeTask({ id: "2", dueAt: at(2026, 8, 19, 10, 0) }),
      makeTask({ id: "3", status: "done", dueAt: at(2026, 8, 1, 10, 0) }),
    ];

    expect(getListStats(tasks, now).nearestDueAt).toEqual(at(2026, 8, 19, 10, 0));
  });

  it("возвращает null, когда дедлайнов нет", () => {
    expect(getListStats([makeTask()], now).nearestDueAt).toBeNull();
  });
});
