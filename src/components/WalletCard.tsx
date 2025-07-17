import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  X, 
  AlertTriangle, 
  Shield, 
  Zap, 
  Eye, 
  ExternalLink,
  Plus,
  Minus,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  HardDrive
} from 'lucide-react'
import { WalletFeature, SolanaPaySupport } from '../types/wallet'
import { useWalletStore } from '../store/walletStore'
import { format } from 'date-fns'
import WalletIcon from './WalletIcon'

interface WalletCardProps {
  wallet: WalletFeature
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
  const { comparison, toggleWalletComparison } = useWalletStore()
  const [showDetails, setShowDetails] = useState(false)
  
  const isSelected = comparison.selectedWallets.includes(wallet.id)
  const canSelect = comparison.selectedWallets.length < comparison.maxSelection

  const getFeatureBadge = (value: boolean | SolanaPaySupport) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-4 h-4 text-success-600" />
      ) : (
        <X className="w-4 h-4 text-error-600" />
      )
    }
    
    // Handle SolanaPaySupport
    switch (value) {
      case 'yes':
        return <Check className="w-4 h-4 text-success-600" />
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-warning-600" />
      case 'no':
        return <X className="w-4 h-4 text-error-600" />
      default:
        return <X className="w-4 h-4 text-error-600" />
    }
  }

  const getFeatureText = (value: boolean | SolanaPaySupport) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  const getSecurityBadge = () => {
    const { auditStatus } = wallet.security
    switch (auditStatus) {
      case 'audited':
        return <span className="feature-badge feature-badge-yes">Audited</span>
      case 'pending':
        return <span className="feature-badge feature-badge-partial">Pending</span>
      case 'unaudited':
        return <span className="feature-badge feature-badge-no">Unaudited</span>
    }
  }

  const getPlatformIcons = () => {
    return wallet.platforms.map((platform) => {
      switch (platform) {
        case 'web':
          return <Globe key={platform} className="w-4 h-4" />
        case 'ios':
        case 'android':
          return <Smartphone key={platform} className="w-4 h-4" />
        case 'desktop':
          return <Monitor key={platform} className="w-4 h-4" />
        case 'hardware':
          return <HardDrive key={platform} className="w-4 h-4" />
        default:
          return <Globe key={platform} className="w-4 h-4" />
      }
    })
  }

  const handleComparisonToggle = () => {
    if (isSelected || canSelect) {
      toggleWalletComparison(wallet.id)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`wallet-card ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
    >
      <div className="wallet-card-header">
        <div className="flex items-center space-x-3">
          <WalletIcon
            walletName={wallet.name}
            size="lg"
            className="wallet-logo"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{wallet.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="capitalize">{wallet.category}</span>
              <span>•</span>
              <span className="capitalize">{wallet.custodyModel}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleComparisonToggle}
            disabled={!isSelected && !canSelect}
            className={`p-2 rounded-full transition-colors ${
              isSelected 
                ? 'bg-primary-500 text-white' 
                : canSelect 
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
          >
            {isSelected ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          
          <a
            href={wallet.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="Visit website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{wallet.description}</p>

      {/* Platform Support */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-sm text-gray-500">Platforms:</span>
        <div className="flex items-center space-x-2 text-gray-600">
          {getPlatformIcons()}
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700">Solana Pay QR</span>
          <div className="flex items-center space-x-2">
            {getFeatureBadge(wallet.features.solanaPayQR)}
            <span className="text-gray-600">{getFeatureText(wallet.features.solanaPayQR)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700">DEX Swap</span>
          <div className="flex items-center space-x-2">
            {getFeatureBadge(wallet.features.dexSwap)}
            <span className="text-gray-600">{getFeatureText(wallet.features.dexSwap)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700">NFT Gallery</span>
          <div className="flex items-center space-x-2">
            {getFeatureBadge(wallet.features.nftGallery)}
            <span className="text-gray-600">{getFeatureText(wallet.features.nftGallery)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700">Staking</span>
          <div className="flex items-center space-x-2">
            {getFeatureBadge(wallet.features.staking)}
            <span className="text-gray-600">{getFeatureText(wallet.features.staking)}</span>
          </div>
        </div>
      </div>

      {/* Security & Performance */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-gray-500" />
          {getSecurityBadge()}
        </div>
        
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 capitalize">{wallet.performance.transactionSpeed}</span>
        </div>
      </div>

      {/* Solana Pay Notes */}
      {wallet.solanaPayNotes && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Solana Pay Notes</h4>
          <p className="text-sm text-blue-800">{wallet.solanaPayNotes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Tested: {format(new Date(wallet.lastTested), 'MMM d, yyyy')}</span>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200 space-y-3"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Features</h5>
              <ul className="space-y-1">
                <li className="flex items-center justify-between">
                  <span>Fiat On-Ramp</span>
                  {getFeatureBadge(wallet.features.fiatOnRamp)}
                </li>
                <li className="flex items-center justify-between">
                  <span>Hardware Support</span>
                  {getFeatureBadge(wallet.features.hardwareWalletSupport)}
                </li>
                <li className="flex items-center justify-between">
                  <span>Multi-Chain</span>
                  {getFeatureBadge(wallet.features.multiChain)}
                </li>
                <li className="flex items-center justify-between">
                  <span>DApp Browser</span>
                  {getFeatureBadge(wallet.features.dappBrowser)}
                </li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Security</h5>
              <ul className="space-y-1">
                <li>
                  <span className="text-gray-600">Audit Status:</span> {wallet.security.auditStatus}
                </li>
                {wallet.security.auditCompany && (
                  <li>
                    <span className="text-gray-600">Auditor:</span> {wallet.security.auditCompany}
                  </li>
                )}
                <li>
                  <span className="text-gray-600">Source Code:</span> {wallet.security.sourceCode}
                </li>
                <li>
                  <span className="text-gray-600">Uptime:</span> {wallet.performance.uptime}%
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 mb-2">User Experience</h5>
            <div className="text-sm space-y-1">
              <div>
                <span className="text-gray-600">Onboarding:</span> {wallet.userExperience.onboarding}
              </div>
              <div>
                <span className="text-gray-600">Solana Pay UX:</span> {wallet.userExperience.solanaPayUX}
              </div>
              <div>
                <span className="text-gray-600">Mobile Optimized:</span> {wallet.userExperience.mobileOptimized ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Pricing</h5>
            <div className="text-sm space-y-1">
              <div>
                <span className="text-gray-600">Free:</span> {wallet.pricing.free ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="text-gray-600">Transaction Fees:</span> {wallet.pricing.transactionFees}
              </div>
              {wallet.pricing.additionalCosts && (
                <div>
                  <span className="text-gray-600">Additional Costs:</span> {wallet.pricing.additionalCosts}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default WalletCard 