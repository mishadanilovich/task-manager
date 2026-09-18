"use client";

import { useState } from "react";

import { credentialsSchema, type Credentials } from "@/domain/schemas";
import type { ActionResult } from "@/lib/action-result";
import { useActionForm } from "@/lib/use-action-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const DEMO_CREDENTIALS: Credentials = { email: "admin@example.com", password: "Admin123!" };

export type LoginFormProps = {
  action: (values: Credentials) => Promise<ActionResult>;
  defaultValues?: Credentials;
};

export function LoginForm({ action, defaultValues = DEMO_CREDENTIALS }: LoginFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { form, submit, serverError, isSubmitting } = useActionForm({
    schema: credentialsSchema,
    defaultValues,
    action,
  });

  return (
    <Form {...form}>
      <form onSubmit={submit} noValidate className="flex w-full max-w-[420px] flex-col">
        <h1 className="font-display text-[32px] font-semibold tracking-[-0.015em]">Войти</h1>
        <p className="mt-2 mb-8 text-body-l text-muted-foreground">
          Рабочий аккаунт или почта, которой вы пользуетесь.
        </p>

        {serverError ? (
          <div
            role="alert"
            className="mb-5 flex gap-3 rounded-md border border-l-[3px] border-overdue bg-overdue-bg px-[15px] py-[13px]"
          >
            <div>
              <div className="text-body font-semibold text-overdue">{serverError}</div>
              <div className="mt-1 text-caption opacity-85">Проверьте раскладку клавиатуры.</div>
            </div>
          </div>
        ) : null}

        <FormField
          name="email"
          render={({ field }) => (
            <FormItem className="mb-[18px] gap-[7px]">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  placeholder="name@company.ru"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          render={({ field }) => (
            <FormItem className="mb-6 gap-[7px]">
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <div className="relative flex">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    className="pr-[86px]"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((visible) => !visible)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase hover:text-foreground"
                  >
                    {passwordVisible ? "Скрыть" : "Показать"}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span
                aria-hidden
                className="size-3.5 animate-spin rounded-full border-2 border-white/35 border-t-primary-foreground"
              />
              Проверяем…
            </>
          ) : (
            "Войти"
          )}
        </Button>

        {isSubmitting ? (
          <p className="mt-3 text-center text-caption text-muted-foreground">
            Обычно занимает меньше секунды
          </p>
        ) : null}

        <p className="mt-5 text-center text-caption text-muted-foreground">
          Поля заполнены демонстрационным доступом — достаточно нажать «Войти».
        </p>
      </form>
    </Form>
  );
}
