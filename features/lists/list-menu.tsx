"use client";

import { useState, useTransition } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";

import type { ListFormValues } from "@/domain/schemas";
import { formatOverdueTasks, formatTasks } from "@/lib/format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteList, renameList } from "./actions";
import { ListFormDialog } from "./list-form-dialog";

export type ListMenuProps = {
  id: string;
  name: string;
  taskCount: number;
  overdueCount: number;
};

function describeDeletion({
  taskCount,
  overdueCount,
}: Pick<ListMenuProps, "taskCount" | "overdueCount">) {
  if (taskCount === 0) return "В списке нет задач. Действие необратимо.";

  const overdue = overdueCount > 0 ? `, включая ${formatOverdueTasks(overdueCount)}` : "";

  return `Вместе со списком удалятся ${formatTasks(taskCount)}${overdue}. Действие необратимо.`;
}

export function ListMenu({ id, name, taskCount, overdueCount }: ListMenuProps) {
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const rename = (values: ListFormValues) => renameList(id, values);

  const confirmDelete = () =>
    startTransition(async () => {
      const result = await deleteList(id);

      if (result.ok) {
        setDeleting(false);
        toast.success(`Список «${name}» удалён`);
      } else {
        toast.error(result.error, { action: { label: "Повторить", onClick: confirmDelete } });
      }
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Действия со списком «${name}»`}
          className="flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
        >
          <MoreHorizontalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[196px]">
          <DropdownMenuItem onSelect={() => setRenaming(true)}>Переименовать</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(true)}>
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ListFormDialog
        open={renaming}
        onOpenChange={setRenaming}
        title="Переименовать список"
        description="Название видно на карточке и в заголовке страницы."
        submitLabel="Сохранить"
        defaultName={name}
        action={rename}
        onSuccess={() => toast.success("Список переименован")}
      />

      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex-row gap-3.5">
            <span
              aria-hidden
              className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] border border-overdue bg-overdue-bg font-mono text-[15px] font-bold text-overdue"
            >
              ▲
            </span>
            <div>
              <AlertDialogTitle className="font-display text-[22px] font-semibold tracking-[-0.01em]">
                Удалить «{name}»?
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-1.5 text-body leading-[1.55]">
                {describeDeletion({ taskCount, overdueCount })}
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={isPending}>
                Отмена
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={isPending}
                onClick={(event) => {
                  event.preventDefault();
                  confirmDelete();
                }}
              >
                Удалить список
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
