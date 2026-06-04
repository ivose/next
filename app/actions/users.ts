"use server"

import bcrypt from "bcryptjs"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const registerUser = async (
  prevState: {
    errors: {
      username?: string
      passwordConfirm?: string
      general?: string
    }
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
    passwordConfirm?: string
    general?: string
  } = {}

  if (!username || username.length < 5) {
    errors.username = "Username must be at least 5 characters long"
  }

  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match"
  }

  if (Object.keys(errors).length > 0) {
    return { errors, success: false }
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    await db.insert(users).values({ username, name, passwordHash })

    return { errors: {}, success: true }
  } catch {
    return {
      errors: { general: "Registration failed" },
      success: false,
    }
  }
}

export const generateToken = async (
  prevState: {
    token: string | null
    error?: string
  },
) => {
  const session = await auth()

  if (!session?.user?.email) {
    return {
      token: prevState.token,
      error: "Not authenticated",
    }
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, session.user.email),
  })

  if (!user) {
    return {
      token: prevState.token,
      error: "User not found",
    }
  }

  const token = crypto.randomUUID()

  await db
    .update(users)
    .set({ token })
    .where(eq(users.id, user.id))

  revalidatePath("/me")

  return {
    token,
    error: "",
  }
}
