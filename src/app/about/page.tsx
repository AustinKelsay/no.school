import type { Metadata } from "next"

import { MainLayout, Section } from "@/components/layout"
import { ComingSoonPlaceholder } from "@/components/placeholders/coming-soon"
import { Globe, Lightbulb, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "About no.school",
  description: "Learn more about the team, mission, and roadmap powering no.school."
}

export default function AboutPage() {
  return (
    <MainLayout>
      <Section spacing="xl">
        <ComingSoonPlaceholder
          badge="Inside no.school"
          title="The story is still being written"
          description="We're drafting a transparent look at our mission, team, and the community values that guide every release."
          highlights={[
            {
              icon: Users,
              title: "People first",
              description: "Meet the mentors, builders, and moderators behind the experience."
            },
            {
              icon: Lightbulb,
              title: "Learning principles",
              description: "See the design decisions that shape courses, lightning talks, and documents."
            },
            {
              icon: Globe,
              title: "Open roadmap",
              description: "Track how new features roll out across the platform and API."
            }
          ]}
          primaryCta={{ label: "Read the blog", href: "/content" }}
          secondaryCta={{ label: "Contact us", href: "/profile?tab=support" }}
        />
      </Section>
    </MainLayout>
  )
}
