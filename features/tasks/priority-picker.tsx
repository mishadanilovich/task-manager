"use client";

import { cn } from "cn";

import { TASK_PRIORITIES, type TaskPriority } from "@/domain/task";

const OPTIONS: Record<TaskPriority, { label: string; activeClassName: string }> = {
  low: { label: "Low", activeClassName: "border-border text-foreground" },
  medium: { label: "Med", activeClassName: "border-priority-medium text-priority-medium" },
  high: { label: "High", activeClassName: "border-priority-high text-priority-high" },
};

export type PriorityPickerProps = {
  value: TaskPriority;
  onChange: (value: TaskPriority) => void;
  disabled?: boolean;
  id?: string;
};

export function PriorityPicker({ value, onChange, disabled, id }: PriorityPickerProps) {
  return (
    <div
      id={id}
      role="radiogroup"
      aria-label="Приоритет"
      className="flex gap-0.5 rounded-md border border-border bg-muted p-[3px]"
    >
      {TASK_PRIORITIES.map((priority) => {
        const checked = value === priority;

        return (
          <button
            key={priority}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(priority)}
            className={cn(
              "flex-1 rounded-sm border px-1 py-[7px] text-center font-mono text-[10.5px] tracking-[0.06em] uppercase transition-colors",
              checked
                ? cn("bg-card font-semibold", OPTIONS[priority].activeClassName)
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {OPTIONS[priority].label}
          </button>
        );
      })}
    </div>
  );
}
