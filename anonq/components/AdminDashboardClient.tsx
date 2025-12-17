'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription, AlertAction } from '@/components/ui/alert'
import { Form } from '@/components/ui/form'
import { Field } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { questionsAPI } from '@/lib/api'

interface Question {
  id: string
  content: string
  timestamp: string
  answered: boolean
}

interface AnsweredQuestion {
  question: Question
  answer: {
    id: string
    content: string
    timestamp: string
  }
}

export default function AdminDashboardClient() {
  const { user } = useUser()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [answerContent, setAnswerContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadQuestions = useCallback(async () => {
    setError(null)
    try {
      const data = await questionsAPI.admin.getQuestions()
      setQuestions(data.questions || [])
      setAnsweredQuestions(data.answered || [])
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number; data?: { error?: string } } }
      if (axiosError.response?.status === 401) {
        window.location.href = '/auth/login?returnTo=/admin/dashboard'
        return
      }
      setError(axiosError.response?.data?.error || 'Failed to load questions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this question?')) return
    setIsDeleting(id)
    try {
      await questionsAPI.admin.deleteQuestion(id)
      if (selectedQuestion === id) {
        setSelectedQuestion(null)
        setAnswerContent('')
      }
      loadQuestions()
    } catch {
      setError('Failed to delete question')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedQuestion || !answerContent.trim()) {
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await questionsAPI.admin.postAnswer(selectedQuestion, answerContent.trim())
      setSelectedQuestion(null)
      setAnswerContent('')
      loadQuestions()
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number; data?: { error?: string } } }
      if (axiosError.response?.status === 401) {
        window.location.href = '/auth/login?returnTo=/admin/dashboard'
        return
      }
      setError(axiosError.response?.data?.error || 'Failed to submit answer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    window.location.href = '/auth/logout'
  }

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestion(questionId)
  }

  const handleQuestionKeyDown = (e: React.KeyboardEvent, questionId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSelectedQuestion(questionId)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const unansweredQuestions = questions.filter(q => !q.answered)

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            {user?.name || user?.email || 'Admin'}
          </p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <AlertAction>
            <Button variant="secondary" size="sm" onClick={loadQuestions}>
              Retry
            </Button>
          </AlertAction>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Unanswered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unansweredQuestions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Answered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{answeredQuestions.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Unanswered Questions</CardTitle>
            <CardDescription>Click to answer a question</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center space-x-2">
                  <Spinner className="size-4" />
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              </div>
            ) : unansweredQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No unanswered questions
              </div>
            ) : (
              <div className="space-y-3">
                {unansweredQuestions.map((question) => (
                  <Card
                    key={question.id}
                    className={`transition-colors ${
                      selectedQuestion === question.id ? 'bg-accent border-accent-foreground' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleQuestionSelect(question.id)}
                        onKeyDown={(e) => handleQuestionKeyDown(e, question.id)}
                        className="cursor-pointer"
                      >
                        <p className="text-sm line-clamp-3">{question.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(question.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="secondary">New</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => { e.stopPropagation(); handleDelete(question.id) }}
                          disabled={isDeleting === question.id}
                          className="text-destructive hover:text-destructive"
                        >
                          {isDeleting === question.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Answer Question</CardTitle>
            <CardDescription>
              {selectedQuestion ? 'Provide your answer below' : 'Select a question to answer'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedQuestion ? (
              <Form onSubmit={handleAnswerSubmit} className="space-y-4">
                <Field>
                  <Label>Question</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {questions.find(q => q.id === selectedQuestion)?.content}
                  </div>
                </Field>

                <Field>
                  <Label htmlFor="answer">Your Answer</Label>
                  <Textarea
                    id="answer"
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder="Type your answer here..."
                    maxLength={2000}
                    rows={6}
                    disabled={isSubmitting}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {answerContent.length} / 2000 characters
                  </div>
                </Field>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={!answerContent.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Post Answer'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setSelectedQuestion(null)
                      setAnswerContent('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a question from the left to answer
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <Card>
        <CardHeader>
          <CardTitle>Answered Questions</CardTitle>
          <CardDescription>Recently answered questions</CardDescription>
        </CardHeader>
        <CardContent>
          {answeredQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No answered questions yet
            </div>
          ) : (
            <div className="space-y-4">
              {answeredQuestions.map((item) => (
                <Card key={item.question.id}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Question</h4>
                        <p className="text-sm text-muted-foreground">{item.question.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(item.question.timestamp)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Answer</h4>
                        <p className="text-sm">{item.answer.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(item.answer.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.question.id)}
                        disabled={isDeleting === item.question.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {isDeleting === item.question.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
