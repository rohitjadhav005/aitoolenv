import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Upload, Sparkles, Gift, Zap, Diamond, ChevronDown } from 'lucide-react';
import { categories } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STEPS = ['Basic Info', 'Details', 'Review'];

export default function SubmitToolPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    website: '',
    pricing: 'free',
    categoryId: '',
    tags: '',
    logo: '',
  });

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('ai-tools-token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tools`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: form.name,
          tagline: form.tagline,
          description: form.description,
          website: form.website,
          pricing: form.pricing,
          category: form.categoryId,
          tags: form.tags,
          logo: form.logo
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit tool');
      
      toast.success('Tool submitted! It has been added to our database.', {
        style: { background: '#1a1a30', color: 'white', border: '1px solid rgba(255,255,255,0.1)' },
      });
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      toast.error(err.message, {
        style: { background: '#1a1a30', color: 'white', border: '1px solid rgba(255,255,255,0.1)' },
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-4 text-center">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
            <Sparkles size={28} className="text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Sign in to Submit</h1>
          <p className="text-white/50 mb-6">You need an account to submit AI tools to the directory.</p>
          <button onClick={() => navigate('/login')} className="btn-accent">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header & Step Indicator */}
        <div>
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 mb-4 shadow-accent">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Submit an AI Tool</h1>
            <p className="text-white/50">Share a great AI tool with our community of {(24891).toLocaleString()}+ users</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  i < step ? 'text-violet-400' : i === step ? 'text-white' : 'text-white/30'
                }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all ${
                    i < step
                      ? 'bg-violet-500 border-violet-500'
                      : i === step
                        ? 'border-violet-500 text-violet-400'
                        : 'border-white/20'
                  }`}>
                    {i < step ? <Check size={13} /> : i + 1}
                  </div>
                  <span className="hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 h-px mx-3 transition-colors ${i < step ? 'bg-violet-500/50' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-8 space-y-5"
            >
              {/* Step 0: Basic Info */}
              {step === 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Tool Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      placeholder="e.g. My AI Tool"
                      className="input-glass"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Short Tagline *</label>
                    <input
                      type="text"
                      value={form.tagline}
                      onChange={e => update('tagline', e.target.value)}
                      placeholder="One line description of what it does..."
                      className="input-glass"
                      required
                      maxLength={80}
                    />
                    <p className="text-xs text-white/30 mt-1">{form.tagline.length}/80 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Website URL *</label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={e => update('website', e.target.value)}
                      placeholder="https://example.com"
                      className="input-glass"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Logo URL</label>
                    <input
                      type="url"
                      value={form.logo}
                      onChange={e => update('logo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="input-glass"
                    />
                  </div>
                </>
              )}

              {/* Step 1: Details */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      placeholder="Describe what this AI tool does, its main features, and who it's for..."
                      className="input-glass h-32 resize-none"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-white/70 mb-2">Category *</label>
                    <div 
                      className="input-glass flex items-center justify-between cursor-pointer"
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    >
                      <span className={form.categoryId ? "text-white" : "text-white/50"}>
                        {form.categoryId ? categories.find(c => c.id === form.categoryId)?.name : "Select a category..."}
                      </span>
                      <ChevronDown size={16} className={`text-white/50 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                    </div>

                    {categoryDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setCategoryDropdownOpen(false)} 
                        />
                        <div className="absolute top-full mt-2 w-full bg-[#380e54]/95 backdrop-blur-xl max-h-60 overflow-y-auto no-scrollbar z-50 py-2 border border-white/10 rounded-xl shadow-2xl">
                          {categories.map(cat => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                update('categoryId', cat.id);
                                setCategoryDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${form.categoryId === cat.id ? 'bg-violet-500/20 text-violet-300 font-medium' : 'text-white/70'}`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    {/* Hidden select for form validation requirement */}
                    <select value={form.categoryId} onChange={() => {}} className="hidden" required>
                       <option value="" disabled></option>
                       {form.categoryId && <option value={form.categoryId}></option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Pricing *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['free', 'freemium', 'paid'].map(p => {
                        const isActive = form.pricing === p;
                        const config: Record<string, { label: string, icon: any, desc: string }> = {
                          free: { label: 'Free', icon: <Gift size={16} />, desc: '100% Free' },
                          freemium: { label: 'Freemium', icon: <Zap size={16} />, desc: 'Free + Paid' },
                          paid: { label: 'Paid', icon: <Diamond size={16} />, desc: 'Premium' },
                        };
                        const curr = config[p];
                        
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => update('pricing', p)}
                            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 overflow-hidden ${
                              isActive
                                ? 'border-violet-500 bg-violet-500/10 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                                : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'
                            }`}
                          >
                            {isActive && (
                              <div className="absolute inset-0 bg-gradient-to-b from-violet-500/20 to-transparent pointer-events-none" />
                            )}
                            <div className={`mb-1 transition-transform duration-300 ${isActive ? 'scale-110 text-violet-400' : ''}`}>
                              {curr.icon}
                            </div>
                            <span className="text-sm font-bold">{curr.label}</span>
                            <span className="text-[10px] opacity-60 mt-0.5 hidden sm:block">{curr.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Tags</label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={e => update('tags', e.target.value)}
                      placeholder="chatbot, writing, productivity (comma separated)"
                      className="input-glass"
                    />
                  </div>
                </>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Review your submission</h3>
                    {[
                      { label: 'Name', value: form.name },
                      { label: 'Tagline', value: form.tagline },
                      { label: 'Website', value: form.website },
                      { label: 'Pricing', value: form.pricing },
                      { label: 'Category', value: categories.find(c => c.id === form.categoryId)?.name || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start p-3 rounded-xl bg-white/3 border border-white/8">
                        <span className="text-sm text-white/40">{label}</span>
                        <span className="text-sm text-white font-medium text-right max-w-xs">{value || '—'}</span>
                      </div>
                    ))}
                    <p className="text-xs text-white/30 text-center pt-2">
                      By submitting, you confirm this tool is legitimate and you agree to our guidelines.
                    </p>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-2">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="btn-ghost flex-1 whitespace-nowrap"
                  >
                    Back
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    disabled={step === 0 && (!form.name || !form.tagline || !form.website)}
                    className="btn-accent flex-1 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <span>Next</span> <ChevronRight size={16} className="shrink-0" />
                  </button>
                ) : (
                  <button type="submit" className="btn-accent flex-1 flex items-center justify-center gap-2 whitespace-nowrap">
                    <Upload size={16} className="shrink-0" /> <span>Submit Tool</span>
                  </button>
                )}
              </div>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
