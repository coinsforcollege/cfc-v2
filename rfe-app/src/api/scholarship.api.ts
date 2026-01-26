import config from '../config';

// Types
export interface ScholarshipWallet {
  _id: string;
  user: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScholarshipTransaction {
  _id: string;
  user: string;
  type: 'earned' | 'spent' | 'adjustment';
  amount: number;
  source: string;
  reference?: string;
  referenceModel?: string;
  description: string;
  balanceAfter: number;
  metadata?: {
    category?: string;
    categoryId?: string;
    parentCategory?: string;
    parentCategoryId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChartDataPoint {
  date: string;
  balance: number;
}

export interface CategoryBreakdown {
  category: string;
  totalPoints: number;
  transactionCount: number;
}

export interface ScholarshipAnalytics {
  accountCreatedAt: string;
  currentBalance: number;
  totalEarned: number;
  chartData: ChartDataPoint[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface WalletResponse {
  success: boolean;
  data: ScholarshipWallet;
}

export interface TransactionsResponse {
  success: boolean;
  data: ScholarshipTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AnalyticsResponse {
  success: boolean;
  data: ScholarshipAnalytics;
}

// Tier configuration
export type TierId = 'ivy' | 'tier1' | 'tier2' | 'regional';

export interface TierConfig {
  id: TierId;
  name: string;
  weeklyRate: number;
  color: string;
  description: string;
}

export const TIER_CONFIGS: TierConfig[] = [
  {
    id: 'ivy',
    name: 'Ivy League',
    weeklyRate: 300,
    color: '#3B82F6',
    description: 'Top tier universities',
  },
  {
    id: 'tier1',
    name: 'Tier 1',
    weeklyRate: 200,
    color: '#8B5CF6',
    description: 'Highly competitive schools',
  },
  {
    id: 'tier2',
    name: 'Tier 2',
    weeklyRate: 100,
    color: '#22C55E',
    description: 'Competitive schools',
  },
  {
    id: 'regional',
    name: 'Regional',
    weeklyRate: 50,
    color: '#F97316',
    description: 'Regional universities',
  },
];

export const getTierById = (id: TierId): TierConfig => {
  return TIER_CONFIGS.find((t) => t.id === id) || TIER_CONFIGS[0];
};

// API helper function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token: string
): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'An error occurred',
      ...data,
    };
  }

  return data;
}

// Scholarship API functions
export const scholarshipApi = {
  // Get user's wallet balance
  async getWallet(token: string): Promise<WalletResponse> {
    return apiRequest<WalletResponse>('/scholarship/balance', {}, token);
  },

  // Get user's transaction history
  async getTransactions(
    token: string,
    params?: { page?: number; limit?: number; type?: string; source?: string }
  ): Promise<TransactionsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest<TransactionsResponse>(
      `/scholarship/transactions${query ? `?${query}` : ''}`,
      {},
      token
    );
  },

  // Get analytics for charts and breakdowns
  async getAnalytics(token: string): Promise<AnalyticsResponse> {
    return apiRequest<AnalyticsResponse>('/scholarship/analytics', {}, token);
  },
};

export default scholarshipApi;
