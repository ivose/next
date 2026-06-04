import Link from "next/link"
import { getBlogs } from "../services/blogs"

export const dynamic = "force-dynamic"

const Blogs = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) => {
  const { filter } = await searchParams
  const blogs = await getBlogs(filter)

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>

      <form action="/blogs" className="mb-4 flex gap-2">
        <input
          data-testid="filter-input"
          type="text"
          name="filter"
          defaultValue={filter}
          placeholder="search by title"
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          data-testid="search-button"
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          search
        </button>
      </form>

      <ul data-testid="blogs-list" className="space-y-2">
        {blogs.map((blog) => (
          <li key={blog.id} className="border rounded p-3 hover:bg-gray-50">
            <Link
              href={`/blogs/${blog.id}`}
              className="text-blue-600 hover:underline"
            >
              {blog.title}
            </Link>
            <span className="text-gray-600">
              {" "}by {blog.author}, {blog.likes} likes
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs