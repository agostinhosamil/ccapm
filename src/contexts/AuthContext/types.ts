import { Nullable } from "@verdantkit/utils";

import type { User } from "client@types/User";

export type { User };

type DefaultHandlerReturn = void | Promise<void>;

export type DefaultHandler<R = DefaultHandlerReturn> = () => R;

export type SignInResponse = {
  token: string;
  user: User;
};

export type AuthContextDataObject = {
  user: Nullable<User>;
  requestSignIn: DefaultHandler<Promise<boolean | User>>;
  setUser: React.Dispatch<React.SetStateAction<Nullable<User>>>;
};
