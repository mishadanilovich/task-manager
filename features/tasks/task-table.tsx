import { cn } from "cn";

import { isOverdue, type Task } from "@/domain/task";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { updateTaskStatus } from "./actions";
import { TaskDeadline } from "./task-deadline";
import { TaskDialog } from "./task-dialog";
import { TaskPriorityBadge } from "./task-priority";
import { TaskStatusSelect } from "./task-status-select";

function TaskTableRow({ task, listName, now }: { task: Task; listName: string; now: Date }) {
  const overdue = isOverdue(task, now);
  const isDone = task.status === "done";

  return (
    <TableRow
      className={cn(
        overdue && "bg-overdue-bg shadow-[inset_3px_0_0_var(--overdue)] hover:bg-overdue-bg",
        isDone && "opacity-60",
      )}
    >
      <TableCell className="px-5 py-3.5">
        <span className="flex flex-col gap-0.5">
          <span className="flex items-center gap-2.5">
            {isDone ? <span className="font-mono text-[12px] text-success">✓</span> : null}
            <TaskDialog
              task={task}
              listName={listName}
              now={now}
              trigger={
                <button
                  type="button"
                  className={cn(
                    "text-left text-body-l font-medium hover:underline",
                    overdue && "font-semibold",
                    isDone && "line-through",
                  )}
                >
                  {task.title}
                </button>
              }
            />
          </span>
          {task.description && !isDone ? (
            <span className="line-clamp-1 text-caption text-muted-foreground">
              {task.description}
            </span>
          ) : null}
        </span>
      </TableCell>

      <TableCell className="px-5 py-3.5">
        <TaskStatusSelect
          taskId={task.id}
          status={task.status}
          action={updateTaskStatus}
          className="w-full"
        />
      </TableCell>

      <TableCell className="px-5 py-3.5">
        <TaskPriorityBadge priority={task.priority} />
      </TableCell>

      <TableCell className="px-5 py-3.5">
        <TaskDeadline task={task} now={now} />
      </TableCell>
    </TableRow>
  );
}

export function TaskTable({
  tasks,
  listName,
  now,
  className,
}: {
  tasks: Task[];
  listName: string;
  now: Date;
  className?: string;
}) {
  const openTasks = tasks.filter((task) => task.status !== "done");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[13px] border border-b-2 border-border bg-card shadow-raised",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Задача</TableHead>
            <TableHead className="w-44">Статус</TableHead>
            <TableHead className="w-32">Приоритет</TableHead>
            <TableHead className="w-49">Дедлайн</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {openTasks.map((task) => (
            <TaskTableRow key={task.id} task={task} listName={listName} now={now} />
          ))}

          {doneTasks.length > 0 && openTasks.length > 0 ? (
            <TableRow className="hover:bg-muted">
              <TableCell
                colSpan={4}
                className="bg-muted px-5 py-2.5 font-mono text-[10.5px] tracking-[0.11em] text-muted-foreground uppercase"
              >
                Выполнено · {doneTasks.length}
              </TableCell>
            </TableRow>
          ) : null}

          {doneTasks.map((task) => (
            <TaskTableRow key={task.id} task={task} listName={listName} now={now} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
