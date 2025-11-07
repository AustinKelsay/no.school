import type { Metadata } from "next"

import { MainLayout, Section } from "@/components/layout"
import { ComingSoonPlaceholder } from "@/components/placeholders/coming-soon"
import { BellRing, Rss, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Feeds",
  description:
    "Stay updated with curated learning feeds and real-time drops from the no.school community."
}

export default function FeedsPage() {
  return (
    <MainLayout>
      <Section spacing="xl">
        <ComingSoonPlaceholder
          title="Curated learning feeds are almost here"
          description="We're building a personalized stream that surfaces the best lessons, lightning talks, and community drops the moment they publish."
          highlights={[
            {
              icon: Rss,
              title: "Smart sources",
              description: "Blend editorial picks with your enrolled courses and topics."
            },
            {
              icon: BellRing,
              title: "Real-time alerts",
              description: "Push updates the second a mentor posts something new."
            },
            {
              icon: Sparkles,
              title: "Adaptive signal",
              description: "Feeds learn from what you watch, read, and save."
            }
          ]}
          primaryCta={{ label: "Browse courses today", href: "/courses" }}
          secondaryCta={{ label: "Back to home", href: "/" }}
        />
      </Section>
    </MainLayout>
  )
}
