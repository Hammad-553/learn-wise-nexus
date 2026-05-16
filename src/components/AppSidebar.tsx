import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  FolderOpen,
  BarChart3,
  Calculator,
  MessageSquare,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FolderLock,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/todos", icon: CheckSquare, label: "Todo List" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
  { to: "/assignments", icon: FolderOpen, label: "Assignments" },
  { to: "/files", icon: FolderLock, label: "My Files" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/gpa-calculator", icon: Calculator, label: "GPA Calculator" },
  { to: "/grading", icon: GraduationCap, label: "Grading Table" },
  { to: "/self-learning", icon: BookOpen, label: "Self Learning" },
  { to: "/ai-chat", icon: MessageSquare, label: "AI Assistant" },
];

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const AppSidebar = ({ mobileOpen = false, onMobileClose }: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setFullName(data?.full_name || ""));
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-transform duration-300
          ${collapsed ? "md:w-[72px]" : "md:w-[240px]"}
          w-[260px]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ background: "var(--gradient-primary)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-secondary" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
              AcademiX
            </span>
          )}
          <button
            onClick={onMobileClose}
            aria-label="Close menu"
            className="md:hidden ml-auto p-1.5 rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-sidebar-primary" : ""}`} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary animate-pulse-glow" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User info + sign out */}
        {user && (
          <div className="border-t border-sidebar-border px-2 py-3 space-y-2">
            {!collapsed && (
              <div className="px-2">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {fullName || "Student"}
                </p>
                <p className="text-[11px] text-sidebar-foreground/60 truncate">{user.email}</p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Sign out</span>}
            </button>
          </div>
        )}

        {/* Collapse button - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:block mx-2 mb-4 p-2 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </aside>
    </>
  );
};

export default AppSidebar;
