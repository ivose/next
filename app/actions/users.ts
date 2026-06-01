"use server"

import bcrypt from "bcryptjs"
import { db } from "@/db"
import { users } from "@/db/schema"

export const registerUser = async (
  prevState: { error: string; success?: boolean },
  formData: FormData,
) => {
  const username = (formData.get("username") as string)?.trim()
  const name = (formData.get("name") as string)?.trim()
  const password = formData.get("password") as string

  const passwordHash = await bcrypt.hash(password, 10)

  await db.insert(users).values({ username, name, passwordHash })

  return { error: "", success: true }
}
