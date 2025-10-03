import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { collegesApi } from './colleges.api';

export const useGetColleges = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['colleges', 'list', params],
    queryFn: () => collegesApi.getColleges(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
    ...options,
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