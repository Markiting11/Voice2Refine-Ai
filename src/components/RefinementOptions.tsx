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
            "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 text-center gap-2",
            selectedStyle === style.id
              ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
              : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <style.icon className={cn("w-6 h-6", selectedStyle === style.id ? "text-emerald-600" : "text-zinc-400")} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{style.label}</span>
            <span className="text-[10px] opacity-70 hidden md:block">{style.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
