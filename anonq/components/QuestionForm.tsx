'use client'

import { useState } from 'react'

interface QuestionFormProps {
  onSubmit: (content: string) => Promise<void>
  onRegenerate: (content: string) => Promise<string>
}

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M7 3v4"/><path d="M3 7h4"/><path d="M3 5h4"/></svg>
)

const InfoIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
)

const Spinner = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

export function QuestionForm({ onSubmit, onRegenerate }: QuestionFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const MAX_CHARS = 1000

  const handleSubmit = async () => {
    if (!content.trim() || content.length > MAX_CHARS) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(content)
      setContent('')
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegenerate = async () => {
    if (!content.trim()) return

    setIsRegenerating(true)
    try {
      const newText = await onRegenerate(content)
      setContent(newText)
    } catch (error) {
      console.error(error)
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-muted/20">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          Ask a Question
        </h2>
        <p className="text-sm text-muted-foreground">
          No strings, no names.{' '}
          <span className="group relative inline-block">
            <span className="underline underline-offset-2 cursor-help">Completely anonymous</span>.
            <span className="absolute top-full mt-2 left-0 w-72 p-3 bg-popover border border-border rounded-md shadow-lg text-xs text-popover-foreground text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              <span className="font-semibold block mb-1">How do I know it&apos;s anonymous?</span>
              Technically, it&apos;s not 100% foolproof. I could log your IP or use browser fingerprinting, but that would defeat the entire purpose and ruin the trust we&apos;re building here. I won&apos;t do that. Your privacy is respected.
            </span>
          </span>
        </p>
      </div>

      <div className="p-6 space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting || isRegenerating}
            placeholder="What would you like to know?"
            className="w-full min-h-[120px] p-4 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all disabled:opacity-50 text-base"
          />
          <div className={`absolute bottom-3 right-3 text-xs font-medium ${
            content.length > MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            {content.length} / {MAX_CHARS}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={!content.trim() || isRegenerating || isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-input bg-transparent text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              {isRegenerating ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <SparklesIcon className="h-4 w-4" />
              )}
              {isRegenerating ? 'Fixing...' : 'Rewrite'}
            </button>
            
            <div className="group relative flex items-center justify-center">
              <InfoIcon className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground cursor-help transition-colors" />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-popover border border-border rounded-md shadow-lg text-xs text-popover-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Disguise your writing style so you can&apos;t be identified by how you type.
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!content.trim() || content.length > MAX_CHARS || isSubmitting || isRegenerating}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            {isSubmitting && <Spinner className="h-4 w-4" />}
            {isSubmitting ? 'Sending...' : 'Send Question'}
          </button>
        </div>
      </div>
    </div>
  )
}
