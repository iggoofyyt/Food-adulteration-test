/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Camera,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  PackageCheck,
  Beaker,
  Timer as TimerIcon,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AdulterantTest, Language, TestStep } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../services/soundEffects';
import { voiceService } from '../services/voiceAssistantService';

interface StepWizardScreenProps {
  currentLanguage: Language;
  test: AdulterantTest;
  onProceedToCamera: () => void;
  onBack: () => void;
}

export const StepWizardScreen: React.FC<StepWizardScreenProps> = ({
  currentLanguage,
  test,
  onProceedToCamera,
  onBack,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [checkedMaterials, setCheckedMaterials] = useState<Record<number, boolean>>({});

  // Timer states
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = TRANSLATIONS[currentLanguage];
  const step = test.steps[currentStepIndex];
  const totalSteps = test.steps.length;
  const isFinalStep = currentStepIndex === totalSteps - 1;

  // Initialize timer when step changes
  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsTimerRunning(false);

    if (step.type === 'timer' && step.durationSeconds) {
      setSecondsRemaining(step.durationSeconds);
    } else {
      setSecondsRemaining(0);
    }

    // Speak step instruction automatically
    const textToSpeak = `${t.step} ${step.stepNumber}: ${step.title}. ${step.description}`;
    voiceService.speak(textToSpeak, currentLanguage);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      voiceService.stopSpeaking();
    };
  }, [currentStepIndex, step, currentLanguage, t.step]);

  // Handle Timer Countdown
  const startTimer = () => {
    playSound('click');
    setIsTimerRunning(true);
    timerIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setIsTimerRunning(false);
          playSound('alarm');
          voiceService.speak(
            currentLanguage === 'hi' ? 'समय समाप्त हुआ! अगले चरण पर जाएं।' : 'Time complete! Move to next step.',
            currentLanguage
          );
          return 0;
        }
        playSound('tick');
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    playSound('click');
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    playSound('click');
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsTimerRunning(false);
    setSecondsRemaining(step.durationSeconds || 0);
  };

  const handleNext = () => {
    playSound('click');
    if (isFinalStep) {
      onProceedToCamera();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    playSound('click');
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const toggleMaterial = (idx: number) => {
    playSound('click');
    setCheckedMaterials((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const renderStepVisualIcon = () => {
    switch (step.visualIcon) {
      case 'PackageCheck':
        return <PackageCheck className="w-10 h-10 text-emerald-600" />;
      case 'Beaker':
        return <Beaker className="w-10 h-10 text-sky-600" />;
      case 'Timer':
      case 'Clock':
        return <TimerIcon className="w-10 h-10 text-amber-500 animate-spin-slow" />;
      case 'Camera':
        return <Camera className="w-10 h-10 text-emerald-600 animate-bounce" />;
      default:
        return <Sparkles className="w-10 h-10 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-5 pb-8 max-w-2xl mx-auto">
      {/* Top Header & Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {t.step} {currentStepIndex + 1} {t.of} {totalSteps}
            </span>

            <button
              onClick={() => {
                const text = `${step.title}. ${step.description}. ${step.tip || ''}`;
                voiceService.speak(text, currentLanguage);
              }}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              title="Repeat instructions aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Instruction Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
        {/* Step Title Header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-inner">
            {renderStepVisualIcon()}
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {test.name}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
              {step.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>

        {/* Interactive Material Checklist on Step 1 */}
        {currentStepIndex === 0 && test.materials && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-emerald-700" />
              <span>{t.materialsNeeded} (Tap to check off)</span>
            </h4>
            <div className="space-y-2">
              {test.materials.map((mat, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleMaterial(idx)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    checkedMaterials[idx]
                      ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 line-through opacity-85'
                      : 'bg-white border-gray-200 text-gray-800 hover:border-emerald-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      checkedMaterials[idx]
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {checkedMaterials[idx] && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span>{mat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Countdown Timer */}
        {step.type === 'timer' && step.durationSeconds && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Reaction Timer</span>
            </div>

            <div className="text-5xl font-extrabold text-amber-950 tracking-tight font-mono">
              00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
            </div>

            {/* Timer Progress Ring Bar */}
            <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className="bg-amber-600 h-full transition-all duration-1000"
                style={{
                  width: `${((step.durationSeconds - secondsRemaining) / step.durationSeconds) * 100}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  disabled={secondsRemaining === 0}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{secondsRemaining === step.durationSeconds ? t.startTimer : 'Resume'}</span>
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>{t.pauseTimer}</span>
                </button>
              )}

              <button
                onClick={resetTimer}
                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Practical Tip Callout */}
        {step.tip && (
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600">
              <span className="font-bold text-gray-800">Pro Tip: </span>
              {step.tip}
            </p>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {t.back}
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer ml-auto"
        >
          {isFinalStep ? (
            <>
              <Camera className="w-4 h-4" />
              <span>{t.capturePhoto}</span>
            </>
          ) : (
            <>
              <span>{t.next}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
