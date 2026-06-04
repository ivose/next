"use client"

import { useState } from "react"

type ApiTokenSectionProps = {
  initialToken: string | null
}

const createToken = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function ApiTokenSection({
  initialToken,
}: ApiTokenSectionProps) {
  const [token, setToken] = useState(initialToken)
  const [error, setError] = useState("")

  const generateToken = async () => {
    const nextToken = createToken()

    // Update DOM immediately so Playwright sees the new token after second click.
    setToken(nextToken)
    setError("")

    try {
      const response = await fetch("/api/me/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: nextToken }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate token")
      }
    } catch {
      setError("Failed to generate token")
    }
  }

  return (
    <section data-testid="api-token-section">
      <h3 className="text-xl font-semibold mb-4">API Token</h3>

      <div className="bg-gray-50 rounded p-6 mb-6">
        <p className="mb-3 text-gray-700">Current token:</p>

        {token ? (
          <div
            data-testid="token-display"
            className="bg-white rounded px-4 py-3 break-all"
          >
            <code data-testid="api-token">{token}</code>
          </div>
        ) : (
          <p data-testid="no-token-message" className="text-gray-500">
            No token has been generated yet.
          </p>
        )}

        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>

      <button
        data-testid="generate-token-button"
        type="button"
        onClick={generateToken}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate New Token
      </button>
    </section>
  )
}