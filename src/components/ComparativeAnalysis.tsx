import React from 'react'
// import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  TrendingDown,
  Info,
  Award,
  Shield
} from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ComparativeAnalysis: React.FC = () => {
  const { filteredWallets } = useWalletStore()

  // Calculate Solana Pay QR support metrics
  const qrSupportData = React.useMemo(() => {
    const support = filteredWallets.reduce((acc, wallet) => {
      const qrSupport = wallet.features.solanaPayQR
      acc[qrSupport] = (acc[qrSupport] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { name: 'Full Support', value: support.yes || 0, color: '#22C55E' },
      { name: 'Partial Support', value: support.partial || 0, color: '#F59E0B' },
      { name: 'No Support', value: support.no || 0, color: '#EF4444' }
    ]
  }, [filteredWallets])

  // Calculate platform availability
  const platformData = React.useMemo(() => {
    const platforms = filteredWallets.reduce((acc, wallet) => {
      wallet.platforms.forEach(platform => {
        acc[platform] = (acc[platform] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    return Object.entries(platforms).map(([platform, count]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      count,
      percentage: ((count / filteredWallets.length) * 100).toFixed(1)
    }))
  }, [filteredWallets])

  // Calculate custody model distribution
  const custodyData = React.useMemo(() => {
    const custody = filteredWallets.reduce((acc, wallet) => {
      const model = wallet.custodyModel
      acc[model] = (acc[model] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(custody).map(([model, count]) => ({
      name: model.replace('-', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      value: count,
      percentage: ((count / filteredWallets.length) * 100).toFixed(1)
    }))
  }, [filteredWallets])

  // Find wallets that lag on QR support
  const qrLaggards = React.useMemo(() => {
    return filteredWallets.filter(wallet => 
      wallet.features.solanaPayQR === 'no' && wallet.category === 'major'
    )
  }, [filteredWallets])

  // Find top performing wallets
  const topPerformers = React.useMemo(() => {
    return filteredWallets
      .filter(wallet => wallet.features.solanaPayQR === 'yes')
      .sort((a, b) => b.performance.uptime - a.performance.uptime)
      .slice(0, 5)
  }, [filteredWallets])

  // Calculate feature adoption rates
  const featureAdoption = React.useMemo(() => {
    const features = [
      'dexSwap', 'nftGallery', 'staking', 'fiatOnRamp', 'fiatOffRamp',
      'pushNotifications', 'biometricAuth', 'hardwareWalletSupport',
      'multiChain', 'dappBrowser'
    ]

    return features.map(feature => {
      const count = filteredWallets.filter(wallet => 
        wallet.features[feature as keyof typeof wallet.features] === true
      ).length
      return {
        feature: feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        count,
        percentage: ((count / filteredWallets.length) * 100).toFixed(1)
      }
    }).sort((a, b) => b.count - a.count)
  }, [filteredWallets])

  // Security audit status
  const auditData = React.useMemo(() => {
    const audits = filteredWallets.reduce((acc, wallet) => {
      const status = wallet.security.auditStatus
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(audits).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: ((count / filteredWallets.length) * 100).toFixed(1)
    }))
  }, [filteredWallets])

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Comparative Analysis
        </h1>
        <p className="text-gray-600">
          Insights and trends across the Solana wallet ecosystem
        </p>
      </div>

      <Tabs defaultValue="qr-support" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="qr-support">QR Support</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="qr-support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Solana Pay QR Support</span>
                </CardTitle>
                <CardDescription>
                  Distribution of QR code scanning support across wallets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={qrSupportData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {qrSupportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <span>Major Wallets Lagging on QR</span>
                </CardTitle>
                <CardDescription>
                  Popular wallets that don't support Solana Pay QR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {qrLaggards.length > 0 ? (
                    qrLaggards.map((wallet) => (
                      <div key={wallet.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <div className="font-medium">{wallet.name}</div>
                            <div className="text-sm text-gray-500">{wallet.category}</div>
                          </div>
                        </div>
                        <Badge variant="destructive">No QR</Badge>
                      </div>
                    ))
                  ) : (
                    <Alert>
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription>
                        All major wallets support Solana Pay QR scanning!
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Top QR-Enabled Performers</span>
              </CardTitle>
              <CardDescription>
                Best wallets with full QR support ranked by uptime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.map((wallet, index) => (
                  <div key={wallet.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{wallet.name}</div>
                        <div className="text-sm text-gray-500">
                          {wallet.userExperience.solanaPayUX} • {wallet.performance.uptime}% uptime
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Adoption Rates</CardTitle>
              <CardDescription>
                How many wallets support each feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={featureAdoption}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="feature" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custody Model Distribution</CardTitle>
              <CardDescription>
                How wallets handle private key management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {custodyData.map((item) => (
                  <div key={item.name} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                    <div className="text-sm text-gray-600">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Audit Status</span>
              </CardTitle>
              <CardDescription>
                How many wallets have undergone security audits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {auditData.map((item) => (
                  <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                    <div className="text-sm text-gray-600">{item.status}</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Insights</CardTitle>
              <CardDescription>
                Key security observations across the ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Hardware Wallets:</strong> {filteredWallets.filter(w => w.category === 'hardware').length} hardware wallets provide the highest security for large holdings.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Open Source:</strong> {filteredWallets.filter(w => w.security.sourceCode === 'open').length} wallets have open-source code for transparency.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Recent Audits:</strong> {filteredWallets.filter(w => w.security.auditStatus === 'audited' && w.security.auditDate && new Date(w.security.auditDate) > new Date('2023-01-01')).length} wallets have been audited in 2023-2024.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Availability</CardTitle>
              <CardDescription>
                Which platforms have the most wallet support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Insights</CardTitle>
              <CardDescription>
                Key trends in platform support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.slice(0, 3).map((platform, index) => (
                  <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{platform.platform}</div>
                        <div className="text-sm text-gray-500">{platform.count} wallets</div>
                      </div>
                    </div>
                    <Badge variant="secondary">{platform.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ComparativeAnalysis 