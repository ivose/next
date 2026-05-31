"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { addBlog, likeBlog } from "../services/blogs"
import { auth } from "../../auth"

export const createBlog = async (
  prevState: {
    errors: {
      title?: string
      author?: string
      url?: string
    }
    title: string
    author: string
    url: string
  },
  formData: FormData,
) => {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const title = (formData.get("title") as string)?.trim()
  const author = (formData.get("author") as string)?.trim()
  const url = (formData.get("url") as string)?.trim()

  const errors: {
    title?: string
    author?: string
    url?: string
  } = {}

  if (!title || title.length < 5) {
    errors.title = "Title must be at least 5 characters long"
  }

  if (!author || author.length < 5) {
    errors.author = "Author must be at least 5 characters long"
  }

  if (!url || url.length < 5) {
    errors.url = "URL must be at least 5 characters long"
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      title,
      author,
      url,
    }
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