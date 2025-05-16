import { NLanguages } from '../../../../../utils/languages'
import React, { ReactNode, useContext, useState } from 'react'

export type SetNoticeEditor = (context: Partial<NoticeEditorContext>) => void

export interface NoticeEditorContext {
	readOnly?: boolean
	editOnly?: boolean
	lang?: NLanguages.LANGUAGE_CODES_TYPE
	setNoticeEditor: SetNoticeEditor
}

interface NoticeEditorProviderProps {
	children: ReactNode
	options: any
}

export const NoticeEditorContext = React.createContext<NoticeEditorContext | null>(null)

export const NoticeEditorProvider = ({ children, options }: NoticeEditorProviderProps) => {
	const [, setNoticeEditor] = useState<Partial<NoticeEditorContext>>({})

	return <NoticeEditorContext.Provider value={{ ...options, setNoticeEditor }}>{children}</NoticeEditorContext.Provider>
}

export const useNoticeEditorContext = () => {
	const context = useContext(NoticeEditorContext)
	if (context === null) throw new Error('Received null while reading useContext(NoticeEditorContext).')
	return context
}
