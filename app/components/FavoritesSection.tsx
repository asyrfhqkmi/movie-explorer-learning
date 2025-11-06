'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useFavorites } from '@/app/hooks/useFavorites'
import MovieCard from './MovieCard'
import { Heart } from 'lucide-react'

export default function FavoritesSection() {
  const { favorites, isLoading } = useFavorites()

  // Show loading state
  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          <Heart className="inline-block mr-2 h-6 w-6 align-[-2px]" aria-hidden="true" />
          Your Favorites
        </h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  // Show empty state
  if (favorites.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          <Heart className="inline-block mr-2 h-6 w-6 align-[-2px]" aria-hidden="true" />
          Your Favorites ({favorites.length})
        </h2>
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-lg font-medium mb-2">No favorites yet</p>
            <p className="text-gray-500">
              Search for movies and click the heart icon to save them here
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  // Show favorites grid
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">
        <Heart className="inline-block mr-2 h-6 w-6 align-[-2px]" aria-hidden="true" />
        Your Favorites ({favorites.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
