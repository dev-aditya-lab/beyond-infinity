import { Menu, Calendar, Search, Bell } from "lucide-react";

const TopNav = ({ onMenuClick }) => (
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
      <div className="hidden sm:flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-md px-3 py-1.5 cursor-pointer">
        <Calendar size={11} className="text-white/50" strokeWidth={1.5} />
        <span className="font-barlow text-[9.5px] tracking-[0.14em] uppercase text-white/60">May 18–24, 2025</span>
      </div>
      <div className="w-8 h-8 border border-white/10 rounded-md flex items-center justify-center cursor-pointer bg-white/[0.03] hover:bg-white/[0.08] transition">
        <Search size={13} className="text-white/55" strokeWidth={1.5} />
      </div>
      <div className="w-8 h-8 border border-white/10 rounded-md flex items-center justify-center cursor-pointer bg-white/[0.03] relative">
        <Bell size={13} className="text-white/55" strokeWidth={1.5} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-[7px] flex items-center justify-center text-white font-semibold border-[1.5px] border-black">3</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/18 flex items-center justify-center text-[11px] font-semibold cursor-pointer text-white">AR</div>
    </div>
  </div>
);

export default TopNav;
