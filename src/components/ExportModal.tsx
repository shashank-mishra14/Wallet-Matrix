import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  FileText, 
  File, 
  FileSpreadsheet, 
  Upload,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import { ExportOptions } from '../types/wallet'
import { exportToCSV, exportToJSON, exportToPDF, downloadFile, importFromCSV } from '../utils/export'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'

const ExportModal: React.FC = () => {
  const { filteredWallets, comparison, setWallets } = useWalletStore()
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeFeatures: true,
    includeSecurity: true,
    includePerformance: true,
    includeLinks: false
  })
  const [exportScope, setExportScope] = useState<'all' | 'filtered' | 'comparison'>('filtered')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importErrors, setImportErrors] = useState<string[]>([])

  const getWalletsToExport = () => {
    switch (exportScope) {
      case 'all':
        return filteredWallets
      case 'filtered':
        return filteredWallets
      case 'comparison':
        return filteredWallets.filter(w => comparison.selectedWallets.includes(w.id))
      default:
        return filteredWallets
    }
  }

  const handleExport = async () => {
    const walletsToExport = getWalletsToExport()
    
    if (walletsToExport.length === 0) {
      setExportStatus('error')
      return
    }

    setIsExporting(true)
    setExportProgress(0)
    setExportStatus('idle')

    try {
      let content: string | Blob
      let filename: string
      let contentType: string

      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      switch (exportOptions.format) {
        case 'csv':
          content = exportToCSV(walletsToExport, exportOptions)
          filename = `solana-wallets-${format(new Date(), 'yyyy-MM-dd')}.csv`
          contentType = 'text/csv'
          break
        case 'json':
          content = exportToJSON(walletsToExport, exportOptions)
          filename = `solana-wallets-${format(new Date(), 'yyyy-MM-dd')}.json`
          contentType = 'application/json'
          break
        case 'pdf':
          content = await exportToPDF(walletsToExport, exportOptions)
          filename = `solana-wallets-${format(new Date(), 'yyyy-MM-dd')}.html`
          contentType = 'text/html'
          break
        default:
          throw new Error('Unsupported export format')
      }

      clearInterval(progressInterval)
      setExportProgress(100)

      // Download the file
      downloadFile(content, filename, contentType)
      
      setExportStatus('success')
      setTimeout(() => setExportStatus('idle'), 3000)
    } catch (error) {
      setExportStatus('error')
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const handleImport = async (file: File) => {
    setImportStatus('idle')
    setImportErrors([])

    try {
      const content = await file.text()
      const importedWallets = await importFromCSV(content)
      
      if (importedWallets.length === 0) {
        setImportStatus('error')
        setImportErrors(['No valid wallets found in the CSV file'])
        return
      }

      // Merge with existing wallets (you might want to handle duplicates differently)
      setWallets(importedWallets)
      setImportStatus('success')
      
      setTimeout(() => setImportStatus('idle'), 3000)
    } catch (error) {
      setImportStatus('error')
      setImportErrors([error instanceof Error ? error.message : 'Import failed'])
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImport(file)
    }
  }

  const walletsToExport = getWalletsToExport()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export & Import Wallet Data</span>
          </CardTitle>
          <CardDescription>
            Export wallet comparison data or import your own wallet database
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="export" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Export Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Export Configuration</CardTitle>
                <CardDescription>
                  Choose what data to include in your export
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="export-scope">Export Scope</Label>
                  <Select value={exportScope} onValueChange={(value: any) => setExportScope(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="filtered">
                        Filtered Results ({filteredWallets.length} wallets)
                      </SelectItem>
                      <SelectItem value="comparison">
                        Comparison Selection ({comparison.selectedWallets.length} wallets)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select 
                    value={exportOptions.format} 
                    onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">
                        <div className="flex items-center space-x-2">
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>CSV (Spreadsheet)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="json">
                        <div className="flex items-center space-x-2">
                          <File className="w-4 h-4" />
                          <span>JSON (Data)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="pdf">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>PDF (Report)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Include Data</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-features"
                        checked={exportOptions.includeFeatures}
                        onCheckedChange={(checked) => 
                          setExportOptions(prev => ({ ...prev, includeFeatures: checked as boolean }))
                        }
                      />
                      <Label htmlFor="include-features">Features & Capabilities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-security"
                        checked={exportOptions.includeSecurity}
                        onCheckedChange={(checked) => 
                          setExportOptions(prev => ({ ...prev, includeSecurity: checked as boolean }))
                        }
                      />
                      <Label htmlFor="include-security">Security & Audits</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-performance"
                        checked={exportOptions.includePerformance}
                        onCheckedChange={(checked) => 
                          setExportOptions(prev => ({ ...prev, includePerformance: checked as boolean }))
                        }
                      />
                      <Label htmlFor="include-performance">Performance & Pricing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-links"
                        checked={exportOptions.includeLinks}
                        onCheckedChange={(checked) => 
                          setExportOptions(prev => ({ ...prev, includeLinks: checked as boolean }))
                        }
                      />
                      <Label htmlFor="include-links">Download Links</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Export Preview</CardTitle>
                <CardDescription>
                  Review what will be exported
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Wallets:</span>
                    <span className="ml-2">{walletsToExport.length}</span>
                  </div>
                  <div>
                    <span className="font-medium">Format:</span>
                    <span className="ml-2 uppercase">{exportOptions.format}</span>
                  </div>
                  <div>
                    <span className="font-medium">Features:</span>
                    <span className="ml-2">{exportOptions.includeFeatures ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Security:</span>
                    <span className="ml-2">{exportOptions.includeSecurity ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Performance:</span>
                    <span className="ml-2">{exportOptions.includePerformance ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Links:</span>
                    <span className="ml-2">{exportOptions.includeLinks ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                {walletsToExport.length > 0 && (
                  <div className="space-y-2">
                    <Label>Sample Wallets</Label>
                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                      {walletsToExport.slice(0, 3).map(wallet => (
                        <div key={wallet.id} className="flex items-center space-x-2">
                          <img 
                            src={wallet.logo} 
                            alt={wallet.name} 
                            className="w-4 h-4 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = `https://via.placeholder.com/16x16?text=${wallet.name.charAt(0)}`
                            }}
                          />
                          <span>{wallet.name}</span>
                        </div>
                      ))}
                      {walletsToExport.length > 3 && (
                        <div className="text-gray-500 mt-1">
                          +{walletsToExport.length - 3} more wallets
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isExporting && (
                  <div className="space-y-2">
                    <Label>Export Progress</Label>
                    <Progress value={exportProgress} className="w-full" />
                  </div>
                )}

                {exportStatus === 'success' && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Export completed successfully! File downloaded.
                    </AlertDescription>
                  </Alert>
                )}

                {exportStatus === 'error' && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Export failed. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleExport}
                  disabled={isExporting || walletsToExport.length === 0}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Download className="w-4 h-4" />
                      </motion.div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Import Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Import Wallet Data</CardTitle>
                <CardDescription>
                  Import wallet data from CSV files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Upload CSV File</p>
                    <p className="text-xs text-gray-500">
                      Supported format: CSV with wallet data
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="mt-4"
                  />
                </div>

                {importStatus === 'success' && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Import completed successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {importStatus === 'error' && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p>Import failed:</p>
                        {importErrors.map((error, index) => (
                          <p key={index} className="text-sm">• {error}</p>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Import Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Import Instructions</CardTitle>
                <CardDescription>
                  How to prepare your CSV file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Required Columns</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Name</li>
                      <li>• Category</li>
                      <li>• Custody Model</li>
                      <li>• Platforms</li>
                      <li>• Version</li>
                      <li>• Website</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Optional Columns</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• DEX Swap (Yes/No)</li>
                      <li>• NFT Gallery (Yes/No)</li>
                      <li>• Staking (Yes/No)</li>
                      <li>• Solana Pay QR (yes/partial/no)</li>
                      <li>• Audit Status</li>
                      <li>• Transaction Speed</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Format Notes</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use semicolons to separate multiple platforms</li>
                      <li>• Boolean values: Yes/No, true/false, 1/0</li>
                      <li>• Dates in YYYY-MM-DD format</li>
                      <li>• Wrap values with commas in quotes</li>
                    </ul>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download Sample CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ExportModal 