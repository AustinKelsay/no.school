import type { Metadata } from "next"

import { Gift, Mail, NotebookPen } from "lucide-react"
import { MainLayout, Section } from "@/components/layout"
import { ComingSoonPlaceholder } from "@/components/placeholders/coming-soon"
import { copyConfig } from "@/lib/copy"

const subscribeCopy = copyConfig.subscribe

export const metadata: Metadata = {
  title: subscribeCopy?.meta?.title ?? "Subscribe",
  description:
    subscribeCopy?.meta?.description ??
    "Get updates about new features, deployment recipes, and customization tips for running this Nostr-native education stack under your own brand."
}

export default function SubscribePage() {
  const hero = subscribeCopy?.hero
  const highlights = subscribeCopy?.highlights
  const cta = subscribeCopy?.cta

  return (
    <MainLayout>
      <Section spacing="xl">
        <ComingSoonPlaceholder
          badge={hero?.badge}
          title={hero?.title ?? "Subscribe for platform updates"}
          description={
            hero?.description ??
            "Short, high-signal updates when new features, deployment patterns, and configuration examples land in the reference pleb.school stack."
          }
          highlights={[
            {
              icon: Mail,
              title: highlights?.signal?.title ?? "Signal over noise",
              description:
                highlights?.signal?.description ??
                "Occasional digests focused on real changes to the stack — no marketing drip campaigns."
            },
            {
              icon: NotebookPen,
              title: highlights?.creators?.title ?? "For platform builders",
              description:
                highlights?.creators?.description ??
                "Notes and walkthroughs that show how to adapt this repo to your own courses, pricing, and community."
            },
            {
              icon: Gift,
              title: highlights?.perks?.title ?? "Starter configs & perks",
              description:
                highlights?.perks?.description ??
                "Early access to example relays, themes, and JSON configs you can copy into your own instance."
            }
          ]}
          primaryCta={cta?.primary ?? { label: "Explore demo content", href: "/content" }}
          secondaryCta={cta?.secondary ?? { label: "Back to home", href: "/" }}
        />
      </Section>
    </MainLayout>
  )
}
