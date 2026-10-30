/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Camera, Mic, CheckCircle2, ChevronRight, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../services/soundEffects';

interface OnboardingModalProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  currentLanguage,
  onLanguageChange,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [cameraAllowed, setCameraAllowed] = useState<boolean>(false);
  const [requestingPerms, setRequestingPerms] = useState<boolean>(false);

  const t = TRANSLATIONS[currentLanguage];

  const requestCameraPermission = async () => {
    setRequestingPerms(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setCameraAllowed(true);
        playSound('safe');
      } else {
        setCameraAllowed(true); // fallback
      }
    } catch (err) {
      console.warn('Camera permission dismissed or not allowed:', err);
      // Still allow proceeding via photo upload or sample strips
      setCameraAllowed(true);
    } finally {
      setRequestingPerms(false);
    }
  };

  const handleFinish = () => {
    playSound('safe');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-100 flex flex-col max-h-[92vh]">
        {/* Header Graphic */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-3 border border-white/20 shadow-inner">
            <ShieldCheck className="w-10 h-10 text-emerald-300 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">PureSnap Tester</h1>
          <p className="text-emerald-100 text-xs mt-1 font-medium">{t.tagline}</p>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  step === i ? 'w-6 bg-emerald-300' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4 text-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Choose Your Language</h2>
                <p className="text-xs text-gray-500 mt-0.5">अपनी भाषा चुनें / மொழியைத் தேர்ந்தெடுக்கவும்</p>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1">
                {[
                  { code: 'en', label: 'English', sub: 'Default interface' },
                  { code: 'hi', label: 'हिंदी (Hindi)', sub: 'भारतीय गृहस्थियों के लिए' },
                  { code: 'ta', label: 'தமிழ் (Tamil)', sub: 'தமிழ் பயனர்களுக்கு' },
                  { code: 'te', label: 'తెలుగు (Telugu)', sub: 'తెలుగు వారికి' },
                  { code: 'bn', label: 'বাংলা (Bengali)', sub: 'বাংলা ভাষাভাষীদের জন্য' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      playSound('click');
                      onLanguageChange(item.code as Language);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      currentLanguage === item.code
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-sm text-gray-800 block">{item.label}</span>
                      <span className="text-[11px] text-gray-500">{item.sub}</span>
                    </div>
                    {currentLanguage === item.code && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900">How PureSnap Works</h2>
                <p className="text-xs text-gray-500 mt-0.5">Simple 4-step purity check in under 3 minutes</p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  {
                    num: '1',
                    title: 'Pick a Food Item & Test',
                    desc: 'Select Milk, Turmeric, Chilli, or Cooking Oil with supported reagent or kitchen test.',
                  },
                  {
                    num: '2',
                    title: 'Follow Step-by-Step Guide',
                    desc: 'Easy guided instructions with timer countdowns and multilingual voice prompts.',
                  },
                  {
                    num: '3',
                    title: 'Scan Strip Color with Camera',
                    desc: 'Our computer-vision algorithm compares color reactions against calibrated safety charts.',
                  },
                  {
                    num: '4',
                    title: 'Get Immediate Purity Verdict',
                    desc: 'Clear Safe, Suspicious, or Unsafe outcome with health hazards and recommended actions.',
                  },
                ].map((s) => (
                  <div key={s.num} className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {s.num}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{s.title}</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Camera & Audio Access</h2>
                <p className="text-xs text-gray-500 mt-0.5">Needed for color strip analysis and voice navigation</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-left space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-200/80 flex items-center justify-center text-emerald-800 shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Phone Camera</h4>
                    <p className="text-[11px] text-gray-600">
                      Captures the test strip to extract RGB and HSV color space values. Completely processed locally on device!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-200/80 flex items-center justify-center text-emerald-800 shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Microphone & Voice Assistant</h4>
                    <p className="text-[11px] text-gray-600">
                      Enables voice commands and reads instructions aloud in your preferred language.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={requestCameraPermission}
                disabled={requestingPerms || cameraAllowed}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  cameraAllowed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                }`}
              >
                {cameraAllowed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Camera Ready!
                  </>
                ) : requestingPerms ? (
                  'Requesting Access...'
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Allow Camera Access
                  </>
                )}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Safety & Testing Notice</h2>
                <p className="text-xs text-gray-500 mt-0.5">Important prototype information</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2.5">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Preliminary Screening Tool Only</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  PureSnap is a rapid kitchen screening indicator designed for early household detection. Results must not be treated as certified laboratory chemical certificates. If a sample is marked <strong>Unsafe</strong>, avoid consumption and contact FSSAI or an accredited NABL testing facility.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-left">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-900 font-medium">
                  Offline Ready: All preset color charts and step guides work without an active internet connection.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => {
                playSound('click');
                setStep(step - 1);
              }}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              {t.back}
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Skip
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => {
                playSound('click');
                setStep(step + 1);
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer ml-auto"
            >
              <span>{t.next}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer ml-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
