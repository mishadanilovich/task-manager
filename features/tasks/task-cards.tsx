import { cn } from "cn";

import { isOverdue, type Task } from "@/domain/task";

import { updateTaskStatus } from "./actions";
import { TaskDeadline } from "./task-deadline";
import { TaskDialog } from "./task-dialog";
import { TaskPriorityBadge } from "./task-priority";
import { TaskStatusSelect } from "./task-status-select";

function TaskCardItem({ task, listName, now }: { task: Task; listName: string; now: Date }) {
  const overdue = isOverdue(task, now);
  const isDone = task.status === "done";

  return (
    <li
      className={cn(
        "flex flex-col gap-2.5 rounded-lg border border-b-2 border-border bg-card p-4",
        overdue && "bg-overdue-bg shadow-[inset_3px_0_0_var(--overdue)]",
        isDone && "opacity-60",
      )}
    >
      <TaskDialog
        task={task}
        listName={listName}
        now={now}
        trigger={
          <button
            type="button"
            className={cn(
              "text-left text-body-l leading-[1.35] font-medium",
              overdue && "font-semibold",
              isDone && "line-through",
            )}
          >
            {task.title}
          </button>
        }
      />
      <TaskDeadline task={task} now={now} layout="inline" />
      <div className="flex items-center gap-2">
        <TaskStatusSelect
          taskId={task.id}
          status={task.status}
          action={updateTaskStatus}
          className="flex-1"
        />
        <TaskPriorityBadge priority={task.priority} />
      </div>
    </li>
  );
}

export function TaskCards({
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
    <div className={cn("flex flex-col gap-2.5", className)}>
      <ul className="flex flex-col gap-2.5">
        {openTasks.map((task) => (
          <TaskCardItem key={task.id} task={task} listName={listName} now={now} />
        ))}
      </ul>

      {doneTasks.length > 0 && openTasks.length > 0 ? (
        <div className="mt-2 font-mono text-[10.5px] tracking-[0.11em] text-muted-foreground uppercase">
          Выполнено · {doneTasks.length}
        </div>
      ) : null}

      <ul className="flex flex-col gap-2.5">
        {doneTasks.map((task) => (
          <TaskCardItem key={task.id} task={task} listName={listName} now={now} />
        ))}
      </ul>
    </div>
  );
}
