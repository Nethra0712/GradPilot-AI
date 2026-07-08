# GradPilot AI

GradPilot AI is an AI-powered university application assistant designed to guide international students through admissions processes, starting with the industry's most advanced Statement of Purpose (SOP) generator.

This repository is structured as a TypeScript monorepo using **npm workspaces** for a clean separation between the frontend client and the backend server.

---

## Technology Stack

### Frontend (`/client`)

- **Core**: React, Vite, TypeScript, Tailwind CSS, React Router
- **Data & Forms**: Axios, TanStack Query, React Hook Form, Zod

### Backend (`/server`)

- **Core**: Node.js, Express, TypeScript, Zod
- **Database & Auth**: Prisma ORM, PostgreSQL (Neon), JWT, bcryptjs
- **Logging & Security**: Helmet, CORS, Pino

### Quality & Tooling

- ESLint (custom rules per workspace)
- Prettier (shared formatting at root)
- Husky & lint-staged (pre-commit hooks)

---

## Directory Structure

```
GradPilot-AI/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── assets/             # Images, fonts, and styling
│   │   ├── components/         # Reusable UI component library (ui/, forms/, shared/)
│   │   ├── context/            # Global React Contexts (Auth, Subscription, etc.)
│   │   ├── hooks/              # Custom stateful hooks (useAuth, useStream)
│   │   ├── layouts/            # Page shell wrappers (Dashboard, Marketing)
│   │   ├── pages/              # Route components (LandingPage, Dashboard)
│   │   ├── services/           # API integration and Axios client singleton
│   │   ├── types/              # TypeScript interface declarations
│   │   ├── utils/              # Pure functions and formatter helpers
│   │   ├── App.tsx             # Main routing and layout setup
│   │   ├── index.css           # Tailwind base styles and CSS variables
│   │   └── main.tsx            # Main React mount entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Backend Express API
│   ├── src/
│   │   ├── config/             # Environment variable loading & validation (Zod)
│   │   ├── controllers/        # Express request parsers & response handlers
│   │   ├── jobs/               # Background task queues (e.g., BullMQ)
│   │   ├── middleware/         # Security, rate limiting, and auth filters
│   │   ├── prisma/             # Schema definition & PrismaClient singleton
│   │   ├── routes/             # Path definitions and router orchestration
│   │   ├── services/           # Framework-agnostic business logic & AI gateway
│   │   ├── types/              # TS typings
│   │   ├── utils/              # Custom error classes and logging tools
│   │   ├── app.ts              # Express application configuration
│   │   └── index.ts            # HTTP server start, listeners, and shutdown hooks
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── docs/                       # Product (PRD) and Architecture (SDD) documents
├── .gitignore
├── .prettierrc
├── package.json                # Root workspaces and coordination scripts
└── tsconfig.base.json          # Shared compiler options for both packages
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

### Quick Setup

Ensure you are in the project root directory. To install all dependencies for both frontend and backend and compile the Prisma client, run the unified setup command:

```bash
npm run setup
```

### Environment Variables

Before running the applications, create the local `.env` files based on the templates:

- For backend, copy `server/.env.example` to `server/.env` and update values.
- For frontend, copy `client/.env.example` to `client/.env` and update values.

### Running in Development

To start both the client and server concurrently in watch mode, run:

```bash
npm run dev
```

- **Frontend**: Runs on [http://localhost:5173](http://localhost:5173)
- **Backend API**: Runs on [http://localhost:5000](http://localhost:5000)
- **Health Check Endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Linting and Formatting

Run formatting checks and ESLint diagnostics across the entire monorepo:

```bash
# Formats all source files with Prettier
npm run format

# Run lint verification in both workspaces
npm run lint
```

---

## Quality and Git Hooks

This project enforces code quality standards using Git pre-commit hooks configured with **Husky** and **lint-staged**. On every commit, the staged files are automatically formatted using Prettier and analyzed with ESLint to prevent syntax errors or style deviations from reaching the main branch.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
