"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles,
  FileText,
  Mic,
  Video,
  Layers,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Home
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type GenerationStatus = {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  currentStep: string;
  progress: number;
  steps: {
    script: "pending" | "processing" | "completed" | "failed";
    voiceover: "pending" | "processing" | "completed" | "failed";
    video: "pending" | "processing" | "completed" | "failed";
    combining: "pending" | "processing" | "completed" | "failed";
  };
  videos?: { url: string; variant: number }[];
  error?: string;
};

const steps = [
  { id: "script", label: "Generating Script", icon: FileText, description: "Creating compelling narration" },
  { id: "voiceover", label: "Creating Voiceover", icon: Mic, description: "Synthesizing voice audio" },
  { id: "video", label: "Generating Video", icon: Video, description: "AI cinematic rendering" },
  { id: "combining", label: "Combining Elements", icon: Layers, description: "Merging video, audio & captions" },
];

export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const generationId = searchParams.get("id");
  
  const [generation, setGeneration] = useState<GenerationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!generationId) {
      router.push("/dashboard/new");
      return;
    }

    const fetchGeneration = async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .eq("id", generationId)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.status === "completed") {
        router.push(`/dashboard/results?id=${generationId}`);
        return;
      }

      if (data.status === "failed") {
        setError(data.error || "Generation failed");
        setLoading(false);
        return;
      }

      setGeneration(data);
      setLoading(false);
    };

    fetchGeneration();

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("generations")
        .select("*")
        .eq("id", generationId)
        .single();

      if (data?.status === "completed") {
        router.push(`/dashboard/results?id=${generationId}`);
      } else if (data?.status === "failed") {
        setError(data.error || "Generation failed");
        setLoading(false);
      } else if (data) {
        setGeneration(data);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [generationId, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Generation Failed</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push("/dashboard/new")}>
                Try Again
              </Button>
              <Button onClick={() => router.push("/dashboard")}>
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === generation?.currentStep);
  const overallProgress = generation?.progress || Math.round((currentStepIndex / steps.length) * 100);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Creating Your Reels</h1>
          <p className="text-muted-foreground">
            Generating 4 cinematic variations for your listing
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Overall Progress</p>
                <Progress value={overallProgress} className="mt-2" />
              </div>
              <span className="text-2xl font-bold">{overallProgress}%</span>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const stepStatus = generation?.steps?.[step.id as keyof typeof generation.steps] || "pending";
                const isActive = index === currentStepIndex;
                const isCompleted = stepStatus === "completed";
                const isProcessing = stepStatus === "processing";

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      isActive ? "border-primary bg-primary/5" : 
                      isCompleted ? "border-green-500 bg-green-500/5" :
                      "border-border"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-green-500/20" :
                      isProcessing ? "bg-primary/20" :
                      "bg-muted"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : isProcessing ? (
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      ) : (
                        <step.icon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isActive ? "text-primary" : ""}`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {isCompleted && <span className="text-green-500 text-sm">Done</span>}
                    {isProcessing && <span className="text-primary text-sm">In progress...</span>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          This typically takes 1-2 minutes. Please don&apos;t close this page.
        </p>
      </div>
    </div>
  );
}