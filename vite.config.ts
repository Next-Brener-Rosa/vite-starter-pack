import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import path from "path";

import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      generatedRouteTree: "./src/route-tree.gen.ts",
      routesDirectory: "./src/routes",
      routeToken: "layout",
      indexToken: "index",
    }),
    tailwindcss(),
    react(),
  ],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	},
})
