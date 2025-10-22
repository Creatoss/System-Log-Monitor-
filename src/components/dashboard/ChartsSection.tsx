
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart as RechartsPieChart, Cell, Pie, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart } from 'lucide-react';
import { StatsResponse } from '@/types/log';

interface ChartsSectionProps {
  statsData: StatsResponse | undefined;
}

export const ChartsSection = ({ statsData }: ChartsSectionProps) => {
  if (!statsData?.success) return null;

  const severityChartData = [
    { name: 'Critical', value: statsData.stats.severity.critical || 0, color: '#ef4444' },
    { name: 'Error', value: statsData.stats.severity.error || 0, color: '#f97316' },
    { name: 'Warning', value: statsData.stats.severity.warning || 0, color: '#eab308' },
    { name: 'Info', value: statsData.stats.severity.info || 0, color: '#3b82f6' }
  ];

  const topHostsData = Object.entries(statsData.stats.hosts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const topProgramsData = Object.entries(statsData.stats.programs)
    .filter(([name]) => name.trim() !== '')
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name: name.length > 10 ? name.substring(0, 10) + '...' : name, count }));

  return (
    <div className="space-y-4">
      {/* Severity Distribution Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <PieChart className="w-4 h-4" />
            Log Severity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              critical: { label: "Critical", color: "#ef4444" },
              error: { label: "Error", color: "#f97316" },
              warning: { label: "Warning", color: "#eab308" },
              info: { label: "Info", color: "#3b82f6" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={severityChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                >
                  {severityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="grid grid-cols-1 gap-1 mt-2">
            {severityChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-slate-300">
                  {item.name}: {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Hosts Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            Top Hosts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: "Log Count", color: "#3b82f6" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topHostsData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Programs Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            Top Programs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: "Log Count", color: "#8b5cf6" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProgramsData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 9 }}
                  axisLine={{ stroke: '#475569' }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
