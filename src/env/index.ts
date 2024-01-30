import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string().default("default"),
  NODE_ENV: z.enum(["test", "dev"]).default("dev"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("⚠ Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}

const env = _env.data;
export default env;
