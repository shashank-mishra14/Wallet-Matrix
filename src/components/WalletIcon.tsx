import React, { useState } from 'react'
import { Wallet } from 'lucide-react'

interface WalletIconProps {
  walletName: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showFallback?: boolean
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

// Mapping of wallet names to their actual icon file names
const walletIconMap: Record<string, string> = {
  'phantom': 'Phantom_SVG_Icon.svg',
  'solflare': 'solflare.svg',
  'backpack': 'backpack_Icon_Red.png',
  'bitget wallet': 'bitget.svg',
  'jupiter wallet': 'jupiter-ag-jup-logo.svg',
  'okx wallet': 'okx-1.svg',
  'exodus': 'Exodus_logo_white.svg',
  'glow': 'glow.jpeg',
  'slope': 'slope.png',
  'ledger nano s/x': 'ledger_nano_logo.svg',
  'trezor': 'trezor.jpeg',
  'tangem': 'tangem.jpeg',
  'trust wallet': 'trust_wallet.jpeg',
  'coinbase wallet': 'coinbase-wallet.svg', // Assuming this exists or will be added
  'atomic wallet': 'atomic_wallet_logo_dark_rounded_2.png',
  'torus': 'torus.png',
  'decaf': 'decaf.jpeg',
  'saga': 'saga.svg', // Assuming this exists or will be added
}

const WalletIcon: React.FC<WalletIconProps> = ({ 
  walletName, 
  className,
  size = 'md',
  showFallback = true 
}) => {
  const normalizedName = walletName.toLowerCase()
  const iconFileName = walletIconMap[normalizedName]
  
  const [logoSrc, setLogoSrc] = useState(
    iconFileName 
      ? `/assets/wallets/${iconFileName}`
      : `/assets/wallets/${normalizedName.replace(/\s+/g, '-')}.svg`
  )
  const [imageError, setImageError] = useState(false)

  const handleError = () => {
    if (!imageError) {
      setImageError(true)
      
      // If we have a specific mapping and it failed, try common fallbacks
      if (iconFileName) {
        const baseName = normalizedName.replace(/\s+/g, '-')
        const fallbacks = [
          `${baseName}.svg`,
          `${baseName}.png`,
          `${baseName}.jpeg`,
          `${baseName}.jpg`
        ]
        
        // Try the first fallback
        if (fallbacks.length > 0) {
          setLogoSrc(`/assets/wallets/${fallbacks[0]}`)
          return
        }
      }
      
      // Final fallback - try PNG
      setLogoSrc(`/assets/wallets/${normalizedName.replace(/\s+/g, '-')}.png`)
    }
  }

  const sizeClass = sizeClasses[size]
  const combinedClassName = className ? `${sizeClass} ${className}` : sizeClass

  if (imageError && showFallback) {
    return (
      <div className={`${combinedClassName} flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border border-primary/20`}>
        <Wallet className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'} text-primary/60`} />
      </div>
    )
  }

  return (
    <div className={`${combinedClassName} flex items-center justify-center overflow-hidden rounded-lg`}>
      <img 
        src={logoSrc} 
        alt={`${walletName} Wallet`} 
        className={`${combinedClassName} object-contain`}
        onError={handleError}
        loading="lazy"
      />
    </div>
  )
}

export default WalletIcon 