import { notFound } from "next/navigation"
import { getBlogById, isBlogInReadingList } from "../../services/blogs"
import { getCurrentUser } from "../../services/session"
import { incrementBlogLikes } from "../../actions/blogs"

export const dynamic = "force-dynamic"

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const blog = await getBlogById(Number(id))
  const currentUser = await getCurrentUser()

  if (!blog) {
    notFound()
  }

  const isLoggedIn = Boolean(currentUser)
  const isOwnBlog = currentUser?.id === blog.userId
  const alreadyInReadingList = currentUser
    ? await isBlogInReadingList(currentUser.id, blog.id)
    : false
  const showAddToReadingListButton =
    isLoggedIn && !isOwnBlog && !alreadyInReadingList

  return (
    <div data-testid="blog-detail" className="max-w-2xl mx-auto p-6">
      <h2 data-testid="blog-title" className="text-2xl font-bold mb-2">{blog.title}</h2>

      <p data-testid="blog-author" className="text-gray-500 mb-4">by {blog.author}</p>
      <p className="text-gray-500 mb-4">added by {blog.user.name}</p>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-xl">likes: {blog.likes}</span>

        <form action={incrementBlogLikes}>
          <input type="hidden" name="id" value={blog.id} />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            like
          </button>
        </form>


        {showAddToReadingListButton && (
          <form action="/api/reading-list/add" method="post">
            <input type="hidden" name="blogId" value={blog.id} />
            <button
              data-testid="add-to-reading-list-button"
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              add to reading list
            </button>
          </form>
        )}

        {currentUser && !isOwnBlog && alreadyInReadingList && (
          <span className="text-green-600 font-semibold">
            in reading list
          </span>
        )}
      </div>

      <p>
        <a
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {blog.url}
        </a>
      </p>
    </div>
  )
}

export default BlogPage