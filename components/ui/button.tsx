import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-body-l font-semibold whitespace-nowrap transition-[transform,filter,color,background-color,border-color] duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/22 disabled:pointer-events-none disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border border-primary-edge border-b-[3px] bg-primary text-primary-foreground hover:brightness-[1.06] active:translate-y-px active:border-b",
        destructive:
          "border border-overdue border-b-[3px] bg-overdue text-destructive-foreground hover:brightness-[1.06] active:translate-y-px active:border-b",
        outline:
          "border border-border border-b-2 bg-card font-medium hover:border-border-hover active:translate-y-px active:border-b",
        secondary:
          "border border-border border-b-2 bg-secondary font-medium active:translate-y-px active:border-b",
        ghost: "font-medium hover:bg-muted",
        link: "font-medium text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-[17px] has-[>svg]:px-[15px]",
        sm: "h-9 gap-1.5 px-[15px] text-body has-[>svg]:px-3",
        lg: "h-12 px-5 has-[>svg]:px-4",
        icon: "size-10",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
