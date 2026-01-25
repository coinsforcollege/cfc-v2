import config from '../config';

// Types
export interface Folder {
  _id: string;
  user: string;
  name: string;
  parent: string | null;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  _id: string;
  user: string;
  folder: string | null;
  name: string;
  url: string;
  fileType: 'image' | 'document' | 'video';
  mimeType: string;
  size: number;
  source: 'upload' | 'offer' | 'task_submission';
  sourceReference?: string;
  sourceModel?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoldersResponse {
  success: boolean;
  data: Folder[];
}

export interface FolderResponse {
  success: boolean;
  data: Folder;
}

export interface DocumentsResponse {
  success: boolean;
  data: {
    folders: Folder[];
    documents: Document[];
    storage: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DocumentResponse {
  success: boolean;
  data: Document;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: Document[];
}

export interface StorageInfoResponse {
  success: boolean;
  data: {
    used: number;
    total: number;
    percentage: number;
    documentCount: number;
    folderCount: number;
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface MoveResponse {
  success: boolean;
  message: string;
  data: {
    movedCount: number;
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

// Documents API functions
export const documentsApi = {
  // Get all folders
  async getFolders(token: string): Promise<FoldersResponse> {
    return apiRequest<FoldersResponse>('/student-documents/folders', {}, token);
  },

  // Create a new folder
  async createFolder(
    token: string,
    data: { name: string; parentId?: string }
  ): Promise<FolderResponse> {
    return apiRequest<FolderResponse>(
      '/student-documents/folders',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  },

  // Rename a folder
  async renameFolder(
    token: string,
    folderId: string,
    name: string
  ): Promise<FolderResponse> {
    return apiRequest<FolderResponse>(
      `/student-documents/folders/${folderId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ name }),
      },
      token
    );
  },

  // Delete a folder
  async deleteFolder(token: string, folderId: string): Promise<DeleteResponse> {
    return apiRequest<DeleteResponse>(
      `/student-documents/folders/${folderId}`,
      {
        method: 'DELETE',
      },
      token
    );
  },

  // Get documents in a folder (or root)
  async getDocuments(
    token: string,
    params?: { folderId?: string; page?: number; limit?: number; all?: boolean }
  ): Promise<DocumentsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const endpoint = `/student-documents${query ? `?${query}` : ''}`;
    return apiRequest<DocumentsResponse>(endpoint, {}, token);
  },

  // Get single document
  async getDocument(token: string, documentId: string): Promise<DocumentResponse> {
    return apiRequest<DocumentResponse>(
      `/student-documents/${documentId}`,
      {},
      token
    );
  },

  // Upload documents
  async uploadDocuments(
    token: string,
    files: { uri: string; name: string; type: string }[],
    folderId?: string
  ): Promise<UploadResponse> {
    const formData = new FormData();

    if (folderId) {
      formData.append('folderId', folderId);
    }

    files.forEach((file) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });

    return apiFormRequest<UploadResponse>(
      '/student-documents/upload',
      formData,
      token
    );
  },

  // Update document (rename, move, toggle visibility)
  async updateDocument(
    token: string,
    documentId: string,
    data: { name?: string; folderId?: string | null; isPublic?: boolean }
  ): Promise<DocumentResponse> {
    return apiRequest<DocumentResponse>(
      `/student-documents/${documentId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      token
    );
  },

  // Delete document
  async deleteDocument(token: string, documentId: string): Promise<DeleteResponse> {
    return apiRequest<DeleteResponse>(
      `/student-documents/${documentId}`,
      {
        method: 'DELETE',
      },
      token
    );
  },

  // Bulk move documents
  async moveDocuments(
    token: string,
    documentIds: string[],
    targetFolderId: string | null
  ): Promise<MoveResponse> {
    return apiRequest<MoveResponse>(
      '/student-documents/move',
      {
        method: 'POST',
        body: JSON.stringify({ documentIds, targetFolderId }),
      },
      token
    );
  },

  // Get storage info
  async getStorageInfo(token: string): Promise<StorageInfoResponse> {
    return apiRequest<StorageInfoResponse>(
      '/student-documents/storage',
      {},
      token
    );
  },
};

export default documentsApi;
