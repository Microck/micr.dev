import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth0'

export default async function AdminLoginPage() {
  const session = await auth0.getSession()

  if (session) {
    redirect('/admin/dashboard')
  }

  redirect('/auth/login?returnTo=/admin/dashboard')
}
