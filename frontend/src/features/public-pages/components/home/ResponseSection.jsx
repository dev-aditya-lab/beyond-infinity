import { ResponseBg } from './Backgrounds';
import { FullSection, Overlay, Content } from '../common/LayoutElements';
import { SectionLabel, Divider, Heading, SubText, StatRow } from '../common/Typography';

const ResponseSection = () => (
  <FullSection id="response" align="right">
    <ResponseBg />
    <div className="scanlines" />
    <Overlay />
    <Content align="right">
      <SectionLabel>SECTION 03 — RESPONSE</SectionLabel>
      <Divider align="right" />
      <Heading>FAST<br />INCIDENT<br />RESPONSE</Heading>
      <SubText align="right">COORDINATE YOUR TEAM, AUTOMATE RUNBOOKS,<br />AND CLOSE INCIDENTS BEFORE USERS NOTICE</SubText>
      <button className="btn-ghost">SEE RUNBOOKS</button>
      <StatRow align="right" stats={[
        { num: "3.2min", label: "AVG RESOLUTION TIME" },
        { num: "87%",    label: "AUTO-RESOLVED"       },
      ]} />
    </Content>
  </FullSection>
);

export default ResponseSection;
