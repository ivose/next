import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "../services/session"
import { getReadingListByUserId } from "../services/blogs"
import { generateToken } from "../actions/users"
import { markAsRead } from "../actions/blogs"

export const dynamic = "force-dynamic"

const MePage = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const readingList = await getReadingListByUserId(user.id)
  const unreadBlogs = readingList.filter((item) => !item.read)
  const readBlogs = readingList.filter((item) => item.read)

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="space-y-4 mb-8">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
      </div>

      <hr className="mb-8" />

      <h3 className="text-xl font-semibold mb-4">Reading List</h3>

      {readingList.length === 0 ? (
        <p className="text-gray-500">Your reading list is empty.</p>
      ) : (
        <div className="space-y-8">
          <section>
            <h4 className="text-lg font-semibold mb-3">
              Unread ({unreadBlogs.length})
            </h4>

            {unreadBlogs.length === 0 ? (
              <p className="text-gray-500">No unread blogs.</p>
            ) : (
              <ul className="space-y-3">
                {unreadBlogs.map((item) => (
                  <li
                    key={item.id}
                    className="bg-yellow-50 rounded p-4 flex items-center justify-between gap-4"
                  >
                    <Link
                      href={`/blogs/${item.blog.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {item.blog.title}
                    </Link>

                    <form action={markAsRead}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        mark as read
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-3">
              Read ({readBlogs.length})
            </h4>

            {readBlogs.length === 0 ? (
              <p className="text-gray-500">No read blogs.</p>
            ) : (
              <ul className="space-y-3">
                {readBlogs.map((item) => (
                  <li
                    key={item.id}
                    className="bg-green-50 rounded p-4"
                  >
                    <Link
                      href={`/blogs/${item.blog.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {item.blog.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}


      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-4">API Token</h3>

      <div className="bg-gray-50 rounded p-6 mb-6">
        <p className="mb-3 text-gray-700">Current token:</p>

        {user.token ? (
          <div className="bg-white rounded px-4 py-3">{user.token}</div>
        ) : (
          <p className="text-gray-500">No token has been generated yet.</p>
        )}
      </div>

      <form action={generateToken} className="mb-8">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate New Token
        </button>
      </form>
    </div>
  )
}

export default MePage