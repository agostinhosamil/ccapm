import { useContext } from "react";

import { AppContext } from "client@contexts/AppContext";

export const useApp = () => useContext(AppContext);
