import React, { useState } from 'react';
import { Copy, Check, Download, Mail, MessageSquare, Crown } from 'lucide-react';
import { RefinementResult } from '../types';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OutputDisplayProps {
  result: RefinementResult;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result.refinedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([result.refinedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "refined-text.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Original Text */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-gold/40 uppercase tracking-[0.3em]">Original Transcription</h3>
            <span className="text-[9px] px-3 py-1 bg-gold/5 text-gold/60 rounded-full border border-gold/10 font-bold uppercase tracking-wider">
              {result.detectedLanguage}
            </span>
          </div>
          <div className="p-6 bg-luxury-card rounded-2xl border border-gold/10 text-zinc-500 text-sm min-h-[160px] font-light leading-relaxed">
            {result.originalText || "No transcription available."}
          </div>
        </div>

        {/* Refined Text */}
        <div className="flex-[1.5] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Refined Masterpiece</h3>
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="p-2.5 hover:bg-gold/10 rounded-xl transition-all text-gold/60 hover:text-gold border border-transparent hover:border-gold/20"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={downloadTxt}
                className="p-2.5 hover:bg-gold/10 rounded-xl transition-all text-gold/60 hover:text-gold border border-transparent hover:border-gold/20"
                title="Download as TXT"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-8 bg-luxury-card rounded-3xl border border-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.05)] text-zinc-200 min-h-[240px] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Crown className="w-20 h-20 text-gold" />
            </div>
            <div className="prose prose-invert max-w-none relative z-10">
              <ReactMarkdown>{result.refinedText}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-luxury-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-gold/10 active:scale-95"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy Masterpiece'}
        </button>
        <button 
          onClick={() => window.location.href = `mailto:?body=${encodeURIComponent(result.refinedText)}`}
          className="flex items-center gap-3 px-8 py-4 bg-luxury-card text-gold border border-gold/20 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gold/5 transition-all active:scale-95"
        >
          <Mail className="w-4 h-4" />
          Send via Email
        </button>
      </div>
    </div>
  );
};
