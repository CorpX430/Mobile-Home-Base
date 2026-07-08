import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Menu, Bell, ArrowLeft, Users, Award, Target, TrendingUp } from 'lucide-react';
import SideNav from '../components/SideNav';

export default function ManagementPage() {
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('spcx_user') || 'null') : null;

  const handleSignOut = () => {
    localStorage.removeItem('spcx_user');
    setLocation('/');
  };

  const executives = [
    { name: 'Elon Musk', title: 'CEO & Chief Engineer', bio: 'Founder and CEO of SpaceX, leading the company\'s mission to make humanity multiplanetary.' },
    { name: 'Gwynne Shotwell', title: 'President & COO', bio: 'Responsible for day-to-day operations and commercial sales of SpaceX.' },
    { name: 'Tom Mueller', title: 'VP of Propulsion Engineering', bio: 'Leading the development of advanced rocket engines and propulsion systems.' },
    { name: 'Lars Blackmore', title: 'VP of Flight Reliability', bio: 'Overseeing flight safety and reliability across all SpaceX missions.' },
  ];

  const milestones = [
    { year: '2002', event: 'SpaceX Founded', description: 'Company established with the goal of reducing space transportation costs.' },
    { year: '2008', event: 'Falcon 1 Success', description: 'First privately-developed liquid-fuel rocket to reach orbit.' },
    { year: '2012', event: 'Dragon Docking', description: 'First commercial spacecraft to dock with the ISS.' },
    { year: '2015', event: 'Falcon 9 Landing', description: 'First orbital-class rocket booster to successfully land and be reused.' },
    { year: '2020', event: 'Crew Dragon', description: 'First commercial spacecraft to carry astronauts to the ISS.' },
    { year: '2024', event: 'Starship Progress', description: 'Continued development of fully reusable super heavy-lift launch system.' },
  ];

  const stats = [
    { label: 'Successful Launches', value: '200+' },
    { label: 'Reusable Rockets', value: '15+' },
    { label: 'Employees', value: '9,500+' },
    { label: 'Countries Served', value: '50+' },
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
          <h1 className="text-3xl font-bold font-display uppercase tracking-widest mb-2">Company Management</h1>
          <p className="text-sm text-white/50 tracking-wider font-display">Leadership and governance information</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#0a0f14] border border-white/10 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-[#1a8a4a] mb-2">{stat.value}</div>
              <div className="text-xs text-white/50 font-display tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* About Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-[#0a0f14] border border-white/10 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold font-display uppercase tracking-widest mb-4">About SpaceX</h2>
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              SpaceX designs, manufactures and launches advanced rockets and spacecraft. The company was founded in 2002 to revolutionize space technology, with the ultimate goal of enabling people to live on other planets.
            </p>
            <p>
              SpaceX has achieved numerous milestones, including the first privately-developed liquid-fuel rocket to reach orbit, the first commercial spacecraft to dock with the International Space Station, and the first orbital-class rocket booster to successfully land and be reused.
            </p>
            <p>
              Today, SpaceX is developing Starship, a fully reusable super heavy-lift launch system designed to carry both cargo and passengers on long-duration, interplanetary flights and help humanity become a spacefaring civilization.
            </p>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#0a0f14] border border-white/10 p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-[#1a8a4a]" />
              <h3 className="text-xl font-bold font-display uppercase tracking-widest">Mission</h3>
            </div>
            <p className="text-white/70">
              To revolutionize space technology and make humanity multiplanetary by developing fully reusable rockets and spacecraft.
            </p>
          </div>
          <div className="bg-[#0a0f14] border border-white/10 p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-[#1a8a4a]" />
              <h3 className="text-xl font-bold font-display uppercase tracking-widest">Vision</h3>
            </div>
            <p className="text-white/70">
              To enable sustainable life on Mars and other planets while reducing the cost of space access for all humanity.
            </p>
          </div>
        </motion.div>

        {/* Leadership */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
          <h2 className="text-2xl font-bold font-display uppercase tracking-widest mb-6">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {executives.map((exec, i) => (
              <div key={i} className="bg-[#0a0f14] border border-white/10 p-6 rounded-lg hover:border-[#1a8a4a]/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1a8a4a] to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold tracking-widest uppercase mb-1">{exec.name}</h3>
                    <p className="text-sm text-[#1a8a4a] font-display tracking-wider uppercase mb-3">{exec.title}</p>
                    <p className="text-sm text-white/70">{exec.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
          <h2 className="text-2xl font-bold font-display uppercase tracking-widest mb-6">Company Milestones</h2>
          <div className="space-y-4">
            {milestones.map((milestone, i) => (
              <div key={i} className="bg-[#0a0f14] border border-white/10 p-6 rounded-lg flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#1a8a4a]/10 rounded-lg flex items-center justify-center border border-[#1a8a4a]/20">
                    <span className="font-display font-bold text-[#1a8a4a]">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold tracking-widest uppercase mb-1">{milestone.event}</h3>
                  <p className="text-white/70">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
