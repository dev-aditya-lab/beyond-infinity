import { useNavigate } from 'react-router';
import { HeroBg } from './Backgrounds';
import { FullSection, Overlay, Content } from '../common/LayoutElements';
import { Divider, Heading, SubText, StatRow } from '../common/Typography';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
  <FullSection id="hero">
    <HeroBg />
    <div className="scanlines" />
    <Overlay />
    <Content>
      <div className="flex items-center mb-6">
        <span className="relative inline-flex items-center justify-center w-2.5 h-2.5 mr-2.5">
          <span className="pulse-ring" />
          <span className="absolute w-1.25 h-1.25 rounded-full bg-brand-offwhite" />
        </span>
        <span className="font-barlow text-[9px] tracking-[0.28em] uppercase text-brand-offwhite/45">
          ALL SYSTEMS NOMINAL
        </span>
      </div>
      <Divider />
      <Heading size="large">
        REAL-TIME<br />INCIDENT<br />RESPONSE<br />PLATFORM
      </Heading>
      <SubText>MONITOR, DETECT, AND RESOLVE<br />SYSTEM FAILURES INSTANTLY</SubText>
      <button onClick={() => navigate("/login")} className="btn-ghost">VIEW INCIDENTS</button>
      <StatRow stats={[
        { num: "99.98", label: "UPTIME %" },
        { num: "0.4s",  label: "MEAN DETECTION" },
        { num: "4200+", label: "INCIDENTS RESOLVED" },
      ]} />
    </Content>
  </FullSection>
);
};

export default HeroSection;
