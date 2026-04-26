import { Header } from "@/components/dashboard/header";
import { Sidebar, MobileNav } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <MobileNav />
        <main className="flex-1 bg-surface">{children}</main>
      </div>
    </div>
  );
}