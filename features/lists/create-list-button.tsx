"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ListFormValues } from "@/domain/schemas";
import { Button } from "@/components/ui/button";

import { createList } from "./actions";
import { ListFormDialog } from "./list-form-dialog";

export function CreateListButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  const action = (values: ListFormValues) => {
    setName(values.name);

    return createList(values);
  };

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
        action={action}
        onSuccess={({ id }) =>
          toast.success(`Список «${name}» создан`, {
            action: { label: "Открыть", onClick: () => router.push(`/lists/${id}`) },
          })
        }
      />
    </>
  );
}
