"use client"

import { useState, useEffect } from "react"
import { getContentConfig, ContentConfig, ContentType, ContentSection } from "@/lib/content-config"

export function useContentConfig() {
  const [config, setConfig] = useState<ContentConfig | null>(null)

  useEffect(() => {
    // In a real app, this could fetch from an API or CMS
    // For now, we're using the static JSON config
    setConfig(getContentConfig())
  }, [])

  return config
}

export function useHomepageSectionConfig(section: ContentType) {
  const config = useContentConfig()
  
  if (!config) return null
  
  return config.homepage.sections[section]
}

export function useEnabledHomepageSections() {
  const config = useContentConfig()
  
  if (!config) return []
  
  return config.homepage.sectionOrder.filter(
    section => config.homepage.sections[section]?.enabled
  )
}