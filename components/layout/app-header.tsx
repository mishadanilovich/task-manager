import { signOut } from "@/features/auth/actions";
import { ThemeToggle } from "@/features/theme/theme-toggle";

import { Logo } from "./logo";

function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

function getDisplayName(email: string): string {
  const [name] = email.split("@");

  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function AppHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-10 sm:py-[14px]">
        <Logo />

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          <span className="hidden h-6 w-px bg-border sm:block" aria-hidden />

          <span className="flex items-center gap-2.5">
            <span className="flex size-[34px] items-center justify-center rounded-lg border border-border bg-accent font-mono text-[11px] font-semibold sm:size-7 sm:rounded-[8px]">
              {getInitials(email)}
            </span>
            <span className="hidden text-body font-medium sm:inline">{getDisplayName(email)}</span>
          </span>

          <form action={signOut} className="hidden sm:block">
            <button
              type="submit"
              className="rounded-[9px] border border-b-2 border-border bg-card px-[13px] py-[7px] text-caption text-muted-foreground transition-colors hover:border-border-hover hover:text-foreground active:translate-y-px active:border-b"
            >
              Выход
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
