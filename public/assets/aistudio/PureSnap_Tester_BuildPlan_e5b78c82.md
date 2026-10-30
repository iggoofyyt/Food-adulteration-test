# PureSnap Tester – Detailed Build Plan (Hackathon Prototype)

---

## 1. Problem Statement

Food adulteration is a persistent and often invisible threat in India, especially in everyday staples like milk, spices, and cooking oil. While national standards (e.g., FSSAI) exist, quality checks are mostly centralized and opaque:

- Ordinary consumers and small vendors **cannot easily test** food items at the point of purchase.
- Existing chemical tests are **hard to interpret** (color changes, timings, measurements).
- Certified lab tests are **expensive, time-consuming, and inaccessible** for daily checks.
- There is **low awareness** of simple, validated reagent or kitchen-based tests that can act as an early warning.

This creates **information asymmetry**: producers and labs know more about food quality than consumers. Families often consume potentially adulterated food without any simple, real-time way of checking purity themselves.

**Core problem:**  
There is no **simple, low-cost, and user-friendly mobile tool** that guides users through safe food adulteration tests and interprets complex color reactions into **easy safety indicators** (safe / suspicious / unsafe), especially for Indian households with varying literacy and language preferences.

---

## 2. Solution Overview

**PureSnap Tester** is a beginner-friendly Android mobile app that works with basic reagent strips or simple kitchen-available tests to help users detect common adulterants in daily food items.

Core idea:

- Use **guided instructions + camera-based color analysis** to interpret DIY food tests.
- Convert complex chemistry into **simple results**: _safe / suspicious / unsafe_.
- Provide **clear explanations** in multiple Indian languages, plus a **voice assistant** for accessibility.
- Work **offline** for core features so users in low-connectivity areas can still run tests.

**Hackathon prototype focus:**

- A minimal Android app (Kotlin / Flutter / React Native).
- A small set of **validated tests** for common adulterants, e.g.:
  - Milk: water dilution (lactometer proxy / density), detergent, urea.
  - Turmeric: metanil yellow (using simple reagents), chalk powder (sedimentation).
  - Chilli powder: brick powder, artificial dyes.
  - Cooking oil: argemone oil detection (simple chemical test).
- **Preset color charts** hard-coded for each test.
- **Computer-vision-based color matching** using the phone camera.
- Voice assistant for navigation and smart recommendations.

Prototype results are **preliminary screening indicators only**, not replacements for certified lab results.

---

## 3. Target Users

### 3.1 Primary Users

1. **Urban and Semi-Urban Families (India)**
   - Often buy loose or unpackaged items from local shops.
   - Want a quick check before using a new batch of milk, spices, oil, etc.
   - Need: **Simple instructions, local language support, and clear results**.

2. **Small Food Vendors / Street Food Sellers**
   - Want to check raw materials (milk, oil, spices) occasionally.
   - Need: **Fast, offline tests** and simple “pass/fail-like” results.

### 3.2 Secondary Users

3. **Teachers / Students**
   - Can use PureSnap as a **food safety education tool**.
   - Need: **demo-friendly, visual, and interactive** app.

4. **Community Health Workers / NGOs**
   - Can demonstrate awareness in local communities.
   - Need: **voice guidance**, multilingual interface, and simple advice.

### 3.3 User Needs

- Easy step-by-step guide with **minimal technical jargon**.
- **Multilingual text** + **voice guidance** for users with low literacy.
- Low-cost tests using:
  - Basic reagent strips (prototype assumption: a simple color-strip kit).
  - Or household items (e.g., water, lemon, heat, etc.).
- **Offline usability** and fast performance.
- **Trustworthy explanations**: what does “suspicious” actually mean and what to do next?

---

## 4. Key Features

> All features below must be implemented (even in basic form) in the prototype.

1. **Camera-Based Color Analysis**
   - Users capture an image of the **reagent strip** or test reaction.
   - App analyzes the **color change** and matches against a predefined **color chart**.
   - Outputs a clear **status**: `Safe`, `Suspicious`, or `Unsafe`.

2. **Step-by-Step Testing Guide**
   - For each supported food item and adulterant, show:
     - Material list (food + reagents / household items).
     - Step-by-step instructions with text and icons.
     - A dedicated step for **“Take Photo”**.
   - Designed for **beginners** with clear visuals.

3. **Result Explanation and Advice**
   - After analyzing the test, show:
     - A simple label: `Safe`, `Suspicious`, or `Unsafe`.
     - A short explanation in **plain language**:
       - “What this result means.”
       - “Possible adulterant this test detects.”
     - Suggested next steps:
       - Avoid consumption.
       - Test again.
       - Consider lab testing or reporting to authorities.

4. **Preset Color Chart Database**
   - For each test type, store:
     - Expected color(s) range for **safe**.
     - Color threshold(s) for **suspicious** / **unsafe**.
   - Used by the camera-analysis module to classify results.
   - Initially: **hard-coded JSON** or local database.

5. **Offline Functionality**
   - Core workflows usable without internet:
     - Viewing step-by-step guides.
     - Running camera capture.
     - Doing basic color analysis using local charts.
   - Online features can be optional:
     - App updates, additional test downloads, analytics uploads.

6. **Voice Assistant & Smart Recommendations**
   - In-app voice assistant to:
     - Guide users through **each step** (play/pause voice instructions).
     - Read out results and explanations.
   - Smart recommendations such as:
     - Suggesting **which test to run next** based on current result.
     - Remind users to **retake picture** if lighting is poor.
   - Multilingual voice options (at least English + Hindi for prototype).

---

## 5. User Flow

### 5.1 Onboarding

1. **Splash Screen**
   - PureSnap logo + tagline: “Making food safety accessible, one scan at a time.”

2. **Language Selection**
   - Show a list: English, Hindi, (optionally 1–2 regional languages).
   - Store preference locally.

3. **Permission Requests**
   - Camera permission (mandatory for core feature).
   - Optional microphone permission for voice assistant.
   - Brief justification: “Needed to analyze color of test strips / listen to voice commands.”

4. **Short Tutorial (Skippable)**
   - 3–4 slides:
     - Slide 1: What PureSnap does (screening, not a lab).
     - Slide 2: How to use: choose test → follow steps → take photo → get result.
     - Slide 3: Safety disclaimer.

---

### 5.2 Home Screen

Elements:

- Top area:
  - Greeting & language switcher.
  - Microphone icon: tap to **activate voice assistant**.
- Main sections:
  - **“Start a New Test”** (primary CTA button).
  - “My Recent Tests” (list of last 3 tests with status).
  - “Learn about Food Adulteration” (simple info page).

Voice assistant behavior:

- On tap:
  - Speaks: “What do you want to test today? You can say: milk, turmeric, chilli powder, or oil.”
  - User can tap on-screen options or speak.

---

### 5.3 Start a New Test – Food & Test Selection

1. **Choose Food Item**
   - Cards or icons: Milk, Turmeric, Chilli Powder, Cooking Oil.
   - Each with a short caption: “Common daily use item”.

2. **Choose Adulterant Test**
   - After selecting, show a list of 1–3 tests per item (linked to preset color charts), e.g.:

   - **Milk:**
     - Detergent test (reagent strip or simple foaming test).
     - Urea test (reagent strip color).
   - **Turmeric:**
     - Metanil yellow test (color reaction).
   - **Chilli Powder:**
     - Artificial dye test (water color test).
   - **Cooking Oil:**
     - Argemone oil test (reagent-based color).

   - Each test card shows:
     - Test name.
     - Short description: “Time: ~3 minutes. Materials: 1 reagent strip, 1 teaspoon turmeric.”

Voice assistant:

- Reads available test options: “For milk, you can run a detergent test or a urea test. Tap or say your choice.”

---

### 5.4 Step-by-Step Testing Guide

For the selected test, show a step-by-step wizard:

**Common layout:**

- Top: Progress indicator (Step X of Y).
- Center: Instruction text + icon/illustration.
- Bottom: Buttons: `Back` | `Next` or `Capture Photo` on the final prep step.
- A small **speaker icon** to read instructions aloud.

**Typical steps example (Milk – Detergent Test):**

1. **Step 1 – Gather Materials**
   - “Take a clean glass, 2 teaspoons of milk, and one detergent-test strip from your kit.”
   - Voice: reads instructions.

2. **Step 2 – Prepare Sample**
   - “Pour the milk into the glass. Make sure the glass is dry and clean.”

3. **Step 3 – Apply Strip**
   - “Dip the strip in milk for 5 seconds and remove.”

4. **Step 4 – Wait**
   - “Wait for 30 seconds until color appears on the strip.”
   - Show countdown timer.

5. **Step 5 – Capture Photo**
   - “Place the strip on a white surface in good light.”
   - Show overlay: “Align strip within frame.”
   - Button: `Open Camera`.

---

### 5.5 Camera-Based Color Capture

1. **Camera Screen**
   - Live preview with bounding box/outline for the strip.
   - Tips on-screen:
     - “Avoid shadows.”
     - “Keep strip flat and stable.”

2. **Capture**
   - User taps the capture button.
   - Show the captured image with:
     - `Retake` | `Use Photo`.

3. **Preprocessing**
   - App:
     - Crops to bounding box (or encourages user to crop manually in prototype).
     - Normalizes brightness/contrast if possible.
   - Then runs **color analysis** against local color chart.

4. **Loading**
   - Short loading screen: “Analyzing color…”.

---

### 5.6 Result Screen & Explanation

**Result UI:**

- Large status indicator:
  - Large text: `Safe`, `Suspicious`, or `Unsafe`.
  - Color-coded: green / yellow / red.
- Below:
  - Summary:  
    - “This sample shows no strong signs of detergent.”  
    - OR “This sample may contain detergent-like substances.”
  - Confidence indicator (simple text): “Result confidence: Medium (prototype).”
  - Explanation:
    - “This test checks for ______. Color closer to [X] suggests possible adulteration.”
- **Recommended Actions:**
  - For `Safe`:
    - “You may use this batch, but stay alert for smell, taste, and appearance.”
  - For `Suspicious`:
    - “Avoid giving this to children or elders. Consider testing another sample or buying from a different source.”
  - For `Unsafe`:
    - “Avoid consuming this. Consider sending a sample to a certified lab or reporting to your local authority.”

- **Buttons:**
  - `Save Result` (stores locally).
  - `Run Another Test on Same Item`.
  - `Back to Home`.

Voice assistant:

- Automatically:
  - Reads the summary: “Your result is suspicious. This may indicate presence of detergent. We suggest you avoid this milk and consider testing another source.”

---

### 5.7 History & Learn More

**My Recent Tests:**

- List of entries:  
  - Food – Test – Result – Date/Time.
- Tap entry:
  - Show details: photo thumbnail, result, explanation, actions.

**Learn About Food Adulteration:**

- Simple offline pages:
  - “Common adulterants in milk / spices / oils.”
  - “What PureSnap tests can and cannot detect.”
  - “Why lab testing is still important.”

---

## 6. Technical Approach

### 6.1 Platform & Architecture

- **Mobile Platform:** Android (primary).  
  - Option 1: **Kotlin + Android Studio** (native).
  - Option 2: **Flutter** (Dart) for rapid UI + possible future iOS.
  - Option 3: **React Native** with Expo for fast prototyping.

For hackathon speed, **Flutter** is a strong candidate (ready-made widgets, easy camera integration, good cross-platform potential). The plan below assumes Flutter but can be adapted.

---

### 6.2 App Layers

1. **Presentation Layer (UI)**
   - Flutter `MaterialApp`.
   - Screens:
     - Splash / Onboarding.
     - Home.
     - Food selection.
     - Test selection.
     - Step-by-step wizard.
     - Camera capture.
     - Result.
     - History.
     - Info pages.

2. **Domain Layer**
   - Entities:
     - `FoodItem` (id, name, icon).
     - `TestType` (id, name, foodItemId, description, instructions[]).
     - `ColorChart` (testTypeId, thresholds for safe/suspicious/unsafe).
     - `TestResult` (id, testTypeId, timestamp, resultStatus, imagePath, notes).
   - Services:
     - `ColorAnalysisService`.
     - `VoiceAssistantService`.
     - `OfflineDataService`.

3. **Data Layer**
   - Local storage:
     - `SharedPreferences` / `Hive` / `sqflite` for:
       - User settings (language, preferences).
       - Test history.
       - Color chart database (JSON or local DB).
   - Optional cloud syncing (not essential for MVP).

---

### 6.3 Camera-Based Color Analysis

**Library options:**

- Use `camera` or `image_picker` plugin in Flutter.
- For image processing + color extraction:
  - Library: `image` or basic custom processing in Dart.
  - Alternatively, very simple algorithm in Kotlin/Android using `Bitmap` APIs if going native.

**Algorithm (simple prototype):**

1. Capture image and crop region of interest (ROI).
   - Use overlay rectangle to approximate the location of the test area.
2. Convert ROI to a suitable color space (e.g., HSV or LAB) to reduce lighting variance.
3. Compute average color:
   - Mean H, S, V (or L, a, b) values of pixels.
4. Compare with **preset color chart** for that test:
   - Each color category in chart has:
     - `rangeMin` and `rangeMax` for H/S/V or L/a/b.
   - Find which category the average color falls into.
5. Map category to status:
   - Example:
     - Category A → `Safe`.
     - Category B → `Suspicious`.
     - Category C → `Unsafe`.
6. If color falls in overlapping region:
   - Choose `Suspicious` and reduce confidence.

**Preset Color Chart Structure (JSON example):**

```json
{
  "testTypeId": "milk_detergent",
  "colorThresholds": [
    {
      "label": "safe",
      "hMin": 30,
      "hMax": 50,
      "sMin": 10,
      "sMax": 40,
      "vMin": 60,
      "vMax": 100
    },
    {
      "label": "unsafe",
      "hMin": 210,
      "hMax": 240,
      "sMin": 40,
      "sMax": 80,
      "vMin": 50,
      "vMax": 90
    }
  ]
}
```

> Note: In a real system, these thresholds must be calibrated with actual reagent strips. For hackathon, approximate (or even simulated) values are acceptable to demonstrate the workflow.

---

### 6.4 Step-by-Step Testing Guide Implementation

- Represent each test as a JSON/config entry with instructions:

```json
{
  "id": "milk_detergent",
  "foodItemId": "milk",
  "name": "Detergent Test",
  "estimatedTimeMinutes": 3,
  "steps": [
    {
      "stepNumber": 1,
      "title": "Gather Materials",
      "description": "Take a clean glass, 2 teaspoons of milk, and one detergent-test strip.",
      "type": "info"
    },
    {
      "stepNumber": 2,
      "title": "Prepare Sample",
      "description": "Pour the milk into the glass.",
      "type": "info"
    },
    {
      "stepNumber": 3,
      "title": "Dip Strip",
      "description": "Dip the strip in milk for 5 seconds and remove.",
      "type": "timer",
      "durationSeconds": 5
    },
    {
      "stepNumber": 4,
      "title": "Wait",
      "description": "Wait 30 seconds for the color to develop.",
      "type": "timer",
      "durationSeconds": 30
    },
    {
      "stepNumber": 5,
      "title": "Capture Photo",
      "description": "Place the strip on a white surface and tap Capture.",
      "type": "camera"
    }
  ]
}
```

- The app reads this configuration and dynamically builds the wizard:
  - `type: "info"` → text + next button.
  - `type: "timer"` → includes countdown.
  - `type: "camera"` → opens camera screen.

---

### 6.5 Result Explanation & Advice

- For each test + status combination, have pre-written explanations and advice in multiple languages stored locally.

Example structure:

```json
{
  "testTypeId": "milk_detergent",
  "status": "unsafe",
  "title": "Possible Detergent Detected",
  "summary": "The color suggests detergent-like substances may be present.",
  "advice": [
    "Do not consume this milk.",
    "Avoid giving it to children and elderly people.",
    "Consider buying milk from a different source.",
    "If problem continues, consider sending a sample to a certified laboratory."
  ]
}
```

- The UI pulls this data after the color analysis.

---

### 6.6 Offline Functionality

- All JSON data for:
  - Tests.
  - Color charts.
  - Explanations.
  - Voice script references (text).
- Stored in the app bundle.
- History stored via local DB (Hive/sqflite).

When offline:

- All flows **except online analytics or updates** work.
- If using any third-party ML API, ensure there’s a fallback to **local heuristic**.

---

### 6.7 Voice Assistant & Smart Recommendations

**Implementation Approach:**

- **Text-to-Speech (TTS):**
  - Android:
    - Use `flutter_tts` plugin.
    - Configure available voices (English, Hindi).
- **Speech-to-Text (STT)** (optional but nice-to-have):
  - Use plugin like `speech_to_text`.
  - For hackathon, basic commands only (no full NLU):
    - Recognize keywords: “milk”, “turmeric”, “chilli”, “oil”, “start”, “next”, “back”.
- **Assistant Flow:**
  - When activated:
    - Speak current context:
      - On home: “Say or tap what you want to test.”
      - In steps: “This is step X: [description]. Say ‘next’ when you are ready.”
      - On result: “Your result is unsafe. [short advice].”
  - Smart recommendations:
    - If status `Suspicious`:
      - Suggest: “Would you like to run another type of test on the same sample?” with `Yes/No` buttons and voice prompts.
    - If photo analysis shows low brightness:
      - Detect low overall luminance and display: “Lighting is low. For better accuracy, consider retaking the photo in better light.”  
      - Voice: “Lighting seems low. You can retake the photo for better accuracy.”

---

## 7. Success Metrics

### 7.1 Hackathon Prototype Metrics

1. **Functional Completeness**
   - Users can:
     - Select at least 3 food items and 1–2 tests each.
     - Follow step-by-step guides to the camera step.
     - Capture photo and get a `Safe/Suspicious/Unsafe` result.
     - Hear voice guidance in at least one language (TTS).
   - Offline mode: App functions (minus updates/analytics) without internet.

2. **Usability (Short Onsite Testing)**
   - Run user tests with **5–10 participants** (students/mentors):
     - Time taken to complete one test end-to-end.
     - Count of critical errors (e.g., confusion, stuck screens).
   - Target:
     - >80% can complete a test without external help after a brief explanation.

3. **Accuracy (Prototype-Level)**
   - Using prepared sample images / demo strips:
     - Target at least **70–80% correct classification** (“safe” vs “unsafe”) using color charts.
   - For hackathon, can simulate multiple sample photos and verify expected classification.

4. **Accessibility Usage**
   - Track how many times:
     - Voice assistant is invoked.
     - Non-default language is chosen.
   - Qualitative feedback:  
     - At least 3 users find voice guidance helpful.

---

### 7.2 Longer-Term Metrics (Post-Hackathon Vision)

1. **Adoption & Reach**
   - Number of active users per month in urban and semi-urban areas.
   - Distribution of languages used.

2. **Engagement**
   - Average number of tests per user per month.
   - Repeat usage rate over 30/60 days.

3. **Impact**
   - % of tests that return `Suspicious` or `Unsafe` and result in behavior change:
     - User reports throwing away or avoiding purchase.
     - User reports switching vendors/brands.

4. **Trust & Understanding**
   - Survey metrics:
     - Self-reported understanding of food adulteration.
     - Perceived usefulness of the app for family safety.

---

## Summary for Prototyping Tools

- Build a **Flutter Android app**.
- Implement:
  - Home → Food selection → Test selection → Step-by-step guide → Camera → Color analysis → Result screen → History.
- Use **local JSON config** for:
  - Step definitions.
  - Color charts.
  - Explanations.
- Implement a **basic color analysis algorithm** comparing average color in ROI to thresholds.
- Ensure:
  - **Camera-Based Color Analysis**
  - **Step-by-Step Testing Guide**
  - **Result Explanation and Advice**
  - **Preset Color Chart Database**
  - **Offline Functionality**
  - **Voice Assistant & Smart Recommendations**
  are all present, even in minimal form.

This is sufficient for Lovable/Bolt or similar tools to scaffold a working prototype for the PureSnap Tester hackathon project.