import { z } from "zod";

export const EnvVariablesSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1).url(),
  VITE_NODE_SERVER_API_URL: z.string().url(),
});

const resolveEnvVariables = () => {
  if (typeof import.meta === "object") {
    return import.meta.env;
  }

  const globalThis =
    typeof global === "object"
      ? global
      : typeof window === "object"
      ? window
      : null;

  return (
    globalThis &&
    typeof globalThis.process === "object" &&
    globalThis.process.env
  );
};

export const env = EnvVariablesSchema.parse(resolveEnvVariables());
