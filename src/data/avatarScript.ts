// ============================================================
// avatarScript.ts – all avatar speech scripts in one file.
// Edit the text fields here to change what the avatar says.
// ============================================================

export const INTRO_SCRIPT = `Hi — I'm Prasanna Kumar, a backend engineer based in Bengaluru, India.
I build Golang and Python microservices, real-time event pipelines with NATS,
and observability tooling with Prometheus — mostly for AIOps and IT operations platforms.
I've worked with Cassandra and ScyllaDB in production and recently added LLM-based incident analysis to the mix using LangChain and RAG.
Take a look around — and feel free to reach out if you'd like to connect.`

export interface QA {
  question: string
  answer: string
}

export const QUICK_ANSWERS: QA[] = [
  {
    question: 'What do you work on?',
    answer: `I build backend systems for AIOps and IT operations automation — things like distributed microservices in Go and Python, real-time event pipelines over NATS, and Prometheus exporters for infrastructure observability.`,
  },
  {
    question: 'Tech stack?',
    answer: `My primary languages are Go and Python. On the data side I work with Cassandra, ScyllaDB, PostgreSQL and Redis. For messaging it's NATS and Kafka. For deployment: Docker, Kubernetes and GitHub Actions CI/CD.`,
  },
  {
    question: 'Why backend?',
    answer: `I'm most interested in the problems behind the UI — reliability, throughput, consistency under load. Distributed systems and observability let me reason about systems at scale, which is the kind of engineering challenge I find most rewarding.`,
  },
  {
    question: 'How can I contact you?',
    answer: `The easiest way is email — prasannakumarhm078@gmail.com. You can also find me on LinkedIn and GitHub. Links are in the contact section below.`,
  },
]
