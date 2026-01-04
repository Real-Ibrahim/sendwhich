// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, Send, ShieldCheck, History, User, LogOut, 
  Menu, X, Plus, Search, Bell, ChevronRight, Upload, Download, Users, 
  HardDrive, Lock, ExternalLink, Trash2
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import RoomCreationModal from '@/components/RoomCreationModal'
import JoinRoomModal from '@/components/JoinRoomModal'
import { Room, FileLog } from '@/lib/types'
import { formatFileSize } from '@/lib/utils/room'

type ViewType = 'dashboard' | 'my-rooms' | 'activity-history' | 'uploads' | 'downloads'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState<ViewType>('dashboard')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchStats()
      if (activeView === 'my-rooms') {
        fetchRooms()
      } else if (activeView === 'activity-history') {
        fetchActivities()
      } else if (activeView === 'uploads') {
        fetchUploads()
      } else if (activeView === 'downloads') {
        fetchDownloads()
      }
    }
  }, [user, activeView])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/rooms?status=active')
      if (response.ok) {
        const data = await response.json()
        setRooms(data.rooms || [])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/activity')
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUploads = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/activity')
      if (response.ok) {
        const data = await response.json()
        // Filter to show only files uploaded by current user
        const uploads = (data.activities || []).filter((activity: any) => activity.sender_id === user?.id)
        setActivities(uploads)
      }
    } catch (error) {
      console.error('Error fetching uploads:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDownloads = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/activity')
      if (response.ok) {
        const data = await response.json()
        // Filter to show only files downloaded by current user (files not uploaded by them)
        const downloads = (data.activities || []).filter((activity: any) => activity.sender_id !== user?.id)
        setActivities(downloads)
      }
    } catch (error) {
      console.error('Error fetching downloads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setShowLogoutConfirm(false)
    await signOut()
  }

  const handleDeleteRoomClick = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    setRoomToDelete(roomId)
    setShowDeleteConfirm(true)
  }

  const handleDeleteRoomConfirm = async () => {
    if (!roomToDelete) return

    try {
      const response = await fetch(`/api/rooms/${roomToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        // If room not found, it might have been deleted already, just refresh
        if (response.status === 404) {
          fetchRooms()
          setShowDeleteConfirm(false)
          setRoomToDelete(null)
          return
        }
        throw new Error(data.error || 'Failed to delete room')
      }

      // Refresh rooms list
      fetchRooms()
      setShowDeleteConfirm(false)
      setRoomToDelete(null)
    } catch (error: any) {
      console.error('Error deleting room:', error)
      // Only show alert if it's not a "not found" error (room already deleted)
      if (!error.message?.includes('not found')) {
        alert(error.message || 'Failed to delete room')
      }
      setShowDeleteConfirm(false)
      setRoomToDelete(null)
    }
  }

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' as ViewType },
    { icon: Users, label: 'My Rooms', view: 'my-rooms' as ViewType },
    { icon: History, label: 'Activity History', view: 'activity-history' as ViewType },
    { icon: Download, label: 'Downloads', view: 'downloads' as ViewType },
    { icon: Upload, label: 'Uploads', view: 'uploads' as ViewType },
  ]

  return (
    <div className="relative min-h-screen bg-black text-white flex overflow-hidden">
      {/* Background Image - always visible */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/bg.png"
          alt="Cosmic Nebula Background"
          fill
          className="object-cover brightness-[0.45] contrast-[1.15]"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-indigo-950/30 to-purple-950/40" />
      </div>

      {/* === SIDEBAR === */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-950/90 to-black/90 border-r border-cyan-900/30 backdrop-blur-xl md:relative md:translate-x-0"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-900/30">
                <div className="flex items-center gap-3">
                  <Image
                    src="/sw.png"
                    alt="SendWhich Logo"
                    width={48}
                    height={48}
                    priority
                    className="h-10 w-auto object-contain"
                  />
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    SendWhich
                  </span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden p-2 rounded-lg hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => {
                  const isActive = activeView === item.view || (item.view === 'dashboard' && activeView === 'dashboard')
                  return (
                    <motion.button
                      key={item.label}
                      onClick={() => {
                        setActiveView(item.view)
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-cyan-950/50 to-purple-950/50 text-cyan-400 border border-cyan-500/30' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-cyan-300'
                      }`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </motion.button>
                  )
                })}

                {/* Profile Button */}
                <motion.button
                  onClick={() => router.push('/profile')}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-gray-300 hover:bg-white/5 hover:text-cyan-300 mt-1"
                >
                  <User size={20} />
                  Profile
                </motion.button>
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-cyan-900/30">
                <motion.button
                  onClick={() => setShowLogoutConfirm(true)}
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-600/20 to-red-900/20 hover:from-red-600/30 hover:to-red-900/30 rounded-xl text-red-400 font-medium transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* === MAIN CONTENT AREA === */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-cyan-900/30">
          <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10 md:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                {activeView === 'my-rooms' ? 'My Rooms' : 
                 activeView === 'activity-history' ? 'Activity History' : 
                 activeView === 'uploads' ? 'Uploads' :
                 activeView === 'downloads' ? 'Downloads' :
                 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-white/10">
                <Search size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold">
                  {profile?.username?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{profile?.username || user?.email || 'User'}</p>
                  <p className="text-xs text-gray-400">User</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* === MAIN CONTENT === */}
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Welcome + Quick Create */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent"
                >
                  Welcome back, {profile?.username || user?.email?.split('@')[0] || 'User'}
                </motion.h1>
                <p className="text-gray-400 mt-2">Ready to share something secure today?</p>
              </div>

              <div className="flex gap-4">
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  initial="initial"
                  variants={{
                    initial: {},
                    hover: {},
                  }}
                  className="relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white shadow-lg shadow-cyan-900/30 transition-all duration-300 hover:shadow-cyan-500/40 group border border-cyan-900/40"
                >
                  {/* 1. Base gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600" />

                  {/* 2. Smooth black overlay on hover */}
                  <motion.div
                    variants={{
                      initial: { opacity: 0 },
                      hover: { opacity: 1 },
                    }}
                    transition={{
                      duration: 0.8,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 bg-black/95"
                  />

                  {/* 3. Subtle neon trace */}
                  <motion.div
                    variants={{
                      initial: { opacity: 0.6 },
                      hover: { opacity: 0.15 },
                    }}
                    transition={{
                      duration: 1.1,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-cyan-500/40"
                  />

                  {/* 4. Scanning light beam */}
                  <motion.div
                    variants={{
                      initial: { x: '-150%' },
                      hover: { x: '150%' },
                    }}
                    transition={{
                      duration: 1.2,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-12deg] opacity-70"
                  />

                  {/* 5. Content */}
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <motion.div
                      variants={{
                        initial: { rotate: 0 },
                        hover: { rotate: 360 },
                      }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                      <Plus size={22} strokeWidth={2.5} className="text-white" />
                    </motion.div>
                    <span className="tracking-wide">Create New Room</span>
                  </div>

                  {/* 6. Outer glowing border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_6px_rgba(34,211,238,0.35)] transition-all duration-700" />
                </motion.button>

                {activeView === 'dashboard' && (
                  <motion.button
                    onClick={() => setShowJoinModal(true)}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    initial="initial"
                    variants={{
                      initial: {},
                      hover: {},
                    }}
                    className="relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white shadow-lg shadow-purple-900/30 transition-all duration-300 hover:shadow-purple-500/40 group border border-purple-900/40"
                  >
                    {/* 1. Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />

                    {/* 2. Smooth black overlay on hover */}
                    <motion.div
                      variants={{
                        initial: { opacity: 0 },
                        hover: { opacity: 1 },
                      }}
                      transition={{
                        duration: 0.8,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-black/95"
                    />

                    {/* 3. Subtle neon trace */}
                    <motion.div
                      variants={{
                        initial: { opacity: 0.6 },
                        hover: { opacity: 0.15 },
                      }}
                      transition={{
                        duration: 1.1,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-purple-500/40"
                    />

                    {/* 4. Scanning light beam */}
                    <motion.div
                      variants={{
                        initial: { x: '-150%' },
                        hover: { x: '150%' },
                      }}
                      transition={{
                        duration: 1.2,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-12deg] opacity-70"
                    />

                    {/* 5. Content */}
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      <motion.div
                        variants={{
                          initial: { rotate: 0 },
                          hover: { rotate: 360 },
                        }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      >
                        <Users size={22} strokeWidth={2.5} className="text-white" />
                      </motion.div>
                      <span className="tracking-wide">Join Room</span>
                    </div>

                    {/* 6. Outer glowing border */}
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-purple-400/50 group-hover:shadow-[0_0_20px_6px_rgba(168,85,247,0.35)] transition-all duration-700" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Content based on active view */}
            {activeView === 'dashboard' && (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { 
                      title: 'Total Rooms', 
                      value: stats?.totalRooms || 0, 
                      icon: Users, 
                      color: 'cyan',
                      desc: 'Active rooms'
                    },
                    { 
                      title: 'Files Shared', 
                      value: stats?.totalFiles || 0, 
                      icon: Upload, 
                      color: 'purple',
                      desc: 'Total files'
                    },
                    { 
                      title: 'Total Size', 
                      value: formatFileSize(stats?.totalSize || 0), 
                      icon: HardDrive, 
                      color: 'emerald',
                      desc: 'Shared data'
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="relative bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8 hover:border-cyan-500/50 transition-all group overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                      
                      <div className={`w-14 h-14 rounded-xl bg-${stat.color}-950/40 flex items-center justify-center mb-6 group-hover:bg-${stat.color}-900/40 transition-colors relative z-10`}>
                        <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 relative z-10">{stat.title}</h3>
                      <p className={`text-3xl font-bold mb-1 text-${stat.color}-400 relative z-10`}>{stat.value}</p>
                      <p className="text-sm text-gray-400 relative z-10">{stat.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Simple Transfer', desc: 'Fast, no-frills file sharing', icon: Send, color: 'cyan' },
                    { title: 'Encrypted Transfer', desc: 'Zero-knowledge, maximum security', icon: ShieldCheck, color: 'purple' },
                    { title: 'Create Room', desc: 'Collaborate in private space', icon: Users, color: 'emerald' },
                  ].map((action, i) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="relative bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8 hover:border-cyan-500/50 transition-all cursor-pointer group overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                      
                      <div className={`w-14 h-14 rounded-xl bg-${action.color}-950/40 flex items-center justify-center mb-6 group-hover:bg-${action.color}-900/40 transition-colors relative z-10`}>
                        <action.icon className={`w-8 h-8 text-${action.color}-400`} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 relative z-10">{action.title}</h3>
                      <p className="text-gray-400 relative z-10">{action.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                  
                  <div className="space-y-6">
                    {[
                      { type: 'upload', name: 'project_video_final_4k.mp4', size: '2.3 GB', time: '12 min ago', user: 'You' },
                      { type: 'room', name: 'Client Review Room', participants: 4, time: '45 min ago' },
                      { type: 'download', name: 'design_system_v2.fig', size: '148 MB', time: '2 hr ago', user: 'Sarah Chen' },
                      { type: 'share', name: 'Q4 Report.pdf', size: '4.1 MB', time: '3 hr ago' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 py-3 border-b border-cyan-900/20 last:border-0"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          {item.type === 'upload' && <Upload size={20} className="text-cyan-400" />}
                          {item.type === 'download' && <Download size={20} className="text-blue-400" />}
                          {item.type === 'room' && <Users size={20} className="text-purple-400" />}
                          {item.type === 'share' && <Send size={20} className="text-emerald-400" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-gray-400">
                            {item.size && `${item.size} • `}
                            {item.time} {item.user && `• ${item.user}`}
                          </p>
                        </div>

                        <button className="p-2 rounded-lg hover:bg-white/10">
                          <ChevronRight size={18} className="text-gray-400" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeView === 'my-rooms' && (
              <div className="bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">My Rooms</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading rooms...</p>
                  </div>
                ) : rooms.length === 0 ? (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No rooms found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/40 border border-cyan-900/30 rounded-xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer relative"
                        onClick={() => router.push(`/room/${room.id}`)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-bold text-lg flex-1">{room.name || 'Unnamed Room'}</h3>
                          <div className="flex items-center gap-2">
                            {room.is_locked && <Lock size={18} className="text-yellow-400" />}
                            {room.owner_id === user?.id && (
                              <button
                                onClick={(e) => handleDeleteRoomClick(room.id, e)}
                                className="p-1.5 rounded-lg hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                                title="Delete room"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-400">
                          <p>Max Participants: {room.max_participants}</p>
                          {room.expires_at && (
                            <p>Expires: {new Date(room.expires_at).toLocaleString()}</p>
                          )}
                          <p className="text-xs">Created: {new Date(room.created_at).toLocaleDateString()}</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/room/${room.id}`)
                          }}
                          className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                          Open Room
                          <ExternalLink size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeView === 'activity-history' && (
              <div className="bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Activity History</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading activities...</p>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-12">
                    <History size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No activities found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity: any) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 py-4 border-b border-cyan-900/20 last:border-0"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <Upload size={20} className="text-cyan-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{activity.file_name}</p>
                          <p className="text-sm text-gray-400">
                            {formatFileSize(activity.file_size)} • {new Date(activity.sent_at).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Room: {activity.rooms?.name || 'Unnamed Room'} • 
                            {activity.users?.username ? ` By: ${activity.users.username}` : ' By: Unknown'}
                          </p>
                        </div>

                        <button 
                          onClick={() => router.push(`/room/${activity.room_id}`)}
                          className="p-2 rounded-lg hover:bg-white/10"
                        >
                          <ChevronRight size={18} className="text-gray-400" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeView === 'uploads' && (
              <div className="bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Uploads</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading uploads...</p>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-12">
                    <Upload size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No uploads found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity: any) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 py-4 border-b border-cyan-900/20 last:border-0"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <Upload size={20} className="text-purple-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{activity.file_name}</p>
                          <p className="text-sm text-gray-400">
                            {formatFileSize(activity.file_size)} • {new Date(activity.sent_at).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Room: {activity.rooms?.name || 'Unnamed Room'}
                          </p>
                        </div>

                        <button 
                          onClick={() => router.push(`/room/${activity.room_id}`)}
                          className="p-2 rounded-lg hover:bg-white/10"
                        >
                          <ChevronRight size={18} className="text-gray-400" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeView === 'downloads' && (
              <div className="bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Downloads</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading downloads...</p>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-12">
                    <Download size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No downloads found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity: any) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 py-4 border-b border-cyan-900/20 last:border-0"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <Download size={20} className="text-blue-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{activity.file_name}</p>
                          <p className="text-sm text-gray-400">
                            {formatFileSize(activity.file_size)} • {new Date(activity.sent_at).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Room: {activity.rooms?.name || 'Unnamed Room'} • 
                            {activity.users?.username ? ` From: ${activity.users.username}` : ' From: Unknown'}
                          </p>
                        </div>

                        <button 
                          onClick={() => router.push(`/room/${activity.room_id}`)}
                          className="p-2 rounded-lg hover:bg-white/10"
                        >
                          <ChevronRight size={18} className="text-gray-400" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>    
        </main>
      </div>

      {/* Modals */}
      <RoomCreationModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <JoinRoomModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />

      {/* Delete Room Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => {
                setShowDeleteConfirm(false)
                setRoomToDelete(null)
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-black/90 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Delete Room</h2>
                <p className="text-gray-300 mb-6">Are you sure you want to delete this room? This action cannot be undone.</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setRoomToDelete(null)
                    }}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteRoomConfirm}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-black/90 backdrop-blur-xl border border-red-900/50 rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Confirm Logout</h2>
                <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 rounded-lg hover:from-red-500 hover:to-red-700 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
