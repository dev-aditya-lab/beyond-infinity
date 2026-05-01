import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Clock, AlertTriangle, CheckCircle, Zap, Plus, RefreshCw, Monitor,
  Database, Shield, CreditCard, Sparkles
} from "lucide-react";
import { CHART_DATA, INCIDENTS, SERVICES, METRICS } from '../dashboard.constants';
import PageHeader from './PageHeader';
import GhostBtn from './GhostBtn';
import Badge from './Badge';
import Sparkline from './Sparkline';
import CustomTooltip from './CustomTooltip';

const DashboardView = () => {
  const [chartToggle, setChartToggle] = useState("Daily");

  const iconMap = {
    Monitor,
    Database,
    Shield,
    CreditCard,
  };

  const IconComponent = ({ iconName }) => {
    const Icon = iconMap[iconName];
    if (!Icon) return null;
    return <Icon size={12} strokeWidth={1.6} />;
  };

  return (
    <>
      <PageHeader title="DASHBOARD" subtitle="Overview of system health and incident status">
        <GhostBtn><Plus size={10} className="inline mr-1.5 align-middle" />NEW INCIDENT</GhostBtn>
        <GhostBtn><RefreshCw size={10} className="inline mr-1.5 align-middle" />REFRESH</GhostBtn>
      </PageHeader>

      {/* STAT CARDS — 2 cols mobile, 4 cols desktop */}
      <div className="fade-up fade-up-1 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5">
        {[
          { label:"Total Incidents",    val:"24", trend:"↑ 12%", up:true,  Icon:Clock,         color:"#818cf8" },
          { label:"Active Incidents",   val:"3",  trend:"↓ 50%", up:false, Icon:AlertTriangle, color:"#ef4444" },
          { label:"Resolved Incidents", val:"21", trend:"↑ 32%", up:true,  Icon:CheckCircle,   color:"#22c55e" },
          { label:"Critical Incidents", val:"1",  trend:"—",     up:null,  Icon:Zap,           color:"#f97316" },
        ].map(({ label, val, trend, up, Icon, color }) => (
          <div key={label} className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-4 relative overflow-hidden transition-colors cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none" />
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${color}22` }}>
              <Icon size={14} strokeWidth={1.6} style={{ color }} />
            </div>
            <div className="font-bebas text-[36px] sm:text-[42px] leading-none tracking-[0.06em] text-white mb-1">{val}</div>
            <div className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/45 mb-2 leading-tight">{label}</div>
            <div className="font-barlow text-[10px] tracking-[0.1em]" style={{ color: up === true ? "#22c55e" : up === false ? "#ef4444" : "rgba(240,240,250,0.25)" }}>
              {trend}{up !== null && <span className="text-white/25 ml-1.5 text-[9px]">vs last wk</span>}
            </div>
          </div>
        ))}
      </div>

      {/* MID ROW — stacked on mobile/tablet, side-by-side on xl */}
      <div className="fade-up fade-up-2 grid grid-cols-1 xl:grid-cols-[1fr_270px] gap-3 mb-3.5">
        {/* ACTIVE INCIDENTS */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <span className="font-bebas text-[15px] tracking-[0.14em] text-white">ACTIVE INCIDENTS</span>
            <span className="font-barlow text-[9.5px] tracking-[0.14em] uppercase text-white/45 cursor-pointer hover:text-white/70 transition">View all →</span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["ID","TITLE","SERVICE","SEVERITY","STATUS","ASSIGNED"].map(h => (
                    <th key={h} className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/30 px-4 py-2.5 text-left border-b border-white/[0.07] bg-white/[0.02] font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INCIDENTS.map(inc => (
                  <tr key={inc.id} className="hover:bg-white/[0.025] transition-colors">
                    <td className="px-4 py-3 font-mono text-[10px] text-white/45">{inc.id}</td>
                    <td className="px-4 py-3 font-barlow text-[11px] tracking-[0.08em] text-white/78">{inc.title}</td>
                    <td className="px-4 py-3 font-barlow text-[10px] tracking-[0.08em] text-white/45">{inc.service}</td>
                    <td className="px-4 py-3"><Badge type={inc.severity}>{inc.severity}</Badge></td>
                    <td className="px-4 py-3"><Badge type={inc.status}>{inc.status}</Badge></td>
                    <td className="px-4 py-3">
                      <span className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[9px] font-semibold" style={{ background:`${inc.avatarColor}22`, color:inc.avatarColor, border:`1px solid ${inc.avatarColor}44` }}>
                        {inc.assignee}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile incident cards */}
          <div className="md:hidden divide-y divide-white/[0.04]">
            {INCIDENTS.map(inc => (
              <div key={inc.id} className="px-4 py-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-barlow text-[11px] tracking-[0.08em] text-white/85 mb-0.5">{inc.title}</div>
                    <div className="font-mono text-[9px] text-white/35">{inc.id} · {inc.service}</div>
                  </div>
                  <span className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[9px] font-semibold ml-2 flex-shrink-0" style={{ background:`${inc.avatarColor}22`, color:inc.avatarColor, border:`1px solid ${inc.avatarColor}44` }}>
                    {inc.assignee}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge type={inc.severity}>{inc.severity}</Badge>
                  <Badge type={inc.status}>{inc.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SYSTEM HEALTH */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <span className="font-bebas text-[15px] tracking-[0.14em] text-white">SYSTEM HEALTH</span>
            <span className="font-barlow text-[9.5px] tracking-[0.14em] uppercase text-white/45 cursor-pointer hover:text-white/70 transition">View all →</span>
          </div>
          {/* On mobile/tablet show as 2-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1">
            {SERVICES.map(svc => (
              <div key={svc.name} className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${svc.color}18` }}>
                    <IconComponent iconName={svc.Icon} />
                  </div>
                  <div>
                    <div className="font-barlow text-[10.5px] tracking-[0.1em] uppercase text-white mb-0.5">{svc.name}</div>
                    <div className="font-barlow text-[9px] tracking-[0.1em] text-white/45">{svc.uptime} uptime</div>
                  </div>
                </div>
                <Badge type={svc.status}>{svc.status.toUpperCase()}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="fade-up fade-up-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[auto_1fr_240px] gap-3">
        {/* SYSTEM METRICS */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors sm:col-span-2 xl:col-span-1 xl:w-[290px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <span className="font-bebas text-[15px] tracking-[0.14em] text-white">SYSTEM METRICS</span>
          </div>
          <div className="font-barlow text-[8.5px] tracking-[0.12em] uppercase text-white/28 px-4 py-2">Last updated: 2 mins ago</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-2 px-3 pb-3">
            {METRICS.map(m => (
              <div key={m.label} className="bg-white/[0.03] border border-white/[0.06] rounded-md p-2.5">
                <div className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/45 mb-1">{m.label}</div>
                <div className="font-bebas text-[24px] tracking-[0.08em] text-white leading-none mb-1.5">{m.val}</div>
                <Sparkline data={m.sparkline} color={m.color} />
              </div>
            ))}
          </div>
        </div>

        {/* CHART */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <span className="font-bebas text-[15px] tracking-[0.14em] text-white">INCIDENTS OVER TIME</span>
            <div className="flex gap-1">
              {["Daily","Weekly"].map(t => (
                <button key={t} onClick={() => setChartToggle(t)} className={`font-barlow text-[9px] tracking-[0.14em] uppercase px-3 py-1 rounded-full border cursor-pointer transition-all duration-200 ${chartToggle === t ? "bg-white/10 border-white/30 text-white" : "bg-white/[0.03] border-white/10 text-white/45 hover:text-white/70"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-4 px-4 py-2.5">
            {[{label:"Opened",color:"#ef4444"},{label:"Resolved",color:"#22c55e"}].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded-full inline-block" style={{ background: l.color }} />
                <span className="font-barlow text-[9px] tracking-[0.12em] uppercase text-white/45">{l.label}</span>
              </div>
            ))}
          </div>
          <div className="px-3 pb-3" style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_DATA} margin={{ top:5, right:10, left:-30, bottom:0 }}>
                <CartesianGrid stroke="rgba(240,240,250,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize:8, fill:"rgba(240,240,250,0.3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:8, fill:"rgba(240,240,250,0.3)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="opened"   name="Opened"   stroke="#ef4444" strokeWidth={1.8} dot={{ r:3, fill:"#ef4444", strokeWidth:0 }} activeDot={{ r:5 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={1.8} dot={{ r:3, fill:"#22c55e", strokeWidth:0 }} activeDot={{ r:5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI INSIGHT */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden flex flex-col transition-colors sm:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]">
            <Sparkles size={13} className="text-white" strokeWidth={1.5} />
            <span className="font-bebas text-[14px] tracking-[0.14em] text-white">AI INSIGHT</span>
            <span className="font-barlow bg-white/[0.08] border border-white/18 rounded-full text-[8px] tracking-[0.16em] uppercase text-white/25 px-2 py-0.5">BETA</span>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <p className="font-barlow text-[11.5px] tracking-[0.07em] text-white/68 leading-relaxed mb-4">
              High database latency incidents have increased by <strong className="text-white">40%</strong> in the last 7 days. Peak load detected 14:00–16:00 UTC daily.
            </p>
            <div className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/25 mb-1.5">Recommended Action</div>
            <p className="font-barlow text-[10.5px] tracking-[0.07em] text-white/50 leading-relaxed mb-4 flex-1">
              Check database connections and consider scaling read replicas. Review slow query logs for INC-1023.
            </p>
            <GhostBtn>VIEW FULL INSIGHT</GhostBtn>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardView;
