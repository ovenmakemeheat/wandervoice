# WanderVoice — Architecture & Flow

This document details the technical stack and the application flow of WanderVoice, connecting the underlying infrastructure to the user experience.

---

## 1. Technical Stack (The "Stacks")

WanderVoice is built on a high-performance monorepo architecture designed for real-time, location-aware interactions.

### Core Infrastructure
- **Runtime**: [Bun](https://bun.sh/) — Used for both development and production for maximum performance.
- **Monorepo**: [Turborepo](https://turbo.build/) — Manages the workspace containing `apps` and `packages`.
- **Tunneling**: [Ngrok](https://ngrok.com/) — Bridges local development to the physical mobile device for real-world walking tests (via `tunnel.ts`).

### Applications (`/apps`)
- **Web (Frontend)**: [Next.js (App Router)](https://nextjs.org/)
  - **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using the new JIT engine).
  - **Icons**: [Lucide React](https://lucide.dev/).
  - **Components**: [shadcn/ui](https://ui.shadcn.com/) (housed in `@wandervoice/ui`).
  - **State**: Zustand (for reactive location and audio state).
- **Server (Backend)**: [Hono](https://hono.dev/)
  - **Runtime**: Bun (native performance).
  - **Features**: RESTful API, Overpass API proxying for POI data, AI narrative generation.

### Shared Packages (`/packages`)
- **@wandervoice/ui**: Shared React components and global design system.
- **@wandervoice/db**: [Drizzle ORM](https://orm.drizzle.team/) with [PostgreSQL/Supabase](https://supabase.com/).
- **@wandervoice/env**: Type-safe environment variable management using Zod.
- **@wandervoice/config**: Shared ESLint and TypeScript configurations.

---

## 2. Application Flow (The "Flow")

### User Lifecycle
The following diagram illustrates the user's journey from first launch to the core walking loop.

```mermaid
graph TD
    A[Splash Screen] --> B{First Launch?}
    B -- Yes --> C[Permissions: Location + Mic]
    C --> D[Style Selection: Story/Facts/Secrets]
    D --> E[Walking Setup: Auto-audio ON/OFF]
    E --> F[Walking Mode: Home]
    B -- No --> F
    
    F --> G[Walk in Real World]
    G --> H{POI Within 50m?}
    H -- Yes --> I{Auto-audio ON?}
    I -- Yes --> J[Start Narrative Audio]
    I -- No --> K[Show Approach Banner]
    K --> L[User Taps Banner] --> J
    
    J --> M[Audio Playing]
    M --> N{User Curious?}
    N -- Yes --> O[Voice Q&A Mode]
    O --> P[Generate AI Response]
    P --> Q[Play Response + Show Text]
    Q --> M
    N -- No --> R[Finish Narrative]
    R --> G
```

### Data & Logic Flow
How information moves through the stack to create the "Wander" experience.

```mermaid
sequenceDiagram
    participant User as Mobile Device (Web App)
    participant Server as Hono Server (Bun)
    participant OSM as Overpass API (OSM)
    participant AI as Narrative Engine (LLM)

    User->>Server: Request Nearby POIs (Lat, Lng)
    Server->>OSM: Query Nodes/Ways (500m radius)
    OSM-->>Server: JSON (Heritage, Landmarks, Statues)
    Server-->>User: Structured POI List
    
    Note over User: User approaches "Golden Stupa"
    
    User->>Server: Request Narrative (POI ID, Mode: "Story")
    Server->>AI: Generate script for "Golden Stupa" in immersive style
    AI-->>Server: Narrative Text
    Server-->>User: Text + Metadata
    Note over User: Text-to-Speech (TTS) plays audio
```

---

## 3. How Stack & Flow Connect

| Layer | Technical Choice | Flow Benefit |
| :--- | :--- | :--- |
| **Runtime** | Bun | Sub-second latency for Overpass queries and API responses, critical for real-time walking cues. |
| **Monorepo** | Turborepo | Fast builds and shared types between Web and Server ensure the "POI" object is consistent across the journey. |
| **Backend** | Hono | Lightweight enough to run as an Edge function or on a small instance, reducing "TTB" (Time to Blue-dot) updates. |
| **Frontend** | Next.js | App Router allows for smooth transitions between "Walking Mode" and "POI Detail" without full page reloads. |
| **Database** | Drizzle | Type-safe schema for "Gems Found" ensures Elena's history is never lost during her walk. |
| **Tunnel** | Ngrok | Essential for the **Flow**; allows testing the actual GPS hardware on a phone while the code runs on a laptop. |

---
*Created by Antigravity — System Architect*
