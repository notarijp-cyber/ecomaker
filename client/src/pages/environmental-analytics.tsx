import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { EnvironmentalAnalytics } from "@/components/dashboard/environmental-analytics";
import { SmartNotifications } from "@/components/dashboard/smart-notifications";

export default function EnvironmentalAnalyticsPage() {
  const userId = 1; // In a real app, this would come from auth context

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analisi Ambientale Avanzata
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Monitora il tuo impatto ambientale, scopri tendenze e ricevi suggerimenti personalizzati 
            per migliorare la tua sostenibilità.
          </p>
        </div>

        {/* Main Analytics Section */}
        <EnvironmentalAnalytics userId={userId} />

        {/* Smart Notifications Section */}
        <div className="max-w-4xl mx-auto">
          <SmartNotifications userId={userId} />
        </div>
      </div>
    </PageLayout>
  );
}