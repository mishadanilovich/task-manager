"use client";

import { useTheme } from "next-themes";

import { useMounted } from "@/lib/use-mounted";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
      <ToggleGroup
        type="single"
        variant="segmented"
        size="compact"
        spacing={0.5}
        value={current ?? ""}
        onValueChange={(value) => value && setTheme(value)}
        aria-label="Тема оформления"
        className="hidden rounded-[9px] sm:flex"
      >
        {THEMES.map(({ value, label }) => (
          <ToggleGroupItem key={value} value={value}>
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Button
        variant="outline"
        size="icon"
        onClick={cycle}
        aria-label={`Тема оформления: ${THEMES.find((item) => item.value === current)?.label ?? "авто"}`}
        className="size-[34px] rounded-[9px] bg-muted font-normal sm:hidden"
      >
        {current ? GLYPHS[current] : GLYPHS.system}
      </Button>
    </>
  );
}
