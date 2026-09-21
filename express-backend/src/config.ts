import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z.enum(["dev", "test", "prod"]).default("dev"),
  CORS_ORIGIN: z.url(),
});

type Config = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    console.error("Invalid environment configuration:");
    console.error(result.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
  }

  return result.data;
}
