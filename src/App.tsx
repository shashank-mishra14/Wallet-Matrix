import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWalletStore } from './store/walletStore'
import { useWallets } from './hooks/useWallets'
import Header from './components/Header'
import WalletGrid from './components/WalletGrid'
import WalletTable from './components/WalletTable'
import ComparisonView from './components/ComparisonView'
import { AdvancedFilterPanel } from './components/AdvancedFilterPanel'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import AnalyticsView from './components/AnalyticsView'
import ExportModal from './components/ExportModal'
import SolanaPaySimulator from './components/SolanaPaySimulator'
import WalletIconTest from './components/WalletIconTest'
import ComparativeAnalysis from './components/ComparativeAnalysis'

function App() {
  const { 
    activeView, 
    isLoading, 
    error, 
    filteredWallets, 
    comparison,
    filters,
    setFilters,
    setWallets,
    setLoading,
    setError 
  } = useWalletStore()
  
  const { data: wallets, isLoading: walletsLoading, error: walletsError } = useWallets()
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (wallets) {
      setWallets(wallets)
    }
    setLoading(walletsLoading)
    setError(walletsError ? 'Failed to load wallet data' : null)
  }, [wallets, walletsLoading, walletsError, setWallets, setLoading, setError])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner />
        </div>
      )
    }

    if (error) {
      return <ErrorMessage message={error} />
    }

    switch (activeView) {
      case 'grid':
        return <WalletGrid wallets={filteredWallets} />
      case 'table':
        return <WalletTable wallets={filteredWallets} />
      case 'comparison':
        return <ComparisonView />
      default:
        return <WalletGrid wallets={filteredWallets} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showFilters={showFilters} setShowFilters={setShowFilters} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Wallet Matrix
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Premium Solana wallet comparison dashboard. Compare features, security, and Solana Pay compatibility 
                  across all major Solana wallets with advanced filtering and insights.
                </p>
              </div>

              {/* Results Summary */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                  Showing {filteredWallets.length} wallets
                </div>
                
                {comparison.selectedWallets.length > 0 && (
                  <div className="text-sm text-primary-600">
                    {comparison.selectedWallets.length} wallets selected for comparison
                  </div>
                )}
              </div>

              {/* Main Content with Sidebar */}
              <div className="flex gap-6">
                {/* Filter Sidebar */}
                <div className={`transition-all duration-300 ${showFilters ? 'w-80' : 'w-0'} flex-shrink-0`}>
                  <div className={`${showFilters ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <AdvancedFilterPanel
                      filters={filters}
                      onFiltersChange={setFilters}
                      isVisible={showFilters}
                      onClose={() => setShowFilters(false)}
                    />
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderContent()}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          } />
          
          <Route path="/analytics" element={<AnalyticsView />} />
          <Route path="/export" element={<ExportModal />} />
          <Route path="/solana-pay" element={<SolanaPaySimulator />} />
          <Route path="/test-icons" element={<WalletIconTest />} />
          <Route path="/comparative-analysis" element={<ComparativeAnalysis />} />
        </Routes>
      </main>
    </div>
  )
}

export default App 