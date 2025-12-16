'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { QuestionForm } from '@/components/QuestionForm'
import { QAList } from '@/components/QAList'
import { questionsAPI, type QAPair } from '@/lib/api'

const FaultyTerminal = dynamic(() => import('@/components/FaultyTerminal'), { ssr: false })

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

export default function HomeClient() {
  const [items, setItems] = useState<QAPair[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [showBackground, setShowBackground] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchQuestions = useCallback(async () => {
    try {
      const data = await questionsAPI.getQA()
      setItems(data)
    } catch (error) {
      console.error('Failed to load questions', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuestions()
    const interval = setInterval(fetchQuestions, 30000)
    return () => clearInterval(interval)
  }, [fetchQuestions])

  const handleSubmit = async (content: string) => {
    await questionsAPI.submitQuestion(content)
    showToast('Question submitted!', 'success')
    fetchQuestions()
  }

  const handleRegenerate = async (content: string) => {
    const result = await questionsAPI.regenerateText(content)
    showToast('Message refined by AI.', 'info')
    return result.corrected || content
  }

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      <div className={`fixed inset-0 z-0 transition-opacity duration-700 ${mounted && showBackground ? 'opacity-100' : 'opacity-0'}`}>
        {showBackground && (
          <FaultyTerminal
            scale={3}
            brightness={0.4}
            scanlineIntensity={0.3}
            glitchAmount={0.5}
            flickerAmount={0.3}
            curvature={0}
            mouseReact={true}
            mouseStrength={0.15}
            pageLoadAnimation={true}
          />
        )}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent 0%, rgba(9,9,11,0.97) 44%, rgba(9,9,11,0.97) 56%, transparent 100%)'
          }}
        />
      </div>

      <div className={`max-w-2xl mx-auto px-4 py-12 sm:px-6 relative z-10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <header className="mb-12 flex flex-col items-center text-center">
          <button 
            onClick={() => setShowBackground(!showBackground)}
            className="relative w-48 h-48 md:w-64 md:h-64 cursor-pointer"
            title="Toggle background animation"
          >
            <img 
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/quarzite.png`}
              alt="AnonQ Logo" 
              width={256}
              height={256}
              className="w-full h-full object-contain invert opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
          </button>
        </header>

        <section className={`mb-12 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <QuestionForm 
            onSubmit={handleSubmit}
            onRegenerate={handleRegenerate}
          />
        </section>

        <div className={`relative mb-12 transition-all duration-500 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-zinc-950 px-3 text-sm text-muted-foreground/50 font-mono uppercase tracking-widest">
              Feed
            </span>
          </div>
        </div>

        <section className={`transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <QAList items={items} isLoading={isLoading} />
        </section>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <div className={`px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md flex items-center gap-3 ${
            toast.type === 'success' 
              ? 'bg-emerald-950/80 border-emerald-900 text-emerald-50' 
              : toast.type === 'error'
              ? 'bg-red-950/80 border-red-900 text-red-50'
              : 'bg-zinc-800/80 border-zinc-700 text-zinc-50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              toast.type === 'success' ? 'bg-emerald-400' : toast.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
            }`} />
            <p className="text-sm font-medium pr-2">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}
