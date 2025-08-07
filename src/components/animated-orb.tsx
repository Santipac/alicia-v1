import { motion } from 'motion/react'

export default function AnimatedOrb() {

  return (
    <motion.div
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="relative"
    >
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-48 h-48 md:w-64 md:h-64 relative"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-pink-300 to-white opacity-90 blur-sm" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-500 via-pink-400 to-white" />
        <motion.div
          animate={{
            scale: [1.1, 1.1, 1.1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-4 rounded-full bg-gradient-to-br from-violet-300 via-pink-200 to-white"
        />
      </motion.div>
    </motion.div>
  )
}
