/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ArrowLeft, Milk, Sparkles, Flame, Droplet, ChevronRight, Beaker, Volume2 } from 'lucide-react';
import { FoodItem, Language } from '../types';
import { FOOD_ITEMS } from '../data/testsData';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../services/soundEffects';
import { voiceService } from '../services/voiceAssistantService';

interface FoodSelectScreenProps {
  currentLanguage: Language;
  onSelectFood: (foodId: string) => void;
  onBack: () => void;
}

export const FoodSelectScreen: React.FC<FoodSelectScreenProps> = ({
  currentLanguage,
  onSelectFood,
  onBack,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  useEffect(() => {
    const promptText =
      currentLanguage === 'hi'
        ? 'कृपया खाद्य वस्तु चुनें: दूध, हल्दी, मिर्च, या खाने का तेल।'
        : 'Please choose what you want to test: Milk, Turmeric, Chilli powder, or Cooking oil.';
    voiceService.speak(promptText, currentLanguage);
  }, [currentLanguage]);

  const getFoodIcon = (iconName: string) => {
    switch (iconName) {
      case 'Milk':
        return <Milk className="w-8 h-8 text-sky-600" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-amber-500" />;
      case 'Flame':
        return <Flame className="w-8 h-8 text-rose-500" />;
      case 'Droplet':
        return <Droplet className="w-8 h-8 text-amber-600" />;
      default:
        return <Beaker className="w-8 h-8 text-emerald-600" />;
    }
  };

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
            voiceService.speak(
              currentLanguage === 'hi'
                ? 'कृपया खाद्य वस्तु चुनें: दूध, हल्दी, मिर्च, या खाने का तेल।'
                : 'Select one of the four food items to view available chemical and kitchen tests.',
              currentLanguage
            );
          }}
          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
          title="Read instructions"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          {t.selectFood}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Select the daily food staple you wish to screen for adulteration.
        </p>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FOOD_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              playSound('click');
              onSelectFood(item.id);
            }}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all text-left flex items-start justify-between cursor-pointer group active:scale-98"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-emerald-50 border border-gray-100 group-hover:border-emerald-200 flex items-center justify-center shrink-0 transition-colors">
                {getFoodIcon(item.iconName)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-800/80">{item.hindiName}</p>
                <p className="text-xs text-gray-500 leading-relaxed pr-2">{item.description}</p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
          </button>
        ))}
      </div>
    </div>
  );
};
