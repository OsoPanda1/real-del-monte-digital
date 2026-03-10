import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/rdm/AppSidebar";

export function RdmLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="ml-60 flex-1 overflow-auto relative">
        {/* Ambient glow */}
        <div className="pointer-events-none fixed top-0 left-60 right-0 h-[500px] opacity-40" style={{ background: 'var(--gradient-hero)' }} />
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
