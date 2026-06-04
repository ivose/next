import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "../services/session"
import { getReadingListByUserId } from "../services/blogs"
import { generateToken } from "../actions/users"
import { markAsRead } from "../actions/blogs"
import ApiTokenSection from "../components/ApiTokenSection"

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

      <div data-testid="user-profile" className="space-y-4 mb-8">
        <p data-testid="user-name">
          <strong>Name:</strong> {user.name}
        </p>

        <p data-testid="user-username">
          <strong>Username:</strong> {user.username}
        </p>
      </div>

      <hr className="mb-8" />

      <section data-testid="reading-list-section">
        <h3 className="text-xl font-semibold mb-4">Reading List</h3>

        {readingList.length === 0 ? (
          <p data-testid="empty-reading-list" className="text-gray-500">
            Your reading list is empty.
          </p>
        ) : (
          <div className="space-y-8">
            <section data-testid="unread-section">
              <h4 className="text-lg font-semibold mb-3">
                Unread ({unreadBlogs.length})
              </h4>

              {unreadBlogs.length === 0 ? (
                <p data-testid="no-unread-blogs" className="text-gray-500">
                  No unread blogs.
                </p>
              ) : (
                <ul className="space-y-3">
                  {unreadBlogs.map((item) => (
                    <li
                      key={item.id}
                      data-testid={`reading-list-item-${item.id}`}
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
                          data-testid={`mark-read-${item.id}`}
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

            <section data-testid="read-section">
              <h4 className="text-lg font-semibold mb-3">
                Read ({readBlogs.length})
              </h4>

              {readBlogs.length === 0 ? (
                <p data-testid="no-read-blogs" className="text-gray-500">
                  No read blogs.
                </p>
              ) : (
                <ul className="space-y-3">
                  {readBlogs.map((item) => (
                    <li
                      key={item.id}
                      data-testid={`read-blog-${item.id}`}
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
      </section>

      <hr className="my-8" />

      <ApiTokenSection initialToken={user.token} />
    </div>
  )
}

export default MePage