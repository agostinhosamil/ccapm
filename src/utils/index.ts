import { Nullable } from "@verdantkit/utils";

export const setUserToken = (token: string) => {
  localStorage.setItem("user-auth-token", token);
};

export const getUserToken = (): Nullable<string> => {
  return localStorage.getItem("user-auth-token");
};
