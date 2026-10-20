import EksporData from "./pages/AdminPemprov/EksporData";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// ================================
// PUBLIC PAGES
// ================================
import Home from "./pages/Home/Home";
import DataPage from "./pages/Data/Data";
import DataProvinsiPage from "./pages/Data/DataProvinsiPage";
import PelaporanPage from "./pages/Pelaporan/Pelaporan";
import LoginPage from "./pages/Auth/Login";
import VerifyEmailPage from "./pages/Auth/VerifyEmail";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ResetPasswordPage from "./pages/Auth/ResetPassword";
import ContactPage from "./pages/Contact/Contact";
import ProfilePage from "./pages/Profile/Profile";
import TrackingPage from "./pages/Tracking/Tracking";
import ReportDetailPage from "./pages/Tracking/ReportDetail";
import Unauthorized from "./pages/Unauthorized";
import StatistikPublikPage from "./pages/Statistik/StatistikPublikPage";

// ================================
// ADMIN PEMPROV
// ================================
import AdminPemprovDashboard from "./pages/AdminPemprov/AdminPemprovDashboard";
import AdminPetugasPage from "./pages/AdminPemprov/AdminPetugasPage";
import RaporKabupaten from "./pages/AdminPemprov/RaporKabupaten";

// ================================
// ADMIN PEMDA
// ================================
import AdminPemdaDashboard from "./pages/AdminPemda/AdminPemdaDashboard";
import AdminPemdaLaporan from "./pages/AdminPemda/AdminPemdaLaporan";
import AdminPemdaPenanganan from "./pages/AdminPemda/AdminPemdaPenanganan";
import AdminPemdaSelesai from "./pages/AdminPemda/AdminPemdaSelesaiDetail";
import AdminPemdaSelesaiDetail from "./pages/AdminPemda/AdminPemdaSelesaiDetail";
import AdminPemdaProfil from "./pages/AdminPemda/AdminPemdaProfil";

function AppRoutes() {
  return (
    <Routes>
      {/* ================================
          PUBLIC ROUTES
      ================================= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/statistik" element={<StatistikPublikPage />} />

      {/* ================================
          MASYARAKAT
          role: public
      ================================= */}
      <Route element={<ProtectedRoute allowedRoles={["public"]} />}>
        <Route path="/pelaporan" element={<PelaporanPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/tracking/:reportId" element={<ReportDetailPage />} />
        <Route path="/data" element={<DataPage />} />
      </Route>

      {/* ================================
          ADMIN PEMDA
          role: admin_pemda
      ================================= */}
      <Route element={<ProtectedRoute allowedRoles={["admin_pemda"]} />}>
        <Route path="/admin/pemda" element={<AdminPemdaDashboard />} />
        <Route path="/admin/pemda/laporan" element={<AdminPemdaLaporan />} />
        <Route path="/admin/pemda/penanganan" element={<AdminPemdaPenanganan />} />
        <Route
          path="/admin/pemda/penanganan/:reportId"
          element={<AdminPemdaPenanganan />}
        />
        <Route path="/admin/pemda/selesai" element={<AdminPemdaSelesai />} />
        <Route
          path="/admin/pemda/selesai/:reportId"
          element={<AdminPemdaSelesaiDetail />}
        />
        <Route path="/admin/pemda/profil" element={<AdminPemdaProfil />} />
      </Route>

      {/* ================================
          ADMIN PEMPROV
          role: admin_pemprov
      ================================= */}
      <Route element={<ProtectedRoute allowedRoles={["admin_pemprov"]} />}>
        <Route path="/admin/pemprov" element={<AdminPemprovDashboard />} />
        <Route path="/admin/pemprov/petugas" element={<AdminPetugasPage />} />

        {/* HALAMAN RAPOR KABUPATEN */}
        <Route
          path="/admin/pemprov/rapor"
          element={<RaporKabupaten />}
        />
        <Route
  path="/admin/pemprov/ekspor"
  element={<EksporData />}
/>

        <Route path="/data-provinsi" element={<DataProvinsiPage />} />
      </Route>

      {/* ================================
          ALL AUTHENTICATED USERS
      ================================= */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
    
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;