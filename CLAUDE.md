# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Hard rules
Step 1 - Find the actual problem, or understand the new task
Step 2 - ask clarifying questions, no assumptions about what user wants or what the current codebase has
Step 3 - read all, and i mean "all" related files from line to end
Step 4 - if it requires backend modification, work on one endpoint at once only
Step 5 - ask user to test the endpoint using postman
Step 6 - make changes to related frontend
Step 7 - ask user to test the frontend
Step 8 - if it requires backend modification, work on one endpoint at once only
and so on.

# Never try to suggest or apply a workaround
# never interact with git or github
# Never use emojis, in code or conversation
# Always build in chunks - build - test - fix - build - text and so on


## Project Overview

Coins For College (CFC) is a full-stack educational blockchain platform where students can "mine" college-specific tokens. The codebase consists of three main applications:

- **Client** (`/client`): React + Vite frontend application
- **Server** (`/server`): Express.js REST API with WebSocket support
- **Blog** (`/blog`): Strapi CMS for managing blog content

## Architecture

### Multi-Application Structure

This is a monorepo containing three distinct applications that work together:

1. **Frontend (React + Vite)** - Modern SPA with Material-UI and Tailwind CSS
2. **Backend (Node.js + Express)** - RESTful API with Socket.IO for real-time mining updates
3. **CMS (Strapi)** - Headless CMS for blog and content management

### User Roles & Flow

The system supports three user roles:
- **Students**: Can register, select colleges to "mine" tokens for, and track earnings
- **College Admins**: Manage college information and token preferences
- **Platform Admins**: Oversee the entire platform

**Key Flow**: Students can add multiple colleges to their mining portfolio. When they "mine", they earn tokens for each selected college simultaneously via timed mining sessions.

### Authentication Architecture

- JWT-based authentication stored in localStorage
- AuthContext (`client/src/contexts/AuthContext.jsx`) manages auth state globally
- Protected routes use role-based guards (`client/src/components/guards/`)
- Token is passed in Authorization header for API requests and WebSocket authentication

### Real-Time Mining System

The mining feature uses WebSocket (Socket.IO) for real-time updates:

**Server Side** (`server/src/websocket/miningSocket.js`):
- Authenticates WebSocket connections via JWT
- Maintains active connections per user (supports multiple devices)
- Broadcasts mining status every 5 seconds to users with active sessions
- Uses caching to optimize frequent status queries
- Room-based broadcasting for multi-device support

**Client Side** (`client/src/hooks/useMiningWebSocket.js`):
- Custom hook that manages WebSocket connection lifecycle
- Auto-connects for authenticated students
- Provides real-time mining status updates

**Mining Models**:
- `MiningSession` - Tracks active mining sessions with start/end times
- `Wallet` - Stores earned tokens per student per college

### Database Architecture

**MongoDB (Server)** - Main application data:
- User model supports polymorphic roles (student/college_admin/platform_admin)
- Students have `studentProfile.miningColleges[]` array for selected colleges
- Colleges track stats (total miners, tokens mined, active miners)
- Referral system: students get unique referral codes and bonuses

**PostgreSQL (Blog/Strapi)** - CMS content:
- Blog posts, authors, categories, tags
- Comments, subscribers, contact submissions
- Content components (rich text, images, videos, CTAs)

### API Structure

All server routes follow `/api/{resource}` pattern:
- `/api/auth` - Authentication (register, login, logout, me)
- `/api/colleges` - College CRUD and search
- `/api/mining` - Start/stop mining sessions
- `/api/student` - Student-specific operations
- `/api/college-admin` - College admin operations
- `/api/platform-admin` - Platform admin operations
- `/api/ambassador` - Ambassador applications
- `/api/blog` - Blog proxy to Strapi

Key patterns:
- All routes use the `auth` middleware (`server/src/middlewares/auth.js`) for protected endpoints
- Role-based access control via `requireRole` middleware
- Centralized error handling (`server/src/middlewares/errorHandler.js`)

### File Upload System

Uses `multer` middleware for file uploads:
- Configured in `server/src/middlewares/upload.js`
- Stores files in `server/media/` directory
- Serves via `/images` static route in app.js
- Client uses `imageUtils.js` to handle local files and URLs

## Development Commands

### Client (Frontend)

```bash
cd client
npm install
npm run dev      # Start dev server on port 5173
npm run build    # Build for production
npm run start    # Serve production build on port 3000
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server (Backend)

```bash
cd server
npm install
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm run seed     # Seed colleges database
```

Server runs on port 4000 (configured in .env)

### Blog (Strapi CMS)

```bash
cd blog
npm install
npm run develop  # Start in development mode with admin panel
npm run dev      # Alias for develop
npm start        # Start in production mode
npm run build    # Build admin panel
```

Strapi admin panel typically runs on port 1337

## Environment Configuration

### Client (.env.local)
```
VITE_API_URL=http://localhost:4000/api
VITE_STRAPI_URL=https://cfc-v2-blog.onrender.com
```

### Server (.env)
```
NODE_ENV=development
PORT=4000
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<secret-key>
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

**IMPORTANT**: Server .env file is not version controlled. Reference `/server/README.md` for complete setup instructions.

### Blog (.env)
PostgreSQL configuration for production deployment. See `.env.example` for structure.

## Production Deployment

- Frontend: `cfc-v2.onrender.com` / `coinsforcollege.org`
- Backend API: `cfc-v2-server.onrender.com`
- Strapi CMS: `cfc-v2-blog.onrender.com`

CORS is configured in `server/src/app.js` to allow these origins.

## Key Technical Details

### Client Path Alias
Vite is configured with `@` alias pointing to `/client/src`:
```js
import { Button } from '@/components/ui/Button'
```

### WebSocket Connection
Client connects to WebSocket by stripping `/api` from `VITE_API_URL`:
```js
const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000')
```

### College Selection Flow
After student registration, users are redirected to college selection (`/auth/college-selection`) where they must add at least one college before accessing dashboard. This ensures every student has colleges to mine for.

### Mining Sessions
- Students can mine for up to 24 hours per session
- Earning rate = base rate (0.25 tokens/hr) + referral bonus
- Sessions auto-expire; WebSocket tracks remaining time
- Tokens are credited to wallet when session completes

### Strapi Integration
Client fetches blog content from Strapi API. Blog posts use dynamic content blocks (rich text, images, videos, quotes, CTAs) defined in `blog/src/components/content/`.

## Common Gotchas

- **File Uploads**: Must use `FormData` with proper content-type headers. Check `client/src/api/collegeAdmin.api.js` for upload examples
- **Mining Updates**: Only students receive WebSocket updates; check role before connecting
- **College Status**: Colleges have status field ('Unaffiliated', 'Waitlist', 'Building', 'Live') separate from deprecated `isOnWaitlist` boolean
- **Referral Codes**: Auto-generated on student creation, format: `REF{lastUserId8chars}{timestamp4chars}`
- **Multiple Colleges**: Students can mine for multiple colleges simultaneously; each has separate wallet balance
