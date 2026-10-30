/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Volume2,
  BookmarkCheck,
  RotateCcw,
  Home,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  Download,
  Share2,
  Info,
} from 'lucide-react';
import { AdulterantTest, Language, TestResultRecord } from '../types';
import { TESTS_DATA } from '../data/testsData';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../services/soundEffects';
import { voiceService } from '../services/voiceAssistantService';

interface ResultScreenProps {
  currentLanguage: Language;
  record: TestResultRecord;
  test: AdulterantTest;
  onSaveRecord: (record: TestResultRecord) => void;
  onRunFollowUpTest: (testId: string) => void;
  onNavigateHome: () => void;
  onRetakeTest: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  currentLanguage,
  record,
  test,
  onSaveRecord,
  onRunFollowUpTest,
  onNavigateHome,
  onRetakeTest,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const t = TRANSLATIONS[currentLanguage];

  const explanation = test.explanations[record.status];
  const followUpTest = record.recommendedFollowUpTestId
    ? TESTS_DATA[record.recommendedFollowUpTestId]
    : null;

  // Play result sound & read aloud automatically on mount
  useEffect(() => {
    if (record.status === 'safe') {
      playSound('safe');
    } else {
      playSound('alert');
    }

    const voiceSummary =
      currentLanguage === 'hi'
        ? `परीक्षण परिणाम है: ${t['status' + (record.status.charAt(0).toUpperCase() + record.status.slice(1)) as 'statusSafe' | 'statusSuspicious' | 'statusUnsafe']}. ${explanation.summary}`
        : `Test result is: ${record.status.toUpperCase()}. ${explanation.summary} ${explanation.advice[0] || ''}`;

    voiceService.speak(voiceSummary, currentLanguage);

    return () => {
      voiceService.stopSpeaking();
    };
  }, [record.status, currentLanguage, explanation, t]);

  const handleSave = () => {
    playSound('safe');
    onSaveRecord(record);
    setIsSaved(true);
  };

  const handleDownloadReport = () => {
    playSound('click');
    const reportText = `
PURESNAP TESTER - FOOD PURITY SCREENING REPORT
----------------------------------------------
Test ID: ${record.id}
Date: ${new Date(record.timestamp).toLocaleString()}
Food Item: ${record.foodName}
Test Type: ${record.testName}

RESULT STATUS: ${record.status.toUpperCase()}
Confidence: ${record.confidence}
Extracted Color: HEX ${record.extractedColor.hex} (H:${record.extractedColor.h}°, S:${record.extractedColor.s}%, V:${record.extractedColor.v}%)
Lighting Quality: ${record.lightingQuality}

SUMMARY:
${explanation.summary}

POSSIBLE ADULTERANT:
${explanation.possibleAdulterant}

HEALTH HAZARD:
${explanation.healthRisk}

RECOMMENDED ACTIONS:
${explanation.advice.map((a, i) => `${i + 1}. ${a}`).join('\n')}

NOTICE:
PureSnap is an offline screening indicator and does not replace accredited NABL laboratory testing.
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PureSnap_Report_${record.testTypeId}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStatusBanner = () => {
    switch (record.status) {
      case 'safe':
        return (
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-200 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-200">
                Purity Verdict
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
                {t.statusSafe.toUpperCase()}
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 max-w-md mx-auto">
                {explanation.title}
              </p>
            </div>
          </div>
        );

      case 'suspicious':
        return (
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-10 h-10 text-amber-200 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-200">
                Caution Advised
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
                {t.statusSuspicious.toUpperCase()}
              </h1>
              <p className="text-amber-100 text-xs sm:text-sm font-medium mt-1 max-w-md mx-auto">
                {explanation.title}
              </p>
            </div>
          </div>
        );

      case 'unsafe':
        return (
          <div className="bg-gradient-to-br from-rose-600 to-red-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden animate-pulse-gentle">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center shadow-inner">
              <AlertCircle className="w-10 h-10 text-rose-200 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-rose-200">
                Hazard Alert
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
                {t.statusUnsafe.toUpperCase()}
              </h1>
              <p className="text-rose-100 text-xs sm:text-sm font-medium mt-1 max-w-md mx-auto">
                {explanation.title}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      {/* Status Hero Card */}
      {renderStatusBanner()}

      {/* Voice Read Aloud Floating Pill */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => {
            const fullText = `${record.status.toUpperCase()}. ${explanation.title}. ${explanation.summary}. ${explanation.advice.join('. ')}`;
            voiceService.speak(fullText, currentLanguage);
          }}
          className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 py-1.5 px-3.5 rounded-full border border-emerald-200 cursor-pointer transition-colors"
        >
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>Read Result Aloud</span>
        </button>

        <span className="text-xs text-gray-500 font-semibold">
          Confidence: <span className="text-gray-900 font-bold">{record.confidence}</span>
        </span>
      </div>

      {/* Lighting Quality Warning if low */}
      {record.lightingQuality !== 'good' && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Lighting Warning: </span>
            {record.lightingQuality === 'low' ? t.lightingLow : t.lightingOverexposed}
          </div>
        </div>
      )}

      {/* Colorimetric Details Card */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Computer Vision Color Breakdown</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Sample Swatch */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border border-gray-300 shadow-inner shrink-0"
              style={{ backgroundColor: record.extractedColor.hex }}
            />
            <div>
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Sample Color</span>
              <span className="text-xs font-mono font-bold text-gray-800">{record.extractedColor.hex}</span>
            </div>
          </div>

          {/* HSV Metrics */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] text-gray-400 font-semibold block uppercase">HSV Coordinates</span>
            <span className="text-xs font-mono font-bold text-gray-800">
              H:{record.extractedColor.h}° S:{record.extractedColor.s}% V:{record.extractedColor.v}%
            </span>
          </div>

          {/* Reference Safe Color */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div
              className="w-10 h-10 rounded-xl border border-gray-300 shadow-inner shrink-0"
              style={{ backgroundColor: test.chart.defaultSafeHex }}
            />
            <div>
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Calibrated Safe</span>
              <span className="text-xs font-mono font-bold text-gray-800">{test.chart.defaultSafeHex}</span>
            </div>
          </div>
        </div>

        {record.notes && (
          <p className="text-[11px] text-gray-500 font-mono bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            {record.notes}
          </p>
        )}
      </div>

      {/* Explanation & Health Advice Card */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Diagnostic Explanation
          </h3>
          <p className="text-sm font-semibold text-gray-900 mt-1 leading-relaxed">
            {explanation.summary}
          </p>
        </div>

        {explanation.possibleAdulterant && (
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                Target Adulterant: {explanation.possibleAdulterant}
              </h4>
              <p className="text-xs text-rose-800/90 mt-0.5">{explanation.healthRisk}</p>
            </div>
          </div>
        )}

        {/* Actionable Advice List */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Recommended Action Steps:
          </h4>
          <ul className="space-y-2">
            {explanation.advice.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Official FSSAI Authority Info for Unsafe */}
        {record.status === 'unsafe' && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-950">
                National Food Safety Toll-Free Helpline: 1800112100
              </h4>
              <p className="text-[11px] text-red-800 mt-0.5">
                Report adulterated food merchants directly to the Food Safety and Standards Authority of India (FSSAI) or file on consumer grievance portal.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Smart Follow-Up Test Recommendation */}
      {followUpTest && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-200/60 px-2 py-0.5 rounded-md inline-block">
              Smart Recommendation
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
              Run Next Test: {followUpTest.name}
            </h4>
            <p className="text-xs text-gray-600">
              Cross-verify this same food sample for {followUpTest.adulterant} to confirm safety.
            </p>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onRunFollowUpTest(followUpTest.id);
            }}
            className="flex items-center justify-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <span>Run {followUpTest.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
        {/* Save to History */}
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center justify-center gap-1.5 p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            isSaved
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>{isSaved ? 'Saved to History' : 'Save Result'}</span>
        </button>

        {/* Retake */}
        <button
          onClick={() => {
            playSound('click');
            onRetakeTest();
          }}
          className="flex items-center justify-center gap-1.5 p-3 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Test</span>
        </button>

        {/* Download Report */}
        <button
          onClick={handleDownloadReport}
          className="flex items-center justify-center gap-1.5 p-3 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>

        {/* Back to Home */}
        <button
          onClick={() => {
            playSound('click');
            onNavigateHome();
          }}
          className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>
      </div>

      {/* Safety Notice Footer */}
      <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-center">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          <strong>Notice:</strong> {t.disclaimerText}
        </p>
      </div>
    </div>
  );
};
