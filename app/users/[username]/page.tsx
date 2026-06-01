import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserWithBlogs } from "../../services/users"

export const dynamic = "force-dynamic"

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>
}) => {
  const { username } = await params
  const user = await getUserWithBlogs(username)

  if (!user) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
      <p className="text-gray-500 mb-4">Username: {user.username}</p>

      <h3 className="text-xl font-semibold mb-2">Blogs</h3>

      <ul className="space-y-2">
        {user.blogs.map((blog) => (
          <li key={blog.id} className="border rounded p-3 hover:bg-gray-50">
            <Link
              href={`/blogs/${blog.id}`}
              className="text-blue-600 hover:underline"
            >
              {blog.title}
            </Link>
            <span className="text-gray-600">
              {" "}by {blog.author}, likes {blog.likes}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserPage