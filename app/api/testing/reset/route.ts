import { NextResponse } from "next/server"
import { db } from "@/db"
import { blogs, readingList, users } from "@/db/schema"

export const DELETE = async () => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 },
    )
  }

  await db.delete(readingList)
  await db.delete(blogs)
  await db.delete(users)

  return NextResponse.json({ message: "database reset" })
}
// Usage: curl.exe -X DELETE http://localhost:3000/api/testing/reset