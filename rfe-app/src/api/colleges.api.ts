import config from '../config';
import { storage } from '../utils/storage';

// Types
export interface College {
  _id: string;
  name: string;
  shortName?: string;
  country: string;
  city: string;
  state?: string;
  address?: string;
  logo: string | null;
  coverImage: string | null;
  description: string;
  tagline: string;
  type: 'University' | 'College' | 'Institute' | 'School' | 'Other';
  status: 'Unaffiliated' | 'Waitlist' | 'Building' | 'Live';
  rank?: number;
  departments?: string[];
  isFeatured?: boolean;
  about?: string;
  mission?: string;
  vision?: string;
  website?: string;
  email?: string;
  phone?: string;
  establishedYear?: number;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  communityLife?: {
    totalMembers?: number;
    internationalMembers?: number;
    memberToFacultyRatio?: string;
    clubs?: number;
    sports?: string[];
  };
  campusSize?: {
    value?: number;
    unit?: 'acres' | 'hectares' | 'sq ft' | 'sq meters';
  };
  facilities?: Array<{
    name: string;
    description?: string;
    icon?: string;
  }>;
  admissions?: {
    acceptanceRate?: number;
    applicationDeadline?: string;
    requirements?: string;
    tuitionFee?: {
      domestic?: number;
      international?: number;
      currency?: string;
    };
  };
  admin: {
    name: string;
    email: string;
  } | null;
}

export interface CollegeInteractionStatus {
  isFollowing: boolean;
  isInterested: boolean;
}

export interface CollegesResponse {
  colleges: College[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  globalStats: {
    totalColleges: number;
  };
}

// API helper function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
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

// Colleges API functions
export const collegesApi = {
  // Get all colleges
  async getAll(params?: {
    search?: string;
    country?: string;
    type?: string;
    status?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<CollegesResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const endpoint = `/colleges${query ? `?${query}` : ''}`;
    return apiRequest<CollegesResponse>(endpoint);
  },

  // Get single college by ID
  async getById(id: string): Promise<College> {
    return apiRequest<College>(`/colleges/${id}`);
  },

  // Search colleges
  async search(query: string): Promise<{ colleges: College[] }> {
    return apiRequest<{ colleges: College[] }>(
      `/colleges/search?search=${encodeURIComponent(query)}`
    );
  },

  // Get featured colleges for carousel
  async getFeatured(limit: number = 10): Promise<{ success: boolean; data: College[] }> {
    return apiRequest<{ success: boolean; data: College[] }>(
      `/colleges/featured?limit=${limit}`
    );
  },

  // Follow a college (requires auth)
  async follow(collegeId: string): Promise<{ success: boolean; message: string }> {
    const token = await storage.getToken();
    return apiRequest<{ success: boolean; message: string }>('/user/colleges/follow', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ collegeId }),
    });
  },

  // Unfollow a college (requires auth)
  async unfollow(collegeId: string): Promise<{ success: boolean; message: string }> {
    const token = await storage.getToken();
    return apiRequest<{ success: boolean; message: string }>(`/user/colleges/follow/${collegeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Express interest in a college (requires auth)
  async expressInterest(collegeId: string): Promise<{ success: boolean; message: string }> {
    const token = await storage.getToken();
    return apiRequest<{ success: boolean; message: string }>('/user/colleges/interested', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ collegeId }),
    });
  },

  // Remove interest from a college (requires auth)
  async removeInterest(collegeId: string): Promise<{ success: boolean; message: string }> {
    const token = await storage.getToken();
    return apiRequest<{ success: boolean; message: string }>(`/user/colleges/interested/${collegeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get college interaction status (requires auth)
  async getCollegeStatus(collegeId: string): Promise<{ success: boolean; data: CollegeInteractionStatus }> {
    const token = await storage.getToken();
    return apiRequest<{ success: boolean; data: CollegeInteractionStatus }>(`/user/colleges/${collegeId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default collegesApi;
