"use client";

import { signOut } from "@/features/auth/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileUserMenu({ email, initials }: { email: string; initials: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Меню пользователя"
        className="flex size-[34px] items-center justify-center rounded-lg border border-border bg-accent font-mono text-[11px] font-semibold sm:hidden"
      >
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-mono text-[11px] text-muted-foreground">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>Выход</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
