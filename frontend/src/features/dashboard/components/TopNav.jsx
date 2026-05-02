import { Menu, Calendar, Search, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const TopNav = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="h-13 min-h-[52px] flex items-center justify-between gap-2 px-4 sm:px-5 border-b border-white/[0.07] bg-white/[0.008]">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-8 h-8 flex items-center justify-center border border-white/10 rounded-md bg-white/[0.03] text-white/55 hover:text-white/80 transition"
      >
        <Menu size={15} />
      </button>

      {/* Spacer for desktop */}
      <div className="hidden lg:flex flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-md px-3 py-1.5">
          <Calendar size={11} className="text-white/50" strokeWidth={1.5} />
          <span className="font-barlow text-[9.5px] tracking-[0.14em] uppercase text-white/60">{dateStr}</span>
        </div>
        <div
          onClick={() => navigate('/profile')}
          className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/18 flex items-center justify-center text-[11px] font-semibold cursor-pointer text-white hover:bg-white/[0.14] transition"
          title="Profile"
        >
          {getInitials(user?.name)}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
