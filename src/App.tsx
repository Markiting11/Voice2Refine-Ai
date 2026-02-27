import React, { useState } from 'react';
import { VoiceRecorder } from './components/VoiceRecorder';
import { RefinementOptions } from './components/RefinementOptions';
import { OutputDisplay } from './components/OutputDisplay';
import { AppState, RefinementStyle, RefinementResult } from './types';
import { transcribeAndRefine } from './services/geminiService';
import { Sparkles, History, Settings, Info, Github } from 'lucide-react';
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
      
      // Celebrate success
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669']
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
    <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
                Voice2Refine AI
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500">
              <a href="#" className="hover:text-emerald-600 transition-colors">How it works</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Pricing</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">API</a>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
                <History className="w-5 h-5" />
              </button>
              <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="h-8 w-[1px] bg-zinc-200 mx-1" />
              <button className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-all active:scale-95 shadow-sm">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
              Speak your mind, <br />
              <span className="text-emerald-600">Refine your message.</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
              Record your voice in any language (Urdu, English, Roman Urdu, etc.) and let AI transform it into polished, professional text ready for clients, emails, or proposals.
            </p>
          </motion.div>
        </section>

        {/* Core Tool Section */}
        <section className="space-y-12">
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Step 1: Select Output Style
              </span>
              <RefinementOptions 
                selectedStyle={state.selectedStyle} 
                onStyleChange={handleStyleChange}
                disabled={state.isProcessing}
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Step 2: Record Your Voice
              </span>
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
                className="max-w-md mx-auto p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3"
              >
                <Info className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{state.error}</p>
              </motion.div>
            )}

            {state.result && !state.isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                <div className="flex flex-col items-center gap-4 mb-8">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    Step 3: Review & Use
                  </span>
                </div>
                <OutputDisplay result={state.result} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 pt-12 border-t border-zinc-200">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Multilingual Support</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Speak in Urdu, English, Hindi, or even Roman Urdu. Our AI understands the context and nuances of mixed languages.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center shadow-sm">
              <Settings className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Smart Refinement</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Choose from 5 different styles to match your audience. From professional client replies to friendly messages.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center shadow-sm">
              <Github className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Ready to Send</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              One-click copy, download, or email. Get your message out faster without the stress of manual editing.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 opacity-60 grayscale">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900">
                Voice2Refine AI
              </span>
            </div>
            <p className="text-zinc-400 text-sm">
              © 2026 Voice2Refine AI. Built with Gemini 3.1 Pro.
            </p>
            <div className="flex gap-6 text-zinc-400">
              <a href="#" className="hover:text-zinc-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-zinc-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
