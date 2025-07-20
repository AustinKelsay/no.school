import { useEffect, useState } from 'react'

/**
 * Debounce hook that delays updating a value until after a specified delay
 * Useful for search inputs to avoid making too many API calls
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timer if the value changes before the delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}