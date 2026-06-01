import Link from "next/link"
import { getUsers } from "../services/users"

export const dynamic = "force-dynamic"

const Users = async () => {
  const users = await getUsers()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border rounded p-3 hover:bg-gray-50">
            <Link
              href={`/users/${user.username}`}
              className="text-blue-600 hover:underline"
            >
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users