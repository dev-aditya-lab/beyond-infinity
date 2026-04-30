import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import MonitoringSection from "../components/home/MonitoringSection";
import AlertsSection from "../components/home/AlertsSection";
import ResponseSection from "../components/home/ResponseSection";
import AnalyticsSection from "../components/home/AnalyticsSection";
import StaggeredMenu from "../components/layout/StaggeredMenu";

 
export default function OpsPulse() {
  return (
    <>
      <StaggeredMenu />
      <Navbar />
      <main>
        <HeroSection />
        <MonitoringSection />
        <AlertsSection />
        <ResponseSection />
        <AnalyticsSection />
      </main>
      <Footer />
    </>
  );
}