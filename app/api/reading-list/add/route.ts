import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { blogs, readingList, users } from "@/db/schema"

export const POST = async (req: NextRequest) => {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const blogId = Number(formData.get("blogId"))

  if (!blogId) {
    return NextResponse.json({ error: "Missing blog id" }, { status: 400 })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, session.user.email),
    columns: {
      id: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const blog = await db.query.blogs.findFirst({
    where: eq(blogs.id, blogId),
    columns: {
      id: true,
      userId: true,
    },
  })

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 })
  }

  // User should not add their own blog.
  if (blog.userId === user.id) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const existing = await db.query.readingList.findFirst({
    where: and(
      eq(readingList.userId, user.id),
      eq(readingList.blogId, blogId),
    ),
    columns: {
      id: true,
    },
  })

  if (!existing) {
    await db.insert(readingList).values({
      userId: user.id,
      blogId,
      read: false,
    })
  }

  revalidatePath("/me")
  revalidatePath(`/blogs/${blogId}`)

  return NextResponse.json({ ok: true }, { status: 200 })
}