export interface Room {
  id: string
  owner_id: string
  name: string | null
  is_locked: boolean
  password_hash: string | null
  max_participants: number
  expires_at: string | null
  created_at: string
  status: 'active' | 'expired'
}

export interface User {
  id: string
  email: string
  username: string | null
  created_at: string
}

export interface Message {
    id: string;
    room_id: string;
    sender_id: string | null;
    content: string;
    type: 'text' | 'system';
    created_at: string;
  
    // Joined username (preferred way - clean & explicit)
    sender_username?: string | null;
  
    // Optional: if you sometimes need more user info, keep this (but prefer sender_username)
    users?: {
      username: string | null;
      // add more fields only if you actually use them (e.g. avatar_url, email, etc.)
    } | null;
  }

export interface FileLog {
  id: string
  room_id: string
  sender_id: string | null
  file_name: string
  file_type: string
  file_size: number
  sent_at: string
}

export interface RoomParticipant {
  id: string
  room_id: string
  user_id: string | null
  joined_at: string
  left_at: string | null
  role: 'owner' | 'member'
}

export interface CreateRoomInput {
  name?: string
  password?: string
  max_participants?: number
  expires_at?: string | null
}

export interface FileTransfer {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  progress: number
  status: 'pending' | 'transferring' | 'completed' | 'failed'
  senderId: string
  recipientId?: string
}

