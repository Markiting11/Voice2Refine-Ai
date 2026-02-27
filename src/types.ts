export type RefinementStyle = 'professional' | 'simple' | 'formal' | 'friendly' | 'client-ready';

export interface RefinementResult {
  originalText: string;
  refinedText: string;
  detectedLanguage: string;
}

export interface AppState {
  isRecording: boolean;
  isProcessing: boolean;
  audioBlob: Blob | null;
  result: RefinementResult | null;
  selectedStyle: RefinementStyle;
  error: string | null;
}
