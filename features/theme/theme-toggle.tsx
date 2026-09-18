"use client";

import { cn } from "cn";
import { useTheme } from "next-themes";

import { useMounted } from "@/lib/use-mounted";

const THEMES = [
  { value: "light", label: "День" },
  { value: "dark", label: "Ночь" },
  { value: "system", label: "Авто" },
] as const;

const GLYPHS: Record<string, string> = { light: "◐", dark: "◑", system: "◒" };

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const current = mounted ? (theme ?? "system") : null;

  const cycle = () => {
    const index = THEMES.findIndex((item) => item.value === current);
    setTheme(THEMES[(index + 1) % THEMES.length].value);
  };

  return (
    <>
      <div
        role="radiogroup"
        aria-label="Тема оформления"
        className="hidden gap-0.5 rounded-[9px] border border-border bg-muted p-[3px] sm:flex"
      >
        {THEMES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={current === value}
            onClick={() => setTheme(value)}
            className={cn(
              "rounded-sm px-[11px] py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors",
              current === value
                ? "border border-border bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={cycle}
        aria-label={`Тема оформления: ${THEMES.find((item) => item.value === current)?.label ?? "авто"}`}
        className="flex size-[34px] items-center justify-center rounded-[9px] border border-border bg-muted text-body-l sm:hidden"
      >
        {current ? GLYPHS[current] : GLYPHS.system}
      </button>
    </>
  );
}
