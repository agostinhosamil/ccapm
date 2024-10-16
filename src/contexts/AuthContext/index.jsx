import { createContext, useContext, useEffect, useRef, useState } from "react";

import { axios } from "@config/axios";

import { setUserToken } from "~/utils";
import { LoginForm } from "./LoginForm";

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const loginFormSubmitHandlerState = useRef();

  const loginFormSubmitHandler = async (event) => {
    if (typeof loginFormSubmitHandlerState.current === "function") {
      await loginFormSubmitHandlerState.current(event);
    }
  };

  const authContextDataObject = {
    user,
    setUser,

    requestSignIn: async () =>
      new Promise((resolve) => {
        setShowLoginDialog(true);

        loginFormSubmitHandlerState.current = async (event) => {
          const formData = new FormData(event.target);

          const response = await axios.post("/login", formData);

          if (typeof response.data === "object" && response.data.user) {
            setUserToken(response.data.token);

            const userAppointmentsResponse = await axios.get("/appointments");

            setUser({
              ...response.data.user,
              appointments: userAppointmentsResponse.data,
            });
            setShowLoginDialog(false);

            return resolve(response.data.user);
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
