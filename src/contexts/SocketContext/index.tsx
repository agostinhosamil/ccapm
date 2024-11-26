import { createContext, useState } from "react";

import { env } from "client@config/env";
import { io, Socket } from "socket.io-client";
import { SocketContextDataObject } from "./types";

export const SocketContext = createContext<SocketContextDataObject>(
  {} as SocketContextDataObject
);

type SocketContextProviderComponent =
  React.FunctionComponent<React.PropsWithChildren>;

export const SocketContextProvider: SocketContextProviderComponent = (
  props
) => {
  const [socket] = useState<Socket>(() => io(env.VITE_NODE_SERVER_API_URL));

  const socketContextDataObject: SocketContextDataObject = {
    socket,
  };

  return (
    <SocketContext.Provider value={socketContextDataObject}>
      {props.children}
    </SocketContext.Provider>
  );
};
