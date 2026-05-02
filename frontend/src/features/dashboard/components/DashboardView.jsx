import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Clock, AlertTriangle, CheckCircle, Zap, Plus, RefreshCw, Monitor,
  Sparkles, Loader2, Key, Code, ArrowRight
} from "lucide-react";
import PageHeader from './PageHeader';
import GhostBtn from './GhostBtn';
import Badge from './Badge';
import CustomTooltip from './CustomTooltip';
import dashboardService from '../../../services/dashboard.service.js';
import healthService from '../../../services/health.service.js';
import incidentService from '../../../services/incident.service.js';
import apikeyService from '../../../services/apikey.service.js';

const DashboardView = () => {
  const navigate = useNavigate();
  const [chartToggle, setChartToggle] = useState("Daily");
  const { user } = useSelector((state) => state.auth);

  // Live data state
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState(null);
  const [hasApiKeys, setHasApiKeys] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch live data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Refetch trends when toggle changes
  useEffect(() => {
    dashboardService.getTrends(chartToggle === "Weekly" ? 30 : 7)
      .then(res => setTrends(res?.data))
      .catch(() => {});
  }, [chartToggle]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [statsRes, trendsRes, healthRes, incRes, keysRes] = await Promise.allSettled([
        dashboardService.getStats(),
        dashboardService.getTrends(7),
        healthService.getAllHealth(),
        incidentService.getIncidents({ limit: 5, status: 'open' }),
        apikeyService.getKeys(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value?.data);
      if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value?.data);
      if (healthRes.status === 'fulfilled') setHealthData(healthRes.value?.data);
      if (incRes.status === 'fulfilled') {
        const incData = incRes.value?.data;
        setRecentIncidents(incData?.incidents || incData || []);
      }
      if (keysRes.status === 'fulfilled') {
        const keys = keysRes.value?.apiKeys || [];
        setHasApiKeys(keys.some(k => k.isActive));
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setDataLoading(false);
    }
  };

  // Derived display data
  const displayIncidents = recentIncidents || [];
  const displayServices = Array.isArray(healthData) ? healthData : [];
  const displayChart = trends?.length ? trends.map((t) => ({
    date: new Date(t.date || t._id).toLocaleDateString('en-US', { day: 'numeric' }),
    opened: t.opened || t.created || 0,
    resolved: t.resolved || 0,
  })) : [];

  const totalIncidents = stats?.totalIncidents ?? stats?.total ?? 0;
  const activeIncidents = stats?.activeIncidents ?? stats?.open ?? 0;
  const resolvedIncidents = stats?.resolvedIncidents ?? stats?.resolved ?? 0;
  const criticalIncidents = stats?.criticalIncidents ?? stats?.critical ?? 0;

  const severityColor = (severity) => {
    const map = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#3b82f6' };
    return map[severity] || '#818cf8';
  };

  return (
    <>
      <PageHeader title="DASHBOARD" subtitle="Overview of system health and incident status">
        <GhostBtn onClick={() => navigate('/incidents/create')}><Plus size={10} className="inline mr-1.5 align-middle" />NEW INCIDENT</GhostBtn>
        <GhostBtn onClick={fetchData}>
          {dataLoading ? <Loader2 size={10} className="inline mr-1.5 align-middle animate-spin" /> : <RefreshCw size={10} className="inline mr-1.5 align-middle" />}
          REFRESH
        </GhostBtn>
      </PageHeader>

      {/* ─── API Integration Banner ─── */}
      {hasApiKeys === false && (
        <div className="fade-up bg-[#0b0d18] border border-amber-500/20 rounded-lg p-5 mb-3.5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] to-transparent pointer-events-none" />
          <div className="relative flex items-start gap-4 flex-wrap sm:flex-nowrap">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <Code size={18} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bebas text-[16px] tracking-[0.1em] text-amber-400 mb-1">
                API NOT INTEGRATED YET
              </div>
              <p className="font-barlow text-[11px] tracking-[0.06em] text-white/50 leading-relaxed mb-3">
                No active API keys found. Generate an API key and integrate the OpsPulse SDK into your backend to start monitoring errors and incidents automatically.
              </p>
              <div className="font-barlow text-[9px] tracking-[0.14em] uppercase text-white/25 mb-3">
                QUICK START
              </div>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-3 mb-3 font-mono text-[10px] text-amber-300/80 leading-relaxed overflow-x-auto">
                <div className="text-white/25 mb-1">// Install the SDK</div>
                <div>npm install @opspulse/sdk</div>
                <div className="text-white/25 mt-2 mb-1">// Initialize in your app</div>
                <div>{`const ops = require('@opspulse/sdk');`}</div>
                <div>{`ops.init({ apiKey: 'YOUR_API_KEY' });`}</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <GhostBtn onClick={() => navigate('/dashboard')}>
                  <Key size={10} className="inline mr-1 align-middle" />GENERATE API KEY
                </GhostBtn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── STAT CARDS ─── */}
      <div className="fade-up fade-up-1 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5">
        {[
          { label:"Total Incidents",    val: totalIncidents,    Icon:Clock,         color:"#818cf8" },
          { label:"Active Incidents",   val: activeIncidents,   Icon:AlertTriangle, color:"#ef4444" },
          { label:"Resolved Incidents", val: resolvedIncidents, Icon:CheckCircle,   color:"#22c55e" },
          { label:"Critical Incidents", val: criticalIncidents, Icon:Zap,           color:"#f97316" },
        ].map(({ label, val, Icon, color }) => (
          <div key={label} className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-4 relative overflow-hidden transition-colors cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none" />
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${color}22` }}>
              <Icon size={14} strokeWidth={1.6} style={{ color }} />
            </div>
            <div className="font-bebas text-[36px] sm:text-[42px] leading-none tracking-[0.06em] text-white mb-1">{val}</div>
            <div className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/45 mb-2 leading-tight">{label}</div>
            {dataLoading && <div className="font-barlow text-[9px] text-white/20 animate-pulse">Loading...</div>}
          </div>
        ))}
      </div>

      {/* ─── MID ROW ─── */}
      <div className="fade-up fade-up-2 grid grid-cols-1 xl:grid-cols-[1fr_270px] gap-3 mb-3.5">
        {/* ACTIVE INCIDENTS */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <span className="font-bebas text-[15px] tracking-[0.14em] text-white">ACTIVE INCIDENTS</span>
            <span onClick={() => navigate('/incidents')} className="font-barlow text-[9.5px] tracking-[0.14em] uppercase text-white/45 cursor-pointer hover:text-white/70 transition">
              View all →
            </span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["TITLE","SERVICE","SEVERITY","STATUS","ASSIGNED"].map(h => (
                    <th key={h} className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/30 px-4 py-2.5 text-left border-b border-white/[0.07] bg-white/[0.02] font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataLoading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center"><Loader2 size={16} className="text-white/20 animate-spin mx-auto" /></td></tr>
                ) : displayIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center font-barlow text-[11px] text-white/30 tracking-[0.1em] uppercase">
                      No active incidents — all clear
                    </td>
                  </tr>
                ) : displayIncidents.map(inc => (
                  <tr key={inc._id || inc.id} className="hover:bg-white/[0.025] transition-colors cursor-pointer" onClick={() => navigate(`/incidents/${inc._id || inc.id}`)}>
                    <td className="px-4 py-3 font-barlow text-[11px] tracking-[0.08em] text-white/78">{inc.title}</td>
                    <td className="px-4 py-3 font-barlow text-[10px] tracking-[0.08em] text-white/45">{inc.service || '—'}</td>
                    <td className="px-4 py-3"><Badge type={inc.severity}>{inc.severity}</Badge></td>
                    <td className="px-4 py-3"><Badge type={inc.status}>{inc.status}</Badge></td>
                    <td className="px-4 py-3">
                      {inc.assignedTo?.length > 0 ? (
                        <span className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[9px] font-semibold" style={{ background: `${severityColor(inc.severity)}22`, color: severityColor(inc.severity), border: `1px solid ${severityColor(inc.severity)}44` }}>
                          {inc.assignedTo.length}
                        </span>
                      ) : (
                        <span className="font-barlow text-[9px] text-white/25">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/[0.04]">
            {dataLoading ? (
              <div className="px-4 py-8 text-center"><Loader2 size={16} className="text-white/20 animate-spin mx-auto" /></div>
            ) : displayIncidents.length === 0 ? (
              <div className="px-4 py-8 text-center font-barlow text-[11px] text-white/30 tracking-[0.1em] uppercase">No active incidents</div>
            ) : displayIncidents.map(inc => (
              <div key={inc._id || inc.id} className="px-4 py-3 cursor-pointer" onClick={() => navigate(`/incidents/${inc._id || inc.id}`)}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-barlow text-[11px] tracking-[0.08em] text-white/85 mb-0.5">{inc.title}</div>
                    <div className="font-mono text-[9px] text-white/35">{inc.service || ''}</div>
                  </div>
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1">
            {dataLoading ? (
              <div className="px-4 py-6 flex justify-center"><Loader2 size={16} className="text-white/20 animate-spin" /></div>
            ) : displayServices.length === 0 ? (
              <div className="px-4 py-6 font-barlow text-[10px] text-white/25 text-center tracking-[0.1em] uppercase">
                No services reporting health data yet
              </div>
            ) : displayServices.map(svc => {
              const svcName = svc.service || svc.name;
              const svcStatus = svc.status || 'unknown';
              const svcColor = svcStatus === 'up' ? '#22c55e' : svcStatus === 'down' ? '#ef4444' : svcStatus === 'degraded' ? '#f59e0b' : '#6b7280';
              return (
                <div key={svcName} className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${svcColor}18` }}>
                      <Monitor size={12} strokeWidth={1.6} style={{ color: svcColor }} />
                    </div>
                    <div>
                      <div className="font-barlow text-[10.5px] tracking-[0.1em] uppercase text-white mb-0.5">{svcName}</div>
                      <div className="font-barlow text-[9px] tracking-[0.1em] text-white/45">
                        {svc.metrics?.uptime ? `${svc.metrics.uptime}% uptime` : '—'}
                      </div>
                    </div>
                  </div>
                  <Badge type={svcStatus}>{svcStatus.toUpperCase()}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── BOTTOM ROW ─── */}
      <div className="fade-up fade-up-3 grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-3">
        {/* CHART */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden transition-colors">
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
          <div className="px-3 pb-3" style={{ height: 180 }}>
            {displayChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayChart} margin={{ top:5, right:10, left:-30, bottom:0 }}>
                  <CartesianGrid stroke="rgba(240,240,250,0.05)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize:8, fill:"rgba(240,240,250,0.3)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:8, fill:"rgba(240,240,250,0.3)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="opened" name="Opened" stroke="#ef4444" strokeWidth={1.8} dot={{ r:3, fill:"#ef4444", strokeWidth:0 }} activeDot={{ r:5 }} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={1.8} dot={{ r:3, fill:"#22c55e", strokeWidth:0 }} activeDot={{ r:5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="font-barlow text-[10px] text-white/20 tracking-[0.12em] uppercase">
                    {dataLoading ? 'Loading chart data...' : 'No incident trend data yet'}
                  </div>
                  <div className="font-barlow text-[9px] text-white/12 mt-1">
                    Trends appear as incidents are created and resolved
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI INSIGHT */}
        <div className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.12] rounded-lg overflow-hidden flex flex-col transition-colors">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]">
            <Sparkles size={13} className="text-white" strokeWidth={1.5} />
            <span className="font-bebas text-[14px] tracking-[0.14em] text-white">AI INSIGHT</span>
            <span className="font-barlow bg-white/[0.08] border border-white/18 rounded-full text-[8px] tracking-[0.16em] uppercase text-white/25 px-2 py-0.5">BETA</span>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <p className="font-barlow text-[11.5px] tracking-[0.07em] text-white/68 leading-relaxed mb-4">
              {activeIncidents > 0
                ? `There ${activeIncidents === 1 ? 'is' : 'are'} currently ${activeIncidents} active incident${activeIncidents !== 1 ? 's' : ''} requiring attention. The assignment engine is matching responders based on skills.`
                : 'All systems are operating normally. No active incidents detected. The AI engine is continuously monitoring for errors.'}
            </p>
            <div className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/25 mb-1.5">Recommended Action</div>
            <p className="font-barlow text-[10.5px] tracking-[0.07em] text-white/50 leading-relaxed mb-4 flex-1">
              {hasApiKeys === false
                ? 'Generate an API key and integrate OpsPulse into your backend to enable automatic error monitoring.'
                : activeIncidents > 0
                ? 'Review active incidents and ensure team members have updated their skills for accurate auto-assignment.'
                : 'Ensure team members have updated their profiles with skills to improve future incident routing.'}
            </p>
            <GhostBtn onClick={() => navigate(hasApiKeys === false ? '/dashboard' : '/incidents')}>
              {hasApiKeys === false ? 'SETUP API KEY' : 'VIEW INCIDENTS'}
            </GhostBtn>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardView;
