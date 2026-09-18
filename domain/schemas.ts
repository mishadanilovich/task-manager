import { z } from "zod";

import { LIST_NAME_MAX_LENGTH } from "./list";
import { TASK_PRIORITIES, TASK_STATUSES } from "./task";

export const TASK_TITLE_MAX_LENGTH = 140;
export const TASK_DESCRIPTION_MAX_LENGTH = 2000;

export const credentialsSchema = z.object({
  email: z.email("Введите адрес целиком, например name@company.ru"),
  password: z.string().min(8, "Не короче 8 символов"),
});

export type Credentials = z.infer<typeof credentialsSchema>;

export const listFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Название обязательно")
    .max(LIST_NAME_MAX_LENGTH, `Не длиннее ${LIST_NAME_MAX_LENGTH} символов`),
});

export type ListFormValues = z.infer<typeof listFormSchema>;

export const taskFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Название обязательно")
      .max(TASK_TITLE_MAX_LENGTH, `Не длиннее ${TASK_TITLE_MAX_LENGTH} символов`),
    description: z
      .string()
      .trim()
      .max(TASK_DESCRIPTION_MAX_LENGTH, `Не длиннее ${TASK_DESCRIPTION_MAX_LENGTH} символов`),
    status: z.enum(TASK_STATUSES),
    priority: z.enum(TASK_PRIORITIES),
    dueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Дата в формате дд.мм.гггг")
      .nullable(),
    dueTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Время в формате чч:мм")
      .nullable(),
  })
  .refine((values) => values.dueTime === null || values.dueDate !== null, {
    message: "Сначала выберите дату",
    path: ["dueDate"],
  });

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const taskStatusSchema = z.enum(TASK_STATUSES);
