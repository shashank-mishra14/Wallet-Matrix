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

const WalletIcon: React.FC<WalletIconProps> = ({ 
  walletName, 
  className,
  size = 'md',
  showFallback = true 
}) => {
  const [logoSrc, setLogoSrc] = useState(`/assets/wallets/${walletName.toLowerCase().replace(/\s+/g, '-')}.svg`)
  const [imageError, setImageError] = useState(false)

  const handleError = () => {
    if (!imageError) {
      setImageError(true)
      // Try PNG fallback
      setLogoSrc(`/assets/wallets/${walletName.toLowerCase().replace(/\s+/g, '-')}.png`)
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