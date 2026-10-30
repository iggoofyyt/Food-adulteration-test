/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Mic, Smartphone, Monitor, BookOpen, History, Volume2, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../services/soundEffects';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenVoiceAssistant: () => void;
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
  onNavigateLearn: () => void;
  isSimulatorMode: boolean;
  onToggleSimulatorMode: () => void;
  activeScreen: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenVoiceAssistant,
  onNavigateHome,
  onNavigateHistory,
  onNavigateLearn,
  isSimulatorMode,
  onToggleSimulatorMode,
  activeScreen,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white border-b border-emerald-800 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => {
            playSound('click');
            onNavigateHome();
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                PureSnap
              </span>
              <span className="text-[10px] font-semibold bg-emerald-700/80 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-600/60">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[10px] text-emerald-300 leading-none hidden sm:block">
              Food Safety Screening
            </p>
          </div>
        </button>

        {/* Center / Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Navigation Shortcuts */}
          <button
            onClick={() => {
              playSound('click');
              onNavigateHistory();
            }}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              activeScreen === 'history'
                ? 'bg-emerald-800 text-white'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
            title="History"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              onNavigateLearn();
            }}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              activeScreen === 'learn'
                ? 'bg-emerald-800 text-white'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
            title="Learn Adulteration"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">FSSAI Guide</span>
          </button>

          {/* Voice Assistant Trigger */}
          <button
            onClick={() => {
              playSound('click');
              onOpenVoiceAssistant();
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
            title="Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Voice</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => {
                playSound('click');
                onLanguageChange(e.target.value as Language);
              }}
              className="bg-emerald-800 text-emerald-100 text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer appearance-none pr-6"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिंदी (HI)</option>
              <option value="ta">தமிழ் (TA)</option>
              <option value="te">తెలుగు (TE)</option>
              <option value="bn">বাংলা (BN)</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-emerald-300">
              ▼
            </span>
          </div>

          {/* Device Frame Simulator Switcher */}
          <button
            onClick={() => {
              playSound('click');
              onToggleSimulatorMode();
            }}
            className="p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-800 hover:text-white transition-colors cursor-pointer"
            title={isSimulatorMode ? 'Switch to Fullscreen view' : 'Switch to Android Phone frame view'}
          >
            {isSimulatorMode ? (
              <Monitor className="w-4 h-4" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
