import { AlertsBg } from './Backgrounds';
import { FullSection, Overlay, Content } from '../common/LayoutElements';
import { SectionLabel, Divider, Heading, SubText, StatRow } from '../common/Typography';

const AlertsSection = () => (
  <FullSection id="alerts">
    <AlertsBg />
    <div className="scanlines" />
    <Overlay />
    <Content>
      <SectionLabel>SECTION 02 — ALERTS</SectionLabel>
      <Divider />
      <Heading>INSTANT<br />ALERT<br />DETECTION</Heading>
      <SubText>ANOMALY SIGNATURES IDENTIFIED ACROSS<br />THOUSANDS OF METRICS IN MILLISECONDS</SubText>
      <button className="btn-ghost">VIEW ALERT RULES</button>
      <StatRow stats={[
        { num: "142ms", label: "AVG ALERT LATENCY"   },
        { num: "99.6%", label: "DETECTION ACCURACY"  },
      ]} />
    </Content>
  </FullSection>
);

export default AlertsSection;
