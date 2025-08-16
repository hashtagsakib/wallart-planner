import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WallTypeSelection from "./pages/WallTypeSelection";
import PosterConfiguration from "./pages/PosterConfiguration";
import ColorSelection from "./pages/ColorSelection";
import Review from "./pages/Review";
import Canvas from "./pages/Canvas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/wall-type" element={<WallTypeSelection />} />
          <Route path="/poster-selection" element={<PosterConfiguration />} />
          <Route path="/color-selection" element={<ColorSelection />} />
          <Route path="/review" element={<Review />} />
          <Route path="/canvas" element={<Canvas />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
