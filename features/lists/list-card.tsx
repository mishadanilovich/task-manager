import Link from "next/link";
import { cn } from "cn";

import type { ListCounters } from "@/domain/list-stats";
import { Progress } from "@/components/ui/progress";

import { ListIndicator } from "./list-indicator";
import { ListMenu } from "./list-menu";
import type { ListWithStats } from "./queries";

const COUNTER_CELLS = [
  { key: "new", label: "new" },
  { key: "in_progress", label: "in prog" },
  { key: "done", label: "done" },
  { key: "overdue", label: "overdue" },
] as const;

function CounterCell({
  counters,
  cell,
}: {
  counters: ListCounters;
  cell: (typeof COUNTER_CELLS)[number];
}) {
  const value = counters[cell.key];
  const isDone = cell.key === "done" && value > 0;
  const isOverdue = cell.key === "overdue" && value > 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-[9px] border border-border px-[9px] py-2",
        isDone && "bg-success-bg",
        isOverdue && "bg-overdue-bg",
        !isDone && !isOverdue && "bg-muted",
      )}
    >
      <span
        className={cn(
          "font-mono text-[17px] leading-none font-semibold",
          isDone && "text-success",
          isOverdue && "text-overdue",
          value === 0 && "text-muted-foreground",
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "font-mono text-[9.5px] tracking-[0.1em] text-muted-foreground uppercase",
          isDone && "text-success",
          isOverdue && "text-overdue",
        )}
      >
        {cell.label}
      </span>
    </div>
  );
}

export function ListCard({ list, now }: { list: ListWithStats; now: Date }) {
  const { counters, progress } = list.stats;

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-b-2 border-border bg-card px-[22px] py-5 shadow-raised transition-transform duration-150 hover:-translate-y-px">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-[9px]">
          <Link
            href={`/lists/${list.id}`}
            className="font-display text-title font-semibold tracking-[-0.01em] hover:underline"
          >
            {list.name}
          </Link>
          <ListIndicator stats={list.stats} now={now} />
        </div>

        <ListMenu
          id={list.id}
          name={list.name}
          taskCount={counters.total}
          overdueCount={counters.overdue}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {COUNTER_CELLS.map((cell) => (
          <CounterCell key={cell.key} counters={counters} cell={cell} />
        ))}
      </div>

      <div>
        <div className="mb-[7px] flex justify-between font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
          <span>
            {counters.done} / {counters.total} выполнено
          </span>
          <span
            className={cn("font-semibold", progress === 100 ? "text-success" : "text-foreground")}
          >
            {progress}%
          </span>
        </div>
        <Progress value={progress} aria-label={`Выполнено ${progress}%`} />
      </div>
    </article>
  );
}
