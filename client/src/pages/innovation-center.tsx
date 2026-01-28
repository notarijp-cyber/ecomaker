import { InnovationCenter } from "@/components/dashboard/innovation-center";

export default function InnovationCenterPage() {
  // Demo user ID - in real app, this would come from authentication
  const userId = 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <InnovationCenter userId={userId} />
      </div>
    </div>
  );
}