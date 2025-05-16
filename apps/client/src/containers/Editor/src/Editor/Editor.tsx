// libs
import { useEffect, useRef, useState } from 'react'
import { BaseEditor, createEditor, Descendant, Editor, Transforms } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import styled, { css } from 'styled-components'
import { useRenderElement } from './Blocks/renderElements'
import { HoveringToolbar } from './HoveringToolbar/HoveringToolbar'

// import types so they are declared, is there another way to do that?
import './types'

// Components and helpers
import { decorate } from './decorate'
import { onEditorKeyDown } from './keyDown'
import { useRenderLeaf } from './Leaves/Leaf'
import { SlashMenu } from './SlashMenu/SlashMenu'
import { SlashMenuProvider, useSlashMenu } from './SlashMenu/SlashMenuProvider'

// ---PLUGINS---
// community plugins
import { withHistory } from 'slate-history'

// Notice own plugins
import { NLanguages } from '../../../../utils/languages'
import { withChecklists } from './Blocks/Checklist/Checklist'
import { withCode } from './Blocks/Code/Code'
import { withEmbeds } from './Blocks/Embed/Embed'
import { withExpandable } from './Blocks/Expandable/Expandable'
import { withHeader } from './Blocks/Header'
import { containsTopLevelNodes, withEditorNormalization } from './Blocks/helpers'
import { withHint } from './Blocks/Hint'
import { withHTML } from './Blocks/HTML/HTML'
import { withImages } from './Blocks/Image/Image'
import { withJavascript } from './Blocks/Javascript/Javascript'
import { withList } from './Blocks/List'
import { withNoticeAIImagePrompt } from './Blocks/NoticeAI/NoticeAIImagePrompt'
import { withNoticeAITextPrompt } from './Blocks/NoticeAI/NoticeAITextPrompt'
import { withPage } from './Blocks/PageBlock/PageBlock'
import { withParagraphNorm } from './Blocks/Paragraph'
import { withPowerBar } from './Blocks/PowerBar/PowerBar'
import { withQuote } from './Blocks/Quote'
import { withTables } from './Blocks/Table/Table'
import { EditorMethodsContext, EditorMethodsProvider } from './Contexts/EditorMethods.provider'
import { NoticeEditorProvider, useNoticeEditorContext } from './Contexts/NoticeEditor.provider'
import { withHtmlParser } from './Parsers/HTML.parser'
import { withShortcuts } from './Parsers/Shortcuts'
import { CreateWithAICTA } from './AIAssistant'
import { CreateImageWithAICTA } from './AIAssistantImage'

const newDefaultState = (): Descendant[] => [
	{
		type: 'paragraph',
		children: [{ text: '' }],
		id: crypto.randomUUID(),
	},
]

export interface EditorOptions {
	readOnly?: boolean
	editOnly?: boolean
	lang?: NLanguages.LANGUAGE_CODES_TYPE
}

interface Props {
	value: Descendant[]
	setValue?: (next: Descendant[]) => any
	title?: string
	setTitle?: (title: string) => any
	setEditor?: (editor: BaseEditor & ReactEditor) => any
	editorMethods: Partial<EditorMethodsContext>
	editorOptions?: EditorOptions
	noPadding?: boolean
}

// renders the Slate wrappers and SlashMenuProvider
export const NoticeEditor = ({
	value,
	setValue,
	title,
	setTitle,
	setEditor,
	editorMethods,
	editorOptions = {},
	noPadding,
}: Props) => {
	const onChange = (value: any) => {
		const hasChanges = editor.operations.some((op) => 'set_selection' !== op.type)
		if (hasChanges) setValue?.call(setValue, value)
	}

	const isRtl = NLanguages.checkRtl(editorOptions?.lang)

	const [editor] = useState(
		withHtmlParser(
			withEmbeds(
				withEditorNormalization(
					withPage(
						withNoticeAIImagePrompt(
							withTables(
								withPowerBar(
									withExpandable(
										withCode(
											withJavascript(
												withHTML(
													withHint(
														withShortcuts(
															withQuote(
																withHeader(
																	withNoticeAITextPrompt(
																		withList(
																			withChecklists(
																				withImages(
																					withParagraphNorm(withReact(withHistory(createEditor())), editorOptions),
																					editorMethods
																				)
																			)
																		)
																	)
																)
															)
														)
													)
												)
											)
										),
										editorOptions
									)
								)
							)
						)
					)
				)
			)
		)
	)

	useEffect(() => {
		setEditor?.call(setEditor, editor)
	}, [])

	return (
		<RtlContainer rtl={isRtl}>
			<Slate editor={editor} value={!value || value?.length === 0 ? newDefaultState() : value} onChange={onChange}>
				{/* Provider for mainly options for the moment  */}
				<NoticeEditorProvider options={{ ...editorOptions }}>
					{/* Provider with methods for side effects (uploads, etc.)  */}
					<EditorMethodsProvider editorMethods={editorMethods}>
						{/* This provides context and position for Slash Menu  */}
						<SlashMenuProvider>
							<NoticeEditable editor={editor} title={title} setTitle={setTitle} noPadding={noPadding} />
						</SlashMenuProvider>
					</EditorMethodsProvider>
				</NoticeEditorProvider>
			</Slate>
		</RtlContainer>
	)
}

const RtlContainer = styled.div<{ rtl: boolean }>`
	${({ rtl }) =>
		rtl &&
		css`
			* {
				direction: rtl !important;
			}
		`}
`

interface NoticeEditableProps extends Pick<Props, 'title' | 'setTitle'> {
	editor: Editor
	noPadding?: boolean
}

// renders the editable area, toolbar and slash menu
export const NoticeEditable = ({ editor, title, setTitle, noPadding }: NoticeEditableProps) => {
	const [renderElement] = useRenderElement()
	const [renderLeaf] = useRenderLeaf()
	const { setSlashOpen, slashOpen } = useSlashMenu()
	const { readOnly, editOnly } = useNoticeEditorContext()

	const editorContainsNodes = containsTopLevelNodes(editor.children, [
		'image',
		'video',
		'notice-ai-image-prompt',
		'notice-ai-text-prompt',
		'embed',
		'expandable',
	])

	useEffect(() => {
		// timeout otherwise <Editable> decorate() will not be called on first render
		setTimeout(() => {
			const editorLength = editor?.children?.length
			// if the editor has more than one depth 2 node, focus the second one, otherwise, focus the first one
			// this is to show the type commands placeholder for first page

			Transforms.select(editor, Editor.start(editor, editorLength > 1 ? [1] : [0]))
		}, 100)
	}, [])

	const displayCreateWithAI =
		!readOnly &&
		(!editor?.children?.length || (editor?.children?.length === 1 && editor.children[0]?.children[0]?.text === ''))
	const displayCreateImage = !readOnly && !displayCreateWithAI && !editorContainsNodes && editor?.children?.length > 2
	return (
		// keep a space at the bottom of the editor, when the user clicks it will focus the bottom paragraph
		// this is to give a feeling of "space" to the user

		// the outer wrapper is used to stop messing with the default click inside the editor
		<PaddingWrapper
			onClick={() => {
				// deselect the previous selection to prevent the focus jump
				ReactEditor.deselect(editor)
				// focus the last block when user clicks on the padding wrapper
				const lastBlock = Editor.end(editor, [editor.children.length - 1, 0])
				if (editor.selection?.anchor.path[0] !== lastBlock.path[0]) {
					Transforms.select(editor, lastBlock)
					// ReactEditor.focus(editor)
				}
			}}
			noPadding={noPadding}
		>
			<Container
				onClick={(e) => {
					e.stopPropagation()
				}}
			>
				{/* this is the toolbar with the inline tools */}
				{!readOnly && <HoveringToolbar />}
				{/* this is the menu that appears when pressing '/' */}
				{!readOnly && <SlashMenu />}
				{title != undefined && setTitle != undefined && <PageTitle editor={editor} title={title} setTitle={setTitle} />}
				{/* {displayCreateWithAI && <CreateWithAICTA />} */}
				{/* {displayCreateImage && <CreateImageWithAICTA />} */}
				<Editable
					// keep a space at the bottom of the editor, when the user clicks it will focus the bottom paragraph
					// this is to give a feeling of "space" to the user
					// big switch cases with all the blocks
					renderElement={(props) => renderElement(props)}
					// Leaf (Leaves) are the inline element like bold, italic, etc.
					renderLeaf={renderLeaf}
					// handles all the times a user presses a key when inside the editor
					onKeyDown={(event) => onEditorKeyDown(event, editor, setSlashOpen, slashOpen)}
					// A decoration is a range of the document that has a specific Mark dynamically applied to it based on its content or some other external state
					decorate={readOnly || editOnly ? undefined : ([node, path]) => decorate(node, path, editor)}
					autoFocus={title != undefined && title !== ''}
					spellCheck
					// this is the readOnly state of the editor
					readOnly={readOnly}
					// Might use plugins in the future? Need to check.
					// plugins={plugins}
				/>
			</Container>
		</PaddingWrapper>
	)
}

const escapeHTML = (html: string) => {
	if (!html) return ''

	const esca: { [key: string]: string } = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		"'": '&#39;',
		'"': '&quot;',
	}

	const clean = html.replace(/[&<>'"]/g, (m: string) => esca[m])
	return clean
}

const PageTitle = ({ editor, title, setTitle }: NoticeEditableProps) => {
	const divRef = useRef<HTMLDivElement>(null)

	return (
		<TitleInput
			autoFocus={title == undefined || title === ''}
			dangerouslySetInnerHTML={{ __html: escapeHTML(title ?? '') }}
			ref={divRef}
			onBlur={() => {
				const newVal = divRef?.current?.innerText

				if (newVal === title || newVal === undefined) return

				setTimeout(() => {
					setTitle?.call(setTitle, newVal)
				}, 1)
			}}
			onFocus={(e) => Transforms.deselect(editor)}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault()
					ReactEditor.focus(editor)

					// ! Ugly code
					// This code insert an empty paragraph if the first node is not an empty text
					const firstChild = editor.children[0] as any
					if (
						!(
							['paragraph', 'header-1', 'header-2', 'header-3'].includes(firstChild.type) &&
							firstChild.children.reduce((a: any, b: any) => a + b.text, '') === ''
						)
					) {
						Transforms.insertNodes(
							editor,
							{
								type: 'paragraph',
								children: [{ text: '' }],
							},
							{ at: [0], select: true }
						)
					}
				} else if (e.key === 'ArrowDown') {
					e.preventDefault()
					ReactEditor.focus(editor)
				}
			}}
			data-placeholder="Untitled"
			contentEditable={true}
			suppressContentEditableWarning={true}
		></TitleInput>
	)
}

const TitleInput = styled.div`
	width: calc(100% - 30px);
	padding-left: 30px;

	padding-bottom: 24px;

	${({ theme }) => theme.fonts.editor};
	font-size: 30px;
	font-weight: 700;
	color: var(--ntc-user-font-color);

	outline: none;
	border: none;

	&[data-placeholder]:empty:before {
		content: attr(data-placeholder);
		color: ${({ theme }) => theme.colors.textLightGrey};
	}
`

const Container = styled.div`
	font-size: 14px;
`

const PaddingWrapper = styled.div<{ noPadding?: boolean }>`
	padding: ${({ noPadding }) => (noPadding ? undefined : '32px')};
	padding-left: ${({ noPadding }) => (noPadding ? undefined : '24px')};
`
