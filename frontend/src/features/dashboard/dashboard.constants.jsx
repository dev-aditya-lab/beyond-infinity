export const INITIAL_KEYS = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'pk_live_1234567890abcdef',
    created: '2024-01-15',
    lastUsed: '2024-03-10',
    active: true,
    visible: false,
    usage: 1250
  },
  {
    id: '2', 
    name: 'Development API Key',
    key: 'pk_test_0987654321fedcba',
    created: '2024-02-20',
    lastUsed: '2024-03-12',
    active: true,
    visible: false,
    usage: 450
  },
  {
    id: '3',
    name: 'Staging API Key',
    key: 'pk_staging_abcdef123456789',
    created: '2023-12-10',
    lastUsed: '2024-01-05',
    active: false,
    visible: false,
    usage: 89
  }
];

export const DASHBOARD_VIEWS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' },
  { id: 'settings', label: 'Settings', icon: 'cog' }
];

export const STATS_DATA = [
  { label: 'Total Requests', value: '1.2M', change: '+12%', trend: 'up' },
  { label: 'Active Keys', value: '2', change: '0%', trend: 'stable' },
  { label: 'Success Rate', value: '99.8%', change: '+0.2%', trend: 'up' },
  { label: 'Avg Response', value: '124ms', change: '-8ms', trend: 'down' }
];

export const CHART_DATA = [
  { date: "18", opened: 8,  resolved: 5  },
  { date: "19", opened: 14, resolved: 8  },
  { date: "20", opened: 10, resolved: 9  },
  { date: "21", opened: 18, resolved: 11 },
  { date: "22", opened: 12, resolved: 14 },
  { date: "23", opened: 16, resolved: 13 },
  { date: "24", opened: 9,  resolved: 17 },
];

export const INCIDENTS = [
  { id:"INC-1024", title:"Payment Gateway Failure",  service:"Payment Service", severity:"critical",  status:"investigating", assignee:"RS", avatarColor:"#ef4444" },
  { id:"INC-1023", title:"Database Latency High",    service:"Database",        severity:"high",      status:"identified",    assignee:"DK", avatarColor:"#3b82f6" },
  { id:"INC-1022", title:"API Timeout Errors",       service:"API Service",     severity:"medium",    status:"monitoring",    assignee:"PJ", avatarColor:"#22c55e" },
];

export const SERVICES = [
  { name:"API Service",     uptime:"99.9%", status:"up",       Icon:"Monitor",    color:"#3b82f6" },
  { name:"Database",        uptime:"99.2%", status:"down",     Icon:"Database",   color:"#ef4444" },
  { name:"Auth Service",    uptime:"100%",  status:"up",       Icon:"Shield",     color:"#22c55e" },
  { name:"Payment Service", uptime:"98.7%", status:"degraded", Icon:"CreditCard", color:"#f59e0b" },
  { name:"Frontend",        uptime:"100%",  status:"up",       Icon:"Monitor",    color:"#22c55e" },
];

export const METRICS = [
  { label:"CPU",     val:"72%",   color:"#3b82f6", sparkline:[24,20,26,14,18,10,15,8,12,6,9]  },
  { label:"Memory",  val:"65%",   color:"#818cf8", sparkline:[20,18,22,16,20,14,18,12,16,14,11] },
  { label:"Disk",    val:"48%",   color:"#22c55e", sparkline:[22,22,20,20,18,18,16,16,15,14,14] },
  { label:"DB Resp", val:"120ms", color:"#f59e0b", sparkline:[14,18,12,20,14,22,16,24,18,26,20] },
];

export const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard",   Icon:"LayoutDashboard", group:"MAIN"      },
  { id:"incidents", label:"Incidents",   Icon:"Clock",           group:"MAIN"      },
  { id:"services",  label:"Services",    Icon:"Server",          group:"MAIN"      },
  { id:"alerts",    label:"Alerts",      Icon:"Bell",            group:"MAIN"      },
  { id:"timeline",  label:"Timeline",    Icon:"AlignLeft",       group:"MAIN"      },
  { id:"reports",   label:"Reports",     Icon:"BarChart2",       group:"ANALYTICS" },
  { id:"ai",        label:"AI Insights", Icon:"Sparkles",        group:"ANALYTICS" },
  { id:"users",     label:"Users",       Icon:"Users",           group:"SYSTEM"    },
  { id:"apikeys",   label:"API Keys",    Icon:"Key",             group:"SYSTEM"    },
  { id:"settings",  label:"Settings",    Icon:"Settings",        group:"SYSTEM"    },
];
