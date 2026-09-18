"use client";

import type { ZodType } from "zod";

import type { TaskFormValues } from "@/domain/schemas";
import { TASK_STATUSES } from "@/domain/task";
import type { ActionResult } from "@/lib/action-result";
import { useActionForm } from "@/lib/use-action-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { DueDatePicker } from "./due-date-picker";
import { PriorityPicker } from "./priority-picker";
import { STATUS_VIEW, TaskStatusDot } from "./task-status";

export type TaskFormProps = {
  schema: ZodType<TaskFormValues, TaskFormValues>;
  defaultValues: TaskFormValues;
  submitLabel: string;
  action: (values: TaskFormValues) => Promise<ActionResult<{ id: string }>>;
  onSuccess: () => void;
  onCancel: () => void;
};

export function TaskForm({
  schema,
  defaultValues,
  submitLabel,
  action,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const { form, submit, serverError, isSubmitting } = useActionForm({
    schema,
    defaultValues,
    action,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem className="gap-[7px]">
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  disabled={isSubmitting}
                  placeholder="Например: разделить e2e на два джоба"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          render={({ field }) => (
            <FormItem className="gap-[7px]">
              <FormLabel>
                Описание <span className="font-normal text-muted-foreground">— необязательно</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  disabled={isSubmitting}
                  placeholder="Контекст, ссылки, критерии готовности"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            name="status"
            render={({ field }) => (
              <FormItem className="gap-[7px]">
                <FormLabel>Статус</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger className="w-full data-[size=default]:h-10">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TASK_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        <TaskStatusDot status={status} />
                        {STATUS_VIEW[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="priority"
            render={({ field }) => (
              <FormItem className="gap-[7px]">
                <FormLabel>Приоритет</FormLabel>
                <FormControl>
                  <PriorityPicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            name="dueDate"
            render={({ field, fieldState }) => (
              <FormItem className="gap-[7px]">
                <FormLabel>Дедлайн</FormLabel>
                <FormControl>
                  <DueDatePicker
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value === null) form.setValue("dueTime", null);
                    }}
                    disabled={isSubmitting}
                    invalid={Boolean(fieldState.error)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="dueTime"
            render={({ field }) => (
              <FormItem className="gap-[7px]">
                <FormLabel>
                  Время <span className="font-normal text-muted-foreground">— необязательно</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    disabled={isSubmitting || !form.watch("dueDate")}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value || null)}
                    className="font-mono"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {serverError ? (
          <p role="alert" className="text-caption text-overdue">
            {serverError}
          </p>
        ) : null}

        <div className="flex justify-end gap-2.5 border-t border-border pt-[18px]">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Сохраняем…" : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export const EMPTY_TASK_FORM: TaskFormValues = {
  title: "",
  description: "",
  status: "new",
  priority: "medium",
  dueDate: null,
  dueTime: null,
};
