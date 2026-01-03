'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface PeerConnection {
  peerConnection: RTCPeerConnection
  dataChannel: RTCDataChannel | null
  id: string
}

export function useWebRTC(roomId: string, userId: string) {
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map())
  const [isConnected, setIsConnected] = useState(false)
  const localPeerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<any>(null)

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  }

  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(iceServers)
    
    // Create data channel for file transfer
    const dataChannel = pc.createDataChannel('files', {
      ordered: true,
    })

    dataChannel.onopen = () => {
      console.log('Data channel opened with', peerId)
      setIsConnected(true)
    }

    dataChannel.onerror = (error) => {
      console.error('Data channel error:', error)
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          roomId,
          targetId: peerId,
          candidate: event.candidate,
        })
      }
    }

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState)
      if (pc.connectionState === 'connected') {
        setIsConnected(true)
      }
    }

    return pc
  }, [roomId])

  const sendFile = useCallback(async (
    peerId: string,
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    const peer = peers.get(peerId)
    if (!peer?.dataChannel || peer.dataChannel.readyState !== 'open') {
      throw new Error('Data channel not ready')
    }

    const chunkSize = 16 * 1024 // 16KB chunks
    const totalChunks = Math.ceil(file.size / chunkSize)
    let sentChunks = 0

    // Send file metadata first
    const metadata = {
      type: 'file',
      name: file.name,
      size: file.size,
      mimeType: file.type,
      totalChunks,
    }

    peer.dataChannel.send(JSON.stringify(metadata))

    // Send file in chunks
    const reader = new FileReader()
    let offset = 0

    return new Promise<void>((resolve, reject) => {
      reader.onload = (e) => {
        if (e.target?.result) {
          peer.dataChannel!.send(e.target.result as ArrayBuffer)
          sentChunks++
          offset += chunkSize

          if (onProgress) {
            onProgress((sentChunks / totalChunks) * 100)
          }

          if (offset < file.size) {
            const chunk = file.slice(offset, offset + chunkSize)
            reader.readAsArrayBuffer(chunk)
          } else {
            // Send completion signal
            peer.dataChannel!.send(JSON.stringify({ type: 'file-complete' }))
            resolve()
          }
        }
      }

      reader.onerror = reject

      const firstChunk = file.slice(0, chunkSize)
      reader.readAsArrayBuffer(firstChunk)
    })
  }, [peers])

  useEffect(() => {
    return () => {
      // Cleanup: close all peer connections
      peers.forEach((peer) => {
        peer.peerConnection.close()
      })
      if (localPeerConnectionRef.current) {
        localPeerConnectionRef.current.close()
      }
    }
  }, [peers])

  return {
    peers,
    isConnected,
    sendFile,
    createPeerConnection,
  }
}


