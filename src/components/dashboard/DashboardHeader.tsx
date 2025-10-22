import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  isConnected: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export const DashboardHeader = ({
  isConnected,
  isLoading,
  onRefresh,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          System Log Monitor
        </h1>
        <p className="text-slate-400 mt-2">
          Real-time monitoring dashboard for Linux system logs
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            } animate-pulse`}
          ></div>
          <span className="text-sm text-slate-400">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
    </div>
  );
};
