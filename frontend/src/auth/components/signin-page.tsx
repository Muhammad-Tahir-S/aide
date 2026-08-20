import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import EmailIcon from "@/shared/assets/icons/email.svg?react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@/shared/design-system";

import { signinSchema } from "../schema";
import { AuthFormShell } from "./auth-form-shell";

export default function SigninPage() {
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
    },
    reValidateMode: "onChange",
  });

  function onSubmit(values: z.infer<typeof signinSchema>) {
    return values;
  }

  return (
    <AuthFormShell
      title="Log In"
      switchPrompt="Don’t have an account?"
      switchHref="/auth/signup"
      switchLabel="Create account"
      submitLabel="Log In"
      form={form}
      onSubmit={onSubmit}
    >
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Input
                placeholder="Email address"
                {...field}
                rightIcon={<EmailIcon />}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </AuthFormShell>
  );
}
