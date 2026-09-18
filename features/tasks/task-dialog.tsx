"use client";

import type { ReactNode } from "react";

import type { Task } from "@/domain/task";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { TaskCard } from "./task-card";

export type TaskDialogProps = {
  task: Task;
  listName: string;
  now: Date;
  trigger: ReactNode;
};

export function TaskDialog({ task, listName, now, trigger }: TaskDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <TaskCard task={task} listName={listName} now={now} titleComponent={DialogTitle} />
      </DialogContent>
    </Dialog>
  );
}
