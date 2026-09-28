import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Home from './pages/Home/Home';
import DataPage from './pages/Data/Data';
import DataProvinsiPage from './pages/Data/DataProvinsiPage';
import PelaporanPage from './pages/Pelaporan/Pelaporan';
import LoginPage from './pages/Auth/Login';
import ContactPage from './pages/Contact/Contact';
import ProfilePage from './pages/Profile/Profile';
import TrackingPage from './pages/Tracking/Tracking';
import Unauthorized from './pages/Unauthorized';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes - Masyarakat (public) */}
      <Route element={<ProtectedRoute allowedRoles={['public']} />}>
        <Route path="/pelaporan" element={<PelaporanPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
      </Route>

      {/* Protected routes - Admin Pemda (admin_pemda) */}
      <Route element={<ProtectedRoute allowedRoles={['admin_pemda']} />}>
        <Route path="/data" element={<DataPage />} />
      </Route>

      {/* Protected routes - Admin Pemprov (admin_pemprov) */}
      <Route element={<ProtectedRoute allowedRoles={['admin_pemprov']} />}>
        <Route path="/data-provinsi" element={<DataProvinsiPage />} />
      </Route>

      {/* Protected routes - All authenticated users */}
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