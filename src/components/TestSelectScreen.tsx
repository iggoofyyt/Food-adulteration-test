/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ArrowLeft, Clock, PackageCheck, ChevronRight, Volume2, ShieldAlert } from 'lucide-react';
import { AdulterantTest, FoodItem, Language } from '../types';
import { TESTS_DATA, FOOD_ITEMS } from '../data/testsData';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../services/soundEffects';
import { voiceService } from '../services/voiceAssistantService';

interface TestSelectScreenProps {
  currentLanguage: Language;
  foodId: string;
  onSelectTest: (testId: string) => void;
  onBack: () => void;
}

export const TestSelectScreen: React.FC<TestSelectScreenProps> = ({
  currentLanguage,
  foodId,
  onSelectTest,
  onBack,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const currentFood = FOOD_ITEMS.find((f) => f.id === foodId) || FOOD_ITEMS[0];
  const availableTests = Object.values(TESTS_DATA).filter((test) => test.foodItemId === foodId);

  useEffect(() => {
    const prompt =
      currentLanguage === 'hi'
        ? `${currentFood.name} के लिए उपलब्ध परीक्षण चुनें।`
        : `Select an adulteration test for ${currentFood.name}.`;
    voiceService.speak(prompt, currentLanguage);
  }, [currentFood, currentLanguage]);

  return (
    <div className="space-y-5 pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            playSound('click');
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <button
          onClick={() => {
            const listNames = availableTests.map((t) => t.name).join(', ');
            voiceService.speak(`Available tests for ${currentFood.name}: ${listNames}`, currentLanguage);
          }}
          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
          title="Read available tests"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            {currentFood.name}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">{currentFood.hindiName}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5">
          {t.selectTest}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Choose a specific chemical strip or kitchen screening test to perform.
        </p>
      </div>

      {/* Test Cards List */}
      <div className="space-y-3">
        {availableTests.map((test) => (
          <div
            key={test.id}
            onClick={() => {
              playSound('click');
              onSelectTest(test.id);
            }}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group active:scale-99"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {test.name}
                </h3>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-rose-100">
                  <ShieldAlert className="w-3 h-3" />
                  Detects: {test.adulterant}
                </span>
              </div>

              <p className="text-xs text-gray-500 font-medium">{test.hindiName}</p>

              {/* Material preview */}
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>~{test.estimatedTimeMinutes} {t.minutes}</span>
                </span>
                <span className="flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{test.steps.length} Steps</span>
                </span>
              </div>

              {/* Color Reference Scale Bar */}
              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Color Indicator:
                </span>
                <div className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                    style={{ backgroundColor: test.chart.defaultSafeHex }}
                    title="Safe baseline color"
                  />
                  <span className="text-[10px] text-gray-500">Safe</span>
                  <span className="text-gray-300">→</span>
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                    style={{ backgroundColor: test.chart.defaultUnsafeHex }}
                    title="Adulterant reaction color"
                  />
                  <span className="text-[10px] font-bold text-rose-600">Unsafe</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end sm:justify-center">
              <span className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl group-hover:shadow-md transition-all">
                <span>Start Test</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
