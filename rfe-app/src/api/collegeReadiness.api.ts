import config from '../config';

// Types
export type TierId = 'ivy' | 'tier1' | 'tier2' | 'regional';

export interface TierConfig {
  id: TierId;
  name: string;
  weeklyRate: number;
  color: string;
  description: string;
}

export interface CheckBasicDataResponse {
  success: boolean;
  data: {
    hasBasicData: boolean;
    missingFields: string[];
    currentData: {
      gradeLevel: string | null;
      country: string | null;
      desiredCollegeCountries: string[];
    };
    hasActiveChecklist: boolean;
    activeChecklistId: string | null;
    collegeReadiness: {
      hasGeneratedChecklist: boolean;
      lastChecklistGeneratedAt: string | null;
    };
  };
}

export interface BasicDataUpdate {
  gradeLevel?: string;
  country?: string;
  desiredCollegeCountries?: string[];
}

export interface FormOptions {
  fieldsOfStudy: string[];
  tiers: TierConfig[];
  commonLanguages: string[];
}

export interface FormOptionsResponse {
  success: boolean;
  data: FormOptions;
}

export interface CollegeSearchResult {
  _id: string;
  name: string;
  shortName: string;
  country: string;
  logo: string;
}

export interface CollegeSearchResponse {
  success: boolean;
  data: {
    colleges: CollegeSearchResult[];
  };
}

export interface PreferredCollege {
  collegeId?: string;
  manualEntry?: string;
}

export interface GenerateChecklistRequest {
  fieldOfStudy: string;
  targetTier: TierId;
  languagesKnown: string[];
  preferredColleges: PreferredCollege[];
}

export interface CalculationData {
  estimatedCost: number | null;
  currency: string;
  currentPoints: number;
  targetPoints: number | null;
  weeksRemaining: number | null;
  requiredWeeklyRate: number | null;
  suggestedTier: TierId | null;
}

export interface ChecklistItem {
  itemId: string;
  title: string;
  description: string | null;
  actionType: 'checkbox' | 'file_upload' | 'link' | 'calculation' | 'info';
  linkedDocumentCategory: string | null;
  linkedDocument: {
    _id: string;
    name: string;
    url: string;
    fileType: string;
  } | null;
  calculationData: CalculationData | null;
  externalLink: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  priority: 'critical' | 'high' | 'medium' | 'low';
  deadline: string | null;
  notes: string | null;
}

export interface ChecklistSection {
  sectionId: string;
  name: string;
  icon: string;
  order: number;
  items: ChecklistItem[];
}

export interface Checklist {
  _id: string;
  user: string;
  formData: {
    fieldOfStudy: string;
    targetTier: TierId;
    languagesKnown: string[];
    preferredColleges: {
      college: string | null;
      manualEntry: string | null;
    }[];
  };
  profileSnapshot: {
    gradeLevel: string;
    country: string;
    desiredCollegeCountries: string[];
  };
  sections: ChecklistSection[];
  progress: {
    totalItems: number;
    completedItems: number;
    percentage: number;
  };
  aiGeneration: {
    prompt: string;
    model: string;
    generatedAt: string;
    tokensUsed: number | null;
  };
  version: number;
  lastGeneratedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistResponse {
  success: boolean;
  message?: string;
  data: {
    hasChecklist: boolean;
    checklist?: Checklist;
  };
}

export interface GenerateChecklistResponse {
  success: boolean;
  message: string;
  data: {
    checklist: Checklist;
  };
}

export interface ChecklistHistoryItem {
  _id: string;
  formData: {
    fieldOfStudy: string;
    targetTier: TierId;
  };
  progress: {
    totalItems: number;
    completedItems: number;
    percentage: number;
  };
  version: number;
  isActive: boolean;
  createdAt: string;
}

export interface ChecklistHistoryResponse {
  success: boolean;
  data: {
    checklists: ChecklistHistoryItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface UpdateItemResponse {
  success: boolean;
  message: string;
  data: {
    progress: {
      totalItems: number;
      completedItems: number;
      percentage: number;
    };
  };
}

export interface LinkDocumentResponse {
  success: boolean;
  message: string;
  data: {
    progress: {
      totalItems: number;
      completedItems: number;
      percentage: number;
    };
    document: {
      _id: string;
      name: string;
      url: string;
      fileType: string;
    };
  };
}

export interface RateLimitError {
  success: false;
  message: string;
  data: {
    nextAvailableAt: string;
    daysRemaining: number;
  };
}

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

// College Readiness API functions
export const collegeReadinessApi = {
  // Check if user has required basic data
  async checkBasicData(token: string): Promise<CheckBasicDataResponse> {
    return apiRequest<CheckBasicDataResponse>(
      '/college-readiness/check-basic-data',
      {},
      token
    );
  },

  // Update basic profile data
  async updateBasicData(
    token: string,
    data: BasicDataUpdate
  ): Promise<{ success: boolean; message: string; data: BasicDataUpdate }> {
    return apiRequest(
      '/college-readiness/basic-data',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      token
    );
  },

  // Get form options (fields of study, tiers, languages)
  async getFormOptions(token: string): Promise<FormOptionsResponse> {
    return apiRequest<FormOptionsResponse>(
      '/college-readiness/form-options',
      {},
      token
    );
  },

  // Search colleges
  async searchColleges(
    token: string,
    query: string,
    limit: number = 10
  ): Promise<CollegeSearchResponse> {
    return apiRequest<CollegeSearchResponse>(
      `/college-readiness/search-colleges?q=${encodeURIComponent(query)}&limit=${limit}`,
      {},
      token
    );
  },

  // Generate checklist via AI
  async generateChecklist(
    token: string,
    data: GenerateChecklistRequest
  ): Promise<GenerateChecklistResponse> {
    return apiRequest<GenerateChecklistResponse>(
      '/college-readiness/generate',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  },

  // Get active checklist
  async getChecklist(token: string): Promise<ChecklistResponse> {
    return apiRequest<ChecklistResponse>(
      '/college-readiness/checklist',
      {},
      token
    );
  },

  // Get checklist history
  async getHistory(
    token: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ChecklistHistoryResponse> {
    return apiRequest<ChecklistHistoryResponse>(
      `/college-readiness/history?page=${page}&limit=${limit}`,
      {},
      token
    );
  },

  // Update checklist item
  async updateItem(
    token: string,
    checklistId: string,
    sectionId: string,
    itemId: string,
    data: { isCompleted?: boolean; notes?: string }
  ): Promise<UpdateItemResponse> {
    return apiRequest<UpdateItemResponse>(
      `/college-readiness/checklist/${checklistId}/items/${sectionId}/${itemId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      token
    );
  },

  // Link document to item
  async linkDocument(
    token: string,
    checklistId: string,
    sectionId: string,
    itemId: string,
    documentId: string
  ): Promise<LinkDocumentResponse> {
    return apiRequest<LinkDocumentResponse>(
      `/college-readiness/checklist/${checklistId}/items/${sectionId}/${itemId}/link-document`,
      {
        method: 'POST',
        body: JSON.stringify({ documentId }),
      },
      token
    );
  },

  // Regenerate checklist
  async regenerateChecklist(
    token: string,
    data: GenerateChecklistRequest
  ): Promise<GenerateChecklistResponse | RateLimitError> {
    return apiRequest<GenerateChecklistResponse>(
      '/college-readiness/regenerate',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  },
};

export default collegeReadinessApi;
