import type { DeadlineDistance } from "@/domain/deadline";

type PluralForms = [one: string, few: string, many: string];

export function pluralize(count: number, forms: PluralForms): string {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;

  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];

  return forms[2];
}

export function formatLists(count: number): string {
  return `${count} ${pluralize(count, ["список", "списка", "списков"])}`;
}

export function formatTasks(count: number): string {
  return `${count} ${pluralize(count, ["задача", "задачи", "задач"])}`;
}

export function formatOverdue(count: number): string {
  return `${count} ${pluralize(count, ["просрочена", "просрочено", "просрочено"])}`;
}

export function formatOverdueTasks(count: number): string {
  return `${count} ${pluralize(count, ["просроченную", "просроченные", "просроченных"])}`;
}

export function formatDeadline({ direction, unit, value }: DeadlineDistance): string {
  const units =
    unit === "hour"
      ? pluralize(value, ["час", "часа", "часов"])
      : pluralize(value, ["день", "дня", "дней"]);

  if (direction === "past") {
    if (value === 0) return "Просрочено";

    return `Просрочено на ${value} ${units}`;
  }

  if (value === 0) return "Меньше часа";

  return `Через ${value} ${units}`;
}

export function formatDueAt(dueAt: Date, withTime: boolean): string {
  const date = dueAt.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (!withTime) return date;

  const time = dueAt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return `${date} · ${time}`;
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}
