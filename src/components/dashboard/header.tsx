"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const supabase = createClient();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-lg font-bold font-heading tracking-tight md:hidden">
          LRR
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
          Upgrade
        </Link>
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
          S
        </div>
      </div>
    </header>
  );
}