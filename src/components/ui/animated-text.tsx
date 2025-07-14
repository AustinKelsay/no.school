"use client"

import { useState, useEffect } from 'react'

interface AnimatedTextProps {
  words: string[]
  className?: string
  duration?: number
}

export function AnimatedText({ words, className = "", duration = 2500 }: AnimatedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length)
        setIsAnimating(false)
      }, 400)
    }, duration)

    return () => clearInterval(interval)
  }, [words.length, duration])

  // Get dynamic colors based on current word
  const getWordColor = (word: string) => {
    switch (word.toLowerCase()) {
      case 'bitcoin':
        return 'text-orange-500'
      case 'lightning':
        return 'text-yellow-500'
      case 'nostr':
        return 'text-purple-500'
      case 'ai':
        return 'text-blue-500'
      default:
        return 'text-primary'
    }
  }

  return (
    <span className={`inline-block relative ${className}`}>
      <span 
        className={`inline-block transition-all duration-700 ease-in-out ${
          isAnimating 
            ? 'transform -translate-y-8 opacity-0 scale-90 blur-sm' 
            : 'transform translate-y-0 opacity-100 scale-100 blur-0'
        } ${getWordColor(words[currentIndex])}`}
        style={{
          transformOrigin: 'center center',
          perspective: '1000px',
          backfaceVisibility: 'hidden'
        }}
      >
        {words[currentIndex]}
      </span>
    </span>
  )
}