"use client";

import { useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "cn";
import { Loader2Icon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

const DEBOUNCE_MS = 500;

export function ListsSearch({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isSearching = isDebouncing || isPending;

  const applyQuery = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");

    setIsDebouncing(false);
    startTransition(() => {
      router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
    });
  };

  return (
    <div className={cn("relative flex", className)}>
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[13px] size-[13px] -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="Поиск по спискам"
        aria-label="Поиск по спискам"
        aria-busy={isSearching}
        onChange={(event) => {
          const { value } = event.target;
          setIsDebouncing(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => applyQuery(value), DEBOUNCE_MS);
        }}
        className="w-full pr-9 pl-9 sm:w-[280px]"
      />
      {isSearching ? (
        <Loader2Icon
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-[13px] size-3.5 -translate-y-1/2 animate-spin text-muted-foreground"
        />
      ) : null}
    </div>
  );
}
