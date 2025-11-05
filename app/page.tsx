'use client'

import SearchBar from './components/SearchBar'
import FavoritesSection from './components/FavoritesSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-white p-4">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold mb-2">🎬 Movie Explorer</h1>
        <p className="text-gray-600">Search millions of movies and save your favorites</p>
      </header>

      {/* Favorites Section - Shows saved movies */}
      <FavoritesSection />

      {/* Search Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">🔍 Search Movies</h2>
        <SearchBar />
      </section>
    </div>
  )
}