import React, { useState } from 'react';
import { VoiceRecorder } from './components/VoiceRecorder';
import { RefinementOptions } from './components/RefinementOptions';
import { OutputDisplay } from './components/OutputDisplay';
import { AppState, RefinementStyle, RefinementResult } from './types';
import { transcribeAndRefine } from './services/geminiService';
import { Sparkles, History, Settings, Info, Github, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [state, setState] = useState<AppState>({
    isRecording: false,
    isProcessing: false,
    audioBlob: null,
    result: null,
    selectedStyle: 'professional',
    error: null,
  });

  const handleRecordingComplete = async (blob: Blob) => {
    setState(prev => ({ ...prev, audioBlob: blob, isProcessing: true, result: null, error: null }));
    
    try {
      const result = await transcribeAndRefine(blob, state.selectedStyle);
      setState(prev => ({ ...prev, result, isProcessing: false }));
      
      // Celebrate success with gold confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F1E5AC', '#996515']
      });
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: err instanceof Error ? err.message : 'An unexpected error occurred.' 
      }));
    }
  };

  const handleStyleChange = (style: RefinementStyle) => {
    setState(prev => ({ ...prev, selectedStyle: style }));
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans selection:bg-gold/30 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-luxury-black/90 backdrop-blur-xl border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
                <Crown className="text-luxury-black w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold tracking-wider text-gold uppercase">
                  Anwar Ali Sehar
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-medium">
                  Voice2Refine AI
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-gold/60">
              <a href="#" className="hover:text-gold transition-colors">The Experience</a>
              <a href="#" className="hover:text-gold transition-colors">Excellence</a>
              <a href="#" className="hover:text-gold transition-colors">Legacy</a>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gold/40 hover:text-gold transition-colors">
                <History className="w-5 h-5" />
              </button>
              <div className="h-6 w-[1px] bg-gold/10 mx-1" />
              <button className="border border-gold/30 text-gold px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-luxury-black transition-all active:scale-95 shadow-lg shadow-gold/5">
                Member Access
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-[1px] w-12 bg-gold/30" />
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold/70">A Masterpiece by Anwar Ali Sehar</span>
              <div className="h-[1px] w-12 bg-gold/30" />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-white leading-[1.1]">
              Elevate Your <br />
              <span className="italic text-gold">Voice to Art.</span>
            </h1>
            <p className="mt-8 text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
              Experience the pinnacle of AI-driven communication. Transcribe and refine your thoughts into professional masterpieces with a single touch.
            </p>
          </motion.div>
        </section>

        {/* Core Tool Section */}
        <section className="space-y-20">
          <div className="space-y-12">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-8 bg-gold/20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/50">
                  I. Select Your Signature Style
                </span>
                <div className="h-[1px] w-8 bg-gold/20" />
              </div>
              <RefinementOptions 
                selectedStyle={state.selectedStyle} 
                onStyleChange={handleStyleChange}
                disabled={state.isProcessing}
              />
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-8 bg-gold/20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/50">
                  II. Capture Your Essence
                </span>
                <div className="h-[1px] w-8 bg-gold/20" />
              </div>
              <VoiceRecorder 
                onRecordingComplete={handleRecordingComplete} 
                isProcessing={state.isProcessing}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {state.error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-md mx-auto p-5 bg-red-950/20 border border-red-900/30 text-red-400 rounded-2xl flex items-center gap-4 backdrop-blur-sm"
              >
                <Info className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{state.error}</p>
              </motion.div>
            )}

            {state.result && !state.isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 80 }}
              >
                <div className="flex flex-col items-center gap-6 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-gold/20" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/50">
                      III. The Refined Result
                    </span>
                    <div className="h-[1px] w-8 bg-gold/20" />
                  </div>
                </div>
                <OutputDisplay result={state.result} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-12 pt-24 border-t border-gold/10">
          <div className="space-y-6 group">
            <div className="w-14 h-14 bg-luxury-card rounded-2xl border border-gold/10 flex items-center justify-center shadow-xl group-hover:border-gold/30 transition-all duration-500">
              <Crown className="w-7 h-7 text-gold" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white tracking-wide">Elite Transcription</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-light">
              Sophisticated understanding of Urdu, English, and Roman Urdu dialects, capturing every nuance of your speech.
            </p>
          </div>
          <div className="space-y-6 group">
            <div className="w-14 h-14 bg-luxury-card rounded-2xl border border-gold/10 flex items-center justify-center shadow-xl group-hover:border-gold/30 transition-all duration-500">
              <Sparkles className="w-7 h-7 text-gold" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white tracking-wide">Artistic Refinement</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-light">
              Our AI doesn't just fix grammar; it crafts your message into a professional masterpiece tailored to your audience.
            </p>
          </div>
          <div className="space-y-6 group">
            <div className="w-14 h-14 bg-luxury-card rounded-2xl border border-gold/10 flex items-center justify-center shadow-xl group-hover:border-gold/30 transition-all duration-500">
              <Settings className="w-7 h-7 text-gold" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white tracking-wide">Seamless Integration</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-light">
              Designed for the modern professional. Export to email, copy to clipboard, or download with unparalleled ease.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-luxury-black border-t border-gold/10 py-20 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4 opacity-80">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                <Crown className="text-luxury-black w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-serif font-bold tracking-wider text-white uppercase">
                  Anwar Ali Sehar
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-medium">
                  Voice2Refine AI
                </span>
              </div>
            </div>
            <p className="text-zinc-600 text-xs tracking-widest uppercase font-medium">
              © 2026 Anwar Ali Sehar. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gold/40">
              <a href="#" className="hover:text-gold transition-colors">Privacy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms</a>
              <a href="#" className="hover:text-gold transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
