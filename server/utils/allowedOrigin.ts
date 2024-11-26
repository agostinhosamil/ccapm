import { allowedOrigins } from "server@config/cors";

export const allowedOrigin = (origin: string): boolean => {
  return allowedOrigins.some((allowedOrigin) => {
    const allowedOriginRe =
      allowedOrigin instanceof RegExp
        ? allowedOrigin
        : new RegExp(`^(${allowedOrigin})$`);

    return allowedOriginRe.test(origin);
  });
};
