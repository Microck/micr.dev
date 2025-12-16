import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted mb-8">Page not found</p>
      <Link href="/" className="btn btn-primary">
        Go back home
      </Link>
    </div>
  )
}
