'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket(roomId: string, userId: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize Socket.IO connection
    // Note: In production, replace with your actual Socket.IO server URL
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
    
    const newSocket = io(socketUrl, {
      transports: ['websocket'],
      query: {
        roomId,
        userId: userId || 'guest',
      },
    })

    newSocket.on('connect', () => {
      console.log('Socket connected')
      setIsConnected(true)
      newSocket.emit('join-room', { roomId, userId })
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [roomId, userId])

  return { socket, isConnected }
}


