/**
 * Avatar.tsx — Talking 3D avatar component.
 *
 * Architecture:
 * - Renders a Three.js scene via @react-three/fiber / @react-three/drei.
 * - Loads GLB from /avatar/me.glb (Draco-compatible loader).
 * - On speech: drives facial blendshapes (ARKit viseme keys) from
 *   SpeechSynthesis boundary events via VisemeDriver.
 * - Falls back to static photo + waveform ring if WebGL is unavailable
 *   or if /avatar/me.glb is not yet present.
 * - NEVER autoplays — user must press a button.
 * - Shows live captions at all times during speech.
 * - TTS layer is abstracted behind `speak()` / `stop()` so a
 *   better voice service can be plugged in without touching this component.
 */

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { INTRO_SCRIPT, QUICK_ANSWERS, type QA } from '../data/avatarScript'
import AvatarChat from './AvatarChat'

// ── TTS Adapter ─────────────────────────────────────────────────────────────
// Swap this object to use ElevenLabs / Azure / Deepgram without changing Avatar.

interface TTSAdapter {
  speak(
    text: string,
    onBoundary: (charIndex: number, charLength: number) => void,
    onEnd: () => void,
  ): void
  stop(): void
}

const browserTTS: TTSAdapter = {
  speak(text, onBoundary, onEnd) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.0
    // Pick a natural-sounding voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('neural') ||
          v.name.toLowerCase().includes('google')),
    )
    if (preferred) utterance.voice = preferred

    utterance.onboundary = (e) => {
      if (e.name === 'word') onBoundary(e.charIndex, e.charLength)
    }
    utterance.onend = onEnd
    utterance.onerror = onEnd
    window.speechSynthesis.speak(utterance)
  },
  stop() {
    window.speechSynthesis?.cancel()
  },
}

// ── Viseme mapping ───────────────────────────────────────────────────────────
// ARKit blendshape keys that Ready Player Me / Avaturn GLBs expose.
// We approximate viseme from phoneme using a simple vowel/consonant heuristic.
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

// ── Capability detection ─────────────────────────────────────────────────────
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function detectSpeechSynthesis(): boolean {
  return 'speechSynthesis' in window
}

// ── Waveform ring (fallback visual) ──────────────────────────────────────────
function WaveformRing({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      <div className={clsx('flex items-end gap-[3px]', active ? 'opacity-100' : 'opacity-30')}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'w-1 bg-indigo-400 rounded-full transition-all',
              active && 'animate-waveform',
            )}
            style={{
              height: active ? undefined : '4px',
              animationDelay: `${i * 80}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Static photo fallback ─────────────────────────────────────────────────────
function PhotoFallback({ speaking }: { speaking: boolean }) {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80">
      {/* Ring */}
      <div
        className={clsx(
          'absolute inset-0 rounded-full border-2 transition-colors duration-500',
          speaking ? 'border-indigo-400 shadow-[0_0_24px_4px_rgba(99,102,241,0.4)]' : 'border-slate-700',
        )}
      />
      <img
        src="/avatar/me.jpg"
        alt="Prasanna Kumar"
        className="w-full h-full rounded-full object-cover object-top"
        loading="eager"
      />
      <WaveformRing active={speaking} />
    </div>
  )
}

// ── Placeholder (no photo yet) ─────────────────────────────────────────────────
function AvatarPlaceholder({ speaking }: { speaking: boolean }) {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80">
      <div
        className={clsx(
          'w-full h-full rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors',
          speaking ? 'border-indigo-400 bg-indigo-950/40' : 'border-slate-700 bg-slate-800/40',
        )}
      >
        {/* Generic silhouette */}
        <svg className="w-24 h-24 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
        </svg>
        <p className="text-xs text-slate-500 text-center px-4">
          Add{' '}
          <code className="font-mono text-indigo-400">public/avatar/me.glb</code>
          {' '}or{' '}
          <code className="font-mono text-indigo-400">public/avatar/me.jpg</code>
        </p>
      </div>
      <WaveformRing active={speaking} />
    </div>
  )
}

// ── 3D Avatar scene (only imported when WebGL is available) ───────────────────
// Dynamically imported to keep bundle small
let ThreeAvatarScene: React.ComponentType<{
  speaking: boolean
  currentViseme: string
}> | null = null

// ── Captions ──────────────────────────────────────────────────────────────────
function Captions({ text, speaking }: { text: string; speaking: boolean }) {
  if (!text) return null
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className={clsx(
        'mt-4 max-w-sm text-center text-sm leading-relaxed transition-opacity duration-300 min-h-[3rem]',
        speaking ? 'text-slate-200 opacity-100' : 'text-slate-500 opacity-70',
      )}
    >
      {text}
    </div>
  )
}

// ── Main Avatar Component ─────────────────────────────────────────────────────
export default function Avatar() {
  const [hasSpeech, setHasSpeech] = useState(false)
  const [hasWebGL, setHasWebGL] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [hasGLB, setHasGLB] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [muted, setMuted] = useState(false)
  const [captionText, setCaptionText] = useState('')
  const [currentViseme, setCurrentViseme] = useState('viseme_sil')
  const [activeScript, setActiveScript] = useState<string | null>(null)
  const ttsRef = useRef<TTSAdapter>(browserTTS)
  const visemeTimerRef = useRef<number | null>(null)

  // Detect capabilities on mount
  useEffect(() => {
    setHasSpeech(detectSpeechSynthesis())
    setHasWebGL(detectWebGL())

    // Probe for photo
    const img = new Image()
    img.src = '/avatar/me.jpg'
    img.onload = () => setHasPhoto(true)

    // Probe for GLB
    fetch('/avatar/me.glb', { method: 'HEAD' })
      .then((r) => { if (r.ok) setHasGLB(true) })
      .catch(() => {})

    // Pre-load voices (Chrome needs this)
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

  // Lazy-load the Three.js scene component only when GLB + WebGL are both available
  useEffect(() => {
    if (hasGLB && hasWebGL && !ThreeAvatarScene) {
      import('./AvatarScene')
        .then((m) => {
          ThreeAvatarScene = m.default
        })
        .catch(() => {}) // silently fall back to photo
    }
  }, [hasGLB, hasWebGL])

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
      if (!hasSpeech || muted) {
        // Text-only fallback
        setCaptionText(text)
        return
      }
      setSpeaking(true)
      setActiveScript(text)
      setCaptionText(text)
      driveVisemes(text)

      ttsRef.current.speak(
        text,
        (charIndex, charLength) => {
          // Show the currently spoken phrase as caption
          setCaptionText(text.slice(charIndex, charIndex + charLength * 8))
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

  // Decide which visual to render
  const showThreeD = hasWebGL && hasGLB && ThreeAvatarScene
  const showPhoto = !showThreeD && hasPhoto
  // else: placeholder

  return (
    <div className="flex flex-col items-center gap-4" role="region" aria-label="Interactive avatar">
      {/* Visual */}
      <div className="relative">
        {showThreeD && ThreeAvatarScene ? (
          <Suspense
            fallback={
              <div className="w-72 h-72 rounded-full bg-slate-800 animate-pulse flex items-center justify-center">
                <span className="text-slate-500 text-sm">Loading 3D…</span>
              </div>
            }
          >
            <ThreeAvatarScene speaking={speaking} currentViseme={currentViseme} />
          </Suspense>
        ) : showPhoto ? (
          <PhotoFallback speaking={speaking} />
        ) : (
          <AvatarPlaceholder speaking={speaking} />
        )}
      </div>

      {/* Primary CTA */}
      {!speaking && (
        <button
          onClick={() => speak(INTRO_SCRIPT)}
          className="btn-primary"
          aria-label="Play introduction"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
          Hear my intro
        </button>
      )}

      {/* Stop / mute controls */}
      {speaking && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleStop}
            className="btn-ghost text-sm py-1.5 px-3"
            aria-label="Stop speaking"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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

      {/* Live captions */}
      <Captions text={captionText} speaking={speaking} />

      {/* Quick-question chips */}
      {!speaking && (
        <div className="flex flex-wrap justify-center gap-2 max-w-sm mt-1" role="group" aria-label="Quick questions">
          {QUICK_ANSWERS.map((qa: QA) => (
            <button
              key={qa.question}
              onClick={() => speak(qa.answer)}
              className={clsx(
                'text-xs px-3 py-1.5 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
                activeScript === qa.answer
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                  : 'border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400',
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

      {/* Text-only fallback notice */}
      {!hasSpeech && (
        <p className="text-xs text-slate-500 text-center max-w-xs" role="note">
          Speech synthesis is not available in this browser. Captions will display as text.
        </p>
      )}
    </div>
  )
}
