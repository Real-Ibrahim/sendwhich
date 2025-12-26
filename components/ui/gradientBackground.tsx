'use client'

import { motion } from 'framer-motion'

export default function GradientBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-indigo-950/40 via-black to-black"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Subtle moving light blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/10 to-cyan-500/10 rounded-full blur-3xl"
        animate={{
          x: ['-10%', '10%', '-10%'],
          y: ['-15%', '15%', '-15%'],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-tl from-blue-600/10 to-pink-600/5 rounded-full blur-3xl"
        animate={{
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}