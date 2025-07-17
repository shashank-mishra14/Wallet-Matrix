import React, { useState, useEffect, useRef } from 'react'
import { Search, Clock, TrendingUp } from 'lucide-react'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { WalletFeature } from '../types/wallet'
import WalletIcon from './WalletIcon'

interface AdvancedSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  wallets: WalletFeature[]
  onWalletSelect?: (wallet: WalletFeature) => void
}

export function AdvancedSearch({ 
  searchQuery, 
  onSearchChange, 
  wallets, 
  onWalletSelect 
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  const suggestions = searchQuery.length > 0 
    ? wallets
        .filter(wallet => 
          wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          wallet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          wallet.solanaPayNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          wallet.platforms.some(platform => 
            platform.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
        .slice(0, 5)
    : []

  const popularSearches = ['Phantom', 'Solflare', 'DEX Swap', 'NFT', 'Staking', 'Hardware', 'Solana Pay']

  useEffect(() => {
    const stored = localStorage.getItem('wallet-matrix-searches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (error) {
        console.error('Error parsing recent searches:', error)
      }
    }
  }, [])

  useEffect(() => {
    const inputElement = searchRef.current?.querySelector('input')
    setIsOpen(searchQuery.length > 0 || document.activeElement === inputElement)
    setSelectedIndex(-1)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (query: string) => {
    onSearchChange(query)
    if (query && !recentSearches.includes(query)) {
      const newSearches = [query, ...recentSearches.slice(0, 4)]
      setRecentSearches(newSearches)
      localStorage.setItem('wallet-matrix-searches', JSON.stringify(newSearches))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          onWalletSelect?.(suggestions[selectedIndex])
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  const getSolanaPayBadge = (wallet: WalletFeature) => {
    switch (wallet.features.solanaPayQR) {
      case 'yes':
        return 'Solana Pay ✓'
      case 'partial':
        return 'Partial Support'
      default:
        return `${Object.values(wallet.features).filter(f => f === true).length} features`
    }
  }

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search wallets, features..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 bg-muted/30 border-border/50 focus:bg-background transition-all duration-200"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-2">
                Suggestions
              </div>
              {suggestions.map((wallet, index) => (
                <div
                  key={wallet.id}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-accent' 
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => {
                    if (onWalletSelect) {
                      onWalletSelect(wallet)
                    } else {
                      handleSearch(wallet.name)
                    }
                    setIsOpen(false)
                  }}
                >
                  <WalletIcon walletName={wallet.name} size="md" className="rounded-lg" />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">
                      {wallet.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {wallet.platforms.slice(0, 2).join(', ')}
                      {wallet.platforms.length > 2 && ` +${wallet.platforms.length - 2}`}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {getSolanaPayBadge(wallet)}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {searchQuery.length === 0 && recentSearches.length > 0 && (
            <div className="p-2 border-t border-border">
              <div className="flex items-center text-xs font-medium text-muted-foreground px-2 py-1 mb-2">
                <Clock className="w-3 h-3 mr-1" />
                Recent
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="px-3 py-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors text-sm text-foreground"
                  onClick={() => handleSearch(search)}
                >
                  {search}
                </div>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {searchQuery.length === 0 && (
            <div className="p-2 border-t border-border">
              <div className="flex items-center text-xs font-medium text-muted-foreground px-2 py-1 mb-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular
              </div>
              <div className="flex flex-wrap gap-1 px-2">
                {popularSearches.map((search) => (
                  <Badge
                    key={search}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleSearch(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 