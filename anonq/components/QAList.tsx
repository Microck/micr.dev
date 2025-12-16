import { type QAPair } from '@/lib/api'

interface QAListProps {
  items: QAPair[]
  isLoading: boolean
}

const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
)

const Spinner = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

export function QAList({ items, isLoading }: QAListProps) {
  if (isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-4">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-sm">Loading questions...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border rounded-xl bg-zinc-950 text-center">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
          <MessageSquareIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No questions answered yet</h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Be the first to ask something interesting!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pl-1">
        Recent Answers
      </h3>
      
      {items.map((item, index) => (
        <article 
          key={item.question.timestamp + index} 
          className="group bg-zinc-950 border border-border rounded-xl overflow-hidden hover:border-muted-foreground/30 transition-colors"
        >
          <div className="p-6 space-y-4">
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-secondary-foreground mb-2">
                ANONYMOUS
              </span>
              <p className="text-lg font-semibold text-foreground leading-relaxed">
                {item.question.content}
              </p>
            </div>

            <div className="relative pl-4 border-l-2 border-primary/50 py-1">
              <p className="text-muted-foreground leading-relaxed">
                {item.answer.content}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-xs font-medium text-primary">Admin Answered</span>
              <time className="text-xs text-muted-foreground font-mono">
                {new Date(item.answer.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
