import * as React from "react";
import { cn } from "cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full resize-y rounded-md border border-b-2 border-input bg-card px-[13px] py-[11px] text-body-l leading-[1.55] transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground hover:border-border-hover focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/22 disabled:pointer-events-none disabled:bg-muted disabled:opacity-55 aria-invalid:border-overdue aria-invalid:bg-overdue-bg aria-invalid:hover:border-overdue",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
