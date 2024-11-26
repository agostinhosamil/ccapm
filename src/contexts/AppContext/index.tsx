import { Nullable } from "@verdantkit/utils";
import { createContext, useContext, useRef, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

import { Alert } from "./Alert";
import { AlertProps, AppContextDataObject, DefaultHandler } from "./types";

export const AppContext = createContext<AppContextDataObject>(
  {} as AppContextDataObject
);

export const useApp = () => useContext(AppContext);

export const AppContextProvider = (props: React.PropsWithChildren) => {
  const [alert, setAlert] = useState<Nullable<AlertProps>>(null);
  const [showLoadingDialog, setShowLoadingDialog] = useState<boolean>(false);

  const alertCloseHandlerState = useRef<DefaultHandler>();

  const appContextDataObject: AppContextDataObject = {
    showAlert: async (alertProps) =>
      new Promise((resolve) => {
        setAlert(alertProps);

        alertCloseHandlerState.current = () => {
          setAlert(null);
          resolve(null);
        };
      }),

    resolvePromise: async (promiseHandler: DefaultHandler) => {
      setShowLoadingDialog(true);

      let promiseResponse: Nullable<ReturnType<typeof promiseHandler>> = null;

      try {
        promiseResponse = await promiseHandler();
      } catch (err) {
        console.log(">>> Error: ", err);
      }

      setShowLoadingDialog(false);

      return promiseResponse;
    },
  };

  return (
    <AppContext.Provider value={appContextDataObject}>
      {props.children}
      {typeof alert === "object" && alert && alert.title && (
        <Alert
          {...alert}
          show={true}
          onClose={() => {
            if (typeof alertCloseHandlerState.current === "function") {
              alertCloseHandlerState.current();
            }
          }}
        />
      )}
      {showLoadingDialog && (
        <div className="flex size-full cursor-progress z-[9999] flex-row justify-center bg-zinc-950 bg-opacity-90 fixed left-0 top-0 overflow-y-auto">
          <div className="w-11/12 max-w-96 p-5 md:p-9 flex flex-row justify-center items-center bg-white rounded-xl shadow-lg m-auto">
            <Spinner />
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};
