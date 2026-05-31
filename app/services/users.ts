import { eq } from "drizzle-orm"
import { db } from "../../db"
import { users, blogs } from "../../db/schema"

export const getUsers = async () => {
  return db.select().from(users)
}

export const getUserById = async (id: number) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))

  return result[0]
}

export const getBlogsByUserId = async (userId: number) => {
  return db
    .select()
    .from(blogs)
    .where(eq(blogs.userId, userId))
}