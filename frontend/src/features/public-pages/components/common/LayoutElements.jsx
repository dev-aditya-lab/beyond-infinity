export const FullSection = ({ id, children, align = "left", className = "" }) => (
  <section
    id={id}
    className={`w-full pt-25  relative items-center  flex  overflow-hidden ${
      align === "right" ? "justify-end" : "justify-start"
    } ${className}`}
  >
    {children}
  </section>
);

export const Overlay = () => (
  <div className="absolute inset-0 bg-black/50 z-[1]" />
);

export const Content = ({ children, align = "left" }) => (
  <div 
    className={`relative z-[2] px-[8vw] max-w-[900px] w-full ${
      align === "right" ? "text-right ml-auto mr-[8vw]" : "text-left ml-0 mr-auto"
    }`}
  >
    {children}
  </div>
);
