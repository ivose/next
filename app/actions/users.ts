"use server"

import bcrypt from "bcryptjs"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

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

export const generateToken = async () => {

  const session = await auth()

  if (!session?.user?.email) {
    return
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, session.user.email),
  })

  if (!user) {
    return
  }

  const token = crypto.randomUUID()

  await db
    .update(users)
    .set({ token })
    .where(eq(users.id, user.id))

  revalidatePath("/me")
}
