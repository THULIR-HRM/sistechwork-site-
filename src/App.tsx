import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import ThulirPage from "./pages/ThulirPage.tsx";
import TestOrbitPage from "./pages/TestOrbitPage.tsx";
import ReplyIQPage from "./pages/ReplyIQPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/thulir" element={<ThulirPage />} />
          <Route path="/thulirhrm" element={<ThulirPage />} />
          <Route path="/testorbit" element={<TestOrbitPage />} />
          <Route path="/replyiq" element={<ReplyIQPage />} />
          <Route path="/sistechwork" element={<Index />} />
          <Route path="/sistechwork/products.html" element={<ProductsPage />} />
          <Route path="/sistechwork/thulir.html" element={<ThulirPage />} />
          <Route path="/sistechwork/testorbit.html" element={<TestOrbitPage />} />
          <Route path="/sistechwork/replyiq.html" element={<ReplyIQPage />} />
          <Route path="/sistechwork/*" element={<Index />} />
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
