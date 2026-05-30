type Blog = {
  id: number
  title: string
  author: string
  url: string
  likes: number
}

const initialBlogs: Blog[] = [
  { id: 1, title: "Otsikko 1", author: "A1", url: "https://cs.ut.ee", likes: 4 },
  { id: 2, title: "Otsikko 2", author: "A2", url: "https://quretec.com", likes: 1 },
  { id: 3, title: "Otsikko 3", author: "A3", url: "https://www.helsinki.fi/fi", likes: 2 },
  { id: 4, title: "Otsikko 4", author: "A4", url: "https://delta.ut.ee", likes: 2 },
]

const globalForBlogs = globalThis as unknown as {
  blogs: Blog[] | undefined
  nextBlogId: number | undefined
}

if (!globalForBlogs.blogs) {
  globalForBlogs.blogs = initialBlogs
  globalForBlogs.nextBlogId = Math.max(...initialBlogs.map(blog => blog.id)) + 1
}

const blogs = globalForBlogs.blogs

export const getBlogs = () => {
  return blogs
}

export const addBlog = (title: string, author: string, url: string) => {
  blogs.push({
    id: globalForBlogs.nextBlogId!,
    title,
    author,
    url,
    likes: 0,
  })

  globalForBlogs.nextBlogId! += 1
}

export const getBlogById = (id: number) => {
  return blogs.find(blog => blog.id === id)
}

export const likeBlog = (id: number) => {
  const blog = blogs.find(blog => blog.id === id)

  if (blog) {
    blog.likes += 1
  }
}