import React, { useState } from 'react'

interface WalletLogoProps {
  walletName: string
  className?: string
  alt?: string
  showFallback?: boolean
}

const WalletLogo: React.FC<WalletLogoProps> = ({ 
  walletName, 
  className = "w-8 h-8", 
  alt,
  showFallback = true 
}) => {
  const [logoSrc, setLogoSrc] = useState(`/assets/wallets/${walletName.toLowerCase().replace(/\s+/g, '-')}.svg`)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (showFallback && !hasError) {
      setHasError(true)
      // Try PNG fallback first
      setLogoSrc(`/assets/wallets/${walletName.toLowerCase().replace(/\s+/g, '-')}.png`)
    } else if (showFallback && hasError) {
      // Final fallback to default wallet icon
      setLogoSrc('/assets/icons/wallet-icon.svg')
    }
  }

  return (
    <img 
      src={logoSrc} 
      alt={alt || `${walletName} Wallet`} 
      className={className}
      onError={handleError}
      loading="lazy"
    />
  )
}

export default WalletLogo 