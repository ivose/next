import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/db"
import { users } from "@/db/schema"

export const POST = async (req: NextRequest) => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 },
    )
  }

  const body = await req.json()

  const username = body.username?.trim()
  const name = body.name?.trim()
  const password = body.password

  if (!username || !name || !password) {
    return NextResponse.json(
      { error: "username, name and password are required" },
      { status: 400 },
    )
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [user] = await db
    .insert(users)
    .values({
      username,
      name,
      passwordHash,
    })
    .returning({
      id: users.id,
      username: users.username,
      name: users.name,
    })

  return NextResponse.json(user, { status: 201 })
}


/*
with Windows PowerShell

$body = @{
  username = "testuser"
  name = "Test User"
  password = "testpass123"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/testing/users" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

*/