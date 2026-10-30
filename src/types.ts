/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn';

export type TestStatus = 'safe' | 'suspicious' | 'unsafe';

export interface FoodItem {
  id: string;
  name: string;
  hindiName: string;
  category: string;
  iconName: string;
  description: string;
  badge: string;
}

export type StepType = 'info' | 'timer' | 'camera' | 'prep';

export interface TestStep {
  stepNumber: number;
  title: string;
  description: string;
  type: StepType;
  durationSeconds?: number;
  tip?: string;
  visualIcon?: string;
}

export interface ColorThreshold {
  label: TestStatus;
  hMin: number;
  hMax: number;
  sMin: number;
  sMax: number;
  vMin: number;
  vMax: number;
  hexSample: string;
  labelDescription: string;
}

export interface PresetColorChart {
  testTypeId: string;
  colorThresholds: ColorThreshold[];
  defaultSafeHex: string;
  defaultUnsafeHex: string;
  adulterantExpectedHex: string;
}

export interface ResultExplanation {
  status: TestStatus;
  title: string;
  summary: string;
  possibleAdulterant: string;
  healthRisk: string;
  advice: string[];
  suggestedAction: string;
}

export interface AdulterantTest {
  id: string;
  foodItemId: string;
  name: string;
  hindiName: string;
  adulterant: string;
  estimatedTimeMinutes: number;
  materials: string[];
  steps: TestStep[];
  chart: PresetColorChart;
  explanations: Record<TestStatus, ResultExplanation>;
  recommendedFollowUpTestId?: string;
}

export interface ExtractedColor {
  r: number;
  g: number;
  b: number;
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
  hex: string;
  luminance: number; // 0-255
}

export interface TestResultRecord {
  id: string;
  testTypeId: string;
  foodItemId: string;
  testName: string;
  foodName: string;
  status: TestStatus;
  extractedColor: ExtractedColor;
  timestamp: number;
  imageThumbnail?: string;
  confidence: 'High' | 'Medium' | 'Low';
  lightingQuality: 'good' | 'low' | 'overexposed';
  notes?: string;
  recommendedFollowUpTestId?: string;
}

export interface DemoSampleStrip {
  id: string;
  testTypeId: string;
  title: string;
  expectedStatus: TestStatus;
  stripColorHex: string;
  description: string;
  thumbnailUrl?: string;
}
