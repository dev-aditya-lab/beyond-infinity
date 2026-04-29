
export const HeroBg = () => (
  <div className="absolute inset-0 z-0">
    <svg className="svg-layer absolute inset-0 opacity-[0.22]" width="100%" height="100%" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(240,240,250,0.5)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="gridFade" cx="30%" cy="50%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="gridMask"><rect width="100%" height="100%" fill="url(#gridFade)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)" />
      <line x1="0" y1="300" x2="700" y2="300" stroke="rgba(240,240,250,0.25)" strokeWidth="0.5" strokeDasharray="8 16" />
      <line x1="0" y1="500" x2="600" y2="500" stroke="rgba(240,240,250,0.18)" strokeWidth="0.5" strokeDasharray="8 24" />
      <circle cx="200" cy="300" r="3" fill="rgba(240,240,250,0.5)" />
      <circle cx="200" cy="300" r="8" fill="none" stroke="rgba(240,240,250,0.2)" strokeWidth="1">
        <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="360" cy="300" r="2" fill="rgba(240,240,250,0.4)" />
      <circle cx="480" cy="300" r="2" fill="rgba(240,240,250,0.4)" />
      <circle cx="300" cy="500" r="3" fill="rgba(240,240,250,0.4)" />
      <circle cx="300" cy="500" r="8" fill="none" stroke="rgba(240,240,250,0.2)" strokeWidth="1">
        <animate attributeName="r" values="8;18;8" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
    <div className="absolute right-[6vw] top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] font-barlow text-[9px] tracking-[0.3em] uppercase text-brand-offwhite/15">
      SYSTEM OPERATIONAL — v4.2.1 — ACTIVE
    </div>
  </div>
);

export const MonitoringBg = () => (
  <svg className="svg-layer absolute inset-0 z-0 opacity-20" width="100%" height="100%" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <polyline points="0,300 120,290 200,320 280,280 360,310 440,270 520,315 600,285 680,295 760,275 840,300 920,285 1000,305 1080,278 1160,298 1240,282 1320,295 1440,288" fill="none" stroke="rgba(240,240,250,0.6)" strokeWidth="1" />
    <polyline points="0,450 100,460 180,430 260,470 340,440 420,465 500,435 580,455 660,438 740,462 820,444 900,460 980,438 1060,452 1140,440 1220,456 1300,442 1440,450" fill="none" stroke="rgba(240,240,250,0.35)" strokeWidth="0.7" />
    <polyline points="0,560 80,550 160,570 240,545 320,565 400,548 480,562 560,547 640,558 720,544 800,555 880,548 960,558 1040,544 1120,554 1200,546 1320,552 1440,549" fill="none" stroke="rgba(240,240,250,0.18)" strokeWidth="0.5" />
    <line x1="200" y1="260" x2="200" y2="340" stroke="rgba(240,240,250,0.25)" strokeWidth="0.5" />
    <line x1="560" y1="260" x2="560" y2="340" stroke="rgba(240,240,250,0.2)" strokeWidth="0.5" />
    <line x1="920" y1="260" x2="920" y2="340" stroke="rgba(240,240,250,0.2)" strokeWidth="0.5" />
  </svg>
);

export const AlertsBg = () => (
  <svg className="svg-layer absolute inset-0 z-0 opacity-[0.18]" width="100%" height="100%" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <circle cx="900" cy="450" r="80" fill="none" stroke="rgba(240,240,250,0.8)" strokeWidth="1" />
    <circle cx="900" cy="450" r="8" fill="rgba(240,240,250,0.9)" />
    <circle cx="900" cy="450" r="120" fill="none" stroke="rgba(240,240,250,0.5)" strokeWidth="0.7">
      <animate attributeName="r" values="120;240;120" dur="4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="900" cy="450" r="200" fill="none" stroke="rgba(240,240,250,0.3)" strokeWidth="0.5">
      <animate attributeName="r" values="180;360;180" dur="4s" begin="0.8s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.35;0;0.35" dur="4s" begin="0.8s" repeatCount="indefinite" />
    </circle>
    <line x1="0" y1="450" x2="1440" y2="450" stroke="rgba(240,240,250,0.1)" strokeWidth="0.5" strokeDasharray="6 14" />
    <line x1="900" y1="0" x2="900" y2="900" stroke="rgba(240,240,250,0.1)" strokeWidth="0.5" strokeDasharray="6 14" />
  </svg>
);

export const ResponseBg = () => (
  <svg className="svg-layer absolute inset-0 z-0 opacity-[0.22]" width="100%" height="100%" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <rect x="200" y="380" width="0" height="18" rx="2" fill="rgba(240,240,250,0.7)">
      <animate attributeName="width" values="0;580;580" dur="2.2s" repeatCount="indefinite" />
    </rect>
    <rect x="200" y="414" width="0" height="18" rx="2" fill="rgba(240,240,250,0.5)">
      <animate attributeName="width" values="0;380;380" dur="2.2s" repeatCount="indefinite" begin="0.3s" />
    </rect>
    <rect x="200" y="448" width="0" height="18" rx="2" fill="rgba(240,240,250,0.3)">
      <animate attributeName="width" values="0;500;500" dur="2.2s" repeatCount="indefinite" begin="0.6s" />
    </rect>
    <rect x="200" y="482" width="0" height="18" rx="2" fill="rgba(240,240,250,0.2)">
      <animate attributeName="width" values="0;260;260" dur="2.2s" repeatCount="indefinite" begin="0.9s" />
    </rect>
    <line x1="198" y1="368" x2="198" y2="520" stroke="rgba(240,240,250,0.35)" strokeWidth="1" />
  </svg>
);

export const AnalyticsBg = () => (
  <svg className="svg-layer absolute inset-0 z-0 opacity-20" width="100%" height="100%" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <polyline points="100,700 300,580 500,620 700,440 900,480 1100,320 1300,360 1440,280" fill="none" stroke="rgba(240,240,250,0.7)" strokeWidth="1.2" />
    <polyline points="100,720 300,650 500,680 700,540 900,560 1100,420 1300,450 1440,370" fill="none" stroke="rgba(240,240,250,0.3)" strokeWidth="0.8" />
    <circle cx="300" cy="580" r="4" fill="rgba(240,240,250,0.8)" />
    <circle cx="700" cy="440" r="4" fill="rgba(240,240,250,0.8)" />
    <circle cx="1100" cy="320" r="5" fill="rgba(240,240,250,0.9)">
      <animate attributeName="r" values="5;12;5" dur="2.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <line x1="0" y1="300" x2="1440" y2="300" stroke="rgba(240,240,250,0.08)" strokeWidth="0.5" strokeDasharray="4 12" />
    <line x1="0" y1="450" x2="1440" y2="450" stroke="rgba(240,240,250,0.08)" strokeWidth="0.5" strokeDasharray="4 12" />
    <line x1="0" y1="600" x2="1440" y2="600" stroke="rgba(240,240,250,0.08)" strokeWidth="0.5" strokeDasharray="4 12" />
  </svg>
);
