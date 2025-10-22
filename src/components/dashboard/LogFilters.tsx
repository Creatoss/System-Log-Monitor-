
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from 'lucide-react';
import { LogFilters } from '@/types/log';

interface LogFiltersProps {
  filters: LogFilters;
  onFiltersChange: (filters: LogFilters) => void;
  onClearFilters: () => void;
}

export const LogFiltersComponent = ({ filters, onFiltersChange, onClearFilters }: LogFiltersProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="w-5 h-5" />
          Log Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Input
            placeholder="Hostname"
            value={filters.hostname}
            onChange={(e) => onFiltersChange({ ...filters, hostname: e.target.value })}
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          />
          <Input
            placeholder="Program"
            value={filters.program}
            onChange={(e) => onFiltersChange({ ...filters, program: e.target.value })}
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          />
          <Select value={filters.severity} onValueChange={(value) => onFiltersChange({ ...filters, severity: value })}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={filters.date}
            onChange={(e) => onFiltersChange({ ...filters, date: e.target.value })}
            className="bg-slate-700/50 border-slate-600 text-white"
          />
          <Select value={filters.limit.toString()} onValueChange={(value) => onFiltersChange({ ...filters, limit: parseInt(value) })}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="25">25 logs</SelectItem>
              <SelectItem value="50">50 logs</SelectItem>
              <SelectItem value="100">100 logs</SelectItem>
              <SelectItem value="200">200 logs</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
