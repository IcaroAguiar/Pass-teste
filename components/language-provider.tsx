"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Language } from "@/lib/translations"

const languageNames: Record<Language, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
}

const languageLocales: Record<Language, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
}

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  languageName: string
  locale: string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
  defaultLanguage = "pt",
  storageKey = "pass-language",
}: {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [mounted, setMounted] = useState(false)

  // Carregar idioma do localStorage na montagem
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey) as Language | null
    if (stored && (stored === "pt" || stored === "en" || stored === "es")) {
      setLanguageState(stored)
    }
  }, [storageKey])

  // Atualizar HTML e localStorage quando o idioma mudar (após montagem)
  useEffect(() => {
    if (!mounted) return
    // Forçar atualização do atributo lang
    const htmlElement = document.documentElement
    htmlElement.setAttribute('lang', languageLocales[language])
    localStorage.setItem(storageKey, language)
  }, [language, mounted, storageKey])

  const setLanguage = React.useCallback((newLanguage: Language) => {
    if (newLanguage !== language) {
      setLanguageState(newLanguage)
    }
  }, [language])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languageName: languageNames[language],
        locale: languageLocales[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage deve ser usado dentro de um LanguageProvider")
  }
  return context
}

