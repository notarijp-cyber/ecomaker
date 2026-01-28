import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function KickstarterDownloadFAB() {
  return (
    <Link href="/kickstarter-downloads">
      <Button 
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl
                   bg-gradient-to-r from-green-500 to-emerald-600 
                   hover:from-green-600 hover:to-emerald-700
                   border-2 border-green-400/50 hover:border-green-300
                   transition-all duration-300 hover:scale-110 hover:shadow-green-500/25
                   glass-morph"
        size="icon"
        title="Scarica Files Kickstarter"
      >
        <Download className="w-6 h-6 text-white" />
      </Button>
    </Link>
  );
}