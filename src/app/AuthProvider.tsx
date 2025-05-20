'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import Navbar from './../components/Navbar'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/login') {
      router.push('/login')
    }
  }, [status, pathname, router])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="flex">
      {session && pathname !== '/login'}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
