import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  ExternalLink, 
  Check, 
  AlertTriangle, 
  Zap, 
  Clock, 
  Globe, 
  Smartphone, 
  Monitor, 
  HardDrive,
  Download,
  Share2,
  Star
} from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import { WalletFeature, SolanaPaySupport } from '../types/wallet'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import WalletIcon from './WalletIcon'

const ComparisonView: React.FC = () => {
  const { wallets, comparison, toggleWalletComparison, clearComparison } = useWalletStore()
  const [activeTab, setActiveTab] = useState('overview')

  const selectedWallets = wallets.filter(wallet => 
    comparison.selectedWallets.includes(wallet.id)
  )

  const getFeatureIcon = (value: boolean | SolanaPaySupport, size: string = 'w-4 h-4') => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className={`${size} text-green-600`} />
      ) : (
        <X className={`${size} text-red-600`} />
      )
    }
    
    switch (value) {
      case 'yes':
        return <Check className={`${size} text-green-600`} />
      case 'partial':
        return <AlertTriangle className={`${size} text-yellow-600`} />
      case 'no':
        return <X className={`${size} text-red-600`} />
      default:
        return <X className={`${size} text-red-600`} />
    }
  }

  const getFeatureText = (value: boolean | SolanaPaySupport) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  const getSecurityScore = (wallet: WalletFeature) => {
    let score = 0
    if (wallet.security.auditStatus === 'audited') score += 40
    else if (wallet.security.auditStatus === 'pending') score += 20
    
    if (wallet.security.sourceCode === 'open') score += 30
    else if (wallet.security.sourceCode === 'partial') score += 15
    
    if (wallet.performance.uptime > 99) score += 20
    else if (wallet.performance.uptime > 95) score += 10
    
    if (wallet.performance.failureRate === 'low') score += 10
    else if (wallet.performance.failureRate === 'medium') score += 5
    
    return Math.min(score, 100)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'web':
        return <Globe className="w-4 h-4" />
      case 'ios':
      case 'android':
        return <Smartphone className="w-4 h-4" />
      case 'desktop':
        return <Monitor className="w-4 h-4" />
      case 'hardware':
        return <HardDrive className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  const getFeatureComparison = (wallets: WalletFeature[], featureKey: string) => {
    const supported = wallets.filter(w => {
      const feature = w.features[featureKey as keyof typeof w.features]
      return typeof feature === 'boolean' ? feature : feature === 'yes'
    }).length
    
    return {
      supported,
      total: wallets.length,
      percentage: (supported / wallets.length) * 100
    }
  }

  if (selectedWallets.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No wallets selected for comparison</h3>
            <p className="text-gray-600 mb-6">
              Select wallets from the grid or table view to compare their features, security, and performance.
            </p>
            <Button onClick={() => window.history.back()}>
              Browse Wallets
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Wallet Comparison</CardTitle>
              <CardDescription>
                Comparing {selectedWallets.length} wallet{selectedWallets.length !== 1 ? 's' : ''} across key features and metrics
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Comparison
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearComparison}>
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Comparison Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="solana-pay">Solana Pay</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedWallets.length}, 1fr)` }}>
            {selectedWallets.map((wallet) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <WalletIcon walletName={wallet.name} size="xl" className="rounded-full" />
                        <div>
                          <h3 className="font-semibold text-lg">{wallet.name}</h3>
                          <p className="text-sm text-gray-600">{wallet.version}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWalletComparison(wallet.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="capitalize">{wallet.category}</Badge>
                        <Badge variant="secondary" className="capitalize">{wallet.custodyModel}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{wallet.description}</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Platforms</h4>
                        <div className="flex flex-wrap gap-2">
                          {wallet.platforms.map((platform) => (
                            <div key={platform} className="flex items-center space-x-1 text-sm">
                              {getPlatformIcon(platform)}
                              <span className="capitalize">{platform}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Security Score</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Overall</span>
                            <span className="text-sm font-medium">{getSecurityScore(wallet)}/100</span>
                          </div>
                          <Progress value={getSecurityScore(wallet)} className="h-2" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Performance</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-gray-500" />
                            <span className="capitalize">{wallet.performance.transactionSpeed}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{wallet.performance.uptime}% uptime</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Last Updated</h4>
                        <p className="text-sm text-gray-600">
                          {format(new Date(wallet.lastTested), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Comparison</CardTitle>
              <CardDescription>
                Compare key features across selected wallets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Feature</th>
                      {selectedWallets.map((wallet) => (
                        <th key={wallet.id} className="text-center py-2 px-4 font-medium">
                          {wallet.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'dexSwap', label: 'DEX Swap' },
                      { key: 'nftGallery', label: 'NFT Gallery' },
                      { key: 'staking', label: 'Staking' },
                      { key: 'fiatOnRamp', label: 'Fiat On-Ramp' },
                      { key: 'fiatOffRamp', label: 'Fiat Off-Ramp' },
                      { key: 'pushNotifications', label: 'Push Notifications' },
                      { key: 'biometricAuth', label: 'Biometric Auth' },
                      { key: 'hardwareWalletSupport', label: 'Hardware Support' },
                      { key: 'multiChain', label: 'Multi-chain' },
                      { key: 'dappBrowser', label: 'DApp Browser' },
                    ].map((feature) => {
                      const comparison = getFeatureComparison(selectedWallets, feature.key)
                      return (
                        <tr key={feature.key} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <span>{feature.label}</span>
                              <div className="text-xs text-gray-500">
                                {comparison.supported}/{comparison.total} supported
                              </div>
                            </div>
                          </td>
                          {selectedWallets.map((wallet) => (
                            <td key={wallet.id} className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                {getFeatureIcon(wallet.features[feature.key as keyof typeof wallet.features])}
                                <span className="text-sm">
                                  {getFeatureText(wallet.features[feature.key as keyof typeof wallet.features])}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedWallets.length}, 1fr)` }}>
            {selectedWallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{wallet.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Audit Status</h4>
                    <div className="space-y-2">
                      <Badge 
                        variant={wallet.security.auditStatus === 'audited' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {wallet.security.auditStatus}
                      </Badge>
                      {wallet.security.auditCompany && (
                        <div className="text-sm text-gray-600">
                          Audited by {wallet.security.auditCompany}
                        </div>
                      )}
                      {wallet.security.auditDate && (
                        <div className="text-sm text-gray-600">
                          Date: {format(new Date(wallet.security.auditDate), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Source Code</h4>
                    <Badge variant="outline" className="capitalize">
                      {wallet.security.sourceCode}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Transaction Speed</span>
                        <Badge variant="outline" className="capitalize">
                          {wallet.performance.transactionSpeed}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Failure Rate</span>
                        <Badge variant="outline" className="capitalize">
                          {wallet.performance.failureRate}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Uptime</span>
                        <span className="text-sm font-medium">{wallet.performance.uptime}%</span>
                      </div>
                      <Progress value={wallet.performance.uptime} className="h-2" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Security Score</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Rating</span>
                        <span className="text-sm font-medium">{getSecurityScore(wallet)}/100</span>
                      </div>
                      <Progress value={getSecurityScore(wallet)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="solana-pay" className="space-y-6">
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedWallets.length}, 1fr)` }}>
            {selectedWallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{wallet.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {getFeatureIcon(wallet.features.solanaPayQR, 'w-5 h-5')}
                    <span className="text-sm capitalize font-medium">
                      {wallet.features.solanaPayQR} Support
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">User Experience</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Solana Pay UX</span>
                        <Badge variant="outline" className="capitalize">
                          {wallet.userExperience.solanaPayUX}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Onboarding</span>
                        <Badge variant="outline" className="capitalize">
                          {wallet.userExperience.onboarding}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Mobile Optimized</span>
                        {getFeatureIcon(wallet.userExperience.mobileOptimized)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Testing Notes</h4>
                    <Alert>
                      <AlertDescription className="text-sm">
                        {wallet.solanaPayNotes}
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">QR Code Features</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">QR Scanning</span>
                        {getFeatureIcon(wallet.features.solanaPayQR)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Push Notifications</span>
                        {getFeatureIcon(wallet.features.pushNotifications)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ComparisonView 