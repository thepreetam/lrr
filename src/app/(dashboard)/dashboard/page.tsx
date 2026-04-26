"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface Reel {
  id: string;
  property_name: string;
  status: "processing" | "ready" | "failed";
  thumbnail_url: string;
  created_at: string;
}

interface Stats {
  videosThisMonth: number;
  listingsCompleted: number;
}

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reels, setReels] = useState<Reel[]>([]);
  const [stats, setStats] = useState<Stats>({ videosThisMonth: 0, listingsCompleted: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: reelsData } = await supabase
        .from("reels")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);

      if (reelsData) {
        setReels(reelsData);
        setStats({
          videosThisMonth: reelsData.filter(
            (r) => new Date(r.created_at).getMonth() === new Date().getMonth()
          ).length,
          listingsCompleted: reelsData.filter((r) => r.status === "ready").length,
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold font-heading">Dashboard</h1>
            <p className="text-muted-foreground">Create and manage your listing reels</p>
          </div>
          <Link href="/dashboard/new">
            <Button className="w-full md:w-auto h-12 px-8 font-sans">
              + Create New Reel
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold font-heading">
                {stats.videosThisMonth}
              </div>
              <div className="text-sm text-muted-foreground">
                Videos this month
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold font-heading">
                {stats.listingsCompleted}
              </div>
              <div className="text-sm text-muted-foreground">
                Listings completed
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold font-heading">$39</div>
              <div className="text-sm text-muted-foreground">Per listing pack</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium font-heading">Recent Reels</h2>
            <Link
              href="/dashboard/history"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : reels.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="py-16 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">🎬</div>
                  <div className="text-lg font-medium">No reels yet</div>
                  <div className="text-sm text-muted-foreground">
                    Create your first cinematic listing reel
                  </div>
                  <Link href="/dashboard/new">
                    <Button className="mt-4">Create New Reel</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reels.map((reel) => (
                <Link key={reel.id} href={`/dashboard/reel/${reel.id}`}>
                  <Card className="border border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-muted relative">
                        {reel.thumbnail_url ? (
                          <img
                            src={reel.thumbnail_url}
                            alt={reel.property_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            🎬
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${
                              reel.status === "ready"
                                ? "bg-green-600 text-white"
                                : reel.status === "processing"
                                ? "bg-yellow-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {reel.status === "ready"
                              ? "Ready"
                              : reel.status === "processing"
                              ? "Processing"
                              : "Failed"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="font-medium truncate">
                          {reel.property_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(reel.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}export const dynamic = "force-dynamic";
