import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const username = credentials?.username as string | undefined
        const password = credentials?.password as string | undefined

        if (!username || !password) {
          return null
        }

        const user = await db.query.users.findFirst({
          where: eq(users.username, username),
        })

        if (!user) {
          return null
        }

        const passwordCorrect = await bcrypt.compare(
          password,
          user.passwordHash,
        )

        if (!passwordCorrect) {
          return null
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.username,
        }
      },
    }),
  ],

  logger: {
    error(error) {
      const authError = error as {
        name?: string
        type?: string
        code?: string
      }

      if (
        authError.name === "CredentialsSignin" ||
        authError.type === "CredentialsSignin" ||
        authError.code === "credentials"
      ) {
        return
      }

      console.error(error)
    },
  },
})