import { useState } from 'react'
import clsx from 'clsx'

/**
 * AvatarChat.tsx — Phase 4: Optional "Ask my avatar" chat UI.
 * Feature-flagged off by default (VITE_ENABLE_CHAT === 'true').
 * Calls the Netlify function at /.netlify/functions/chat.
 */
export default function AvatarChat() {
  const isEnabled = import.meta.env.VITE_ENABLE_CHAT === 'true'
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'avatar'; text: string }>>([
    {
      sender: 'avatar',
      text: "Hi! Ask me anything about Prasanna's background, projects, or tech stack.",
    },
  ])

  if (!isEnabled) {
    return null
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || loading) return

    setMessages((prev) => [...prev, { sender: 'user', text: trimmed }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to get response')
      }

      const data = await res.json()
      setMessages((prev) => [...prev, { sender: 'avatar', text: data.answer }])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'avatar',
          text: err.message || 'Sorry, something went wrong. Please try again or email directly.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mt-3">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-xs px-3 py-1.5 rounded-full border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 transition-colors flex items-center gap-1.5 mx-auto"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Ask custom question (AI)
        </button>
      ) : (
        <div className="card text-left text-xs bg-slate-900/95 border-indigo-500/30 p-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-semibold text-slate-200">Chat with Avatar</span>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-2 mb-2 scrollbar-hidden pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={clsx(
                  'p-2 rounded-lg leading-relaxed',
                  m.sender === 'user'
                    ? 'bg-indigo-600/30 text-indigo-100 ml-4'
                    : 'bg-slate-800 text-slate-300 mr-4',
                )}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="p-2 rounded-lg bg-slate-800 text-slate-400 italic">
                Thinking...
              </div>
            )}
          </div>
          <form onSubmit={handleSend} className="flex gap-1.5">
            <input
              type="text"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about background..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary text-xs py-1 px-3 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
