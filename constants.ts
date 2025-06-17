import type { LanguageOption } from './types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: 'auto', label: 'Auto-Detect Language', resultHeading: 'Transcription:' },
  { value: 'or-IN', label: 'Odia (ଓଡ଼ିଆ)', resultHeading: 'ପ୍ରତିଲିପି ଫଳାଫଳ:' },
  { value: 'en-US', label: 'English (US)', resultHeading: 'Transcription Result:' },
  { value: 'en-GB', label: 'English (UK)', resultHeading: 'Transcription Result:' },
  { value: 'hi-IN', label: 'Hindi (हिन्दी)', resultHeading: 'परिणाम:' },
  { value: 'bn-IN', label: 'Bengali (বাংলা)', resultHeading: 'প্রতিলিপি ফলাফল:' },
  { value: 'te-IN', label: 'Telugu (తెలుగు)', resultHeading: 'ట్రాన్స్‌క్రిప్షన్ ఫలితం:' },
  { value: 'ta-IN', label: 'Tamil (தமிழ்)', resultHeading: 'படியெடுத்தல் முடிவு:' },
  { value: 'gu-IN', label: 'Gujarati (ગુજરાતી)', resultHeading: 'પરિણામ:' },
  { value: 'mr-IN', label: 'Marathi (मराठी)', resultHeading: 'परिणाम:' },
  { value: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)', resultHeading: 'ಲಿಪ్యಂತರಣ ಫಲಿತಾಂಶ:' },
  { value: 'ml-IN', label: 'Malayalam (മലയാളം)', resultHeading: 'ട്രാൻസ്ക്രിപ്ഷൻ ഫലം:' },
  { value: 'pa-IN', label: 'Punjabi (ਪੰਜਾਬੀ)', resultHeading: 'ਨਤੀਜਾ:' },
  { value: 'ur-IN', label: 'Urdu (اردو)', resultHeading: 'ٹرانسکرپشن کا نتیجہ:' },
  { value: 'es-ES', label: 'Spanish (Español)', resultHeading: 'Resultado de la Transcripción:' },
  { value: 'fr-FR', label: 'French (Français)', resultHeading: 'Résultat de la Transcription:' },
  { value: 'de-DE', label: 'German (Deutsch)', resultHeading: 'Transkriptionsergebnis:' },
  { value: 'ja-JP', label: 'Japanese (日本語)', resultHeading: '文字起こし結果:' },
  { value: 'ko-KR', label: 'Korean (한국어)', resultHeading: '음성 인식 결과:' },
  { value: 'zh-CN', label: 'Chinese (Simplified, 普通话)', resultHeading: '转录结果:' },
  { value: 'ar-SA', label: 'Arabic (العربية)', resultHeading: 'نتيجة التفريغ الصوتي:' },
  { value: 'ru-RU', label: 'Russian (Русский)', resultHeading: 'Результат транскрипции:' },
  { value: 'pt-BR', label: 'Portuguese (Português)', resultHeading: 'Resultado da Transcrição:' },
  { value: 'it-IT', label: 'Italian (Italiano)', resultHeading: 'Risultato della Trascrizione:' },
];

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';