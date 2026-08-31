import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Raise the warning threshold slightly — gzipped output is 280 KB which is fine
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core — always needed, cache-friendly
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router-dom/") ||
              id.includes("node_modules/scheduler/")) {
            return "vendor-react";
          }

          // Lucide icon tree — large but stable, cache separately
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-icons";
          }

          // Radix UI primitives (used by shadcn)
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }

          // Other third-party libraries
          if (id.includes("node_modules/")) {
            return "vendor-misc";
          }

          // Admin panel — only loaded on /admin route
          if (id.includes("/components/admin/") || id.includes("/pages/AdminPage")) {
            return "chunk-admin";
          }

          // Heavy visualizer / interactive components
          if (
            id.includes("OfficeNetworkVisualizer") ||
            id.includes("ArchitectureViewer") ||
            id.includes("InteractiveTerminal") ||
            id.includes("DowntimeCalculator") ||
            id.includes("InteractiveToolkitHub")
          ) {
            return "chunk-visualizers";
          }
        },
      },
    },
  },
}));
