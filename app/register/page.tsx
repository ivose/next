"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/app/actions/users"
import { useNotification } from "@/app/components/NotificationContext"

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, {
    errors: {},
    username: "",
    name: "",
    success: false,
  })

  const router = useRouter()
  const { showNotification } = useNotification()
  const successHandled = useRef(false)

  useEffect(() => {
    if (state.success && !successHandled.current) {
      successHandled.current = true
      showNotification("registered successfully")
      router.push("/login")
    }
  }, [state.success, showNotification, router])

  return (
    <div>
      <h2>Register</h2>

      <form action={formAction}>
        <div>
          <label>
            Username
            <input
              type="text"
              name="username"
              defaultValue={state.username}
            />
          </label>
          {state.errors.username && (
            <p style={{ color: "red" }}>{state.errors.username}</p>
          )}
        </div>

        <div>
          <label>
            Name
            <input type="text" name="name" defaultValue={state.name} />
          </label>
        </div>

        <div>
          <label>
            Password
            <input type="password" name="password" />
          </label>
          {state.errors.password && (
            <p style={{ color: "red" }}>{state.errors.password}</p>
          )}
        </div>

        <div>
          <label>
            Confirm password
            <input type="password" name="passwordConfirm" />
          </label>
          {state.errors.passwordConfirm && (
            <p style={{ color: "red" }}>
              {state.errors.passwordConfirm}
            </p>
          )}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  )
}