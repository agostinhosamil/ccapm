import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string(),
});

export const env = EnvSchema.parse(process.env);
