import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PelaporanForm from './PelaporanForm';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function PelaporanPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-20">
        <ErrorBoundary fallback={<div className="p-8 text-center text-red-600">Gagal memuat form pelaporan. <button onClick={() => window.location.reload()} className="ml-2 text-blue-600 underline">Refresh</button></div>}>
          <PelaporanForm />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
