import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/rdm/AppSidebar";

export function RdmLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="ml-60 flex-1 overflow-auto relative">
        {/* Ambient glow */}
        <div className="pointer-events-none fixed top-0 left-60 right-0 h-[600px] opacity-30" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(43 80% 55% / 0.06), transparent 70%)' }} />
        <div className="relative z-10 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
