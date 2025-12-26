'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (mode === 'signup') {
      if (!formData.username.trim()) newErrors.username = 'Username is required'
      if (!formData.agreeToTerms) newErrors.terms = 'You must agree to the terms'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number'
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      // Simulate API call (replace with real auth)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsLoading(false)
      // router.push('/dashboard')
      console.log('Success!')
    }
  }

  const toggleVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

return (
    <div className="min-h-screen relative bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/bg.png"
          alt="Cosmic Background"
          className="w-full h-full object-cover brightness-[0.45] contrast-[1.15]"
          
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-indigo-950/40 to-purple-950/50" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-black/50 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8 md:p-10 shadow-2xl shadow-purple-900/20"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              S
            </span>
            <span className="text-3xl font-bold">endWhich</span>
          </div>

          {/* Toggle */}
          <div className="flex rounded-full bg-black/40 p-1.5 mb-10 border border-cyan-900/30">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode('signin')}
              className={`flex-1 py-3 rounded-full text-sm font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 rounded-full text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </motion.button>
          </div>

          {/* Animated Form Content */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode} // ← important: re-mount form when mode changes
              initial="initial"
              animate="animate"
              exit="exit"
              variants={toggleVariants}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Username - only signup */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/60 border border-cyan-900/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    placeholder="yourusername"
                  />
                  {errors.username && <p className="mt-1.5 text-sm text-red-400">{errors.username}</p>}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/60 border border-cyan-900/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/60 border border-cyan-900/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/60 border border-cyan-900/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-400">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Terms */}
              {mode === 'signup' && (
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-cyan-600 text-cyan-600 focus:ring-cyan-500 bg-black/60"
                  />
                  <label className="ml-2 text-sm text-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms</a> and{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 mt-4 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
                  isLoading
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-cyan-900/30'
                }`}
              >
                {isLoading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Switch link */}
          <p className="text-center mt-6 text-gray-400 text-sm">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer "
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>

      {/* Full-page loading overlay when submitting */}
      <AnimatePresence>
        {isLoading && <LoadingSpinner size="lg" message="Authenticating..." />}
      </AnimatePresence>
    </div> )

}