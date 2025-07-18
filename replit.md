# Replit.md

## Overview

This is a full-stack Progressive Web Application (PWA) built with a React frontend and Express.js backend. The application uses TypeScript throughout and implements Firebase Authentication with Google sign-in. The project features a mobile-first design using Tailwind CSS and shadcn/ui components, with Firestore as the database for user data storage. The application supports Google OAuth authentication and includes offline capabilities through service workers.

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
- **Provider**: Firebase Authentication with Google OAuth
- **Strategy**: Firebase signInWithPopup for Google authentication
- **State Management**: React Context for authentication state
- **Database**: Firestore for user data storage with real-time updates
- **Offline Support**: PWA with service worker caching

### Database Schema
- **Users Collection**: Stores user profile information in Firestore
- **User Data**: email, displayName, name, phone, createdAt, updatedAt
- **Authentication**: Firebase Auth handles authentication, Firestore handles user data
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
1. User clicks "Continue with Google" button
2. Firebase signInWithPopup opens Google authentication popup
3. After successful authentication, Firebase Auth state updates
4. AuthContext automatically creates/updates user document in Firestore
5. Client receives authenticated user data and updates UI state

### API Request Flow
1. Client uses Firebase Auth for authentication state
2. User data is stored and retrieved from Firestore
3. Profile updates are handled through Firestore document updates
4. Real-time authentication state through Firebase Auth listeners
5. Client updates UI state through React Context and Firebase listeners

### Database Operations
1. Firestore provides real-time document-based data storage
2. User documents stored in 'users' collection with Firebase Auth UID as ID
3. Automatic user document creation on first authentication
4. Profile updates through Firestore document updates
5. Type-safe operations using Zod schemas

## External Dependencies

### Database
- **Neon**: Serverless PostgreSQL hosting
- **Connection**: Environment variable `DATABASE_URL` required

### Authentication
- **Firebase Auth**: Google OAuth provider
- **Required Environment Variables**:
  - `VITE_FIREBASE_API_KEY`: Firebase API key
  - `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
  - `VITE_FIREBASE_APP_ID`: Firebase application ID

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
- `VITE_FIREBASE_API_KEY`: Firebase API key for authentication
- `VITE_FIREBASE_PROJECT_ID`: Firebase project identifier
- `VITE_FIREBASE_APP_ID`: Firebase application identifier
- `NODE_ENV`: Environment mode (development/production)

### Security Considerations
- HTTPS required for secure cookies
- Session-based authentication with PostgreSQL storage
- CSRF protection through session validation
- Environment-based configuration for sensitive data