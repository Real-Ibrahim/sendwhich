// components/ui/LoadingSpinner.tsx
'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'cyan' | 'purple' | 'blue'
  message?: string
}

export default function LoadingSpinner({
  size = 'md',
  color = 'cyan',
  message = 'Loading...',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const colors = {
    cyan: 'from-cyan-400 to-cyan-600',
    purple: 'from-purple-400 to-purple-600',
    blue: 'from-blue-400 to-blue-600',
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors[color]} blur-xl opacity-70`}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute inset-2 rounded-full bg-black border-4 border-transparent bg-gradient-to-r ${colors[color]} bg-clip-border`}
        />
      </motion.div>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-lg font-medium text-gray-300"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}