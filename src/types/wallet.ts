export type Platform = 'web' | 'chrome' | 'firefox' | 'safari' | 'edge' | 'ios' | 'android' | 'desktop' | 'hardware';

export type CustodyModel = 'self-custody' | 'mpc' | 'custodial';

export type SolanaPaySupport = 'yes' | 'partial' | 'no';

export interface PlatformLinks {
  web?: string;
  chrome?: string;
  firefox?: string;
  safari?: string;
  edge?: string;
  ios?: string;
  android?: string;
  desktop?: string;
  hardware?: string;
}

export interface WalletFeatures {
  dexSwap: boolean;
  nftGallery: boolean;
  staking: boolean;
  fiatOnRamp: boolean;
  fiatOffRamp: boolean;
  pushNotifications: boolean;
  solanaPayQR: SolanaPaySupport;
  biometricAuth: boolean;
  hardwareWalletSupport: boolean;
  multiChain: boolean;
  dappBrowser: boolean;
}

export interface WalletFeature {
  id: string;
  name: string;
  description: string;
  platforms: Platform[];
  custodyModel: CustodyModel;
  features: WalletFeatures;
  lastTested: string;
  version: string;
  logo: string;
  website: string;
  downloadLinks: PlatformLinks;
  solanaPayNotes: string;
  category: 'major' | 'hardware' | 'regional' | 'niche';
  security: {
    auditStatus: 'audited' | 'unaudited' | 'pending';
    auditCompany?: string;
    auditDate?: string;
    sourceCode: 'open' | 'closed' | 'partial';
  };
  performance: {
    transactionSpeed: 'fast' | 'medium' | 'slow';
    failureRate: 'low' | 'medium' | 'high';
    uptime: number; // percentage
  };
  userExperience: {
    onboarding: 'easy' | 'medium' | 'complex';
    solanaPayUX: 'one-tap' | 'buried' | 'none';
    mobileOptimized: boolean;
  };
  pricing: {
    free: boolean;
    transactionFees: 'low' | 'medium' | 'high';
    additionalCosts?: string;
  };
}

export interface FilterState {
  platforms: Platform[];
  custodyModel: CustodyModel[];
  categories: string[];
  features: Partial<WalletFeatures>;
  search: string;
  sortBy: 'name' | 'lastTested' | 'popularity' | 'security';
  sortOrder: 'asc' | 'desc';
}

export interface ComparisonState {
  selectedWallets: string[];
  maxSelection: number;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  includeFeatures: boolean;
  includeSecurity: boolean;
  includePerformance: boolean;
  includeLinks: boolean;
}

export interface WalletUpdate {
  walletId: string;
  version: string;
  features: Partial<WalletFeatures>;
  lastTested: string;
  notes: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AnalyticsData {
  adoptionTrends: {
    walletId: string;
    monthlyActiveUsers?: number;
    growthRate?: number;
  }[];
  featureGaps: {
    feature: keyof WalletFeatures;
    supportPercentage: number;
    missingWallets: string[];
  }[];
  solanaPayStats: {
    totalSupported: number;
    fullSupport: number;
    partialSupport: number;
    noSupport: number;
  };
  regionalPreferences: {
    region: string;
    popularWallets: string[];
  }[];
}

export interface SavedFilter {
  id: string;
  name: string;
  description: string;
  filters: FilterState;
  createdAt: string;
  isPublic: boolean;
} 