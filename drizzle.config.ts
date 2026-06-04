import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env.local"

dotenv.config({ path: envFile })
dotenv.config({ path: ".env.local" })

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing")
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})