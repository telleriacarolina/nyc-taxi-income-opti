import { useEffect, useRef } from "react"

export function AutoFitText({
  children,
  min = 10,
  max = 16,
  className = "",
}: {
  children: string
  min?: number
  max?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let size = max
    el.style.fontSize = `${size}px`

    while (el.scrollWidth > el.clientWidth && size > min) {
      size -= 1
      el.style.fontSize = `${size}px`
    }
  }, [children, min, max])

  return (
    <span
      ref={ref}
      className={`block w-full whitespace-nowrap overflow-hidden ${className}`}
    >
      {children}
    </span>
  )
}
