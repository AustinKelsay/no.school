"use client"

import { AnimatedText } from './animated-text'
import { useSnstrContext } from '@/contexts/snstr-context'
import { useEffect } from 'react'
import { Filter } from 'snstr'

export function HeroAnimated() {
  const animatedWords = ["Bitcoin", "Lightning", "Nostr", "AI"]

  const { subscribe, publish } = useSnstrContext();

  useEffect(() => {
    const filter: Filter = {
      limit: 30,
      authors: ["0d6c8388dcb049b8dd4fc8d3d8c3bb93de3da90ba828e4f09c8ad0f346488a33"]
    }
    subscribe([filter], (event, relayUrl) => {
      console.log(`Received event from ${relayUrl}:`, event)
    })
  }, [subscribe])
  
  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
      Learn how to code Build on{" "}
      <span className="text-primary">
        <AnimatedText words={animatedWords} duration={2500} />
      </span>
      <br />
      {" "}Become a Dev
    </h1>
  )
}