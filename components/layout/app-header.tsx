import { signOut } from "@/features/auth/actions";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { Button } from "@/components/ui/button";

import { Logo } from "./logo";
import { MobileUserMenu } from "./mobile-user-menu";

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

          <MobileUserMenu email={email} initials={getInitials(email)} />

          <span className="hidden items-center gap-2.5 sm:flex">
            <span className="flex size-7 items-center justify-center rounded-[8px] border border-border bg-accent font-mono text-[11px] font-semibold">
              {getInitials(email)}
            </span>
            <span className="text-body font-medium">{getDisplayName(email)}</span>
          </span>

          <form action={signOut} className="hidden sm:block">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="h-auto rounded-[9px] px-[13px] py-[7px] text-caption font-normal text-muted-foreground hover:text-foreground"
            >
              Выход
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
