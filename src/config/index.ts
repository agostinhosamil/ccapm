import { env } from "./env";

export const config = {
  get apiUrl() {
    return env.VITE_API_BASE_URL;
  },
};
