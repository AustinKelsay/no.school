import type { Metadata } from "next"
import { BellRing, Rss, Sparkles } from "lucide-react"

import { MainLayout, Section } from "@/components/layout"
import { ComingSoonPlaceholder } from "@/components/placeholders/coming-soon"
import { copyConfig } from "@/lib/copy"

const feedsCopy = copyConfig.feeds

export const metadata: Metadata = {
  title: feedsCopy?.meta?.title ?? "Feeds",
  description:
    feedsCopy?.meta?.description ??
    "Design configurable learning feeds that blend courses, Nostr events, and community signals into a single stream."
}

export default function FeedsPage() {
  const hero = feedsCopy?.hero
  const highlights = feedsCopy?.highlights
  const cta = feedsCopy?.cta

  return (
    <MainLayout>
      <Section spacing="xl">
        <ComingSoonPlaceholder
          title={hero?.title ?? "Configurable learning feeds are almost here"}
          description={
            hero?.description ??
            "This page will showcase how to wire Nostr relays, course enrollments, and custom ranking into feeds that feel native to your community."
          }
          highlights={[
            {
              icon: Rss,
              title: highlights?.sources?.title ?? "Smart sources",
              description:
                highlights?.sources?.description ??
                "Blend editorial picks, enrolled courses, and tagged Nostr events into a single configurable stream."
            },
            {
              icon: BellRing,
              title: highlights?.alerts?.title ?? "Real-time alerts",
              description:
                highlights?.alerts?.description ??
                "Surface new lessons, drops, and releases as soon as they hit your relays."
            },
            {
              icon: Sparkles,
              title: highlights?.adaptive?.title ?? "Adaptive signal",
              description:
                highlights?.adaptive?.description ??
                "Experiment with scoring and personalization while keeping your content portable on Nostr."
            }
          ]}
          primaryCta={cta?.primary ?? { label: "Browse demo courses", href: "/courses" }}
          secondaryCta={cta?.secondary ?? { label: "Back to home", href: "/" }}
        />
      </Section>
    </MainLayout>
  )
}
