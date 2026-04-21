import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Todos from "@/pages/Todos";
import CalendarPage from "@/pages/CalendarPage";
import Assignments from "@/pages/Assignments";
import Files from "@/pages/Files";
import Analytics from "@/pages/Analytics";
import GpaCalculator from "@/pages/GpaCalculator";
import Grading from "@/pages/Grading";
import SelfLearning from "@/pages/SelfLearning";
import AiChat from "@/pages/AiChat";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/files" element={<Files />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/gpa-calculator" element={<GpaCalculator />} />
            <Route path="/grading" element={<Grading />} />
            <Route path="/self-learning" element={<SelfLearning />} />
            <Route path="/ai-chat" element={<AiChat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
