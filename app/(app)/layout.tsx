import { AppHeader } from "@/components/layout/app-header";
import { requireSession } from "@/server/auth/session";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const session = await requireSession();

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader email={session.email} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
