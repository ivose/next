"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createBlog } from "@/app/actions/blogs"
import { useNotification } from "@/app/components/NotificationContext"

const NewBlog = () => {
  const [state, formAction] = useActionState(createBlog, {
    errors: {},
    title: "",
    author: "",
    url: "",
    success: false,
  })

  const router = useRouter()
  const { showNotification } = useNotification()
  const successHandled = useRef(false)

  useEffect(() => {
    if (state.success && !successHandled.current) {
      successHandled.current = true
      showNotification("blog created")
      router.push("/blogs")
    }
  }, [state.success, showNotification, router])

  return (
    <div>
      <h2>Create a new blog</h2>

      <form action={formAction}>
        <div>
          <label>
            Title
            <input type="text" name="title" defaultValue={state.title} />
          </label>
          {state.errors.title && (
            <p style={{ color: "red" }}>{state.errors.title}</p>
          )}
        </div>

        <div>
          <label>
            Author
            <input type="text" name="author" defaultValue={state.author} />
          </label>
          {state.errors.author && (
            <p style={{ color: "red" }}>{state.errors.author}</p>
          )}
        </div>

        <div>
          <label>
            URL
            <input type="text" name="url" defaultValue={state.url} />
          </label>
          {state.errors.url && (
            <p style={{ color: "red" }}>{state.errors.url}</p>
          )}
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlog