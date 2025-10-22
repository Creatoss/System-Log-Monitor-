
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsResponse } from '@/types/log';

interface StatsCardsProps {
  statsData: StatsResponse | undefined;
}

export const StatsCards = ({ statsData }: StatsCardsProps) => {
  if (!statsData?.success) return null;

  return (
    <div className="grid grid-cols-1 gap-3">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Total Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{statsData.stats.total_logs.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Critical/Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">
            {((statsData.stats.severity.critical || 0) + (statsData.stats.severity.error || 0)).toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">{(statsData.stats.severity.warning || 0).toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Active Hosts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400">{Object.keys(statsData.stats.hosts).length}</div>
        </CardContent>
      </Card>
    </div>
  );
};
