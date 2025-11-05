'use client'

import SearchBar from './components/SearchBar'
import FavoritesSection from './components/FavoritesSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-3xl md:text-4xl font-bold">🎬 Movie Explorer</h1>
          <p className="text-sm md:text-base text-gray-600">
            Search millions of movies and save your favorites
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Favorites Section */}
        <FavoritesSection />

        {/* Search Section */}
        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">🔍 Search Movies</h2>
          <SearchBar />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>
            Movie data from{' '}
            <a href="https://www.themoviedb.org/" className="font-semibold hover:text-gray-900">
              TMDB API
            </a>
            {' | '}Built with Next.js, React, TypeScript & shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  )
}