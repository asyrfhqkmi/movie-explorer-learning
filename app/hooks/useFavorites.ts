'use client'

import { useState, useEffect } from 'react'
import { Movie } from '@/lib/types'

interface UseFavoritesReturn {
  favorites: Movie[]
  addFavorite: (movie: Movie) => void
  removeFavorite: (movieId: number) => void
  isFavorite: (movieId: number) => boolean
  isLoading: boolean
}

const STORAGE_KEY = 'movieFavorites'

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      // Only run in browser (localStorage not available on server)
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as Movie[]
          setFavorites(parsed)
        }
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error)
      // Continue without favorites if loading fails
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    // Don't save while still loading initial data
    if (!isLoading && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error)
      }
    }
  }, [favorites, isLoading])

  const addFavorite = (movie: Movie): void => {
    // Prevent duplicates by checking if movie already exists
    if (!favorites.some((fav) => fav.id === movie.id)) {
      setFavorites([...favorites, movie])
    }
  }

  const removeFavorite = (movieId: number): void => {
    setFavorites(favorites.filter((fav) => fav.id !== movieId))
  }

  const isFavorite = (movieId: number): boolean => {
    return favorites.some((fav) => fav.id === movieId)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    isLoading
  }
}