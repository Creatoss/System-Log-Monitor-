
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertTriangle, Info, X } from 'lucide-react';
import { LogResponse } from '@/types/log';

interface LogDisplayProps {
  logsData: LogResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const LogDisplay = ({ logsData, isLoading, error }: LogDisplayProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'error': return 'bg-orange-500 text-white';
      case 'warning': return 'bg-yellow-500 text-black';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'error': return <X className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>System Logs</span>
          {logsData?.success && (
            <span className="text-sm font-normal text-slate-400">
              Showing {logsData.count} logs
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
            <span className="ml-2 text-slate-400">Loading logs...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">Failed to load logs</div>
            <div className="text-slate-400 text-sm">
              Please ensure the API server is running at http://192.168.30.129:5000/api
            </div>
          </div>
        )}

        {logsData?.success && (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {logsData.logs.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No logs found matching the current filters
              </div>
            ) : (
              logsData.logs.map((log, index) => (
                <div
                  key={index}
                  className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getSeverityIcon(log.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getSeverityColor(log.severity)} text-xs font-medium`}>
                          {log.severity.toUpperCase()}
                        </Badge>
                        <span className="text-slate-400 text-sm">{log.timestamp}</span>
                        <span className="text-blue-400 text-sm font-medium">{log.hostname}</span>
                        <span className="text-purple-400 text-sm">{log.program}</span>
                      </div>
                      <div className="text-white font-mono text-sm break-words">
                        {log.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
