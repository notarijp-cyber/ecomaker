import { SmartRecommendations } from "@/components/dashboard/smart-recommendations";

export default function SmartRecommendationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <SmartRecommendations />
      </div>
    </div>
  );
}