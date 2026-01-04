export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          created_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          owner_id: string
          name: string | null
          is_locked: boolean
          password_hash: string | null
          max_participants: number
          expires_at: string | null
          created_at: string
          status: 'active' | 'expired' | 'deleted'
        }
        Insert: {
          id?: string
          owner_id: string
          name?: string | null
          is_locked?: boolean
          password_hash?: string | null
          max_participants?: number
          expires_at?: string | null
          created_at?: string
          status?: 'active' | 'expired' | 'deleted'
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string | null
          is_locked?: boolean
          password_hash?: string | null
          max_participants?: number
          expires_at?: string | null
          created_at?: string
          status?: 'active' | 'expired' | 'deleted'
        }
      }
      room_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string | null
          joined_at: string
          left_at: string | null
          role: 'owner' | 'member'
        }
        Insert: {
          id?: string
          room_id: string
          user_id?: string | null
          joined_at?: string
          left_at?: string | null
          role?: 'owner' | 'member'
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string | null
          joined_at?: string
          left_at?: string | null
          role?: 'owner' | 'member'
        }
      }
      messages: {
        Row: {
          id: string
          room_id: string
          sender_id: string | null
          content: string
          type: 'text' | 'system'
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          sender_id?: string | null
          content: string
          type?: 'text' | 'system'
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          sender_id?: string | null
          content?: string
          type?: 'text' | 'system'
          created_at?: string
        }
      }
      file_logs: {
        Row: {
          id: string
          room_id: string
          sender_id: string | null
          file_name: string
          file_type: string
          file_size: number
          sent_at: string
        }
        Insert: {
          id?: string
          room_id: string
          sender_id?: string | null
          file_name: string
          file_type: string
          file_size: number
          sent_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          sender_id?: string | null
          file_name?: string
          file_type?: string
          file_size?: number
          sent_at?: string
        }
      }
    }
  }
}

