import { Skeleton } from "@/components/ui/skeleton";

const ROWS = 6;

export function TaskTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-[13px] border border-b-2 border-border bg-card">
      <div className="grid grid-cols-[1fr_176px_128px_196px] gap-4 border-b border-border bg-muted px-5 py-3">
        {["w-16", "w-14", "w-20", "w-16"].map((width, index) => (
          <Skeleton key={index} className={`h-2.5 ${width} bg-border`} />
        ))}
      </div>

      {Array.from({ length: ROWS }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_176px_128px_196px] items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
          style={{ opacity: 1 - index * 0.1 }}
        >
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-[34px] w-full" />
          <Skeleton className="h-6 w-20" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
