'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Movie, SearchState } from '@/lib/types'
import MovieSkeleton from './MovieSkeleton'
import MovieCard from './MovieCard'

interface SearchBarProps {
  onSearchResults?: (results: Movie[]) => void
}

export default function SearchBar({ onSearchResults }: SearchBarProps) {
  const [state, setState] = useState<SearchState>({
    query: '',
    loading: false,
    results: [],
    error: ''
  })

  /**
   * Submit handler that validates input, calls the search API,
   * updates loading/error/results state, and emits results upward.
   * @param e - Form submit event
   */
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!state.query.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter a search term' }))
      return
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: '',
      results: []
    }))

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(state.query)}`
      )
      const data = await response.json()

      if (!response.ok) {
        setState(prev => ({
          ...prev,
          error: data.error || 'Search failed',
          loading: false
        }))
        return
      }

      setState(prev => ({
        ...prev,
        results: data.results || [],
        loading: false
      }))

      onSearchResults?.(data.results || [])
    } catch {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch movies. Try again.',
        loading: false
      }))
    }
  }

  return (
    <section className="w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
<Input
  type="text"
  value={state.query}
  onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
  placeholder="Search for a movie..."
  aria-label="Search movies by title"
/>
<Button
  type="submit"
  disabled={state.loading}
  aria-busy={state.loading}
>
  {state.loading ? 'Searching...' : 'Search'}
</Button>
      </form>

            {/* Error Alert */}
      {state.error && (
        <Alert variant="destructive" className="mb-4 flex items-center justify-between">
          <div className="flex-1">
            <AlertDescription>
              {state.error}
            </AlertDescription>
          </div>
          <Button
            onClick={async () => {
              // Retry the last search
              if (state.query) {
                setState(prev => ({ ...prev, error: '' }))
                // Search will be triggered by form
              }
            }}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Results Count */}
      {state.results.length > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          Found {state.results.length} movies
        </p>
      )}

      {/* Results - For now, just show count */}
      {state.results.length > 0 && (
        <div className="text-gray-600">
          <p>Movies found! (Display coming Day 2)</p>
        </div>
      )}
            {/* Loading Skeletons */}
      {state.loading && (
        <div className="mt-8">
          <p className="text-gray-600 mb-4">Searching for movies...</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <MovieSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!state.loading && state.results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Found {state.results.length} movies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {state.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ) }
    </section>
  )
}
