'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { isValidRoomId } from '@/lib/utils/room'

interface JoinRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const [roomLink, setRoomLink] = useState('')
  const [roomId, setRoomId] = useState('')
  const [roomInfo, setRoomInfo] = useState<any>(null)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRoomInfo, setIsLoadingRoomInfo] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Extract room ID from link
  useEffect(() => {
    if (!roomLink.trim()) {
      setRoomId('')
      setRoomInfo(null)
      setError('')
      return
    }

    // Try to extract room ID from URL
    try {
      const url = new URL(roomLink)
      const pathParts = url.pathname.split('/')
      const idFromUrl = pathParts[pathParts.length - 1]
      
      if (isValidRoomId(idFromUrl)) {
        setRoomId(idFromUrl)
      } else {
        // Try if the link is just the ID
        if (isValidRoomId(roomLink.trim())) {
          setRoomId(roomLink.trim())
        } else {
          setRoomId('')
          setRoomInfo(null)
          setError('Invalid room link format')
        }
      }
    } catch {
      // If it's not a URL, try if it's just the ID
      if (isValidRoomId(roomLink.trim())) {
        setRoomId(roomLink.trim())
      } else {
        setRoomId('')
        setRoomInfo(null)
        setError('Invalid room link format')
      }
    }
  }, [roomLink])

  // Fetch room info when roomId changes
  useEffect(() => {
    if (!roomId || !isValidRoomId(roomId)) {
      setRoomInfo(null)
      return
    }

    const fetchRoomInfo = async () => {
      setIsLoadingRoomInfo(true)
      setError('')
      try {
        const response = await fetch(`/api/rooms/${roomId}`)
        if (response.ok) {
          const data = await response.json()
          setRoomInfo(data.room)
        } else {
          const data = await response.json()
          setError(data.error || 'Room not found')
          setRoomInfo(null)
        }
      } catch (err: any) {
        setError('Failed to fetch room information')
        setRoomInfo(null)
      } finally {
        setIsLoadingRoomInfo(false)
      }
    }

    fetchRoomInfo()
  }, [roomId])

  const handleJoin = async () => {
    if (!roomId || !isValidRoomId(roomId)) {
      setError('Please enter a valid room link')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          password: password || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join room')
      }

      // Success - navigate to room
      router.push(`/room/${roomId}`)
      onClose()
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setRoomLink('')
    setRoomId('')
    setRoomInfo(null)
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/90 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  Join Room
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Link
                  </label>
                  <input
                    type="text"
                    value={roomLink}
                    onChange={(e) => setRoomLink(e.target.value)}
                    className="w-full px-4 py-2 bg-black/60 border border-cyan-900/50 rounded-lg focus:outline-none focus:border-cyan-500"
                    placeholder="https://yourapp.com/room/room-id or room-id"
                  />
                </div>

                {isLoadingRoomInfo && roomId && (
                  <div className="text-sm text-cyan-400">Loading room information...</div>
                )}

                {roomInfo && (
                  <div className="bg-cyan-950/20 border border-cyan-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-cyan-400">{roomInfo.name || 'Unnamed Room'}</h3>
                      {roomInfo.is_locked && <Lock size={16} className="text-yellow-400" />}
                    </div>
                    <p className="text-sm text-gray-400">
                      Max Participants: {roomInfo.max_participants}
                    </p>
                    {roomInfo.expires_at && (
                      <p className="text-sm text-gray-400">
                        Expires: {new Date(roomInfo.expires_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {roomInfo && roomInfo.is_locked && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-black/60 border border-cyan-900/50 rounded-lg focus:outline-none focus:border-cyan-500"
                      placeholder="Enter room password"
                      required
                    />
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={isLoading || !roomInfo || (roomInfo?.is_locked && !password)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Joining...' : 'Join Room'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

