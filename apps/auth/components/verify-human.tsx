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

interface VerifyHumanProps {
  siteKey: string
  subjectKey?: string
}

export const VerifyHuman = ({ siteKey, subjectKey }: VerifyHumanProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load the turnstile script
  // biome-ignore lint/correctness/useExhaustiveDependencies: executing effect on siteKey change is expected
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
  }, [siteKey])

  // Render the turnstile widget
  // biome-ignore lint/correctness/useExhaustiveDependencies: executing effect on siteKey, subjectKey, isLoaded change is expected
  useEffect(() => {
    const ref = containerRef.current
    if (isLoaded && ref) {
      window.turnstile?.render(ref, {
        sitekey: siteKey,
      })
    }

    return () => {
      if (ref?.hasChildNodes()) {
        ref.replaceChildren()
      }
    }
  }, [siteKey, subjectKey, isLoaded])

  return <div ref={containerRef} />
}
