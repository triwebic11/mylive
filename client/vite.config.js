import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Correct Vite config
export default defineConfig({
  plugins: [react()],
});
