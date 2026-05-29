const blogs = [
  { id: 1, title: "Otsikko 1", author: "A1", url: "https://cs.ut.ee", likes: 4 },
  { id: 2, title: "Otsikko 2", author: "A2", url: "https://quretec.com", likes: 1 },
  { id: 3, title: "Otsikko 3", author: "A3", url: "https://www.helsinki.fi/fi", likes: 2 },
  { id: 4, title: "Otsikko 4", author: "A4", url: "https://delta.ut.ee", likes: 2 },
]

let nextId = Math.max(...blogs.map(blog => blog.id)) + 1

export const getBlogs = () => {
  return blogs
}

export const addBlog = (title: string, author: string, url: string) => {
  blogs.push({ id: nextId++, title, author, url, likes: 0 })
}