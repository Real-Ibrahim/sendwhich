'use client'

import { motion } from 'framer-motion'

export default function CinematicIntro() {
  const title = 'SendWhich'

  const letterVariants: any  = {
    hidden: { y: 80, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.7 + i * 0.09,
        duration: 0.9,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="relative px-6 text-center">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-purple-500/30 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.7, 0.4, 0], scale: [0.9, 1.15, 1] }}
          transition={{ duration: 5.2, times: [0, 0.35, 0.7, 1] }}
        />

        <div className="flex overflow-hidden justify-center">
          {title.split('').map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400"
            >
              {char}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 1.1 }}
          className="mt-8 text-2xl sm:text-3xl md:text-4xl font-light text-gray-200 tracking-wide"
        >
          Share Smart. Share Secure.
        </motion.p>
      </div>
    </div>
  )
}