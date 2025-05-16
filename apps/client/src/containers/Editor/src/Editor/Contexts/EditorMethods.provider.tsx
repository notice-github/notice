import { FileModel } from '@notice-app/models'
import React, { ReactNode, useContext, useState } from 'react'
import { RephraseTypes } from '../HoveringToolbar/HoveringAIMenu'

export type SetEditorMethods = (context: Partial<EditorMethodsContext>) => void

export type GenerateAIImage = (prompt: string, style?: string, destroyElement?: () => void) => Promise<FileModel.client>
export type GenerateAIPage = (
	prompt: string,
	addResponse: (s: string) => void,
	destroyElement?: () => void
) => Promise<string>
export type GenerateRephraseText = (prompt: string, type: RephraseTypes) => Promise<string>
export type AIImageSuggestion = (text: string) => Promise<string>
export type ChangePage = (pageid?: string) => void
export type SaveToBMS = (value: any) => Promise<void>
export type onUploadFile = (file: File, type?: 'image' | 'video' | 'application' | 'audio') => Promise<FileModel.client>
export type OpenUploader = (onSelect?: (file: FileModel.client) => any) => void
export type GetPageValue = (id?: string) => undefined | any[]
export type DeletePage = (id?: string) => any
export type DuplicatePage = (id?: string) => any

export interface EditorMethodsContext {
	generateAIImage?: GenerateAIImage
	generateAIPage?: GenerateAIPage
	generateRephraseAIText?: GenerateRephraseText
	imageSuggestion?: AIImageSuggestion
	setEditorMethods: SetEditorMethods
	changePage?: ChangePage
	saveToBMS?: SaveToBMS
	openImageUploader?: OpenUploader
	openVideoUploader?: OpenUploader
	openDocumentUploader?: OpenUploader
	openAudioUploader?: OpenUploader
	onUploadFile?: onUploadFile
	getPageValue?: GetPageValue
	deletePage?: DeletePage
	duplicatePage?: DuplicatePage
}

interface EditorMethodsProviderProps {
	children: ReactNode
	editorMethods: Partial<EditorMethodsContext>
}

export const EditorMethodsContext = React.createContext<EditorMethodsContext | null>(null)

export const EditorMethodsProvider = ({ children, editorMethods }: EditorMethodsProviderProps) => {
	const [, setEditorMethods] = useState<Partial<EditorMethodsContext>>({})

	return (
		<EditorMethodsContext.Provider value={{ ...editorMethods, setEditorMethods }}>
			{children}
		</EditorMethodsContext.Provider>
	)
}

export const useEditorMethods = () => {
	const context = useContext(EditorMethodsContext)
	if (context === null) throw new Error('Received null while reading useContext(EditorMethodsContext).')
	return context
}
