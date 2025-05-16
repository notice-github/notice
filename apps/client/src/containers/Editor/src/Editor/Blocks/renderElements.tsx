// libs
import { ReactElement, useCallback, useEffect } from 'react'
import { Editor, Element, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react'
import { HoverActionsWrapper } from '../HoverActions/HoverActions'
import { CheckListItemElement } from './Checklist/Checklist'

// Components
import styled from 'styled-components'
import { useNoticeEditorContext } from '../Contexts/NoticeEditor.provider'
import { CodeElement } from './Code/Code'
import { Divider } from './Divider'
import { Document } from './Document/Document'
import { EmbedBlock } from './Embed/Embed'
import { Expandable, expandableActionMenu } from './Expandable/Expandable'
import { HTMLElement } from './HTML/HTML'
import { Header, headerActionMenu } from './Header'
import { Hint } from './Hint'
import { Image, imageActionMenu } from './Image/Image'
import { JavascriptElement } from './Javascript/Javascript'
import { BulletedList, ListItem, NumberedList } from './List'
import { NoticeAIImagePrompt } from './NoticeAI/NoticeAIImagePrompt'
import { NoticeAITextPrompt } from './NoticeAI/NoticeAITextPrompt'
import { PageBlock, pageActionMenu } from './PageBlock/PageBlock'
import { Paragraph } from './Paragraph'
import { PowerBar, powerBarMenuActions } from './PowerBar/PowerBar'
import { Quote } from './Quote'
import Table from './Table/Table'
import { Video } from './Video/Video'
import { Audio } from './Audio/Audio'

const translationExclusionList = ['bulleted-list', 'numbered-list', 'page']

const GetElement = (props: RenderElementProps) => {
	switch (props.element.type) {
		// text elements
		case 'code':
			return <CodeElement {...props} />
		case 'paragraph':
			return <Paragraph {...props} />
		case 'header-1':
			return <Header {...props} as="h1" />
		case 'header-2':
			return <Header {...props} as="h2" />
		case 'header-3':
			return <Header {...props} as="h3" />
		case 'quote':
			return <Quote {...props} />
		case 'hint':
			// TODO: fix typing
			return <Hint {...props} />
		case 'list-item':
			return <ListItem {...props} />
		case 'numbered-list':
			return <NumberedList {...props} />
		case 'bulleted-list':
			return <BulletedList {...props} />
		case 'divider':
			return <Divider {...props} />
		case 'image':
			// TODO: fix typing
			return <Image {...props} />
		case 'document':
			// TODO: fix typing
			return <Document {...props} />
		case 'video':
			// TODO: fix typing
			return <Video {...props} />
		case 'audio':
			return <Audio {...props} />
		case 'check-list-item':
			// TODO: fix typing
			return <CheckListItemElement {...props} />
		case 'expandable':
			return <Expandable {...props} />
		case 'embed':
			// TODO: fix typing
			return <EmbedBlock {...props} />
		case 'notice-ai-text-prompt':
			// TODO: fix typing
			return <NoticeAITextPrompt {...props} />
		case 'notice-ai-image-prompt':
			// TODO: fix typing
			return <NoticeAIImagePrompt {...props} />
		case 'javascript':
			return <JavascriptElement {...props} />
		case 'html':
			return <HTMLElement {...props} />
		// TODO: fix typing
		case 'power-bar':
			return <PowerBar {...props} />
		case 'table':
			return <Table {...props} />
		case 'page':
			return <PageBlock {...props} />

		// fall through case
		default:
			return <Paragraph {...props} />
	}
}

export const useRenderElement = () => {
	const renderElement = useCallback((props: RenderElementProps) => {
		const { readOnly, editOnly } = useNoticeEditorContext()
		const editor = useSlate()
		const type = props?.element?.type ?? ''
		const element = props?.element ?? null
		let extraMenuActions: Array<ReactElement> = []

		// inject id and wrapper for readonly elements
		if (readOnly || editOnly) {
			const isSelectable = readOnly && !translationExclusionList.includes(type)
			return (
				<ReadOnlyWrapper
					id={`${props.element && props.element.id}${editOnly ? '-edit' : ''}`}
					className={isSelectable ? 'notice-block-wrapper' : ''}
					onClick={(e) => {
						// when the click happens once, we add the focused class to not focus it anymore
						if (editOnly && !e.currentTarget.classList.contains('focused')) {
							ReactEditor.focus(editor)
						}
					}}
				>
					<div
						id={`${props.element && props.element.id}${editOnly ? '-edit' : ''}`}
						className={readOnly ? 'readonly-handler' : ''}
					>
						<div className="readonly-handler-circle"></div>
					</div>
					{GetElement(props)}
				</ReadOnlyWrapper>
			)
		}

		// list item don't have hover actions, readOnly either
		if ((type && ['list-item'].includes(type)) || readOnly) return GetElement(props)

		if (element && type) {
			extraMenuActions = /^(power-bar|header-1|header-2|header-3|expandable|image|page)$/.test(type)
				? extraMenuActionsList[type](editor, element)
				: []
		}

		useEffect(() => {
			const last = editor.children[editor.children.length - 1]
			if (Element.isElement(last) && last.type === 'paragraph') return
			Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] }, { at: [editor.children.length] })
		}, [])

		// for other elements, display icons on the left
		return (
			<HoverActionsWrapper element={props.element} extraMenuActions={extraMenuActions}>
				{GetElement(props)}
			</HoverActionsWrapper>
		)
	}, [])
	return [renderElement]
}

type MenuAction = (editor: Editor, element: Element) => JSX.Element[]

type MenuValue = string | MenuAction | any

interface MenuActionsList {
	[x: string]: MenuValue
}

const extraMenuActionsList: MenuActionsList = {
	'power-bar': powerBarMenuActions,
	expandable: expandableActionMenu,
	image: imageActionMenu,
	page: pageActionMenu,
	'header-1': headerActionMenu,
	'header-2': headerActionMenu,
	'header-3': headerActionMenu,
}

const ReadOnlyWrapper = styled.div`
	position: relative;
	padding-right: 3px;
`
