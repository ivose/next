"use client"

import { useActionState } from "react"
import { createBlog } from "@/app/actions/blogs"

const NewBlog = () => {
  const [state, formAction] = useActionState(createBlog, { error: "" })

  return (
    <div>
      <h2>Create a new blog</h2>

      <form action={formAction}>
        <div>
          <label>
            Title
            <input type="text" name="title" />
          </label>
        </div>

        <div>
          <label>
            Author
            <input type="text" name="author" />
          </label>
        </div>

        <div>
          <label>
            URL
            <input type="text" name="url" />
          </label>
        </div>

        <button type="submit">Create</button>
        {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      </form>
    </div>
  )
}

export default NewBlog