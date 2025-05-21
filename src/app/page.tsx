'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Navbar from './../components/Navbar'
import { useEffect, useState } from 'react'

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    setLoading(false)

    if (!session && pathname !== '/login') {
      router.push('/login')
      return
    }

    if (session && (pathname === '/login' || pathname === '/')) {
      router.push('/employees')
      return
    }
  }, [session, status, pathname, router])

  if (loading) return <div className='spinner'></div> 

  return (
    <div className="flex">
      {session && pathname !== '/login' && <Navbar />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
