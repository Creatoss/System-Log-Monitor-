
import { useQuery } from '@tanstack/react-query';
import { StatsResponse } from '@/types/log';

const API_BASE_URL = 'http://192.168.30.129:5000/api';

export const useStats = (autoRefresh: boolean) => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async (): Promise<StatsResponse> => {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    refetchInterval: autoRefresh ? 10000 : false,
  });
};
