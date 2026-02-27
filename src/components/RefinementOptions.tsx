import React from 'react';
import { RefinementStyle } from '../types';
import { Briefcase, MessageCircle, FileText, Heart, UserCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RefinementOptionsProps {
  selectedStyle: RefinementStyle;
  onStyleChange: (style: RefinementStyle) => void;
  disabled?: boolean;
}

const styles: { id: RefinementStyle; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'professional', label: 'Professional', icon: Briefcase, description: 'Clear and business-like' },
  { id: 'friendly', label: 'Friendly', icon: Heart, description: 'Warm and approachable' },
  { id: 'formal', label: 'Formal', icon: FileText, description: 'Official and structured' },
  { id: 'simple', label: 'Simple', icon: MessageCircle, description: 'Easy and direct' },
  { id: 'client-ready', label: 'Client-Ready', icon: UserCheck, description: 'Perfect for freelancers' },
];

export const RefinementOptions: React.FC<RefinementOptionsProps> = ({ selectedStyle, onStyleChange, disabled }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full max-w-4xl mx-auto">
      {styles.map((style) => (
        <button
          key={style.id}
          onClick={() => onStyleChange(style.id)}
          disabled={disabled}
          className={cn(
            "flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 text-center gap-3",
            selectedStyle === style.id
              ? "bg-gold/10 border-gold text-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]"
              : "bg-luxury-card border-gold/10 text-zinc-500 hover:border-gold/30 hover:bg-gold/5",
            disabled && "opacity-30 cursor-not-allowed"
          )}
        >
          <style.icon className={cn("w-6 h-6", selectedStyle === style.id ? "text-gold" : "text-zinc-600")} />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest">{style.label}</span>
            <span className="text-[9px] opacity-40 hidden md:block uppercase tracking-tighter">{style.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
