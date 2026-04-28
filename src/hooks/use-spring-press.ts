import { type Transition } from "framer-motion"

export const springPressTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 17
}

export const springPressVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
}

export const subtleSpringVariants = {
  hover: { scale: 1.01 },
  tap: { scale: 0.99 }
}

export const boldSpringVariants = {
  hover: { scale: 1.04, y: -2 },
  tap: { scale: 0.96, y: 0 }
}
