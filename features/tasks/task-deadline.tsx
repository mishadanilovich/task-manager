import { cn } from "cn";

import { getDeadlineDistance, getDeadlineState } from "@/domain/deadline";
import { splitDueAt } from "@/domain/deadline";
import type { Task } from "@/domain/task";
import { formatDeadline, formatDueAt, formatFullDate, formatShortDate } from "@/lib/format";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STATE_CLASS = {
  overdue: "font-semibold text-overdue",
  soon: "font-semibold text-warning",
  scheduled: "font-medium",
  none: "text-muted-foreground",
} as const;

export function TaskDeadline({ task, now }: { task: Task; now: Date }) {
  if (task.status === "done") {
    return (
      <span className="text-caption text-muted-foreground">
        Закрыто {formatShortDate(task.updatedAt)}
      </span>
    );
  }

  if (task.dueAt === null) {
    return <span className="text-caption text-muted-foreground">Без дедлайна</span>;
  }

  const state = getDeadlineState(task, now);
  const withTime = splitDueAt(task.dueAt).dueTime !== null;

  return (
    <span className="flex flex-col gap-0.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("w-fit cursor-default text-caption", STATE_CLASS[state])}>
            {formatDeadline(getDeadlineDistance(task.dueAt, now))}
          </span>
        </TooltipTrigger>
        <TooltipContent>{formatFullDate(task.dueAt, withTime)}</TooltipContent>
      </Tooltip>
      <span className="font-mono text-[11px] text-muted-foreground">
        {formatDueAt(task.dueAt, withTime)}
      </span>
    </span>
  );
}
