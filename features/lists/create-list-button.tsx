"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { createList } from "./actions";
import { ListFormDialog } from "./list-form-dialog";

export function CreateListButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)}>
        + Новый список
      </Button>

      <ListFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Новый список"
        description="Название можно изменить в любой момент."
        submitLabel="Создать"
        action={createList}
        onSuccess={({ id, name }) =>
          toast.success(`Список «${name}» создан`, {
            action: { label: "Открыть", onClick: () => router.push(`/lists/${id}`) },
          })
        }
      />
    </>
  );
}
