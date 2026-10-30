/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ColorThreshold, ExtractedColor, PresetColorChart, TestStatus } from '../types';

export interface AnalysisOutcome {
  status: TestStatus;
  confidence: 'High' | 'Medium' | 'Low';
  lightingQuality: 'good' | 'low' | 'overexposed';
  extractedColor: ExtractedColor;
  matchedThreshold?: ColorThreshold;
  diagnosticDetails: string;
}

/**
 * Converts RGB values (0-255) to HSV (H: 0-360, S: 0-100, V: 0-100)
 */
export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const v = Math.round(max * 100);

  return { h, s, v };
}

/**
 * Converts RGB to HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts HEX to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * Measures shortest circular distance between two hues on 360 circle
 */
function hueDistance(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Checks if a given hue falls in range, supporting wraps across 0 (e.g. Red: 340-20)
 */
function isHueInRange(h: number, min: number, max: number): boolean {
  if (min <= max) {
    return h >= min && h <= max;
  }
  // Wrap-around across 360 (e.g. 330 to 30)
  return h >= min || h <= max;
}

/**
 * Analyzes average color in an HTMLCanvasElement within a relative Region of Interest (ROI)
 */
export function analyzeCanvasROI(
  canvas: HTMLCanvasElement,
  roi: { x: number; y: number; width: number; height: number }, // coordinates 0 to 1
  chart: PresetColorChart
): AnalysisOutcome {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  const sx = Math.max(0, Math.floor(roi.x * canvas.width));
  const sy = Math.max(0, Math.floor(roi.y * canvas.height));
  const sw = Math.min(canvas.width - sx, Math.floor(roi.width * canvas.width));
  const sh = Math.min(canvas.height - sy, Math.floor(roi.height * canvas.height));

  if (sw <= 0 || sh <= 0) {
    throw new Error('Invalid ROI selection');
  }

  const imgData = ctx.getImageData(sx, sy, sw, sh);
  const data = imgData.data;

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let pixelCount = 0;

  // Step sampling for speed and robust averaging
  const step = Math.max(1, Math.floor((sw * sh) / 10000));

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a > 50) {
      // Exclude pure transparent
      totalR += r;
      totalG += g;
      totalB += b;
      pixelCount++;
    }
  }

  if (pixelCount === 0) {
    throw new Error('No visible pixels in Region of Interest');
  }

  const avgR = Math.round(totalR / pixelCount);
  const avgG = Math.round(totalG / pixelCount);
  const avgB = Math.round(totalB / pixelCount);

  // Perceived luminance (ITU-R BT.709)
  const luminance = Math.round(0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB);
  const { h, s, v } = rgbToHsv(avgR, avgG, avgB);
  const hex = rgbToHex(avgR, avgG, avgB);

  const extractedColor: ExtractedColor = {
    r: avgR,
    g: avgG,
    b: avgB,
    h,
    s,
    v,
    hex,
    luminance,
  };

  return classifyColorAgainstChart(extractedColor, chart);
}

/**
 * Classifies extracted color against the preset calibrated color chart
 */
export function classifyColorAgainstChart(
  color: ExtractedColor,
  chart: PresetColorChart
): AnalysisOutcome {
  let lightingQuality: 'good' | 'low' | 'overexposed' = 'good';
  if (color.luminance < 38) {
    lightingQuality = 'low';
  } else if (color.luminance > 235 && color.s < 15) {
    lightingQuality = 'overexposed';
  }

  // Find exact in-range match among thresholds
  const exactMatches = chart.colorThresholds.filter((thresh) => {
    const hueMatches = isHueInRange(color.h, thresh.hMin, thresh.hMax);
    const satMatches = color.s >= thresh.sMin && color.s <= thresh.sMax;
    const valMatches = color.v >= thresh.vMin && color.v <= thresh.vMax;
    return hueMatches && satMatches && valMatches;
  });

  if (exactMatches.length === 1) {
    const match = exactMatches[0];
    const confidence = lightingQuality === 'good' ? 'High' : 'Medium';
    return {
      status: match.label,
      confidence,
      lightingQuality,
      extractedColor: color,
      matchedThreshold: match,
      diagnosticDetails: `Direct match with ${match.label.toUpperCase()} profile (${match.labelDescription}). H:${color.h}° S:${color.s}% V:${color.v}%`,
    };
  }

  // If overlapping or multiple matches
  if (exactMatches.length > 1) {
    // If one is unsafe, prioritize caution or suspicious
    const hasUnsafe = exactMatches.some((m) => m.label === 'unsafe');
    const status: TestStatus = hasUnsafe ? 'suspicious' : exactMatches[0].label;
    return {
      status,
      confidence: 'Medium',
      lightingQuality,
      extractedColor: color,
      matchedThreshold: exactMatches[0],
      diagnosticDetails: `Overlapping threshold region detected. Defaulting to ${status.toUpperCase()} for safety.`,
    };
  }

  // If outside exact boxes: calculate nearest threshold distance
  let closestThreshold: ColorThreshold = chart.colorThresholds[0];
  let minScore = Infinity;

  for (const thresh of chart.colorThresholds) {
    // Center hue of range
    const centerH = (thresh.hMin + thresh.hMax) / 2;
    const centerS = (thresh.sMin + thresh.sMax) / 2;
    const centerV = (thresh.vMin + thresh.vMax) / 2;

    const hDiff = hueDistance(color.h, centerH);
    const sDiff = Math.abs(color.s - centerS);
    const vDiff = Math.abs(color.v - centerV);

    // Weighted distance (Hue is most informative for chemical color changes)
    const score = hDiff * 2.5 + sDiff * 1.0 + vDiff * 0.8;

    if (score < minScore) {
      minScore = score;
      closestThreshold = thresh;
    }
  }

  // If lighting is low or overexposed, degrade confidence or shift to suspicious
  let finalStatus: TestStatus = closestThreshold.label;
  let confidence: 'High' | 'Medium' | 'Low' = 'Medium';

  if (minScore > 90) {
    // Too far from expected colors
    finalStatus = 'suspicious';
    confidence = 'Low';
  } else if (lightingQuality !== 'good') {
    confidence = 'Low';
    if (finalStatus === 'safe' && minScore > 40) {
      finalStatus = 'suspicious';
    }
  }

  return {
    status: finalStatus,
    confidence,
    lightingQuality,
    extractedColor: color,
    matchedThreshold: closestThreshold,
    diagnosticDetails: `Nearest calibrated match: ${closestThreshold.label.toUpperCase()} (${closestThreshold.labelDescription}). Match variance score: ${Math.round(minScore)}`,
  };
}
