import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';

// ── Edit your nav links here ──────────────────────────────────────────────────
const menuItems = [
  { label: 'Home',             href: '#hero', isNav: false },
  { label: 'Features',         href: '#monitoring', isNav: false },
  { label: 'Alerts',           href: '#alerts', isNav: false },
  { label: 'Status',           href: '#response', isNav: false },
  { label: 'Login',            href: '/login', isNav: true },
  { label: 'Sign Up',          href: '/signup', isNav: true },
];

// ── System links in the footer of the menu ────────────────────────────────────
const socialItems = [
  { label: 'Dashboard',  href: '/dashboard' },
  { label: 'Incidents',  href: '/incidents' },
  { label: 'Analytics',  href: '#analytics' },
];

export default function StaggeredMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => setIsOpen(!isOpen);

  const panelRef      = useRef(null);
  const prelayer1Ref  = useRef(null);
  const prelayer2Ref  = useRef(null);
  const navItemsRef   = useRef([]);
  const socialsRef    = useRef(null);
  const menuLabelRef  = useRef(null);
  const closeLabelRef = useRef(null);
  const tlRef         = useRef(null);

  const animateOpen = useCallback(() => {
    const tl = gsap.timeline();
    tlRef.current = tl;

    // Swap label: MENU slides up, CLOSE follows
    tl.to(menuLabelRef.current,  { y: '-100%', duration: 0.4, ease: 'power3.inOut' });
    tl.to(closeLabelRef.current, { y: '-100%', duration: 0.4, ease: 'power3.inOut' }, '<');

    // Pre-layers flash in (staggered 80ms apart)
    tl.to(prelayer1Ref.current, { x: 0, duration: 0.6, ease: 'power4.out' }, 0);
    tl.to(prelayer2Ref.current, { x: 0, duration: 0.6, ease: 'power4.out' }, 0.08);

    // Main panel slides in
    tl.to(panelRef.current, { x: 0, duration: 0.8, ease: 'power4.out' }, 0.15);

    // Pre-layers retreat behind panel
    tl.to([prelayer1Ref.current, prelayer2Ref.current], { x: '-100%', duration: 0.5, ease: 'power3.in' }, 0.5);

    // Nav items stagger up from below their clip container
    const items = navItemsRef.current.filter(Boolean);
    tl.fromTo(items,
      { yPercent: 140, rotate: 10 },
      { yPercent: 0, rotate: 0, duration: 1, stagger: 0.06, ease: 'power4.out' },
      0.3
    );

    // Socials fade in
    tl.fromTo(socialsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      0.7
    );
  }, []);

  const animateClose = useCallback(() => {
    const tl = gsap.timeline();
    tlRef.current = tl;

    // Swap label back
    tl.to(menuLabelRef.current,  { y: '0%', duration: 0.4, ease: 'power3.inOut' });
    tl.to(closeLabelRef.current, { y: '0%', duration: 0.4, ease: 'power3.inOut' }, '<');

    // Socials + items exit
    tl.to(socialsRef.current, { opacity: 0, y: 20, duration: 0.3, ease: 'power3.in' }, 0);
    const items = navItemsRef.current.filter(Boolean);
    tl.to(items, { yPercent: 140, rotate: -5, duration: 0.5, stagger: 0.03, ease: 'power3.in' }, 0);

    // Panel slides out
    tl.to(panelRef.current, { x: '100%', duration: 0.7, ease: 'power3.inOut' }, 0.2);

    // Reset pre-layers off-screen
    tl.set([prelayer1Ref.current, prelayer2Ref.current], { x: '100%' });
  }, []);

  useEffect(() => {
    tlRef.current?.kill(); // always kill the previous timeline before starting a new one
    if (isOpen) animateOpen();
    else        animateClose();
  }, [isOpen, animateOpen, animateClose]);

  const handleLinkClick = (e, href, isNav = false) => {
    e.preventDefault();
    onToggle();
    if (isNav) {
      setTimeout(() => {
        navigate(href);
      }, 700);
    } else {
      setTimeout(() => {
        const id = href.replace('#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 700);
    }
  };

  const panelWidthClass = "w-full lg:w-[clamp(260px,38vw,420px)]";

  return (
    <div className="font-barlow">
      {/* Toggle button */}
      <button 
        className={`
          fixed top-6 right-6 md:right-12 z-[110] flex items-center gap-3 py-3 px-5
          bg-[#f0f0fa]/10 border border-[#f0f0fa]/35 rounded-full text-[#f0f0fa]
          backdrop-blur-md font-inherit text-xs tracking-[0.15em] cursor-pointer uppercase
          transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
          hover:bg-[#f0f0fa]/15 hover:border-[#f0f0fa]
          ${isOpen ? 'border-[#f0f0fa]/10 lg:-translate-x-[clamp(260px,38vw,420px)]' : ''}
        `} 
        onClick={onToggle}
      >
        <span className="relative overflow-hidden h-[1.5em] w-[3em]">
          <span ref={menuLabelRef} className="block absolute left-0 w-full text-center font-inherit">MENU</span>
          <span ref={closeLabelRef} className="block absolute left-0 w-full text-center font-inherit" style={{ top: '100%' }}>CLOSE</span>
        </span>
        <span 
          className={`inline-block text-xl leading-none transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-[225deg]' : ''}`}
        >
          +
        </span>
      </button>

      {/* Invisible overlay — clicking outside closes the menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[107] cursor-pointer bg-black/50 backdrop-blur-[4px]" 
          onClick={onToggle} 
        />
      )}

      {/* Colour pre-layers */}
      <div 
        ref={prelayer1Ref} 
        className={`fixed top-0 right-0 h-full z-[108] translate-x-full bg-[#f0f0fa]/10 backdrop-blur-[10px] ${panelWidthClass}`} 
      />
      <div 
        ref={prelayer2Ref} 
        className={`fixed top-0 right-0 h-full z-[108] translate-x-full bg-black/50 backdrop-blur-[16px] ${panelWidthClass}`} 
      />

      {/* Main panel */}
      <div 
        ref={panelRef} 
        className={`fixed top-0 right-0 h-full z-[109] flex flex-col justify-center py-22 px-10 translate-x-full overflow-y-auto bg-black/70 backdrop-blur-[24px] ${panelWidthClass}`}
      >
        <ul className="list-none p-0 m-0 [counter-reset:menu-counter]">
          {menuItems.map((item, i) => (
            <li 
              key={item.label} 
              ref={(el) => { navItemsRef.current[i] = el; }}
              className="[counter-increment:menu-counter] overflow-hidden mb-2"
            >
              <a 
                href={item.href} 
                onClick={(e) => handleLinkClick(e, item.href, item.isNav)}
                className="block text-[2.5rem] md:text-5xl leading-[1.15] uppercase text-[#f0f0fa]/65 no-underline font-inherit font-bold tracking-[0.96px] relative transition-colors duration-300 pr-8 hover:text-[#f0f0fa] group before:content-['0'_counter(menu-counter,decimal)] before:absolute before:top-[0.5em] before:right-0 before:text-[0.81rem] before:tracking-[1.17px] before:text-[#f0f0fa] before:font-normal before:opacity-50 hover:before:opacity-100 before:transition-opacity before:duration-300"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div ref={socialsRef} className="mt-auto pt-8 border-t border-[#f0f0fa]/10" style={{ opacity: 0 }}>
          <div className="text-xs tracking-[1.17px] uppercase text-[#f0f0fa]/50 mb-4 font-bold">
            System Links
          </div>
          <div className="flex flex-col gap-3 group/links">
            {socialItems.map((s) => (
              <a 
                key={s.label} 
                href={s.href}
                className="text-[0.81rem] uppercase text-[#f0f0fa] no-underline tracking-[1.17px] transition-opacity duration-300 font-normal hover:!opacity-100 group-hover/links:opacity-40"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
