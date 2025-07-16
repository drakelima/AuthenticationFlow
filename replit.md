# Replit.md

## Overview

This is a full-stack web application built with a React frontend and Express.js backend. The application uses TypeScript throughout and implements a modern authentication system using Replit Auth with OpenID Connect. The project features a mobile-first design using Tailwind CSS and shadcn/ui components, with PostgreSQL as the database managed through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Replit Auth with OpenID Connect and Passport.js
- **Session Management**: Express sessions with PostgreSQL session store
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful endpoints with JSON responses

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Neon serverless PostgreSQL adapter
- **Schema**: Type-safe database schema definitions
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Strategy**: Passport.js OpenID Connect strategy
- **Sessions**: Server-side sessions stored in PostgreSQL
- **Middleware**: Authentication middleware for protected routes

### Database Schema
- **Users Table**: Stores user profile information (required for Replit Auth)
- **Sessions Table**: Stores session data (required for Replit Auth)
- **Validation**: Zod schemas for type-safe data validation

### Frontend Components
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Layout**: Mobile-first responsive design
- **Navigation**: Bottom navigation for mobile experience
- **Forms**: Floating input components with validation
- **Modals**: Dialog-based modals for user interactions

### Backend Routes
- **Auth Routes**: User authentication and profile management
- **API Structure**: RESTful endpoints under `/api` prefix
- **Error Handling**: Centralized error handling middleware
- **Logging**: Request logging for API endpoints

## Data Flow

### Authentication Flow
1. User clicks login/register button
2. Redirected to Replit Auth OIDC provider
3. After successful authentication, user is redirected back
4. Server creates/updates user session in PostgreSQL
5. Client receives authenticated user data

### API Request Flow
1. Client makes request with session cookies
2. Authentication middleware validates session
3. Route handler processes request with database operations
4. Response sent back to client with JSON data
5. Client updates UI state through React Query

### Database Operations
1. Drizzle ORM provides type-safe database queries
2. Connection pooling through Neon serverless adapter
3. Automatic session management for authenticated users
4. User profile operations (create, read, update)

## External Dependencies

### Database
- **Neon**: Serverless PostgreSQL hosting
- **Connection**: Environment variable `DATABASE_URL` required

### Authentication
- **Replit Auth**: OpenID Connect provider
- **Required Environment Variables**:
  - `REPL_ID`: Replit application ID
  - `SESSION_SECRET`: Session encryption secret
  - `REPLIT_DOMAINS`: Allowed domains for auth
  - `ISSUER_URL`: OIDC issuer URL (defaults to Replit)

### UI Components
- **shadcn/ui**: Pre-built component library
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Frontend build tool with HMR
- **Replit Plugins**: Development experience enhancements
- **TypeScript**: Type safety across the stack

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Production Setup
- **Server**: Node.js Express server serving static files and API
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **Environment**: Production mode with `NODE_ENV=production`

### Development Environment
- **Hot Reload**: Vite HMR for frontend changes
- **Server Restart**: tsx for backend TypeScript execution
- **Database**: Local or remote PostgreSQL instance

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit application identifier
- `REPLIT_DOMAINS`: Comma-separated allowed domains
- `NODE_ENV`: Environment mode (development/production)

### Security Considerations
- HTTPS required for secure cookies
- Session-based authentication with PostgreSQL storage
- CSRF protection through session validation
- Environment-based configuration for sensitive data