/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Language,
  TestResultRecord,
  AdulterantTest,
  DemoSampleStrip,
} from './types';
import { TESTS_DATA, DEMO_SAMPLE_STRIPS, FOOD_ITEMS } from './data/testsData';
import {
  getStoredLanguage,
  saveStoredLanguage,
  isOnboardingCompleted,
  setOnboardingCompleted,
  getStoredTestHistory,
  saveTestResultRecord,
  clearStoredHistory,
  deleteTestRecord,
  seedSampleHistory,
} from './services/storageService';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { FoodSelectScreen } from './components/FoodSelectScreen';
import { TestSelectScreen } from './components/TestSelectScreen';
import { StepWizardScreen } from './components/StepWizardScreen';
import { CameraCaptureScreen } from './components/CameraCaptureScreen';
import { ResultScreen } from './components/ResultScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { LearnHubScreen } from './components/LearnHubScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { playSound } from './services/soundEffects';
import { classifyColorAgainstChart, hexToRgb, rgbToHsv } from './services/colorAnalysisService';
import { Wifi, Battery, Signal, Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [selectedFoodId, setSelectedFoodId] = useState<string>('milk');
  const [selectedTestId, setSelectedTestId] = useState<string>('milk_detergent');
  const [currentRecord, setCurrentRecord] = useState<TestResultRecord | null>(null);
  const [recentTests, setRecentTests] = useState<TestResultRecord[]>([]);

  // Modals & Frame
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [isSimulatorMode, setIsSimulatorMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize storage & preferences
  useEffect(() => {
    const lang = getStoredLanguage();
    setCurrentLanguage(lang);

    let history = getStoredTestHistory();
    // Pre-populate with realistic benchmark testing dataset if empty so statistics charts look populated
    if (history.length === 0) {
      history = seedSampleHistory();
    }
    setRecentTests(history);

    if (!isOnboardingCompleted()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleSeedData = () => {
    const seeded = seedSampleHistory();
    setRecentTests(seeded);
    showToast('Loaded benchmark dataset across 12 tests!');
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    saveStoredLanguage(lang);
  };

  const handleOnboardingComplete = () => {
    setOnboardingCompleted(true);
    setShowOnboarding(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Navigation handlers
  const handleStartNewTest = () => {
    setActiveScreen('food_select');
  };

  const handleSelectFood = (foodId: string) => {
    setSelectedFoodId(foodId);
    setActiveScreen('test_select');
  };

  const handleSelectTest = (testId: string) => {
    setSelectedTestId(testId);
    setActiveScreen('step_wizard');
  };

  const handleProceedToCamera = () => {
    setActiveScreen('camera_capture');
  };

  const handleAnalysisComplete = (record: TestResultRecord) => {
    setCurrentRecord(record);
    setActiveScreen('result');
  };

  const handleSaveRecord = (record: TestResultRecord) => {
    const updated = saveTestResultRecord(record);
    setRecentTests(updated);
    showToast('Purity test result saved to offline history!');
  };

  const handleRunFollowUpTest = (testId: string) => {
    setSelectedTestId(testId);
    setActiveScreen('step_wizard');
  };

  const handleRetakeTest = () => {
    setActiveScreen('camera_capture');
  };

  const handleClearHistory = () => {
    clearStoredHistory();
    setRecentTests([]);
    showToast('History cleared.');
  };

  const handleDeleteRecord = (id: string) => {
    const updated = deleteTestRecord(id);
    setRecentTests(updated);
    showToast('Record deleted.');
  };

  const handleSelectRecentTest = (record: TestResultRecord) => {
    setCurrentRecord(record);
    setSelectedTestId(record.testTypeId);
    setActiveScreen('result');
  };

  // 1-Click Demo Strip Shortcut
  const handleQuickDemoStrip = (stripId: string) => {
    const strip = DEMO_SAMPLE_STRIPS.find((s) => s.id === stripId);
    if (!strip) return;

    const test = TESTS_DATA[strip.testTypeId];
    if (!test) return;

    setSelectedFoodId(test.foodItemId);
    setSelectedTestId(test.id);

    const rgb = hexToRgb(strip.stripColorHex);
    const { h, s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const luminance = Math.round(0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b);

    const colorData = {
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      h,
      s,
      v,
      hex: strip.stripColorHex,
      luminance,
    };

    const outcome = classifyColorAgainstChart(colorData, test.chart);

    const record: TestResultRecord = {
      id: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      testTypeId: test.id,
      foodItemId: test.foodItemId,
      testName: test.name,
      foodName: test.foodItemId.toUpperCase(),
      status: outcome.status,
      extractedColor: colorData,
      timestamp: Date.now(),
      confidence: outcome.confidence,
      lightingQuality: outcome.lightingQuality,
      recommendedFollowUpTestId: test.recommendedFollowUpTestId,
      notes: `Demo Calibration Strip: ${strip.title}`,
    };

    setCurrentRecord(record);
    setActiveScreen('result');
  };

  const currentTest = TESTS_DATA[selectedTestId] || TESTS_DATA['milk_detergent'];

  // Current screen content
  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return (
          <HomeScreen
            currentLanguage={currentLanguage}
            recentTests={recentTests}
            onStartNewTest={handleStartNewTest}
            onSelectFood={handleSelectFood}
            onNavigateHistory={() => setActiveScreen('history')}
            onNavigateLearn={() => setActiveScreen('learn')}
            onOpenVoiceAssistant={() => setShowVoiceModal(true)}
            onSelectRecentTest={handleSelectRecentTest}
            onQuickDemoStrip={handleQuickDemoStrip}
          />
        );

      case 'food_select':
        return (
          <FoodSelectScreen
            currentLanguage={currentLanguage}
            onSelectFood={handleSelectFood}
            onBack={() => setActiveScreen('home')}
          />
        );

      case 'test_select':
        return (
          <TestSelectScreen
            currentLanguage={currentLanguage}
            foodId={selectedFoodId}
            onSelectTest={handleSelectTest}
            onBack={() => setActiveScreen('food_select')}
          />
        );

      case 'step_wizard':
        return (
          <StepWizardScreen
            currentLanguage={currentLanguage}
            test={currentTest}
            onProceedToCamera={handleProceedToCamera}
            onBack={() => setActiveScreen('test_select')}
          />
        );

      case 'camera_capture':
        return (
          <CameraCaptureScreen
            currentLanguage={currentLanguage}
            test={currentTest}
            onAnalysisComplete={handleAnalysisComplete}
            onBack={() => setActiveScreen('step_wizard')}
          />
        );

      case 'result':
        return currentRecord ? (
          <ResultScreen
            currentLanguage={currentLanguage}
            record={currentRecord}
            test={TESTS_DATA[currentRecord.testTypeId] || currentTest}
            onSaveRecord={handleSaveRecord}
            onRunFollowUpTest={handleRunFollowUpTest}
            onNavigateHome={() => setActiveScreen('home')}
            onRetakeTest={handleRetakeTest}
          />
        ) : (
          <HomeScreen
            currentLanguage={currentLanguage}
            recentTests={recentTests}
            onStartNewTest={handleStartNewTest}
            onSelectFood={handleSelectFood}
            onNavigateHistory={() => setActiveScreen('history')}
            onNavigateLearn={() => setActiveScreen('learn')}
            onOpenVoiceAssistant={() => setShowVoiceModal(true)}
            onSelectRecentTest={handleSelectRecentTest}
            onQuickDemoStrip={handleQuickDemoStrip}
          />
        );

      case 'history':
        return (
          <HistoryScreen
            currentLanguage={currentLanguage}
            history={recentTests}
            onSelectRecord={handleSelectRecentTest}
            onClearHistory={handleClearHistory}
            onDeleteRecord={handleDeleteRecord}
            onSeedData={handleSeedData}
            onBack={() => setActiveScreen('home')}
          />
        );

      case 'learn':
        return (
          <LearnHubScreen
            currentLanguage={currentLanguage}
            onBack={() => setActiveScreen('home')}
            onStartTestForFood={handleSelectFood}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 font-sans flex flex-col items-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 z-50 bg-gray-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-gray-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container or Phone Shell Wrapper */}
      <div
        className={`w-full transition-all duration-300 ${
          isSimulatorMode
            ? 'max-w-[420px] my-4 rounded-[44px] shadow-2xl border-[10px] border-slate-800 bg-white overflow-hidden ring-1 ring-slate-900/30'
            : 'max-w-4xl min-h-screen bg-white shadow-xs'
        }`}
      >
        {/* Android Simulator Status Bar */}
        {isSimulatorMode && (
          <div className="bg-emerald-950 text-emerald-200 px-6 py-2 text-[11px] font-semibold flex items-center justify-between select-none border-b border-emerald-900">
            <span className="font-mono">10:30 AM</span>
            <div className="w-16 h-4 bg-black/60 rounded-full mx-auto" />
            <div className="flex items-center gap-2">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Global Navigation Header */}
        <Header
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onOpenVoiceAssistant={() => setShowVoiceModal(true)}
          onNavigateHome={() => setActiveScreen('home')}
          onNavigateHistory={() => setActiveScreen('history')}
          onNavigateLearn={() => setActiveScreen('learn')}
          isSimulatorMode={isSimulatorMode}
          onToggleSimulatorMode={() => setIsSimulatorMode(!isSimulatorMode)}
          activeScreen={activeScreen}
        />

        {/* Dynamic Screen Viewport */}
        <main className="p-4 sm:p-6 min-h-[calc(100vh-80px)]">{renderScreen()}</main>

        {/* Android Simulator Bottom Gesture Pill */}
        {isSimulatorMode && (
          <div className="py-2.5 bg-white flex justify-center border-t border-gray-100">
            <div className="w-28 h-1 bg-gray-400 rounded-full" />
          </div>
        )}
      </div>

      {/* Onboarding Dialog */}
      {showOnboarding && (
        <OnboardingModal
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Voice Assistant Modal */}
      {showVoiceModal && (
        <VoiceAssistantModal
          currentLanguage={currentLanguage}
          onClose={() => setShowVoiceModal(false)}
          onSelectFood={(foodId) => {
            handleSelectFood(foodId);
            setShowVoiceModal(false);
          }}
          onStartNewTest={() => {
            handleStartNewTest();
            setShowVoiceModal(false);
          }}
          onNavigateHome={() => {
            setActiveScreen('home');
            setShowVoiceModal(false);
          }}
          onNavigateHistory={() => {
            setActiveScreen('history');
            setShowVoiceModal(false);
          }}
          onNavigateLearn={() => {
            setActiveScreen('learn');
            setShowVoiceModal(false);
          }}
          currentContextText={
            activeScreen === 'result' && currentRecord
              ? `Result is ${currentRecord.status}. ${currentRecord.testName}.`
              : 'PureSnap Food Adulteration Screening'
          }
        />
      )}
    </div>
  );
}
