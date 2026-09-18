"use client";

import { useEffect } from "react";
import Link from "next/link";

import { PageMessage } from "@/components/layout/page-message";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageMessage
      code="Ошибка"
      title="Что-то пошло не так"
      description="Не удалось загрузить данные. Попробуйте ещё раз — обычно это помогает."
      action={
        <>
          <Button variant="outline" asChild>
            <Link href="/lists">К спискам</Link>
          </Button>
          <Button onClick={() => retry()}>Повторить</Button>
        </>
      }
    />
  );
}
