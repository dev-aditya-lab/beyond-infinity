
export const SectionLabel = ({ children }) => (
  <p className="font-barlow text-[10px] tracking-[0.28em] uppercase text-brand-offwhite/40 mb-5">
    {children}
  </p>
);

export const Divider = ({ align = "left" }) => (
  <div className={`w-12 h-[1px] bg-brand-offwhite/35 mb-7 ${align === "right" ? "ml-auto" : "ml-0"}`} />
);

export const Heading = ({ children, size = "large" }) => (
  <h2 className={`font-bebas tracking-[0.05em] leading-[0.95] text-brand-offwhite uppercase mb-7 ${
    size === "large" ? "text-[clamp(52px,8vw,108px)]" : "text-[clamp(42px,6vw,84px)]"
  }`}>
    {children}
  </h2>
);

export const SubText = ({ children, align = "left" }) => (
  <p className={`font-barlow text-[13px] tracking-[0.18em] uppercase text-brand-offwhite/50 mb-10 max-w-[520px] leading-[1.7] ${
    align === "right" ? "text-right ml-auto" : "text-left ml-0"
  }`}>
    {children}
  </p>
);

export const StatRow = ({ stats, align = "left" }) => (
  <div className={`flex gap-14 mt-[52px] flex-wrap ${align === "right" ? "justify-end" : "justify-start"}`}>
    {stats.map(({ num, label }) => (
      <div key={label} className={align === "right" ? "text-right" : "text-left"}>
        <div className="font-bebas text-[48px] tracking-[0.06em] text-brand-offwhite">{num}</div>
        <div className="font-barlow text-[9px] tracking-[0.24em] uppercase text-brand-offwhite/40 mt-1">{label}</div>
      </div>
    ))}
  </div>
);
