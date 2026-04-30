import { useState } from "react";
import { Plus, Eye, EyeOff } from "lucide-react";
import { INITIAL_KEYS } from '../dashboard.constants';
import PageHeader from './PageHeader';
import GhostBtn from './GhostBtn';
import Badge from './Badge';

const maskKey = (k) => k.substring(0, 10) + "••••••" + k.slice(-4);

const ApiKeysView = () => {
  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPerm, setNewPerm] = useState("full");
  const [nextId, setNextId] = useState(5);

  const toggleVisible = (id) => setKeys(ks => ks.map(k => k.id === id && k.active ? {...k, visible:!k.visible} : k));
  const revokeKey = (id) => setKeys(ks => ks.map(k => k.id === id ? {...k, active:false, visible:false} : k));
  const createKey = () => {
    if (!newName.trim()) return;
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const raw = "ops_k" + nextId + "_" + Array.from({length:28}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
    setKeys(ks => [{ id:nextId, name:newName.trim(), key:raw, perm:newPerm, created:"Just now", lastUsed:"Never", active:true, visible:true }, ...ks]);
    setNextId(n => n+1); setNewName(""); setShowCreate(false);
  };

  const permLabel = { full:"Full Access", read:"Read Only", write:"Write Only" };

  return (
    <>
      <PageHeader title="API KEYS" subtitle="Manage authentication keys for API access">
        <GhostBtn onClick={() => setShowCreate(s => !s)}>
          <Plus size={10} className="inline mr-1.5 align-middle" />GENERATE KEY
        </GhostBtn>
      </PageHeader>

      {showCreate && (
        <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-4 mb-3.5 fade-up">
          <div className="font-bebas text-[14px] tracking-[0.14em] text-white mb-4">GENERATE NEW API KEY</div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div>
              <div className="font-barlow text-[9px] tracking-[0.2em] uppercase text-white/25 mb-1.5">Key Name</div>
              <input
                className="w-full bg-white/[0.05] border border-white/15 rounded-md px-3 py-2 font-barlow text-[11px] tracking-[0.1em] text-white outline-none focus:border-white/35 transition-colors placeholder:text-white/25"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Production App"
                onKeyDown={e => e.key === "Enter" && createKey()}
              />
            </div>
            <div>
              <div className="font-barlow text-[9px] tracking-[0.2em] uppercase text-white/25 mb-1.5">Permissions</div>
              <select
                className="w-full bg-[#0b0d18] border border-white/15 rounded-md px-3 py-2 font-barlow text-[11px] tracking-[0.1em] text-white outline-none"
                value={newPerm}
                onChange={e => setNewPerm(e.target.value)}
              >
                <option value="full">Full Access</option>
                <option value="read">Read Only</option>
                <option value="write">Write Only</option>
              </select>
            </div>
            <div className="flex gap-2">
              <GhostBtn onClick={createKey}>CREATE</GhostBtn>
              <GhostBtn onClick={() => setShowCreate(false)}>CANCEL</GhostBtn>
            </div>
          </div>
        </div>
      )}

      {/* Desktop table */}
      <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg overflow-hidden fade-up fade-up-1">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["NAME","API KEY","PERMISSIONS","CREATED","LAST USED","STATUS","ACTIONS"].map(h => (
                  <th key={h} className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/30 px-4 py-2.5 text-left border-b border-white/[0.07] bg-white/[0.02] font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map(k => (
                <tr key={k.id} style={{ opacity: k.active ? 1 : 0.45 }} className="hover:bg-white/[0.025] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-barlow text-[11.5px] tracking-[0.1em] uppercase text-white">{k.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] text-white/55 tracking-[0.1em] bg-white/[0.05] px-2.5 py-1 rounded border border-white/[0.08] whitespace-nowrap">
                      {k.visible ? k.key : maskKey(k.key)}
                    </span>
                  </td>
                  <td className="px-4 py-3"><Badge type={k.perm}>{permLabel[k.perm]}</Badge></td>
                  <td className="px-4 py-3 font-barlow text-[10.5px] text-white/45">{k.created}</td>
                  <td className="px-4 py-3 font-barlow text-[10.5px] text-white/45">{k.lastUsed}</td>
                  <td className="px-4 py-3">
                    {k.active
                      ? <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" /><span className="font-barlow text-[9.5px] tracking-[0.12em] uppercase text-green-400">Active</span></div>
                      : <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block" /><span className="font-barlow text-[9.5px] tracking-[0.12em] uppercase text-white/25">Revoked</span></div>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      {k.active && (
                        <button onClick={() => toggleVisible(k.id)} className="w-7 h-7 rounded-md flex items-center justify-center border border-white/12 bg-white/[0.04] hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer">
                          {k.visible ? <EyeOff size={12} className="text-white/70" strokeWidth={1.6}/> : <Eye size={12} className="text-white/70" strokeWidth={1.6}/>}
                        </button>
                      )}
                      {k.active
                        ? <GhostBtn onClick={() => revokeKey(k.id)} danger>REVOKE</GhostBtn>
                        : <span className="font-barlow text-[9px] uppercase text-white/20 px-2">—</span>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile / tablet card layout */}
        <div className="lg:hidden divide-y divide-white/[0.04]">
          {keys.map(k => (
            <div key={k.id} className="p-4" style={{ opacity: k.active ? 1 : 0.5 }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-barlow text-[12px] tracking-[0.1em] uppercase text-white mb-1">{k.name}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge type={k.perm}>{permLabel[k.perm]}</Badge>
                    {k.active
                      ? <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" /><span className="font-barlow text-[9px] tracking-widest uppercase text-green-400">Active</span></div>
                      : <span className="font-barlow text-[9px] tracking-widest uppercase text-white/25">Revoked</span>
                    }
                  </div>
                </div>
                <div className="flex gap-1.5 ml-3">
                  {k.active && (
                    <button onClick={() => toggleVisible(k.id)} className="w-7 h-7 rounded-md flex items-center justify-center border border-white/12 bg-white/[0.04] hover:bg-white/10 transition cursor-pointer">
                      {k.visible ? <EyeOff size={11} className="text-white/70" strokeWidth={1.6}/> : <Eye size={11} className="text-white/70" strokeWidth={1.6}/>}
                    </button>
                  )}
                  {k.active && <GhostBtn onClick={() => revokeKey(k.id)} danger>REVOKE</GhostBtn>}
                </div>
              </div>
              <div className="font-mono text-[9.5px] text-white/45 tracking-wider bg-white/[0.04] border border-white/[0.07] rounded px-2.5 py-1.5 mb-2 break-all">
                {k.visible ? k.key : maskKey(k.key)}
              </div>
              <div className="flex gap-4 font-barlow text-[9px] tracking-wider text-white/30 uppercase">
                <span>Created {k.created}</span>
                <span>Used {k.lastUsed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ApiKeysView;
