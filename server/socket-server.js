// Socket.IO Server Setup
// This file shows how to set up a separate Socket.IO server for production
// For development, you can run this alongside Next.js

const { Server } = require('socket.io')
const { createServer } = require('http')

// Create HTTP server
const httpServer = createServer()

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Store room participants
const rooms = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId)
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set())
    }
    rooms.get(roomId).add(socket.id)

    // Notify others in the room
    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id })
    
    // Send list of existing participants
    const participants = Array.from(rooms.get(roomId))
    socket.emit('room-participants', participants)
  })

  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId)
    
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id)
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId)
      }
    }

    socket.to(roomId).emit('user-left', { socketId: socket.id })
  })

  // WebRTC signaling
  socket.on('offer', ({ roomId, targetId, offer }) => {
    socket.to(targetId).emit('offer', { offer, from: socket.id })
  })

  socket.on('answer', ({ roomId, targetId, answer }) => {
    socket.to(targetId).emit('answer', { answer, from: socket.id })
  })

  socket.on('ice-candidate', ({ roomId, targetId, candidate }) => {
    socket.to(targetId).emit('ice-candidate', { candidate, from: socket.id })
  })

  // Chat messages
  socket.on('chat-message', ({ roomId, message, userId }) => {
    socket.to(roomId).emit('chat-message', { message, userId, socketId: socket.id })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    
    // Remove from all rooms
    rooms.forEach((participants, roomId) => {
      if (participants.has(socket.id)) {
        participants.delete(socket.id)
        socket.to(roomId).emit('user-left', { socketId: socket.id })
        if (participants.size === 0) {
          rooms.delete(roomId)
        }
      }
    })
  })
})

const PORT = process.env.SOCKET_PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

module.exports = { io }










