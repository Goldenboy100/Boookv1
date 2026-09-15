export interface Language {
  code: string;
  name: string;
  native: string;
  dir: "ltr" | "rtl";
  script: string;
  /** recommended body font id */
  body: string;
  /** recommended title font id */
  title: string;
}

/**
 * Languages Quire ships type for. Choosing one points the interior at an
 * appropriate face and flips the page direction for right-to-left scripts.
 */
export const LANGUAGES: Language[] = [
  { code: "en", name: "English", native: "English", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "ar", name: "Arabic", native: "العربية", dir: "rtl", script: "Arabic", body: "naskh-ar", title: "kufi-ar" },
  { code: "fa", name: "Persian", native: "فارسی", dir: "rtl", script: "Arabic", body: "naskh-ar", title: "kufi-ar" },
  { code: "ur", name: "Urdu", native: "اردو", dir: "rtl", script: "Nastaliq", body: "nastaliq-ur", title: "nastaliq-ur" },
  { code: "ku", name: "Kurdish", native: "کوردی", dir: "rtl", script: "Arabic", body: "naskh-ar", title: "kufi-ar" },
  { code: "he", name: "Hebrew", native: "עברית", dir: "rtl", script: "Hebrew", body: "hebrew", title: "hebrew" },
  { code: "sd", name: "Sindhi", native: "سنڌي", dir: "rtl", script: "Arabic", body: "naskh-ar", title: "kufi-ar" },
  { code: "ps", name: "Pashto", native: "پښتو", dir: "rtl", script: "Arabic", body: "naskh-ar", title: "kufi-ar" },
  { code: "hi", name: "Hindi", native: "हिन्दी", dir: "ltr", script: "Devanagari", body: "devanagari", title: "devanagari" },
  { code: "mr", name: "Marathi", native: "मराठी", dir: "ltr", script: "Devanagari", body: "devanagari", title: "devanagari" },
  { code: "ne", name: "Nepali", native: "नेपाली", dir: "ltr", script: "Devanagari", body: "devanagari", title: "devanagari" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्", dir: "ltr", script: "Devanagari", body: "devanagari", title: "devanagari" },
  { code: "bn", name: "Bengali", native: "বাংলা", dir: "ltr", script: "Bengali", body: "bengali", title: "bengali" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", dir: "ltr", script: "Gurmukhi", body: "gurmukhi", title: "gurmukhi" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", dir: "ltr", script: "Gujarati", body: "gujarati", title: "gujarati" },
  { code: "ta", name: "Tamil", native: "தமிழ்", dir: "ltr", script: "Tamil", body: "tamil", title: "tamil" },
  { code: "te", name: "Telugu", native: "తెలుగు", dir: "ltr", script: "Telugu", body: "telugu", title: "telugu" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", dir: "ltr", script: "Kannada", body: "kannada", title: "kannada" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", dir: "ltr", script: "Malayalam", body: "malayalam", title: "malayalam" },
  { code: "si", name: "Sinhala", native: "සිංහල", dir: "ltr", script: "Sinhala", body: "sinhala", title: "sinhala" },
  { code: "my", name: "Burmese", native: "မြန်မာ", dir: "ltr", script: "Myanmar", body: "myanmar", title: "myanmar" },
  { code: "km", name: "Khmer", native: "ខ្មែរ", dir: "ltr", script: "Khmer", body: "khmer", title: "khmer" },
  { code: "lo", name: "Lao", native: "ລາວ", dir: "ltr", script: "Lao", body: "lao", title: "lao" },
  { code: "th", name: "Thai", native: "ไทย", dir: "ltr", script: "Thai", body: "thai", title: "thai" },
  { code: "ka", name: "Georgian", native: "ქართული", dir: "ltr", script: "Georgian", body: "georgian", title: "georgian" },
  { code: "hy", name: "Armenian", native: "Հայերեն", dir: "ltr", script: "Armenian", body: "armenian", title: "armenian" },
  { code: "am", name: "Amharic", native: "አማርኛ", dir: "ltr", script: "Ethiopic", body: "ethiopic", title: "ethiopic" },
  { code: "ti", name: "Tigrinya", native: "ትግርኛ", dir: "ltr", script: "Ethiopic", body: "ethiopic", title: "ethiopic" },
  { code: "ja", name: "Japanese", native: "日本語", dir: "ltr", script: "Japanese", body: "jp", title: "jp" },
  { code: "ko", name: "Korean", native: "한국어", dir: "ltr", script: "Korean", body: "kr", title: "kr" },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文", dir: "ltr", script: "Han", body: "sc", title: "sc" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文", dir: "ltr", script: "Han", body: "tc", title: "tc" },
  { code: "es", name: "Spanish", native: "Español", dir: "ltr", script: "Latin", body: "eb-garamond", title: "playfair" },
  { code: "pt", name: "Portuguese", native: "Português", dir: "ltr", script: "Latin", body: "literata", title: "playfair" },
  { code: "fr", name: "French", native: "Français", dir: "ltr", script: "Latin", body: "cormorant", title: "cormorant" },
  { code: "de", name: "German", native: "Deutsch", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "it", name: "Italian", native: "Italiano", dir: "ltr", script: "Latin", body: "cormorant", title: "dm-serif" },
  { code: "nl", name: "Dutch", native: "Nederlands", dir: "ltr", script: "Latin", body: "eb-garamond", title: "fraunces" },
  { code: "sv", name: "Swedish", native: "Svenska", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "no", name: "Norwegian", native: "Norsk", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "da", name: "Danish", native: "Dansk", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "fi", name: "Finnish", native: "Suomi", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "is", name: "Icelandic", native: "Íslenska", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "pl", name: "Polish", native: "Polski", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "cs", name: "Czech", native: "Čeština", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "sk", name: "Slovak", native: "Slovenčina", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "sl", name: "Slovenian", native: "Slovenščina", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "hr", name: "Croatian", native: "Hrvatski", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "sr", name: "Serbian", native: "Српски", dir: "ltr", script: "Cyrillic", body: "noto-serif", title: "fraunces" },
  { code: "bs", name: "Bosnian", native: "Bosanski", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "ro", name: "Romanian", native: "Română", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "hu", name: "Hungarian", native: "Magyar", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "el", name: "Greek", native: "Ελληνικά", dir: "ltr", script: "Greek", body: "noto-serif", title: "fraunces" },
  { code: "ru", name: "Russian", native: "Русский", dir: "ltr", script: "Cyrillic", body: "noto-serif", title: "fraunces" },
  { code: "uk", name: "Ukrainian", native: "Українська", dir: "ltr", script: "Cyrillic", body: "noto-serif", title: "fraunces" },
  { code: "bg", name: "Bulgarian", native: "Български", dir: "ltr", script: "Cyrillic", body: "noto-serif", title: "fraunces" },
  { code: "mk", name: "Macedonian", native: "Македонски", dir: "ltr", script: "Cyrillic", body: "noto-serif", title: "fraunces" },
  { code: "mn", name: "Mongolian", native: "Монгол", dir: "ltr", script: "Cyrillic", body: "noto-serif", title: "fraunces" },
  { code: "kk", name: "Kazakh", native: "Қазақ тілі", dir: "ltr", script: "Cyrillic", body: "noto-serif", title: "fraunces" },
  { code: "az", name: "Azerbaijani", native: "Azərbaycan", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "tr", name: "Turkish", native: "Türkçe", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "fil", name: "Filipino", native: "Filipino", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "sw", name: "Kiswahili", native: "Kiswahili", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "yo", name: "Yoruba", native: "Yorùbá", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "ha", name: "Hausa", native: "Hausa", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "ca", name: "Catalan", native: "Català", dir: "ltr", script: "Latin", body: "eb-garamond", title: "playfair" },
  { code: "gl", name: "Galician", native: "Galego", dir: "ltr", script: "Latin", body: "eb-garamond", title: "playfair" },
  { code: "eu", name: "Basque", native: "Euskara", dir: "ltr", script: "Latin", body: "eb-garamond", title: "playfair" },
  { code: "ga", name: "Irish", native: "Gaeilge", dir: "ltr", script: "Latin", body: "cormorant", title: "cormorant" },
  { code: "cy", name: "Welsh", native: "Cymraeg", dir: "ltr", script: "Latin", body: "cormorant", title: "cormorant" },
  { code: "eo", name: "Esperanto", native: "Esperanto", dir: "ltr", script: "Latin", body: "literata", title: "fraunces" },
  { code: "la", name: "Latin", native: "Latina", dir: "ltr", script: "Latin", body: "cormorant", title: "cormorant" },
];

export const languageByCode = (code: string): Language =>
  LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
