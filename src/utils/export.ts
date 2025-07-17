import { WalletFeature, ExportOptions } from '../types/wallet'
import { format } from 'date-fns'

// CSV Export Functions
export const exportToCSV = (wallets: WalletFeature[], options: ExportOptions): string => {
  const headers = getCSVHeaders(options)
  const rows = wallets.map(wallet => formatWalletForCSV(wallet, options))
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

const getCSVHeaders = (options: ExportOptions): string[] => {
  const baseHeaders = [
    'Name',
    'Category',
    'Custody Model',
    'Platforms',
    'Version',
    'Last Tested',
    'Website'
  ]

  if (options.includeFeatures) {
    baseHeaders.push(
      'DEX Swap',
      'NFT Gallery',
      'Staking',
      'Fiat On-Ramp',
      'Fiat Off-Ramp',
      'Push Notifications',
      'Solana Pay QR',
      'Biometric Auth',
      'Hardware Support',
      'Multi-chain',
      'DApp Browser'
    )
  }

  if (options.includeSecurity) {
    baseHeaders.push(
      'Audit Status',
      'Audit Company',
      'Audit Date',
      'Source Code'
    )
  }

  if (options.includePerformance) {
    baseHeaders.push(
      'Transaction Speed',
      'Failure Rate',
      'Uptime',
      'Free',
      'Transaction Fees'
    )
  }

  if (options.includeLinks) {
    baseHeaders.push(
      'Web Link',
      'Chrome Link',
      'Firefox Link',
      'iOS Link',
      'Android Link',
      'Desktop Link'
    )
  }

  return baseHeaders
}

const formatWalletForCSV = (wallet: WalletFeature, options: ExportOptions): string[] => {
  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  const boolToString = (value: boolean) => value ? 'Yes' : 'No'

  const baseRow = [
    escapeCSV(wallet.name),
    escapeCSV(wallet.category),
    escapeCSV(wallet.custodyModel),
    escapeCSV(wallet.platforms.join('; ')),
    escapeCSV(wallet.version),
    escapeCSV(format(new Date(wallet.lastTested), 'yyyy-MM-dd')),
    escapeCSV(wallet.website)
  ]

  if (options.includeFeatures) {
    baseRow.push(
      boolToString(wallet.features.dexSwap),
      boolToString(wallet.features.nftGallery),
      boolToString(wallet.features.staking),
      boolToString(wallet.features.fiatOnRamp),
      boolToString(wallet.features.fiatOffRamp),
      boolToString(wallet.features.pushNotifications),
      escapeCSV(wallet.features.solanaPayQR),
      boolToString(wallet.features.biometricAuth),
      boolToString(wallet.features.hardwareWalletSupport),
      boolToString(wallet.features.multiChain),
      boolToString(wallet.features.dappBrowser)
    )
  }

  if (options.includeSecurity) {
    baseRow.push(
      escapeCSV(wallet.security.auditStatus),
      escapeCSV(wallet.security.auditCompany || 'N/A'),
      escapeCSV(wallet.security.auditDate ? format(new Date(wallet.security.auditDate), 'yyyy-MM-dd') : 'N/A'),
      escapeCSV(wallet.security.sourceCode)
    )
  }

  if (options.includePerformance) {
    baseRow.push(
      escapeCSV(wallet.performance.transactionSpeed),
      escapeCSV(wallet.performance.failureRate),
      escapeCSV(wallet.performance.uptime.toString()),
      boolToString(wallet.pricing.free),
      escapeCSV(wallet.pricing.transactionFees)
    )
  }

  if (options.includeLinks) {
    baseRow.push(
      escapeCSV(wallet.downloadLinks.web || 'N/A'),
      escapeCSV(wallet.downloadLinks.chrome || 'N/A'),
      escapeCSV(wallet.downloadLinks.firefox || 'N/A'),
      escapeCSV(wallet.downloadLinks.ios || 'N/A'),
      escapeCSV(wallet.downloadLinks.android || 'N/A'),
      escapeCSV(wallet.downloadLinks.desktop || 'N/A')
    )
  }

  return baseRow
}

// JSON Export Functions
export const exportToJSON = (wallets: WalletFeature[], options: ExportOptions): string => {
  const filteredWallets = wallets.map(wallet => filterWalletForExport(wallet, options))
  
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    walletCount: wallets.length,
    options,
    wallets: filteredWallets
  }, null, 2)
}

const filterWalletForExport = (wallet: WalletFeature, options: ExportOptions): Partial<WalletFeature> => {
  const filtered: any = {
    id: wallet.id,
    name: wallet.name,
    description: wallet.description,
    category: wallet.category,
    custodyModel: wallet.custodyModel,
    platforms: wallet.platforms,
    version: wallet.version,
    lastTested: wallet.lastTested,
    website: wallet.website,
    logo: wallet.logo,
    solanaPayNotes: wallet.solanaPayNotes
  }

  if (options.includeFeatures) {
    filtered.features = wallet.features
  }

  if (options.includeSecurity) {
    filtered.security = wallet.security
  }

  if (options.includePerformance) {
    filtered.performance = wallet.performance
    filtered.userExperience = wallet.userExperience
    filtered.pricing = wallet.pricing
  }

  if (options.includeLinks) {
    filtered.downloadLinks = wallet.downloadLinks
  }

  return filtered
}

// PDF Export Functions (placeholder - would need a PDF library like jsPDF)
export const exportToPDF = (wallets: WalletFeature[], options: ExportOptions): Promise<Blob> => {
  return new Promise((resolve) => {
    // This would typically use jsPDF or similar library
    // For now, we'll create a simple HTML-based PDF
    const htmlContent = generatePDFContent(wallets, options)
    const blob = new Blob([htmlContent], { type: 'text/html' })
    resolve(blob)
  })
}

const generatePDFContent = (wallets: WalletFeature[], options: ExportOptions): string => {
  const currentDate = format(new Date(), 'MMMM d, yyyy')
  
  let html = `
    <html>
      <head>
        <title>Solana Wallet Comparison Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .wallet { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
          .wallet-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .wallet-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
          .feature { padding: 5px; background: #f5f5f5; border-radius: 3px; }
          .yes { color: green; }
          .no { color: red; }
          .partial { color: orange; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Solana Wallet Comparison Report</h1>
          <p>Generated on ${currentDate}</p>
          <p>Total Wallets: ${wallets.length}</p>
        </div>
  `

  wallets.forEach(wallet => {
    html += `
      <div class="wallet">
        <div class="wallet-name">${wallet.name}</div>
        <div class="wallet-info">
          <div><strong>Category:</strong> ${wallet.category}</div>
          <div><strong>Custody:</strong> ${wallet.custodyModel}</div>
          <div><strong>Platforms:</strong> ${wallet.platforms.join(', ')}</div>
          <div><strong>Version:</strong> ${wallet.version}</div>
          <div><strong>Last Tested:</strong> ${format(new Date(wallet.lastTested), 'MMM d, yyyy')}</div>
          <div><strong>Website:</strong> ${wallet.website}</div>
        </div>
        <p><strong>Description:</strong> ${wallet.description}</p>
    `

    if (options.includeFeatures) {
      html += `
        <div class="feature-grid">
          <div class="feature">DEX Swap: <span class="${wallet.features.dexSwap ? 'yes' : 'no'}">${wallet.features.dexSwap ? 'Yes' : 'No'}</span></div>
          <div class="feature">NFT Gallery: <span class="${wallet.features.nftGallery ? 'yes' : 'no'}">${wallet.features.nftGallery ? 'Yes' : 'No'}</span></div>
          <div class="feature">Staking: <span class="${wallet.features.staking ? 'yes' : 'no'}">${wallet.features.staking ? 'Yes' : 'No'}</span></div>
          <div class="feature">Solana Pay: <span class="${wallet.features.solanaPayQR}">${wallet.features.solanaPayQR}</span></div>
          <div class="feature">Hardware Support: <span class="${wallet.features.hardwareWalletSupport ? 'yes' : 'no'}">${wallet.features.hardwareWalletSupport ? 'Yes' : 'No'}</span></div>
          <div class="feature">Multi-chain: <span class="${wallet.features.multiChain ? 'yes' : 'no'}">${wallet.features.multiChain ? 'Yes' : 'No'}</span></div>
        </div>
      `
    }

    if (options.includeSecurity) {
      html += `
        <div style="margin-top: 10px;">
          <strong>Security:</strong> ${wallet.security.auditStatus} 
          ${wallet.security.auditCompany ? `by ${wallet.security.auditCompany}` : ''}
          | Source: ${wallet.security.sourceCode}
        </div>
      `
    }

    if (options.includePerformance) {
      html += `
        <div style="margin-top: 10px;">
          <strong>Performance:</strong> ${wallet.performance.transactionSpeed} speed, 
          ${wallet.performance.failureRate} failure rate, ${wallet.performance.uptime}% uptime
        </div>
      `
    }

    html += `
        <div style="margin-top: 10px;">
          <strong>Solana Pay Notes:</strong> ${wallet.solanaPayNotes}
        </div>
      </div>
    `
  })

  html += `
      </body>
    </html>
  `

  return html
}

// File download utility
export const downloadFile = (content: string | Blob, filename: string, contentType: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Import CSV functionality
export const importFromCSV = (csvContent: string): Promise<WalletFeature[]> => {
  return new Promise((resolve, reject) => {
    try {
      const lines = csvContent.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      const wallets: WalletFeature[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])
        const wallet = parseWalletFromCSV(headers, values)
        if (wallet) {
          wallets.push(wallet)
        }
      }
      
      resolve(wallets)
    } catch (error) {
      reject(new Error(`Failed to parse CSV: ${error}`))
    }
  })
}

const parseCSVLine = (line: string): string[] => {
  const values: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"' && !inQuotes) {
      inQuotes = true
    } else if (char === '"' && inQuotes) {
      if (line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = false
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  values.push(current.trim())
  return values
}

const parseWalletFromCSV = (headers: string[], values: string[]): WalletFeature | null => {
  try {
    const getValue = (header: string): string => {
      const index = headers.indexOf(header)
      return index >= 0 ? values[index] : ''
    }
    
    const getBoolValue = (header: string): boolean => {
      const value = getValue(header).toLowerCase()
      return value === 'yes' || value === 'true' || value === '1'
    }
    
    // This is a simplified version - you'd need to implement full parsing
    const wallet: WalletFeature = {
      id: getValue('Name').toLowerCase().replace(/\s+/g, '-'),
      name: getValue('Name'),
      description: getValue('Description') || '',
      category: getValue('Category') as any || 'niche',
      custodyModel: getValue('Custody Model') as any || 'self-custody',
      platforms: getValue('Platforms').split(';').map(p => p.trim()) as any[],
      version: getValue('Version'),
      lastTested: getValue('Last Tested'),
      website: getValue('Website'),
      logo: '',
      downloadLinks: {},
      solanaPayNotes: '',
      features: {
        dexSwap: getBoolValue('DEX Swap'),
        nftGallery: getBoolValue('NFT Gallery'),
        staking: getBoolValue('Staking'),
        fiatOnRamp: getBoolValue('Fiat On-Ramp'),
        fiatOffRamp: getBoolValue('Fiat Off-Ramp'),
        pushNotifications: getBoolValue('Push Notifications'),
        solanaPayQR: getValue('Solana Pay QR') as any || 'no',
        biometricAuth: getBoolValue('Biometric Auth'),
        hardwareWalletSupport: getBoolValue('Hardware Support'),
        multiChain: getBoolValue('Multi-chain'),
        dappBrowser: getBoolValue('DApp Browser')
      },
      security: {
        auditStatus: getValue('Audit Status') as any || 'unaudited',
        auditCompany: getValue('Audit Company') || undefined,
        auditDate: getValue('Audit Date') || undefined,
        sourceCode: getValue('Source Code') as any || 'closed'
      },
      performance: {
        transactionSpeed: getValue('Transaction Speed') as any || 'medium',
        failureRate: getValue('Failure Rate') as any || 'medium',
        uptime: parseFloat(getValue('Uptime')) || 95
      },
      userExperience: {
        onboarding: 'medium' as any,
        solanaPayUX: 'buried' as any,
        mobileOptimized: false
      },
      pricing: {
        free: getBoolValue('Free'),
        transactionFees: getValue('Transaction Fees') as any || 'medium'
      }
    }
    
    return wallet
  } catch (error) {
    console.error('Error parsing wallet from CSV:', error)
    return null
  }
}

// Validation utilities
export const validateWalletData = (wallet: Partial<WalletFeature>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!wallet.name) errors.push('Name is required')
  if (!wallet.description) errors.push('Description is required')
  if (!wallet.category) errors.push('Category is required')
  if (!wallet.custodyModel) errors.push('Custody model is required')
  if (!wallet.platforms || wallet.platforms.length === 0) errors.push('At least one platform is required')
  if (!wallet.version) errors.push('Version is required')
  if (!wallet.lastTested) errors.push('Last tested date is required')
  if (!wallet.website) errors.push('Website is required')
  
  return {
    isValid: errors.length === 0,
    errors
  }
} 