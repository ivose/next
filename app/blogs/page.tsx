import Link from "next/link"
import { getBlogs } from "../services/blogs"

export const dynamic = "force-dynamic"

const Blogs = () => {
  const blogs = getBlogs()

  return (
    <div>
      <h2>blogs</h2>
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