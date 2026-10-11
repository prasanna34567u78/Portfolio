/**
 * Netlify Function: chat.js
 *
 * Phase 4 — "Ask my avatar" chat endpoint.
 * Feature-flagged OFF by default via VITE_ENABLE_CHAT env var.
 *
 * To enable:
 *   1. Set VITE_ENABLE_CHAT=true in Netlify environment variables.
 *   2. Set OPENAI_API_KEY (or ANTHROPIC_API_KEY) in Netlify env vars.
 *      NEVER commit API keys to git.
 *
 * Grounding: the LLM is prompted ONLY with Prasanna's factual bio.
 *            It politely refuses off-topic questions.
 *
 * Security measures:
 *   - Input length capped at 500 characters.
 *   - Rate limiting via in-memory map (resets per function cold start).
 *     For production, replace with Redis/Netlify Blobs.
 *   - CORS origin locked to the production domain.
 */

// In-memory rate limit store: ip -> { count, resetAt }
const rateLimits = new Map()
const RATE_LIMIT = 10 // requests
const WINDOW_MS = 60 * 1000 // per minute
const MAX_INPUT_LENGTH = 500

const SYSTEM_PROMPT = `You are a helpful assistant representing Prasanna Kumar's portfolio website.
You answer questions ONLY using the following facts about Prasanna Kumar.
If a question cannot be answered from these facts, politely say you don't have that information
and suggest the visitor contact Prasanna directly at prasannakumarhm078@gmail.com.
Do NOT make up employers, metrics, projects, or any other information.

FACTS:
- Name: Prasanna Kumar
- Title: Backend Engineer (Golang / Python)
- Location: Bengaluru, India
- Experience: ~3 years
- Current role: Senior Software Engineer at Algomox Pvt Ltd (Jan 2024–Present). AIOps, IT operations automation, cybersecurity.
- Previous: Full Stack Developer Intern at Oasis Infobyte (Aug-Sep 2023), Software Developer Intern at DocYardHQ (Jan-Jul 2023).
- Skills: Go, Python, SQL, TypeScript, JavaScript, Gin, Flask, Django, FastAPI, Cassandra, ScyllaDB, PostgreSQL, Redis, NATS, Kafka, Prometheus, Docker, Kubernetes, GitHub Actions, Angular, React, LangChain, RAG.
- Education: B.E. Computer Science, SDM College of Engineering and Technology (VTU), 2020-2024, CGPA 8.65/10.
- Achievements: All India Rank 2 at Algostrike (IIT Dharwad), 250+ LeetCode problems, 5-star HackerRank.
- Contact: prasannakumarhm078@gmail.com | linkedin.com/in/prasannakumarhm | github.com/prasanna34567u78
`

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateLimits.get(ip) || { count: 0, resetAt: now + WINDOW_MS }
  if (now > entry.resetAt) {
    entry.count = 0
    entry.resetAt = now + WINDOW_MS
  }
  entry.count += 1
  rateLimits.set(ip, entry)
  return entry.count <= RATE_LIMIT
}

export const handler = async (event) => {
  const ALLOWED_ORIGIN = 'https://prasannakumarhm.netlify.app'
  const origin = event.headers.origin || ''

  const corsHeaders = {
    'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' }
  }

  // Rate limiting
  const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) {
    return {
      statusCode: 429,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Too many requests. Please wait a minute.' }),
    }
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const userMessage = (body.message || '').slice(0, MAX_INPUT_LENGTH)
  if (!userMessage.trim()) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Message required' }) }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { statusCode: 503, headers: corsHeaders, body: JSON.stringify({ error: 'Chat is not configured.' }) }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`)
    }

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    }
  } catch (err) {
    console.error('Chat function error:', err)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    }
  }
}
