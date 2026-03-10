import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/rdm/AppSidebar";

export function RdmLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="ml-56 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
