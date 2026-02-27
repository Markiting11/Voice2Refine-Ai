import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { Waveform } from './Waveform';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isProcessing: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(blob);
        mediaStream.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-10 bg-luxury-card rounded-[2rem] shadow-2xl border border-gold/10 w-full max-w-md mx-auto backdrop-blur-md">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-serif font-bold tracking-wide text-white">
          {isRecording ? 'Listening...' : isProcessing ? 'Refining...' : 'Voice Capture'}
        </h2>
        <p className="text-xs uppercase tracking-[0.2em] text-gold/50 font-medium">
          {isRecording ? 'Speak clearly' : isProcessing ? 'AI Excellence in progress' : 'Tap to begin recording'}
        </p>
      </div>

      <div className="relative flex items-center justify-center w-36 h-36">
        {isRecording && (
          <div className="absolute inset-0 animate-ping rounded-full bg-gold/10" />
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={cn(
            "relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl",
            isRecording 
              ? "bg-red-900/40 border border-red-500/50 text-red-400 scale-110" 
              : "bg-gradient-to-br from-gold to-gold-dark text-luxury-black hover:scale-105 shadow-gold/20",
            isProcessing && "opacity-30 cursor-not-allowed grayscale"
          )}
        >
          {isProcessing ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isRecording ? (
            <Square className="w-10 h-10 fill-current" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </button>
      </div>

      {isRecording && <Waveform isRecording={isRecording} stream={stream} />}

      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};
