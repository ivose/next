"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "../actions/users"
import { useNotification } from "../components/NotificationContext"
import FormField from "../components/FormField"

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, {
    error: "",
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
        <FormField label="Name" name="name" required />
        <FormField label="Password" name="password" type="password" required />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
        {state.error && <p className="text-red-600">{state.error}</p>}
      </form>
    </div>
  )
}
