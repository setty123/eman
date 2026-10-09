import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: [
        "**/docs/**",
        "**/dist/**",
        "**/test-results*/**",
        "**/playwright-report/**",
        "**/*.tsbuildinfo",
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/gsap/") || id.includes("/lenis/"))
            return "animation";
          if (id.includes("/motion/") || id.includes("/framer-motion/"))
            return "motion";
        },
      },
    },
  },
});
