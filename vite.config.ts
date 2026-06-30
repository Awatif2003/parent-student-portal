import { defineConfig } from "vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { tanstackRouter } from "@tanstack/router-plugin/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
  ],
  server: {
    port: 3000,
    // Expose the dev server on the LAN so phones/other devices can reach it.
    host: true,
  },
})
