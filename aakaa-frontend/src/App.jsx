import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Booking from "./pages/Booking";
import Yoga from "./pages/Yoga";
import Academy from "./pages/Academy";
import AdminDashboard from "./pages/admin";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import Navbar from "./components/layout/Navbar";
import ScrollToTop from "./components/utils/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import ProfessionalCare from "./pages/ProfessionalCare";

// Legal Pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsAndConditions from "./pages/legal/TermsAndConditions";
import RefundCancellation from "./pages/legal/RefundCancellation";
import CrisisResources from "./pages/legal/CrisisResources";

// Wrapper component to handle location-based logic
function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/admin"; // Assuming /admin is the login page now

  return (
    <>
      <ScrollToTop />
      {!isAdminPath && <Navbar />}
      <div className="flex-1 w-full flex flex-col overflow-x-hidden">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/professional-care" element={<ProfessionalCare />} />
          <Route path="/yoga" element={<Yoga />} />
          <Route path="/academy" element={<Academy />} />
          
          {/* Legal & Compliance Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/refund-cancellation" element={<RefundCancellation />} />
          <Route path="/crisis-resources" element={<CrisisResources />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route 
            path="/admin/dashboard/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <Router>
          <AppContent />
        </Router>
      </BlogProvider>
    </AuthProvider>
  );
}
