import React, { useState } from 'react';
import { Copy, Check, Download, Mail, MessageSquare } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Original Text */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Original Transcription</h3>
            <span className="text-[10px] px-2 py-1 bg-zinc-100 text-zinc-600 rounded-full font-medium">
              Detected: {result.detectedLanguage}
            </span>
          </div>
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-700 text-sm min-h-[120px]">
            {result.originalText || "No transcription available."}
          </div>
        </div>

        {/* Refined Text */}
        <div className="flex-[1.5] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Refined Output</h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={downloadTxt}
                className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
                title="Download as TXT"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-6 bg-white rounded-2xl border-2 border-emerald-100 shadow-sm text-zinc-800 min-h-[200px] relative">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{result.refinedText}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Refined Text'}
        </button>
        <button 
          onClick={() => window.location.href = `mailto:?body=${encodeURIComponent(result.refinedText)}`}
          className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-700 border border-zinc-200 rounded-xl font-semibold hover:bg-zinc-50 transition-all shadow-sm active:scale-95"
        >
          <Mail className="w-4 h-4" />
          Send as Email
        </button>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-700 border border-zinc-200 rounded-xl font-semibold hover:bg-zinc-50 transition-all shadow-sm active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          Share Proposal
        </button>
      </div>
    </div>
  );
};
