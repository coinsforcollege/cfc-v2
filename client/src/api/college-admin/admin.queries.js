import { useQuery } from '@tanstack/react-query';
import { authApi } from '../auth/auth.api';
import { collegesApi } from '../college/colleges.api';

// Authentication queries (same as student)
export const useGetMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// College-related queries for admin registration and management
export const useSearchColleges = (searchQuery, options = {}) => {
  return useQuery({
    queryKey: ['colleges', 'search', searchQuery],
    queryFn: () => collegesApi.searchColleges({ q: searchQuery }),
    enabled: !!searchQuery && searchQuery.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useGetColleges = (params = {}) => {
  return useQuery({
    queryKey: ['colleges', 'list', params],
    queryFn: () => collegesApi.getColleges(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetCollegeById = (collegeId, options = {}) => {
  return useQuery({
    queryKey: ['colleges', 'detail', collegeId],
    queryFn: () => collegesApi.getCollegeById(collegeId),
    enabled: !!collegeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useGetCollegeStats = (collegeId, options = {}) => {
  return useQuery({
    queryKey: ['colleges', 'stats', collegeId],
    queryFn: () => collegesApi.getCollegeStats(collegeId),
    enabled: !!collegeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useGetCollegeStudents = (collegeId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ['colleges', 'students', collegeId, params],
    queryFn: () => collegesApi.getCollegeStudents(collegeId, params),
    enabled: !!collegeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useGetTopColleges = (params = {}) => {
  return useQuery({
    queryKey: ['colleges', 'top', params],
    queryFn: () => collegesApi.getTopColleges(params),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

