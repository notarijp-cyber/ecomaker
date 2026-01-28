import { PerformanceMonitor } from "@/components/dashboard/performance-monitor";

export default function PerformanceMonitorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <PerformanceMonitor />
      </div>
    </div>
  );
}