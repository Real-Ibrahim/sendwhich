# SendWhich

A secure, room-based, real-time collaboration and peer-to-peer file sharing platform designed for privacy, speed, and zero permanent storage.

SendWhich allows users to create temporary or persistent Rooms where participants can chat live, exchange files directly via peer-to-peer connections (WebRTC), track activity, and manage access — without uploading files to a central server.

## 🚀 Features

- **Secure File Sharing**: Peer-to-peer file transfer via WebRTC (no server storage)
- **Real-time Chat**: Live messaging in rooms using Supabase Realtime
- **Room Management**: Create, join, and manage private rooms with password protection
- **User Authentication**: Secure email/password authentication via Supabase Auth
- **Dashboard**: View active/expired rooms, statistics, and activity
- **Profile Management**: Update username and manage account settings
- **Modern UI**: Beautiful, animated interface with Framer Motion

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Auth + Realtime)
- **Real-time**: Socket.IO (for WebRTC signaling), Supabase Realtime (for chat)
- **File Transfer**: WebRTC DataChannels (peer-to-peer)

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- (Optional) A separate server for Socket.IO in production

## 🔧 Setup Instructions

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001  # Optional, for Socket.IO
```

3. **Run database migrations:**
- Go to your Supabase dashboard SQL Editor
- Run the SQL from `supabase/migrations/001_initial_schema.sql`

4. **Start the development server:**
```bash
npm run dev
```

5. **(Optional) Start Socket.IO server:**
```bash
npm run socket:dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
sendwhich/
├── app/
│   ├── api/              # API routes (rooms, messages, file-logs, user)
│   ├── dashboard/        # Dashboard page
│   ├── profile/          # Profile page
│   ├── room/[id]/        # Room page (chat + file sharing)
│   ├── signup/           # Authentication page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── RoomCreationModal.tsx
│   └── ui/               # UI components
├── lib/
│   ├── hooks/           # Custom React hooks (useAuth, useWebRTC, useSocket)
│   ├── supabase/        # Supabase client setup (client & server)
│   ├── types/           # TypeScript types and interfaces
│   └── utils/           # Utility functions (password, room helpers)
├── supabase/
│   └── migrations/      # Database migrations
├── server/
│   └── socket-server.js # Socket.IO server for WebRTC signaling
├── middleware.ts        # Next.js middleware for auth
└── SETUP.md            # Detailed setup guide
```

## 🗄️ Database Schema

- **users**: User profiles (linked to Supabase Auth)
- **rooms**: Room information (owner, settings, expiry)
- **room_participants**: Room membership tracking
- **messages**: Chat messages
- **file_logs**: File transfer logs (metadata only, no file storage)

All tables have Row Level Security (RLS) policies enabled.

## 🔐 Security Features

- Row Level Security (RLS) on all database tables
- Password-protected rooms with bcrypt hashing
- WebRTC encrypted data channels
- No server-side file storage
- Secure authentication via Supabase Auth

## 🚧 Development Status

✅ Completed:
- Authentication system
- Dashboard with room management
- Room page with chat
- Profile management
- Database schema and API routes
- Real-time chat via Supabase Realtime

🔄 In Progress / To Do:
- Full WebRTC file transfer implementation
- Socket.IO server integration
- File transfer progress tracking
- Room settings UI
- Notifications system
- Advanced analytics

## 📝 Notes

- **Socket.IO**: For production WebRTC signaling, deploy the Socket.IO server separately or use a compatible service.
- **WebRTC**: Full file transfer implementation requires the Socket.IO server for signaling between peers.
- **File Storage**: The application is designed to never store files on the server. All transfers are peer-to-peer.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For issues or questions, please contact the maintainers.

---

Built with ❤️ using Next.js, Supabase, and WebRTC
