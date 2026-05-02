import { 
  Activity, X, LayoutDashboard, Clock, Server, Bell, AlignLeft, 
  BarChart2, Sparkles, Users, Key, Settings, LogOut
} from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import useAuth from "../../../hooks/useAuth.js";
import { NAV_ITEMS } from '../dashboard.constants';

const iconMap = {
  LayoutDashboard,
  Clock,
  Server,
  Bell,
  AlignLeft,
  BarChart2,
  Sparkles,
  Users,
  Key,
  Settings,
};

const IconComponent = ({ iconName }) => {
  const Icon = iconMap[iconName];
  if (!Icon) return null;
  return <Icon size={13} strokeWidth={1.6} />;
};

const Sidebar = ({ active, setActive, open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { logout } = useAuth();
  const groups = ["MAIN","SYSTEM"];

  /** Handle nav item click — some items navigate to actual routes */
  const handleNavClick = (navId) => {
    // Items with dedicated routes
    if (navId === "incidents") {
      navigate("/incidents");
      onClose();
      return;
    }
    if (navId === "users") {
      navigate("/employees");
      onClose();
      return;
    }
    if (navId === "settings") {
      navigate("/profile");
      onClose();
      return;
    }
    // Default: switch dashboard view
    setActive(navId);
    onClose();
  };

  /** Handle logout */
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /** Get user initials */
  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 sidebar-overlay lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <nav className={`
        fixed top-0 left-0 h-full z-50 flex flex-col
        w-[220px] bg-[#07080f] border-r border-white/[0.07]
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex lg:z-auto
      `}>
        <div className="dashboard-scanlines absolute inset-0 pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col h-full">
          {/* Brand */}
          <div className="px-4 py-5 border-b border-white/[0.07]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-8 h-8 bg-white/[0.08] border border-white/20 rounded-md flex items-center justify-center">
                  <Activity size={14} className="text-white" />
                </div>
                <span className="font-bebas text-[19px] tracking-[0.18em] text-white">OPSPULSE</span>
              </div>
              <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white/80 p-1 cursor-pointer bg-transparent border-none">
                <X size={16} />
              </button>
            </div>
            <div className="font-barlow text-[9px] tracking-[0.22em] uppercase text-white/25 mt-1 pl-10">INCIDENT RESPONSE</div>
          </div>

          {/* Nav */}
          <div className="flex-1 overflow-y-auto px-2.5 py-2">
            {groups.map(g => (
              <div key={g}>
                <div className="font-barlow text-[8.5px] tracking-[0.28em] uppercase text-white/22 px-2 pt-3 pb-1.5 mt-1">{g}</div>
                {NAV_ITEMS.filter(n => n.group === g).map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleNavClick(n.id)}
                    className={`
                      flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer mb-0.5
                      border-l-2 font-barlow text-[11px] tracking-[0.14em] uppercase
                      transition-all duration-200
                      ${active === n.id
                        ? "bg-white/[0.09] text-white border-l-white/40"
                        : "text-white/50 border-l-transparent hover:bg-white/[0.05] hover:text-white/85"
                      }
                    `}
                  >
                    <IconComponent iconName={n.Icon} />
                    {n.label}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Status + User */}
          <div>
            <div className="mx-3 mb-2.5 bg-white/[0.03] border border-white/[0.07] rounded-md p-2.5 flex items-center justify-between">
              <div>
                <div className="font-barlow text-[8.5px] tracking-[0.18em] uppercase text-white/25">System Status</div>
                <div className="font-barlow text-[10px] tracking-[0.12em] uppercase text-green-400 flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" />
                  All Operational
                </div>
              </div>
            </div>
            <div className="px-3.5 py-3 border-t border-white/[0.07] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/20 flex items-center justify-center text-[11px] font-semibold text-white relative flex-shrink-0">
                {getInitials(user?.name)}
                <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-green-400 border-[1.5px] border-[#07080f]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-barlow text-[11px] tracking-[0.1em] uppercase text-white truncate">
                  {user?.name || "User"}
                </div>
                <div className="font-barlow text-[9px] tracking-[0.16em] uppercase text-white/25">
                  {user?.role || "employee"}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-white/25 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none p-1"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
