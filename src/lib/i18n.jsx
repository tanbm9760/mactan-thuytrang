import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations, languages } from './translations'

const DEFAULT_LANG = 'vi'
const STORAGE_KEY = 'wedding-lang'

const LanguageContext = createContext(null)

/**
 * Luôn mở thiệp bằng tiếng Việt, trừ khi khách đã tự chọn ngôn ngữ khác.
 * Cố tình KHÔNG đoán theo navigator.language: rất nhiều người Việt để máy
 * tiếng Anh, đoán sai thì khách mở thiệp ra thấy toàn tiếng Anh.
 */
function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && languages.some((l) => l.code === saved)) return saved
  } catch {
    /* trình duyệt chặn localStorage — bỏ qua */
  }
  return DEFAULT_LANG
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(detectLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      /* bỏ qua */
    }
  }, [language])

  const value = useMemo(() => {
    const dict = translations[language] ?? translations[DEFAULT_LANG]
    return {
      language,
      setLanguage: setLanguageState,
      languages,
      /** t('rsvp.title') — trả về chuỗi, hàm hoặc mảng tuỳ khoá */
      t: (path) =>
        path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), dict) ?? path,
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage phải được dùng bên trong <LanguageProvider>')
  return ctx
}
