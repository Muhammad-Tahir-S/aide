import type { ReactNode } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { Link } from "react-router";

import {
  Button,
  Form,
  Separator,
  SocialButton,
  Typography,
} from "@/shared/design-system";

type AuthFormShellProps<TFieldValues extends FieldValues> = {
  title: string;
  switchPrompt: string;
  switchHref: string;
  switchLabel: string;
  submitLabel: string;
  form: UseFormReturn<TFieldValues>;
  onSubmit: (values: TFieldValues) => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthFormShell<TFieldValues extends FieldValues>({
  title,
  switchPrompt,
  switchHref,
  switchLabel,
  submitLabel,
  form,
  onSubmit,
  children,
  footer,
}: AuthFormShellProps<TFieldValues>) {
  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <Typography variant="display-md/semibold">{title}</Typography>
        <div className="flex items-center">
          <Typography variant="text-md/regular">{switchPrompt}</Typography>
          <Link to={switchHref} replace>
            <Button variant="link" size="sm" className="p-1">
              {switchLabel}
            </Button>
          </Link>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-8"
        >
          <div className="flex w-full flex-col gap-4">
            {children}
            <Button
              type="submit"
              disabled={form.formState.isSubmitted && !form.formState.isDirty}
            >
              {submitLabel}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-[40%]">
              <Separator />
            </div>
            <Typography variant="text-xs/medium">OR</Typography>
            <div className="w-[43%]">
              <Separator />
            </div>
          </div>
          <SocialButton buttonText="Continue with Google" />
        </form>
      </Form>
      {footer}
    </>
  );
}
