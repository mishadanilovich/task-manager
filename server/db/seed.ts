import type { TaskList } from "@/domain/list";
import type { Task, TaskPriority, TaskStatus } from "@/domain/task";

import type { MemoryData } from "./memory";

type SeedTask = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueInHours?: number;
  closedDaysAgo?: number;
};

type SeedList = {
  id: string;
  name: string;
  createdDaysAgo: number;
  tasks: SeedTask[];
};

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const done = (title: string, closedDaysAgo: number): SeedTask => ({
  title,
  status: "done",
  closedDaysAgo,
});

const seedLists: SeedList[] = [
  {
    id: "release-2-4",
    name: "Релиз 2.4",
    createdDaysAgo: 24,
    tasks: [
      {
        title: "Починить релизный пайплайн",
        description:
          "Сборка падает на шаге e2e начиная с прошлой недели. Нужно понять, связано ли это с обновлением playwright, и разделить прогон на два джоба, чтобы таймаут не резал очередь.",
        status: "in_progress",
        priority: "high",
        dueInHours: -66,
      },
      { title: "Обновить changelog", priority: "medium", dueInHours: -24 },
      { title: "Согласовать тексты в онбординге", priority: "high", dueInHours: 18 },
      {
        title: "Проверить миграции на стейдже",
        description: "Нужен дамп прод-базы за сентябрь.",
        status: "in_progress",
        priority: "medium",
        dueInHours: 52,
      },
      { title: "Собрать фидбек по бете", priority: "low", dueInHours: 148 },
      { title: "Обновить скриншоты в сторе", priority: "low" },
      done("Обновить зависимости", 5),
      done("Прогнать регресс на 2.3.1", 7),
      done("Закрыть баг с двойным сабмитом", 8),
      done("Поднять версию в package.json", 9),
      done("Собрать release notes", 10),
      done("Проверить миграцию на тестовом стенде", 11),
      done("Обновить документацию по API", 12),
      done("Настроить алерты на 5xx", 13),
      done("Вынести фиче-флаг в конфиг", 14),
      done("Починить падающий снапшот", 15),
      done("Обновить лицензии зависимостей", 17),
      done("Согласовать дату релиза", 19),
    ],
  },
  {
    id: "hiring-frontend",
    name: "Найм: фронтенд",
    createdDaysAgo: 40,
    tasks: [
      { title: "Прочитать отклики за неделю", priority: "medium", dueInHours: 36 },
      { title: "Написать тестовое для мидла", priority: "high", dueInHours: 96 },
      {
        title: "Провести секцию по вёрстке",
        status: "in_progress",
        priority: "high",
        dueInHours: 72,
      },
      { title: "Обновить описание вакансии", status: "in_progress", priority: "low" },
      done("Согласовать вилку с финансами", 3),
      done("Собрать критерии оценки", 6),
      done("Отсмотреть первых кандидатов", 9),
      done("Договориться с рекрутером о сроках", 12),
      done("Опубликовать вакансию", 16),
    ],
  },
  {
    id: "documentation",
    name: "Документация",
    createdDaysAgo: 60,
    tasks: [
      { title: "Описать формат вебхуков", priority: "medium", dueInHours: 120 },
      { title: "Переписать раздел про аутентификацию", priority: "medium", dueInHours: 200 },
      { title: "Добавить примеры на curl", priority: "low" },
      {
        title: "Вычитать гайд по миграции",
        status: "in_progress",
        priority: "medium",
        dueInHours: 168,
      },
      done("Собрать оглавление", 4),
      done("Перенести доки на новый движок", 8),
      done("Настроить поиск по документации", 14),
      done("Убрать устаревшие страницы", 21),
    ],
  },
  {
    id: "marketing-q4",
    name: "Маркетинг Q4",
    createdDaysAgo: 30,
    tasks: [
      { title: "Согласовать медиаплан", priority: "high", dueInHours: -40 },
      { title: "Подготовить лендинг к запуску", priority: "high", dueInHours: 96 },
      { title: "Собрать кейсы клиентов", priority: "medium", dueInHours: 240 },
      { title: "Обновить презентацию для партнёров", priority: "low", dueInHours: 300 },
      { title: "Заказать съёмку для соцсетей", priority: "low" },
      {
        title: "Написать анонс релиза",
        status: "in_progress",
        priority: "medium",
        dueInHours: 120,
      },
      {
        title: "Подготовить рассылку по базе",
        status: "in_progress",
        priority: "medium",
        dueInHours: 144,
      },
      {
        title: "Согласовать бюджет с финансами",
        status: "in_progress",
        priority: "high",
        dueInHours: 72,
      },
      done("Утвердить ключевые сообщения", 6),
      done("Собрать бриф для агентства", 13),
    ],
  },
  {
    id: "home",
    name: "Домашние дела",
    createdDaysAgo: 18,
    tasks: [
      done("Записаться к стоматологу", 2),
      done("Оплатить интернет", 4),
      done("Забрать посылку", 6),
    ],
  },
  {
    id: "client-onboarding",
    name: "Онбординг клиентов",
    createdDaysAgo: 12,
    tasks: [
      { title: "Собрать чек-лист внедрения", priority: "high", dueInHours: 240 },
      { title: "Записать видео первого входа", priority: "medium", dueInHours: 264 },
      { title: "Подготовить шаблон письма", priority: "medium" },
      { title: "Описать типовые вопросы", priority: "low", dueInHours: 336 },
      { title: "Настроить приветственную рассылку", priority: "low" },
      { title: "Согласовать SLA поддержки", priority: "medium", dueInHours: 400 },
      {
        title: "Разобрать обратную связь пилота",
        status: "in_progress",
        priority: "medium",
        dueInHours: 192,
      },
    ],
  },
];

export function createSeedData(now: Date): MemoryData {
  const lists: TaskList[] = [];
  const tasks: Task[] = [];

  for (const seedList of seedLists) {
    const createdAt = new Date(now.getTime() - seedList.createdDaysAgo * DAY_MS);
    lists.push({ id: seedList.id, name: seedList.name, createdAt, updatedAt: createdAt });

    seedList.tasks.forEach((seedTask, index) => {
      const status = seedTask.status ?? "new";
      const updatedAt =
        seedTask.closedDaysAgo === undefined
          ? createdAt
          : new Date(now.getTime() - seedTask.closedDaysAgo * DAY_MS);

      tasks.push({
        id: `${seedList.id}-${index + 1}`,
        listId: seedList.id,
        title: seedTask.title,
        description: seedTask.description ?? "",
        status,
        priority: seedTask.priority ?? "medium",
        dueAt:
          seedTask.dueInHours === undefined
            ? null
            : new Date(now.getTime() + seedTask.dueInHours * HOUR_MS),
        createdAt,
        updatedAt,
      });
    });
  }

  return { lists, tasks };
}
