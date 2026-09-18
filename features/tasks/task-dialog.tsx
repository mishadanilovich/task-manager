"use client";

import { useState, useTransition, type ReactNode } from "react";
import { toast } from "sonner";

import { splitDueAt } from "@/domain/deadline";
import { taskFormSchema, type TaskFormValues } from "@/domain/schemas";
import type { Task } from "@/domain/task";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { deleteTask, updateTask } from "./actions";
import { TaskCard } from "./task-card";
import { TaskForm } from "./task-form";

function toFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    ...splitDueAt(task.dueAt),
  };
}

export type TaskDialogProps = {
  task: Task;
  listName: string;
  now: Date;
  trigger: ReactNode;
};

export function TaskDialog({ task, listName, now, trigger }: TaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, startDeleting] = useTransition();

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) setEditing(false);
  };

  const remove = () =>
    startDeleting(async () => {
      const result = await deleteTask(task.id);

      if (result.ok) {
        setConfirmingDelete(false);
        changeOpen(false);
        toast.success(`Задача «${task.title}» удалена`);
      } else {
        toast.error(result.error, { action: { label: "Повторить", onClick: remove } });
      }
    });

  return (
    <>
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {editing ? (
            <>
              <DialogTitle className="font-display text-[24px] font-semibold tracking-[-0.015em]">
                Редактировать задачу
              </DialogTitle>
              <TaskForm
                schema={taskFormSchema}
                defaultValues={toFormValues(task)}
                submitLabel="Сохранить"
                action={(values) => updateTask(task.id, values)}
                onSuccess={() => {
                  setEditing(false);
                  toast.success("Задача сохранена");
                }}
                onCancel={() => setEditing(false)}
              />
            </>
          ) : (
            <TaskCard
              task={task}
              listName={listName}
              now={now}
              titleComponent={DialogTitle}
              footer={
                <div className="flex flex-wrap justify-between gap-3">
                  <Button
                    variant="outline"
                    className="text-overdue hover:border-overdue hover:bg-overdue-bg"
                    onClick={() => setConfirmingDelete(true)}
                  >
                    Удалить
                  </Button>
                  <div className="flex gap-2.5">
                    <DialogClose asChild>
                      <Button variant="outline">Закрыть</Button>
                    </DialogClose>
                    <Button onClick={() => setEditing(true)}>Редактировать</Button>
                  </div>
                </div>
              }
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
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
                Удалить задачу?
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-1.5 text-body leading-[1.55]">
                «{task.title}» будет удалена из списка «{listName}». Отменить не получится.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={isDeleting}>
                Отмена
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={(event) => {
                  event.preventDefault();
                  remove();
                }}
              >
                Удалить
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
