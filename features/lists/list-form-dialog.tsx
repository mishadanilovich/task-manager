"use client";

import { listFormSchema, type ListFormValues } from "@/domain/schemas";
import { LIST_NAME_MAX_LENGTH } from "@/domain/list";
import type { ActionResult } from "@/lib/action-result";
import { useActionForm } from "@/lib/use-action-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { SavedList } from "./actions";

export type ListFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  defaultName?: string;
  action: (values: ListFormValues) => Promise<ActionResult<SavedList>>;
  onSuccess?: (data: SavedList) => void;
};

export function ListFormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  defaultName = "",
  action,
  onSuccess,
}: ListFormDialogProps) {
  const { form, submit, serverError, isSubmitting } = useActionForm({
    schema: listFormSchema,
    defaultValues: { name: defaultName },
    action,
    onSuccess: (data) => {
      onOpenChange(false);
      form.reset({ name: "" });
      onSuccess?.(data);
    },
  });

  const nameLength = form.watch("name").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader className="gap-1.5">
          <DialogTitle className="font-display text-[22px] font-semibold tracking-[-0.01em]">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={submit} noValidate className="flex flex-col gap-5">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem className="gap-[7px]">
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input autoFocus disabled={isSubmitting} {...field} />
                  </FormControl>
                  <div className="flex items-start justify-between gap-3">
                    <FormMessage />
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                      {nameLength} / {LIST_NAME_MAX_LENGTH}
                    </span>
                  </div>
                </FormItem>
              )}
            />

            {serverError ? (
              <p role="alert" className="text-caption text-overdue">
                {serverError}
              </p>
            ) : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
