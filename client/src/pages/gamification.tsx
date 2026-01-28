import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { GamificationSystem } from "@/components/dashboard/gamification-system";

export default function GamificationPage() {
  const userId = 1; // In a real app, this would come from auth context

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema di Gamificazione
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sblocca traguardi, completa sfide quotidiane e scala la classifica globale 
            mentre contribuisci a un futuro più sostenibile.
          </p>
        </div>

        {/* Main Gamification System */}
        <GamificationSystem userId={userId} />
      </div>
    </PageLayout>
  );
}