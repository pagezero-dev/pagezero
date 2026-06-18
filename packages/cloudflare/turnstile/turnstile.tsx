import { useInView } from "motion/react"
import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: object) => string
      remove: (widgetId: string) => void
    }
    onloadTurnstileCallback: () => void
  }
}

interface TurnstileProps {
  siteKey: string
  /** When this changes, the widget is torn down and re-rendered */
  subjectKey?: string
}

export const Turnstile = ({ siteKey, subjectKey }: TurnstileProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const isInView = useInView(containerRef, { once: true, margin: "-80px" })

  // Load the turnstile script
  useEffect(() => {
    const script = document.createElement("script")
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback"
    script.async = true
    script.defer = true

    window.onloadTurnstileCallback = () => {
      setIsLoaded(true)
    }

    document.body.appendChild(script)

    return () => {
      setIsLoaded(false)
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Render the turnstile widget once the script is ready and the placeholder is in view
  // biome-ignore lint/correctness/useExhaustiveDependencies: executing effect on siteKey, subjectKey, isLoaded, isInView change is expected
  useEffect(() => {
    const ref = containerRef.current
    if (!isLoaded || !isInView || !ref) {
      return
    }

    window.turnstile?.render(ref, {
      sitekey: siteKey,
    })

    return () => {
      if (ref?.hasChildNodes()) {
        ref.replaceChildren()
      }
    }
  }, [siteKey, subjectKey, isLoaded, isInView])

  return <div ref={containerRef} />
}
