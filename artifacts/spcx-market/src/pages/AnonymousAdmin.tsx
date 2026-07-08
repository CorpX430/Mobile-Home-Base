import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { BarChart3, Users, DollarSign, TrendingUp, Search, Download, Filter, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

export default function AnonymousAdmin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'investors' | 'deposits' | 'credit' | 'addresses' | 'settings'>('dashboard');
  const [showPassword, setShowPassword] = useState(false);

  const [investors, setInvestors] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [creditUser, setCreditUser] = useState('');
  const [creditShares, setCreditShares] = useState('');
  const [creditPrice, setCreditPrice] = useState('147.62');

  const [newCoin, setNewCoin] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const [stats, setStats] = useState({
    totalInvestors: 0,
    approvedInvestors: 0,
    pendingInvestors: 0,
    totalDeposits: 0,
    totalCapital: 0,
  });

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
        fetchAllData();
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [investorsRes, depositsRes, addressesRes, statsRes] = await Promise.all([
        fetch('/api/admin/investors', { headers: { 'x-admin-password': password } }),
        fetch('/api/admin/deposits', { headers: { 'x-admin-password': password } }),
        fetch('/api/admin/deposit-addresses', { headers: { 'x-admin-password': password } }),
        fetch('/api/investors/stats', { headers: { 'x-admin-password': password } })
      ]);

      if (investorsRes.ok) setInvestors(await investorsRes.json());
      if (depositsRes.ok) setDeposits(await depositsRes.json());
      if (addressesRes.ok) setAddresses(await addressesRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) {
      console.error('Failed to fetch data:', e);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isAuthenticated) {
      fetchAllData();
      interval = setInterval(fetchAllData, 30000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const updateInvestorStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/investors/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Investor ${status}`);
        fetchAllData();
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
        fetchAllData();
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
        fetchAllData();
      } else {
        toast.error("Failed to credit");
      }
    } catch (e) {
      toast.error("Failed to credit");
    }
  };

  const handleSaveAddress = async (coin: string, address: string) => {
    try {
      const res = await fetch(`/api/admin/deposit-addresses/${coin}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ address })
      });
      if (res.ok) {
        toast.success(`${coin} address updated`);
        fetchAllData();
      } else {
        toast.error("Failed to update address");
      }
    } catch (e) {
      toast.error("Failed to update address");
    }
  };

  const filteredInvestors = investors.filter(inv => {
    const matchesSearch = inv.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#050a0f] to-[#0a0f14] text-white flex flex-col justify-center items-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-[#1a8a4a]/10 rounded-lg mb-6">
              <BarChart3 className="w-8 h-8 text-[#1a8a4a]" />
            </div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-widest mb-2">Admin Panel</h1>
            <p className="text-white/50 font-display tracking-wider">SPCX Market Management</p>
          </div>
          <form onSubmit={authenticate} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="ADMIN PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/30 text-white placeholder:text-white/40 px-6 py-4 focus:outline-none focus:border-[#1a8a4a]/80 focus:bg-white/5 transition-all font-display tracking-widest uppercase rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a8a4a] hover:bg-[#1a9a52] disabled:opacity-50 text-white font-display font-bold text-lg tracking-[0.2em] uppercase py-4 rounded-lg transition-colors cursor-pointer"
            >
              {isLoading ? "Authenticating..." : "Access Admin Panel"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'investors', label: 'Investors', icon: Users },
    { id: 'deposits', label: 'Deposits', icon: DollarSign },
    { id: 'credit', label: 'Credit User', icon: TrendingUp },
    { id: 'addresses', label: 'Addresses', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Filter },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#050a0f] text-white p-6 sm:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-widest mb-1">Admin Dashboard</h1>
            <p className="text-sm text-white/50 font-display tracking-wider uppercase">SPCX MARKET MANAGEMENT</p>
          </div>
          <button 
            onClick={() => { setIsAuthenticated(false); setPassword(''); setInvestors([]); }}
            className="self-start sm:self-auto text-sm text-white/50 hover:text-white font-display tracking-widest uppercase border border-white/20 px-6 py-2 hover:bg-white/5 transition-all cursor-pointer rounded-lg"
          >
            Sign Out
          </button>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-white/10 mb-8 pb-px scrollbar-hide">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-6 py-3 font-display tracking-widest uppercase text-sm border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === t.id ? 'border-[#1a8a4a] text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Investors', value: stats.totalInvestors, icon: Users },
                { label: 'Approved', value: stats.approvedInvestors, icon: TrendingUp },
                { label: 'Pending', value: stats.pendingInvestors, icon: Filter },
                { label: 'Total Deposits', value: stats.totalDeposits, icon: DollarSign },
                { label: 'Total Capital', value: `$${(stats.totalCapital / 1000000).toFixed(1)}M`, icon: BarChart3 },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-[#0a0f14] border border-white/10 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/50 font-display tracking-widest uppercase">{stat.label}</span>
                      <Icon className="w-4 h-4 text-[#1a8a4a]" />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Investors */}
        {activeTab === 'investors' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111827] border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1a8a4a]"
                />
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-[#111827] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1a8a4a]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="bg-[#0a0f14] border border-white/10 rounded-lg overflow-hidden">
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
                    {filteredInvestors.map((inv) => (
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
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Deposits */}
        {activeTab === 'deposits' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0f14] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 font-display tracking-widest uppercase text-xs bg-white/[0.02]">
                    <th className="py-3 px-4 font-normal">Investor</th>
                    <th className="py-3 px-4 font-normal">Amount</th>
                    <th className="py-3 px-4 font-normal">Shares</th>
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
                      <td className="py-4 px-4 font-display tracking-wider">{d.shares || '0'}</td>
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
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Credit User */}
        {activeTab === 'credit' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0f14] border border-white/10 p-8 rounded-lg max-w-2xl">
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
          </motion.div>
        )}

        {/* Addresses */}
        {activeTab === 'addresses' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-[#0a0f14] border border-white/10 rounded-lg p-6">
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

            <div className="space-y-4">
              {addresses.map(addrObj => (
                <div key={addrObj.coin} className="bg-[#0a0f14] border border-white/10 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
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
          </motion.div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0f14] border border-white/10 p-8 rounded-lg max-w-2xl">
            <h2 className="text-xl font-bold font-display uppercase tracking-widest mb-6">Admin Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-white/50 font-display tracking-widest uppercase mb-2">Admin Password</label>
                <p className="text-white/70">Contact support to change your admin password</p>
              </div>
              <div>
                <label className="block text-xs text-white/50 font-display tracking-widest uppercase mb-2">Session Timeout</label>
                <p className="text-white/70">Your session will expire after 30 minutes of inactivity</p>
              </div>
              <div>
                <label className="block text-xs text-white/50 font-display tracking-widest uppercase mb-2">Two-Factor Authentication</label>
                <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-display font-bold tracking-widest uppercase rounded cursor-pointer transition-colors text-sm">
                  Enable 2FA
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
