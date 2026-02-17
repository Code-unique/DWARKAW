"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Currency } from "@/lib/currency"

interface CurrencyContextType {
  currency: Currency
  toggleCurrency: () => void
  setCurrency: (c: Currency) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NPR")

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => (prev === "NPR" ? "USD" : "NPR"))
  }, [])

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider")
  return context
}
