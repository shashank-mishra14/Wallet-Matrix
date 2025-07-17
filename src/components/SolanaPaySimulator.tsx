import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  QrCode, 
  Smartphone, 
  Camera, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  RotateCcw,
  Info
} from 'lucide-react'
import { WalletFeature } from '../types/wallet'
import { useWalletStore } from '../store/walletStore'
import QRCode from 'qrcode'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'
import { Progress } from './ui/progress'
import WalletIcon from './WalletIcon'

interface SimulationStep {
  id: number
  title: string
  description: string
  duration: number
  status: 'pending' | 'active' | 'completed' | 'failed'
  icon: React.ReactNode
}

interface WalletSimulation {
  wallet: WalletFeature
  steps: SimulationStep[]
  totalTime: number
  successRate: number
  userExperience: 'excellent' | 'good' | 'fair' | 'poor'
}

const SolanaPaySimulator: React.FC = () => {
  const { wallets } = useWalletStore()
  const [selectedWallet, setSelectedWallet] = useState<WalletFeature | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [simulation, setSimulation] = useState<WalletSimulation | null>(null)
  const [simulationComplete, setSimulationComplete] = useState(false)

  // Sample Solana Pay transaction URL
  const solanaPayUrl = 'solana:https://example.com/pay?amount=0.1&label=Test%20Payment&message=Testing%20Solana%20Pay'

  useEffect(() => {
    // Generate QR code
    QRCode.toDataURL(solanaPayUrl, { width: 200, margin: 1 })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Error generating QR code:', err))
  }, [])

  const createSimulation = (wallet: WalletFeature): WalletSimulation => {
    const baseSteps: SimulationStep[] = [
      {
        id: 1,
        title: 'QR Code Detection',
        description: 'Wallet detects and scans QR code',
        duration: 1000,
        status: 'pending',
        icon: <Camera className="w-4 h-4" />
      },
      {
        id: 2,
        title: 'URL Parsing',
        description: 'Parse Solana Pay URL and extract payment details',
        duration: 500,
        status: 'pending',
        icon: <QrCode className="w-4 h-4" />
      },
      {
        id: 3,
        title: 'Transaction Preview',
        description: 'Display transaction details to user',
        duration: 2000,
        status: 'pending',
        icon: <Info className="w-4 h-4" />
      },
      {
        id: 4,
        title: 'User Confirmation',
        description: 'User reviews and confirms transaction',
        duration: 3000,
        status: 'pending',
        icon: <CheckCircle className="w-4 h-4" />
      },
      {
        id: 5,
        title: 'Transaction Broadcast',
        description: 'Submit transaction to Solana network',
        duration: 2000,
        status: 'pending',
        icon: <Clock className="w-4 h-4" />
      }
    ]

    // Modify steps based on wallet capabilities
    let steps = [...baseSteps]
    let totalTime = 8500
    let successRate = 95
    let userExperience: 'excellent' | 'good' | 'fair' | 'poor' = 'good'

    switch (wallet.features.solanaPayQR) {
      case 'yes':
        if (wallet.userExperience.solanaPayUX === 'one-tap') {
          steps[0].duration = 500 // Faster QR detection
          steps[3].duration = 1000 // Faster confirmation
          totalTime = 5000
          successRate = 98
          userExperience = 'excellent'
        } else {
          steps.unshift({
            id: 0,
            title: 'Navigate to Scanner',
            description: 'User navigates to QR scanner in wallet',
            duration: 2000,
            status: 'pending',
            icon: <Smartphone className="w-4 h-4" />
          })
          totalTime = 10500
          userExperience = 'good'
        }
        break
      
      case 'partial':
        steps.unshift({
          id: 0,
          title: 'Manual Setup',
          description: 'User manually configures Solana Pay settings',
          duration: 5000,
          status: 'pending',
          icon: <AlertTriangle className="w-4 h-4" />
        })
        steps[1].duration = 2000 // Slower QR detection
        successRate = 75
        totalTime = 15500
        userExperience = 'fair'
        break
      
      case 'no':
        steps = [
          {
            id: 1,
            title: 'No Support',
            description: 'Wallet does not support Solana Pay QR codes',
            duration: 1000,
            status: 'failed',
            icon: <XCircle className="w-4 h-4" />
          }
        ]
        totalTime = 1000
        successRate = 0
        userExperience = 'poor'
        break
    }

    // Apply performance modifiers
    if (wallet.performance.transactionSpeed === 'fast') {
      steps = steps.map(step => ({ ...step, duration: step.duration * 0.8 }))
      totalTime *= 0.8
      successRate += 2
    } else if (wallet.performance.transactionSpeed === 'slow') {
      steps = steps.map(step => ({ ...step, duration: step.duration * 1.5 }))
      totalTime *= 1.5
      successRate -= 5
    }

    if (wallet.performance.failureRate === 'high') {
      successRate -= 15
    } else if (wallet.performance.failureRate === 'low') {
      successRate += 5
    }

    return {
      wallet,
      steps,
      totalTime,
      successRate: Math.max(0, Math.min(100, successRate)),
      userExperience
    }
  }

  const runSimulation = async () => {
    if (!selectedWallet) return

    const sim = createSimulation(selectedWallet)
    setSimulation(sim)
    setIsSimulating(true)
    setSimulationComplete(false)

    let simulationFailed = false

    for (let i = 0; i < sim.steps.length && !simulationFailed; i++) {
      const step = sim.steps[i]
      
      // Update current step
      // setCurrentStep(i) // This line is removed
      
      // Mark step as active
      setSimulation(prev => {
        if (!prev) return null
        const newSteps = [...prev.steps]
        newSteps[i].status = 'active'
        return { ...prev, steps: newSteps }
      })

      // Wait for step duration
      await new Promise(resolve => setTimeout(resolve, step.duration))

      // Check if step should fail
      let shouldFail = false
      if (step.status === 'failed') {
        shouldFail = true
      } else {
        // Random chance of failure based on success rate
        shouldFail = Math.random() * 100 > sim.successRate
      }

      // Mark step as completed or failed
      setSimulation(prev => {
        if (!prev) return null
        const newSteps = [...prev.steps]
        
        if (shouldFail) {
          newSteps[i].status = 'failed'
          // Mark remaining steps as failed
          for (let j = i + 1; j < sim.steps.length; j++) {
            newSteps[j].status = 'failed'
          }
        } else {
          newSteps[i].status = 'completed'
        }
        
        return { ...prev, steps: newSteps }
      })

      // Set flag to exit loop if step failed
      if (shouldFail) {
        simulationFailed = true
      }
    }

    setIsSimulating(false)
    setSimulationComplete(true)
  }

  const resetSimulation = () => {
    setSimulation(null)
    // setCurrentStep(0) // This line is removed
    setSimulationComplete(false)
    setIsSimulating(false)
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'active':
        return 'text-blue-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-400'
    }
  }

  const getUXColor = (ux: string) => {
    switch (ux) {
      case 'excellent':
        return 'bg-green-100 text-green-800'
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'fair':
        return 'bg-yellow-100 text-yellow-800'
      case 'poor':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const supportedWallets = wallets.filter(w => w.features.solanaPayQR !== 'no')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="w-5 h-5" />
            <span>Solana Pay QR Code Simulator</span>
          </CardTitle>
          <CardDescription>
            Experience how different wallets handle Solana Pay QR code transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* QR Code Display */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-4">Sample Solana Pay QR Code</h3>
                <div className="qr-code-container inline-block">
                  {qrCodeUrl && (
                    <img src={qrCodeUrl} alt="Solana Pay QR Code" className="w-48 h-48" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Amount: 0.1 SOL<br />
                  Label: Test Payment
                </p>
              </div>
            </div>

            {/* Wallet Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Wallet to Simulate</label>
                <Select 
                  value={selectedWallet?.id || ''} 
                  onValueChange={(value) => {
                    const wallet = wallets.find(w => w.id === value)
                    setSelectedWallet(wallet || null)
                    resetSimulation()
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedWallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        <div className="flex items-center space-x-2">
                          <WalletIcon walletName={wallet.name} size="sm" className="rounded-full" />
                          <span>{wallet.name}</span>
                          <Badge variant="outline" className="capitalize">
                            {wallet.features.solanaPayQR}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedWallet && (
                <div className="space-y-2">
                  <h4 className="font-medium">Wallet Information</h4>
                  <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1">
                    <div><strong>Support Level:</strong> {selectedWallet.features.solanaPayQR}</div>
                    <div><strong>UX Pattern:</strong> {selectedWallet.userExperience.solanaPayUX}</div>
                    <div><strong>Transaction Speed:</strong> {selectedWallet.performance.transactionSpeed}</div>
                    <div><strong>Failure Rate:</strong> {selectedWallet.performance.failureRate}</div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  onClick={runSimulation}
                  disabled={!selectedWallet || isSimulating}
                  className="flex-1"
                >
                  {isSimulating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Play className="w-4 h-4" />
                      </motion.div>
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Simulation
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Results */}
      {simulation && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation: {simulation.wallet.name}</CardTitle>
            <CardDescription>
              Real-time simulation of Solana Pay transaction flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Simulation Steps */}
              <div className="space-y-4">
                <h4 className="font-medium">Transaction Steps</h4>
                <div className="space-y-3">
                  {simulation.steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg border ${
                        step.status === 'active' ? 'bg-blue-50 border-blue-200' :
                        step.status === 'completed' ? 'bg-green-50 border-green-200' :
                        step.status === 'failed' ? 'bg-red-50 border-red-200' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`${getStepStatusColor(step.status)}`}>
                        {step.status === 'active' && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            {step.icon}
                          </motion.div>
                        )}
                        {step.status !== 'active' && step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs text-gray-600">{step.description}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {(step.duration / 1000).toFixed(1)}s
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Simulation Metrics */}
              <div className="space-y-4">
                <h4 className="font-medium">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={simulation.successRate} className="w-24 h-2" />
                      <span className="text-sm font-medium">{simulation.successRate}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Time</span>
                    <span className="text-sm font-medium">{(simulation.totalTime / 1000).toFixed(1)}s</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">User Experience</span>
                    <Badge className={getUXColor(simulation.userExperience)}>
                      {simulation.userExperience}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-sm text-blue-900 mb-2">Solana Pay Notes</h5>
                  <p className="text-sm text-blue-800">{simulation.wallet.solanaPayNotes}</p>
                </div>

                {simulationComplete && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Simulation completed! This represents the typical user experience for {simulation.wallet.name}.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison View */}
      <Card>
        <CardHeader>
          <CardTitle>Solana Pay Comparison</CardTitle>
          <CardDescription>
            Compare Solana Pay implementation across different wallets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Wallet</th>
                  <th className="text-left p-2">Support</th>
                  <th className="text-left p-2">UX Pattern</th>
                  <th className="text-left p-2">Est. Time</th>
                  <th className="text-left p-2">Success Rate</th>
                  <th className="text-left p-2">Experience</th>
                </tr>
              </thead>
              <tbody>
                {supportedWallets.map((wallet) => {
                  const sim = createSimulation(wallet)
                  return (
                    <tr key={wallet.id} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <WalletIcon walletName={wallet.name} size="md" className="rounded-full" />
                          <span className="font-medium">{wallet.name}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className="capitalize">
                          {wallet.features.solanaPayQR}
                        </Badge>
                      </td>
                      <td className="p-2 capitalize">{wallet.userExperience.solanaPayUX}</td>
                      <td className="p-2">{(sim.totalTime / 1000).toFixed(1)}s</td>
                      <td className="p-2">{sim.successRate}%</td>
                      <td className="p-2">
                        <Badge className={getUXColor(sim.userExperience)}>
                          {sim.userExperience}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SolanaPaySimulator 