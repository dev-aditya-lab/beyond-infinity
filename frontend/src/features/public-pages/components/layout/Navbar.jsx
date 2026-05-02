/**
 * Landing Page Navbar — OpsPulse Theme
 * Navigation with scroll-to for sections and working auth links
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Smooth scroll to section by ID */
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /** Nav links with matching section IDs */
  const NAV_LINKS = [
    { label: "HOME",      action: () => scrollTo("hero")       },
    { label: "FEATURES",  action: () => scrollTo("monitoring") },
    { label: "ALERTS",    action: () => scrollTo("alerts")     },
    { label: "STATUS",    action: () => scrollTo("response")   },
    { label: "ANALYTICS", action: () => scrollTo("analytics")  },
  ];

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-6 flex items-center justify-between transition-all duration-400 ${
          scrolled ? "bg-black/70 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        {/* LOGO */}
        <span
          className="font-bebas text-[22px] tracking-[0.22em] text-brand-offwhite cursor-pointer"
          onClick={() => scrollTo("hero")}
        >
          OPSPULSE
        </span>

        {/* LINKS — hidden on mobile */}
        <div className="hidden md:flex gap-9 items-center">
          {NAV_LINKS.map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="font-barlow text-[11px] tracking-[0.2em] uppercase text-brand-offwhite/65 hover:text-brand-offwhite bg-transparent border-none cursor-pointer transition-colors duration-200"
            >
              {label}
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex gap-5 items-center">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-ghost btn-ghost-sm"
            >
              DASHBOARD
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="font-barlow text-[11px] tracking-[0.2em] uppercase text-brand-offwhite/65 hover:text-brand-offwhite bg-transparent border-none cursor-pointer transition-colors duration-200"
              >
                LOGIN
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="btn-ghost btn-ghost-sm"
              >
                SIGN UP
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
