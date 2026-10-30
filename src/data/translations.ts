/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  startNewTest: string;
  recentTests: string;
  noRecentTests: string;
  learnMore: string;
  voiceAssistant: string;
  tapToSpeak: string;
  listening: string;
  selectFood: string;
  selectTest: string;
  step: string;
  of: string;
  next: string;
  back: string;
  capturePhoto: string;
  retake: string;
  analyze: string;
  analyzing: string;
  statusSafe: string;
  statusSuspicious: string;
  statusUnsafe: string;
  confidence: string;
  lightingGood: string;
  lightingLow: string;
  lightingOverexposed: string;
  saveResult: string;
  runAnotherTest: string;
  backToHome: string;
  savedToHistory: string;
  disclaimer: string;
  disclaimerText: string;
  materialsNeeded: string;
  estimatedTime: string;
  minutes: string;
  seconds: string;
  startTimer: string;
  pauseTimer: string;
  resetTimer: string;
  cameraTips: string;
  tipAlign: string;
  tipLight: string;
  useDemoStrip: string;
  fssaiGuide: string;
  voicePromptHome: string;
  voicePromptSteps: string;
  voicePromptResult: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    appName: 'PureSnap Tester',
    tagline: 'Making food safety accessible, one scan at a time.',
    startNewTest: 'Start a New Test',
    recentTests: 'My Recent Tests',
    noRecentTests: 'No recent tests recorded yet. Start your first purity screening!',
    learnMore: 'Learn About Food Adulteration',
    voiceAssistant: 'Voice Assistant',
    tapToSpeak: 'Tap to speak voice command',
    listening: 'Listening... (Say "milk", "turmeric", "chilli", "oil", or "start")',
    selectFood: 'Choose Food Item',
    selectTest: 'Choose Adulterant Test',
    step: 'Step',
    of: 'of',
    next: 'Next Step',
    back: 'Back',
    capturePhoto: 'Open Camera / Capture',
    retake: 'Retake Photo',
    analyze: 'Analyze Strip Color',
    analyzing: 'Analyzing color reaction against calibrated charts...',
    statusSafe: 'Safe',
    statusSuspicious: 'Suspicious',
    statusUnsafe: 'Unsafe',
    confidence: 'Confidence',
    lightingGood: 'Lighting is optimal',
    lightingLow: 'Lighting is low. Consider brighter light for accuracy.',
    lightingOverexposed: 'High glare detected. Move away from direct reflections.',
    saveResult: 'Save Result to History',
    runAnotherTest: 'Test Another Adulterant on Same Food',
    backToHome: 'Back to Home',
    savedToHistory: 'Result saved to your local offline history!',
    disclaimer: 'Preliminary Screening Notice',
    disclaimerText: 'PureSnap provides rapid kitchen screening indicators based on colorimetry. Results are not a substitute for accredited laboratory testing.',
    materialsNeeded: 'Materials Needed',
    estimatedTime: 'Estimated Time',
    minutes: 'mins',
    seconds: 'sec',
    startTimer: 'Start Timer',
    pauseTimer: 'Pause',
    resetTimer: 'Reset',
    cameraTips: 'Camera Guidelines',
    tipAlign: 'Align the reactive strip pad inside the rectangular box.',
    tipLight: 'Keep strip flat on a white surface with clear daylight or room light.',
    useDemoStrip: 'Quick Demo: Try Preset Sample Strips',
    fssaiGuide: 'FSSAI DART Food Safety Hub',
    voicePromptHome: 'Welcome to PureSnap! What would you like to test today? You can say: milk, turmeric, chilli powder, or oil.',
    voicePromptSteps: 'Follow this step carefully. Tap the speaker icon to hear instructions or press next when ready.',
    voicePromptResult: 'Analysis complete. Review the safety indicator and recommended actions below.',
  },
  hi: {
    appName: 'प्योरस्नैप टेस्टर (PureSnap)',
    tagline: 'खाद्य सुरक्षा को हर घर तक पहुंचाना, एक स्कैन के साथ।',
    startNewTest: 'नया परीक्षण शुरू करें',
    recentTests: 'मेरे हालिया परीक्षण',
    noRecentTests: 'अभी तक कोई परीक्षण नहीं हुआ। अपना पहला खाद्य सुरक्षा टेस्ट करें!',
    learnMore: 'खाद्य मिलावट के बारे में जानें',
    voiceAssistant: 'वॉयस असिस्टेंट',
    tapToSpeak: 'बोलने के लिए माइक दबाएं',
    listening: 'सुन रहे हैं... ("दूध", "हल्दी", "मिर्च", "तेल" कहें)',
    selectFood: 'खाद्य वस्तु चुनें',
    selectTest: 'मिलावट जांच चुनें',
    step: 'चरण',
    of: 'का',
    next: 'अगला चरण',
    back: 'पीछे',
    capturePhoto: 'कैमरा खोलें / फोटो लें',
    retake: 'दोबारा फोटो लें',
    analyze: 'रंग जांच करें',
    analyzing: 'कैलिव्रेटेड चार्ट से रंग की जांच हो रही है...',
    statusSafe: 'सुरक्षित (Safe)',
    statusSuspicious: 'संदिग्ध (Suspicious)',
    statusUnsafe: 'असुरक्षित (Unsafe)',
    confidence: 'सटीकता',
    lightingGood: 'रोशनी बिल्कुल सही है',
    lightingLow: 'रोशनी कम है। बेहतर रोशनी में फोटो लें।',
    lightingOverexposed: 'अत्यधिक चमक। सीधी परछाई या फ्लैश से बचें।',
    saveResult: 'परिणाम सुरक्षित करें',
    runAnotherTest: 'इसी खाद्य वस्तु पर दूसरा टेस्ट करें',
    backToHome: 'होम पेज पर जाएं',
    savedToHistory: 'रिजल्ट ऑफलाइन हिस्ट्री में सुरक्षित हो गया!',
    disclaimer: 'प्रारंभिक स्क्रीनिंग सूचना',
    disclaimerText: 'प्योरस्नैप त्वरित रंग-आधारित प्राथमिक जांच प्रदान करता है। यह प्रमाणित प्रयोगशाला परीक्षण का विकल्प नहीं है।',
    materialsNeeded: 'आवश्यक सामग्री',
    estimatedTime: 'अनुमानित समय',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    startTimer: 'टाइमर शुरू करें',
    pauseTimer: 'रोकें',
    resetTimer: 'रीसेट',
    cameraTips: 'कैमरा निर्देश',
    tipAlign: 'स्ट्रिप को आयताकार बॉक्स के अंदर सीधा रखें।',
    tipLight: 'स्ट्रिप को सफेद सतह पर रखें और परछाई से बचें।',
    useDemoStrip: 'डेमो स्ट्रिप से तुरंत टेस्ट करें',
    fssaiGuide: 'FSSAI खाद्य सुरक्षा नियम एवं सुझाव',
    voicePromptHome: 'प्योरस्नैप में आपका स्वागत है! आप क्या टेस्ट करना चाहते हैं? बोलें: दूध, हल्दी, मिर्च, या तेल।',
    voicePromptSteps: 'इस निर्देश को ध्यान से पढ़ें। अगला चरण दबाएं।',
    voicePromptResult: 'जांच पूरी हो गई है। नीचे दिया गया सुरक्षा परिणाम देखें।',
  },
  ta: {
    appName: 'பியூர்ஸ்னாப் (PureSnap)',
    tagline: 'உணவு பாதுகாப்பை எளிதாக்குதல்.',
    startNewTest: 'புதிய பரிசோதனையைத் தொடங்கு',
    recentTests: 'சமீபத்திய சோதனைகள்',
    noRecentTests: 'பதிவுகள் எதுவும் இல்லை.',
    learnMore: 'உணவு கலப்படம் பற்றி அறியுங்கள்',
    voiceAssistant: 'குரல் உதவியாளர்',
    tapToSpeak: 'பேச தட்டவும்',
    listening: 'கேட்கிறது...',
    selectFood: 'உணவுப் பொருளைத் தேர்ந்தெடுக்கவும்',
    selectTest: 'சோதனையைத் தேர்ந்தெடுக்கவும்',
    step: 'படி',
    of: '/',
    next: 'அடுத்த படி',
    back: 'பின்செல்',
    capturePhoto: 'புகைப்படம் எடுக்கவும்',
    retake: 'மீண்டும் எடுக்கவும்',
    analyze: 'வண்ணத்தை பகுப்பாய்வு செய்',
    analyzing: 'வண்ணம் சரிபார்க்கப்படுகிறது...',
    statusSafe: 'பாதுகாப்பானது (Safe)',
    statusSuspicious: 'சந்தேகத்திற்குரியது (Suspicious)',
    statusUnsafe: 'பாதுகாப்பற்றது (Unsafe)',
    confidence: 'நம்பகத்தன்மை',
    lightingGood: 'வெளிச்சம் சிறப்பானது',
    lightingLow: 'குறைந்த வெளிச்சம்',
    lightingOverexposed: 'அதிக வெளிச்சம்',
    saveResult: 'முடிவைச் சேமிக்க',
    runAnotherTest: 'மற்றொரு பரிசோதனை செய்',
    backToHome: 'முகப்பு பக்கத்திற்கு செல்',
    savedToHistory: 'வரலாற்றில் சேமிக்கப்பட்டது!',
    disclaimer: 'ஆரம்ப பரிசோதனை தகவல்',
    disclaimerText: 'இது ஆரம்ப நிலை வண்ண பரிசோதனை மட்டுமே.',
    materialsNeeded: 'தேவையான பொருட்கள்',
    estimatedTime: 'மதிப்பிடப்பட்ட நேரம்',
    minutes: 'நிமிடம்',
    seconds: 'விநாடி',
    startTimer: 'டைமரைத் தொடங்கு',
    pauseTimer: 'நிறுத்து',
    resetTimer: 'மீட்டமை',
    cameraTips: 'கேமரா குறிப்புகள்',
    tipAlign: 'ஸ்ட்ரிப்பை சட்டத்தில் பொருத்தவும்.',
    tipLight: 'வெள்ளை மேற்பரப்பில் வைக்கவும்.',
    useDemoStrip: 'டெமோ ஸ்ட்ரிப் மூலம் முயற்சிக்கவும்',
    fssaiGuide: 'FSSAI உணவு பாதுகாப்பு வழிகாட்டி',
    voicePromptHome: 'பியூர்ஸ்னாப்பிற்கு வரவேற்கிறோம். நீங்கள் எதை சோதிக்க விரும்புகிறீர்கள்?',
    voicePromptSteps: 'இந்த படியை கவனமாக பின்பற்றவும்.',
    voicePromptResult: 'பரிசோதனை முடிந்தது. முடிவை சரிபார்க்கவும்.',
  },
  te: {
    appName: 'ప్యూర్స్నాప్ (PureSnap)',
    tagline: 'ఆహార భద్రత అందరికీ అందుబాటులో.',
    startNewTest: 'కొత్త పరీక్ష ప్రారంభించండి',
    recentTests: 'నా ఇటీవలి పరీక్షలు',
    noRecentTests: 'ఇంకా ఎటువంటి పరీక్షలు లేవు.',
    learnMore: 'ఆహార కల్తీ గురించి తెలుసుకోండి',
    voiceAssistant: 'వాయిస్ అసిస్టెంట్',
    tapToSpeak: 'మాట్లాడటానికి నొక్కండి',
    listening: 'వింటున్నాము...',
    selectFood: 'ఆహార పదార్థాన్ని ఎంచుకోండి',
    selectTest: 'కల్తీ పరీక్షను ఎంచుకోండి',
    step: 'దశ',
    of: 'లో',
    next: 'తరువాతి దశ',
    back: 'వెనుకకు',
    capturePhoto: 'ఫోటో తీయండి',
    retake: 'మళ్లీ తీయండి',
    analyze: 'రంగు విశ్లేషణ చేయండి',
    analyzing: 'విశ్లేషిస్తోంది...',
    statusSafe: 'సురక్షితం (Safe)',
    statusSuspicious: 'అనుమానాస్పదం (Suspicious)',
    statusUnsafe: 'హానికరం (Unsafe)',
    confidence: 'ఖచ్చితత్వం',
    lightingGood: 'వెలుతురు బాగుంది',
    lightingLow: 'వెలుతురు తక్కువగా ఉంది',
    lightingOverexposed: 'అధిక కాంతి',
    saveResult: 'ఫలితాన్ని సేవ్ చేయండి',
    runAnotherTest: 'మరో పరీక్ష చేయండి',
    backToHome: 'హోమ్ పేజీకి వెళ్లండి',
    savedToHistory: 'సేవ్ చేయబడింది!',
    disclaimer: 'ప్రాథమిక హెచ్చరిక',
    disclaimerText: 'ఇది వేగవంతమైన రంగు ఆధారిత పరీక్ష మాత్రమే.',
    materialsNeeded: 'అవసరమైన వస్తువులు',
    estimatedTime: 'అంచనా సమయం',
    minutes: 'నిమిషాలు',
    seconds: 'సెకన్లు',
    startTimer: 'టైమర్ ప్రారంభించండి',
    pauseTimer: 'ఆపండి',
    resetTimer: 'రీసెట్',
    cameraTips: 'కెమెరా చిట్కాలు',
    tipAlign: 'స్ట్రిప్‌ను బాక్స్ మధ్యలో ఉంచండి.',
    tipLight: 'తెల్లని ఉపరితలంపై ఉంచండి.',
    useDemoStrip: 'డెమో స్ట్రిప్‌తో ప్రయత్నించండి',
    fssaiGuide: 'FSSAI ఆహార భద్రతా మార్గదర్శకాలు',
    voicePromptHome: 'స్వాగతం. మీరు దేనిని పరీక్షించాలనుకుంటున్నారు?',
    voicePromptSteps: 'ఈ దశను అనుసరించండి.',
    voicePromptResult: 'విశ్లేషణ పూర్తయింది.',
  },
  bn: {
    appName: 'পিওরস্ন্যাপ (PureSnap)',
    tagline: 'খাবারের সুরক্ষা এখন আপনার হাতের মুঠোয়।',
    startNewTest: 'নতুন টেস্ট শুরু করুন',
    recentTests: 'সাম্প্রতিক টেস্টসমূহ',
    noRecentTests: 'এখনও কোনো টেস্ট রেকর্ড করা হয়নি।',
    learnMore: 'খাদ্যে ভেজাল সম্পর্কে জানুন',
    voiceAssistant: 'ভয়েস সহকারী',
    tapToSpeak: 'কথা বলতে ট্যাপ করুন',
    listening: 'শুনছি...',
    selectFood: 'খাবারের উপাদান বাছুন',
    selectTest: 'ভেজাল টেস্ট বাছুন',
    step: 'ধাপ',
    of: 'এর',
    next: 'পরবর্তী ধাপ',
    back: 'পেছনে',
    capturePhoto: 'ছবি তুলুন',
    retake: 'আবার তুলুন',
    analyze: 'রঙ বিশ্লেষণ করুন',
    analyzing: 'রঙ বিশ্লেষণ চলছে...',
    statusSafe: 'নিরাপদ (Safe)',
    statusSuspicious: 'সন্দেহজনক (Suspicious)',
    statusUnsafe: 'বিপজ্জনক (Unsafe)',
    confidence: 'নির্ভুলতা',
    lightingGood: 'পর্যাপ্ত আলো রয়েছে',
    lightingLow: 'আলো কম',
    lightingOverexposed: 'অতিরিক্ত আলো',
    saveResult: 'ফলাফল সংরক্ষণ করুন',
    runAnotherTest: 'আরেকটি টেস্ট করুন',
    backToHome: 'হোমে ফিরে যান',
    savedToHistory: 'সংরক্ষিত হয়েছে!',
    disclaimer: 'প্রাথমিক স্ক্রিনিং তথ্য',
    disclaimerText: 'এটি একটি প্রাথমিক কালার টেস্ট। এটি ল্যাবরেটরি টেস্টের বিকল্প নয়।',
    materialsNeeded: 'প্রয়োজনীয় উপকরণ',
    estimatedTime: 'আনুমানিক সময়',
    minutes: 'মিনিট',
    seconds: 'সেকেন্ড',
    startTimer: 'টাইমার শুরু করুন',
    pauseTimer: 'থামুন',
    resetTimer: 'রিসেট',
    cameraTips: 'ক্যামেরা নির্দেশিকা',
    tipAlign: 'স্ট্রিপটি বক্সের ভেতরে রাখুন।',
    tipLight: 'সাদা কাগজের উপর রাখুন।',
    useDemoStrip: 'ডেমো স্ট্রিপ দিয়ে পরীক্ষা করুন',
    fssaiGuide: 'FSSAI খাদ্য নিরাপত্তা নির্দেশিকা',
    voicePromptHome: 'পিওরস্ন্যাপে স্বাগতম। আপনি কী টেস্ট করতে চান?',
    voicePromptSteps: 'এই ধাপটি অনুসরণ করুন।',
    voicePromptResult: 'টেস্ট সম্পন্ন হয়েছে।',
  },
};
