"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBlog } from "@/app/actions/blogs"
import { useNotification } from "@/app/components/NotificationContext"
import FormField from "@/app/components/FormField"

const NewBlog = () => {
  const [state, formAction] = useActionState(createBlog, {
    errors: {},
    title: "",
    author: "",
    url: "",
    success: false,
  })

  const { showNotification } = useNotification()
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      showNotification("blog created")
      router.push("/blogs")
    }
  }, [state, showNotification, router])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create a new blog</h2>

      <form action={formAction} className="space-y-4">
        <FormField label="Title" name="title" defaultValue={state.title} />
        {state.errors.title && (
          <p className="text-red-600">{state.errors.title}</p>
        )}

        <FormField label="Author" name="author" defaultValue={state.author} />
        {state.errors.author && (
          <p className="text-red-600">{state.errors.author}</p>
        )}

        <FormField label="URL" name="url" defaultValue={state.url} />
        {state.errors.url && (
          <p className="text-red-600">{state.errors.url}</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default NewBlog