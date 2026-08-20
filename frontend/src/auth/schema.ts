import { z } from "zod";

export const emailSchema = z.email();

export const signinSchema = z.object({
  email: emailSchema,
});

export const signupSchema = z.object({
  username: z.string().min(2).max(50),
  email: emailSchema,
});
