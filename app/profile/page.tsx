'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { User, LogOut, Save, Trash2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user && !loading) {
      router.push('/signup')
      return
    }
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setUsername(data.profile?.username || '')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully!')
      fetchProfile()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please try again.')
    }
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
    <div className="relative min-h-screen bg-black text-white">
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

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
              {username.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{username || 'User'}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-cyan-900/50 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-black/40 border border-cyan-900/30 rounded-lg text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                {success}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/50 backdrop-blur-xl border border-red-900/30 rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Delete Account</h3>
              <p className="text-sm text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg hover:bg-red-600/30 transition-all text-red-400 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Account
              </button>
            </div>

            <div className="border-t border-red-900/30 pt-4">
              <h3 className="font-semibold mb-2">Sign Out</h3>
              <p className="text-sm text-gray-400 mb-4">
                Sign out of your account on this device.
              </p>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}








