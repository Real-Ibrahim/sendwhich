// This will be used to initialize Socket.IO server
// For Next.js, we'll use API routes to handle Socket.IO

export interface SocketUser {
  id: string
  userId: string | null
  roomId: string
  username?: string | null
}

export interface SocketRoom {
  id: string
  participants: Map<string, SocketUser>
}


