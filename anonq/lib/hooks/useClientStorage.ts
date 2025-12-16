'use client'

import { useState, useEffect } from 'react'

export function useClientStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const item = localStorage.getItem(key)
      if (item) setValue(JSON.parse(item))
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  const setStoredValue = (value: T) => {
    try {
      setValue(value)
      if (isClient) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeStoredValue = () => {
    try {
      setValue(defaultValue)
      if (isClient) {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [value, setStoredValue, removeStoredValue] as const
}