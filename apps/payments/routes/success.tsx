import { BadgeCheck } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { Link } from "react-router"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Heading, P } from "@/ui/typography"

export default function PaymentSuccess() {
  const [whatsNext, setWhatsNext] = useState(false)
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="flex max-w-lg flex-col items-center gap-4 p-10 text-center">
        <motion.div layout={true} className="flex flex-col items-center gap-4">
          <BadgeCheck className="size-18 fill-green-500 text-background" />

          <Heading level={1} className="font-bold">
            Payment Successful!
          </Heading>
        </motion.div>

        {!whatsNext && (
          <P className="text-muted-foreground">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </P>
        )}
        {whatsNext && (
          <ol className="fade-in mb-6 animate-in space-y-4 text-left text-muted-foreground duration-300">
            <li className="flex items-baseline gap-4">
              <Badge variant="secondary">1</Badge>
              <div>
                You should receive an email shortly confirming your access.
              </div>
            </li>
            <li className="flex items-baseline gap-4">
              <Badge variant="secondary">2</Badge>
              <div>
                Your purchase is connected to the email address you provided
                during checkout.
              </div>
            </li>
            <li className="flex items-baseline gap-4">
              <Badge variant="secondary">3</Badge>
              <div>
                Sign in with the same email address to access your content.
              </div>
            </li>
          </ol>
        )}

        <motion.div layout={true} className="flex gap-4">
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>

          {!whatsNext && (
            <Button
              variant="outline"
              disabled={whatsNext}
              onClick={() => setWhatsNext(true)}
            >
              What's next?
            </Button>
          )}

          {whatsNext && (
            <Button variant="outline" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </main>
  )
}
