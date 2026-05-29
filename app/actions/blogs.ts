"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { addBlog } from "../services/blogs"

export const createBlog = async (formData: FormData) => {
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const url = formData.get("url") as string

  addBlog(title, author, url)

  revalidatePath("/blogs")
  redirect("/blogs")
}