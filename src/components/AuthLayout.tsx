'use client'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import Navbar from './Navbar' // Путь к Navbar

export default function AuthLayout({ children }: { children: ReactNode }) {
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
      <html lang="en">
        <body className="flex justify-center items-center h-screen bg-gray-100">
          <div className="spinner"></div>
        </body>
      </html>
    )
  }

  return (
    <div className="flex">
      {session && pathname !== '/login' && <Navbar />}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
