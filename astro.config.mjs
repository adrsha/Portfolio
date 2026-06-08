import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
    vite: {
        resolve: {
            alias: {
                "@theme": "/src/globalStyles/themes.css",
            },
        },
    },
});
