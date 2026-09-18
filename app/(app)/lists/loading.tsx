import { ListCardSkeleton } from "@/features/lists/list-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ListsLoading() {
  return (
    <div aria-busy className="px-4 py-8 sm:px-10 sm:pb-10">
      <span className="sr-only">Загружаем списки…</span>

      <div className="mb-6 flex flex-col gap-4 sm:mb-[26px] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold tracking-[-0.02em] sm:text-display-l">
            Списки
          </h1>
          <Skeleton className="mt-2.5 h-3 w-56" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 sm:w-[280px] sm:flex-none" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <ListCardSkeleton key={index} className={index % 2 === 1 ? "opacity-72" : undefined} />
        ))}
      </div>
    </div>
  );
}
