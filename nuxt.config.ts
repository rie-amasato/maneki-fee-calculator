// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["amasugar/amasugar.css"],
  ssr: true,
  target: "static",
  app: {
    buildAssetsDir: "/manekifeecalculator/",
  },
});
