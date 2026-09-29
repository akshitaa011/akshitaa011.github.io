import React, { useState } from 'react';
import { Mail, Phone, Copy, Check, Send, Sparkles, ArrowUpRight, MessageSquare } from 'lucide-react';
import { Github, Linkedin, LeetCode } from './Icons';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';

export default function Contact() {
  const { personal } = portfolioData;
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.7 }
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    triggerConfetti();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(personal.phone);
    setCopiedPhone(true);
    triggerConfetti();
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Open mailto with prefilled details
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.open(`mailto:${personal.email}?subject=${subject}&body=${body}`, '_blank');

    setFormSent(true);
    triggerConfetti();
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 relative scroll-mt-24 sm:scroll-mt-28">
      
      {/* Background Glow */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-r from-[#6366F1]/10 via-[#10B981]/5 to-[#6366F1]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-indigo text-xs font-mono mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Connect Directly</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Let's Build Something <span className="text-gradient-indigo">Transformative</span>
          </h2>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-xl mt-3">
            Available for SDE internships, engineering opportunities, and open source collaborations. Fast responses guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Column: Direct Fast Channels (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Email Card */}
            <div className="glass-card p-5 rounded-2xl border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider">Email Dispatch</span>
                <div className="p-2 rounded-lg bg-[#6366F1]/10 text-[#A5B4FC]">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <div className="text-sm font-bold font-mono text-white truncate">
                {personal.email}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopyEmail}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-xs font-mono text-[#9CA3AF] hover:text-white transition-all cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#A5B4FC]" />}
                  <span>{copiedEmail ? "Copied!" : "Copy Email"}</span>
                </button>
                <a
                  href={`mailto:${personal.email}?subject=Opportunity%20Discussion`}
                  className="flex items-center justify-center p-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black transition-colors shadow-sm shadow-[#10B981]/25"
                  title="Open Mail Client"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="glass-card p-5 rounded-2xl border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider">Direct Line</span>
                <div className="p-2 rounded-lg bg-[#10B981]/10 text-[#34D399]">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
              <div className="text-sm font-bold font-mono text-white">
                {personal.phone}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopyPhone}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-xs font-mono text-[#9CA3AF] hover:text-white transition-all cursor-pointer"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#10B981]" />}
                  <span>{copiedPhone ? "Copied!" : "Copy Number"}</span>
                </button>
                <a
                  href={`tel:${personal.phone}`}
                  className="flex items-center justify-center p-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black transition-colors shadow-sm shadow-[#10B981]/25"
                  title="Call Directly"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Social Channels */}
            <div className="glass-card p-5 rounded-2xl border border-white/[0.08] space-y-3">
              <span className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider block">Profiles & Verification</span>
              <div className="space-y-2">
                <a
                  href={personal.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-xs text-[#9CA3AF] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-[#9CA3AF]" />
                    <span>GitHub: github.com/akshitaa011</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={personal.links.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-xs text-[#9CA3AF] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <LeetCode className="w-4 h-4 text-[#34D399]" />
                    <span>LeetCode: leetcode.com/u/akshita1111</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={personal.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-xs text-[#9CA3AF] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-[#A5B4FC]" />
                    <span>LinkedIn: in/akshita-singhal</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Message Composer (3 cols) */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-7 sm:p-8 rounded-2xl border border-white/[0.08] relative">
              
              <div className="flex items-center gap-2 text-[#A5B4FC] text-xs font-mono font-semibold mb-2">
                <MessageSquare className="w-4 h-4" />
                <span>Send a Message</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-6">
                Drop a Note or Interview Inquiry
              </h3>

              {formSent ? (
                <div className="p-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#34D399] flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 animate-spin" />
                  </div>
                  <h4 className="text-lg font-bold font-heading text-[#34D399]">Message Dispatched!</h4>
                  <p className="text-xs text-[#34D399]/90 max-w-sm mx-auto">
                    Your email client has been prepared. Akshita will review your note and respond promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-[#9CA3AF] block mb-1.5">Your Name / Organization</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins (Google)"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.08] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/40 text-white placeholder:text-slate-600 text-xs sm:text-sm outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-[#9CA3AF] block mb-1.5">Your Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. sjenkins@company.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.08] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/40 text-white placeholder:text-slate-600 text-xs sm:text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-[#9CA3AF] block mb-1.5">Message / Opportunity Overview</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Akshita, we came across your work on Submitty and EnvGuard..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.08] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/40 text-white placeholder:text-slate-600 text-xs sm:text-sm outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-semibold text-sm shadow-md shadow-[#10B981]/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry to Akshita</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
