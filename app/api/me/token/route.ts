import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema"

export const POST = async (req: NextRequest) => {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, session.user.email),
  })

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { token?: string } = {}

  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const token =
    typeof body.token === "string" && body.token.trim().length > 10
      ? body.token.trim()
      : crypto.randomUUID()

  await db
    .update(users)
    .set({ token })
    .where(eq(users.id, user.id))

  revalidatePath("/me")

  return NextResponse.json({ token }, { status: 200 })
}