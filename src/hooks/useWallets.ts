import { useQuery } from '@tanstack/react-query'
import { WalletFeature } from '../types/wallet'

const fetchWallets = async (): Promise<WalletFeature[]> => {
  // In a real app, this would be an API call
  // For now, we'll import the JSON data directly
  try {
    const response = await import('../data/wallets.json')
    return response.default as WalletFeature[]
  } catch (error) {
    console.error('Error loading wallet data:', error)
    throw new Error('Failed to load wallet data')
  }
}

export const useWallets = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: fetchWallets,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export const useWallet = (walletId: string) => {
  return useQuery({
    queryKey: ['wallet', walletId],
    queryFn: async () => {
      const wallets = await fetchWallets()
      const wallet = wallets.find(w => w.id === walletId)
      if (!wallet) {
        throw new Error(`Wallet with ID ${walletId} not found`)
      }
      return wallet
    },
    enabled: !!walletId,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
} 