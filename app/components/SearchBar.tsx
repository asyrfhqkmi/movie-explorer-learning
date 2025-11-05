'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Movie, SearchState } from '@/lib/types'

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
    <section className="w-full max-w-2xl mx-auto">
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
    </section>
  )
}
