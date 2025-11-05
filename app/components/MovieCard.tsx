'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Movie } from '@/lib/types'

interface MovieCardProps {
  movie: Movie
  onAddFavorite?: (movie: Movie) => void
  isFavorite?: boolean
}

export default function MovieCard({
  movie,
  onAddFavorite,
  isFavorite = false
}: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image'

  const year = movie.release_date?.split('-')[0] || 'Unknown'
  const rating = movie.vote_average?.toFixed(1) || 'N/A'

  return (
    <Card className="overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-200">
      {/* Poster Image */}
      <CardHeader className="p-0">
        <div className="relative h-64 w-full bg-gray-200">
          <Image
            src={posterUrl}
            alt={movie.title || 'Movie poster'}
            fill
            className="object-cover"
            onError={(result) => {
              // Next.js Image handles errors gracefully
              result.target.src = 'https://via.placeholder.com/300x450?text=No+Image'
            }}
          />
        </div>
      </CardHeader>

      {/* Movie Info */}
      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          {movie.title}
        </h3>

        {/* Rating Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⭐</span>
          <Badge variant="secondary">
            {rating} / 10
          </Badge>
          <Badge variant="outline">
            {year}
          </Badge>
        </div>

        {/* Overview */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {movie.overview || 'No description available'}
        </p>

        {/* Favorite Button */}
        <Button
          onClick={() => onAddFavorite?.(movie)}
          variant={isFavorite ? 'destructive' : 'default'}
          className="w-full"
          disabled={!onAddFavorite}
        >
          {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
        </Button>
      </CardContent>
    </Card>
  )
}
