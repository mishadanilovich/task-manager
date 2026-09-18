import { signIn } from "@/features/auth/actions";
import { LoginForm } from "@/features/auth/login-form";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/features/theme/theme-toggle";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col px-4 py-6 sm:px-10 sm:py-8">
      <div className="flex items-center justify-between gap-4">
        <Logo />
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center py-12">
        <LoginForm action={signIn} />
      </div>
    </div>
  );
}
