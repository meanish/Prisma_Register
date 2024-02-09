import { getServerSession } from 'next-auth'
import { authOptions } from '../route'
import User from './components/user'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <section>
      <Link href="/register">Register</Link>
      <Link href="/login">Login</Link>
      <h1>Home</h1>
      <h1>Server Side Rendered</h1>
      <pre>{JSON.stringify(session)}</pre>
      <h1>Client Side Rendered</h1>
      <User />
    </section>
  )
}
