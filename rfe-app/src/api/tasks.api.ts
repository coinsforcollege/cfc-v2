import config from '../config';

// Types
export interface TaskFile {
  url: string;
  type: 'image' | 'document' | 'video';
  name: string;
  size?: number;
}

export interface RejectionHistory {
  _id: string;
  rejectedAt: string;
  rejectedBy: string;
  feedback: string;
}

export interface TaskSubmission {
  _id: string;
  user: string;
  task: Task;
  files: TaskFile[];
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  adminFeedback?: string;
  pointsAwarded: number;
  rejectionHistory: RejectionHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskCategory {
  _id: string;
  name: string;
  scholarshipPoints: number;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  categories: TaskCategory[];
  topic?: string[];
  grade: string[];
  difficulty: number;
  activity: 'MCQ Quiz' | 'Learn' | 'Submission' | 'Script';
  scholarshipPoints: number;
  requiresApproval: boolean;
  ctaLink?: string;
  ctaLabel?: string;
  files: TaskFile[];
  thumbnail?: string;
  status: 'Active' | 'Archived' | 'Draft';
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithCount {
  _id: string;
  name: string;
  scholarshipPoints?: number;
  taskCount: number;
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
  };
}

export interface CategoriesResponse {
  success: boolean;
  data: CategoryWithCount[];
}

export interface TaskResponse {
  success: boolean;
  data: Task;
}

export interface TaskWithSubmissionResponse {
  success: boolean;
  data: Task & { userSubmission?: TaskSubmission };
}

export interface SubmissionsResponse {
  success: boolean;
  data: TaskSubmission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SubmitTaskResponse {
  success: boolean;
  message: string;
  data: TaskSubmission;
}

// API helper function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

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

// Multipart form API helper (for file uploads)
async function apiFormRequest<T>(
  endpoint: string,
  formData: FormData,
  token: string
): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
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

// Tasks API functions
export const tasksApi = {
  // Get all active tasks with optional filters
  // If token is provided, excludes tasks user has already completed/submitted
  async getAll(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }, token?: string): Promise<TasksResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const endpoint = `/student-tasks${query ? `?${query}` : ''}`;
    return apiRequest<TasksResponse>(endpoint, {}, token);
  },

  // Get single task by ID
  async getById(id: string): Promise<TaskResponse> {
    return apiRequest<TaskResponse>(`/student-tasks/${id}`);
  },

  // Get categories sorted by task count
  async getCategories(): Promise<CategoriesResponse> {
    return apiRequest<CategoriesResponse>('/student-tasks/categories');
  },

  // Get task with user's submission status (requires auth)
  async getTaskWithStatus(id: string, token: string): Promise<TaskWithSubmissionResponse> {
    return apiRequest<TaskWithSubmissionResponse>(`/student-tasks/${id}/status`, {}, token);
  },

  // Submit a task (requires auth)
  async submitTask(
    taskId: string,
    token: string,
    data: { comment?: string; files?: { uri: string; name: string; type: string }[] }
  ): Promise<SubmitTaskResponse> {
    // If there are files, use FormData (multipart)
    if (data.files && data.files.length > 0) {
      const formData = new FormData();

      if (data.comment) {
        formData.append('comment', data.comment);
      }

      data.files.forEach((file) => {
        formData.append('files', {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as any);
      });

      return apiFormRequest<SubmitTaskResponse>(`/student-tasks/${taskId}/submit`, formData, token);
    }

    // No files - use regular JSON request
    return apiRequest<SubmitTaskResponse>(
      `/student-tasks/${taskId}/submit`,
      {
        method: 'POST',
        body: JSON.stringify({ comment: data.comment || '' }),
      },
      token
    );
  },

  // Get user's pending submissions (requires auth)
  async getMySubmissions(token: string, params?: { page?: number; limit?: number }): Promise<SubmissionsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest<SubmissionsResponse>(`/student-tasks/my-submissions${query ? `?${query}` : ''}`, {}, token);
  },

  // Get user's completed tasks (requires auth)
  async getMyCompleted(token: string, params?: { page?: number; limit?: number }): Promise<SubmissionsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest<SubmissionsResponse>(`/student-tasks/my-completed${query ? `?${query}` : ''}`, {}, token);
  },
};

export default tasksApi;
