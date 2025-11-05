'use client'

import SearchBar from './components/SearchBar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white p-4">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold mb-2">🎬 Movie Explorer</h1>
        <p className="text-gray-600">Search millions of movies with TypeScript & shadcn/ui</p>
      </header>

      <main>
        <SearchBar />
      </main>
    </div>
  )
}
