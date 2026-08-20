import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import type { z } from "zod";

import EmailIcon from "@/shared/assets/icons/email.svg?react";
import UserIcon from "@/shared/assets/icons/user.svg?react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Typography,
} from "@/shared/design-system";

import { signupSchema } from "../schema";
import { AuthFormShell } from "./auth-form-shell";

export default function SignupPage() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
    },
    reValidateMode: "onChange",
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
    return values;
  }

  return (
    <AuthFormShell
      title="Create Account"
      switchPrompt="Already have an account?"
      switchHref="/auth/signin"
      switchLabel="Log in"
      submitLabel="Create Account"
      form={form}
      onSubmit={onSubmit}
      footer={
        <div className="flex text-center">
          <Typography variant="text-xs/medium" className="text-gray-500">
            By creating an account, you agree to our{" "}
            <Link to="" className="text-base-dark">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="" className="text-base-dark">
              Privacy & Cookie Statement
            </Link>
            .
          </Typography>
        </div>
      }
    >
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Input
                placeholder="Your name"
                {...field}
                rightIcon={<UserIcon />}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
