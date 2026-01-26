import config from '../config';

// Types
export interface School {
  name: string | null;
  address: string | null;
}

export interface OfferStats {
  total: number;
  active: number;
  accepted: number;
  rejected: number;
}

export interface ProfileStats {
  followedCollegesCount: number;
  interestedCollegesCount: number;
  scholarshipPoints: number;
  offers: OfferStats;
  collegeReadinessScore: number;
}

export interface CollegeInfo {
  _id: string;
  name: string;
  country: string;
  logo: string;
  coverImage: string;
}

export interface FollowedCollege {
  college: CollegeInfo;
  followedAt: string;
  _id: string;
}

export interface InterestedCollege {
  college: CollegeInfo;
  interestedAt: string;
  _id: string;
}

export interface AccountDeletionRequest {
  status: 'pending' | 'approved' | 'cancelled' | null;
  requestedAt: string | null;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture: string | null;
  country: string | null;
  gradeLevel: string | null;
  school: School;
  desiredCollegeCountries: string[];
  stats: ProfileStats;
  followedColleges: FollowedCollege[];
  interestedColleges: InterestedCollege[];
  accountDeletionRequest: AccountDeletionRequest | null;
  createdAt: string;
  lastLogin: string;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  country?: string | null;
  gradeLevel?: string | null;
  school?: School | null;
  desiredCollegeCountries?: string[] | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// API request helper
async function apiRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${config.apiUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
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

// Public API request (no auth needed)
async function publicApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${config.apiUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
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

export const studentApi = {
  // Get student profile with all details
  async getProfile(token: string): Promise<ApiResponse<StudentProfile>> {
    return apiRequest<StudentProfile>('/student/profile', token);
  },

  // Update student profile
  async updateProfile(
    token: string,
    data: ProfileUpdateData
  ): Promise<ApiResponse<ProfileUpdateData>> {
    return apiRequest<ProfileUpdateData>('/student/profile', token, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Upload profile picture
  async uploadProfilePicture(
    token: string,
    imageUri: string,
    fileName: string,
    mimeType: string
  ): Promise<ApiResponse<{ profilePicture: string }>> {
    const url = `${config.apiUrl}/student/profile-picture`;

    const formData = new FormData();
    formData.append('profilePicture', {
      uri: imageUri,
      name: fileName,
      type: mimeType,
    } as any);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData - let browser/RN set it with boundary
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Failed to upload profile picture',
        ...data,
      };
    }

    return data;
  },

  // Delete profile picture
  async deleteProfilePicture(
    token: string
  ): Promise<ApiResponse<null>> {
    return apiRequest<null>('/student/profile-picture', token, {
      method: 'DELETE',
    });
  },

  // Get countries list (public)
  async getCountries(): Promise<ApiResponse<string[]>> {
    return publicApiRequest<string[]>('/student/countries');
  },

  // Get grade levels list (public)
  async getGradeLevels(): Promise<ApiResponse<string[]>> {
    return publicApiRequest<string[]>('/student/grade-levels');
  },
};

export default studentApi;
