import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import z from "zod";

import SocialButton from "@/shared/components/social-button";
import Typography from "@/shared/components/typography";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";

import EmailIcon from "../../assets/icons/email.svg?react";

const loginFormSchema = z.object({
  email: z.email(),
});

export default function SigninPage() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
    reValidateMode: "onChange",
  });
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    return values;
  }
  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <Typography variant="display-md/semibold">Log In</Typography>
        <div className="flex items-center">
          <Typography variant="text-md/regular">
            Don’t have an account?
          </Typography>
          <Link to="/auth/signup" replace>
            <Button variant="link" size="sm" className="p-1">
              Create account
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
              Log In
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
    </>
  );
}
