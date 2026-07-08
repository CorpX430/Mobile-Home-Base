import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'investors' | 'deposits' | 'credit' | 'addresses'>('investors');

  const [investors, setInvestors] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([{coin: 'BTC', address: ''}, {coin: 'ETH', address: ''}, {coin: 'DOGE', address: ''}]);
  const [newCoin, setNewCoin] = useState('');
  const [newAddress, setNewAddress] = useState('');
  
  // Credit state
  const [creditUser, setCreditUser] = useState('');
  const [creditShares, setCreditShares] = useState('');
  const [creditPrice, setCreditPrice] = useState('147.62');

  const fetchInvestors = async () => {
    try {
      const res = await fetch('/api/admin/investors', { headers: { 'x-admin-password': password } });
      if (res.ok) {
        const data = await res.json();
        setInvestors(data);
      }
    } catch (e) { }
  };

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/admin/deposits', { headers: { 'x-admin-password': password } });
      if (res.ok) {
        const data = await res.json();
        setDeposits(data);
      }
    } catch (e) { }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/deposit-addresses');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length) setAddresses(data);
      }
    } catch (e) {}
  };

  const authenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/investors', {
        headers: { 'x-admin-password': password }
      });
      if (res.ok) {
        const data = await res.json();
        setInvestors(data);
        setIsAuthenticated(true);
        toast.success("Authenticated successfully");
        fetchDeposits();
        fetchAddresses();
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isAuthenticated) {
      if (activeTab === 'investors') fetchInvestors();
      if (activeTab === 'deposits') {
        fetchDeposits();
        interval = setInterval(fetchDeposits, 30000);
      }
      if (activeTab === 'addresses') fetchAddresses();
      if (activeTab === 'credit') fetchInvestors();
    }
    return () => clearInterval(interval);
  }, [activeTab, isAuthenticated]);

  const updateInvestorStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/investors/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Investor ${status}`);
        fetchInvestors();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const updateDepositStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/deposits/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Deposit ${status}`);
        fetchDeposits();
      } else {
        toast.error("Failed to update deposit");
      }
    } catch (error) {
      toast.error("Failed to update deposit");
    }
  };

  const handleCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditUser || !creditShares || !creditPrice) return;
    try {
      const res = await fetch(`/api/admin/investors/${creditUser}/credit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ shares: parseFloat(creditShares), pricePerShare: parseFloat(creditPrice) })
      });
      if (res.ok) {
        toast.success('Successfully credited shares');
        setCreditShares('');
        fetchInvestors();
      } else {
        toast.error("Failed to credit");
      }
    } catch (e) {
      toast.error("Failed to credit");
    }
  };

  const handleSaveAddress = async (coin: string, newAddress: string) => {
    try {
      const res = await fetch(`/api/admin/deposit-addresses/${coin}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ address: newAddress })
      });
      if (res.ok) {
        toast.success(`${coin} address updated`);
        fetchAddresses();
      } else {
        toast.error("Failed to update address");
      }
    } catch (e) {
      toast.error("Failed to update address");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] bg-[#050a0f] text-white flex flex-col justify-center items-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-xs text-white/50 font-display tracking-[0.3em] uppercase mb-4">Admin</div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-widest">SPCX Market</h1>
          </div>
          <form onSubmit={authenticate} className="space-y-6">
            <input
              type="password"
              placeholder="ADMIN PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/30 text-white placeholder:text-white/40 px-6 py-4 focus:outline-none focus:border-white/80 focus:bg-white/5 transition-all font-display tracking-widest uppercase"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-display font-bold text-xl tracking-[0.2em] uppercase py-4 hover:bg-white/90 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isLoading ? "Checking..." : "Authenticate"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'investors', label: 'Investors' },
    { id: 'deposits', label: 'Deposits' },
    { id: 'credit', label: 'Credit User' },
    { id: 'addresses', label: 'Deposit Addresses' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#050a0f] text-white p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-widest mb-1">Admin Panel</h1>
            <p className="text-sm text-white/50 font-display tracking-wider uppercase">SPCX MARKET, inc</p>
          </div>
          <button 
            onClick={() => { setIsAuthenticated(false); setPassword(''); setInvestors([]); }}
            className="self-start sm:self-auto text-sm text-white/50 hover:text-white font-display tracking-widest uppercase border border-white/20 px-4 py-2 hover:bg-white/5 transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </header>

        <div className="flex gap-2 overflow-x-auto border-b border-white/10 mb-8 pb-px scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-6 py-3 font-display tracking-widest uppercase text-sm border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === t.id ? 'border-[#1a8a4a] text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-[#0a0f14] border border-white/10 rounded-lg overflow-hidden min-h-[400px]">
          {activeTab === 'investors' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 font-display tracking-widest uppercase text-xs bg-white/[0.02]">
                    <th className="py-3 px-4 font-normal">Name</th>
                    <th className="py-3 px-4 font-normal">Email</th>
                    <th className="py-3 px-4 font-normal">Shares</th>
                    <th className="py-3 px-4 font-normal">Status</th>
                    <th className="py-3 px-4 font-normal">Date</th>
                    <th className="py-3 px-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investors.map((inv) => (
                    <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-medium text-sm">{inv.fullName}</td>
                      <td className="py-4 px-4 text-white/70 text-sm">{inv.email}</td>
                      <td className="py-4 px-4 font-display tracking-wider">{parseFloat(inv.shares || '0').toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-display font-bold tracking-widest uppercase border ${
                          inv.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          inv.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white/50 text-xs font-display tracking-wider">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateInvestorStatus(inv.id, 'approved')} disabled={inv.status === 'approved'} className="text-[10px] font-display font-bold tracking-widest uppercase px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors cursor-pointer rounded">Approve</button>
                          <button onClick={() => updateInvestorStatus(inv.id, 'rejected')} disabled={inv.status === 'rejected'} className="text-[10px] font-display font-bold tracking-widest uppercase px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30 transition-colors cursor-pointer rounded">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {investors.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-white/50 font-display tracking-widest uppercase text-sm">No investors found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'deposits' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 font-display tracking-widest uppercase text-xs bg-white/[0.02]">
                    <th className="py-3 px-4 font-normal">Name / Email</th>
                    <th className="py-3 px-4 font-normal">Amount</th>
                    <th className="py-3 px-4 font-normal">Method</th>
                    <th className="py-3 px-4 font-normal">Status</th>
                    <th className="py-3 px-4 font-normal">Date</th>
                    <th className="py-3 px-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((d) => (
                    <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 text-sm">
                        <div className="font-medium">{d.fullName}</div>
                        <div className="text-xs text-white/50">{d.email}</div>
                      </td>
                      <td className="py-4 px-4 font-display font-bold tracking-wider">${parseFloat(d.amount).toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-display tracking-widest uppercase">{d.method}</span>
                          {d.coin && <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-display tracking-widest text-white/70">{d.coin}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-display font-bold tracking-widest uppercase border ${
                          d.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          d.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white/50 text-xs font-display tracking-wider">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-right">
                         <div className="flex justify-end gap-2">
                          <button onClick={() => updateDepositStatus(d.id, 'completed')} disabled={d.status === 'completed'} className="text-[10px] font-display font-bold tracking-widest uppercase px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors cursor-pointer rounded">Complete</button>
                          <button onClick={() => updateDepositStatus(d.id, 'failed')} disabled={d.status === 'failed'} className="text-[10px] font-display font-bold tracking-widest uppercase px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30 transition-colors cursor-pointer rounded">Fail</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {deposits.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-white/50 font-display tracking-widest uppercase text-sm">No deposits found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'credit' && (
            <div className="p-8 max-w-xl mx-auto">
              <h2 className="text-xl font-bold font-display uppercase tracking-widest mb-6">Credit User Account</h2>
              <form onSubmit={handleCredit} className="space-y-6">
                <div>
                  <label className="block text-xs text-white/50 font-display tracking-widest uppercase mb-2">Select Investor</label>
                  <select 
                    value={creditUser} 
                    onChange={e => setCreditUser(e.target.value)}
                    className="w-full bg-[#111827] border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#1a8a4a] text-sm"
                    required
                  >
                    <option value="" disabled>Select an investor...</option>
                    {investors.filter(i => i.status === 'approved').map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.fullName} ({inv.email})</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-white/50 font-display tracking-widest uppercase mb-2">Shares to Credit</label>
                    <input 
                      type="number" step="any" min="0.0001"
                      value={creditShares} onChange={e => setCreditShares(e.target.value)}
                      className="w-full bg-[#111827] border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#1a8a4a] text-sm font-display tracking-wider"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-white/50 font-display tracking-widest uppercase mb-2">Price Per Share ($)</label>
                    <input 
                      type="number" step="any" min="0.01"
                      value={creditPrice} onChange={e => setCreditPrice(e.target.value)}
                      className="w-full bg-[#111827] border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#1a8a4a] text-sm font-display tracking-wider"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#1a8a4a] hover:bg-[#1a9a52] text-white font-display font-bold tracking-widest uppercase py-3 rounded transition-colors cursor-pointer mt-4">
                  Credit Shares
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="p-8">
              <h2 className="text-xl font-bold font-display uppercase tracking-widest mb-6">Manage Crypto Addresses</h2>
              
              <div className="bg-[#111827] border border-white/10 rounded-lg p-6 mb-8 max-w-3xl">
                <h3 className="text-sm font-bold font-display uppercase tracking-widest mb-4">Add New Asset</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <input 
                    type="text"
                    placeholder="COIN (e.g. USDT, SOL)"
                    value={newCoin}
                    onChange={e => setNewCoin(e.target.value.toUpperCase())}
                    className="flex-1 bg-black/50 border border-white/20 rounded px-4 py-2 text-sm font-display tracking-widest uppercase focus:outline-none focus:border-[#1a8a4a]"
                  />
                  <input 
                    type="text"
                    placeholder="WALLET ADDRESS"
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    className="flex-[2] bg-black/50 border border-white/20 rounded px-4 py-2 text-sm font-mono focus:outline-none focus:border-[#1a8a4a]"
                  />
                  <button 
                    onClick={() => {
                      if (newCoin && newAddress) {
                        handleSaveAddress(newCoin, newAddress);
                        setNewCoin('');
                        setNewAddress('');
                      } else {
                        toast.error("Enter both coin name and address");
                      }
                    }}
                    className="bg-[#1a8a4a] hover:bg-[#1a9a52] px-6 py-2 font-display font-bold tracking-widest uppercase rounded cursor-pointer transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-w-3xl">
                {addresses.map(addrObj => (
                  <div key={addrObj.coin} className="bg-[#111827] border border-white/10 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="w-24 font-display font-bold tracking-widest text-lg">{addrObj.coin}</div>
                    <input 
                      type="text"
                      defaultValue={addrObj.address}
                      placeholder={`Enter ${addrObj.coin} address`}
                      className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-2 text-sm font-mono text-white/80 w-full focus:outline-none focus:border-white/50"
                      onBlur={e => {
                        if (e.target.value !== addrObj.address) {
                          handleSaveAddress(addrObj.coin, e.target.value);
                        }
                      }}
                    />
                    <button 
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleSaveAddress(addrObj.coin, input.value);
                      }}
                      className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 font-display tracking-widest uppercase rounded cursor-pointer transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}