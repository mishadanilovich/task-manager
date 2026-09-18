"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ListCounters } from "@/domain/list-stats";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const FILTERS = [
  { value: "all", label: "Все", shortLabel: "Все", counter: "total" },
  { value: "new", label: "New", shortLabel: "New", counter: "new" },
  { value: "in_progress", label: "In progress", shortLabel: "Prog", counter: "in_progress" },
  { value: "done", label: "Done", shortLabel: "Done", counter: "done" },
] as const;

export function StatusFilter({ counters }: { counters: ListCounters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "all";

  const select = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete("status");
    else params.set("status", value);

    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  };

  return (
    <ToggleGroup
      type="single"
      variant="segmented"
      spacing={0.5}
      value={current}
      onValueChange={(value) => value && select(value)}
      aria-label="Фильтр по статусу"
      className="w-full sm:w-fit"
    >
      {FILTERS.map((filter) => (
        <ToggleGroupItem
          key={filter.value}
          value={filter.value}
          aria-label={`${filter.label}: ${counters[filter.counter]}`}
          className="h-auto flex-1 gap-2 px-1 py-2 font-sans text-caption tracking-normal normal-case sm:flex-none sm:px-[15px]"
        >
          <span className="sm:hidden">{filter.shortLabel}</span>
          <span className="hidden sm:inline">{filter.label}</span>
          <span className="hidden font-mono text-[11.5px] font-normal text-muted-foreground sm:inline">
            {counters[filter.counter]}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
