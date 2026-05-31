"use client"

import { useActionState } from "react"
import { registerUser } from "@/app/actions/users"

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, {
    errors: {},
    username: "",
    name: "",
  })

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
            <input
              type="text"
              name="name"
              defaultValue={state.name}
            />
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