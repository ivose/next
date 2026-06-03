import { eq, ilike, desc, and } from "drizzle-orm"
import { db } from "../../db"
import { blogs, readingList } from "../../db/schema"
import { getCurrentUser } from "./session"

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
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Not logged in")
  }

  const [blog] = await db
    .insert(blogs)
    .values({
      title,
      author,
      url,
      likes: 0,
      userId: user.id,
    })
    .returning()

  if (!blog) {
    throw new Error("Blog was not created")
  }

  await db.insert(readingList).values({
    userId: user.id,
    blogId: blog.id,
    read: false,
  })
}

export const getBlogById = async (id: number) => {
  return db.query.blogs.findFirst({
    where: eq(blogs.id, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  })
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

export const isBlogInReadingList = async (userId: number, blogId: number) => {
  const result = await db.query.readingList.findFirst({
    where: and(
      eq(readingList.userId, userId),
      eq(readingList.blogId, blogId),
    ),
  })

  return Boolean(result)
}

export const addBlogToReadingList = async (blogId: number) => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not logged in")
  }

  const blog = await getBlogById(blogId)

  if (!blog) {
    throw new Error("Blog not found")
  }

  if (blog.userId === user.id) {
    return
  }

  const existing = await db.query.readingList.findFirst({
    where: and(
      eq(readingList.userId, user.id),
      eq(readingList.blogId, blogId),
    ),
  })

  if (existing) {
    return
  }

  await db.insert(readingList).values({
    userId: user.id,
    blogId,
    read: false,
  })
}

export const getReadingListByUserId = async (userId: number) => {
  return db.query.readingList.findMany({
    where: eq(readingList.userId, userId),
    with: {
      blog: true,
    },
  })
}

export const markReadingListItemAsRead = async (readingListItemId: number) => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not logged in")
  }

  await db
    .update(readingList)
    .set({ read: true })
    .where(
      and(
        eq(readingList.id, readingListItemId),
        eq(readingList.userId, user.id),
      ),
    )
}