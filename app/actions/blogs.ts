"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { addBlog, likeBlog } from "../services/blogs"
import { auth } from "../../auth"

export const createBlog = async (
  prevState: { error: string },
  formData: FormData,
) => {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const title = (formData.get("title") as string)?.trim()
  const author = (formData.get("author") as string)?.trim()
  const url = (formData.get("url") as string)?.trim()

  if (!title || title.length < 5) {
    return { error: "Title must be at least 5 characters long" }
  }

  if (!author || author.length < 5) {
    return { error: "Author must be at least 5 characters long" }
  }

  if (!url || url.length < 5) {
    return { error: "URL must be at least 5 characters long" }
  }

  await addBlog(title, author, url)

  revalidatePath("/blogs")
  redirect("/blogs")
}

export const incrementBlogLikes = async (formData: FormData) => {
  const id = Number(formData.get("id"))

  await likeBlog(id)

  revalidatePath("/blogs")
  revalidatePath(`/blogs/${id}`)
}