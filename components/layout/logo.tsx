import { cn } from "cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-[11px]", className)}>
      <span className="flex w-5 flex-col gap-[2.5px]" aria-hidden>
        <span className="h-[3px] rounded-[2px] bg-primary" />
        <span className="h-[3px] w-[15px] rounded-[2px] bg-primary opacity-70" />
        <span className="h-[3px] w-[10px] rounded-[2px] bg-primary opacity-45" />
      </span>
      <span className="font-display text-[18px] font-semibold tracking-[-0.01em]">Стопка</span>
    </span>
  );
}
