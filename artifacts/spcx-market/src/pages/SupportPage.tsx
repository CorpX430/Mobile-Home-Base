import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Menu, Bell, ArrowLeft, Mail, Phone, MessageSquare, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import SideNav from '../components/SideNav';

export default function SupportPage() {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'tickets'>('contact');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('spcx_user') || 'null') : null;

  const handleSignOut = () => {
    localStorage.removeItem('spcx_user');
    setLocation('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Support ticket submitted successfully');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportChannels = [
    { icon: Mail, title: 'Email Support', value: 'support@spcxipo.live', description: 'Response within 24 hours' },
    { icon: Phone, title: 'Phone Support', value: '+1 (555) 123-4567', description: 'Mon-Fri, 9AM-6PM EST' },
    { icon: MessageSquare, title: 'Live Chat', value: 'Available Now', description: 'Instant support from our team' },
  ];

  const faqs = [
    { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.' },
    { q: 'How long does verification take?', a: 'Most verifications complete within 2-3 business days.' },
    { q: 'Can I withdraw my funds?', a: 'Yes, you can request withdrawals anytime. Processing takes 3-5 business days.' },
    { q: 'What are trading hours?', a: 'Trading is available 24/7 on the SPCX platform.' },
    { q: 'How do I update my profile?', a: 'Go to Settings > Profile to update your information.' },
    { q: 'Is there a mobile app?', a: 'Mobile apps for iOS and Android are coming soon.' },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#050a0f] text-white selection:bg-white/20 flex flex-col">
      <SideNav open={menuOpen} onClose={() => setMenuOpen(false)} onSignOut={handleSignOut} />

      <header className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => setLocation('/dashboard')} className="text-white/70 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setMenuOpen(true)} className="text-white/70 hover:text-white transition-colors cursor-pointer">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <button className="text-white/70 hover:text-white transition-colors cursor-pointer">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-12">
          <h1 className="text-3xl font-bold font-display uppercase tracking-widest mb-2">Support Center</h1>
          <p className="text-sm text-white/50 tracking-wider font-display">Get help and answers to your questions</p>
        </motion.div>

        {/* Support Channels */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {supportChannels.map((channel, i) => {
            const Icon = channel.icon;
            return (
              <div key={i} className="bg-[#0a0f14] border border-white/10 p-6 rounded-lg hover:border-[#1a8a4a]/50 transition-colors">
                <Icon className="w-8 h-8 text-[#1a8a4a] mb-4" />
                <h3 className="font-display font-bold tracking-widest uppercase mb-1">{channel.title}</h3>
                <p className="text-lg font-bold mb-2">{channel.value}</p>
                <p className="text-xs text-white/50 font-display tracking-wider">{channel.description}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mb-8">
          <div className="flex gap-2 border-b border-white/10">
            {[
              { id: 'contact', label: 'Contact Us' },
              { id: 'faq', label: 'FAQ' },
              { id: 'tickets', label: 'My Tickets' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-display tracking-widest uppercase text-sm border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id ? 'border-[#1a8a4a] text-white' : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        {activeTab === 'contact' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0f14] border border-white/10 p-8 rounded-lg max-w-2xl">
            <h2 className="text-2xl font-bold font-display uppercase tracking-widest mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs text-white/50 font-display tracking-widest uppercase mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#111827] border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#1a8a4a] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 font-display tracking-widest uppercase mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#111827] border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#1a8a4a] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 font-display tracking-widest uppercase mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#111827] border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#1a8a4a] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 font-display tracking-widest uppercase mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full bg-[#111827] border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#1a8a4a] transition-colors resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1a8a4a] hover:bg-[#1a9a52] disabled:opacity-50 text-white font-display font-bold tracking-widest uppercase py-3 rounded transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-2xl">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0a0f14] border border-white/10 p-6 rounded-lg">
                <h3 className="font-display font-bold tracking-widest uppercase mb-3">{faq.q}</h3>
                <p className="text-white/70">{faq.a}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tickets */}
        {activeTab === 'tickets' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0f14] border border-white/10 p-8 rounded-lg max-w-2xl text-center">
            <Clock className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <h3 className="font-display font-bold tracking-widest uppercase mb-2">No Tickets Yet</h3>
            <p className="text-white/60">Your support tickets will appear here</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
