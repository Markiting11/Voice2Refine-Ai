import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  isRecording: boolean;
  stream: MediaStream | null;
}

export const Waveform: React.FC<WaveformProps> = ({ isRecording, stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (isRecording && stream && canvasRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyzer = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const draw = () => {
        if (!ctx) return;
        animationRef.current = requestAnimationFrame(draw);
        analyzer.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;
          
          // Gradient color
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#10b981'); // emerald-500
          gradient.addColorStop(1, '#34d399'); // emerald-400
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      };

      draw();

      return () => {
        cancelAnimationFrame(animationRef.current);
        audioContext.close();
      };
    }
  }, [isRecording, stream]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-16 rounded-lg bg-black/5"
      width={400}
      height={64}
    />
  );
};
