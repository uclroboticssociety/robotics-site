import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()], // required: Tailwind 4 is wired in as a Vite plugin
  },
});

