import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import GoogleFonts from '../components/GoogleFonts';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import DashboardView from '../components/DashboardView';
import ApiKeysView from '../components/ApiKeysView';
import EmptyView from '../components/EmptyView';
import { NAV_ITEMS } from '../dashboard.constants';
import useIncidents from '../../../hooks/useIncidents.js';
import useToast from '../../../hooks/useToast.jsx';
import { ToastContainer } from '../../../hooks/useToast.jsx';


/* ─── ROOT ─── */
export default function OpsPulseDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { getIncidents } = useIncidents();
  const { toasts, removeToast } = useToast();

  // Close sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getIncidents().catch((err) => {
      console.error('Failed to fetch dashboard data:', err);
    });
  }, []);

  const renderView = () => {
    if (active === "dashboard") return <DashboardView />;
    if (active === "apikeys")   return <ApiKeysView />;
    const label = NAV_ITEMS.find(n => n.id === active)?.label || active;
    return <EmptyView title={label} />;
  };

  return (
    <>
      <GoogleFonts />
      <div className="flex h-screen bg-black text-white overflow-hidden">
        <Sidebar
          active={active}
          setActive={setActive}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopNav onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 sm:py-6">
            {renderView()}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}