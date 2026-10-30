/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Check, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { voiceService } from '../services/voiceAssistantService';
import { playSound } from '../services/soundEffects';

interface VoiceAssistantModalProps {
  currentLanguage: Language;
  onClose: () => void;
  onSelectFood: (foodId: string) => void;
  onStartNewTest: () => void;
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
  onNavigateLearn: () => void;
  currentContextText?: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  currentLanguage,
  onClose,
  onSelectFood,
  onStartNewTest,
  onNavigateHome,
  onNavigateHistory,
  onNavigateLearn,
  currentContextText,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<string>(
    currentLanguage === 'hi'
      ? 'नमस्ते! आप क्या टेस्ट करना चाहते हैं? बोलें: दूध, हल्दी, मिर्च, या तेल।'
      : 'Hello! What would you like to test today? You can say: Milk, Turmeric, Chilli, or Oil.'
  );

  useEffect(() => {
    // Speak initial prompt
    const initialText =
      currentLanguage === 'hi'
        ? 'नमस्ते! आप क्या टेस्ट करना चाहते हैं? बोलें: दूध, हल्दी, मिर्च, या तेल।'
        : 'Hello! What would you like to test today? You can say: Milk, Turmeric, Chilli, or Oil.';
    voiceService.speak(initialText, currentLanguage);

    return () => {
      voiceService.stopSpeaking();
      voiceService.stopListening();
    };
  }, [currentLanguage]);

  const handleStartListening = () => {
    playSound('click');
    setTranscript('');
    setIsListening(true);
    setFeedback('Listening... Speak now.');

    voiceService.startListening(
      currentLanguage,
      (text) => {
        setIsListening(false);
        setTranscript(text);
        processVoiceCommand(text);
      },
      (err) => {
        setIsListening(false);
        setFeedback('Could not hear clearly. Tap a suggestion below or try again.');
        console.warn('Speech error', err);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const processVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase().trim();

    if (text.includes('milk') || text.includes('दूध') || text.includes('paal') || text.includes('dudh')) {
      playSound('safe');
      const response = currentLanguage === 'hi' ? 'दूध परीक्षण शुरू कर रहे हैं।' : 'Selecting Milk & Dairy tests.';
      setFeedback(response);
      voiceService.speak(response, currentLanguage, () => {
        onSelectFood('milk');
        onClose();
      });
      return;
    }

    if (text.includes('turmeric') || text.includes('हल्दी') || text.includes('haldi') || text.includes('manjal')) {
      playSound('safe');
      const response = currentLanguage === 'hi' ? 'हल्दी परीक्षण शुरू कर रहे हैं।' : 'Opening Turmeric tests.';
      setFeedback(response);
      voiceService.speak(response, currentLanguage, () => {
        onSelectFood('turmeric');
        onClose();
      });
      return;
    }

    if (text.includes('chilli') || text.includes('chili') || text.includes('मिर्च') || text.includes('mirch') || text.includes('milagai')) {
      playSound('safe');
      const response = currentLanguage === 'hi' ? 'लाल मिर्च जांच खोल रहे हैं।' : 'Selecting Chilli Powder tests.';
      setFeedback(response);
      voiceService.speak(response, currentLanguage, () => {
        onSelectFood('chilli');
        onClose();
      });
      return;
    }

    if (text.includes('oil') || text.includes('तेल') || text.includes('tel') || text.includes('ennai')) {
      playSound('safe');
      const response = currentLanguage === 'hi' ? 'खाने का तेल परीक्षण शुरू कर रहे हैं।' : 'Selecting Cooking Oil tests.';
      setFeedback(response);
      voiceService.speak(response, currentLanguage, () => {
        onSelectFood('oil');
        onClose();
      });
      return;
    }

    if (text.includes('history') || text.includes('इतिहास') || text.includes('record')) {
      playSound('safe');
      setFeedback('Opening test history.');
      voiceService.speak('Opening test history.', currentLanguage, () => {
        onNavigateHistory();
        onClose();
      });
      return;
    }

    if (text.includes('learn') || text.includes('fssai') || text.includes('guide')) {
      playSound('safe');
      setFeedback('Opening FSSAI education hub.');
      voiceService.speak('Opening FSSAI food safety guide.', currentLanguage, () => {
        onNavigateLearn();
        onClose();
      });
      return;
    }

    if (text.includes('start') || text.includes('test') || text.includes('new') || text.includes('नया')) {
      playSound('safe');
      setFeedback('Starting new food test.');
      voiceService.speak('Starting a new test. Please select a food item.', currentLanguage, () => {
        onStartNewTest();
        onClose();
      });
      return;
    }

    // Default fallback
    setFeedback(`Heard: "${rawText}". Tap one of the food options below to proceed.`);
    voiceService.speak(`You said ${rawText}. Please choose a food item.`, currentLanguage);
  };

  const handleChipClick = (foodId: string, label: string) => {
    playSound('click');
    const msg = currentLanguage === 'hi' ? `${label} जांच शुरू कर रहे हैं` : `Opening ${label} test`;
    setFeedback(msg);
    voiceService.speak(msg, currentLanguage, () => {
      onSelectFood(foodId);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-100 animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Mic className="w-4 h-4 text-amber-100" />
            </div>
            <div>
              <h3 className="font-bold text-sm">PureSnap Voice Assistant</h3>
              <p className="text-[10px] text-amber-200">Hands-free kitchen testing companion</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('click');
              voiceService.stopSpeaking();
              voiceService.stopListening();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-5">
          {/* Animated Mic Orb */}
          <div className="flex justify-center items-center py-2">
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                isListening
                  ? 'bg-rose-500 text-white ring-8 ring-rose-200 animate-pulse'
                  : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white ring-4 ring-amber-100 hover:ring-amber-200'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {isListening ? 'Listening for speech...' : 'Tap Mic to Speak'}
            </p>
            <p className="text-sm font-bold text-gray-800 mt-1 px-4">{feedback}</p>
            {transcript && (
              <p className="text-xs text-emerald-700 font-medium mt-1 bg-emerald-50 py-1 px-3 rounded-full inline-block">
                Recognized: &quot;{transcript}&quot;
              </p>
            )}
          </div>

          {/* Quick Voice Command Suggestion Chips */}
          <div className="space-y-2 pt-1 text-left">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or tap to choose:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleChipClick('milk', 'Milk')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-gray-800 block">🥛 Milk & Dairy</span>
                  <span className="text-[10px] text-gray-500">Detergent & Urea</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => handleChipClick('turmeric', 'Turmeric')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-gray-800 block">✨ Turmeric</span>
                  <span className="text-[10px] text-gray-500">Metanil Yellow</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => handleChipClick('chilli', 'Chilli')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-gray-800 block">🌶️ Chilli Powder</span>
                  <span className="text-[10px] text-gray-500">Sudan Dyes & Brick</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => handleChipClick('oil', 'Cooking Oil')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-gray-800 block">🛢️ Cooking Oil</span>
                  <span className="text-[10px] text-gray-500">Argemone Oil</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 px-5">
          <span>Web Speech API • Multi-dialect support</span>
          <button
            onClick={() => {
              if (currentContextText) {
                voiceService.speak(currentContextText, currentLanguage);
              }
            }}
            className="text-amber-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Read Current Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
