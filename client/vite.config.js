import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ✅ Correct Vite config
export default defineConfig({
  plugins: [tailwindcss(), react()],
});
