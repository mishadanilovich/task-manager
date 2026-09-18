import type { ElementType } from "react";
import { cn } from "cn";

import { getDeadlineDistance, getDeadlineState, splitDueAt } from "@/domain/deadline";
import type { Task } from "@/domain/task";
import { formatDeadline, formatDueAt } from "@/lib/format";

import { TaskPriorityBadge } from "./task-priority";
import { STATUS_VIEW, TaskStatusDot } from "./task-status";

const DEADLINE_CHIP = {
  overdue: "border-overdue bg-overdue-bg text-overdue",
  soon: "border-warning bg-warning-bg text-warning",
  scheduled: "border-border bg-card text-foreground",
  none: "border-border bg-card text-muted-foreground",
} as const;

export type TaskCardProps = {
  task: Task;
  listName: string;
  now: Date;
  titleComponent?: ElementType;
  footer?: React.ReactNode;
};

export function TaskCard({ task, listName, now, titleComponent, footer }: TaskCardProps) {
  const Title = titleComponent ?? "h1";
  const state = getDeadlineState(task, now);
  const withTime = task.dueAt ? splitDueAt(task.dueAt).dueTime !== null : false;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2.5">
        <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground uppercase">
          {listName}
        </span>
        <Title className="font-display text-display-m font-semibold">{task.title}</Title>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-[7px] rounded-sm border border-border bg-card px-2.5 py-1.5 text-caption">
          <TaskStatusDot status={task.status} />
          {STATUS_VIEW[task.status].label}
        </span>

        <TaskPriorityBadge priority={task.priority} className="py-1.5" />

        {task.dueAt && task.status !== "done" ? (
          <span
            className={cn(
              "inline-flex items-center rounded-sm border px-2.5 py-1.5 text-caption font-semibold",
              DEADLINE_CHIP[state],
            )}
          >
            {formatDeadline(getDeadlineDistance(task.dueAt, now))}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="mb-2 font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground uppercase">
          Описание
        </div>
        {task.description ? (
          <p className="text-body-l leading-[1.6] text-pretty">{task.description}</p>
        ) : (
          <p className="text-body-l text-muted-foreground">Описания пока нет.</p>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border bg-background px-3 py-2.5">
          <div className="mb-1 font-mono text-[10px] tracking-[0.11em] text-muted-foreground uppercase">
            Дедлайн
          </div>
          <div className="font-mono text-body font-semibold">
            {task.dueAt ? formatDueAt(task.dueAt, withTime) : "—"}
          </div>
        </div>

        <div className="rounded-md border border-border bg-background px-3 py-2.5">
          <div className="mb-1 font-mono text-[10px] tracking-[0.11em] text-muted-foreground uppercase">
            Создана
          </div>
          <div className="font-mono text-body font-semibold">
            {formatDueAt(task.createdAt, false)}
          </div>
        </div>
      </div>

      {footer ? <div className="mt-6 border-t border-border pt-5">{footer}</div> : null}
    </div>
  );
}
