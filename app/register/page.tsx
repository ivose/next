"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "../actions/users"
import { useNotification } from "../components/NotificationContext"
import FormField from "../components/FormField"

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, {
    errors: {},
    success: false,
  })

  const { showNotification } = useNotification()
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      showNotification("registered successfully")
      router.push("/login")
    }
  }, [state, showNotification, router])

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form action={formAction} className="space-y-4">
        <FormField label="Username" name="username" required />
        {state.errors.username && (
          <p data-testid="username-error" className="text-red-600">
            {state.errors.username}
          </p>
        )}

        <FormField label="Name" name="name" required />
        <FormField label="Password" name="password" type="password" required />
        <FormField
          label="Confirm Password"
          name="passwordConfirm"
          type="password"
          required
        />

        {state.errors.passwordConfirm && (
          <p data-testid="passwordConfirm-error" className="text-red-600">
            {state.errors.passwordConfirm}
          </p>
        )}

        {state.errors.general && (
          <p className="text-red-600">{state.errors.general}</p>
        )}

        <button
          data-testid="register-button"
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  )
}