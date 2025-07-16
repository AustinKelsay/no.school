"use client"

import { AnimatedText } from './animated-text'

export function HeroAnimated() {
  const animatedWords = ["Bitcoin", "Lightning", "Nostr", "AI"]
  
  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
      Learn how to code 
      <br />
      Build on{" "}
      <span className="text-primary">
        <AnimatedText words={animatedWords} duration={2500} />
      </span>
      <br />
      {" "}Become a Dev
    </h1>
  )
}