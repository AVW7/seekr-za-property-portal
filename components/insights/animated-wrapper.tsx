"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface AnimatedWrapperProps {
  children: ReactNode
  index: number
}

export function AnimatedWrapper({ children, index }: AnimatedWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  )
}
