"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ListCounters } from "@/domain/list-stats";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <Tabs value={current} onValueChange={select}>
      <TabsList aria-label="Фильтр по статусу" className="w-full sm:w-fit">
        {FILTERS.map((filter) => (
          <TabsTrigger
            key={filter.value}
            value={filter.value}
            aria-label={`${filter.label}: ${counters[filter.counter]}`}
            className="flex-1 px-1 sm:flex-none sm:px-[15px]"
          >
            <span className="sm:hidden">{filter.shortLabel}</span>
            <span className="hidden sm:inline">{filter.label}</span>
            <span className="hidden font-mono text-[11.5px] text-muted-foreground sm:inline">
              {counters[filter.counter]}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
