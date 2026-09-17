"use client";

import { Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: null,
        info: null,
        warning: null,
        error: null,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!border-b-2 !border-l-[3px] !shadow-raised !font-sans",
          success: "!border-l-success",
          error: "!border-l-overdue",
          warning: "!border-l-warning",
          info: "!border-l-muted-foreground",
          actionButton:
            "!bg-transparent !font-mono !text-[11px] !tracking-[0.08em] !text-primary !uppercase",
        },
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "11px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
