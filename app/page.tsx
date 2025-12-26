'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CinematicIntro from '@/components/ui/CinematicIntro'
import MainContent from '@/components/MainContent'

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 4000) // intro duration

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <CinematicIntro key="intro" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="relative z-10"
          >
            <MainContent />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}