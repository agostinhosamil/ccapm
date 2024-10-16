import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import jsConfigPaths from "vite-jsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), jsConfigPaths()],
});
