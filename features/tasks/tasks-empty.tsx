import type { ReactNode } from "react";
import Link from "next/link";

import type { TaskStatus } from "@/domain/task";

import { STATUS_VIEW } from "./task-status";

export type TasksEmptyProps = {
  listId: string;
  listName: string;
  status: TaskStatus | null;
  action?: ReactNode;
};

export function TasksEmpty({ listId, listName, status, action }: TasksEmptyProps) {
  if (status) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border-[1.5px] border-dashed border-border bg-card px-10 py-10 text-center">
        <div className="font-display text-[21px] font-semibold tracking-[-0.01em]">
          Ни одной задачи «{STATUS_VIEW[status].label.toLowerCase()}»
        </div>
        <p className="max-w-[42ch] text-body-l leading-[1.55] text-muted-foreground">
          Смените фильтр, чтобы увидеть остальные задачи списка.
        </p>
        <Link
          href={`/lists/${listId}`}
          className="mt-1 rounded-md border border-b-2 border-border bg-card px-[15px] py-2 text-body font-medium"
        >
          Показать все задачи
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border-[1.5px] border-dashed border-border bg-card px-10 py-12 text-center">
      <div className="font-display text-[22px] font-semibold tracking-[-0.01em]">
        В «{listName}» пока пусто
      </div>
      <p className="max-w-[44ch] text-body-l leading-[1.55] text-muted-foreground">
        Добавьте первую задачу: название обязательно, дедлайн и приоритет — по желанию.
      </p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
