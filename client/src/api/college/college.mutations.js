import { useMutation, useQueryClient } from "@tanstack/react-query"
import { collegesApi } from "./colleges.api"

export const useAddCollege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collegesApi.addCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] })
    },
    onError: (error) => {
      console.error('Add college failed:', error);
    },
  })
}