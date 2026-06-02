import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"

export const GET = async (req: NextRequest) => {
  const authorization = req.headers.get("authorization")

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = authorization.replace("Bearer ", "").trim()

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.token, token),
    with: {
      blogs: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    name: user.name,
    createdBlogs: user.blogs.map((blog) => ({
      author: blog.author,
      title: blog.title,
      url: blog.url,
    })),
  })
}
//In Power Shell: curl.exe http://localhost:3000/api/me -H "Authorization: Bearer <my current token>"
