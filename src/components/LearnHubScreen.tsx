/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Droplet,
  Milk,
  Sparkles,
  PhoneCall,
  ExternalLink,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../services/soundEffects';

interface LearnHubScreenProps {
  currentLanguage: Language;
  onBack: () => void;
  onStartTestForFood: (foodId: string) => void;
}

export const LearnHubScreen: React.FC<LearnHubScreenProps> = ({
  currentLanguage,
  onBack,
  onStartTestForFood,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
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

        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          FSSAI DART Compliant
        </span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-700" />
          <span>Food Adulteration & Safety Knowledge</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Detect Adulteration with Rapid Test (DART) practices recognized by FSSAI for Indian kitchens.
        </p>
      </div>

      {/* Hero Banner: Why Testing Matters */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-900 text-white space-y-2.5 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-300" />
          <h3 className="font-bold text-sm text-emerald-100">Why Rapid Screening is Crucial</h3>
        </div>
        <p className="text-xs text-emerald-100/90 leading-relaxed">
          In India, loose milk, ground spices, and loose mustard oil are vulnerable to chemical adulteration by unethical traders aiming to maximize profits. Chemical additives like <strong>Metanil Yellow, Detergents, and Argemone Oil</strong> cause irreversible organ damage over time.
        </p>
      </div>

      {/* Category 1: Milk & Dairy */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Milk className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Milk Adulteration</h3>
              <p className="text-[11px] text-gray-500">Detergents, Synthetic Urea, Pond Water</p>
            </div>
          </div>

          <button
            onClick={() => onStartTestForFood('milk')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Test Milk →
          </button>
        </div>

        <div className="text-xs text-gray-600 space-y-2">
          <p>
            • <strong>Detergent:</strong> Added to emulsify cheap oils into water and simulate the thick creamy texture of buffalo milk. Causes gastrointestinal mucosal erosion and chronic gastritis.
          </p>
          <p>
            • <strong>Fertilizer Urea:</strong> Added along with starch to artificially boost the Solid-Not-Fat (SNF) and protein readings on standard lactometers. Overburdens renal function and causes chronic kidney stones.
          </p>
        </div>
      </div>

      {/* Category 2: Turmeric */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Turmeric (Haldi) Adulteration</h3>
              <p className="text-[11px] text-gray-500">Metanil Yellow, Chalk Powder, Lead Chromate</p>
            </div>
          </div>

          <button
            onClick={() => onStartTestForFood('turmeric')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Test Turmeric →
          </button>
        </div>

        <div className="text-xs text-gray-600 space-y-2">
          <p>
            • <strong>Metanil Yellow:</strong> A toxic, non-permitted coal-tar dye commonly used to give poor-grade or bleached turmeric an intense golden appearance. Classified as a neurotoxin and tumor promoter.
          </p>
          <p>
            • <strong>Chalk & Starch:</strong> Cheap calcium carbonate or rice flour fillers added to increase weight.
          </p>
        </div>
      </div>

      {/* Category 3: Chilli Powder */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Chilli Powder Adulteration</h3>
              <p className="text-[11px] text-gray-500">Sudan I-IV Dyes, Crushed Brick Dust</p>
            </div>
          </div>

          <button
            onClick={() => onStartTestForFood('chilli')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Test Chilli →
          </button>
        </div>

        <div className="text-xs text-gray-600 space-y-2">
          <p>
            • <strong>Sudan Red & Rhodamine:</strong> Industrial solvent dyes banned worldwide in food products. They impart a bright crimson color to old or faded chilli seeds. Proven genotoxic carcinogens.
          </p>
          <p>
            • <strong>Brick Dust:</strong> Crushed bricks and red earth added for bulk weight. Ingesting sharp silica particles lacerates the digestive tract lining.
          </p>
        </div>
      </div>

      {/* Category 4: Cooking Oils */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-amber-700 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Cooking Oil & Epidemic Dropsy</h3>
              <p className="text-[11px] text-gray-500">Argemone Mexicana Contamination</p>
            </div>
          </div>

          <button
            onClick={() => onStartTestForFood('oil')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Test Oil →
          </button>
        </div>

        <div className="text-xs text-gray-600 space-y-2">
          <p>
            • <strong>Argemone Oil:</strong> Extracted from the seeds of prickly poppy weed. Sanguinarine alkaloids cause <em>Epidemic Dropsy</em>, characterized by extreme leg edema, breathlessness, cardiac arrest, and sudden blindness (glaucoma).
          </p>
        </div>
      </div>

      {/* Screening vs Lab Testing FAQ */}
      <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gray-700" />
          <h3 className="font-bold text-sm text-gray-900">What PureSnap Can & Cannot Detect</h3>
        </div>
        <div className="text-xs text-gray-600 space-y-2">
          <p>
            <strong>What it CAN do:</strong> PureSnap is an early warning system. It detects qualitative chemical color reactions (such as pH indicators, DMAB urea complexes, azo dyes, and sanguinarine precipitates) using standardized colorimetric HSV ranges.
          </p>
          <p>
            <strong>What it CANNOT do:</strong> PureSnap does not replace gas chromatography, HPLC, or certified NABL laboratory analysis. It cannot quantify exact parts-per-million (PPM) concentrations.
          </p>
        </div>
      </div>

      {/* Consumer Reporting & FSSAI Details */}
      <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-3">
        <div className="flex items-center gap-2 text-emerald-900">
          <PhoneCall className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-sm">How to Report Food Adulteration in India</h3>
        </div>
        <p className="text-xs text-emerald-950 leading-relaxed">
          If you detect unsafe food, you have consumer rights under the Food Safety and Standards Act (FSS Act 2006).
        </p>
        <div className="space-y-1.5 text-xs text-emerald-900 font-medium">
          <p>• <strong>National Consumer Helpline:</strong> 1800-11-2100 (Toll Free)</p>
          <p>• <strong>FSSAI Food Safety Connect Portal:</strong> foscos.fssai.gov.in</p>
          <p>• <strong>SMS Grievance:</strong> 9868686868</p>
        </div>
      </div>
    </div>
  );
};
