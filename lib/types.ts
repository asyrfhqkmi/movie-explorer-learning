// lib/types.ts

export interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  release_date: string
  overview: string
}

export interface SearchResponse {
  results: Movie[]
  total_results: number
  total_pages: number
}

export interface SearchState {
  query: string
  loading: boolean
  results: Movie[]
  error: string
}
