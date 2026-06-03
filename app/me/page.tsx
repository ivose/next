import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "../services/session"
import { getReadingListByUserId } from "../services/blogs"
import { generateToken } from "../actions/users"

export const dynamic = "force-dynamic"

const MePage = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const readingList = await getReadingListByUserId(user.id)

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

      <hr className="mb-8" />

      <h3 className="text-xl font-semibold mb-4">Reading List</h3>

      {readingList.length === 0 ? (
        <p className="text-gray-500">Your reading list is empty.</p>
      ) : (
        <ul className="space-y-2">
          {readingList.map((item) => (
            <li key={item.id} className="border rounded p-3 hover:bg-gray-50">
              <Link
                href={`/blogs/${item.blog.id}`}
                className="text-blue-600 hover:underline"
              >
                {item.blog.title}
              </Link>
              <span className="text-gray-600">
                {" "}by {item.blog.author}
              </span>
              {item.read && (
                <strong className="ml-2 text-green-600">(read)</strong>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MePage