import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth0'

export default async function AdminLoginPage() {
  const session = await auth0.getSession()
  
  if (session) {
    redirect('/admin/dashboard')
  }
  
  redirect('https://anonqmicr.netlify.app/anonq/auth/login?returnTo=/admin/dashboard')
}
