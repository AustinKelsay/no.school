import type { Metadata } from "next"

import { Gift, Mail, NotebookPen } from "lucide-react"
import { MainLayout, Section } from "@/components/layout"
import { ComingSoonPlaceholder } from "@/components/placeholders/coming-soon"

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Join the no.school list for launch announcements, drops, and invites."
}

export default function SubscribePage() {
  return (
    <MainLayout>
      <Section spacing="xl">
        <ComingSoonPlaceholder
          badge="Early access"
          title="Subscribe for launch updates"
          description="We're putting the finishing touches on a frictionless signup that keeps you in the loop without the spam."
          highlights={[
            {
              icon: Mail,
              title: "Signal over noise",
              description: "Monthly digests focused on the most useful drops."
            },
            {
              icon: NotebookPen,
              title: "Creator spotlights",
              description: "First looks at new courses and behind-the-scenes interviews."
            },
            {
              icon: Gift,
              title: "Invite-only perks",
              description: "Beta seats and partner offers reserved for subscribers."
            }
          ]}
          primaryCta={{ label: "Explore content", href: "/content" }}
          secondaryCta={{ label: "Back to home", href: "/" }}
        />
      </Section>
    </MainLayout>
  )
}
