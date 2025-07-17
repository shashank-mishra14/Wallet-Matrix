import { useMemo } from 'react'
// import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp,
  Shield,
  Zap,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
// import { WalletFeature } from '../types/wallet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import WalletIcon from './WalletIcon'

const AnalyticsView: React.FC = () => {
  const { wallets } = useWalletStore()

  // Calculate analytics data
  const analytics = useMemo(() => {
    if (!wallets || wallets.length === 0) return null

    // Category distribution
    const categoryStats = wallets.reduce((acc, wallet) => {
      acc[wallet.category] = (acc[wallet.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Custody model distribution
    const custodyStats = wallets.reduce((acc, wallet) => {
      acc[wallet.custodyModel] = (acc[wallet.custodyModel] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Platform support
    const platformStats = wallets.reduce((acc, wallet) => {
      wallet.platforms.forEach(platform => {
        acc[platform] = (acc[platform] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    // Feature analysis
    const featureStats = {
      dexSwap: wallets.filter(w => w.features.dexSwap).length,
      nftGallery: wallets.filter(w => w.features.nftGallery).length,
      staking: wallets.filter(w => w.features.staking).length,
      fiatOnRamp: wallets.filter(w => w.features.fiatOnRamp).length,
      fiatOffRamp: wallets.filter(w => w.features.fiatOffRamp).length,
      pushNotifications: wallets.filter(w => w.features.pushNotifications).length,
      biometricAuth: wallets.filter(w => w.features.biometricAuth).length,
      hardwareWalletSupport: wallets.filter(w => w.features.hardwareWalletSupport).length,
      multiChain: wallets.filter(w => w.features.multiChain).length,
      dappBrowser: wallets.filter(w => w.features.dappBrowser).length,
    }

    // Solana Pay analysis
    const solanaPayStats = wallets.reduce((acc, wallet) => {
      acc[wallet.features.solanaPayQR] = (acc[wallet.features.solanaPayQR] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Security analysis
    const securityStats = wallets.reduce((acc, wallet) => {
      acc[wallet.security.auditStatus] = (acc[wallet.security.auditStatus] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Performance analysis
    const performanceStats = {
      fast: wallets.filter(w => w.performance.transactionSpeed === 'fast').length,
      medium: wallets.filter(w => w.performance.transactionSpeed === 'medium').length,
      slow: wallets.filter(w => w.performance.transactionSpeed === 'slow').length,
    }

    // Top performing wallets
    const topWallets = wallets
      .sort((a, b) => b.performance.uptime - a.performance.uptime)
      .slice(0, 5)

    // Most feature-rich wallets
    const featureRichWallets = wallets
      .map(wallet => ({
        ...wallet,
        featureCount: Object.values(wallet.features).filter(f => f === true || f === 'yes').length
      }))
      .sort((a, b) => b.featureCount - a.featureCount)
      .slice(0, 5)

    return {
      total: wallets.length,
      categoryStats,
      custodyStats,
      platformStats,
      featureStats,
      solanaPayStats,
      securityStats,
      performanceStats,
      topWallets,
      featureRichWallets
    }
  }, [wallets])

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No data available for analytics</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getPercentage = (value: number, total: number) => Math.round((value / total) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Wallet Ecosystem Analytics</span>
          </CardTitle>
          <CardDescription>
            Comprehensive insights into the Solana wallet landscape
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.total}</div>
              <div className="text-sm text-gray-600">Total Wallets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analytics.solanaPayStats.yes || 0}
              </div>
              <div className="text-sm text-gray-600">Full Solana Pay</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.securityStats.audited || 0}
              </div>
              <div className="text-sm text-gray-600">Audited Wallets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {analytics.performanceStats.fast || 0}
              </div>
              <div className="text-sm text-gray-600">Fast Transactions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="solana-pay">Solana Pay</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Categories</CardTitle>
                <CardDescription>Distribution by wallet type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.categoryStats).map(([category, count]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="capitalize font-medium">{category}</span>
                        <span className="text-sm text-gray-600">
                          {count} ({getPercentage(count, analytics.total)}%)
                        </span>
                      </div>
                      <Progress value={getPercentage(count, analytics.total)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custody Model Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Custody Models</CardTitle>
                <CardDescription>How wallets manage private keys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.custodyStats).map(([model, count]) => (
                    <div key={model} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="capitalize font-medium">{model.replace('-', ' ')}</span>
                        <span className="text-sm text-gray-600">
                          {count} ({getPercentage(count, analytics.total)}%)
                        </span>
                      </div>
                      <Progress value={getPercentage(count, analytics.total)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Support */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Support</CardTitle>
                <CardDescription>Availability across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.platformStats)
                    .sort(([,a], [,b]) => b - a)
                    .map(([platform, count]) => (
                    <div key={platform} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="capitalize font-medium">{platform}</span>
                        <span className="text-sm text-gray-600">
                          {count} ({getPercentage(count, analytics.total)}%)
                        </span>
                      </div>
                      <Progress value={getPercentage(count, analytics.total)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Wallets */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Wallets</CardTitle>
                <CardDescription>Ranked by uptime performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topWallets.map((wallet, index) => (
                    <div key={wallet.id} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <WalletIcon walletName={wallet.name} size="md" className="rounded-full" />
                      <div className="flex-1">
                        <div className="font-medium">{wallet.name}</div>
                        <div className="text-sm text-gray-600">{wallet.performance.uptime}% uptime</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Feature Adoption */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Adoption</CardTitle>
                <CardDescription>How many wallets support each feature</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.featureStats)
                    .sort(([,a], [,b]) => b - a)
                    .map(([feature, count]) => (
                    <div key={feature} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="text-sm text-gray-600">
                          {count}/{analytics.total} ({getPercentage(count, analytics.total)}%)
                        </span>
                      </div>
                      <Progress value={getPercentage(count, analytics.total)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feature-Rich Wallets */}
            <Card>
              <CardHeader>
                <CardTitle>Most Feature-Rich Wallets</CardTitle>
                <CardDescription>Wallets with the most features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.featureRichWallets.map((wallet, index) => (
                    <div key={wallet.id} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <WalletIcon walletName={wallet.name} size="md" className="rounded-full" />
                      <div className="flex-1">
                        <div className="font-medium">{wallet.name}</div>
                        <div className="text-sm text-gray-600">{wallet.featureCount} features</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feature Gaps */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Feature Gap Analysis</CardTitle>
                <CardDescription>Identify areas for ecosystem improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(analytics.featureStats)
                    .filter(([, count]) => count < analytics.total * 0.5)
                    .sort(([,a], [,b]) => a - b)
                    .slice(0, 6)
                    .map(([feature, count]) => (
                    <Alert key={feature}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium mb-1">
                          {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div className="text-sm">
                          Only {getPercentage(count, analytics.total)}% support
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Security Audit Status */}
            <Card>
              <CardHeader>
                <CardTitle>Security Audit Status</CardTitle>
                <CardDescription>Audit coverage across wallets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.securityStats).map(([status, count]) => (
                    <div key={status} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {status === 'audited' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {status === 'pending' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                          {status === 'unaudited' && <XCircle className="w-4 h-4 text-red-600" />}
                          <span className="capitalize font-medium">{status}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {count} ({getPercentage(count, analytics.total)}%)
                        </span>
                      </div>
                      <Progress value={getPercentage(count, analytics.total)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Speed</CardTitle>
                <CardDescription>Performance across wallets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.performanceStats).map(([speed, count]) => (
                    <div key={speed} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Zap className={`w-4 h-4 ${
                            speed === 'fast' ? 'text-green-600' : 
                            speed === 'medium' ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                          <span className="capitalize font-medium">{speed}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {count} ({getPercentage(count, analytics.total)}%)
                        </span>
                      </div>
                      <Progress value={getPercentage(count, analytics.total)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Recommendations */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
                <CardDescription>Insights for wallet security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-1">Audit Coverage</div>
                      <div className="text-sm">
                        {getPercentage(analytics.securityStats.audited || 0, analytics.total)}% of wallets are audited. 
                        Consider using audited wallets for better security.
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Users className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-1">Custody Models</div>
                      <div className="text-sm">
                        {getPercentage(analytics.custodyStats['self-custody'] || 0, analytics.total)}% offer self-custody. 
                        Self-custody provides better control over your assets.
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="solana-pay" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Solana Pay Support */}
            <Card>
              <CardHeader>
                <CardTitle>Solana Pay Support</CardTitle>
                <CardDescription>QR code payment compatibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.solanaPayStats).map(([support, count]) => (
                    <div key={support} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {support === 'yes' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {support === 'partial' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                          {support === 'no' && <XCircle className="w-4 h-4 text-red-600" />}
                          <span className="capitalize font-medium">{support} Support</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {count} ({getPercentage(count, analytics.total)}%)
                        </span>
                      </div>
                      <Progress value={getPercentage(count, analytics.total)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Solana Pay Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Solana Pay Insights</CardTitle>
                <CardDescription>Key findings and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Adoption Rate</h4>
                    <p className="text-sm text-blue-800">
                      {getPercentage((analytics.solanaPayStats.yes || 0) + (analytics.solanaPayStats.partial || 0), analytics.total)}% 
                      of wallets support Solana Pay in some form
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Full Support</h4>
                    <p className="text-sm text-green-800">
                      {analytics.solanaPayStats.yes || 0} wallets offer full Solana Pay support with seamless QR scanning
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Partial Support</h4>
                    <p className="text-sm text-yellow-800">
                      {analytics.solanaPayStats.partial || 0} wallets have partial support, typically requiring manual setup
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Solana Pay Recommendations */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Solana Pay Recommendations</CardTitle>
                <CardDescription>Best practices for Solana Pay adoption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-1">For Merchants</div>
                      <div className="text-sm">
                        Focus on wallets with "Yes" support for the best user experience. 
                        Consider supporting multiple wallets to maximize reach.
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Users className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-1">For Users</div>
                      <div className="text-sm">
                        Choose wallets with full Solana Pay support for seamless payment experiences. 
                        Check UX notes for implementation quality.
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AnalyticsView 