'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardPanel } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useClientStorage } from '@/lib/hooks/useClientStorage'
import { questionsAPI } from '@/lib/api'

interface LoginResponse {
  success?: boolean;
  message?: string;
  token?: string;
  error?: string;
}

export default function AdminLoginClient() {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const [authToken, setAuthToken] = useClientStorage<string | null>('adminAuth', null)

  useEffect(() => {
    if (authToken) {
      router.push('/admin/dashboard')
    }
  }, [authToken, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response: LoginResponse = await questionsAPI.admin.login(password)

      if (response.success && response.token) {
        setAuthToken(response.token)
      } else {
        setError(response.error || 'Login failed')
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      setError(axiosError.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Access the admin dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your admin password to continue</CardDescription>
          </CardHeader>
          <CardPanel>
            <Form onSubmit={handleSubmit} className="space-y-4">
              <Field>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>

              {error && (
                <Alert variant="error">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !password}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          </CardPanel>
        </Card>
      </div>
    </div>
  )
}