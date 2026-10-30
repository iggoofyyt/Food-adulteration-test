/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

class VoiceAssistantService {
  private synth: SpeechSynthesis | null = null;
  private isSpeakingState = false;
  private voices: SpeechSynthesisVoice[] = [];
  // Speech recognition
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListeningState = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }

    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public speak(text: string, lang: Language = 'en', onEnd?: () => void) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);

    // Map language code
    const langMap: Record<Language, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
    };

    utterance.lang = langMap[lang] || 'en-IN';
    utterance.rate = 0.95; // Slightly slower for clear instruction
    utterance.pitch = 1.0;

    // Pick a matching voice if possible
    const preferredVoice = this.voices.find(
      (v) => v.lang.startsWith(langMap[lang]) || (lang === 'en' && (v.lang === 'en-IN' || v.lang === 'en-US'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.isSpeakingState = true;

    utterance.onend = () => {
      this.isSpeakingState = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      if (onEnd) onEnd();
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error', err);
      this.isSpeakingState = false;
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (err) {
        console.warn(err);
      }
    }
    this.isSpeakingState = false;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth ? this.synth.speaking : false);
  }

  public isRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    lang: Language,
    onResult: (transcript: string) => void,
    onError?: (err: string) => void,
    onEnd?: () => void
  ) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser.');
      return;
    }

    try {
      const langMap: Record<Language, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN',
      };
      this.recognition.lang = langMap[lang] || 'en-IN';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListeningState = false;
        onResult(transcript);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onerror = (event: any) => {
        this.isListeningState = false;
        if (onError) onError(event.error || 'Recognition error');
      };

      this.recognition.onend = () => {
        this.isListeningState = false;
        if (onEnd) onEnd();
      };

      this.isListeningState = true;
      this.recognition.start();
    } catch (err) {
      this.isListeningState = false;
      if (onError) onError(String(err));
    }
  }

  public stopListening() {
    if (this.recognition && this.isListeningState) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn(err);
      }
      this.isListeningState = false;
    }
  }

  public isListening(): boolean {
    return this.isListeningState;
  }
}

export const voiceService = new VoiceAssistantService();
