"use client";

import { useState, type BaseSyntheticEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import type { ZodType } from "zod";

import type { ActionResult } from "./action-result";

type UseActionFormOptions<Values extends FieldValues, Data> = {
  schema: ZodType<Values, Values>;
  defaultValues: DefaultValues<Values>;
  action: (values: Values) => Promise<ActionResult<Data> | void>;
  onSuccess?: (data: Data) => void;
};

export type UseActionFormResult<Values extends FieldValues> = {
  form: UseFormReturn<Values>;
  submit: (event?: BaseSyntheticEvent) => Promise<void>;
  serverError: string | null;
  isSubmitting: boolean;
};

export function useActionForm<Values extends FieldValues, Data = undefined>({
  schema,
  defaultValues,
  action,
  onSuccess,
}: UseActionFormOptions<Values, Data>): UseActionFormResult<Values> {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const submit = form.handleSubmit(async (values) => {
    setServerError(null);
    const result = await action(values);

    if (result && !result.ok) {
      setServerError(result.error);

      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        const message = messages?.[0];
        if (message) form.setError(field as Path<Values>, { message });
      }

      return;
    }

    onSuccess?.(result?.data as Data);
  });

  return { form, submit, serverError, isSubmitting: form.formState.isSubmitting };
}
