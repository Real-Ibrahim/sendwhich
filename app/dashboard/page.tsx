'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, Send, ShieldCheck, History, User, LogOut, 
  Menu, X, Plus, Search, Bell, ChevronRight, Upload, Download, Users, 
  HardDrive, Copy, Clock, Lock
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import RoomCreationModal from '@/components/RoomCreationModal'
import { Room } from '@/lib/types'
import { formatFileSize } from '@/lib/utils/room'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeRooms, setActiveRooms] = useState<Room[]>([])
  const [expiredRooms, setExpiredRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalFiles: 0,
    totalSize: 0,
  })
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchRooms()
      fetchUserProfile()
      fetchStats()
    }
  }, [user])

  const fetchRooms = async () => {
    try {
      const [activeRes, expiredRes] = await Promise.all([
        fetch('/api/rooms?status=active'),
        fetch('/api/rooms?status=expired'),
      ])

      const activeData = await activeRes.json()
      const expiredData = await expiredRes.json()

      setActiveRooms(activeData.rooms || [])
      setExpiredRooms(expiredData.rooms || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.profile)
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
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const copyRoomLink = (roomId: string) => {
    const link = `${window.location.origin}/room/${roomId}`
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  const getUserInitials = () => {
    if (userProfile?.username) {
      return userProfile.username.substring(0, 2).toUpperCase()
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex overflow-hidden">
      {/* Background Image */}
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

      {/* Sidebar */}
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
              <div className="flex items-center justify-between p-6 border-b border-cyan-900/30">
                <Link href="/dashboard" className="flex items-center gap-3">
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
                </Link>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden p-2 rounded-lg hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {[
                  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
                  { icon: Users, label: 'My Rooms', href: '/dashboard', active: false },
                  { icon: History, label: 'Activity History', href: '/dashboard', active: false },
                  { icon: User, label: 'Profile', href: '/profile', active: false },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      item.active 
                        ? 'bg-gradient-to-r from-cyan-950/50 to-purple-950/50 text-cyan-400 border border-cyan-500/30' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-cyan-300'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-cyan-900/30">
                <motion.button
                  onClick={signOut}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
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
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold">
                  {getUserInitials()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{userProfile?.username || user?.email}</p>
                  <p className="text-xs text-gray-400">User</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Welcome + Create Room */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent"
                >
                  Welcome back, {userProfile?.username || 'User'}
                </motion.h1>
                <p className="text-gray-400 mt-2">Ready to share something secure today?</p>
              </div>

              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-semibold shadow-lg shadow-cyan-900/30 hover:shadow-cyan-500/40 transition-all flex items-center gap-3"
              >
                <Plus size={22} />
                Create New Room
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Rooms', value: stats.totalRooms, icon: Users, color: 'cyan' },
                { label: 'Files Shared', value: stats.totalFiles, icon: Upload, color: 'purple' },
                { label: 'Total Size', value: formatFileSize(stats.totalSize), icon: HardDrive, color: 'emerald' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Active Rooms */}
            <div className="bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Active Rooms</h2>
              {activeRooms.length === 0 ? (
                <p className="text-gray-400">No active rooms. Create one to get started!</p>
              ) : (
                <div className="space-y-4">
                  {activeRooms.map((room) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-black/40 border border-cyan-900/20 rounded-xl hover:border-cyan-500/50 transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-cyan-950/40 flex items-center justify-center">
                          {room.is_locked ? <Lock size={20} className="text-cyan-400" /> : <Users size={20} className="text-cyan-400" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{room.name || 'Untitled Room'}</h3>
                          <p className="text-sm text-gray-400">
                            Created {new Date(room.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyRoomLink(room.id)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          title="Copy link"
                        >
                          <Copy size={18} />
                        </button>
                        <Link
                          href={`/room/${room.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all"
                        >
                          Open
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Expired Rooms */}
            {expiredRooms.length > 0 && (
              <div className="bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Expired Rooms</h2>
                <div className="space-y-4">
                  {expiredRooms.slice(0, 5).map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-4 bg-black/40 border border-cyan-900/20 rounded-xl opacity-60"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                          <Clock size={20} className="text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{room.name || 'Untitled Room'}</h3>
                          <p className="text-sm text-gray-400">
                            Expired {room.expires_at ? new Date(room.expires_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <RoomCreationModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  )
}
