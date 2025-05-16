import React, { ReactNode, useContext, useState } from 'react'
import { LangKeys, getCurrentLang } from '.'

export type SetLang = (lang: LangKeys) => void

export interface LangContextI {
	lang?: LangKeys
	setLangCtx: SetLang
}

interface LangProviderProps {
	children: ReactNode
}

export const LangContext = React.createContext<LangContextI | null>(null)

export const LangProvider = ({ children }: LangProviderProps) => {
	const [lang, setLangCtx] = useState<LangKeys>(getCurrentLang())

	return <LangContext.Provider value={{ lang, setLangCtx }}>{children}</LangContext.Provider>
}

export const useLangContext = () => {
	const context = useContext(LangContext)
	if (context === null) throw new Error('Received null while reading useContext(LangContext).')
	return context
}
