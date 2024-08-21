import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: './migrations',
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: "./wrangler.toml",
  },
});
