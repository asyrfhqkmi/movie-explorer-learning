'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Movie, SearchState } from '@/lib/types'
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
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch movies. Try again.',
        loading: false
      }))
    }
  }

  return (
    <section className="w-full max-w-7xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          type="text"
          value={state.query}
          onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
          placeholder="Search for a movie..."
          className="flex-1"
        />
        <Button type="submit" disabled={state.loading}>
          {state.loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {/* Error Message */}
      {state.error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Results Grid */}
      {state.results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Found {state.results.length} movies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {state.results.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {!state.loading && state.query && state.results.length === 0 && !state.error && (
        <div className="text-center py-12 mt-8">
          <p className="text-lg font-medium">No movies found for "{state.query}"</p>
          <p className="text-gray-500 mt-2">Try searching for something else</p>
        </div>
      )}
    </section>
  )
}
