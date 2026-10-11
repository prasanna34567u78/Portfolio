// ============================================================
// content.ts – single source of truth for all site copy.
// Edit this file to update any text on the site.
// ============================================================

export const SITE = {
  name: 'Prasanna Kumar',
  headline: 'Backend Engineer',
  subheadline: 'Golang · Python · Distributed Systems · Event-Driven Pipelines · Observability',
  location: 'Bengaluru, India',
  email: 'prasannakumarhm078@gmail.com',
  linkedIn: 'https://linkedin.com/in/prasannakumarhm',
  github: 'https://github.com/prasanna34567u78',
  // No phone number exposed on the site (per user request)
}

export const SUMMARY = `Backend engineer with about 3 years of experience building Golang and Python microservices,
real-time event pipelines and observability tooling for an AIOps and IT operations automation platform.
Worked with Cassandra/ScyllaDB, NATS and Prometheus in production, and integrated LLM-based incident analysis
into operations workflows.`

export const EXPERIENCES = [
  {
    role: 'Senior Software Engineer',
    company: 'Algomox Pvt Ltd',
    location: 'Bengaluru',
    period: 'Jan 2024 – Present',
    domain: 'AIOps · IT Operations Automation · Cybersecurity',
    bullets: [
      'Designed and delivered 10+ independently deployable microservices in Golang (Gin) and Python (Flask/Django) with Cassandra/ScyllaDB (GoCQL) and REST APIs.',
      'Built NATS-based event ingestion and processing pipelines for real-time alerting.',
      'Wrote Prometheus exporters for Node, SQL, NoSQL and SNMP targets.',
      'Built an LLM-assisted incident analysis workflow with LangChain and a RAG pipeline over ITSM documentation.',
      'Led migration of platform UI to an Angular micro-frontend architecture with Module Federation.',
      'Integrated Google SecOps APIs; built GitHub Actions CI/CD pipelines deploying to Kubernetes.',
      'Mentored 4 junior engineers.',
      // TODO: add verified metric — e.g. events/sec throughput for NATS pipeline
      // TODO: add verified metric — e.g. MTTR improvement from LLM incident analysis
    ],
  },
  {
    role: 'Full Stack Developer Intern',
    company: 'Oasis Infobyte',
    location: 'Remote',
    period: 'Aug 2023 – Sep 2023',
    domain: 'E-commerce',
    bullets: [
      'Built a MERN stack e-commerce application with JWT authentication and role-based access control.',
    ],
  },
  {
    role: 'Software Developer Intern',
    company: 'DocYardHQ',
    location: 'Remote',
    period: 'Jan 2023 – Jul 2023',
    domain: 'SaaS',
    bullets: [
      'Implemented JWT and OAuth 2.0 authentication flows.',
      'Built a WebSocket-based service monitoring system.',
    ],
  },
]

export const PROJECTS = [
  {
    title: 'High-Availability Voting Platform',
    description:
      'Distributed voting system built for fault tolerance and horizontal scalability. Stateless API layer fronting a Cassandra cluster, containerised with Docker, JWT-secured endpoints.',
    tech: ['Go', 'Gin', 'Cassandra', 'Docker', 'JWT'],
    // TODO: add verified metric — e.g. concurrent users / requests per second handled
    githubUrl: 'https://github.com/prasanna34567u78', // TODO: replace with exact repo link
  },
  {
    title: 'Algorithmic Trading & Monitoring Platform',
    description:
      'FastAPI backend integrating with the MetaTrader 5 API to execute algorithmic strategies and expose real-time P&L metrics via a monitoring dashboard.',
    tech: ['Python', 'FastAPI', 'MetaTrader 5 API'],
    githubUrl: 'https://github.com/prasanna34567u78', // TODO: replace with exact repo link
  },
  {
    title: 'AIOps Incident Analysis Workflow',
    description:
      'LLM-powered pipeline that ingests alerts, retrieves relevant ITSM documentation via RAG, and produces root-cause summaries for on-call engineers.',
    tech: ['Python', 'LangChain', 'RAG', 'NATS'],
    githubUrl: 'https://github.com/prasanna34567u78', // TODO: replace with exact repo link
  },
]

export const SKILL_GROUPS = [
  {
    label: 'Languages',
    skills: ['Go', 'Python', 'SQL', 'TypeScript', 'JavaScript'],
  },
  {
    label: 'Backend',
    skills: ['Gin', 'Flask', 'Django', 'FastAPI', 'REST APIs', 'Microservices', 'Event-Driven Architecture'],
  },
  {
    label: 'Data & Messaging',
    skills: ['Cassandra', 'ScyllaDB', 'PostgreSQL', 'MySQL', 'Redis', 'NATS', 'Kafka'],
  },
  {
    label: 'Observability',
    skills: ['Prometheus', 'SNMP Exporters'],
  },
  {
    label: 'DevOps',
    skills: ['Docker', 'Kubernetes', 'GitHub Actions', 'Linux'],
  },
  {
    label: 'Frontend',
    skills: ['Angular', 'React', 'Module Federation'],
  },
  {
    label: 'AI / ML',
    skills: ['LLMs', 'LangChain', 'RAG'],
  },
]

export const EDUCATION = [
  {
    degree: 'B.E. Computer Science',
    institution: 'SDM College of Engineering and Technology, Dharwad',
    affiliation: 'Visvesvaraya Technological University (VTU)',
    period: '2020 – 2024',
    cgpa: '8.65 / 10',
  },
]

export const ACHIEVEMENTS = [
  'All India Rank 2 in Algostrike (IIT Dharwad competitive programming contest)',
  '250+ LeetCode problems solved',
  '5-star rating on HackerRank',
]
