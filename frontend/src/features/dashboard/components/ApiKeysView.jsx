import { useState, useEffect } from "react";
import { Plus, Eye, EyeOff, Loader2, Copy, Check } from "lucide-react";
import PageHeader from './PageHeader';
import GhostBtn from './GhostBtn';
import Badge from './Badge';
import apikeyService from '../../../services/apikey.service.js';

const maskKey = (k) => {
  if (!k || k.length < 14) return k || '••••••';
  return k.substring(0, 10) + "••••••" + k.slice(-4);
};

const ApiKeysView = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState(new Set());

  // Fetch keys from backend
  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await apikeyService.getKeys();
      setKeys(res.apiKeys || []);
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisible = (id) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const revokeKey = async (id) => {
    if (!confirm('Revoke this API key? This action cannot be undone.')) return;
    try {
      await apikeyService.revokeKey(id);
      setKeys((ks) => ks.map((k) => (k._id === id ? { ...k, isActive: false } : k)));
    } catch (err) {
      alert(err.message || 'Failed to revoke key');
    }
  };

  const createKey = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await apikeyService.createKey({ name: newName.trim() });
      // The response includes the raw key (shown only once)
      setNewlyCreatedKey(res.APIkey);
      // Add to list
      if (res.apiKey) {
        setKeys((ks) => [{ ...res.apiKey, isActive: true }, ...ks]);
      }
      setNewName("");
      setShowCreate(false);
    } catch (err) {
      alert(err.message || 'Failed to create key');
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <>
      <PageHeader title="API KEYS" subtitle="Manage authentication keys for API access">
        <GhostBtn onClick={() => setShowCreate(s => !s)}>
          <Plus size={10} className="inline mr-1.5 align-middle" />GENERATE KEY
        </GhostBtn>
      </PageHeader>

      {/* Newly created key warning */}
      {newlyCreatedKey && (
        <div className="bg-[#0b0d18] border border-green-500/30 rounded-lg p-4 mb-3.5 fade-up">
          <div className="font-bebas text-[14px] tracking-[0.14em] text-green-400 mb-2">⚠️ NEW API KEY CREATED</div>
          <div className="font-barlow text-[10px] text-white/50 mb-3 tracking-[0.1em] uppercase">
            Copy this key now. It won't be shown again for security reasons.
          </div>
          <div className="flex items-center gap-2">
            <code className="font-mono text-[11px] text-green-300 bg-green-500/10 px-3 py-2 rounded border border-green-500/20 flex-1 break-all">
              {newlyCreatedKey}
            </code>
            <button
              onClick={() => copyToClipboard(newlyCreatedKey, 'new')}
              className="w-8 h-8 rounded-md flex items-center justify-center border border-green-500/20 bg-green-500/10 hover:bg-green-500/20 transition cursor-pointer"
            >
              {copiedId === 'new' ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-green-400" />}
            </button>
          </div>
          <button
            onClick={() => setNewlyCreatedKey(null)}
            className="font-barlow text-[9px] tracking-[0.14em] uppercase text-white/30 hover:text-white/60 mt-3 cursor-pointer bg-transparent border-none transition"
          >
            DISMISS
          </button>
        </div>
      )}

      {showCreate && (
        <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-4 mb-3.5 fade-up">
          <div className="font-bebas text-[14px] tracking-[0.14em] text-white mb-4">GENERATE NEW API KEY</div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
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
            <div className="flex gap-2">
              <GhostBtn onClick={createKey} disabled={creating}>
                {creating ? <Loader2 size={10} className="inline mr-1 animate-spin" /> : null}
                {creating ? 'CREATING...' : 'CREATE'}
              </GhostBtn>
              <GhostBtn onClick={() => setShowCreate(false)}>CANCEL</GhostBtn>
            </div>
          </div>
        </div>
      )}

      {/* Keys Table */}
      <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg overflow-hidden fade-up fade-up-1">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={20} className="text-white/30 animate-spin" />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["NAME","KEY PREFIX","KEY ID","CREATED","LAST USED","STATUS","ACTIONS"].map(h => (
                      <th key={h} className="font-barlow text-[8.5px] tracking-[0.2em] uppercase text-white/30 px-4 py-2.5 text-left border-b border-white/[0.07] bg-white/[0.02] font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {keys.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center font-barlow text-[11px] text-white/30 tracking-[0.1em] uppercase">
                        No API keys created yet
                      </td>
                    </tr>
                  ) : keys.map(k => (
                    <tr key={k._id} style={{ opacity: k.isActive ? 1 : 0.45 }} className="hover:bg-white/[0.025] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-barlow text-[11.5px] tracking-[0.1em] uppercase text-white">{k.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-white/55 tracking-[0.1em] bg-white/[0.05] px-2.5 py-1 rounded border border-white/[0.08] whitespace-nowrap">
                          {k.prefix || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-white/40">{k.keyId || '—'}</span>
                      </td>
                      <td className="px-4 py-3 font-barlow text-[10.5px] text-white/45">
                        {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 font-barlow text-[10.5px] text-white/45">
                        {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-4 py-3">
                        {k.isActive
                          ? <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" /><span className="font-barlow text-[9.5px] tracking-[0.12em] uppercase text-green-400">Active</span></div>
                          : <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block" /><span className="font-barlow text-[9.5px] tracking-[0.12em] uppercase text-white/25">Revoked</span></div>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 items-center">
                          {k.isActive
                            ? <GhostBtn onClick={() => revokeKey(k._id)} danger>REVOKE</GhostBtn>
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
              {keys.length === 0 ? (
                <div className="p-8 text-center font-barlow text-[11px] text-white/30 tracking-[0.1em] uppercase">
                  No API keys created yet
                </div>
              ) : keys.map(k => (
                <div key={k._id} className="p-4" style={{ opacity: k.isActive ? 1 : 0.5 }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-barlow text-[12px] tracking-[0.1em] uppercase text-white mb-1">{k.name}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {k.isActive
                          ? <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" /><span className="font-barlow text-[9px] tracking-widest uppercase text-green-400">Active</span></div>
                          : <span className="font-barlow text-[9px] tracking-widest uppercase text-white/25">Revoked</span>
                        }
                      </div>
                    </div>
                    <div className="flex gap-1.5 ml-3">
                      {k.isActive && <GhostBtn onClick={() => revokeKey(k._id)} danger>REVOKE</GhostBtn>}
                    </div>
                  </div>
                  <div className="font-mono text-[9.5px] text-white/45 tracking-wider bg-white/[0.04] border border-white/[0.07] rounded px-2.5 py-1.5 mb-2">
                    Prefix: {k.prefix || '—'} | ID: {k.keyId || '—'}
                  </div>
                  <div className="flex gap-4 font-barlow text-[9px] tracking-wider text-white/30 uppercase">
                    <span>Created {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : '—'}</span>
                    <span>Used {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ApiKeysView;
