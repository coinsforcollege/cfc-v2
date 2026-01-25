import config from '../config';

// Types
export interface College {
  _id: string;
  name: string;
  logo?: string;
  country?: string;
  coverImage?: string;
  description?: string;
  website?: string;
}

export interface RequiredDocument {
  _id: string;
  name: string;
  description?: string;
  required: boolean;
}

export interface ScholarshipOffer {
  _id: string;
  college: College;
  createdBy: string;
  title: string;
  totalValue: number;
  currency: string;
  terms: string;
  description: string;
  formalLetter?: string;
  requiredDocuments: RequiredDocument[];
  targeting: {
    type: 'all' | 'individual' | 'country' | 'gradeLevel' | 'pointsRange' | 'combined';
    students?: string[];
    countries?: string[];
    gradeLevels?: string[];
    pointsRange?: { min: number | null; max: number | null };
  };
  status: 'draft' | 'active' | 'expired' | 'cancelled';
  expiryDate?: string;
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
  // Added when user has responded
  responseStatus?: 'pending' | 'accepted' | 'rejected';
  respondedAt?: string;
}

export interface OfferResponse {
  _id: string;
  student: string;
  offer: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedDocuments: {
    requiredDocId: string;
    document: string;
    submittedAt: string;
  }[];
  respondedAt?: string;
  rejectionReason?: string;
}

export interface OffersResponse {
  success: boolean;
  data: ScholarshipOffer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
  };
}

export interface SingleOfferResponse {
  success: boolean;
  data: {
    offer: ScholarshipOffer;
    existingResponse: {
      status: 'pending' | 'accepted' | 'rejected';
      respondedAt: string;
    } | null;
    isEligible: boolean;
  };
}

export interface RecommendedOfferResponse {
  success: boolean;
  data: ScholarshipOffer | null;
  message?: string;
}

export interface AcceptOfferResponse {
  success: boolean;
  message: string;
  data: OfferResponse;
}

export interface RejectOfferResponse {
  success: boolean;
  message: string;
  data: OfferResponse;
}

// API helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// API methods
export const offersApi = {
  // Get offers for the student
  async getOffers(
    token: string,
    params?: { status?: 'active' | 'accepted' | 'rejected'; page?: number; limit?: number }
  ): Promise<OffersResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const endpoint = `/student-offers${query ? `?${query}` : ''}`;
    return apiRequest<OffersResponse>(endpoint, {}, token);
  },

  // Get a single random recommended offer
  async getRecommendedOffer(token: string): Promise<RecommendedOfferResponse> {
    return apiRequest<RecommendedOfferResponse>('/student-offers/recommended', {}, token);
  },

  // Get offer details
  async getOfferDetails(token: string, offerId: string): Promise<SingleOfferResponse> {
    return apiRequest<SingleOfferResponse>(`/student-offers/${offerId}`, {}, token);
  },

  // Accept an offer with documents
  async acceptOffer(
    token: string,
    offerId: string,
    submittedDocuments: { requiredDocId: string; documentId: string }[]
  ): Promise<AcceptOfferResponse> {
    return apiRequest<AcceptOfferResponse>(
      `/student-offers/${offerId}/accept`,
      {
        method: 'POST',
        body: JSON.stringify({ submittedDocuments }),
      },
      token
    );
  },

  // Reject an offer
  async rejectOffer(
    token: string,
    offerId: string,
    reason?: string
  ): Promise<RejectOfferResponse> {
    return apiRequest<RejectOfferResponse>(
      `/student-offers/${offerId}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ reason }),
      },
      token
    );
  },
};

export default offersApi;
