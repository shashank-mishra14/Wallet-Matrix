import React from 'react'
import { Link, useLocation } from 'react-router-dom'
// import { motion } from 'framer-motion'
import { 
  Grid3X3, 
  GitCompare, 
  BarChart3, 
  Download,
  Github,
  QrCode,
  Filter,
  List
} from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import { AdvancedSearch } from './AdvancedSearch'
import { Button } from './ui/button'

interface HeaderProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ showFilters, setShowFilters }) => {
  const { 
    activeView, 
    setActiveView, 
    comparison, 
    wallets,
    filters,
    setFilters
  } = useWalletStore()
  const location = useLocation()

  const navigationItems = [
    { path: '/', label: 'Wallets' },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/comparative-analysis', label: 'Insights', icon: BarChart3 },
    { path: '/solana-pay', label: 'Solana Pay', icon: QrCode },
    { path: '/export', label: 'Export', icon: Download },
  ]

  const handleSearchChange = (query: string) => {
    setFilters({ search: query })
  }

  const handleViewModeChange = (mode: 'grid' | 'table') => {
    setActiveView(mode)
  }

  const handleWalletSelect = (wallet: any) => {
    // You can implement navigation to wallet detail or other actions here
    console.log('Selected wallet:', wallet)
  }

  return (
    <header className="bg-card border-b border-border/50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/assets/icons/wallet-icon.svg" 
                  alt="Wallet Matrix" 
                  className="w-10 h-10"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                  Wallet Matrix
                </h1>
                <p className="text-sm text-muted-foreground">
                  Premium wallet comparison dashboard
                </p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Export Button */}
            <Link to="/export">
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-accent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </Link>
            
            {/* View Toggle (only on main page) */}
            {location.pathname === '/' && (
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={activeView === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewModeChange('grid')}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={activeView === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewModeChange('table')}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={activeView === 'comparison' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('comparison')}
                  className="px-3 relative"
                >
                  <GitCompare className="w-4 h-4" />
                  {comparison.selectedWallets.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                      {comparison.selectedWallets.length}
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* GitHub Link */}
            <a
              href="https://github.com/yourusername/wallet-matrix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        {/* Search and Filter Row - only on main page */}
        {location.pathname === '/' && (
          <div className="flex items-center space-x-4">
            <AdvancedSearch
              searchQuery={filters.search}
              onSearchChange={handleSearchChange}
              wallets={wallets}
              onWalletSelect={handleWalletSelect}
            />
            
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="border-border hover:bg-accent"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 