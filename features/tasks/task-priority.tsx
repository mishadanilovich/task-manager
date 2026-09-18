import { cn } from "cn";

import type { TaskPriority } from "@/domain/task";

const PRIORITY_VIEW: Record<TaskPriority, { glyph: string; label: string; className: string }> = {
  high: { glyph: "▲", label: "High", className: "border-priority-high text-priority-high" },
  medium: {
    glyph: "◗",
    label: "Medium",
    className: "border-priority-medium text-priority-medium",
  },
  low: { glyph: "◦", label: "Low", className: "border-border text-muted-foreground" },
};

export function TaskPriorityBadge({
  priority,
  className,
}: {
  priority: TaskPriority;
  className?: string;
}) {
  const view = PRIORITY_VIEW[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border bg-card px-2 py-1 font-mono text-[10.5px] tracking-[0.09em] uppercase",
        view.className,
        className,
      )}
    >
      {view.glyph} {view.label}
    </span>
  );
}
