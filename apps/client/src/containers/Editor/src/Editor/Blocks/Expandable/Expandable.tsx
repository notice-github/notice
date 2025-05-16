import { ReactNode, useRef, useState } from 'react'
import { Editor, Element, Point, Range, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react'
import styled, { css } from 'styled-components'

import { MenuItem } from '../../Components/Menu/MenuItem'
import { MenuSeparator } from '../../Components/Menu/MenuSeparator'
import { useNoticeEditorContext } from '../../Contexts/NoticeEditor.provider'
import { EditorOptions } from '../../Editor'
import { NTransforms } from '../../noticeEditor'
import { CustomElement } from '../../types'
import ArrowDownIcon from './ArrowDownIcon/ArrowDownIcon'

export function useIsFirstRender(): boolean {
	const isFirst = useRef(true)

	if (isFirst.current) {
		isFirst.current = false

		return true
	}

	return isFirst.current
}

export type ExpandableVariants = 'bottom-bordered' | 'fully-bordered' | 'top-bordered'

export interface ExpandableBlock {
	type: 'expandable'
	children: CustomElement[]
	title: string
	expanded: boolean
	variant: ExpandableVariants
	id?: string
}

interface ExpandableProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: ExpandableBlock
}

export const Expandable = ({ attributes, children, element }: ExpandableProps) => {
	const { title, expanded, variant = 'bottom-bordered' } = element
	const { readOnly = false, editOnly = false } = useNoticeEditorContext()

	// we need to sync the value for local so there is no buffer on cursor when value changes
	const [value, setValue] = useState<string>(title)

	const editor = useSlate()
	const handleExpanding = () => {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { expanded: !expanded }, { at: path })
	}

	const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target

		setValue(value)
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { title: e.target.value }, { at: path })
	}

	return (
		// give id to element to be able to check if it's expanded outside
		<ExpandableContainer
			{...attributes}
			variant={variant}
			id={`expandable-${element?.id}`}
			className={expanded || readOnly || editOnly ? 'expanded' : 'not-expanded'}
		>
			<TitleContainer onClick={handleExpanding} contentEditable={false}>
				<StyledH3>
					<StyledTitleInput
						placeholder="Your title here"
						value={value}
						onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
							onTitleChange(e)
						}}
						editable={!readOnly}
					></StyledTitleInput>
				</StyledH3>
				<IconContainer isOpen={expanded || readOnly || editOnly}>
					<ArrowDownIcon />
				</IconContainer>
			</TitleContainer>
			<AnswerContainer isOpen={expanded || readOnly || editOnly}>
				<Answer>{children}</Answer>
			</AnswerContainer>
		</ExpandableContainer>
	)
}

const ExpandableContainer = styled.div<{ variant: ExpandableVariants; readOnly?: boolean }>`
	box-sizing: border-box;
	width: 100%;
	height: auto;
	margin: var(--ntc-user-block-padding) 0;

	${({ variant, theme }) => {
		switch (variant) {
			case 'bottom-bordered':
				return `border-bottom: 1px solid ${theme.colors.greyLight};`
			case 'fully-bordered':
				return `border: 1px solid ${theme.colors.greyLight};`
			case 'top-bordered':
				return `border-top: 1px solid ${theme.colors.greyLight};`
		}
	}}
`

const StyledTitleInput = styled.input<{ editable: boolean }>`
	/* keep the style to cancel input styling here */
	border-radius: 8px;
	outline: none;
	border: none;

	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

	:focus {
		border: none;
	}
	color: var(--ntc-user-font-color);
	pointer-events: ${({ editable }) => (editable ? 'auto' : 'none')};
`

const IconContainer = styled.span<{ isOpen: boolean }>`
	position: relative;
	font-weight: 400 !important;
	font-size: 20px !important;
	transition: transform 0.3s ease-in-out;
	background-color: inherit;
	padding-right: 8px;

	margin: auto 0 auto 20px;

	svg {
		transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : '')};
		transition: 0.4s ease-in-out;
	}
`

const EditIconSpan = styled.span`
	&:hover {
		fill: ${({ theme }) => theme.colors.primary};
	}
`

const StyledH3 = styled.div`
	box-sizing: border-box;
	width: 100%;

	/* keep the general style in the parent for future bundle use */
	input {
		box-sizing: border-box;
		width: 100%;
		font-weight: 500;
		font-size: var(--ntc-user-expandable-header-size) !important;
		${(props) => props.theme.fonts.editor}
	}
`

const TitleContainer = styled.div`
	justify-content: space-between;
	box-sizing: border-box;
	display: flex;
	cursor: pointer;
	padding: 8px;
	&:hover {
		color: ${({ theme }) => theme.colors.primary};
		fill: ${({ theme }) => theme.colors.primary};
	}
`
const Answer = styled.div``

const AnswerContainer = styled.div<{ isOpen: boolean }>`
	border-radius: 4px;
	padding: 4px 8px 24px 24px;
	height: auto;
	overflow: hidden;
	display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
	.notice-block-wrapper {
		margin-left: 25px;
	}
`

export const withExpandable = (editor: Editor, editorOptions: EditorOptions) => {
	const { deleteBackward, normalizeNode } = editor

	editor.normalizeNode = (entry) => {
		const [node, path] = entry

		if (Element.isElement(node) && path.length > 1 && node.type === 'expandable') {
			Transforms.liftNodes(editor, { at: path })
			return
		}
		normalizeNode(entry)
	}

	editor.deleteBackward = (...args) => {
		const { editOnly } = editorOptions
		const { selection } = editor

		if (selection && Range.isCollapsed(selection) && !editOnly) {
			const [match] = Editor.nodes(editor, {
				match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'expandable',
			})

			if (match && match[0]?.id) {
				const elem = document.getElementById(`expandable-${match[0]?.id}`)
				if (elem && elem.classList.contains('not-expanded')) {
					return
				}
			}

			if (match) {
				const [, path] = match
				const start = Editor.start(editor, path)

				if (Point.equals(selection.anchor, start)) {
					return
				}
			}
		}

		deleteBackward(...args)
	}

	return editor
}

export const insertExpandable = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, [
		{
			type: 'expandable',
			title: '',
			children: [{ type: 'paragraph', children: [{ text: 'Answer here' }] }],
			variant: 'bottom-bordered',
			expanded: true, // keep expandable opened on creation to avoid focus issues
		},
	])
}

export const expandableActionMenu = (editor: Editor, element: any) => {
	const handleVariantChange = (variant: ExpandableVariants) => {
		const path = ReactEditor.findPath(editor, element)
		Transforms.setNodes(editor, { variant }, { at: path })
	}
	return [
		<MenuSeparator key={'divider'} />,
		<MenuItem
			icon={<BorderBox variant={'bottom-bordered'}></BorderBox>}
			text="Default"
			onClick={() => {
				handleVariantChange('bottom-bordered')
			}}
			name="bottom bordered"
			key="bottom-bordered"
			subtype="MenuItem"
		/>,
		<MenuItem
			icon={<BorderBox variant={'fully-bordered'}></BorderBox>}
			text="Full Border"
			onClick={() => {
				handleVariantChange('fully-bordered')
			}}
			name="full border"
			key="full-border"
			subtype="MenuItem"
		/>,
		<MenuItem
			icon={<BorderBox variant={'top-bordered'}></BorderBox>}
			text="Top Bordered"
			onClick={() => {
				handleVariantChange('top-bordered')
			}}
			name="top border"
			key="top border"
			subtype="MenuItem"
		/>,
	]
}

const BorderBox = styled.div<{ variant: ExpandableVariants }>`
	height: 24px;
	width: 24px;
	background-color: ${({ theme }) => theme.colors.primaryExtraLight};

	${(props) => {
		switch (props.variant) {
			case 'bottom-bordered':
				return css`
					border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
				`
			case 'fully-bordered':
				return css`
					border: 2px solid ${({ theme }) => theme.colors.primary};
				`
			case 'top-bordered':
				return css`
					border-top: 2px solid ${({ theme }) => theme.colors.primary};
				`
		}
	}}
`
