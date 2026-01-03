'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  Send, Users, Lock, Copy, Settings, X, Upload, 
  File, Image as ImageIcon, Video, FileText, Archive,
  Download
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Room, Message, FileLog } from '@/lib/types'
import { formatFileSize, getFileType } from '@/lib/utils/room'
import { createClient } from '@/lib/supabase/client'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  const { user } = useAuth()
  const [room, setRoom] = useState<Room | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [fileLogs, setFileLogs] = useState<FileLog[]>([])
  const [participants, setParticipants] = useState<any[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user && !loading) {
      router.push('/signup')
      return
    }

    fetchRoom()
    fetchMessages()
    fetchFileLogs()
    fetchParticipants()

    // Set up real-time subscriptions
    const supabase = createClient()
    const messagesSubscription = supabase
      .channel(`room:${roomId}:messages`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        fetchMessages()
      })
      .subscribe()

    const filesSubscription = supabase
      .channel(`room:${roomId}:files`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'file_logs',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        fetchFileLogs()
      })
      .subscribe()

    return () => {
      messagesSubscription.unsubscribe()
      filesSubscription.unsubscribe()
    }
  }, [roomId, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchRoom = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/dashboard')
          return
        }
        throw new Error('Failed to fetch room')
      }
      const data = await response.json()
      setRoom(data.room)
      
      // Check if password is required
      if (data.room.is_locked && !data.room.password_verified) {
        setShowPasswordModal(true)
      }
    } catch (error) {
      console.error('Error fetching room:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?room_id=${roomId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchFileLogs = async () => {
    try {
      const response = await fetch(`/api/file-logs?room_id=${roomId}`)
      if (response.ok) {
        const data = await response.json()
        setFileLogs(data.fileLogs || [])
      }
    } catch (error) {
      console.error('Error fetching file logs:', error)
    }
  }

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`)
      if (response.ok) {
        const data = await response.json()
        setParticipants(data.participants || [])
      }
    } catch (error) {
      console.error('Error fetching participants:', error)
    }
  }

  const handleJoinRoom = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          password: passwordInput,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Failed to join room')
        return
      }

      setShowPasswordModal(false)
      fetchRoom()
      fetchParticipants()
    } catch (error) {
      console.error('Error joining room:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: roomId,
          content: messageInput,
          type: 'text',
        }),
      })

      if (response.ok) {
        setMessageInput('')
        fetchMessages()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Log file in database
    try {
      await fetch('/api/file-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: roomId,
          file_name: file.name,
          file_size: file.size,
        }),
      })

      fetchFileLogs()
      // Here you would implement WebRTC file transfer
      // For now, we're just logging the file
      alert('File transfer initiated. WebRTC implementation would go here.')
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const copyRoomLink = () => {
    const link = `${window.location.origin}/room/${roomId}`
    navigator.clipboard.writeText(link)
    alert('Room link copied to clipboard!')
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-purple-400" />
      case 'video':
        return <Video className="w-5 h-5 text-red-400" />
      case 'document':
        return <FileText className="w-5 h-5 text-blue-400" />
      case 'archive':
        return <Archive className="w-5 h-5 text-yellow-400" />
      default:
        return <File className="w-5 h-5 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading room...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/bg.png"
          alt="Background"
          fill
          className="object-cover brightness-[0.45] contrast-[1.15]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-indigo-950/30 to-purple-950/40" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-xl border-b border-cyan-900/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold">{room.name || 'Room'}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users size={16} />
                <span>{participants.length} participants</span>
                {room.is_locked && <Lock size={16} />}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyRoomLink}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Copy room link"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-cyan-900/30">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] rounded-xl p-3 ${
                  message.sender_id === user?.id
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600'
                    : 'bg-black/50 border border-cyan-900/30'
                }`}>
                  {message.type === 'system' ? (
                    <p className="text-sm text-gray-400 italic">{message.content}</p>
                  ) : (
                    <>
                      {message.sender_id !== user?.id && (
                        <p className="text-xs font-semibold mb-1">
                          {message.users?.username || 'Guest'}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-cyan-900/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-black/60 border border-cyan-900/50 rounded-lg focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar - Files & Participants */}
        <div className="w-80 bg-black/50 backdrop-blur-xl border-l border-cyan-900/30 flex flex-col">
          {/* Participants */}
          <div className="p-4 border-b border-cyan-900/30">
            <h2 className="text-lg font-bold mb-3">Participants</h2>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                    {participant.users?.username?.substring(0, 2).toUpperCase() || 'G'}
                  </div>
                  <span>{participant.users?.username || 'Guest'}</span>
                  {participant.role === 'owner' && (
                    <span className="text-xs text-cyan-400">(Owner)</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="p-4 border-b border-cyan-900/30">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              Upload File
            </button>
          </div>

          {/* File Logs */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-lg font-bold mb-3">Files</h2>
            <div className="space-y-2">
              {fileLogs.length === 0 ? (
                <p className="text-sm text-gray-400">No files shared yet</p>
              ) : (
                fileLogs.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-2 bg-black/40 rounded-lg hover:bg-black/60 transition-colors"
                  >
                    {getFileIcon(file.file_type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.file_name}</p>
                      <p className="text-xs text-gray-400">{formatFileSize(file.file_size)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-black/90 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Room Password Required</h2>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter room password"
              className="w-full px-4 py-2 bg-black/60 border border-cyan-900/50 rounded-lg focus:outline-none focus:border-cyan-500 mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinRoom}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

