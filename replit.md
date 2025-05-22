# VerseProjection Replit Guide

## Overview

VerseProjection is a real-time Bible verse detection and projection application for church services. The application listens to audio input, transcribes speech, and identifies Bible verses being spoken, which can then be projected on a secondary display. The system uses a frontend built with React and a backend with Express, communicating with a PostgreSQL database via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

VerseProjection uses a modern full-stack web architecture:

1. **Frontend**: React application with TypeScript, styled using Tailwind CSS and shadcn/ui components
2. **Backend**: Express.js server with TypeScript
3. **Database**: PostgreSQL with Drizzle ORM for database operations
4. **Real-time Communication**: WebSockets for real-time audio processing and verse matching
5. **Build**: Vite for frontend bundling and hot module replacement in development

The system is organized as a monorepo with clear separation between client, server, and shared code:
- `/client`: React frontend application
- `/server`: Express backend server
- `/shared`: Common types and database schema shared between frontend and backend

## Key Components

### Frontend

1. **Authentication System**: Login/registration forms and session management
2. **Dashboard**: Main interface displaying verse matches and controls
3. **Projection Window**: Secondary window for displaying detected verses
4. **Settings Panel**: User preferences configuration
5. **Audio Capture**: Microphone input handling for speech detection
6. **WebSocket Client**: Real-time communication with the server

### Backend

1. **Express Server**: Handles API routes and serves static assets
2. **Authentication Service**: User management and session handling
3. **Bible Service**: Verse retrieval and search functionality
4. **Verse Matcher**: Processes transcribed audio to identify Bible verses
5. **WebSocket Server**: Handles real-time communication for audio processing
6. **Storage Interface**: Database access abstraction layer

### Database Schema

1. **Users**: User accounts and authentication info
2. **Settings**: User preferences (font size, Bible version, etc.)
3. **DetectionHistory**: Log of detected verses
4. **BibleVerses**: Bible verse text repository
5. **FeedbackData**: Data for improving detection accuracy

## Data Flow

1. **Audio Input Flow**:
   - User speaks into microphone
   - Audio is captured in browser and sent via WebSocket to server
   - Server processes audio using a speech-to-text service
   - Transcribed text is matched against Bible verses
   - Matching verses are sent back to client

2. **Verse Projection Flow**:
   - User selects a verse from matches
   - Verse is displayed in projection window
   - Verse is recorded in detection history

3. **Authentication Flow**:
   - User enters credentials
   - Server validates credentials and creates session
   - Session ID is stored in cookie
   - User preferences are loaded

## External Dependencies

### Frontend Dependencies
- React with React Query for data fetching
- Tailwind CSS for styling
- shadcn/ui component library (based on Radix UI)
- WebSocket API for real-time communication

### Backend Dependencies
- Express for API routing
- WebSocket for real-time communication
- Drizzle ORM for database operations
- bcrypt for password hashing

### Database
- PostgreSQL for data storage

## Deployment Strategy

The application is configured to be deployed on the Replit platform:

1. **Development**: `npm run dev` starts both the backend server and Vite dev server
2. **Production Build**: `npm run build` compiles frontend assets and server code
3. **Production Start**: `npm run start` runs the compiled application

The deployment utilizes Replit's autoscaling architecture, with the application setup to serve static assets directly from the Express server. Database connections are managed by the Replit PostgreSQL module.

## Getting Started

1. **Database Setup**: The application requires a PostgreSQL database. Check that the DATABASE_URL environment variable is properly set.

2. **Installation**: All dependencies are listed in package.json and can be installed with `npm install`.

3. **Development**: Run `npm run dev` to start the development server.

4. **Database Schema**: Use `npm run db:push` to push the database schema to the connected database.

5. **Building**: Run `npm run build` to create a production build.

## Known Limitations

1. The audio processing is currently simulated in the verse-matcher.ts file. A real implementation would use an actual speech-to-text service like OpenAI's Whisper.

2. The memory storage implementation in storage.ts is a placeholder. In production, this would be replaced by database operations using Drizzle ORM.