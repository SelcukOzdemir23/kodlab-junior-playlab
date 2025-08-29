import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import YazilimOyunu from "./pages/YazilimOyunu";
import MatematikOyunu from "./pages/MatematikOyunu";
import IngilizceOyunu from "./pages/IngilizceOyunu";
import TasarimOyunu from "./pages/TasarimOyunu";
import OdakAvcisi from "./pages/OdakAvcisi";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/yazilim" element={<YazilimOyunu />} />
          <Route path="/matematik" element={<MatematikOyunu />} />
          <Route path="/ingilizce" element={<IngilizceOyunu />} />
          <Route path="/tasarim" element={<TasarimOyunu />} />
          <Route path="/odak-avcisi" element={<OdakAvcisi />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
