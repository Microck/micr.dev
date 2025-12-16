import { redirect } from 'next/navigation'
import { auth0, isAllowedUser } from '@/lib/auth0'
import AdminDashboardClient from '@/components/AdminDashboardClient'

export default async function AdminDashboard() {
  const session = await auth0.getSession()
  
  if (!session) {
    redirect('/auth/login?returnTo=/admin/dashboard')
  }
  
  if (!isAllowedUser(session.user.email)) {
    redirect('/auth/logout')
  }
  
  return <AdminDashboardClient />
}
