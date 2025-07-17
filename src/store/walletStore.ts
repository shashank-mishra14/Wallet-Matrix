import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WalletFeature, FilterState, ComparisonState, SavedFilter } from '../types/wallet'

interface WalletStore {
  // Data
  wallets: WalletFeature[]
  filteredWallets: WalletFeature[]
  
  // Filters
  filters: FilterState
  savedFilters: SavedFilter[]
  
  // Comparison
  comparison: ComparisonState
  
  // UI State
  isLoading: boolean
  error: string | null
  activeView: 'grid' | 'table' | 'comparison'
  
  // Actions
  setWallets: (wallets: WalletFeature[]) => void
  setFilters: (filters: Partial<FilterState>) => void
  resetFilters: () => void
  applyFilters: () => void
  
  // Comparison actions
  toggleWalletComparison: (walletId: string) => void
  clearComparison: () => void
  
  // Saved filters
  saveFilter: (filter: SavedFilter) => void
  deleteFilter: (filterId: string) => void
  loadFilter: (filterId: string) => void
  
  // UI actions
  setActiveView: (view: 'grid' | 'table' | 'comparison') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const defaultFilters: FilterState = {
  platforms: [],
  custodyModel: [],
  categories: [],
  features: {},
  search: '',
  sortBy: 'name',
  sortOrder: 'asc',
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      // Initial state
      wallets: [],
      filteredWallets: [],
      filters: defaultFilters,
      savedFilters: [],
      comparison: {
        selectedWallets: [],
        maxSelection: 5,
      },
      isLoading: false,
      error: null,
      activeView: 'grid',
      
      // Actions
      setWallets: (wallets) => {
        set({ wallets })
        get().applyFilters()
      },
      
      setFilters: (newFilters) => {
        const filters = { ...get().filters, ...newFilters }
        set({ filters })
        get().applyFilters()
      },
      
      resetFilters: () => {
        set({ filters: defaultFilters })
        get().applyFilters()
      },
      
      applyFilters: () => {
        const { wallets, filters } = get()
        let filtered = [...wallets]
        
        // Search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase()
          filtered = filtered.filter(wallet => 
            wallet.name.toLowerCase().includes(searchTerm) ||
            wallet.description.toLowerCase().includes(searchTerm) ||
            wallet.solanaPayNotes.toLowerCase().includes(searchTerm)
          )
        }
        
        // Platform filter
        if (filters.platforms.length > 0) {
          filtered = filtered.filter(wallet =>
            filters.platforms.some(platform => wallet.platforms.includes(platform))
          )
        }
        
        // Custody model filter
        if (filters.custodyModel.length > 0) {
          filtered = filtered.filter(wallet =>
            filters.custodyModel.includes(wallet.custodyModel)
          )
        }
        
        // Category filter
        if (filters.categories.length > 0) {
          filtered = filtered.filter(wallet =>
            filters.categories.includes(wallet.category)
          )
        }
        
        // Feature filters
        Object.entries(filters.features).forEach(([feature, value]) => {
          if (value !== undefined) {
            filtered = filtered.filter(wallet => {
              const walletFeature = wallet.features[feature as keyof typeof wallet.features]
              if (typeof walletFeature === 'boolean') {
                return walletFeature === value
              } else {
                return walletFeature === value
              }
            })
          }
        })
        
        // Sort
        filtered.sort((a, b) => {
          let aValue: any, bValue: any
          
          switch (filters.sortBy) {
            case 'name':
              aValue = a.name
              bValue = b.name
              break
            case 'lastTested':
              aValue = new Date(a.lastTested)
              bValue = new Date(b.lastTested)
              break
            case 'security':
              aValue = a.security.auditStatus === 'audited' ? 2 : a.security.auditStatus === 'pending' ? 1 : 0
              bValue = b.security.auditStatus === 'audited' ? 2 : b.security.auditStatus === 'pending' ? 1 : 0
              break
            case 'popularity':
              aValue = a.performance.uptime
              bValue = b.performance.uptime
              break
            default:
              aValue = a.name
              bValue = b.name
          }
          
          if (filters.sortOrder === 'desc') {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
          } else {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
          }
        })
        
        set({ filteredWallets: filtered })
      },
      
      toggleWalletComparison: (walletId) => {
        const { comparison } = get()
        const isSelected = comparison.selectedWallets.includes(walletId)
        
        if (isSelected) {
          set({
            comparison: {
              ...comparison,
              selectedWallets: comparison.selectedWallets.filter(id => id !== walletId)
            }
          })
        } else if (comparison.selectedWallets.length < comparison.maxSelection) {
          set({
            comparison: {
              ...comparison,
              selectedWallets: [...comparison.selectedWallets, walletId]
            }
          })
        }
      },
      
      clearComparison: () => {
        set({
          comparison: {
            ...get().comparison,
            selectedWallets: []
          }
        })
      },
      
      saveFilter: (filter) => {
        const { savedFilters } = get()
        const existingIndex = savedFilters.findIndex(f => f.id === filter.id)
        
        if (existingIndex >= 0) {
          savedFilters[existingIndex] = filter
        } else {
          savedFilters.push(filter)
        }
        
        set({ savedFilters: [...savedFilters] })
      },
      
      deleteFilter: (filterId) => {
        const { savedFilters } = get()
        set({ savedFilters: savedFilters.filter(f => f.id !== filterId) })
      },
      
      loadFilter: (filterId) => {
        const { savedFilters } = get()
        const filter = savedFilters.find(f => f.id === filterId)
        if (filter) {
          set({ filters: filter.filters })
          get().applyFilters()
        }
      },
      
      setActiveView: (view) => set({ activeView: view }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'wallet-store',
      partialize: (state) => ({
        savedFilters: state.savedFilters,
        comparison: state.comparison,
        activeView: state.activeView,
      }),
    }
  )
) 