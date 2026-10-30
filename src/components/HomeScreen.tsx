/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Play,
  History,
  BookOpen,
  Mic,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Flame,
  Droplet,
  Milk,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Beaker,
} from 'lucide-react';
import { FoodItem, Language, TestResultRecord } from '../types';
import { FOOD_ITEMS, DEMO_SAMPLE_STRIPS } from '../data/testsData';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../services/soundEffects';

interface HomeScreenProps {
  currentLanguage: Language;
  recentTests: TestResultRecord[];
  onStartNewTest: () => void;
  onSelectFood: (foodId: string) => void;
  onNavigateHistory: () => void;
  onNavigateLearn: () => void;
  onOpenVoiceAssistant: () => void;
  onSelectRecentTest: (test: TestResultRecord) => void;
  onQuickDemoStrip: (stripId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentLanguage,
  recentTests,
  onStartNewTest,
  onSelectFood,
  onNavigateHistory,
  onNavigateLearn,
  onOpenVoiceAssistant,
  onSelectRecentTest,
  onQuickDemoStrip,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const getFoodIcon = (iconName: string) => {
    switch (iconName) {
      case 'Milk':
        return <Milk className="w-6 h-6 text-sky-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-rose-500" />;
      case 'Droplet':
        return <Droplet className="w-6 h-6 text-amber-600" />;
      default:
        return <Beaker className="w-6 h-6 text-emerald-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'safe':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {t.statusSafe}
          </span>
        );
      case 'suspicious':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {t.statusSuspicious}
          </span>
        );
      case 'unsafe':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            {t.statusUnsafe}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        {/* Decorative backdrop shapes */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-32 h-32 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-600/60 text-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FSSAI DART Aligned Testing</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Test Daily Food Purity in Under 3 Minutes
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 leading-relaxed">
              Use simple reagent strips or kitchen tests. Our camera color-matching interprets complex chemical reactions into instant Safe, Suspicious, or Unsafe safety indicators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                playSound('click');
                onStartNewTest();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-emerald-950 px-6 py-3 rounded-2xl font-extrabold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-emerald-950" />
              <span>{t.startNewTest}</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                onOpenVoiceAssistant();
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-2xl font-bold text-xs backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Voice Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Choose Food Category Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>{t.selectFood}</span>
            <span className="text-xs font-normal text-gray-500">(4 Core Indian Staples)</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FOOD_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                playSound('click');
                onSelectFood(item.id);
              }}
              className="group p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer active:scale-98"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors shadow-xs">
                  {getFoodIcon(item.iconName)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">{item.hindiName}</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {item.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Preset Strips for Hackathon Testing */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-xs sm:text-sm text-amber-950">
              Demo Testing Kit (Try Sample Reactions)
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
            Instant Test Simulator
          </span>
        </div>
        <p className="text-xs text-amber-900/80">
          No physical chemicals or strips on hand right now? Click any calibrated sample strip below to inspect real test reactions:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {DEMO_SAMPLE_STRIPS.slice(0, 4).map((strip) => (
            <button
              key={strip.id}
              onClick={() => {
                playSound('click');
                onQuickDemoStrip(strip.id);
              }}
              className="p-2.5 rounded-xl bg-white/90 border border-amber-200 hover:border-amber-400 text-left transition-all cursor-pointer hover:shadow-xs group flex items-start gap-2"
            >
              <div
                className="w-5 h-8 rounded-md shrink-0 border border-gray-300 shadow-xs group-hover:scale-105 transition-transform"
                style={{ backgroundColor: strip.stripColorHex }}
              />
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-gray-900 block truncate group-hover:text-amber-800">
                  {strip.title}
                </span>
                <span className="text-[10px] text-gray-500 block truncate">
                  {strip.expectedStatus.toUpperCase()} outcome
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Tests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            <span>{t.recentTests}</span>
          </h2>
          {recentTests.length > 0 && (
            <button
              onClick={() => {
                playSound('click');
                onNavigateHistory();
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({recentTests.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentTests.length === 0 ? (
          <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-2">
            <p className="text-xs text-gray-500 font-medium">{t.noRecentTests}</p>
            <button
              onClick={() => {
                playSound('click');
                onStartNewTest();
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Start Detergent or Turmeric test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTests.slice(0, 3).map((record) => (
              <div
                key={record.id}
                onClick={() => {
                  playSound('click');
                  onSelectRecentTest(record);
                }}
                className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center shadow-xs shrink-0"
                    style={{ backgroundColor: record.extractedColor.hex }}
                    title={`Extracted HEX: ${record.extractedColor.hex}`}
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      {record.testName}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {record.foodName} • {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(record.status)}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learn About Adulteration Card */}
      <div
        onClick={() => {
          playSound('click');
          onNavigateLearn();
        }}
        className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 hover:border-teal-400 transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              {t.learnMore}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Read FSSAI DART guidelines on common adulterants in milk, spices, and cooking oils.
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-teal-700 shrink-0" />
      </div>
    </div>
  );
};
