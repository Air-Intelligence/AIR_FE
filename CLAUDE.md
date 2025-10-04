# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start Vite development server on port 5173 (exposed to network with `host: true`)
- `npm run build` - Type-check with `tsc -b` and build production bundle with Vite
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## Architecture

### Tech Stack
- **Build Tool**: Vite 7 with React plugin
- **Framework**: React 19 with TypeScript
- **Routing**: React Router DOM 7 (createBrowserRouter pattern)
- **Styling**: Tailwind CSS 4 (Vite plugin)
- **HTTP Client**: ky (configured in `src/lib/ky.ts`)
- **Map Integration**: Mapbox GL with geolocation tracking
- **UI Components**: Radix UI primitives with shadcn/ui patterns

### Path Aliases
`@/*` resolves to `src/*` (configured in both `tsconfig.json` and `vite.config.ts`)

### API Layer (`src/api/`)
- Centralized HTTP client in `src/lib/ky.ts` with base URL from `VITE_PUBLIC_API_URL` env var
- API endpoints prefixed with `/api/v1`
- Timeout: 10s, Retry: 2 attempts
- `userId` stored in localStorage and included in API calls

### State Management
- **User Management**: `useCreateUser` hook creates user on first visit, stores `userId` in localStorage
- **Geolocation**: `useGeolocation` hook tracks user location with configurable interval, persists to localStorage, syncs to backend via `userApi.updateLastCoord`
- **Web Push**: `useWebPush` hook registers service worker (`/serviceWorker.js`), requests notification permission, subscribes to push notifications using VAPID key from `VITE_VAPID_PUBLIC_KEY` env var

### Application Flow
1. App initialization (`src/app/App.tsx`):
   - Creates user if needed via `useCreateUser`
   - Initializes web push notifications via `useWebPush`
2. Routes (`src/app/router/AppRouter.tsx`):
   - `/` → HomePage (Mapbox map with live geolocation)
   - `/welcome` → WelcomePage

### Key Implementation Details
- **Geolocation Tracking**: `useGeolocation` hook runs at specified interval (default 1s), updates localStorage and backend API with current coordinates
- **Service Worker**: Registered at `/serviceWorker.js` for push notifications
- **Map Integration**: Mapbox GL initialized in HomePage, displays user location marker with real-time updates
- **Hardcoded Token**: Mapbox access token is currently hardcoded in `HomePage.tsx:6-7` (TODO: move to env var)

### Environment Variables Required
- `VITE_PUBLIC_API_URL` - Backend API base URL
- `VITE_VAPID_PUBLIC_KEY` - VAPID public key for web push notifications
- (TODO: `VITE_PUBLIC_MAPBOX_KEY` - Mapbox access token, currently hardcoded)

## Deployment

### Docker
- **Dockerfile**: Multi-stage build (Node 20 Alpine → Nginx Alpine)
  - Build stage: Installs dependencies, builds Vite app with environment variables
  - Production stage: Serves static files via Nginx on port 80
- **nginx.conf**: Custom config with SPA routing, service worker support, gzip, security headers, health check endpoint at `/health`
- **docker-compose.yml**: Runs frontend container on port 3000, connects to `air-network` (external), includes healthcheck

### CI/CD (GitHub Actions)
**Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: Push/PR to `main` branch
- **Build Job**:
  - Builds Docker image with environment variables as build args
  - Pushes to Docker Hub: `air-core-dev-fe-images:latest` and `air-core-dev-fe-images:main-{sha}`
  - Uses Docker layer caching for faster builds
- **Deploy Job** (main branch only):
  - SSH to GCE server using secrets: `GCE_HOST`, `GCE_USER`, `GCE_SSH_KEY`
  - Pulls latest code and Docker image
  - Runs `docker-compose down && docker-compose up -d`
  - Cleans up old images, verifies deployment

**Required GitHub Secrets**:
- `DOCKER_USERNAME`, `DOCKER_PASSWORD` - Docker Hub credentials
- `GCE_HOST`, `GCE_USER`, `GCE_SSH_KEY` - GCE server access

### Production Setup
- Frontend runs on port 3000 (nginx inside container on port 80)
- Nginx Proxy Manager handles external routing (not configured in this repo)
- Network: External Docker network `air-network` for inter-service communication
- Backend API accessible at `http://springboot:8080` within Docker network
