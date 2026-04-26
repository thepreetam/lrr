"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface Reel {
  id: string;
  property_name: string;
  property_address: string;
  status: "processing" | "ready" | "failed";
  thumbnail_url: string;
  created_at: string;
}

export default function HistoryPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reels, setReels] = useState<Reel[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ready" | "processing" | "failed">("all");

  useEffect(() => {
    let isMounted = true;
    
    async function loadReels() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (isMounted) router.replace("/login");
        return;
      }

      const query = supabase
        .from("reels")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const { data } = await query;
      if (isMounted && data) {
        setReels(data);
        setLoading(false);
      }
    }
    
    loadReels();
    
    return () => {
      isMounted = false;
    };
  }, [supabase, router]);

  const filteredReels = reels.filter((reel) => {
    const matchesSearch =
      search === "" ||
      reel.property_name.toLowerCase().includes(search.toLowerCase()) ||
      reel.property_address?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || reel.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold font-heading">History</h1>
            <p className="text-muted-foreground">
              All your generated listing reels
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button>+ Create New Reel</Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by property name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-64"
          />
          <div className="flex gap-2">
            {(["all", "ready", "processing", "failed"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading...
          </div>
        ) : filteredReels.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="py-16 text-center">
              <div className="space-y-4">
                <div className="text-4xl">🎬</div>
                <div className="text-lg font-medium">No reels found</div>
                <div className="text-sm text-muted-foreground">
                  {search || filter !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first reel to get started"}
                </div>
                <Link href="/dashboard/new">
                  <Button className="mt-4">Create New Reel</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredReels.map((reel) => (
              <Link key={reel.id} href={`/dashboard/reel/${reel.id}`}>
                <Card className="border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-20 h-14 bg-muted rounded-sm overflow-hidden flex-shrink-0 relative">
                      {reel.thumbnail_url ? (
                        <Image
                          src={reel.thumbnail_url}
                          alt={reel.property_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🎬
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {reel.property_name || "Untitled"}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {reel.property_address || "No address"}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          reel.status === "ready"
                            ? "bg-green-600 text-white"
                            : reel.status === "processing"
                            ? "bg-yellow-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {reel.status}
                      </span>
                      <div className="text-xs text-muted-foreground mt-1">
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
  );
}