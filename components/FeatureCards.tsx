'use client'

import { motion } from 'framer-motion'
import { 
  ArrowUpTrayIcon, 
  FolderIcon, 
  EnvelopeOpenIcon, 
  LockClosedIcon 
} from '@heroicons/react/24/outline'

const features = [
  {
    title: "Upload / Share File",
    description: "50 MB, keep for 7 days",
    icon: ArrowUpTrayIcon,
    accent: "from-yellow-500 to-amber-500",
  },
  {
    title: "My Files / Folders",
    description: "Files auto-delete after 7 days",
    icon: FolderIcon,
    accent: "from-yellow-600 to-amber-600",
  },
  {
    title: "Delivery Status",
    description: "Check if was opened",
    icon: EnvelopeOpenIcon,
    accent: "from-yellow-500 to-yellow-400",
  },
  {
    title: "Secure Options",
    description: "Add password or encryption",
    icon: LockClosedIcon,
    accent: "from-amber-500 to-yellow-600",
  },
]

const cardVariants = {
  initial: { y: 40, opacity: 0 },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.15 + 0.6,
      duration: 0.7
    }
  }),
  hover: { 
    y: -12, 
    scale: 1.03,
    transition: { duration: 0.4 }
  }
}

export default function FeatureCards() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="group relative bg-zinc-950/70 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 overflow-hidden h-full flex flex-col justify-between"
            >
              {/* Subtle hover gradient */}
              <div className={`absolute inset-0 bg-linear-to-br ${feature.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
              
              <div className="relative z-10">
                <feature.icon className="w-14 h-14 text-yellow-400/80 mb-8" aria-hidden="true" />
                
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-lg">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}