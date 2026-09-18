import { beforeEach, describe, expect, it } from "vitest";

import { getListStats } from "@/domain/list-stats";

import { createMemoryDatabase } from "./memory";
import type { Database } from "./repository";
import { createSeedData } from "./seed";

const now = new Date(2026, 8, 17, 12, 0);

let db: Database;

beforeEach(() => {
  let counter = 0;
  db = createMemoryDatabase(createSeedData(now), { createId: () => `generated-${++counter}` });
});

describe("списки", () => {
  it("возвращает списки из seed", async () => {
    const lists = await db.lists.findAll();

    expect(lists).toHaveLength(6);
    expect(lists[0].name).toBe("Релиз 2.4");
  });

  it("создаёт список", async () => {
    const created = await db.lists.create("Релиз 2.5");

    expect(created.id).toBe("generated-1");
    expect(await db.lists.findById(created.id)).toMatchObject({ name: "Релиз 2.5" });
  });

  it("переименовывает список и обновляет updatedAt", async () => {
    const before = await db.lists.findById("home");
    const renamed = await db.lists.rename("home", "Дом");

    expect(renamed?.name).toBe("Дом");
    expect(renamed!.updatedAt.getTime()).toBeGreaterThanOrEqual(before!.updatedAt.getTime());
  });

  it("возвращает null при переименовании несуществующего списка", async () => {
    expect(await db.lists.rename("missing", "Дом")).toBeNull();
  });

  it("удаляет список вместе с его задачами", async () => {
    expect(await db.lists.remove("home")).toBe(true);
    expect(await db.lists.findById("home")).toBeNull();
    expect(await db.tasks.findByListId("home")).toEqual([]);
  });

  it("не трогает задачи других списков при удалении", async () => {
    await db.lists.remove("home");

    expect(await db.tasks.findByListId("release-2-4")).toHaveLength(18);
  });
});

describe("задачи", () => {
  it("возвращает задачи списка", async () => {
    const tasks = await db.tasks.findByListId("hiring-frontend");

    expect(tasks).toHaveLength(9);
    expect(tasks.every((task) => task.listId === "hiring-frontend")).toBe(true);
  });

  it("создаёт задачу", async () => {
    const created = await db.tasks.create({
      listId: "home",
      title: "Полить цветы",
      description: "",
      status: "new",
      priority: "low",
      dueAt: null,
    });

    expect(created.id).toBe("generated-1");
    expect(await db.tasks.findByListId("home")).toHaveLength(4);
  });

  it("обновляет только переданные поля", async () => {
    const before = await db.tasks.findById("release-2-4-2");
    const updated = await db.tasks.update("release-2-4-2", { status: "done" });

    expect(updated?.status).toBe("done");
    expect(updated?.title).toBe(before?.title);
    expect(updated?.priority).toBe(before?.priority);
  });

  it("удаляет задачу", async () => {
    expect(await db.tasks.remove("home-1")).toBe(true);
    expect(await db.tasks.findById("home-1")).toBeNull();
    expect(await db.tasks.remove("home-1")).toBe(false);
  });

  it("не отдаёт ссылку на хранимую задачу", async () => {
    const task = await db.tasks.findById("home-1");
    task!.title = "Изменено снаружи";

    expect((await db.tasks.findById("home-1"))?.title).not.toBe("Изменено снаружи");
  });
});

describe("seed", () => {
  it("даёт список с просрочкой, список со скорым дедлайном и закрытый список", async () => {
    const byList = async (listId: string) =>
      getListStats(await db.tasks.findByListId(listId), now).indicator;

    expect(await byList("release-2-4")).toBe("overdue");
    expect(await byList("hiring-frontend")).toBe("soon");
    expect(await byList("home")).toBe("complete");
    expect(await byList("client-onboarding")).toBe("neutral");
  });

  it("повторяет счётчики карточки «Релиз 2.4» из макета", async () => {
    const { counters } = getListStats(await db.tasks.findByListId("release-2-4"), now);

    expect(counters).toEqual({ new: 4, in_progress: 2, done: 12, overdue: 2, total: 18 });
  });
});
