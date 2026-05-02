/**
 * Dashboard Constants
 * Only structural/UI constants — NO mock/dummy data.
 * All data is fetched from APIs.
 */

/** Sidebar navigation items */
export const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard",    Icon:"LayoutDashboard", group:"MAIN"      },
  { id:"incidents", label:"Incidents",    Icon:"Clock",           group:"MAIN"      },
  { id:"users",     label:"Team Members", Icon:"Users",           group:"SYSTEM"    },
  { id:"apikeys",   label:"API Keys",     Icon:"Key",             group:"SYSTEM"    },
  { id:"settings",  label:"Profile",      Icon:"Settings",        group:"SYSTEM"    },
];
