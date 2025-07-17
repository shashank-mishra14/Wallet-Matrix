import React from 'react'
import WalletIcon from './WalletIcon'

const WalletIconTest: React.FC = () => {
  const walletNames = [
    'Phantom',
    'Solflare', 
    'Backpack',
    'Bitget Wallet',
    'Jupiter Wallet',
    'OKX Wallet',
    'Exodus',
    'Glow',
    'Slope',
    'Ledger Nano S/X',
    'Trezor',
    'Tangem',
    'Trust Wallet',
    'Coinbase Wallet',
    'Atomic Wallet',
    'Torus',
    'Decaf',
    'Saga'
  ]

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-center">Wallet Icons Test</h1>
      
      <div className="grid grid-cols-6 gap-6">
        {walletNames.map((walletName) => (
          <div key={walletName} className="flex flex-col items-center space-y-2">
            <WalletIcon 
              walletName={walletName} 
              size="lg" 
              className="border border-gray-200 rounded-lg p-2"
            />
            <span className="text-sm text-center text-gray-600">{walletName}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Different Sizes Test</h2>
        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-center space-y-2">
            <WalletIcon walletName="Phantom" size="sm" />
            <span className="text-xs">Small</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <WalletIcon walletName="Phantom" size="md" />
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <WalletIcon walletName="Phantom" size="lg" />
            <span className="text-xs">Large</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <WalletIcon walletName="Phantom" size="xl" />
            <span className="text-xs">Extra Large</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletIconTest 