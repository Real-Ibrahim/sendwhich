'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 md:px-12 lg:px-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mb-2 text-sm uppercase tracking-widest text-yellow-400 font-medium"
      >
        YOUR APP NAME •
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-8"
        >
          <span className="text-white">Share.</span>
          <br />
          <span className="text-yellow-400">No Strings.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Keep control with encrypted links, password protection, download tracking, 
          and auto-expiry after 7 days. Fast, private, and effortless.
        </motion.p>
      </div>
    </section>
  )
}