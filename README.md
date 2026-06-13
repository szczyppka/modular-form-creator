# Modular Form Creator

Resources Management application. Resources are created on a list page, filled in through two module forms (Basic Info, Project Details), and moved from `draft` to `completed` through a provisioning action.

## Tech stack

- Frontend: React 19 + TypeScript + Vite + styled-components
- Data fetching: TanStack Query + axios
- Forms: react-hook-form + Zod
- Backend: Express + TypeScript + MongoDB (see [backend/README.md](backend/README.md))
- Tests: Vitest + React Testing Library

## Quick start (full stack, Docker)

Requires Docker with Compose.

```bash
docker compose up -d
```

This starts:

| Service  | URL                        |
| -------- | -------------------------- |
| frontend | http://localhost:5173      |
| backend  | http://localhost:5001      |
| Swagger  | http://localhost:5001/docs |
| mongo    | mongodb://localhost:27017  |

Stop everything with `docker compose down` (add `-v` to also drop MongoDB data).

## Local frontend development

Requires Node.js 20.19 or newer. Run only backend + mongo in Docker and the
frontend on the host:

```bash
docker compose up -d backend mongo

cp .env.example .env   # VITE_API_URL=http://localhost:5001
npm install
npm run dev
```

App runs at `http://localhost:5173` (CORS on the backend is configured for this origin).

## Environment variables

| Variable       | Default                 | Description          |
| -------------- | ----------------------- | -------------------- |
| `VITE_API_URL` | `http://localhost:5001` | Backend API base URL |

## Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start Vite dev server        |
| `npm run build`      | Type-check and build         |
| `npm run preview`    | Preview production build     |
| `npm run lint`       | Run ESLint                   |
| `npm test`           | Run unit and component tests |
| `npm run test:watch` | Run tests in watch mode      |
| `npm run storybook`  | Design system playground     |

## Routes

| Route                                    | Page                                           |
| ---------------------------------------- | ---------------------------------------------- |
| `/resources`                             | Resources list (create / delete)               |
| `/resources/:resourceId`                 | Resource overview (modules, progress, actions) |
| `/resources/:resourceId/basic-info`      | Basic Info module form                         |
| `/resources/:resourceId/project-details` | Project Details module form                    |
| `/resources/:resourceId/details`         | Details / summary page                         |

## Core business rules

- A resource starts as `draft`; its name is set at creation.
- Project Details unlocks only after Basic Info is complete (draft resources).
- `draft -> completed` happens only through provisioning, allowed only when both modules are complete; re-provisioning is rejected.
- Edits to a `completed` resource are buffered in frontend memory, survive navigation between app routes, and are persisted only on explicit submit (`PUT`); the buffer is lost on refresh or close.

Full API contract: [backend/README.md](backend/README.md).

## Tests

- Feature tests are grouped in `src/features/<feature>/__tests__`.
- Shared React Testing Library setup and provider helpers live in `src/test-utils`.
- Test files describe user-visible behavior and business rules rather than
  component implementation details.
