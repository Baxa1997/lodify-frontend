import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8888,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@hooks": "/src/hooks",
      "@pages": "/src/pages",
      "@store": "/src/store",
      "@utils": "/src/utils",
      "@services": "/src/services",
      "@styles": "/src/styles",
      "@context": "/src/context",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          chakra: ["@chakra-ui/react", "@emotion/react", "@emotion/styled"],
          redux: ["@reduxjs/toolkit", "react-redux", "redux", "redux-persist"],
          router: ["react-router-dom"],
          query: ["@tanstack/react-query", "@tanstack/react-query-devtools"],
          icons: ["react-icons"],
          forms: ["react-hook-form"],
          utils: ["axios", "framer-motion"],
        },
      },
      external: (id) => {
        // Exclude problematic native modules from bundling
        return (
          id.includes("@rollup/rollup-linux-x64-gnu") ||
          id.includes("@rollup/rollup-darwin-x64") ||
          id.includes("@rollup/rollup-win32-x64")
        );
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@chakra-ui/react",
      "@reduxjs/toolkit",
      "react-redux",
      "react-router-dom",
      "@tanstack/react-query",
    ],
    exclude: ["@rollup/rollup-linux-x64-gnu"],
  },
});
