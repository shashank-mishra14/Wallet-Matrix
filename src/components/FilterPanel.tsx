import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  Filter, 
  RotateCcw,
  Bookmark
} from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import { Platform, CustodyModel, SolanaPaySupport } from '../types/wallet'

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left text-sm font-medium text-gray-900"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FilterPanel: React.FC = () => {
  const { filters, setFilters, resetFilters } = useWalletStore()

  const platforms: Platform[] = [
    'web', 'chrome', 'firefox', 'safari', 'edge', 
    'ios', 'android', 'desktop', 'hardware'
  ]

  const custodyModels: CustodyModel[] = ['self-custody', 'mpc', 'custodial']
  const categories = ['major', 'hardware', 'regional', 'niche']
  const solanaPayOptions: SolanaPaySupport[] = ['yes', 'partial', 'no']

  const handlePlatformChange = (platform: Platform) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform]
    setFilters({ platforms: newPlatforms })
  }

  const handleCustodyModelChange = (model: CustodyModel) => {
    const newModels = filters.custodyModel.includes(model)
      ? filters.custodyModel.filter(m => m !== model)
      : [...filters.custodyModel, model]
    setFilters({ custodyModel: newModels })
  }

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    setFilters({ categories: newCategories })
  }

  const handleFeatureChange = (feature: string, value: boolean | string) => {
    setFilters({
      features: {
        ...filters.features,
        [feature]: value
      }
    })
  }

  const handleSortChange = (sortBy: string) => {
    setFilters({ sortBy: sortBy as any })
  }

  const hasActiveFilters = 
    filters.platforms.length > 0 ||
    filters.custodyModel.length > 0 ||
    filters.categories.length > 0 ||
    Object.keys(filters.features).length > 0 ||
    filters.search.length > 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <FilterSection title="Platforms" defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((platform) => (
              <label key={platform} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.platforms.includes(platform)}
                  onChange={() => handlePlatformChange(platform)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 capitalize">{platform}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Custody Model">
          <div className="space-y-2">
            {custodyModels.map((model) => (
              <label key={model} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.custodyModel.includes(model)}
                  onChange={() => handleCustodyModelChange(model)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 capitalize">{model}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Category">
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 capitalize">{category}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Features">
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.features.dexSwap === true}
                onChange={() => handleFeatureChange('dexSwap', !filters.features.dexSwap)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">DEX Swap</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.features.nftGallery === true}
                onChange={() => handleFeatureChange('nftGallery', !filters.features.nftGallery)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">NFT Gallery</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.features.staking === true}
                onChange={() => handleFeatureChange('staking', !filters.features.staking)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Staking</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.features.hardwareWalletSupport === true}
                onChange={() => handleFeatureChange('hardwareWalletSupport', !filters.features.hardwareWalletSupport)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Hardware Wallet Support</span>
            </label>
            
            <div className="pt-2">
              <label className="block text-sm text-gray-700 mb-2">Solana Pay Support</label>
              <div className="space-y-2">
                {solanaPayOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="solanaPayQR"
                      value={option}
                      checked={filters.features.solanaPayQR === option}
                      onChange={() => handleFeatureChange('solanaPayQR', option)}
                      className="border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Sort">
          <div className="space-y-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="name">Name</option>
              <option value="lastTested">Last Tested</option>
              <option value="security">Security Score</option>
              <option value="popularity">Popularity</option>
            </select>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sortOrder"
                  value="asc"
                  checked={filters.sortOrder === 'asc'}
                  onChange={() => setFilters({ sortOrder: 'asc' })}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Ascending</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sortOrder"
                  value="desc"
                  checked={filters.sortOrder === 'desc'}
                  onChange={() => setFilters({ sortOrder: 'desc' })}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Descending</span>
              </label>
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  )
}

export default FilterPanel 