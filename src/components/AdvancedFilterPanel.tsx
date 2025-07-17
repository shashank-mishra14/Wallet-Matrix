import React from 'react'
import { CheckCircle, Circle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { FilterState } from '../types/wallet'

interface AdvancedFilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  isVisible: boolean
  onClose: () => void
}

const filterCategories = {
  platforms: [
    'ios',
    'android', 
    'chrome',
    'firefox',
    'safari',
    'edge',
    'desktop',
    'web',
    'hardware'
  ],
  custodyModel: [
    'self-custody',
    'mpc',
    'custodial'
  ],
  categories: [
    'major',
    'hardware',
    'regional',
    'niche'
  ]
}

const filterLabels = {
  platforms: 'Platform Availability',
  custodyModel: 'Custody Model',
  categories: 'Wallet Category'
}

const optionLabels: Record<string, Record<string, string>> = {
  platforms: {
    ios: 'iOS',
    android: 'Android',
    chrome: 'Chrome Extension',
    firefox: 'Firefox Extension',
    safari: 'Safari Extension',
    edge: 'Edge Extension',
    desktop: 'Desktop App',
    web: 'Web App',
    hardware: 'Hardware Device'
  },
  custodyModel: {
    'self-custody': 'Self-Custody',
    'mpc': 'MPC (Multi-Party Computation)',
    'custodial': 'Custodial'
  },
  categories: {
    'major': 'Major Wallets',
    'hardware': 'Hardware Wallets',
    'regional': 'Regional Wallets',
    'niche': 'Niche Wallets'
  }
}

export function AdvancedFilterPanel({ 
  filters, 
  onFiltersChange, 
  isVisible, 
  onClose 
}: AdvancedFilterPanelProps) {
  const updateFilter = (category: 'platforms' | 'custodyModel' | 'categories', value: string) => {
    const currentValues = filters[category] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    onFiltersChange({
      [category]: newValues
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      platforms: [],
      custodyModel: [],
      categories: [],
      features: {},
      search: '',
      sortBy: 'name',
      sortOrder: 'asc'
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    count += filters.platforms.length
    count += filters.custodyModel.length
    count += filters.categories.length
    count += Object.keys(filters.features).length
    return count
  }

  const FilterGroup = ({ 
    title, 
    category, 
    options 
  }: { 
    title: string
    category: 'platforms' | 'custodyModel' | 'categories'
    options: string[] 
  }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = (filters[category] as string[]).includes(option)
          const label = optionLabels[category]?.[option] || option
          
          return (
            <button
              key={option}
              onClick={() => updateFilter(category, option)}
              className="flex items-center space-x-3 w-full text-left hover:bg-muted/50 rounded-md p-2 transition-colors duration-150"
            >
              {isSelected ? (
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border z-50 overflow-y-auto"
          >
            <Card className="h-full rounded-none border-0 shadow-lg">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {getActiveFilterCount()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Filter Groups */}
                <div className="space-y-6">
                  <FilterGroup
                    title={filterLabels.platforms}
                    category="platforms"
                    options={filterCategories.platforms}
                  />
                  
                  <Separator />
                  
                  <FilterGroup
                    title={filterLabels.custodyModel}
                    category="custodyModel"
                    options={filterCategories.custodyModel}
                  />
                  
                  <Separator />
                  
                  <FilterGroup
                    title={filterLabels.categories}
                    category="categories"
                    options={filterCategories.categories}
                  />

                  <Separator />

                  {/* Feature Filters */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground tracking-tight">
                      Key Features
                    </h3>
                    <div className="space-y-2">
                      {[
                        { key: 'dexSwap', label: 'DEX Swap' },
                        { key: 'nftGallery', label: 'NFT Gallery' },
                        { key: 'staking', label: 'Staking' },
                        { key: 'fiatOnRamp', label: 'Fiat On-Ramp' },
                        { key: 'fiatOffRamp', label: 'Fiat Off-Ramp' },
                        { key: 'hardwareWalletSupport', label: 'Hardware Support' },
                        { key: 'multiChain', label: 'Multi-Chain' },
                        { key: 'dappBrowser', label: 'DApp Browser' },
                        { key: 'biometricAuth', label: 'Biometric Auth' },
                        { key: 'pushNotifications', label: 'Push Notifications' }
                      ].map(({ key, label }) => {
                        const isSelected = filters.features[key as keyof typeof filters.features] === true
                        
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              const newFeatures = { ...filters.features } as any
                              if (isSelected) {
                                delete newFeatures[key]
                              } else {
                                newFeatures[key] = true
                              }
                              onFiltersChange({ features: newFeatures })
                            }}
                            className="flex items-center space-x-3 w-full text-left hover:bg-muted/50 rounded-md p-2 transition-colors duration-150"
                          >
                            {isSelected ? (
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                              {label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Solana Pay Support Filter */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground tracking-tight">
                      Solana Pay Support
                    </h3>
                    <div className="space-y-2">
                      {[
                        { key: 'yes', label: 'Full Support' },
                        { key: 'partial', label: 'Partial Support' },
                        { key: 'no', label: 'Not Supported' }
                      ].map(({ key, label }) => {
                        const isSelected = filters.features.solanaPayQR === key
                        
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              const newFeatures = { ...filters.features } as any
                              if (isSelected) {
                                delete newFeatures.solanaPayQR
                              } else {
                                newFeatures.solanaPayQR = key as 'yes' | 'partial' | 'no'
                              }
                              onFiltersChange({ features: newFeatures })
                            }}
                            className="flex items-center space-x-3 w-full text-left hover:bg-muted/50 rounded-md p-2 transition-colors duration-150"
                          >
                            {isSelected ? (
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                              {label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 