import { useState } from "react";
import { Menu, GraduationCap } from "lucide-react";
import AppSidebar from "./AppSidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-background/90 backdrop-blur border-b border-border">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md gradient-accent flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-secondary" />
          </div>
          <span className="font-bold tracking-tight">StudyHub</span>
        </div>
        <div className="w-9" />
      </header>

      <main className="md:ml-[240px] min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
