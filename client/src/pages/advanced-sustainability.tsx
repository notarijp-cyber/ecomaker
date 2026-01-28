import { AdvancedSustainabilityTracker } from "@/components/dashboard/advanced-sustainability-tracker";

export default function AdvancedSustainabilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <AdvancedSustainabilityTracker />
      </div>
    </div>
  );
}