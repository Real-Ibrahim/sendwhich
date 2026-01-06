'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Clock, HardDrive, Globe, BarChart3 } from 'lucide-react'
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
            <StylishFeatures />            
            <AfterFeatures />                  

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
// ── Navbar Component ───────────────────────────────
function Navbar() {
  // Smooth scroll function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const yOffset = -120; // adjust for fixed navbar height
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay: 1 }} 
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-6"
    >
      <div className="flex items-center justify-between w-full max-w-7xl px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
        {/* Logo */}
        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          SendWhich
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <button onClick={() => scrollToSection("features")} className="hover:text-cyan-400 transition-colors">
            Features
          </button>
          <button onClick={() => scrollToSection("preview")} className="hover:text-cyan-400 transition-colors">
            Preview
          </button>
          <button onClick={() => scrollToSection("testimonials")} className="hover:text-cyan-400 transition-colors">
            Testimonials
          </button>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <a href="/signup" id="login-btn" className="hidden sm:block text-sm font-medium hover:text-cyan-400 transition-colors">
            Log in
          </a>
          <a href="/signup" className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-cyan-400 transition-all">
            Sign up
          </a>
        </div>
      </div>
    </motion.nav>
  );
}


// ── Cinematic Intro Component ───────────────────────────────
function CinematicIntro() {
  const title = "SendWhich?"

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
      <section className="min-h-screen flex items-center px-6 pt-28">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE — TEXT */}
          <div className="text-left pl-6 lg:pl-12">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-2 bbh-bogle-regular"
            >
              Share Smart.<br /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-gradient-x">
                Share Secure.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl md:text-xl text-gray-300 max-w-xl mb-10 italic"
            >
              Instantly share files, collaborate in real-time, and control access using secure private rooms.
            </motion.p>

            <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="px-[30%] py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-lg font-semibold shadow-lg shadow-cyan-500/50 transition-all duration-300 hover:scale-[1.05] hover:shadow-xl hover:shadow-cyan-400/50"
            onClick={() => {
              window.location.href = '/signup';
            }}
          >
            Get Started
          </motion.button>

          </div>

          {/* RIGHT SIDE — IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative hidden lg:flex justify-center items-start"
          >
            {/* Fixed size wrapper, no extra borders */}
            <div className="w-[500px] h-[340px] relative">
              <Image
                src="/mbls.png"
                alt="SendWhich Dashboard"
                fill
                className="object-cover rounded-2xl"
                priority
              />

              {/* Optional subtle glow behind image */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-600/20 blur-3xl -z-10" />
            </div>
          </motion.div>

        </div>

        {/* Tailwind Gradient Animation */}
        <style jsx>{`
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 6s ease infinite;
          }
        `}</style>
      </section>
    </>
  )
}


 function StylishFeatures() {
  const features = [
    {
      icon: <Shield className="w-10 h-10 text-cyan-400" />,
      title: "End-to-End Encryption",
      desc: "All files are encrypted before leaving your device. Only your recipients can access them.",
    },
    {
      icon: <Zap className="w-10 h-10 text-purple-400" />,
      title: "Real-Time Collaboration",
      desc: "Work together instantly, share updates, and manage files in private secure rooms.",
    },
    {
      icon: <Clock className="w-10 h-10 text-pink-400" />,
      title: "Set Expiry & Permissions",
      desc: "Control how long files are accessible and who can view, edit, or download them.",
    },
    {
      icon: <HardDrive className="w-10 h-10 text-blue-400" />,
      title: "Unlimited Storage",
      desc: "Save and share large files without worrying about space or limits.",
    },
    {
      icon: <Globe className="w-10 h-10 text-emerald-400" />,
      title: "Cross-Platform Access",
      desc: "SendWhich works seamlessly across mobile, tablet, and desktop devices.",
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-yellow-400" />,
      title: "Activity Tracking",
      desc: "Monitor file downloads, access logs, and maintain full control over your data.",
    },
  ];

  return (
    <section id="features" className="relative py-32 px-6 bg-[#030712] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            className="text-cyan-400 font-semibold tracking-widest uppercase text-sm"
          >
            Why Choose SendWhich?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-5xl md:text-6xl font-extrabold mt-4 text-white tracking-tight"
          >
            The future of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              secure sharing.
            </span>
          </motion.h2>
        </div>

        {/* Two cards per row, long style */}
        <div className="flex flex-col gap-16">
          {[0, 1, 2].map((rowIndex) => {
            const leftIndex = rowIndex * 2;
            const rightIndex = leftIndex + 1;

            return (
              <div
                key={rowIndex}
                className="flex flex-col md:flex-row gap-12 justify-center items-start"
              >
                {[leftIndex, rightIndex].map((i, idx) => {
                  if (!features[i]) return null;
                  const isLeft = idx === 0;
                  const yOffset = rowIndex * 20; // stagger rows slightly

                  return (
                    <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -250 : 250 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isLeft ? -250 : 250 }}
                  viewport={{ once: false, amount: 0.1 }} // triggers at 10% visibility
                  transition={{
                    duration: 0.8, // slightly faster for smooth feel
                    ease: "easeOut", // smooth easing
                    // delay removed
                  }}
                  className="group relative p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/20 transition-all"
                  style={{
                    marginTop: `${yOffset}px`,
                    width: "380px",
                    height: "220px",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />

                  <div className="relative z-10 flex flex-col md:flex-row gap-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: false, amount: 0.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/[0.05] ring-1 ring-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                    >
                      {features[i].icon}
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                        {features[i].title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                        {features[i].desc}
                      </p>
                    </div>
                  </div>
                </motion.div>

                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function AfterFeatures() {
  const reviews = [
  {
    name: "Alex Rivera",
    role: "Lead Designer at Velo",
    comment: "The easiest way to send large assets to clients without worrying about security leaks. The UI is just gorgeous.",
    avatar: "AR",
    rating: 4 // Add this
  },
  {
    name: "Sarah Chen",
    role: "Security Researcher",
    comment: "Finally, a sharing platform that takes AES-256 seriously. The private rooms feature is a game changer for our audits.",
    avatar: "SC",
    rating: 5 // Add this
  },
  {
    name: "James Wilson",
    role: "Freelance Videographer",
    comment: "Blazing fast upload speeds. I can move 4K raw footage effortlessly. Best decision for my workflow this year.",
    avatar: "JW",
    rating: 4 // Add this
  },
  {
    name: "Elena Rodriguez",
    role: "Product Manager",
    comment: "Real-time collaboration in private rooms has cut our feedback loop in half. It's more than just file sharing.",
    avatar: "ER",
    rating: 5 // Add this
  }
];
  return (
    <>
      {/* Effortless Sharing Section */}
      <section id="preview" className="py-24 px-6">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto"
          >
           <motion.div
  initial={{ opacity: 0, scale: 0.92 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  /* Reduced the overall container width from 5xl to 3xl/4xl to shrink the dashboard */
  className="relative max-w-3xl mx-auto" 
>
  {/* Main Dashboard Preview Container */}
<div className="relative z-10">
  <div className="bg-linear-to-r from-cyan-900/30 to-purple-900/30 rounded-3xl p-6 backdrop-blur-md border border-cyan-500/20">
    <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
      {/* Dashboard Image Yahan Lagegi */}
      <img 
        src="/dashboard-image.png" 
        alt="Dashboard Preview" 
        className="w-full h-full object-cover" 
      />
    </div>
  </div>
</div>

{/* Floating Phone Mockup */}
<div className="absolute -bottom-10 -right-4 md:-right-8 w-48 md:w-56 transform rotate-6 shadow-2xl z-20">
  <div className="bg-linear-to-b from-slate-800 to-slate-950 rounded-[2.5rem] p-3 border border-slate-600">
    <div className="aspect-[9/19] bg-black rounded-[2rem] overflow-hidden flex items-center justify-center">
      {/* Mobile Image Yahan Lagegi */}
      <img 
        src="/mobile-image.png" 
        alt="Mobile View" 
        className="w-full h-full object-cover" 
      />
    </div>
  </div>
</div>
</motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION (Added immediately after) --- */}
     <section id="testimonials" className="py-32 px-6 relative">
  <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Trusted by Creators</h2>
      <p className="text-gray-400">Join thousands of users sharing smarter every day.</p>
    </div>

    {/* Testimonials Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
      {reviews.map((review, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="w-full max-w-sm p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-cyan-500/30 transition-all group"
        >
          {/* Avatar and Name */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-black">
              {review.avatar}
            </div>
            <div className="text-left">
              <h4 className="text-white font-bold group-hover:text-cyan-400 transition-colors">{review.name}</h4>
              <p className="text-gray-500 text-sm">{review.role}</p>
            </div>
          </div>

          {/* Star Ratings */}
          <div className="flex items-center gap-1 mb-4">
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <span
                  key={idx}
                  className={`text-yellow-400 ${idx < review.rating ? 'opacity-100' : 'opacity-30'}`}
                >
                  ★
                </span>
              ))}
          </div>

          {/* Comment */}
          <p className="text-gray-300 leading-relaxed italic text-left">
            "{review.comment}"
          </p>
        </motion.div>
      ))}
    </div>
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
          <p suppressHydrationWarning className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SendWhich. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}