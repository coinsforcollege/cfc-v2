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
# never start or stop servers or services

## Debugging and Question Handling Rules

### When investigating issues:
1. **Always investigate yourself first** using available tools (Read, Grep, Glob, Bash for API calls)
2. **Only ask the user to check something** if you need information only they can access:
   - Runtime behavior in their browser (console errors, network requests)
   - Visual issues you cannot see (layout problems, rendering issues)
   - User-specific environment issues

### If you need to ask the user something:
1. **Give complete, clear instructions**:
   - GOOD: "Press F12 to open browser console, go to Console tab, refresh the page, and tell me what errors you see"
   - BAD: "Check the console" or "Look at the data"
2. **WAIT for their response** before proceeding
3. **Don't start investigating on your own** while waiting for their answer
4. If they ask "where?" or similar clarifying questions, answer them directly and literally

### Conditional plans are NOT allowed:
1. **Don't present plans that depend on unknown information**
   - BAD: "Check console logs, then based on what's found, fix the issue"
   - GOOD: Investigate files first, identify the issue, then present a complete fix plan
2. **Gather all information first**:
   - Read backend files to see what data is returned
   - Check frontend code to see what data is expected
   - Only after understanding the full picture, present a plan
3. **Plan mode is for ready-to-execute plans**, not "if this then that" scenarios

### Communication rules:
1. **Never say "you're right"** or similar validation phrases
2. Answer user questions literally - if they ask "where", tell them the location, not what you'll do
3. When you make a mistake, acknowledge it by changing behavior, not by repeating apologies

## Design Consistency Rules

### Always check existing design patterns before creating new UI:
1. **Read these files first**:
   - Dashboard pages: `client/src/pages/student/Overview.jsx`, `client/src/pages/collegeAdmin/Overview.jsx`
   - Section components: `client/src/components/sections/TractionProofSection.jsx`, `client/src/components/sections/NetworkMapSection.jsx`
   - Card examples in dashboards to understand spacing, gradients, and animations

### Design elements to follow:

**Glass morphism cards:**
```javascript
{
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
}
```

**Gradient backgrounds with radial patterns:**
```javascript
background: `
  radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
  radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
  radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)
`
```

**Color palette:**
- Primary purple: `#8b5cf6`
- Primary pink: `#ec4899`
- Success green: `#10b981`
- Warning orange: `#f59e0b`
- Text primary: `#2d3748`
- Text secondary: `#718096`

**Animations:**
- Use framer-motion for scroll animations
- Standard animation: `initial={{ opacity: 0, y: 30 }}, whileInView={{ opacity: 1, y: 0 }}, transition={{ duration: 0.6 }}, viewport={{ once: true }}`
- Add staggered delays for lists: `delay: index * 0.05`

**Tables:**
- Header with gradient background: `background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)'`
- Row hover effect: `'&:hover': { background: 'rgba(139, 92, 246, 0.02)' }`
- Progress bars with gradient: `background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)'`

**Status chips:**
- Live: `#10b981` (green)
- Waitlist/Building: `#f59e0b` (orange)
- Unaffiliated: `#6b7280` (gray)

### Data validation before rendering:
1. **Always check if data exists** before rendering charts or tables
2. **Show fallback messages** for empty data: "No data available"
3. **Validate numbers** before operations:
   - Check for NaN: `if (isNaN(value))`
   - Check for null/undefined: `if (!value)`
   - Use default values: `value || 0`
4. **Format numbers properly**:
   - Decimals: `.toFixed(2)`
   - Thousands separator: `.toLocaleString()`
   - Percentages: `(value * 100).toFixed(0)}%`

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
