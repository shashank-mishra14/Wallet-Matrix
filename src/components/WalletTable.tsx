import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown, 
  ExternalLink, 
  Shield, 
  Zap, 
  Check, 
  X, 
  AlertTriangle,
  Plus,
  Minus,
  Globe,
  Smartphone,
  Monitor,
  HardDrive
} from 'lucide-react'
import { WalletFeature, SolanaPaySupport } from '../types/wallet'
import { useWalletStore } from '../store/walletStore'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface WalletTableProps {
  wallets: WalletFeature[]
}

type SortKey = 'name' | 'category' | 'custodyModel' | 'lastTested' | 'security' | 'uptime' | 'solanaPayQR'
type SortDirection = 'asc' | 'desc'

const WalletTable: React.FC<WalletTableProps> = ({ wallets }) => {
  const { comparison, toggleWalletComparison } = useWalletStore()
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedWallets = useMemo(() => {
    return [...wallets].sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortKey) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'category':
          aValue = a.category
          bValue = b.category
          break
        case 'custodyModel':
          aValue = a.custodyModel
          bValue = b.custodyModel
          break
        case 'lastTested':
          aValue = new Date(a.lastTested)
          bValue = new Date(b.lastTested)
          break
        case 'security':
          aValue = a.security.auditStatus === 'audited' ? 2 : a.security.auditStatus === 'pending' ? 1 : 0
          bValue = b.security.auditStatus === 'audited' ? 2 : b.security.auditStatus === 'pending' ? 1 : 0
          break
        case 'uptime':
          aValue = a.performance.uptime
          bValue = b.performance.uptime
          break
        case 'solanaPayQR':
          aValue = a.features.solanaPayQR === 'yes' ? 2 : a.features.solanaPayQR === 'partial' ? 1 : 0
          bValue = b.features.solanaPayQR === 'yes' ? 2 : b.features.solanaPayQR === 'partial' ? 1 : 0
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [wallets, sortKey, sortDirection])

  const toggleRowExpansion = (walletId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(walletId)) {
      newExpanded.delete(walletId)
    } else {
      newExpanded.add(walletId)
    }
    setExpandedRows(newExpanded)
  }

  const getFeatureIcon = (value: boolean | SolanaPaySupport) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <X className="w-4 h-4 text-red-600" />
      )
    }
    
    switch (value) {
      case 'yes':
        return <Check className="w-4 h-4 text-green-600" />
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'no':
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <X className="w-4 h-4 text-red-600" />
    }
  }

  const getSecurityBadge = (status: string) => {
    switch (status) {
      case 'audited':
        return <Badge variant="default" className="bg-green-100 text-green-800">Audited</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'unaudited':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Unaudited</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      major: 'bg-blue-100 text-blue-800',
      hardware: 'bg-purple-100 text-purple-800',
      regional: 'bg-green-100 text-green-800',
      niche: 'bg-orange-100 text-orange-800'
    }
    return <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{category}</Badge>
  }

  const getPlatformIcons = (platforms: string[]) => {
    return platforms.slice(0, 3).map((platform, index) => {
      switch (platform) {
        case 'web':
          return <Globe key={index} className="w-4 h-4" />
        case 'ios':
        case 'android':
          return <Smartphone key={index} className="w-4 h-4" />
        case 'desktop':
          return <Monitor key={index} className="w-4 h-4" />
        case 'hardware':
          return <HardDrive key={index} className="w-4 h-4" />
        default:
          return <Globe key={index} className="w-4 h-4" />
      }
    })
  }

  const SortableHeader = ({ label, sortKey: key }: { label: string; sortKey: SortKey }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(key)}
      className="font-medium text-left p-0 h-auto hover:bg-transparent"
    >
      {label}
      {sortKey === key ? (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
      ) : (
        <ArrowUpDown className="w-4 h-4 ml-1" />
      )}
    </Button>
  )

  if (wallets.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No wallets found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Comparison Table</CardTitle>
        <CardDescription>
          Compare {wallets.length} wallets across key features, security, and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="security">Security & Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Compare</TableHead>
                    <TableHead>
                      <SortableHeader label="Wallet" sortKey="name" />
                    </TableHead>
                    <TableHead>
                      <SortableHeader label="Category" sortKey="category" />
                    </TableHead>
                    <TableHead>
                      <SortableHeader label="Custody" sortKey="custodyModel" />
                    </TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>
                      <SortableHeader label="Solana Pay" sortKey="solanaPayQR" />
                    </TableHead>
                    <TableHead>
                      <SortableHeader label="Last Tested" sortKey="lastTested" />
                    </TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedWallets.map((wallet) => {
                    const isSelected = comparison.selectedWallets.includes(wallet.id)
                    const canSelect = comparison.selectedWallets.length < comparison.maxSelection
                    const isExpanded = expandedRows.has(wallet.id)
                    
                    return (
                      <React.Fragment key={wallet.id}>
                        <TableRow className={isSelected ? 'bg-blue-50' : ''}>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleWalletComparison(wallet.id)}
                              disabled={!isSelected && !canSelect}
                              className={isSelected ? 'text-blue-600' : ''}
                            >
                              {isSelected ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={wallet.logo} 
                                alt={wallet.name} 
                                className="w-8 h-8 rounded-full"
                                onError={(e) => {
                                  e.currentTarget.src = `https://via.placeholder.com/32x32?text=${wallet.name.charAt(0)}`
                                }}
                              />
                              <div>
                                <div className="font-medium">{wallet.name}</div>
                                <div className="text-sm text-gray-500">{wallet.version}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getCategoryBadge(wallet.category)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{wallet.custodyModel}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {getPlatformIcons(wallet.platforms)}
                              {wallet.platforms.length > 3 && (
                                <span className="text-xs text-gray-500">+{wallet.platforms.length - 3}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getFeatureIcon(wallet.features.solanaPayQR)}
                              <span className="text-sm capitalize">{wallet.features.solanaPayQR}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{format(new Date(wallet.lastTested), 'MMM d, yyyy')}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRowExpansion(wallet.id)}
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(wallet.website, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={8} className="p-0">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-gray-50 border-t"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Description</h4>
                                    <p className="text-sm text-gray-600">{wallet.description}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Solana Pay Notes</h4>
                                    <p className="text-sm text-gray-600">{wallet.solanaPayNotes}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">User Experience</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <div>Onboarding: {wallet.userExperience.onboarding}</div>
                                      <div>Solana Pay UX: {wallet.userExperience.solanaPayUX}</div>
                                      <div>Mobile Optimized: {wallet.userExperience.mobileOptimized ? 'Yes' : 'No'}</div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet</TableHead>
                    <TableHead>DEX Swap</TableHead>
                    <TableHead>NFT Gallery</TableHead>
                    <TableHead>Staking</TableHead>
                    <TableHead>Fiat On/Off Ramp</TableHead>
                    <TableHead>Hardware Support</TableHead>
                    <TableHead>Multi-chain</TableHead>
                    <TableHead>DApp Browser</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedWallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.name}</TableCell>
                      <TableCell>{getFeatureIcon(wallet.features.dexSwap)}</TableCell>
                      <TableCell>{getFeatureIcon(wallet.features.nftGallery)}</TableCell>
                      <TableCell>{getFeatureIcon(wallet.features.staking)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getFeatureIcon(wallet.features.fiatOnRamp)}
                          <span>/</span>
                          {getFeatureIcon(wallet.features.fiatOffRamp)}
                        </div>
                      </TableCell>
                      <TableCell>{getFeatureIcon(wallet.features.hardwareWalletSupport)}</TableCell>
                      <TableCell>{getFeatureIcon(wallet.features.multiChain)}</TableCell>
                      <TableCell>{getFeatureIcon(wallet.features.dappBrowser)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet</TableHead>
                    <TableHead>
                      <SortableHeader label="Security Status" sortKey="security" />
                    </TableHead>
                    <TableHead>Source Code</TableHead>
                    <TableHead>Transaction Speed</TableHead>
                    <TableHead>Failure Rate</TableHead>
                    <TableHead>
                      <SortableHeader label="Uptime" sortKey="uptime" />
                    </TableHead>
                    <TableHead>Pricing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedWallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getSecurityBadge(wallet.security.auditStatus)}
                          {wallet.security.auditCompany && (
                            <div className="text-xs text-gray-500">by {wallet.security.auditCompany}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{wallet.security.sourceCode}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{wallet.performance.transactionSpeed}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{wallet.performance.failureRate}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{wallet.performance.uptime}%</span>
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${wallet.performance.uptime}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{wallet.pricing.free ? 'Free' : 'Paid'}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            Fees: {wallet.pricing.transactionFees}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default WalletTable 