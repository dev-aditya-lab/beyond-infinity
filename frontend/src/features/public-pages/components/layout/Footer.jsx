
const Footer = () => (
  <footer className="bg-black border-t border-brand-offwhite/10 px-[8vw] py-[52px] flex items-center justify-between flex-wrap gap-6">
    <span className="font-bebas text-[20px] tracking-[0.22em] text-brand-offwhite">
      OPSPULSE
    </span>
    <div className="flex gap-7">
      {["PRIVACY", "TERMS", "STATUS", "DOCS"].map(l => (
        <span key={l} className="font-barlow text-[9px] tracking-[0.2em] uppercase text-brand-offwhite/30 hover:text-brand-offwhite cursor-pointer transition-colors duration-200">
          {l}
        </span>
      ))}
    </div>
    <span className="font-barlow text-[10px] tracking-[0.22em] uppercase text-brand-offwhite/30">
      OPS PULSE © 2026 — ALL RIGHTS RESERVED
    </span>
  </footer>
);

export default Footer;
