# SendWhich - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- (Optional) A separate server for Socket.IO in production

## Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up Supabase:**

   - Create a new project on [Supabase](https://supabase.com)
   - Go to Project Settings > API
   - Copy your `Project URL` and `anon public` key
   - Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Run the database migrations:**

   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and run it in the SQL Editor

4. **Start the development server:**

```bash
npm run dev
```

5. **(Optional) Start Socket.IO server:**

For full WebRTC functionality, you'll need to run a separate Socket.IO server:

```bash
node server/socket-server.js
```

Then set the Socket.IO URL in `.env.local`:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Features Implemented

✅ **Authentication**
- Email/password signup and login via Supabase Auth
- User profile management
- Protected routes with middleware

✅ **Dashboard**
- Create new rooms
- View active and expired rooms
- Statistics (total rooms, files shared, total size)
- Copy room links

✅ **Rooms**
- Real-time chat (via Supabase Realtime)
- File sharing (WebRTC setup ready)
- Room password protection
- Participant management
- Room expiry settings

✅ **Profile Page**
- Update username
- View account details
- Delete account

✅ **Database Schema**
- Users table
- Rooms table
- Room participants table
- Messages table
- File logs table
- Row Level Security (RLS) policies

## Project Structure

```
sendwhich/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── profile/          # Profile page
│   ├── room/[id]/        # Room page
│   ├── signup/           # Auth page
│   └── page.tsx          # Landing page
├── components/           # React components
├── lib/
│   ├── hooks/           # Custom React hooks
│   ├── supabase/        # Supabase client setup
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── supabase/
│   └── migrations/      # Database migrations
└── server/
    └── socket-server.js # Socket.IO server (optional)
```

## Important Notes

1. **Socket.IO Server**: The Socket.IO server (`server/socket-server.js`) needs to be run separately for full WebRTC functionality. In production, deploy this as a separate service or use a Socket.IO compatible hosting service.

2. **WebRTC**: The WebRTC file transfer hooks are set up but require the Socket.IO server for signaling. The current implementation logs files to the database, and you can extend it with full WebRTC file transfer.

3. **Environment Variables**: Make sure to set up all required environment variables before running the application.

4. **Database**: The migration file includes all necessary tables, indexes, and RLS policies. Make sure to run it in your Supabase project.

## Production Deployment

1. Deploy Next.js app to Vercel/Netlify/etc.
2. Deploy Socket.IO server separately (or use a service like Railway, Render, etc.)
3. Update environment variables in your hosting platform
4. Update CORS settings in Socket.IO server to match your domain

## Next Steps

- Implement full WebRTC file transfer with chunking
- Add file type detection and preview
- Implement room settings UI
- Add notifications system
- Add analytics dashboard
- Implement file transfer progress tracking










