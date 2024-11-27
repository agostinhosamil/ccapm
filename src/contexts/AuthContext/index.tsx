import { Nullable } from "@verdantkit/utils";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { axios } from "client@config/axios";
import { setUserToken } from "client@utils";

import { LoginForm } from "./LoginForm";
import { AuthContextDataObject, SignInResponse, User } from "./types";

export const AuthContext = createContext<AuthContextDataObject>(
  {} as AuthContextDataObject
);

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = (props: React.PropsWithChildren) => {
  const [user, setUser] = useState<Nullable<User>>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const loginFormSubmitHandlerState = useRef<React.FormEventHandler>();

  const loginFormSubmitHandler = async (event: React.FormEvent) => {
    if (typeof loginFormSubmitHandlerState.current === "function") {
      return await loginFormSubmitHandlerState.current(event);
    }
  };

  const authContextDataObject: AuthContextDataObject = {
    user,
    setUser,

    requestSignIn: async () =>
      new Promise((resolve) => {
        setShowLoginDialog(true);

        loginFormSubmitHandlerState.current = async (event) => {
          const formData = new FormData(event.target as HTMLFormElement);

          const response = await axios.post<SignInResponse>("/login", formData);

          if (typeof response.data === "object" && response.data.user) {
            setUserToken(response.data.token);

            const userAppointmentsResponse = await axios.get("/appointments");

            setUser({
              ...response.data.user,
              appointments: userAppointmentsResponse.data,
            });

            setShowLoginDialog(false);

            resolve(response.data.user);

            return true;
          }

          resolve(false);
        };
      }),
  };

  useEffect(() => {
    const effectHandler = async () => {
      try {
        const response = await axios.get("/profile");

        if (typeof response.data === "object" && response.data.id) {
          setUser(response.data);
        }
      } catch (err) {
        return err;
      }
    };

    if (!user) {
      effectHandler();
    }
  });

  return (
    <AuthContext.Provider value={authContextDataObject}>
      {props.children}
      {showLoginDialog && (
        <LoginForm
          onSubmit={loginFormSubmitHandler}
          onClose={() => setShowLoginDialog(false)}
        />
      )}
    </AuthContext.Provider>
  );
};
