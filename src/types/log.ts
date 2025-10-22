
export interface LogEntry {
  hostname: string;
  message: string;
  program: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  timestamp: string;
}

export interface LogResponse {
  success: boolean;
  count: number;
  logs: LogEntry[];
}

export interface StatsResponse {
  success: boolean;
  stats: {
    total_logs: number;
    hosts: Record<string, number>;
    programs: Record<string, number>;
    severity: Record<string, number>;
  };
}

export interface LogFilters {
  hostname: string;
  program: string;
  severity: string;
  date: string;
  limit: number;
}
