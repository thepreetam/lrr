"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play,
  Download,
  Share2,
  ArrowLeft,
  Home,
  Check,
  Loader2,
  FileVideo,
  ExternalLink
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type VideoVariant = {
  variant: number;
  url: string;
  name: string;
};

type Generation = {
  id: string;
  property_name: string;
  address: string;
  status: string;
  videos: VideoVariant[];
  created_at: string;
};

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const generationId = searchParams.get("id");
  
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!generationId) {
      router.push("/dashboard");
      return;
    }

    const fetchGeneration = async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .eq("id", generationId)
        .single();

      if (error) {
        console.error("Error fetching generation:", error);
        setLoading(false);
        return;
      }

      setGeneration(data);
      setLoading(false);
    };

    fetchGeneration();
  }, [generationId, router, supabase]);

  const handleDownload = async (video: VideoVariant) => {
    setDownloading(video.variant);
    try {
      const response = await fetch(video.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${generation?.property_name || "reel"}-variant-${video.variant}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
    }
    setDownloading(null);
  };

  const handleDownloadAll = async () => {
    if (!generation?.videos) return;
    
    for (const video of generation.videos) {
      await handleDownload(video);
    }
  };

  const handleShare = async (video: VideoVariant) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${generation?.property_name} - Reel ${video.variant}`,
          url: video.url,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(video.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!generation) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Generation not found</p>
            <Button onClick={() => router.push("/dashboard")}>
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const videoCount = generation.videos?.length || 0;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="ghost" 
              className="mb-2"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">{generation.property_name}</h1>
            {generation.address && (
              <p className="text-muted-foreground">{generation.address}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownloadAll}>
              <Download className="w-4 h-4 mr-2" />
              Download All ({videoCount})
            </Button>
            <Button onClick={() => router.push("/dashboard/new")}>
              Create Another
            </Button>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <FileVideo className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800 dark:text-green-200">
              Your {videoCount} reels are ready!
            </p>
            <p className="text-sm text-green-600 dark:text-green-300">
              Videos are available for download and sharing
            </p>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {generation.videos?.map((video, index) => (
            <Card key={video.variant} className="overflow-hidden">
              <div className="aspect-[9/16] bg-black relative">
                <video
                  src={video.url}
                  className="w-full h-full object-cover"
                  controls={playingVideo === video.variant}
                  onPlay={() => setPlayingVideo(video.variant)}
                  onPause={() => setPlayingVideo(null)}
                  onEnded={() => setPlayingVideo(null)}
                  poster=""
                />
                {!playingVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                      onClick={() => {
                        const vid = document.querySelectorAll("video")[index] as HTMLVideoElement;
                        vid?.play();
                      }}
                    >
                      <Play className="w-8 h-8 text-black ml-1" />
                    </button>
                  </div>
                )}
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 rounded-full text-white text-sm">
                  Variant {video.variant}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownload(video)}
                    disabled={downloading === video.variant}
                  >
                    {downloading === video.variant ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare(video)}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </Button>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Tips for sharing your reels</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Upload directly to Instagram Reels, TikTok, or YouTube Shorts</li>
            <li>• Add the video to your MLS listing</li>
            <li>• Embed in property websites and email campaigns</li>
            <li>• Use in your listing presentations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}