import { cn } from "cn";

import { Skeleton } from "@/components/ui/skeleton";

export function ListCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-b-2 border-border bg-card px-[22px] py-5",
        className,
      )}
    >
      <div className="flex flex-col gap-[9px]">
        <Skeleton className="h-[19px] w-[62%]" />
        <Skeleton className="h-4 w-[44%] rounded-full" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-11 rounded-[9px]" />
        ))}
      </div>
      <Skeleton className="h-1.5 rounded-full" />
    </div>
  );
}
