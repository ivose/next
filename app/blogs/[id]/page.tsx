import { notFound } from "next/navigation"
import { getBlogById } from "../../services/blogs"
import { incrementBlogLikes } from "../../actions/blogs"

export const dynamic = "force-dynamic"

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const blog = await getBlogById(Number(id))

  if (!blog) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>

      <p className="text-gray-500 mb-2">Author: {blog.author}</p>

      <p className="mb-2">
        URL:{" "}
        <a
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {blog.url}
        </a>
      </p>

      <p className="mb-4 font-semibold">Likes: {blog.likes}</p>

      <form action={incrementBlogLikes}>
        <input type="hidden" name="id" value={blog.id} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Like
        </button>
      </form>
    </div>
  )
}

export default BlogPage