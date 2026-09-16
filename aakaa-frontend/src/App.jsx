import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Booking from "./pages/Booking";
import Yoga from "./pages/Yoga";
import AdminDashboard from "./pages/admin";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import Navbar from "./components/layout/Navbar";
import ScrollToTop from "./components/utils/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Wrapper component to handle location-based logic
function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/admin"; // Assuming /admin is the login page now

  return (
    <>
      <ScrollToTop />
      {!isAdminPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/yoga" element={<Yoga />} />
        
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
