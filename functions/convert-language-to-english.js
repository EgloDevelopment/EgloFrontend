export default function convertLanguageCodeToName(languageCode) {
  const languageMap = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    ja: "Japanese",
    ru: "Russian",
    ko: "Korean",
    zh: "Chinese",
    ar: "Arabic",
    pt: "Portuguese",
    it: "Italian",
    tr: "Turkish",
    nl: "Dutch",
    sv: "Swedish",
    pl: "Polish",
    el: "Greek",
    da: "Danish",
    no: "Norwegian",
    fi: "Finnish",
    he: "Hebrew",
    id: "Indonesian",
    cs: "Czech",
    ro: "Romanian",
    hu: "Hungarian",
    th: "Thai",
    bg: "Bulgarian",
    uk: "Ukrainian",
    hr: "Croatian",
    sl: "Slovenian",
    ms: "Malay",
    sk: "Slovak",
    et: "Estonian",
    lt: "Lithuanian",
    lv: "Latvian",
    vi: "Vietnamese",
    sr: "Serbian",
    fil: "Filipino",
    hi: "Hindi",
    bn: "Bengali",
    gu: "Gujarati",
    ta: "Tamil",
    te: "Telugu",
    mr: "Marathi",
    kn: "Kannada",
    ur: "Urdu",
    fa: "Persian",
    th: "Thai",
    sw: "Swahili",
  };

  if (!languageCode) {
    return "Unknown";
  }

  const primaryLanguageCode = languageCode.split("-")[0];
  const englishName = languageMap[primaryLanguageCode];

  if (englishName) {
    return englishName;
  } else {
    return "Unknown";
  }
}
