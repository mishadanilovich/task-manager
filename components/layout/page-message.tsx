import type { ReactNode } from "react";

export type PageMessageProps = {
  code: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageMessage({ code, title, description, action }: PageMessageProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex max-w-[460px] flex-col items-center gap-3.5 text-center">
        <span className="font-mono text-[11.5px] tracking-[0.14em] text-muted-foreground uppercase">
          {code}
        </span>
        <h1 className="font-display text-display-m font-semibold">{title}</h1>
        <p className="text-body-l leading-[1.55] text-muted-foreground">{description}</p>
        {action ? <div className="mt-2 flex gap-2.5">{action}</div> : null}
      </div>
    </div>
  );
}
