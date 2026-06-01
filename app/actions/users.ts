"use server"

import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"

export const registerUser = async (
  prevState: {
    errors: {
      username?: string
      password?: string
      passwordConfirm?: string
    }
    username: string
    name: string
    success?: boolean
  },
  formData: FormData,
) => {
  const username = (formData.get("username") as string)?.trim()
  const name = (formData.get("name") as string)?.trim()
  const password = formData.get("password") as string
  const passwordConfirm = formData.get("passwordConfirm") as string

  const errors: {
    username?: string
    password?: string
    passwordConfirm?: string
  } = {}

  if (!username || username.length < 4) {
    errors.username = "Username must be at least 4 characters long"
  }

  if (!password || password.length < 4) {
    errors.password = "Password must be at least 4 characters long"
  }

  if (!passwordConfirm) {
    errors.passwordConfirm = "Password confirmation is required"
  } else if (passwordConfirm !== password) {
    errors.passwordConfirm = "Passwords do not match"
  }

  if (username && username.length >= 4) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    })

    if (existingUser) {
      errors.username = "Username is already taken"
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      username,
      name,
      success: false,
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await db.insert(users).values({ username, name, passwordHash })

  return {
    errors: {},
    username: "",
    name: "",
    success: true,
  }
}