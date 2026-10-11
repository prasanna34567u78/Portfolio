# Prasanna Kumar – Personal Portfolio

A modern, fast, and accessible portfolio for **Prasanna Kumar**, Backend Engineer (Golang / Python), featuring an interactive talking 3D avatar with browser speech synthesis and viseme lip-sync.

Deployed at: [https://prasannakumarhm.netlify.app](https://prasannakumarhm.netlify.app)

---

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with dark theme default, light theme toggle, WCAG AA contrast, and `prefers-reduced-motion` support
- **3D Avatar & Lip-Sync**: Three.js, `@react-three/fiber`, `@react-three/drei`, with custom viseme mapping and browser `SpeechSynthesis`
- **SEO & Performance**: JSON-LD Person schema, Open Graph tags, Twitter card tags, XML sitemap, `robots.txt`, asset chunk-splitting, zero layout shift
- **Serverless (Optional)**: Netlify Functions (`netlify/functions/chat.js`) for optional AI avatar Q&A

---

## Getting Started Locally

### Prerequisites
- Node.js (v18+ or v22+)
- npm

### Installation & Development
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build & Preview
```bash
# Type check and build
npm run build

# Preview production build locally
npm run preview
```

---

## Deploying to Netlify

The repository includes a ready-to-use [`netlify.toml`](./netlify.toml) configured for static export and serverless functions.

### Option A: Netlify Git Integration (Recommended)
1. Push your branch to GitHub (`portfolio-redesign` or merge to `main`).
2. Link the repository in the [Netlify Dashboard](https://app.netlify.com).
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Functions directory: `netlify/functions`

### Option B: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --build --prod
```

---

## Checklist: Assets to Provide & Update

### 1. 3D Avatar (`public/avatar/me.glb`)
- Generate your 3D avatar using an avatar creator (e.g., [Avaturn.me](https://avaturn.me) or [Ready Player Me](https://readyplayer.me)) using your selfies.
- Ensure the exported GLB includes facial blendshapes (ARKit / Oculus visemes such as `viseme_aa`, `viseme_O`, `viseme_PP`, etc.).
- Place the exported file at `public/avatar/me.glb`.
- *Note:* If no GLB is present, the app automatically falls back to your static photo (`public/avatar/me.jpg`) with an audio waveform ring.

### 2. Profile Photo (`public/avatar/me.jpg`)
- Placed in `public/avatar/me.jpg` as the fallback visual for low-power devices, browsers without WebGL, or before the 3D GLB is provided.

### 3. Resume (`public/resume.pdf`)
- Place your latest PDF resume at `public/resume.pdf`. The "Download Resume" buttons link directly to this file.

### 4. Project GitHub Links & Verified Metrics (`src/data/content.ts`)
All site copy is centralized in [`src/data/content.ts`](./src/data/content.ts):
- Update `githubUrl` placeholders for:
  - *High-Availability Voting Platform*
  - *Algorithmic Trading & Monitoring Platform*
  - *AIOps Incident Analysis Workflow*
- Fill in verified performance numbers (throughput, MTTR improvements, request latency) where `// TODO: add verified metric` comments are placed.

### 5. Avatar Speech Scripts (`src/data/avatarScript.ts`)
- Edit the spoken intro script in [`src/data/avatarScript.ts`](./src/data/avatarScript.ts).
- Edit or add quick-question chips and their answers in the `QUICK_ANSWERS` array.

---

## Optional: "Ask My Avatar" AI Chat (Phase 4)

The chat endpoint is feature-flagged **off by default**.

To enable it:
1. In your Netlify dashboard (or local `.env.local`), set:
   ```env
   VITE_ENABLE_CHAT=true
   OPENAI_API_KEY=sk-...
   ```
2. The endpoint in [`netlify/functions/chat.js`](./netlify/functions/chat.js) includes:
   - System prompt strictly grounded in Prasanna's bio (refuses off-topic questions)
   - Input length limits (500 chars)
   - Per-IP rate limiting
   - CORS origin validation

---

## Project Structure

```
├── netlify/
│   └── functions/
│       └── chat.js            # Optional AI chat function
├── public/
│   ├── avatar/
│   │   ├── me.glb             # 3D avatar model (you provide)
│   │   └── me.jpg             # Fallback avatar photo
│   ├── favicon.svg            # Site favicon
│   ├── resume.pdf             # Resume download
│   ├── robots.txt             # Search crawler directives
│   └── sitemap.xml            # Search engine sitemap
├── src/
│   ├── components/
│   │   ├── About.tsx          # About section & metrics grid
│   │   ├── Avatar.tsx         # Talking avatar component & fallback logic
│   │   ├── AvatarChat.tsx     # Optional AI chat interface
│   │   ├── AvatarScene.tsx    # Three.js / R3F 3D blendshape renderer
│   │   ├── Contact.tsx        # Contact links (Email, LinkedIn, GitHub)
│   │   ├── Education.tsx      # Education & achievements
│   │   ├── Experience.tsx     # Work timeline
│   │   ├── Hero.tsx           # Hero section & CTA
│   │   ├── Nav.tsx            # Sticky navbar with dark toggle & active section
│   │   ├── Projects.tsx       # Projects grid
│   │   └── Skills.tsx         # Categorized skills (no percentage bars)
│   ├── data/
│   │   ├── avatarScript.ts    # Avatar spoken scripts & Q&A chips
│   │   └── content.ts         # Central portfolio content file
│   ├── hooks/
│   │   ├── useActiveSection.ts
│   │   └── useScrollReveal.ts
│   ├── styles/
│   │   └── globals.css        # Tailwind directives & tokens
│   ├── App.tsx
│   └── main.tsx
├── netlify.toml               # Netlify build & cache header settings
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```