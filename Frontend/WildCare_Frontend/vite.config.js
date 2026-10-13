import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        Login: resolve(__dirname, "Login.html"),
        // Agrega aquí todas las páginas HTML adicionales que tengas
      },
    },
  },
});
