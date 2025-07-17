# Wallet Matrix

A premium Solana wallet comparison dashboard for comparing wallets across features, security, and Solana Pay compatibility with advanced filtering and insights.

## Features

### Core Functionality
- **Comprehensive Wallet Database**: 15+ wallets including Phantom, Solflare, Backpack, hardware wallets, and regional options
- **Advanced Filtering**: Multi-dimensional filtering by platform, custody model, features, and more
- **Multiple Views**: Grid, table, and comparison views for different use cases
- **Real-time Search**: Debounced search across wallet names, descriptions, and features
- **Wallet Comparison**: Side-by-side comparison of up to 5 wallets
- **Solana Pay Deep Dive**: Detailed testing notes and compatibility information

### Technical Features
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive styling
- **Vite** for fast development and building
- **Zustand** for state management
- **React Query** for data fetching and caching
- **Framer Motion** for smooth animations
- **Persistent Storage** for user preferences and saved filters

### Data Management
- **JSON Data Store** with comprehensive wallet information
- **Data Validation** for wallet information integrity
- **Export Functionality** (CSV, JSON, PDF) - Coming soon
- **Version Control** for wallet updates
- **Community Contribution System** - Coming soon

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation and view controls
│   ├── WalletCard.tsx  # Individual wallet display
│   ├── WalletGrid.tsx  # Grid layout for wallets
│   ├── WalletTable.tsx # Table view (coming soon)
│   ├── FilterPanel.tsx # Advanced filtering interface
│   ├── SearchBar.tsx   # Search functionality
│   ├── ComparisonView.tsx # Wallet comparison
│   └── ...
├── data/               # Data layer
│   └── wallets.json    # Comprehensive wallet database
├── hooks/              # Custom React hooks
│   └── useWallets.ts   # Data fetching logic
├── store/              # State management
│   └── walletStore.ts  # Zustand store
├── types/              # TypeScript definitions
│   └── wallet.ts       # Wallet data types
└── utils/              # Utility functions
```

## Wallet Database Schema

Each wallet entry includes:

```typescript
interface WalletFeature {
  id: string
  name: string
  description: string
  platforms: Platform[]
  custodyModel: 'self-custody' | 'mpc' | 'custodial'
  features: {
    dexSwap: boolean
    nftGallery: boolean
    staking: boolean
    fiatOnRamp: boolean
    fiatOffRamp: boolean
    pushNotifications: boolean
    solanaPayQR: 'yes' | 'partial' | 'no'
    biometricAuth: boolean
    hardwareWalletSupport: boolean
    multiChain: boolean
    dappBrowser: boolean
  }
  security: {
    auditStatus: 'audited' | 'unaudited' | 'pending'
    auditCompany?: string
    sourceCode: 'open' | 'closed' | 'partial'
  }
  performance: {
    transactionSpeed: 'fast' | 'medium' | 'slow'
    failureRate: 'low' | 'medium' | 'high'
    uptime: number
  }
  // ... and more
}
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wallet-matrix.git
cd wallet-matrix
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Supported Wallets

### Major Wallets
- **Phantom**: Full-featured wallet with excellent Solana Pay support
- **Solflare**: Native Solana wallet with comprehensive features
- **Backpack**: xNFT-focused wallet with unique features
- **Bitget Wallet**: Multi-chain wallet with Solana support
- **OKX Wallet**: Comprehensive Web3 wallet
- **Exodus**: Multi-chain portfolio management
- **Glow**: Power-user focused Solana wallet
- **Slope**: DeFi-focused Solana wallet
- **Trust Wallet**: Mobile-first multi-chain wallet
- **Coinbase Wallet**: Self-custody wallet from Coinbase

### Hardware Wallets
- **Ledger Nano S/X**: Most trusted hardware wallet
- **Trezor**: Original hardware wallet with Solana support
- **Tangem**: Card-based hardware wallet

### Regional/Niche Wallets
- **Atomic Wallet**: Desktop-focused multi-chain wallet
- **Torus**: Social login-based wallet
- **Saga**: Solana phone with built-in wallet
- **Decaf**: Privacy-focused Solana wallet

## Solana Pay Integration

The application provides detailed information about Solana Pay compatibility:

- **Full Support**: One-tap QR scanning with native integration
- **Partial Support**: QR scanning available but may require navigation
- **No Support**: No Solana Pay functionality

Each wallet includes detailed testing notes about:
- UX flow (one-tap vs buried in menus)
- Error handling capabilities
- Performance metrics
- Transaction success rates

## Development

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Data Fetching**: React Query
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

### Key Features Implementation Status

✅ **Completed**:
- Project setup with all dependencies
- Comprehensive wallet database (15+ wallets)
- TypeScript types and schema
- Zustand store with filtering logic
- Core components (Header, WalletCard, FilterPanel, SearchBar)
- Responsive grid layout
- Advanced filtering system
- Search functionality with debouncing
- Wallet comparison selection
- Solana Pay feature highlighting

🚧 **In Progress**:
- Table view implementation
- Comparison view with side-by-side details
- Export functionality (CSV, JSON, PDF)
- Analytics and insights dashboard

📋 **Planned**:
- Real-time wallet status monitoring
- Community ratings and reviews
- Automated testing for Solana Pay compatibility
- Screenshot storage system
- Community contribution workflow

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Adding New Wallets

1. Update `src/data/wallets.json` with wallet information
2. Ensure all required fields are populated
3. Test the wallet's Solana Pay functionality
4. Add testing notes and screenshots
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

For questions or issues:
- Open an issue on GitHub
- Join our Discord community
- Follow us on Twitter

## Acknowledgments

- Solana Foundation for ecosystem support
- Wallet teams for providing testing access
- Community contributors for data validation
- Security auditors for wallet assessments

---

Built with ❤️ for the Solana ecosystem 