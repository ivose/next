import { defineConfig } from "@playwright/test"
import dotenv from "dotenv"

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env.local"

dotenv.config({ path: envFile })

const baseURL = process.env.AUTH_URL ?? "http://localhost:3000"


export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL
  },
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})