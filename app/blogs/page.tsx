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
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.title}
            </a>{" "} by {blog.author}, likes {blog.likes}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs