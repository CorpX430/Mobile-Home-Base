import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { User, ArrowRight, TrendingUp, Lock, Zap, Globe, BarChart3, CheckCircle2 } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateInvestor, useGetInvestorCount, getGetInvestorCountQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: investorCountData } = useGetInvestorCount();
  const createInvestor = useCreateInvestor();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    createInvestor.mutate({ data }, {
      onSuccess: (resData) => {
        toast.success("Successfully registered for investor access.");
        reset();
        queryClient.invalidateQueries({ queryKey: getGetInvestorCountQueryKey() });
        setLocation('/access-pending?email=' + encodeURIComponent(resData.email));
      },
      onError: (error) => {
        const errData = error.data as { error?: string } | null;
        const errorMsg = errData?.error ?? "Failed to register. Please try again.";
        toast.error(errorMsg);
      }
    });
  };

  const features = [
    { icon: TrendingUp, title: "Real-Time Trading", description: "Access live market data and execute trades instantly" },
    { icon: Lock, title: "Secure Platform", description: "Enterprise-grade security with multi-layer protection" },
    { icon: Zap, title: "Fast Execution", description: "Lightning-fast order processing and settlement" },
    { icon: Globe, title: "Global Access", description: "Trade from anywhere in the world, 24/7" },
    { icon: BarChart3, title: "Advanced Analytics", description: "Comprehensive portfolio tracking and insights" },
    { icon: CheckCircle2, title: "Verified Assets", description: "All assets are verified and compliant" },
  ];

  const pricingTiers = [
    { shares: 10, price: 1500, pricePerShare: 150 },
    { shares: 25, price: 8600, pricePerShare: 344 },
    { shares: 50, price: 30000, pricePerShare: 600 },
    { shares: 100, price: 100000, pricePerShare: 1000 },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#050a0f] text-white selection:bg-white/20 overflow-hidden">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
        <motion.div 
          className="font-display font-bold text-xl sm:text-2xl tracking-[0.2em] uppercase"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          SPCX
        </motion.div>
        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/signin" className="hidden sm:flex items-center gap-2 text-sm font-medium tracking-widest hover:text-white/70 transition-colors uppercase">
            <span>Sign In</span>
            <User className="w-4 h-4" />
          </Link>
          <Link href="/signin" className="sm:hidden text-white/70 hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] w-full flex flex-col justify-center px-6 pb-12 sm:px-12 sm:pb-24 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#1a8a4a]/20 to-transparent rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl -ml-48 -mb-48" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <FadeIn>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold uppercase leading-[0.9] tracking-tight">
              SpaceX<br/>IPO Trading
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg sm:text-2xl font-light tracking-[0.2em] text-blue-50/90 uppercase max-w-2xl">
              Invest in the future of space exploration. Trade SPCX shares on the world's first dedicated pre-IPO platform.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-6 mt-12">
              <Link href="#register" className="px-8 py-4 bg-[#1a8a4a] hover:bg-[#1a9a52] text-white font-display font-bold tracking-widest uppercase transition-colors cursor-pointer rounded-lg flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#pricing" className="px-8 py-4 border border-white/40 hover:border-white text-white font-display font-bold tracking-widest uppercase transition-colors cursor-pointer rounded-lg">
                View Pricing
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div className="mt-16 flex flex-col sm:flex-row gap-8 text-sm font-display tracking-widest uppercase">
              <div>
                <div className="text-3xl font-bold text-[#1a8a4a]">{investorCountData?.count?.toLocaleString() ?? '0'}+</div>
                <div className="text-white/50 text-xs mt-1">Investors Registered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1a8a4a]">$2.5B+</div>
                <div className="text-white/50 text-xs mt-1">Total Capital</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1a8a4a]">147.62</div>
                <div className="text-white/50 text-xs mt-1">Current Price (USD)</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 sm:px-12 bg-gradient-to-b from-[#050a0f] to-[#0a0f14]">
        <div className="max-w-6xl mx-auto w-full">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-widest leading-tight">
                Why Choose SPCX
              </h2>
              <p className="mt-6 text-white/60 text-lg max-w-2xl mx-auto">
                Experience the next generation of investment platforms with cutting-edge technology and unparalleled security.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-[#111827] border border-white/10 p-8 rounded-xl hover:border-[#1a8a4a]/50 transition-colors group">
                    <div className="w-12 h-12 bg-[#1a8a4a]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#1a8a4a]/20 transition-colors">
                      <Icon className="w-6 h-6 text-[#1a8a4a]" />
                    </div>
                    <h3 className="font-display font-bold text-lg tracking-widest uppercase mb-2">{feature.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 sm:px-12 bg-[#050a0f]" id="pricing">
        <div className="max-w-6xl mx-auto w-full">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-widest leading-tight">
                Investment Tiers
              </h2>
              <p className="mt-6 text-white/60 text-lg">Choose your investment level and start trading today</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`p-8 rounded-xl border transition-all ${i === 2 ? 'bg-[#1a8a4a]/10 border-[#1a8a4a] scale-105' : 'bg-[#111827] border-white/10 hover:border-white/30'}`}>
                  <div className="font-display font-bold text-3xl mb-2">{tier.shares}</div>
                  <div className="text-white/60 text-sm font-display tracking-widest uppercase mb-6">Shares</div>
                  <div className="text-4xl font-bold mb-1">${tier.price.toLocaleString()}</div>
                  <div className="text-white/50 text-sm mb-6">${tier.pricePerShare}/share</div>
                  <button className={`w-full py-3 font-display font-bold tracking-widest uppercase rounded transition-colors ${i === 2 ? 'bg-[#1a8a4a] hover:bg-[#1a9a52] text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                    Select
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-32 px-6 sm:px-12 bg-gradient-to-b from-[#0a0f14] to-[#050a0f]" id="register">
        <div className="max-w-2xl mx-auto w-full">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-widest leading-tight">
                Ready to Invest?
              </h2>
              <p className="mt-4 text-white/60">Join thousands of investors trading SPCX shares today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="FULL NAME"
                  {...register("fullName")}
                  className="w-full bg-black/50 border border-white/30 text-white placeholder:text-white/40 px-6 py-5 focus:outline-none focus:border-[#1a8a4a]/80 focus:bg-white/5 transition-all font-display tracking-widest text-lg sm:text-xl uppercase rounded-lg"
                />
                {errors.fullName && <p className="text-red-400 font-display tracking-wider text-sm mt-2">{errors.fullName.message}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  {...register("email")}
                  className="w-full bg-black/50 border border-white/30 text-white placeholder:text-white/40 px-6 py-5 focus:outline-none focus:border-[#1a8a4a]/80 focus:bg-white/5 transition-all font-display tracking-widest text-lg sm:text-xl uppercase rounded-lg"
                />
                {errors.email && <p className="text-red-400 font-display tracking-wider text-sm mt-2">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={createInvestor.isPending}
                className="w-full bg-[#1a8a4a] hover:bg-[#1a9a52] disabled:opacity-50 text-white font-display font-bold text-xl sm:text-2xl tracking-[0.2em] uppercase py-5 mt-4 transition-colors cursor-pointer rounded-lg"
              >
                {createInvestor.isPending ? "Submitting..." : "Create Account"}
              </button>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 sm:px-12 bg-[#050a0f] border-t border-white/10">
        <div className="max-w-4xl mx-auto w-full">
          <FadeIn>
            <div className="mb-16">
              <span className="text-white/50 text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">
                Investor FAQ
              </span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-widest">
                Frequently Asked Questions
              </h2>
            </div>

            <AccordionPrimitive.Root type="single" collapsible className="w-full">
              {[
                {
                  q: "What is SPCX?",
                  a: "SPCX is the ticker symbol for SpaceX shares trading on the SPCX Market platform, the first regulated exchange dedicated to pre-IPO space economy equities."
                },
                {
                  q: "Who is eligible to participate?",
                  a: "Accredited investors in supported jurisdictions may participate. Verification is required before trading begins."
                },
                {
                  q: "What are the minimum investment amounts?",
                  a: "The minimum investment is 10 shares at $1,500. We offer tiered pricing for larger investments."
                },
                {
                  q: "How do I place an order?",
                  a: "After completing accredited investor verification, you may submit market or limit orders through the SPCX trading portal."
                },
                {
                  q: "When does trading begin?",
                  a: "Trading is expected to commence following regulatory clearance. Sign up above to receive launch notifications."
                },
                {
                  q: "Is my investment insured?",
                  a: "All accounts are held in segregated custody. SIPC coverage applies to eligible accounts per standard brokerage regulations."
                },
                {
                  q: "What payment methods are accepted?",
                  a: "We accept debit/credit cards and cryptocurrency (BTC, ETH, DOGE). Additional payment methods are coming soon."
                },
                {
                  q: "How long does approval take?",
                  a: "Most applications are approved within 2-3 business days. You'll receive an email notification once approved."
                }
              ].map((faq, i) => (
                <AccordionPrimitive.Item key={i} value={`item-${i}`} className="border-b border-white/10 overflow-hidden">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between py-8 font-display text-2xl sm:text-3xl tracking-widest text-left transition-all hover:text-white/80 [&[data-state=open]>svg]:rotate-180 uppercase cursor-pointer">
                      {faq.q}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        className="h-6 w-6 shrink-0 transition-transform duration-300 text-white/50"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden text-white/60 text-lg sm:text-xl font-light leading-relaxed data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="pb-8 pt-0">{faq.a}</div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-12 bg-gradient-to-r from-[#1a8a4a]/20 to-blue-500/10 border-y border-white/10">
        <div className="max-w-4xl mx-auto w-full text-center">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-widest mb-6">
              Don't Miss Out on the Future
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Join the investment revolution. Limited spots available for early investors.
            </p>
            <Link href="#register" className="inline-block px-8 py-4 bg-[#1a8a4a] hover:bg-[#1a9a52] text-white font-display font-bold tracking-widest uppercase transition-colors cursor-pointer rounded-lg">
              Register Now
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 border-t border-white/10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6 text-xs sm:text-sm text-white/40 tracking-[0.15em] uppercase font-display">
        <p>© 2025 SPCX Market, Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
