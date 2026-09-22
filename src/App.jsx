import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import DataPage from './pages/Data/Data';
import PelaporanPage from './pages/Pelaporan/Pelaporan';
import LoginPage from './pages/Auth/Login';
import ContactPage from './pages/Contact/Contact';
import ProfilePage from './pages/Profile/Profile';
import TrackingPage from './pages/Tracking/Tracking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/data" element={<DataPage/>} />
        <Route path="/tracking" element={<TrackingPage/>} />
        <Route path="/pelaporan" element={<PelaporanPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;