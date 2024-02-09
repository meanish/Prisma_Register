'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useEffect } from 'react'


const dashboard = () => {
  const { data: session } = useSession()

  const router = useRouter()


  useEffect(() => {
    if (!session?.status === 'authenticated') {
      router.push('/login')
    }
  })
  return (
    <div>
      <Link href="/register">Register</Link>
      <Link href="/login">Login</Link>
      <h1>Dashboard</h1>
      <p>Hi {session?.user?.email}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

export default dashboard