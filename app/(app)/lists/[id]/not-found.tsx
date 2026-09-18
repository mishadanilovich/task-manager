import Link from "next/link";

import { PageMessage } from "@/components/layout/page-message";
import { Button } from "@/components/ui/button";

export default function ListNotFound() {
  return (
    <PageMessage
      code="404"
      title="Список не найден"
      description="Его могли удалить или переименовать ссылку. Остальные списки на месте."
      action={
        <Button asChild>
          <Link href="/lists">Все списки</Link>
        </Button>
      }
    />
  );
}
