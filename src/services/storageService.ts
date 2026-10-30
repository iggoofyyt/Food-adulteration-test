/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, TestResultRecord } from '../types';

const STORAGE_KEYS = {
  LANGUAGE: 'puresnap_lang',
  TEST_HISTORY: 'puresnap_test_history',
  ONBOARDING_DONE: 'puresnap_onboarding_done',
  LAST_DEVICE_VIEW: 'puresnap_device_view',
};

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (saved && ['en', 'hi', 'ta', 'te', 'bn'].includes(saved)) {
      return saved as Language;
    }
  } catch (err) {
    console.warn(err);
  }
  return 'en';
}

export function saveStoredLanguage(lang: Language) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (err) {
    console.warn(err);
  }
}

export function isOnboardingCompleted(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true';
  } catch {
    return false;
  }
}

export function setOnboardingCompleted(completed = true) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, completed ? 'true' : 'false');
  } catch (err) {
    console.warn(err);
  }
}

export function getStoredTestHistory(): TestResultRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEST_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse test history', err);
    return [];
  }
}

export function saveTestResultRecord(record: TestResultRecord): TestResultRecord[] {
  try {
    const current = getStoredTestHistory();
    // Keep up to 50 latest records
    const updated = [record, ...current.filter((r) => r.id !== record.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save test record', err);
    return [];
  }
}

export function clearStoredHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TEST_HISTORY);
  } catch (err) {
    console.warn(err);
  }
}

export function deleteTestRecord(id: string): TestResultRecord[] {
  try {
    const current = getStoredTestHistory();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn(err);
    return [];
  }
}

export function seedSampleHistory(): TestResultRecord[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const sampleRecords: TestResultRecord[] = [
    {
      id: `seed_1`,
      testTypeId: 'milk_detergent',
      foodItemId: 'milk',
      testName: 'Detergent Detection Test',
      foodName: 'MILK',
      status: 'safe',
      extractedColor: { r: 254, g: 240, b: 138, h: 53, s: 46, v: 100, hex: '#fef08a', luminance: 236 },
      timestamp: now - 6 * day,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'Direct match with SAFE profile. Clean milk.',
    },
    {
      id: `seed_2`,
      testTypeId: 'milk_detergent',
      foodItemId: 'milk',
      testName: 'Detergent Detection Test',
      foodName: 'MILK',
      status: 'unsafe',
      extractedColor: { r: 37, g: 99, b: 235, h: 221, s: 84, v: 92, hex: '#2563eb', luminance: 95 },
      timestamp: now - 5 * day,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'Surfactant detected. Deep blue reaction.',
    },
    {
      id: `seed_3`,
      testTypeId: 'turmeric_metanil',
      foodItemId: 'turmeric',
      testName: 'Metanil Yellow Chemical Test',
      foodName: 'TURMERIC',
      status: 'safe',
      extractedColor: { r: 234, g: 179, b: 8, h: 45, s: 97, v: 92, hex: '#eab308', luminance: 178 },
      timestamp: now - 5 * day,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'Pure curcumin confirmed.',
    },
    {
      id: `seed_4`,
      testTypeId: 'turmeric_metanil',
      foodItemId: 'turmeric',
      testName: 'Metanil Yellow Chemical Test',
      foodName: 'TURMERIC',
      status: 'unsafe',
      extractedColor: { r: 219, g: 39, b: 119, h: 333, s: 82, v: 86, hex: '#db2777', luminance: 96 },
      timestamp: now - 4 * day,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'Metanil Yellow dye detected.',
    },
    {
      id: `seed_5`,
      testTypeId: 'milk_urea',
      foodItemId: 'milk',
      testName: 'Urea & Fertilizer Test',
      foodName: 'MILK',
      status: 'safe',
      extractedColor: { r: 254, g: 240, b: 138, h: 53, s: 46, v: 100, hex: '#fef08a', luminance: 236 },
      timestamp: now - 3 * day,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'Normal physiological nitrogen levels.',
    },
    {
      id: `seed_6`,
      testTypeId: 'chilli_dyes',
      foodItemId: 'chilli',
      testName: 'Artificial Dye / Sudan Red Test',
      foodName: 'CHILLI',
      status: 'suspicious',
      extractedColor: { r: 234, g: 88, b: 12, h: 21, s: 95, v: 92, hex: '#ea580c', luminance: 120 },
      timestamp: now - 3 * day,
      confidence: 'Medium',
      lightingQuality: 'good',
      notes: 'Orange water trail detected.',
    },
    {
      id: `seed_7`,
      testTypeId: 'oil_argemone',
      foodItemId: 'oil',
      testName: 'Argemone Oil Chemical Test',
      foodName: 'OIL',
      status: 'safe',
      extractedColor: { r: 234, g: 179, b: 8, h: 45, s: 97, v: 92, hex: '#eab308', luminance: 178 },
      timestamp: now - 2 * day,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'No sanguinarine precipitate formed.',
    },
    {
      id: `seed_8`,
      testTypeId: 'milk_detergent',
      foodItemId: 'milk',
      testName: 'Detergent Detection Test',
      foodName: 'MILK',
      status: 'safe',
      extractedColor: { r: 254, g: 240, b: 138, h: 53, s: 46, v: 100, hex: '#fef08a', luminance: 236 },
      timestamp: now - 2 * day,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'Clean fresh batch test passed.',
    },
    {
      id: `seed_9`,
      testTypeId: 'oil_argemone',
      foodItemId: 'oil',
      testName: 'Argemone Oil Chemical Test',
      foodName: 'OIL',
      status: 'unsafe',
      extractedColor: { r: 127, g: 29, b: 29, h: 0, s: 77, v: 50, hex: '#7f1d1d', luminance: 48 },
      timestamp: now - 1 * day,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'Red-brown precipitate confirmed.',
    },
    {
      id: `seed_10`,
      testTypeId: 'chilli_dyes',
      foodItemId: 'chilli',
      testName: 'Artificial Dye / Sudan Red Test',
      foodName: 'CHILLI',
      status: 'safe',
      extractedColor: { r: 185, g: 28, b: 28, h: 0, s: 85, v: 73, hex: '#b91c1c', luminance: 55 },
      timestamp: now - 1 * day,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'Pure natural chilli pigment.',
    },
    {
      id: `seed_11`,
      testTypeId: 'turmeric_metanil',
      foodItemId: 'turmeric',
      testName: 'Metanil Yellow Chemical Test',
      foodName: 'TURMERIC',
      status: 'safe',
      extractedColor: { r: 234, g: 179, b: 8, h: 45, s: 97, v: 92, hex: '#eab308', luminance: 178 },
      timestamp: now - 8 * 60 * 60 * 1000,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'Pure curcumin batch.',
    },
    {
      id: `seed_12`,
      testTypeId: 'milk_urea',
      foodItemId: 'milk',
      testName: 'Urea & Fertilizer Test',
      foodName: 'MILK',
      status: 'unsafe',
      extractedColor: { r: 234, g: 88, b: 12, h: 21, s: 95, v: 92, hex: '#ea580c', luminance: 120 },
      timestamp: now - 2 * 60 * 60 * 1000,
      confidence: 'High',
      lightingQuality: 'good',
      notes: 'Excess nitrogen fertilizer detected.',
    },
  ];

  try {
    localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(sampleRecords));
  } catch (err) {
    console.warn(err);
  }
  return sampleRecords;
}

