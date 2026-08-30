import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: { plugins: [tailwindcss()] },

  // Fonts are self-hosted: Astro downloads them at build time and serves them
  // from our own origin, so there is no request to Google at page load.
  // The CSS variables below are consumed by @theme in src/styles/global.css.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Archivo",
      cssVariable: "--font-archivo",
      weights: [400, 500, 600, 700, 800],
      styles: ["normal"],
      display: "swap",
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Spline Sans Mono",
      cssVariable: "--font-spline-mono",
      weights: [400, 500],
      styles: ["normal"],
      display: "swap",
      fallbacks: ["monospace"],
    },
  ],
});
