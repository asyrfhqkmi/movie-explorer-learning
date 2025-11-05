import { NextRequest } from 'next/server'
import { SearchResponse, Movie } from '@/lib/types'

// Type for TMDB API response
interface TMDBResponse {
  results: Array<{
    id: number
    title: string
    poster_path: string | null
    vote_average: number
    release_date: string
    overview: string
  }>
}

export async function GET(request: NextRequest): Promise<Response> {
  // Get the search query from URL
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  // Validate input
  if (!query || query.trim() === '') {
    return Response.json(
      { error: 'Search query is required' },
      { status: 400 }
    )
  }

  // Get API credentials from environment
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

  if (!baseUrl || !apiKey) {
    return Response.json(
      { error: 'API configuration missing' },
      { status: 500 }
    )
  }

  try {
    // Call TMDB API with typed response
    const response = await fetch(
      `${baseUrl}/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    )

    // Check if API call was successful
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json() as TMDBResponse

    // Return typed response with first 20 results
    const results: Movie[] = (data.results?.slice(0, 20) || []).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview
    }))

    const searchResponse: SearchResponse = {
      results,
      total_results: data.results.length,
      total_pages: 1
    }

    return Response.json(searchResponse)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Search API error:', errorMessage)

    return Response.json(
      { error: 'Failed to fetch movies from TMDB' },
      { status: 500 }
    )
  }
}
