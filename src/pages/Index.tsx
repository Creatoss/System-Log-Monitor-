
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { LogFiltersComponent } from '@/components/dashboard/LogFilters';
import { LogDisplay } from '@/components/dashboard/LogDisplay';
import { useLogs } from '@/hooks/useLogs';
import { useStats } from '@/hooks/useStats';
import { LogFilters } from '@/types/log';

const Index = () => {
  const [filters, setFilters] = useState<LogFilters>({
    hostname: '',
    program: '',
    severity: 'all',
    date: '',
    limit: 50
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch logs and stats
  const { data: logsData, isLoading: logsLoading, refetch: refetchLogs, error: logsError } = useLogs(filters, autoRefresh);
  const { data: statsData, isLoading: statsLoading } = useStats(autoRefresh);

  const clearFilters = () => {
    setFilters({
      hostname: '',
      program: '',
      severity: 'all',
      date: '',
      limit: 50
    });
  };

  const handleManualRefresh = () => {
    refetchLogs();
    toast({
      title: "Refreshed",
      description: "Log data has been updated",
    });
  };

  useEffect(() => {
    if (logsError) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to the log server. Please check if the API is running.",
        variant: "destructive",
      });
    }
  }, [logsError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <DashboardHeader 
          isConnected={!logsError}
          isLoading={logsLoading}
          onRefresh={handleManualRefresh}
        />

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Filters and Logs */}
          <div className="xl:col-span-2 space-y-6">
            {/* Filters */}
            <LogFiltersComponent 
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />

            {/* Auto Refresh Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm text-slate-400">
                Auto-refresh every 5 seconds
              </label>
            </div>

            {/* Logs Display */}
            <LogDisplay 
              logsData={logsData}
              isLoading={logsLoading}
              error={logsError}
            />
          </div>

          {/* Right Column - Stats and Charts */}
          <div className="xl:col-span-1 space-y-6">
            {/* Stats Cards */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Statistics</h2>
              <StatsCards statsData={statsData} />
            </div>

            {/* Charts Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Analytics</h2>
              <ChartsSection statsData={statsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
