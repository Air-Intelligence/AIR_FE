# AIR_FE

AIR Intelligence Frontend Application - Real-time Weather Information and Hazard Alert System

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [Development Setup](#development-setup)
- [Deployment](#deployment)

## 🛠 Tech Stack

### Core
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool and development server
- **React Router DOM 7** - Client-side routing (`createBrowserRouter` pattern)

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible UI components (shadcn/ui pattern)
- **Lucide React** - Icon library

### Map & Location
- **Mapbox GL JS** - Interactive map rendering
- **Turf.js** - Geospatial data processing (polygon smoothing)
- **Geolocation API** - Real-time user location tracking

### HTTP & API
- **ky** - Lightweight HTTP client (Fetch API based)

### PWA & Notifications
- **Service Worker** - Background push notifications
- **Web Push API** - VAPID-based push subscriptions

## 📁 Project Structure

```
src/
├── api/                    # API client layer
│   ├── user.ts            # User creation, coordinate updates, warning levels
│   ├── weather.ts         # Weather data (polygon/point)
│   └── push.ts            # Push notification subscriptions
├── app/                    # App initialization and routing
│   ├── App.tsx            # Root component (useCreateUser, useWebPush)
│   ├── RootGate.tsx       # First-visit detection and welcome page redirect
│   └── router/
│       └── AppRouter.tsx  # React Router configuration
├── components/             # Reusable UI components
│   ├── OnboardingModal.tsx  # First-time user guide
│   ├── WarningButton.tsx    # Warning level display button
│   ├── TimerTrigger.tsx     # Timer trigger button
│   ├── PolygonLayer.tsx     # Mapbox polygon layer
│   ├── PointLayer.tsx       # Mapbox point layer
│   └── ui/                  # shadcn/ui base components
├── context/                # React Context state management
│   └── warningLevelContext.tsx  # Warning level global state
├── hooks/                  # Custom hooks
│   ├── useCreateUser.ts   # Generate userId on first visit and store in localStorage
│   ├── useGeolocation.ts  # Real-time location tracking (interval-based)
│   └── useWebPush.ts      # Service Worker registration and push subscriptions
├── lib/                    # Library configuration
│   ├── ky.ts              # HTTP client (baseURL, timeout, retry)
│   └── utils.ts           # Utility functions (cn, etc.)
├── page/                   # Page components
│   ├── home/
│   │   └── HomePage.tsx   # Mapbox map + real-time location marker
│   └── welcome/
│       └── WelcomePage.tsx  # First-visit welcome page
└── types/                  # Type definitions
    └── api/
        └── common.ts
```

## 🎯 Core Features

### 1. User Management
- **Auto User Creation**: Generate `userId` from backend on first visit and store in localStorage
- **First-Visit Detection**: `RootGate` component checks `hasVisited` and redirects to `/welcome` page

### 2. Real-time Location Tracking
- **Geolocation Hook** (`useGeolocation`):
  - Configurable interval tracking (default 5 seconds)
  - Store location in localStorage
  - Update coordinates via backend API (`userApi.updateLastCoord`)
  - Receive warning level (`warningLevel`) response

### 3. Warning Level System
- **WarningLevelContext**:
  - 5 levels: `SAFE`, `READY`, `WARNING`, `DANGER`, `RUN`
  - Backend-calculated warning level managed as global state on location updates
  - Access via `useWarningLevel` hook in components

### 4. Interactive Map
- **Mapbox GL JS** based:
  - Real-time user location marker updates
  - Layer visibility control based on zoom level
    - Zoom > 7: Display polygon layer
    - Zoom ≤ 7: Display point layer
  - Weather data visualization (GeoJSON polygons/points)

### 5. Push Notifications
- **Service Worker** (`/serviceWorker.js`):
  - VAPID key-based push subscriptions
  - Request notification permissions and send subscription info to backend
  - Receive background notifications

### 6. Onboarding
- **OnboardingModal**:
  - Display usage guide on first home visit
  - Prevent re-display using `hasSeenOnboarding` localStorage flag
  - Reset available from InfoButton

## 🏗 Architecture

### Layer Structure

```
┌─────────────────────────────────────────────────────────┐
│                     Presentation Layer                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │
│  │   Pages     │  │  Components  │  │   Modals    │    │
│  │ - HomePage  │  │ - MapLayers  │  │ - Warning   │    │
│  │ - Welcome   │  │ - Buttons    │  │ - Tutorial  │    │
│  └─────────────┘  └──────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      State Layer                         │
│  ┌─────────────────┐  ┌──────────────────────────┐     │
│  │ React Context   │  │   Custom Hooks           │     │
│  │ - WarningLevel  │  │ - useGeolocation         │     │
│  │                 │  │ - useCreateUser          │     │
│  │                 │  │ - useWebPush             │     │
│  └─────────────────┘  └──────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                       Data Layer                         │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────┐  │
│  │  API Client  │  │  localStorage  │  │  Service   │  │
│  │  (ky-based)  │  │  - userId      │  │   Worker   │  │
│  │              │  │  - location    │  │  - Push    │  │
│  └──────────────┘  └────────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

#### 1. App Initialization (App.tsx)
```
App Mount
  ├─> useCreateUser
  │     └─> localStorage.getItem("userId")
  │           ├─ If exists: Keep existing user
  │           └─ If not: userApi.createUser() → store in localStorage
  │
  ├─> useWebPush
  │     └─> navigator.serviceWorker.register("/serviceWorker.js")
  │           └─> Notification.requestPermission()
  │                 └─> pushManager.subscribe(VAPID_KEY)
  │                       └─> pushApi.saveSubscription()
  │
  └─> WarningLevelProvider initialization
        └─> useGeolocation (5-second interval)
              └─> navigator.geolocation.getCurrentPosition()
                    ├─> localStorage.setItem("userLocation")
                    └─> userApi.updateLastCoord({ lat, lng })
                          └─> Response: { warningLevel: "SAFE" | "READY" | ... }
                                └─> setWarningLevel() → Update Context
```

#### 2. First-Visit Flow (RootGate.tsx)
```
RootGate Render
  └─> localStorage.getItem("hasVisited")
        ├─ null: localStorage.setItem("hasVisited", "true")
        │         └─> <Navigate to="/welcome" />
        └─ "true": <Outlet /> → Render HomePage
```

#### 3. HomePage Rendering (HomePage.tsx)
```
HomePage Mount
  ├─> Initialize Mapbox
  │     ├─> mapboxgl.Map({ center: [126.978, 37.5665], zoom: 7 })
  │     ├─> Add ScaleControl
  │     └─> Register zoom/moveend event listeners
  │
  ├─> OnboardingModal (on first home visit)
  │     └─> localStorage.getItem("hasSeenOnboarding")
  │           └─ null: Display 3-step tutorial
  │
  ├─> User location marker
  │     └─> useGeolocation → detect { lat, lng } changes
  │           └─> markerRef.setLngLat([lng, lat])
  │
  ├─> WarningButton
  │     └─> useWarningLevel() → subscribe to warningLevel
  │           └─> Auto-display WarningModal on SAFE → !SAFE change
  │
  ├─> TimerTrigger
  │     └─> Countdown every second (independent timer)
  │
  └─> Map layers (zoom level-based visibility control)
        ├─> zoomLevel > 8: Display PolygonLayer
        │     └─> weatherApi.getPolygon() → GeoJSON
        │           └─> map.addLayer({ type: 'fill' })
        │
        └─> zoomLevel ≤ 8: Display PointLayer
              └─> weatherApi.getPoints() → GeoJSON
                    └─> map.addLayer({ type: 'circle' })
```

### Core Component Interactions

#### Warning Level System
```
[User Movement]
      ↓
useGeolocation (every 5 seconds)
      ↓
userApi.updateLastCoord({ lat, lng })
      ↓
Backend Response: { warningLevel: "WARNING" }
      ↓
WarningLevelContext.setWarningLevel("WARNING")
      ↓
┌─────────────────────────────────────┐
│ Components subscribing via         │
│ useWarningLevel()                  │
├─────────────────────────────────────┤
│ 1. WarningButton                    │
│    └─> prevLevel "SAFE" → "WARNING" │
│         └─> Auto-display WarningModal │
│                                      │
│ 2. HomePage                          │
│    └─> Pass warningLevel prop       │
│         └─> Change WarningButton color │
└─────────────────────────────────────┘
```

#### Map Layer Visibility Control
```
[User Zoom In/Out]
      ↓
map.on('zoom') event
      ↓
setZoomLevel(map.getZoom())
      ↓
useEffect([zoomLevel]) trigger
      ↓
┌─────────────────────────────────┐
│ zoomLevel > 8                   │
│ ├─> PolygonLayer: visible      │
│ └─> PointLayer: none            │
│                                  │
│ zoomLevel ≤ 8                   │
│ ├─> PolygonLayer: none          │
│ └─> PointLayer: visible         │
└─────────────────────────────────┘
```

### API Communication

**Base URL**: `VITE_PUBLIC_API_URL/api/v1`

**Endpoints**:
- `POST /users` - User creation
- `PUT /users/last-coord` - Location update + warning level query
- `POST /notifications/subscribe` - Save push subscription
- `GET /weathers/polygon` - Weather polygon data
- `GET /weathers/point` - Weather point data

**Configuration** (`src/lib/ky.ts`):
- Timeout: 10 seconds
- Retry: 2 attempts
- Headers: `Content-Type: application/json`

**Error Handling**:
```typescript
// useWebPush.ts
try {
  await pushApi.saveSubscription({ endpoint, keys });
} catch (err) {
  if (err.response.errorName === "USER_NOT_FOUND") {
    // Regenerate userId
    localStorage.removeItem("userId");
    const newUser = await userApi.createUser();
    localStorage.setItem("userId", newUser.content.userId);
  }
}
```

### State Management Strategy

#### 1. localStorage (Persistent Storage)
- `userId`: User identifier (UUID)
- `userLocation`: Latest location info `{ lat, lng, error }`
- `hasVisited`: First-visit flag (`"true"` string)
- `hasSeenOnboarding`: Onboarding completion flag (`"true"` string)

#### 2. React Context (Global State)
```typescript
// WarningLevelContext
interface WarningLevelContextValue {
  warningLevel: "SAFE" | "READY" | "WARNING" | "DANGER" | "RUN" | null;
}

// Usage
const { warningLevel } = useWarningLevel();
```

#### 3. Custom Hooks (Logic Encapsulation)
- `useGeolocation(intervalMs)`: Location tracking + API calls
- `useCreateUser()`: User creation/restoration
- `useWebPush(vapidKey)`: Service Worker registration
- `useMapBounds()`: Mapbox boundary management

#### 4. Local State (Component UI State)
- Modal visibility (`isOpen`)
- Zoom level (`zoomLevel`)
- Timer countdown (`secondsLeft`)

### Path Aliases

`@/*` → `src/*` (configured in tsconfig.json and vite.config.ts)

### Key Design Decisions

#### Why Location Updates Occur in Two Places
1. **useGeolocation**: Location data collection + localStorage storage
2. **WarningLevelContext**: Location-based warning level queries

→ `useGeolocation` is called inside the Context Provider for automatic integration

#### Zoom Level Threshold Selection (8)
- Zoom > 8: Detailed polygon rendering (fine-grained weather visualization per region)
- Zoom ≤ 8: Point markers (performance optimization for national/wide view)

#### Service Worker Error Recovery
- On `USER_NOT_FOUND`: Invalidate localStorage userId + regenerate
- On push subscription failure: Log error only (app functions normally)

## 🚀 Development Setup

### Requirements

- Node.js 20+
- pnpm (corepack recommended)

### Environment Variables

Create a `.env` file:

```env
VITE_PUBLIC_API_URL=http://localhost:8080
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
VITE_PUBLIC_MAPBOX_KEY=your-mapbox-token  # TODO: Currently hardcoded in HomePage.tsx
```

### Installation and Running

```bash
# Install dependencies
pnpm install

# Start dev server (port 5173, network exposed)
pnpm dev

# Production build
pnpm build

# Preview build
pnpm preview

# Lint
pnpm lint
```

## 📦 Deployment

### Docker

**Multi-stage build** (Node 20 Alpine → Nginx Alpine):

```bash
docker build \
  --build-arg VITE_PUBLIC_API_URL=https://api.example.com \
  --build-arg VITE_VAPID_PUBLIC_KEY=your-key \
  --build-arg VITE_PUBLIC_MAPBOX_KEY=your-token \
  -t air-fe:latest .

docker run -p 3000:80 air-fe:latest
```

**Key Features**:
- pnpm usage (frozen-lockfile)
- TypeScript type check skipped (build speed optimization)
- Nginx static file serving
- Service Worker support
- SPA routing (`try_files`)
- gzip compression, security headers
- `/health` health check endpoint

### CI/CD (GitHub Actions)

**Workflow**: `.github/workflows/pnpm-build-deploy.yml`

**Trigger**: Push to `main` branch

**Steps**:
1. **Build Job**:
   - Build Docker image (inject environment variables)
   - Push to Docker Hub: `air-core-dev-fe-images:latest`

2. **Deploy Job**:
   - SSH to GCE
   - `docker compose pull && up -d`
   - Discord webhook notification (success/failure)

**Required GitHub Secrets**:
- `DOCKER_USERNAME`, `DOCKER_PASSWORD`
- `GCE_HOST`, `GCE_USER`, `GCE_SSH_KEY`
- `VITE_PUBLIC_MAPBOX_KEY`, `VITE_VAPID_PUBLIC_KEY`, `VITE_PUBLIC_API_URL`
- `DISCORD_WEBHOOK_URL`
