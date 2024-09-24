'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

const Header = () => {
  const { data: session, status } = useSession()

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Esport Job Board
        </Link>
        <nav>
          <Link href="/jobs" className="mr-4 hover:text-gray-300">Jobs</Link>
          {status === 'loading' ? (
            <span>Loading...</span>
          ) : session ? (
            <div>
              {session.user.role === 'EMPLOYER' && (
                <Link href="/employer/dashboard" className="mr-4 hover:text-gray-300">Dashboard</Link>
              )}
              <span className="mr-4">Welcome, {session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              <Link href="/auth/signin" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
                Sign In
              </Link>
              <Link href="/auth/register" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header