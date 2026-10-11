/**
 * Avatar.tsx — Talking avatar component.
 *
 * Architecture:
 * - Lazy-loads 3D Avatar scene ONLY when a verified binary .glb exists with glTF magic header.
 * - Wraps 3D scene in an ErrorBoundary to prevent any runtime/WebGL error from crashing the app.
 * - Falls back smoothly to static photo (/avatar/me.jpg) with animated waveform speaking indicator.
 * - NEVER autoplays — user must trigger via "Hear my intro" button.
 * - Shows high-contrast live captions during speech in both dark and light modes.
 * - SpeechSynthesis abstraction with browser TTS safety and swappable interface.
 */

import { Suspense, useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import clsx from 'clsx'
import { INTRO_SCRIPT, QUICK_ANSWERS, type QA } from '../data/avatarScript'
import AvatarChat from './AvatarChat'
import ErrorBoundary from './ErrorBoundary'

// ── TTS Adapter ─────────────────────────────────────────────────────────────
interface TTSAdapter {
  speak(
    text: string,
    onBoundary: (charIndex: number, charLength: number) => void,
    onEnd: () => void,
  ): void
  stop(): void
}

let activeUtterance: SpeechSynthesisUtterance | null = null

const MALE_NAMES = [
  'guy',
  'david',
  'mark',
  'george',
  'james',
  'daniel',
  'alex',
  'fred',
  'oliver',
  'aaron',
  'prabhat',
  'ravi',
  'rishi',
  'male',
  'christopher',
  'eric',
  'steffan',
  'ryan',
]

const FEMALE_NAMES = [
  'zira',
  'jenny',
  'aria',
  'samantha',
  'victoria',
  'karen',
  'susan',
  'cathy',
  'hazel',
  'heera',
  'neerja',
  'eva',
  'female',
  'stephanie',
  'sarah',
  'sonia',
  'amber',
  'libby',
  'clara',
  'michelle',
  'ana',
]

function getBestMaleVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  const enVoices = voices.filter((v) => v.lang.startsWith('en'))

  // 1. Explicit male name match that is NOT female
  const explicitMale = enVoices.find((v) => {
    const name = v.name.toLowerCase()
    return (
      MALE_NAMES.some((m) => name.includes(m)) &&
      !FEMALE_NAMES.some((f) => name.includes(f))
    )
  })
  if (explicitMale) return explicitMale

  // 2. Any voice containing "male" in its name
  const anyMale = voices.find((v) => v.name.toLowerCase().includes('male'))
  if (anyMale) return anyMale

  // 3. English voice not matching known female names
  const notFemale = enVoices.find((v) => {
    const name = v.name.toLowerCase()
    return !FEMALE_NAMES.some((f) => name.includes(f))
  })
  if (notFemale) return notFemale

  // 4. Fallback to first available English voice
  return enVoices[0] || null
}

const browserTTS: TTSAdapter = {
  speak(text, onBoundary, onEnd) {
    if (!('speechSynthesis' in window)) {
      onEnd()
      return
    }

    try {
      window.speechSynthesis.cancel()
    } catch {}

    // Delay prevents Chromium SpeechSynthesis cancellation collisions
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      activeUtterance = utterance
      utterance.rate = 0.98
      utterance.pitch = 0.90 // Deeper masculine tone

      const maleVoice = getBestMaleVoice()
      if (maleVoice) {
        utterance.voice = maleVoice
      }

      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          onBoundary(e.charIndex, e.charLength || 10)
        }
      }

      utterance.onend = () => {
        activeUtterance = null
        onEnd()
      }

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('SpeechSynthesis error:', e.error)
        }
        activeUtterance = null
        onEnd()
      }

      window.speechSynthesis.speak(utterance)
    }, 60)
  },
  stop() {
    if (activeUtterance) {
      activeUtterance = null
    }
    try {
      window.speechSynthesis?.cancel()
    } catch {}
  },
}

// ── Viseme mapping ───────────────────────────────────────────────────────────
const VISEME_MAP: Record<string, string> = {
  a: 'viseme_aa',
  e: 'viseme_E',
  i: 'viseme_I',
  o: 'viseme_O',
  u: 'viseme_U',
  b: 'viseme_PP',
  p: 'viseme_PP',
  m: 'viseme_PP',
  f: 'viseme_FF',
  v: 'viseme_FF',
  th: 'viseme_TH',
  d: 'viseme_DD',
  t: 'viseme_DD',
  n: 'viseme_nn',
  s: 'viseme_SS',
  z: 'viseme_SS',
  r: 'viseme_RR',
  k: 'viseme_kk',
  g: 'viseme_kk',
  ch: 'viseme_CH',
  sh: 'viseme_CH',
  silent: 'viseme_sil',
}

function textToVisemes(text: string): Array<{ viseme: string; duration: number }> {
  const words = text.split(/\s+/)
  return words.flatMap((word) => {
    const lower = word.toLowerCase().replace(/[^a-z]/g, '')
    const visemes: Array<{ viseme: string; duration: number }> = []
    let i = 0
    while (i < lower.length) {
      const bigram = lower.slice(i, i + 2)
      if (VISEME_MAP[bigram]) {
        visemes.push({ viseme: VISEME_MAP[bigram], duration: 80 })
        i += 2
      } else {
        const char = lower[i]
        visemes.push({ viseme: VISEME_MAP[char] ?? 'viseme_sil', duration: 60 })
        i++
      }
    }
    visemes.push({ viseme: 'viseme_sil', duration: 120 })
    return visemes
  })
}

// ── Static photo fallback with speaking badge ────────────────────────────────
function PhotoFallback({ speaking }: { speaking: boolean }) {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
      {/* Speaking Pulse Glow */}
      <div
        className={clsx(
          'absolute -inset-2 rounded-full transition-all duration-700 pointer-events-none',
          speaking
            ? 'opacity-100 bg-indigo-500/20 blur-md scale-105'
            : 'opacity-0 scale-95',
        )}
      />

      {/* Circle Photo Container */}
      <div
        className={clsx(
          'relative w-full h-full rounded-full overflow-hidden border-2 transition-all duration-500 shadow-xl',
          speaking
            ? 'border-indigo-500 ring-4 ring-indigo-500/20 dark:ring-indigo-400/30'
            : 'border-slate-300 dark:border-slate-700',
        )}
      >
        <img
          src="/avatar/me.jpg"
          alt="Prasanna Kumar"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
      </div>

      {/* Speaking Waveform Badge */}
      {speaking && (
        <div className="absolute -bottom-2.5 bg-slate-900/95 dark:bg-slate-900/95 border border-indigo-500 px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="w-1 bg-indigo-400 rounded-full animate-waveform"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
          <span className="text-[10px] text-indigo-300 font-mono ml-1 font-semibold uppercase tracking-wider">
            Speaking
          </span>
        </div>
      )}
    </div>
  )
}

// ── Placeholder if photo is missing ─────────────────────────────────────────
function AvatarPlaceholder({ speaking }: { speaking: boolean }) {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
      <div
        className={clsx(
          'w-full h-full rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors p-4',
          speaking
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
            : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40',
        )}
      >
        <svg className="w-20 h-20 text-slate-400 dark:text-slate-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
        </svg>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-tight">
          Add <code className="font-mono text-indigo-600 dark:text-indigo-400">me.glb</code> or <code className="font-mono text-indigo-600 dark:text-indigo-400">me.jpg</code>
        </p>
      </div>
    </div>
  )
}

// ── High-Contrast Live Captions ──────────────────────────────────────────────
function Captions({ text, speaking }: { text: string; speaking: boolean }) {
  if (!text) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'mt-4 max-w-md w-full px-4 py-3 rounded-xl border text-sm leading-relaxed transition-all duration-300 text-center shadow-lg backdrop-blur-sm',
        speaking
          ? 'bg-white/95 dark:bg-slate-900/95 border-indigo-400 dark:border-indigo-500/50 text-slate-800 dark:text-slate-100 shadow-indigo-500/10'
          : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400',
      )}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        Live Speech
      </div>
      <p className="italic font-normal text-slate-800 dark:text-slate-200">
        "{text}"
      </p>
    </div>
  )
}

// ── Main Avatar Component ─────────────────────────────────────────────────────
export default function Avatar() {
  const [hasSpeech, setHasSpeech] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [hasGLB, setHasGLB] = useState(false)
  const [SceneComponent, setSceneComponent] = useState<ComponentType<any> | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [muted, setMuted] = useState(false)
  const [captionText, setCaptionText] = useState('')
  const [currentViseme, setCurrentViseme] = useState('viseme_sil')
  const [activeScript, setActiveScript] = useState<string | null>(null)

  const ttsRef = useRef<TTSAdapter>(browserTTS)
  const visemeTimerRef = useRef<number | null>(null)

  // Capability detection & probing
  useEffect(() => {
    setHasSpeech('speechSynthesis' in window)

    // Probe photo
    const img = new Image()
    img.src = '/avatar/me.jpg'
    img.onload = () => setHasPhoto(true)

    // Probe GLB — verify binary magic number 0x46546C67 ('glTF')
    // This prevents Netlify SPA HTML redirects from being parsed as 3D models
    fetch('/avatar/me.glb', { method: 'GET', headers: { Range: 'bytes=0-15' } })
      .then(async (r) => {
        const contentType = r.headers.get('content-type') || ''
        if (r.ok && !contentType.includes('text/html') && !contentType.includes('text/plain')) {
          const buffer = await r.arrayBuffer()
          const header = new Uint8Array(buffer.slice(0, 4))
          const magic = String.fromCharCode(...header)
          if (magic === 'glTF') {
            setHasGLB(true)
            // Dynamically import 3D scene only when verified
            const mod = await import('./AvatarScene')
            setSceneComponent(() => mod.default)
            return
          }
        }
        setHasGLB(false)
      })
      .catch(() => setHasGLB(false))

    // Pre-load voices on Chrome
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        window.speechSynthesis.getVoices()
      })
    }

    return () => {
      ttsRef.current.stop()
      if (visemeTimerRef.current) clearTimeout(visemeTimerRef.current)
    }
  }, [])

  const driveVisemes = useCallback((text: string) => {
    const visemes = textToVisemes(text)
    let i = 0
    function next() {
      if (i >= visemes.length) {
        setCurrentViseme('viseme_sil')
        return
      }
      const { viseme, duration } = visemes[i++]
      setCurrentViseme(viseme)
      visemeTimerRef.current = window.setTimeout(next, duration)
    }
    next()
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (speaking) {
        ttsRef.current.stop()
        setSpeaking(false)
        setCaptionText('')
        setCurrentViseme('viseme_sil')
        setActiveScript(null)
        return
      }

      setCaptionText(text)
      setActiveScript(text)

      if (!hasSpeech || muted) {
        return
      }

      setSpeaking(true)
      driveVisemes(text)

      ttsRef.current.speak(
        text,
        () => {
          // Keep showing full text so visitor can read along comfortably
          setCaptionText(text)
        },
        () => {
          setSpeaking(false)
          setCaptionText('')
          setCurrentViseme('viseme_sil')
          setActiveScript(null)
        },
      )
    },
    [speaking, hasSpeech, muted, driveVisemes],
  )

  const handleStop = () => {
    ttsRef.current.stop()
    setSpeaking(false)
    setCaptionText('')
    setCurrentViseme('viseme_sil')
    setActiveScript(null)
  }

  const showThreeD = hasGLB && SceneComponent !== null
  const showPhoto = !showThreeD && hasPhoto

  return (
    <div className="flex flex-col items-center gap-4 w-full" role="region" aria-label="Interactive avatar">
      {/* Avatar Visual Display */}
      <div className="relative">
        {showThreeD && SceneComponent ? (
          <ErrorBoundary fallback={<PhotoFallback speaking={speaking} />}>
            <Suspense
              fallback={
                <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
                  <span className="text-slate-500 text-sm">Loading 3D…</span>
                </div>
              }
            >
              <SceneComponent speaking={speaking} currentViseme={currentViseme} />
            </Suspense>
          </ErrorBoundary>
        ) : showPhoto ? (
          <PhotoFallback speaking={speaking} />
        ) : (
          <AvatarPlaceholder speaking={speaking} />
        )}
      </div>

      {/* Primary Action Button */}
      {!speaking && (
        <button
          onClick={() => speak(INTRO_SCRIPT)}
          className="btn-primary"
          aria-label="Play spoken introduction"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
          Hear my intro
        </button>
      )}

      {/* Stop & Mute Controls */}
      {speaking && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleStop}
            className="btn-ghost text-sm py-1.5 px-3"
            aria-label="Stop speaking"
          >
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            Stop
          </button>
          <button
            onClick={() => {
              setMuted((m) => !m)
              if (!muted) ttsRef.current.stop()
            }}
            className="btn-ghost text-sm py-1.5 px-3"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
                <path strokeLinecap="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-6.364-2.636a9 9 0 010-12.728" />
              </svg>
            )}
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      )}

      {/* Synchronized Captions */}
      <Captions text={captionText} speaking={speaking} />

      {/* Quick-Question Chips */}
      {!speaking && (
        <div className="flex flex-wrap justify-center gap-2 max-w-sm mt-1" role="group" aria-label="Quick questions">
          {QUICK_ANSWERS.map((qa: QA) => (
            <button
              key={qa.question}
              onClick={() => speak(qa.answer)}
              className={clsx(
                'text-xs px-3 py-1.5 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 font-medium',
                activeScript === qa.answer
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 bg-white/60 dark:bg-slate-900/40',
              )}
              aria-pressed={activeScript === qa.answer}
            >
              {qa.question}
            </button>
          ))}
        </div>
      )}

      {/* Optional Chat UI (Phase 4, feature-flagged) */}
      <AvatarChat />

      {/* Fallback notice if speech is unsupported */}
      {!hasSpeech && (
        <p className="text-xs text-slate-500 text-center max-w-xs" role="note">
          Speech synthesis is not supported in this browser. Captions will display as text.
        </p>
      )}
    </div>
  )
}
