import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="loading-spinner"></div>
      <p className="mt-4 text-sm text-gray-600">Loading wallets...</p>
    </div>
  )
}

export default LoadingSpinner 