"use client";

import { useState } from "react";
import { toast } from "sonner";

import { taskFormSchema } from "@/domain/schemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createTask } from "./actions";
import { EMPTY_TASK_FORM, TaskForm } from "./task-form";

export type CreateTaskButtonProps = {
  listId: string;
  listName: string;
  className?: string;
};

export function CreateTaskButton({ listId, listName, className }: CreateTaskButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>+ Добавить задачу</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="gap-1.5">
          <DialogTitle className="font-display text-[24px] font-semibold tracking-[-0.015em]">
            Новая задача
          </DialogTitle>
          <DialogDescription>В список «{listName}». Обязательно только название.</DialogDescription>
        </DialogHeader>

        <TaskForm
          schema={taskFormSchema}
          defaultValues={EMPTY_TASK_FORM}
          submitLabel="Создать задачу"
          action={(values) => createTask(listId, values)}
          onSuccess={({ title }) => {
            setOpen(false);
            toast.success(`Задача «${title}» создана`);
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
