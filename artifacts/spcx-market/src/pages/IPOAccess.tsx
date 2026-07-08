import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Menu, Bell, CheckCircle, Clock, XCircle } from 'lucide-react';
import SideNav from '../components/SideNav';

interface InvestorStatus {
  email: string;
  fullName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  shares?: string;
}

export default function IPOAccess() {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [investorData, setInvestorData] = useState<InvestorStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('spcx_user') || 'null') : null;

  useEffect(() => {
    if (!user) {
      setLocation('/signin');
      return;
    }
    setInvestorData({
      email: user.email,
      fullName: user.fullName,
      status: user.status || 'pending',
      createdAt: new Date().toISOString(),
      shares: '0'
    });
    setLoading(false);
  }, [user, setLocation]);

  const handleSignOut = () => {
    localStorage.removeItem('spcx_user');
    setLocation('/');
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#050a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-display tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (!investorData) {
    return null;
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      title: 'Application Pending',
      description: 'Your IPO access application is under review. We typically respond within 2-3 business days.',
      actions: [
        'Your application has been received',
        'Our team is reviewing your information',
        'You will receive an email notification upon approval'
      ]
    },
    approved: {
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      title: 'IPO Access Approved',
      description: 'Congratulations! Your IPO access has been approved. You can now begin trading.',
      actions: [
        'Access to trading platform enabled',
        'View your holdings and portfolio',
        'Place orders and manage deposits',
        'Access real-time market data'
      ]
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      title: 'Application Not Approved',
      description: 'Unfortunately, your application was not approved at this time.',
      actions: [
        'Please contact support for more information',
        'You may reapply after 30 days',
        'Email: support@spcxipo.live'
      ]
    }
  };

  const config = statusConfig[investorData.status];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-[100dvh] bg-[#050a0f] text-white selection:bg-white/20 flex flex-col">
      <SideNav open={menuOpen} onClose={() => setMenuOpen(false)} onSignOut={handleSignOut} />
      
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => setMenuOpen(true)} className="text-white/70 hover:text-white transition-colors cursor-pointer">
          <Menu className="w-6 h-6" />
        </button>
        <button className="text-white/70 hover:text-white transition-colors cursor-pointer">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-3xl font-bold font-display uppercase tracking-widest mb-1">IPO Access Status</h1>
          <p className="text-sm text-white/50 tracking-wider font-display">SPCX • NASDAQ • USD</p>
        </motion.div>

        {/* Main Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`${config.bgColor} border ${config.borderColor} p-8 mb-8 rounded-lg`}
        >
          <div className="flex items-start gap-6">
            <StatusIcon className={`w-16 h-16 ${config.color} flex-shrink-0 mt-1`} />
            <div className="flex-1">
              <h2 className="text-2xl font-bold font-display uppercase tracking-widest mb-2">{config.title}</h2>
              <p className="text-white/70 text-lg mb-4">{config.description}</p>
              
              <div className="bg-black/30 p-4 rounded border border-white/10 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/50 font-display tracking-wider uppercase text-xs">Name</span>
                    <p className="font-display tracking-wider mt-1">{investorData.fullName}</p>
                  </div>
                  <div>
                    <span className="text-white/50 font-display tracking-wider uppercase text-xs">Email</span>
                    <p className="font-display tracking-wider mt-1">{investorData.email}</p>
                  </div>
                  <div>
                    <span className="text-white/50 font-display tracking-wider uppercase text-xs">Status</span>
                    <p className={`font-display tracking-wider mt-1 uppercase ${config.color}`}>{investorData.status}</p>
                  </div>
                  <div>
                    <span className="text-white/50 font-display tracking-wider uppercase text-xs">Applied</span>
                    <p className="font-display tracking-wider mt-1">{new Date(investorData.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {investorData.status === 'approved' && (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setLocation('/dashboard')}
                    className="px-6 py-3 bg-[#1a8a4a] hover:bg-[#1a9a52] text-white font-display font-bold tracking-widest uppercase transition-colors cursor-pointer rounded"
                  >
                    Go to Dashboard
                  </button>
                  <button 
                    onClick={() => setLocation('/orders')}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-display font-bold tracking-widest uppercase transition-colors cursor-pointer rounded"
                  >
                    Make a Deposit
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Status Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#0a0f14] border border-white/10 p-8 rounded-lg"
        >
          <h3 className="text-xl font-bold font-display uppercase tracking-widest mb-6">What's Next</h3>
          <div className="space-y-4">
            {config.actions.map((action, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`w-2 h-2 rounded-full ${config.color} flex-shrink-0`}></div>
                <p className="text-white/70 font-display tracking-wider">{action}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 bg-[#0a0f14] border border-white/10 p-8 rounded-lg"
        >
          <h3 className="text-xl font-bold font-display uppercase tracking-widest mb-4">Need Help?</h3>
          <p className="text-white/70 mb-4">
            If you have questions about your application status or need assistance, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:support@spcxipo.live"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-display font-bold tracking-widest uppercase transition-colors cursor-pointer rounded inline-block text-center"
            >
              Email Support
            </a>
            <a 
              href="https://spcxipo.live/support"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-display font-bold tracking-widest uppercase transition-colors cursor-pointer rounded inline-block text-center"
            >
              View FAQ
            </a>
          </div>
        </motion.div>

        <div className="mt-16 mb-8 text-center">
          <button onClick={handleSignOut} className="text-white/40 hover:text-white transition-colors text-sm font-display tracking-widest uppercase underline decoration-white/20 underline-offset-4 cursor-pointer">
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
