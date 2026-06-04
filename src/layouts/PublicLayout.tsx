import { Outlet } from "react-router-dom";
import FloatingNav from "@/components/rdm/FloatingNav";
import FooterSection from "@/components/rdm/FooterSection";
import DedicationBand from "@/components/rdm/DedicationBand";

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <FloatingNav />
      <main>
        <Outlet />
      </main>
      <DedicationBand />
      <FooterSection />
    </div>
  );
}

