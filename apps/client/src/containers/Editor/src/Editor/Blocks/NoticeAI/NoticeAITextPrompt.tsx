import { ReactNode, useEffect, useRef, useState } from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react'

import { NTransforms } from '../../noticeEditor'
import { CustomText } from '../../types'
import { htmlParser, parseNode } from '../../Parsers/HTML.parser'
import { jsx } from 'slate-hyperscript'
import { AIAssistant } from '../../AIAssistant'

export interface NoticeAIBlock {
	type: 'notice-ai-text-prompt'
	children: CustomText[]
	// No ID here! We don't want to save this to the database.
}

interface NoticeAIProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: NoticeAIBlock
}

export const NoticeAITextPrompt = ({ attributes, children, element }: NoticeAIProps) => {
	const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
	const editor = useSlate()
	const path = ReactEditor.findPath(editor, element)
	const ref = useRef<HTMLTextAreaElement | null>(null)

	const insertMarkdown = async (string: string) => {
		try {
			const promptBlockPath = ReactEditor.findPath(editor, element)
			const breakLine = jsx('element', { type: 'paragraph' })

			Transforms.removeNodes(editor, { at: promptBlockPath })
			Transforms.insertNodes(editor, breakLine, { at: promptBlockPath })

			const parsed = htmlParser(string)
			const elements = parseNode(parsed.body)
			if (elements) {
				Transforms.insertFragment(
					editor,
					[
						{
							type: 'paragraph',
							children: [{ text: '' }],
						},
						...elements,
					],
					{ at: promptBlockPath }
				)
				return
			}
		} catch (e) {
			destroyElement()
		}
	}

	const destroyElement = () => {
		Transforms.removeNodes(editor, { at: path })
	}

	useEffect(() => {
		if (ref.current) {
			setTimeout(() => ref.current?.focus(), 15)
		}
	}, [ref.current])

	return (
		<div
			{...attributes}
			contentEditable={false}
			// @ts-ignore
			onKeyDown={(e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					destroyElement()
					e.preventDefault()
					e.stopPropagation()
				}
			}}
		>
			<AIAssistant
				destroyElement={destroyElement}
				status={status}
				setStatus={setStatus}
				insertMarkdown={insertMarkdown}
			/>
			<div contentEditable={false} style={{ height: 0 }}>
				{children}
			</div>
		</div>
	)
}

export const withNoticeAITextPrompt = (editor: Editor) => {
	const { isVoid } = editor

	editor.isVoid = (element) => {
		return element.type === 'notice-ai-text-prompt' ? true : isVoid(element)
	}
	return editor
}

export const insertNoticeAITextPrompt = (editor: Editor) => {
	if (!editor.selection) {
		const end = Editor.end(editor, [])
		Transforms.select(editor, end)
	}

	NTransforms.insertNodeCurrent(editor, {
		type: 'notice-ai-text-prompt',
		children: [{ text: '' }],
	})
}
