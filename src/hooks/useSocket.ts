import { useContext } from "react";

import { SocketContext } from "client@contexts/SocketContext";

export const useSocket = () => useContext(SocketContext);
