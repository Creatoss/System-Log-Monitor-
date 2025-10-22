
import { useQuery } from '@tanstack/react-query';
import { LogResponse, LogFilters } from '@/types/log';

const API_BASE_URL = 'http://192.168.30.129:5000/api';

export const useLogs = (filters: LogFilters, autoRefresh: boolean) => {
  return useQuery({
    queryKey: ['logs', filters],
    queryFn: async (): Promise<LogResponse> => {
      const params = new URLSearchParams();
      if (filters.hostname) params.append('hostname', filters.hostname);
      if (filters.program) params.append('program', filters.program);
      if (filters.severity !== 'all') params.append('severity', filters.severity);
      if (filters.date) params.append('date', filters.date);
      params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE_URL}/logs?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    refetchInterval: autoRefresh ? 5000 : false,
  });
};
