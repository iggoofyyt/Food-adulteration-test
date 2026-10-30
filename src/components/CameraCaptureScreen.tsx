/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Camera,
  RotateCcw,
  Upload,
  Sparkles,
  Sun,
  Moon,
  AlertTriangle,
  CheckCircle2,
  ScanLine,
  Sliders,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { AdulterantTest, Language, TestResultRecord, DemoSampleStrip } from '../types';
import { DEMO_SAMPLE_STRIPS } from '../data/testsData';
import { TRANSLATIONS } from '../data/translations';
import { analyzeCanvasROI, classifyColorAgainstChart, hexToRgb, rgbToHsv } from '../services/colorAnalysisService';
import { playSound } from '../services/soundEffects';
import { voiceService } from '../services/voiceAssistantService';

interface CameraCaptureScreenProps {
  currentLanguage: Language;
  test: AdulterantTest;
  onAnalysisComplete: (record: TestResultRecord) => void;
  onBack: () => void;
}

export const CameraCaptureScreen: React.FC<CameraCaptureScreenProps> = ({
  currentLanguage,
  test,
  onAnalysisComplete,
  onBack,
}) => {
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [capturedImageData, setCapturedImageData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Region of Interest (ROI) relative box (normalized 0 to 1)
  const [roiBox, setRoiBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0.25,
    y: 0.35,
    width: 0.5,
    height: 0.3,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = TRANSLATIONS[currentLanguage];

  // Matching demo strips for this specific test
  const testDemoStrips = DEMO_SAMPLE_STRIPS.filter((s) => s.testTypeId === test.id);

  // Start live webcam feed
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera not supported in this browser environment');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreamActive(true);
        }
      } catch (err: unknown) {
        console.warn('Camera stream error:', err);
        setCameraError(
          'Live webcam feed is not accessible in this environment. You can upload an image or test using preset calibrated sample strips below!'
        );
        setStreamActive(false);
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture snapshot from live video
  const handleCaptureSnapshot = () => {
    playSound('shutter');
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImageData(dataUrl);
  };

  // Upload custom file / photo from disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playSound('click');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCapturedImageData(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Retake photo
  const handleRetake = () => {
    playSound('click');
    setCapturedImageData(null);
  };

  // Run Color Analysis on the captured image
  const handleAnalyzeCaptured = () => {
    if (!capturedImageData) return;
    playSound('click');
    setIsAnalyzing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = capturedImageData;

    img.onload = () => {
      setTimeout(() => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas not supported');

          ctx.drawImage(img, 0, 0);

          // Run ROI color classification
          const analysis = analyzeCanvasROI(canvas, roiBox, test.chart);

          const record: TestResultRecord = {
            id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            testTypeId: test.id,
            foodItemId: test.foodItemId,
            testName: test.name,
            foodName: test.foodItemId.toUpperCase(),
            status: analysis.status,
            extractedColor: analysis.extractedColor,
            timestamp: Date.now(),
            imageThumbnail: capturedImageData,
            confidence: analysis.confidence,
            lightingQuality: analysis.lightingQuality,
            recommendedFollowUpTestId: test.recommendedFollowUpTestId,
            notes: analysis.diagnosticDetails,
          };

          setIsAnalyzing(false);
          onAnalysisComplete(record);
        } catch (err) {
          console.error('Analysis failed', err);
          setIsAnalyzing(false);
          alert('Could not analyze color in ROI. Please retake photo.');
        }
      }, 700); // realistic diagnostic delay
    };
  };

  // Instant Demo Strip Testing
  const handleUseDemoStrip = (strip: DemoSampleStrip) => {
    playSound('click');
    setIsAnalyzing(true);

    setTimeout(() => {
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
        imageThumbnail: undefined, // Synthetic demo strip
        confidence: outcome.confidence,
        lightingQuality: outcome.lightingQuality,
        recommendedFollowUpTestId: test.recommendedFollowUpTestId,
        notes: `Sample Strip Demo: ${strip.title} (${outcome.diagnosticDetails})`,
      };

      setIsAnalyzing(false);
      onAnalysisComplete(record);
    }, 600);
  };

  return (
    <div className="space-y-4 pb-8 max-w-xl mx-auto">
      {/* Top Header */}
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

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Step 5: Color Strip Alignment
        </span>
      </div>

      {/* Main Viewport / Camera Box */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-[16/11] border-2 border-emerald-800 shadow-xl flex items-center justify-center">
        {!capturedImageData ? (
          <>
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${streamActive ? 'block' : 'hidden'}`}
            />

            {/* Camera Fallback if webcam unavailable */}
            {!streamActive && (
              <div className="p-6 text-center text-gray-300 space-y-3 max-w-xs">
                <Camera className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-xs text-gray-300 font-medium leading-relaxed">
                  {cameraError || 'Webcam initializing... You can also upload a photo or use demo strips below.'}
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Strip Photo</span>
                </button>
              </div>
            )}

            {/* Region of Interest (ROI) Overlay Targeting Box */}
            <div
              className="absolute border-2 border-emerald-400 border-dashed rounded-xl pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] flex items-center justify-center"
              style={{
                left: `${roiBox.x * 100}%`,
                top: `${roiBox.y * 100}%`,
                width: `${roiBox.width * 100}%`,
                height: `${roiBox.height * 100}%`,
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-900/90 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500 whitespace-nowrap flex items-center gap-1">
                <ScanLine className="w-3 h-3 text-emerald-400" />
                <span>Target Strip Pad Here</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Camera Guidelines Watermark */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 pointer-events-none">
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>Good room light</span>
              </span>
              <span>Keep strip flat</span>
            </div>
          </>
        ) : (
          /* Captured Photo Preview */
          <div className="relative w-full h-full">
            <img
              src={capturedImageData}
              alt="Captured strip"
              className="w-full h-full object-cover"
            />

            {/* Frozen ROI box overlay */}
            <div
              className="absolute border-2 border-emerald-400 rounded-xl pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
              style={{
                left: `${roiBox.x * 100}%`,
                top: `${roiBox.y * 100}%`,
                width: `${roiBox.width * 100}%`,
                height: `${roiBox.height * 100}%`,
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                Analysis Region (ROI)
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white space-y-3 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center animate-spin">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-300">{t.analyzing}</h3>
              <p className="text-[11px] text-gray-400 mt-1 max-w-xs">
                Computing mean HSV values & testing against {test.chart.colorThresholds.length} calibrated safety ranges...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Primary Capture / Analysis Controls */}
      {!capturedImageData ? (
        <div className="flex items-center justify-center gap-4 py-2">
          {/* Upload Button */}
          <button
            onClick={() => {
              playSound('click');
              fileInputRef.current?.click();
            }}
            className="p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer"
            title="Upload from gallery"
          >
            <Upload className="w-5 h-5" />
          </button>

          {/* Shutter Capture Button */}
          <button
            onClick={handleCaptureSnapshot}
            disabled={!streamActive}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-200 cursor-pointer active:scale-95 transition-transform"
            title="Capture photo"
          >
            <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
              <Camera className="w-8 h-8 fill-white" />
            </div>
          </button>

          {/* ROI Size Toggle */}
          <button
            onClick={() => {
              playSound('click');
              setRoiBox((prev) =>
                prev.width === 0.5
                  ? { x: 0.15, y: 0.25, width: 0.7, height: 0.5 }
                  : { x: 0.25, y: 0.35, width: 0.5, height: 0.3 }
              );
            }}
            className="p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer"
            title="Toggle Targeting Box Size"
          >
            <Sliders className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Action buttons after photo is taken */
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleRetake}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.retake}</span>
          </button>

          <button
            onClick={handleAnalyzeCaptured}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-7 py-3 rounded-xl font-extrabold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer ml-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.analyze}</span>
          </button>
        </div>
      )}

      {/* Preset Demo Strips for instant simulation */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-950">{t.useDemoStrip}</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            1-Click Test
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(testDemoStrips.length > 0 ? testDemoStrips : DEMO_SAMPLE_STRIPS.slice(0, 2)).map((strip) => (
            <button
              key={strip.id}
              onClick={() => handleUseDemoStrip(strip)}
              disabled={isAnalyzing}
              className="p-2.5 rounded-xl bg-white border border-amber-200 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center justify-between gap-3 hover:shadow-xs group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div
                  className="w-5 h-8 rounded-md shrink-0 border border-gray-300 shadow-xs group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: strip.stripColorHex }}
                />
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-gray-900 block truncate group-hover:text-amber-800">
                    {strip.title}
                  </span>
                  <span className="text-[10px] text-gray-500 block truncate">
                    Expected: {strip.expectedStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-700 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
