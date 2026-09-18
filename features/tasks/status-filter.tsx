"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ListCounters } from "@/domain/list-stats";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FILTERS = [
  { value: "all", label: "Все", counter: "total" },
  { value: "new", label: "New", counter: "new" },
  { value: "in_progress", label: "In progress", counter: "in_progress" },
  { value: "done", label: "Done", counter: "done" },
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
      <TabsList aria-label="Фильтр по статусу">
        {FILTERS.map((filter) => (
          <TabsTrigger key={filter.value} value={filter.value}>
            {filter.label}
            <span className="font-mono text-[11.5px] text-muted-foreground">
              {counters[filter.counter]}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
