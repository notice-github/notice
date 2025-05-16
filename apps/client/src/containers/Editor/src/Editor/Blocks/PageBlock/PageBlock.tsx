import { FileModel } from '@notice-app/models'
import { lighten, transparentize } from 'polished'
import { ReactNode, useMemo } from 'react'
import { Editor, Element, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react'
import styled, { css, useTheme } from 'styled-components'

import { getCssVariableValue } from '../../../../../../utils/CSS'
import { DuplicateIcon, PlusIcon, TrashIcon } from '../../../Icons'
import { ArrowIcon } from '../../../Icons/ArrowIcon'
import { LayoutImageIcon } from '../../../Icons/LayoutImage'
import { LayoutTextIcon } from '../../../Icons/LayoutText'
import { SyncIcon } from '../../../Icons/SyncIcon'
import { MenuItem } from '../../Components/Menu/MenuItem'
import { MenuSectionTitle } from '../../Components/Menu/MenuSectionTitle'
import { MenuSeparator } from '../../Components/Menu/MenuSeparator'
import { useEditorMethods } from '../../Contexts/EditorMethods.provider'
import { NTransforms } from '../../noticeEditor'
import { CustomText } from '../../types'
import { useT } from '../../../../../../hooks/useT'
export interface PageBlock {
	id?: string
	type: 'page'
	children: CustomText[]

	displaySummary?: boolean
	displayBorder?: boolean
	summary?: string
	displayCover?: boolean
	cover?: string
}

interface PageProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: PageBlock
}

const createSummary = (texts: any[]) => {
	let summary = ''

	for (let text of texts) {
		const leaves: { text: string }[] = text.data?.leaves ?? text.children
		const words = leaves
			.reduce((acc, leaf) => acc + leaf.text, '')
			.split(/\s+/)
			.filter((word) => word !== '')

		for (let word of words) {
			if (summary.length + word.length > 197) {
				return summary + '...'
			} else {
				summary += (summary.length > 0 ? ' ' : '') + word
			}
		}
	}

	return summary
}

export const PageBlock = ({ attributes, children, element }: PageProps) => {
	const theme = useTheme()
	const editor = useSlate()
	const [t] = useT()
	const { changePage, openImageUploader, getPageValue } = useEditorMethods()

	const onSelectFile = (file: FileModel.client) => {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { cover: file.url }, { at: path })
	}

	const isUntitled = element.children.reduce((text, leaf) => text + leaf.text, '') === ''
	const hasCover = element.displayCover && element.cover !== undefined

	const summary = useMemo(() => {
		if (element.displaySummary) {
			if (element.summary) return element.summary
			const blocks = getPageValue?.call(getPageValue, element.id)
			if (!blocks) return element.summary
			else {
				const texts = blocks.filter((b) => ['header-1', 'header-2', 'header-3', 'paragraph'].includes(b.type))
				return createSummary(texts)
			}
		}
	}, [element.displaySummary, getPageValue?.call(getPageValue, element.id), element.summary])

	return (
		<PageContainer
			hasImage={hasCover}
			hasSummary={element.displaySummary && summary !== undefined}
			{...attributes}
			onClick={() => {
				changePage?.call(changePage, element.id)
			}}
			contentEditable={false}
			displayBorder={element?.displayBorder}
		>
			<Content>
				<Title untitled={isUntitled} className="page-block-title">
					{isUntitled && 'Untitled'}
					{isUntitled && <div style={{ display: 'none' }}>{children}</div>}
					{!isUntitled && children}
				</Title>
				{element.displaySummary && summary && <Description>{summary}</Description>}
			</Content>

			{element.displayCover && (
				<ImageContainer
					onClick={(e) => {
						e.stopPropagation()
						openImageUploader?.call(openImageUploader, onSelectFile)
					}}
				>
					{element.cover && <Image src={element.cover} />}
					{element.cover && (
						<ImageOverlay>
							{t('Change Image Cover', 'blockMenuChangeImageCover')}
							<SyncIcon size={20} color={theme.colors.primary} />
						</ImageOverlay>
					)}
					{!element.cover && (
						<ImagePlaceholder>
							{t('Add Image Cover', 'blockMenuAddImageCover')}
							<PlusIcon size={20} color={theme.colors.primary} />
						</ImagePlaceholder>
					)}
				</ImageContainer>
			)}

			{!element.displayCover && (
				<Arrow>
					<ArrowIcon
						size={28}
						color={lighten(0.3, getCssVariableValue('ntc-user-font-color') || theme.colors.border)}
					/>
				</Arrow>
			)}
		</PageContainer>
	)
}

export const pageActionMenu = (editor: Editor, element: PageBlock) => {
	const { deletePage, duplicatePage } = useEditorMethods()
	const [t] = useT()

	const handleOptions = (option: Record<string, any>) => {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, option, { at: path })
	}

	return [
		<MenuItem
			text={t('Duplicate', 'blockMenuDuplicate')}
			onClick={() => duplicatePage?.call(duplicatePage, element.id)}
			icon={<DuplicateIcon />}
			name="duplicate"
			key="duplicate"
			subtype="MenuItem"
			autoClose
		/>,
		<MenuItem
			text={t('Delete', 'blockMenuDelete')}
			onClick={() => deletePage?.call(deletePage, element.id)}
			icon={<TrashIcon />}
			name="delete"
			key="delete"
			subtype="MenuItem"
			autoClose
		/>,
		<MenuSeparator key={'divider-1'} />,
		<MenuSectionTitle text={t('Layout', 'blockMenuLayout')} name="layout" key="layout" subtype="SectionTitle"></MenuSectionTitle>,
		<MenuItem
			text={t('Only Text', 'blockMenuOnlyText')}
			onClick={() => {
				handleOptions({ displayCover: false })
			}}
			icon={<LayoutTextIcon />}
			name="only text"
			key="only-text"
			subtype="MenuItem"
		/>,
		<MenuItem
			text={t('With Image', 'blockMenuWithImage')}
			onClick={() => {
				handleOptions({ displayCover: true })
			}}
			icon={<LayoutImageIcon />}
			name="with image"
			key="with-image"
			subtype="MenuItem"
		/>,
		<MenuSeparator key={'divider-2'} />,
		<MenuSectionTitle text={t('Display', 'blockMenuDisplay')} name="display" key="display" subtype="SectionTitle"></MenuSectionTitle>,
		<MenuItem
			text={t('Page Summary', 'blockMenuPageSummary')}
			onClick={() => handleOptions({ displaySummary: !element.displaySummary })}
			isSelected={element.displaySummary}
			name="page summary"
			key="page-summary"
			subtype="MenuItem"
			optionSelectable
		/>,
		<MenuSeparator key={'divider-3'} />,
		<MenuSectionTitle text={t('Style', 'blockMenuStyle')} name="style" key="style" subtype="SectionTitle"></MenuSectionTitle>,
		<MenuItem
			text={t('Border', 'blockMenuBorder')}
			onClick={() => handleOptions({ displayBorder: !element.displayBorder })}
			// check for false instead of falsy for retro-compatibility without migration
			isSelected={element?.displayBorder !== false}
			name="page border"
			key="page-border"
			subtype="MenuItem"
			optionSelectable
		/>,
	]
}

const PageContainer = styled.div<{ hasImage?: boolean; hasSummary?: boolean; displayBorder?: boolean }>`
	display: flex;
	align-self: center;
	justify-content: space-between;
	align-items: center;
	padding: var(--ntc-user-block-padding);

	box-sizing: border-box;
	width: 100%;

	margin: var(--ntc-user-block-padding) 0;

	${({ displayBorder, theme }) => {
		const borderColor = theme.colors.border

		if (displayBorder !== false) {
			return css`
				border: ${getCssVariableValue('ntc-user-border-width') ?? '0.05em'} solid ${borderColor};
			`
		}
	}}
	border-radius: ${({ theme }) => theme.borderRadius};
	overflow: hidden;

	color: var(--ntc-user-font-color);
	font-size: 16px;
	text-decoration: none;

	cursor: pointer;

	&:hover {
		transform: translateY(-3px);
		.page-block-title * {
			color: var(--ntc-user-highlight-color);
		}
		svg {
			stroke: var(--ntc-user-highlight-color);
		}
	}

	transition:
		transform ease 0.25s,
		box-shadow ease 0.25s;

	${({ hasImage, hasSummary }) => {
		if (hasImage && hasSummary) {
			return css`
				height: auto;
			`
		} else if (hasImage && !hasSummary) {
			return css`
				height: 117px;
			`
		} else {
			return css`
				height: auto;
			`
		}
	}}
`

const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	flex: 1;

	margin: auto;
	padding: 16px;

	@supports (-webkit-line-clamp: 2) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: initial;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
`

const Title = styled.div<{ untitled: boolean }>`
	font-size: 18px;
	font-weight: 700;
	color: ${({ theme, untitled }) => (untitled ? theme.colors.textLightGrey : undefined)};

	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;

	@supports (-webkit-line-clamp: 2) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: initial;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
`

const Description = styled.div`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	color: var(--ntc-user-light-font-color);
	opacity: 0.7;
	font-family: var(--ntc-user-font-family);

	@supports (-webkit-line-clamp: 2) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: initial;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	margin-top: 8px;
`

const ImageOverlay = styled.div`
	padding: 8px;
	position: absolute;
	inset: 0;
	opacity: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
	background-color: ${({ theme }) => transparentize(0.2, theme.colors.border)};
	color: ${({ theme }) => theme.colors.primary};
	font-size: 14px;
	transition: opacity 0.2s ease;
`

const ImageContainer = styled.div`
	width: 135px;
	height: 110px;
	border-radius: ${({ theme }) => theme.borderRadius};

	position: relative;
	overflow: hidden;

	&:hover ${ImageOverlay} {
		opacity: 1;
	}
`

const Image = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	background-color: transparent;
`

const ImagePlaceholder = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
	color: ${({ theme }) => theme.colors.primary};
	font-size: 14px;
	height: 100%;
	border-left: 2px dotted ${({ theme }) => theme.colors.border};
	border-top-right-radius: ${({ theme }) => theme.borderRadius};
	border-bottom-right-radius: ${({ theme }) => theme.borderRadius};
`

const Arrow = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px 24px 16px 32px;

	cursor: pointer;

	svg {
		transform: rotate(180deg);
		stroke: var(--ntc-user-font-color);
	}
`

export const withPage = (editor: Editor) => {
	const { normalizeNode, apply } = editor

	editor.normalizeNode = (entry) => {
		const [node, path] = entry

		if (Element.isElement(node) && path.length > 1 && node.type === 'page') {
			Transforms.liftNodes(editor, { at: path })
			return
		}
		normalizeNode(entry)
	}

	editor.apply = (op) => {
		if (op.type === 'merge_node') {
			const { type } = op.properties as any
			if (type === 'page') return
		}

		if (op.type === 'remove_node') {
			const { type } = op.node as any
			if (type === 'page') return
		}

		if (op.type === 'split_node') {
			const { type } = op.properties as any
			if (type === 'page') return
		}

		apply(op)
	}

	return editor
}

export const insertPage = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, {
		id: crypto.randomUUID(),
		type: 'page',
		children: [{ text: '' }],
	})
}
