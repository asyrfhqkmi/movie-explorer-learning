'use client'

import { useState, useEffect } from 'react'
import { Movie } from '@/lib/types'

interface UseFavoritesReturn {
  favorites: Movie[]
  addFavorite: (movie: Movie) => void
  addMultipleFavorites: (movies: Movie[]) => void
  removeFavorite: (movieId: number) => void
  removeMultipleFavorites: (movieIds: number[]) => void
  isFavorite: (movieId: number) => boolean
  isLoading: boolean
}

const STORAGE_KEY = 'movieFavorites'

/**
 * Manage a list of favorite movies using localStorage for persistence.
 *
 * Provides helper operations to add/remove single or multiple movies and
 * a fast check to determine if a movie is currently favorited.
 * Loading is true until initial localStorage hydration completes.
 *
 * @returns An object of favorites state and helpers.
 */
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

  /**
   * Add a movie to favorites if it does not already exist.
   * @param movie - Movie to add
   */
  const addFavorite = (movie: Movie): void => {
    // Use functional update to always work with latest state
    setFavorites((prevFavorites) => {
      // Prevent duplicates by checking if movie already exists
      if (!prevFavorites.some((fav) => fav.id === movie.id)) {
        return [...prevFavorites, movie]
      }
      return prevFavorites
    })
  }

  /**
   * Add multiple movies to favorites, skipping duplicates by id.
   * @param movies - Array of movies to add
   */
  const addMultipleFavorites = (movies: Movie[]): void => {
    // Use functional update to batch add multiple movies at once
    setFavorites((prevFavorites) => {
      const existingIds = new Set(prevFavorites.map((fav) => fav.id))
      const newMovies = movies.filter((movie) => !existingIds.has(movie.id))
      
      if (newMovies.length === 0) {
        return prevFavorites // No new movies to add
      }
      
      return [...prevFavorites, ...newMovies]
    })
  }

  /**
   * Remove a single movie from favorites by id.
   * @param movieId - Movie id to remove
   */
  const removeFavorite = (movieId: number): void => {
    // Use functional update to always work with latest state
    setFavorites((prevFavorites) => 
      prevFavorites.filter((fav) => fav.id !== movieId)
    )
  }

  /**
   * Remove multiple movies from favorites by id.
   * @param movieIds - Array of ids to remove
   */
  const removeMultipleFavorites = (movieIds: number[]): void => {
    // Use functional update to batch remove multiple movies at once
    const movieIdSet = new Set(movieIds)
    setFavorites((prevFavorites) => 
      prevFavorites.filter((fav) => !movieIdSet.has(fav.id))
    )
  }

  /**
   * Determine if the given movie id is currently in favorites.
   * @param movieId - Movie id to check
   * @returns true if favorited, false otherwise
   */
  const isFavorite = (movieId: number): boolean => {
    return favorites.some((fav) => fav.id === movieId)
  }

  return {
    favorites,
    addFavorite,
    addMultipleFavorites,
    removeFavorite,
    removeMultipleFavorites,
    isFavorite,
    isLoading
  }
}