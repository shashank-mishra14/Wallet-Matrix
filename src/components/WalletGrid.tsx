import React from 'react'
import { motion } from 'framer-motion'
import { WalletFeature } from '../types/wallet'
import WalletCard from './WalletCard'

interface WalletGridProps {
  wallets: WalletFeature[]
}

const WalletGrid: React.FC<WalletGridProps> = ({ wallets }) => {
  if (wallets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No wallets found matching your criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wallets.map((wallet, index) => (
        <motion.div
          key={wallet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <WalletCard wallet={wallet} />
        </motion.div>
      ))}
    </div>
  )
}

export default WalletGrid 