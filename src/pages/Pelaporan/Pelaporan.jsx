import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PelaporanForm from './PelaporanForm';

export default function PelaporanPage(){
  return (
    <div>
      <Navbar />
      <main className="pt-20">
        <PelaporanForm />
      </main>
      <Footer />
    </div>
  );
}
