"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const loadingSteps = [
  "Analyzing your investigation...",
  "Identifying core data sources...",
  "Writing investigation overview...",
  "Determining P0 priorities...",
  "Planning source collection components...",
  "Designing eveidence collection architecture...",
  "Organizing investigation phases...",
  "Creating investigation plan...",
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full blueprint-card rounded-md mt-4">
      <CardContent className="pt-6 mt-4 pb-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-blue-300" />
          </div>
          <p className="text-lg font-medium animate-pulse blueprint-text">
            {loadingSteps[currentStep]}
          </p>
          <div className="w-full max-w-xs bg-blue-900/30 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-300/30 transition-all duration-500 ease-in-out"
              style={{
                width: `${((currentStep + 1) / loadingSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
