import Link from "next/link"
import { getBlogs } from "../services/blogs"

export const dynamic = "force-dynamic"

const Blogs = async ({searchParams}: { searchParams: Promise<{ filter?: string }>}) => {
  const { filter } = await searchParams

  const blogs = [...getBlogs()]
    .filter(blog =>
      filter
        ? blog.title.toLowerCase().includes(filter.toLowerCase())
        : true
    )
    .sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>

      <form action="/blogs">
        <input
          type="text"
          name="filter"
          defaultValue={filter}
          placeholder="search by title"
        />
        <button type="submit">search</button>
      </form>

      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
            {" "} by {blog.author}, likes {blog.likes}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs