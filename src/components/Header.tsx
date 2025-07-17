import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Grid3X3, 
  Table, 
  GitCompare, 
  BarChart3, 
  Download,
  Github,
  ExternalLink,
  QrCode
} from 'lucide-react'
import { useWalletStore } from '../store/walletStore'

const Header: React.FC = () => {
  const { activeView, setActiveView, comparison } = useWalletStore()
  const location = useLocation()

  const viewButtons = [
    { id: 'grid', icon: Grid3X3, label: 'Grid View' },
    { id: 'table', icon: Table, label: 'Table View' },
    { id: 'comparison', icon: GitCompare, label: 'Compare', badge: comparison.selectedWallets.length },
  ]

  const navigationItems = [
    { path: '/', label: 'Wallets' },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/solana-pay', label: 'Solana Pay', icon: QrCode },
    { path: '/export', label: 'Export', icon: Download },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SW</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Solana Wallets</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1 ml-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* View Toggle (only on main page) */}
          {location.pathname === '/' && (
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 p-1 rounded-lg">
                {viewButtons.map((button) => {
                  const Icon = button.icon
                  const isActive = activeView === button.id
                  
                  return (
                    <button
                      key={button.id}
                      onClick={() => setActiveView(button.id as 'grid' | 'table' | 'comparison')}
                      className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive 
                          ? 'bg-white text-primary-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title={button.label}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{button.label}</span>
                        {button.badge && button.badge > 0 && (
                          <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                            {button.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/yourusername/solana-wallet-comparison"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            
            <a
              href="https://solana.com/developers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Solana Developers"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 