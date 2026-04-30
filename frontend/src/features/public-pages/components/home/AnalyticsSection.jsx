import { AnalyticsBg } from './Backgrounds';
import { FullSection, Overlay, Content } from '../common/LayoutElements';
import { SectionLabel, Divider, Heading, SubText, StatRow } from '../common/Typography';

const AnalyticsSection = () => (
  <FullSection id="analytics">
    <AnalyticsBg />
    <div className="scanlines" />
    <Overlay />
    <Content>
      <SectionLabel>SECTION 04 — ANALYTICS</SectionLabel>
      <Divider />
      <Heading>POWERFUL<br />INSIGHTS</Heading>
      <SubText>RETROACTIVE ANALYSIS, TREND FORECASTING,<br />AND SLA REPORTING — ALL IN ONE VIEW</SubText>
      <button className="btn-ghost">EXPLORE ANALYTICS</button>
      <StatRow stats={[
        { num: "60d",  label: "DATA RETENTION"    },
        { num: "18+",  label: "REPORT TEMPLATES"  },
        { num: "100%", label: "SLA VISIBILITY"    },
      ]} />
    </Content>
  </FullSection>
);

export default AnalyticsSection;
