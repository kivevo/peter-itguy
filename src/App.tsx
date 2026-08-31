import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { WhatsAppProvider } from "@/context/WhatsAppContext";
import ScrollToTop from "@/components/ScrollToTop";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ErrorBoundary from "@/components/ErrorBoundary";
import React, { Suspense } from "react";

import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import AboutPage from "./pages/AboutPage";
import ProcessPage from "./pages/ProcessPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import TrackJobPage from "./pages/TrackJobPage";
import VerifyInvoicePage from "./pages/VerifyInvoicePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Full-page spinner shown while any lazy section chunk is loading
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-10 h-10 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WhatsAppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AnalyticsTracker />
              {/* Suspense catches any lazy chunk loads across all pages */}
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/case-studies" element={<CaseStudiesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/process" element={<ProcessPage />} />
                  <Route path="/resources" element={<BlogPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/track" element={<TrackJobPage />} />
                  <Route path="/status" element={<TrackJobPage />} />
                  <Route path="/verify" element={<VerifyInvoicePage />} />
                  <Route path="/verify-invoice" element={<VerifyInvoicePage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  {/* Catch-all 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </WhatsAppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
