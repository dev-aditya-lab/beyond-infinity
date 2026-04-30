import { MonitoringBg } from './Backgrounds';
import { FullSection, Overlay, Content } from '../common/LayoutElements';
import { SectionLabel, Divider, Heading, SubText, StatRow } from '../common/Typography';

const MonitoringSection = () => (
  <FullSection id="monitoring" align="right">
    <MonitoringBg />
    <div className="scanlines" />
    <Overlay />
    <Content align="right">
      <SectionLabel>SECTION 01 — MONITORING</SectionLabel>
      <Divider align="right" />
      <Heading>TRACK SYSTEM<br />HEALTH IN<br />REAL TIME</Heading>
      <SubText align="right">CONTINUOUS TELEMETRY ACROSS EVERY NODE,<br />SERVICE, AND LAYER OF YOUR INFRASTRUCTURE</SubText>
      <button className="btn-ghost">EXPLORE MONITORING</button>
      <StatRow align="right" stats={[
        { num: "1200+", label: "ACTIVE MONITORS" },
        { num: "30s",   label: "CHECK INTERVAL"  },
      ]} />
    </Content>
  </FullSection>
);

export default MonitoringSection;
