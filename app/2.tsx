'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 4800) // intro duration ~4.8 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
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

      <AnimatePresence mode="wait">
        {showIntro ? (
          <CinematicIntro key="intro" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="relative z-10"
          >
            <Navbar />  
            <MainContent />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
// ── Navbar Component ───────────────────────────────
function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay: 1 }} // Appears after intro
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-6"
    >
      <div className="flex items-center justify-between w-full max-w-7xl px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
        {/* Logo */}
        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          SendWhich
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Solutions</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Resources</a>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-sm font-medium hover:text-cyan-400 transition-colors">
            Log in
          </button>
          <button className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-cyan-400 transition-all">
            Sign up
          </button>
        </div>
      </div>
    </motion.nav>
  )
}


// ── Cinematic Intro Component ───────────────────────────────
function CinematicIntro() {
  const title = "SendWhich"

  const letterVariants: any = {
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

// ── Main Landing Content (everything after intro) ────────────
function MainContent() {
  return (
    <>
      {/* Hero Section */}
     {/* Hero Section */}
<section className="min-h-screen flex items-start px-6 pt-28">
  <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

    {/* LEFT SIDE — TEXT */}
    <div className="text-left pl-6 lg:pl-12">

      <motion.h1
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.2 }}
  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-2 bbh-bogle-regular"
>
  Share Smart.<br /> Share Secure.<br />
 
</motion.h1>



      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-xl md:text-xl   text-gray-300 max-w-xl mb-10 italic"
      >
        Instantly share files, collaborate in real-time, and control access using secure private rooms.
      </motion.p>

      {/* ONLY ONE BUTTON */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="px-[30%] py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full text-lg font-semibold shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.05]"
      >
        Get Started
      </motion.button>
    </div>

    {/* RIGHT SIDE — IMAGE */}
    {/* RIGHT SIDE — IMAGE */}
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, delay: 0.4 }}
  className="relative hidden lg:block"
>
  <Image
    src="/mbl.png"   // your image in /public
    alt="SendWhich Dashboard"
    width={450}      // reduced width
    height={300}     // reduced height
    className="object-cover rounded-2xl" // optional rounding
    priority
  />

  {/* Glow behind image */}
  <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/30 to-purple-600/30 blur-3xl -z-10" />
</motion.div>


  </div>
</section>


      {/* Core Features */}
      <section className="py-24 px-6 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent"
          >
            Core Features
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: '🏠', title: 'Create Rooms', desc: 'Set up private sharing rooms.' },
              { icon: '👥', title: 'Real-Time Collaboration', desc: 'Work together instantly.' },
              { icon: '⏳', title: 'Set Expiry & Permissions', desc: 'Control access and time limits.' },
              { icon: '🔒', title: 'Secure Transfers', desc: 'End-to-end encrypted.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="bg-gradient-to-b from-slate-900/60 to-slate-950/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-md text-center"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* Effortless Sharing Section (with mock devices) */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Effortless Sharing for Teams & Individuals
            </motion.h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16">
              Share files, chat, and collaborate in private rooms.
            </p>

            {/* Mock devices - you can replace with real screenshots */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="relative z-10">
                <div className="bg-linear-to-r from-cyan-900/30 to-purple-900/30 rounded-3xl p-8 backdrop-blur-md border border-cyan-500/20">
                  <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
                    <span className="text-2xl text-cyan-400">Dashboard Preview</span>
                  </div>
                </div>
              </div>

              {/* Phone mockup - floating */}
              <div className="absolute -bottom-12 right-0 md:right-12 w-64 md:w-80 transform rotate-6 shadow-2xl">
                <div className="bg-linear-to-b from-slate-800 to-slate-950 rounded-3xl p-4 border border-slate-600">
                  <div className="aspect-9/19 bg-black rounded-2xl overflow-hidden">
                    <div className="w-full h-full bg-linear-to-br from-blue-950 to-purple-950 flex items-center justify-center">
                      <span className="text-sm text-cyan-300">Mobile View</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-16 bg-black/60 border-t border-b border-cyan-900/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { value: '500K+', label: 'Files Shared' },
                { value: 'AES-256 Bit', label: 'Encryption' },
                { value: '99.9%', label: 'Uptime Guarantee' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-gray-400 mb-8">Powered by</p>
            <div className="flex flex-wrap justify-center gap-12 items-center opacity-80">
              <span className="text-2xl font-bold">AWS</span>
              <span className="text-2xl font-bold">Node.js</span>
              <span className="text-2xl font-bold">WebRTC</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-slate-800 bg-black/60">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="mb-6">
              <span className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                SendWhich
              </span>
            </div>
            <div className="flex justify-center gap-8 mb-6">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</a>
            </div>
           <p
  suppressHydrationWarning
  className="text-gray-500 text-sm"
>
  © {new Date().getFullYear()} SendWhich. All rights reserved.
</p>

          </div>
        </footer>
      </>
  )
}