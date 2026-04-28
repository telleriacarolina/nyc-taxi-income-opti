import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface HexagonBadgeProps {
  icon: ReactNode
  color?: string
  bgColor?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function HexagonBadge({ 
  icon, 
  color = 'oklch(0.70 0.19 195)', 
  bgColor = 'oklch(0.22 0.020 265)',
  size = 'md',
  animated = true 
}: HexagonBadgeProps) {
  const sizeMap = {
    sm: { width: 40, height: 46, iconSize: 20 },
    md: { width: 50, height: 58, iconSize: 24 },
    lg: { width: 60, height: 69, iconSize: 28 }
  }

  const dimensions = sizeMap[size]

  const hexagonPath = `polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)`

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        clipPath: hexagonPath,
        background: `linear-gradient(135deg, ${bgColor} 0%, ${color} 100%)`,
        boxShadow: `0 0 20px ${color}40, inset 0 0 15px ${color}20`
      }}
      initial={animated ? { scale: 0.9, opacity: 0 } : {}}
      animate={animated ? { scale: 1, opacity: 1 } : {}}
      transition={animated ? { 
        type: "spring", 
        stiffness: 400, 
        damping: 20,
        delay: 0.1 
      } : {}}
      whileHover={animated ? { 
        scale: 1.05,
        boxShadow: `0 0 30px ${color}60, inset 0 0 20px ${color}30`,
        transition: { type: "spring", stiffness: 500, damping: 15 }
      } : {}}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: hexagonPath,
          background: `linear-gradient(135deg, transparent 0%, ${color}15 100%)`
        }}
        initial={animated ? { opacity: 0 } : {}}
        animate={animated ? { opacity: [0.3, 0.6, 0.3] } : {}}
        transition={animated ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      />

      <motion.div
        className="absolute border-2"
        style={{
          width: '90%',
          height: '90%',
          clipPath: hexagonPath,
          borderColor: color,
          opacity: 0.3
        }}
        initial={animated ? { scale: 0.8, opacity: 0 } : {}}
        animate={animated ? { 
          scale: [0.8, 1, 0.8], 
          opacity: [0.2, 0.4, 0.2] 
        } : {}}
        transition={animated ? {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      />

      <div 
        className="relative z-10 flex items-center justify-center"
        style={{ fontSize: dimensions.iconSize }}
      >
        {icon}
      </div>
    </motion.div>
  )
}
