"use client";

import { TASK_PRIORITIES, type TaskPriority } from "@/domain/task";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const OPTIONS: Record<TaskPriority, { label: string; activeClassName: string }> = {
  low: { label: "Low", activeClassName: "" },
  medium: {
    label: "Med",
    activeClassName: "data-[state=on]:border-priority-medium data-[state=on]:text-priority-medium",
  },
  high: {
    label: "High",
    activeClassName: "data-[state=on]:border-priority-high data-[state=on]:text-priority-high",
  },
};

export type PriorityPickerProps = {
  value: TaskPriority;
  onChange: (value: TaskPriority) => void;
  disabled?: boolean;
  id?: string;
};

export function PriorityPicker({ value, onChange, disabled, id }: PriorityPickerProps) {
  return (
    <ToggleGroup
      id={id}
      type="single"
      variant="segmented"
      spacing={0.5}
      value={value}
      onValueChange={(next) => next && onChange(next as TaskPriority)}
      disabled={disabled}
      aria-label="Приоритет"
      className="h-10 w-full"
    >
      {TASK_PRIORITIES.map((priority) => (
        <ToggleGroupItem
          key={priority}
          value={priority}
          className={`h-full flex-1 text-[10.5px] tracking-[0.06em] ${OPTIONS[priority].activeClassName}`}
        >
          {OPTIONS[priority].label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
