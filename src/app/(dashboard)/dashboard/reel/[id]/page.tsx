"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";

type ReelVariant = {
  id: string;
  name: string;
  type: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  file_size: number;
  status: "processing" | "ready" | "failed";
};

const generationSteps = [
  { id: 1, name: "Analyzing photos", status: "complete" as const },
  { id: 2, name: "Generating scripts", status: "processing" as const },
  { id: 3, name: "Creating motion", status: "pending" as const },
  { id: 4, name: "Adding voiceover", status: "pending" as const },
  { id: 5, name: "Rendering", status: "pending" as const },
];

function ProgressScreen({ reelId }: { reelId: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < 5) {
        setProgress((prev) => {
          if (prev >= (currentStep / 5) * 100) {
            setCurrentStep((s) => s + 1);
            return prev;
          }
          return prev + 2;
        });
      } else {
        clearInterval(interval);
        router.push(`/dashboard/reel/${reelId}`);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [currentStep, reelId, router]);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-6xl mb-8">🎬</div>
        <h1 className="text-2xl font-bold font-heading mb-2">
          Generating Your Reels
        </h1>
        <p className="text-muted-foreground mb-8">
          This usually takes under 2 minutes
        </p>

        <Progress value={progress} className="mb-8 h-2" />

        <div className="space-y-3">
          {generationSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 border rounded-sm ${
                index + 1 < currentStep
                  ? "border-primary bg-primary/5"
                  : index + 1 === currentStep
                  ? "border-primary"
                  : "border-border"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  index + 1 < currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {index + 1 < currentStep ? "✓" : step.id}
              </div>
              <div className="flex-1 text-left text-sm">{step.name}</div>
              <div className="text-xs text-muted-foreground">
                {index + 1 < currentStep
                  ? "Done"
                  : index + 1 === currentStep
                  ? "In progress..."
                  : ""}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="mt-8"
          onClick={() => router.push(`/dashboard/reel/${reelId}`)}
        >
          Skip — View Results
        </Button>
      </div>
    </div>
  );
}

function ResultsScreen({ reelId }: { reelId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [variants, setVariants] = useState<ReelVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function loadVariants() {
      const { data } = await supabase
        .from("reel_variants")
        .select("*")
        .eq("reel_id", reelId);
      if (isMounted && data) {
        setVariants(data);
        setLoading(false);
      }
    }
    
    loadVariants();
    
    return () => {
      isMounted = false;
    };
  }, [supabase, reelId]);

  const handleDownload = async (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const handleDownloadAll = async () => {
    for (const variant of variants.filter((v) => v.status === "ready")) {
      if (variant.video_url) {
        handleDownload(variant.video_url, `${variant.name}.mp4`);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center py-12 text-muted-foreground">
          Loading results...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold font-heading">Your Reels Are Ready!</h1>
            <p className="text-muted-foreground">
              4 cinematic reels generated in under 2 minutes
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownloadAll}>
              Download All
            </Button>
            <Button onClick={() => router.push("/dashboard/new")}>
              + Create Another
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {variants.map((variant) => (
            <Card key={variant.id} className="border border-border">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted relative">
                  {variant.thumbnail_url ? (
                    <Image
                      src={variant.thumbnail_url}
                      alt={variant.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🎬
                    </div>
                  )}
                  {variant.status === "ready" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        onClick={() =>
                          variant.video_url &&
                          window.open(variant.video_url, "_blank")
                        }
                      >
                        Play
                      </Button>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDuration(variant.duration)} •{" "}
                        {formatFileSize(variant.file_size)}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        variant.status === "ready"
                          ? "bg-green-600 text-white"
                          : variant.status === "processing"
                          ? "bg-yellow-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {variant.status}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={variant.status !== "ready"}
                      onClick={() =>
                        variant.video_url &&
                        handleDownload(variant.video_url, `${variant.name}.mp4`)
                      }
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={variant.status !== "ready"}
                    >
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      Regenerate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReelDetailPage() {
  const params = useParams();
  const reelId = params.id as string;
  const supabase = createClient();
  const [status, setStatus] = useState<"processing" | "ready">("processing");

  useEffect(() => {
    const checkStatus = async () => {
      const { data } = await supabase
        .from("reels")
        .select("status")
        .eq("id", reelId)
        .single();
      if (data?.status === "ready") {
        setStatus("ready");
      }
    };

    if (status === "processing") {
      checkStatus();
      const interval = setInterval(checkStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [supabase, reelId, status]);

  return status === "processing" ? (
    <ProgressScreen reelId={reelId} />
  ) : (
    <ResultsScreen reelId={reelId} />
  );
}