import { motion } from "motion/react"

export const AnimatedSubtleBlurBackground = () => {
  return (
    <motion.div
      className="absolute inset-0 -z-10 opacity-30"
      animate={{
        background: [
          "radial-gradient(ellipse at 30% 30%, color-mix(in srgb, var(--foreground) 30%, transparent), transparent 40%), radial-gradient(ellipse at 70% 70%, color-mix(in srgb, var(--color-foreground) 25%, transparent), transparent 40%)",
          "radial-gradient(ellipse at 70% 30%, color-mix(in srgb, var(--foreground) 25%, transparent), transparent 40%), radial-gradient(ellipse at 30% 70%, color-mix(in srgb, var(--color-foreground) 30%, transparent), transparent 40%)",
          "radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--foreground) 28%, transparent), transparent 40%), radial-gradient(ellipse at 80% 20%, color-mix(in srgb, var(--color-foreground) 30%, transparent), transparent 40%)",
          "radial-gradient(ellipse at 30% 30%, color-mix(in srgb, var(--foreground) 30%, transparent), transparent 40%), radial-gradient(ellipse at 70% 70%, color-mix(in srgb, var(--color-foreground) 25%, transparent), transparent 40%)",
        ],
      }}
      transition={{
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  )
}

export const AnimatedCyberpunkGrid = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden opacity-40">
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--foreground) 1px, transparent 1px),
            linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 30%, color-mix(in srgb, var(--foreground) 30%, transparent), transparent 40%), radial-gradient(ellipse at 70% 70%, color-mix(in srgb, var(--color-foreground) 25%, transparent), transparent 40%)",
            "radial-gradient(ellipse at 70% 30%, color-mix(in srgb, var(--foreground) 25%, transparent), transparent 40%), radial-gradient(ellipse at 30% 70%, color-mix(in srgb, var(--color-foreground) 30%, transparent), transparent 40%)",
            "radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--foreground) 28%, transparent), transparent 40%), radial-gradient(ellipse at 80% 20%, color-mix(in srgb, var(--color-foreground) 30%, transparent), transparent 40%)",
            "radial-gradient(ellipse at 30% 30%, color-mix(in srgb, var(--foreground) 30%, transparent), transparent 40%), radial-gradient(ellipse at 70% 70%, color-mix(in srgb, var(--color-foreground) 25%, transparent), transparent 40%)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
