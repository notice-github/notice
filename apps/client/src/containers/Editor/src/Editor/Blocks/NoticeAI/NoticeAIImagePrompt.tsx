import { ReactNode, useEffect, useRef, useState } from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react'
import styled, { useTheme } from 'styled-components'

import { ArrowRight } from '../../../Icons'
import { useEditorMethods } from '../../Contexts/EditorMethods.provider'
import { CustomText } from '../../types'
import { insertImage } from '../Image/Image'
import { useT } from '../../../../../../hooks/useT'
import { Loader } from '../../Components/Loader/Loader'
import { AIIcon } from '../../../../../../icons/ProjectIcons'
import { useTrackEvent } from '../../../../../../hooks/analytics/useTrackEvent'
import { useUser } from '../../../../../../hooks/api/useUser'

export enum ImageStyle {
	Realistic = 'realistic',
	PixelArt = 'pixel-art',
	IsometricArt = 'isometric-art',
	Drawing = 'drawing',
	FlatIllustration = 'flat-illustration',
}

export interface NoticeAIImagePromptBlock {
	type: 'notice-ai-image-prompt'
	children: CustomText[]
	initialPrompt?: string
}

interface NoticeAIImagePromptProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: NoticeAIImagePromptBlock
}

export const NoticeAIImagePrompt = ({ attributes, children, element }: NoticeAIImagePromptProps) => {
	const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
	const [prompt, setPrompt] = useState(element.initialPrompt ?? '')
	const editor = useSlate()
	const path = ReactEditor.findPath(editor, element)
	const ref = useRef<HTMLTextAreaElement | null>(null)
	const theme = useTheme()
	const trackEvent = useTrackEvent()
	const user = useUser()
	const [t] = useT()

	const { generateAIImage } = useEditorMethods()

	const generateImg = async () => {
		if (status !== 'idle') return
		setStatus('loading')
		try {
			if (!generateAIImage) throw new Error('No generateAIImage provided')
			const { url = '', aspectRatio = 1.75, mimetype = 'image/png', description = '' } = await generateAIImage(prompt)

			Transforms.removeNodes(editor, { at: path })

			if (!url) throw new Error('No url provided')

			insertImage(editor, { url, aspectRatio, mimetype, description })
		} catch (e: any) {
			console.error(e)
			destroyElement()
		}

		// TODO: need to select created image
	}

	// This function is called when the user types in the textarea
	// It will resize the textarea to fit the text
	const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
		// @ts-ignore
		event.target.style.height = '21px' // Reset the height at the start of the input event
		// @ts-ignore
		event.target.style.height = `${event.target.scrollHeight}px` // Set the height to scroll height
	}

	const destroyElement = () => {
		Transforms.removeNodes(editor, { at: path })
	}

	useEffect(() => {
		const textArea = ref.current
		if (textArea) {
			// Set the initial height
			textArea.style.height = `${textArea.scrollHeight}px`

			// Focus end of text
			textArea.focus()
			var length = textArea.value.length
			textArea.selectionStart = length
			textArea.selectionEnd = length
		}
	}, [ref.current])

	return (
		<Wrapper
			{...attributes}
			contentEditable={false}
			onKeyDown={(e: KeyboardEvent) => {
				if (e.key === 'Enter') {
					generateImg()
					e.preventDefault()
					e.stopPropagation()
				}
			}}
		>
			<div>
				<AIIcon size={16} color={theme.colors.sweetpurple} />
			</div>
			<TextWrapper>
				{status === 'loading' && (
					<ActionsWrapper style={{ justifyContent: 'space-between' }}>
						<AIIsWriting>{t('AI is generating an image...', 'AIIsGeneratingImage')}</AIIsWriting>
					</ActionsWrapper>
				)}
				{status === 'idle' && (
					<TextArea
						autoFocus
						value={prompt}
						onChange={(event) => setPrompt(event.target.value)}
						placeholder={t(
							'A field of sunflowers at the end of the day. In the style of Van Ghogh paintings.',
							'GenImagePlaceholder'
						)}
						onInput={handleInput}
						ref={ref}
					/>
				)}
			</TextWrapper>
			<StyledRow>
				{status === 'loading' && <Loader size={17} color={theme.colors.sweetpurple} />}
				{status === 'idle' && (
					<WrapperArrowRight disabled={!prompt} onClick={() => prompt && generateImg()}>
						<ArrowRight size={20} color={'white'} />
					</WrapperArrowRight>
				)}
			</StyledRow>

			<div contentEditable={false} style={{ height: 0 }}>
				{children}
			</div>
		</Wrapper>
	)
}

const WrapperArrowRight = styled.div<{ disabled: boolean }>`
	display: flex;
	justify-content: center;
	border-radius: 100%;
	background-color: ${({ theme, disabled }) => (disabled ? theme.colors.grey : theme.colors.sweetpurple)};
	width: 20px;
	height: 20px;
	align-self: center;
	opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
	:hover {
		cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
		opacity: ${({ disabled }) => (disabled ? 0.5 : 0.8)};
	}
`

const StyledRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	gap: 8px;
`

const TextArea = styled.textarea`
	font-family: inherit;
	outline: none;
	overflow: hidden;
	height: 21px;
	font-size: inherit;
	line-height: inherit;
	border: none;
	background: none;
	width: 100%;
	display: block;
	resize: none;
	padding: 0px;
	font-size: 14px;
`

const TextWrapper = styled.div`
	width: 100%;
	padding-left: 12px;
	font-size: 14.5px;
	font-weight: 500;
`

const ActionsWrapper = styled.div`
	display: flex;
	justify-content: end;
`

const AIIsWriting = styled.span`
	font-weight: 500;
	font-size: 14.5px;
	color: ${(props) => props.theme.colors.sweetpurple};
`

const Wrapper = styled.div`
	display: flex;
	position: relative;
	margin-top: 20px;
	width: 100%;
	max-width: fill-available;
	font-size: 16px;
	border-radius: 5px;
	border: none;
	box-sizing: border-box;
	padding: 10px 10px 10px 10px;
	margin-left: 0px;
	box-shadow:
		rgba(15, 15, 15, 0.05) 0px 0px 0px 1px,
		rgba(15, 15, 15, 0.1) 0px 3px 6px,
		rgba(15, 15, 15, 0.2) 0px 9px 24px;
`

export const withNoticeAIImagePrompt = (editor: Editor) => {
	const { isVoid } = editor

	editor.isVoid = (element) => {
		return element.type === 'notice-ai-image-prompt' ? true : isVoid(element)
	}
	return editor
}

export const insertNoticeAIImagePrompt = (editor: Editor, editorMethods?: any, text?: string, at?: Array<number>) => {
	if (!editor.selection) {
		const end = Editor.end(editor, [])
		Transforms.select(editor, end)
	}

	Transforms.insertNodes(
		editor,
		{
			type: 'notice-ai-image-prompt',
			children: [{ text: '' }],
			initialPrompt: text ?? '',
		},
		{
			at: at ?? undefined,
		}
	)
}
