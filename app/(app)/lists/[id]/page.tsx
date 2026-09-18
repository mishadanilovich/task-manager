import Link from "next/link";
import { notFound } from "next/navigation";

import { TASK_STATUSES, type TaskStatus } from "@/domain/task";
import { getListTasks } from "@/features/tasks/queries";
import { StatusFilter } from "@/features/tasks/status-filter";
import { TaskTable } from "@/features/tasks/task-table";
import { TasksEmpty } from "@/features/tasks/tasks-empty";
import { TooltipProvider } from "@/components/ui/tooltip";

function parseStatus(value: string | string[] | undefined): TaskStatus | null {
  return TASK_STATUSES.find((status) => status === value) ?? null;
}

export default async function ListPage({ params, searchParams }: PageProps<"/lists/[id]">) {
  const [{ id }, { status }] = await Promise.all([params, searchParams]);
  const statusFilter = parseStatus(status);

  const data = await getListTasks(id, statusFilter);
  if (!data) notFound();

  const { list, tasks, stats, now } = data;
  const { counters } = stats;

  return (
    <TooltipProvider>
      <div className="px-4 py-7 sm:px-10 sm:pb-10">
        <nav className="mb-4 flex items-center gap-2.5 text-caption text-muted-foreground">
          <Link href="/lists" className="text-primary hover:underline">
            Списки
          </Link>
          <span aria-hidden className="font-mono opacity-60">
            /
          </span>
          <span className="font-medium text-foreground">{list.name}</span>
        </nav>

        <h1 className="mb-5 font-display text-[28px] font-semibold tracking-[-0.02em] sm:mb-[22px] sm:text-[36px]">
          {list.name}
        </h1>

        <div className="mb-3.5">
          <StatusFilter counters={counters} />
        </div>

        {tasks.length === 0 ? (
          <TasksEmpty listName={list.name} status={statusFilter} />
        ) : (
          <TaskTable tasks={tasks} listName={list.name} now={now} />
        )}
      </div>
    </TooltipProvider>
  );
}
