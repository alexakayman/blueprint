"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import IdeaBreakdown from "@/components/IdeaBreakdown";
import QueryHistory from "@/components/QueryHistory";
import PromptCarousel from "@/components/PromptCarousel";
import LoadingScreen from "@/components/LoadingScreen";

interface Component {
  name: string;
  description: string;
  requirements: string[];
}

interface Service {
  name: string;
  description: string;
  requirements: string[];
}

interface PriorityLevel {
  frontend: {
    components: Component[];
  };
  backend: {
    services: Service[];
    dataModel: string[];
  };
}

interface DevelopmentPhase {
  phase: string;
  tasks: string[];
  priority: string;
}

interface Breakdown {
  overview: string;
  priorities: {
    p0: PriorityLevel;
    p1: PriorityLevel;
    p2: PriorityLevel;
  };
  developmentSteps: DevelopmentPhase[];
}

interface QueryState {
  idea: string;
  depth: number;
  focusArea: string | null;
  breakdown: Breakdown | null;
}

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState<QueryState>({
    idea: "",
    depth: 1,
    focusArea: null,
    breakdown: null,
  });
  const [queryHistory, setQueryHistory] = useState<QueryState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentQuery),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process the objective");
      }

      if (!data || typeof data !== "object" || !data.overview) {
        throw new Error("Invalid response from server");
      }

      const newQueryState = {
        ...currentQuery,
        breakdown: data,
      };
      setCurrentQuery(newQueryState);
      setQueryHistory((prev) => [...prev, newQueryState]);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToQuery = (index: number) => {
    setCurrentQuery(queryHistory[index]);
  };

  const handlePromptSelect = async (prompt: string) => {
    const newQuery = {
      idea: prompt,
      depth: 1,
      focusArea: null,
      breakdown: null,
    };

    setCurrentQuery(newQuery);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuery),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process the idea");
      }

      if (!data || typeof data !== "object" || !data.overview) {
        throw new Error("Invalid response from server");
      }

      const newQueryState = {
        ...newQuery,
        breakdown: data,
      };
      setCurrentQuery(newQueryState);
      setQueryHistory((prev) => [...prev, newQueryState]);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <Card className="p-12 blueprint-card">
            <h1 className="text-3xl font-bold mb-4 blueprint-title">
              OSINT Investigation Guide
            </h1>
            <p className="blueprint-text mb-8">
              Open source intelligence gives people the power to investigate
              their world. Getting started can be the hardest part. Use this to
              generate a step by step priority list for every aspiring
              investigator's needs with a relevant tool to help you.
            </p>
            <p className="blueprint-text mb-8">
              Eg. Investigating Corporations Profiting Off of Pacific Oil
              Spills.
            </p>

            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-grow">
                  <Input
                    type="text"
                    value={currentQuery.idea}
                    onChange={(e) =>
                      setCurrentQuery((prev) => ({
                        ...prev,
                        idea: e.target.value,
                      }))
                    }
                    placeholder="I want to build..."
                    disabled={isLoading}
                    className="w-full blueprint-input border border-2"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !currentQuery.idea.trim()}
                  className="blueprint-button-primary font-bold"
                >
                  Begin Investigation
                </Button>
              </form>
              {!currentQuery.breakdown && !isLoading && (
                <PromptCarousel onPromptSelect={handlePromptSelect} />
              )}
            </div>

            {isLoading && <LoadingScreen />}

            {error && (
              <Alert
                variant="destructive"
                className="mt-4 border border-2 border-blue-200 bg-blue-50/50 text-blue-900"
              >
                <AlertDescription className="font-medium">
                  ⚠️ {error}
                </AlertDescription>
              </Alert>
            )}

            {currentQuery.breakdown && (
              <div className="mt-8">
                <QueryHistory
                  history={queryHistory.map((q) => ({
                    idea: q.idea,
                    focusArea: q.focusArea,
                  }))}
                  currentIndex={queryHistory.length - 1}
                  onSelect={handleNavigateToQuery}
                />
                <IdeaBreakdown breakdown={currentQuery.breakdown} />
              </div>
            )}
            <style jsx>{`
              :global(.blueprint-button-primary) {
                background-color: white !important;
                color: #1e3a8a !important;
                border: 1px solid #93c5fd !important;
              }
              :global(.blueprint-button-primary:hover) {
                background-color: #f0f9ff !important;
              }
            `}</style>
          </Card>
        </div>
      </div>

      <footer className="w-full py-4 mt-auto">
        <p className="text-center text-xs blueprint-text opacity-50">
          2025, Alexa Kayman forked from Floguo •{" "}
          <a
            href="https://x.com/alexakayman"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            Twitter
          </a>{" "}
          •{" "}
          <a
            href="https://github.com/alexakayman"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
