import * as React from "react";
import { cn } from "cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-md border border-b-2 border-input bg-card px-[13px] text-body-l transition-[color,box-shadow,border-color] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-body file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-border-hover disabled:pointer-events-none disabled:bg-muted disabled:opacity-55",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/22",
        "aria-invalid:border-overdue aria-invalid:bg-overdue-bg aria-invalid:hover:border-overdue",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
