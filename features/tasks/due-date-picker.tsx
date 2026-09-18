"use client";

import { useState } from "react";
import { ru } from "react-day-picker/locale";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const fromIsoDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const formatIsoDate = (value: string) => value.split("-").reverse().join(".");

export type DueDatePickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
};

export function DueDatePicker({ value, onChange, disabled, invalid, id }: DueDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? fromIsoDate(value) : undefined;

  const pick = (date: Date | undefined) => {
    onChange(date ? toIsoDate(date) : null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-b-2 border-input bg-card px-3 font-mono text-[13.5px] transition-colors outline-none hover:border-border-hover focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/22 disabled:opacity-55 aria-invalid:border-overdue aria-invalid:bg-overdue-bg"
      >
        <span className={value ? undefined : "text-muted-foreground"}>
          {value ? formatIsoDate(value) : "дд.мм.гггг"}
        </span>
        <span aria-hidden className="text-[11px] text-muted-foreground">
          ▾
        </span>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-auto p-3.5">
        <Calendar
          mode="single"
          locale={ru}
          selected={selected}
          defaultMonth={selected}
          onSelect={pick}
        />
        <div className="mt-3 flex justify-between border-t border-border pt-3 font-mono text-[11px] tracking-[0.08em] uppercase">
          <button type="button" className="text-primary" onClick={() => pick(new Date())}>
            Сегодня
          </button>
          <button type="button" className="text-muted-foreground" onClick={() => pick(undefined)}>
            Убрать
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
