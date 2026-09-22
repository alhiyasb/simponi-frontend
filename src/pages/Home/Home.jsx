import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import HeroSection from "../../components/landing/HeroSection";
import ServiceSection from "../../components/landing/ServiceSection";
import FeatureSection from "../../components/landing/FeatureSection";
import StatisticSection from "../../components/landing/StatisticSection";


export default function Home() {
  return (
    <div>
      <Navbar />

      <main>
        <HeroSection />

        <ServiceSection />

        <FeatureSection />

        <StatisticSection />
      </main>

      <Footer />
    </div>
  );
}