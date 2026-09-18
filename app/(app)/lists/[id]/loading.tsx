import { TaskTableSkeleton } from "@/features/tasks/task-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ListLoading() {
  return (
    <div aria-busy className="px-4 py-7 sm:px-10 sm:pb-10">
      <span className="sr-only">Загружаем задачи…</span>

      <Skeleton className="mb-5 h-3.5 w-40" />

      <div className="mb-5 flex flex-col gap-4 sm:mb-[22px] sm:flex-row sm:items-end sm:justify-between">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-[170px]" />
      </div>

      <Skeleton className="mb-3.5 h-[42px] w-[380px] max-w-full" />

      <TaskTableSkeleton />
    </div>
  );
}
