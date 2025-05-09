'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Navbar from './../components/Navbar'
import { useEffect } from 'react'

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session && pathname !== '/login') {
      router.push('/login')
      return
    }

    if (session && (pathname === '/login' || pathname === '/')) {
      router.push('/employees')
      return
    }
  }, [session, status, pathname, router])

  if (status === 'loading') return null

  return (
    <div className="flex">
      {session && pathname !== '/login' && <Navbar />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
