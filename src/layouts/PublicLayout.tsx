import { Outlet, useLocation } from "react-router-dom";
import FloatingNav from "@/components/rdm/FloatingNav";
import FooterSection from "@/components/rdm/FooterSection";

const sidebarRoutes = ["/dashboard", "/game", "/b2b", "/realito"];

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <FloatingNav />
      <main>
        <Outlet />
      </main>
      <FooterSection />
    </div>
  );
}
