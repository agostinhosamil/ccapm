import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./normalize";

import App from "./App";

import "./assets/styles/globals.css";
import "./index.css";

const rootElement = document.getElementById("root");

createRoot(rootElement as HTMLDivElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
