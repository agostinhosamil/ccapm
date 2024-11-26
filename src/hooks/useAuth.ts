import { useContext } from "react";

import { AuthContext } from "client@contexts/AuthContext";

export const useAuth = () => useContext(AuthContext);
