'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Navbar from './../components/Navbar'
<<<<<<< HEAD
import { useEffect, useState } from 'react'
=======
import { useEffect } from 'react'
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

<<<<<<< HEAD
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    setLoading(false)
=======
  useEffect(() => {
    if (status === 'loading') return
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297

    if (!session && pathname !== '/login') {
      router.push('/login')
      return
    }

    if (session && (pathname === '/login' || pathname === '/')) {
      router.push('/employees')
      return
    }
  }, [session, status, pathname, router])

<<<<<<< HEAD
  if (loading) return <div className='spinner'></div> 
=======
  if (status === 'loading') return null
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297

  return (
    <div className="flex">
      {session && pathname !== '/login' && <Navbar />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
