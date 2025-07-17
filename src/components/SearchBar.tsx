import React, { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { useWalletStore } from '../store/walletStore'

const SearchBar: React.FC = () => {
  const { filters, setFilters } = useWalletStore()
  const [searchTerm, setSearchTerm] = useState(filters.search)

  // Debounced search
  const debouncedSearch = useCallback(
    (term: string) => {
      const timer = setTimeout(() => {
        setFilters({ search: term })
      }, 300)
      return () => clearTimeout(timer)
    },
    [setFilters]
  )

  useEffect(() => {
    const cleanup = debouncedSearch(searchTerm)
    return cleanup
  }, [searchTerm, debouncedSearch])

  const handleClear = () => {
    setSearchTerm('')
    setFilters({ search: '' })
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search wallets by name, description, or Solana Pay features..."
          className="search-input pl-10 pr-10 py-3 text-sm w-full"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div className="absolute top-full mt-2 text-sm text-gray-600">
          Search: "{searchTerm}"
        </div>
      )}
    </div>
  )
}

export default SearchBar 