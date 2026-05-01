import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const NAV_LINKS = [
    { label: "HOME",      id: "hero"      },
    { label: "FEATURES",  id: "monitoring"},
    { label: "INCIDENTS", id: "alerts"    },
    { label: "STATUS",    id: "response"  },
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
          {NAV_LINKS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="font-barlow text-[11px] tracking-[0.2em] uppercase text-brand-offwhite/65 hover:text-brand-offwhite bg-none border-none cursor-pointer transition-colors duration-200"
            >
              {label}
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex gap-5 items-center">
          <button
            onClick={() => navigate("/login")}
            className="font-barlow text-[11px] tracking-[0.2em] uppercase text-brand-offwhite/65 hover:text-brand-offwhite bg-none border-none cursor-pointer transition-colors duration-200"
          >
            LOGIN
          </button>
          {/* <button className="btn-ghost btn-ghost-sm">SIGN UP</button> */}
        </div>

        {/* Note: StaggeredMenu is used for the mobile menu / global sidebar menu. Its toggle button is placed via fixed positioning. */}
      </nav>
    </>
  );
};

export default Navbar;
