"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Separator,
  SocialButton,
  Typography,
} from "@/shared/design-system";

import EmailIcon from "../../assets/icons/email.svg?react";
import UserIcon from "../../assets/icons/user.svg?react";

const createAccountFormSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.email(),
});
export default function SignupPage() {
  const form = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      username: "",
      email: "",
    },
    reValidateMode: "onChange",
  });
  function onSubmit(values: z.infer<typeof createAccountFormSchema>) {
    return values;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <Typography variant="display-md/semibold">Create Account</Typography>
        <div className="flex items-center">
          <Typography variant="text-md/regular">
            Already have an account?
          </Typography>
          <Link to="/auth/signin" replace>
            <Button variant="link" size="sm" className="p-1">
              Log in
            </Button>
          </Link>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-8"
        >
          <div className="flex flex-col w-full gap-4">
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
            <Button
              type="submit"
              disabled={form.formState.isSubmitted && !form.formState.isDirty}
            >
              Create Account
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
    </>
  );
}
