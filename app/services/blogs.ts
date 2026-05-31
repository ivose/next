import { eq, ilike, desc, sql } from "drizzle-orm"
import { db } from "../../db"
import { blogs, users } from "../../db/schema"

export const getBlogs = async (filter?: string) => {
  if (filter) {
    return db
      .select()
      .from(blogs)
      .where(ilike(blogs.title, `%${filter}%`))
      .orderBy(desc(blogs.likes))
  }

  return db
    .select()
    .from(blogs)
    .orderBy(desc(blogs.likes))
}

export const addBlog = async (title: string, author: string, url: string) => {
  const userResult = await db
    .select()
    .from(users)
    .orderBy(sql`RANDOM()`)
    .limit(1)

  const user = userResult[0]

  if (!user) {
    throw new Error("No users found")
  }

  await db.insert(blogs).values({
    title,
    author,
    url,
    likes: 0,
    userId: user.id,
  })
}

export const getBlogById = async (id: number) => {
  const result = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, id))

  return result[0]
}

export const likeBlog = async (id: number) => {
  const blog = await getBlogById(id)

  if (blog) {
    await db
      .update(blogs)
      .set({ likes: blog.likes + 1 })
      .where(eq(blogs.id, id))
  }
}