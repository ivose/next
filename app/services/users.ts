import { eq } from "drizzle-orm"
import { db } from "../../db"
import { users, blogs } from "../../db/schema"

export const getUsers = async () => {
  return db.select().from(users)
}

export const getUserWithBlogs = async (username: string) => {
  return db.query.users.findFirst({
    where: eq(users.username, username),
    with: { blogs: true },
  })
}