import Link from "next/link";

import { PageMessage } from "@/components/layout/page-message";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageMessage
      code="404"
      title="Страница не найдена"
      description="Возможно, адрес набран с ошибкой или страницу удалили."
      action={
        <Button asChild>
          <Link href="/lists">К спискам</Link>
        </Button>
      }
    />
  );
}
