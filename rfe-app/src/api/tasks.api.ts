import config from '../config';

// Types
export interface TaskFile {
  url: string;
  type: 'image' | 'document';
  name: string;
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

// Tasks API functions
export const tasksApi = {
  // Get all active tasks with optional filters
  async getAll(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<TasksResponse> {
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
    return apiRequest<TasksResponse>(endpoint);
  },

  // Get single task by ID
  async getById(id: string): Promise<TaskResponse> {
    return apiRequest<TaskResponse>(`/student-tasks/${id}`);
  },

  // Get categories sorted by task count
  async getCategories(): Promise<CategoriesResponse> {
    return apiRequest<CategoriesResponse>('/student-tasks/categories');
  },
};

export default tasksApi;
