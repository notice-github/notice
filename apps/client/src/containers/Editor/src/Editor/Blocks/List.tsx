import { ReactNode } from 'react'
import { Editor, Element, Location, Node, Point, Range, Transforms } from 'slate'
import { RenderElementProps } from 'slate-react'
import styled from 'styled-components'
import { NTransforms } from '../noticeEditor'
import { CustomText } from '../types'

export const LIST_ITEM_TYPE = 'list-item'
export interface ListItemBlock {
	type: typeof LIST_ITEM_TYPE
	children: CustomText[]
	id?: string
}

export const BULLETED_LIST_TYPE = 'bulleted-list'
export interface BulletedListBlock {
	type: typeof BULLETED_LIST_TYPE
	children: ListItemBlock[] | CustomText[]
	id?: string
}

export const NUMBERED_LIST_TYPE = 'numbered-list'
export interface NumberedListBlock {
	type: typeof NUMBERED_LIST_TYPE
	children: ListItemBlock[] | CustomText[]
	id?: string
}

interface ListProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
}

export const NumberedList = ({ children, attributes }: ListProps) => {
	return (
		<StyledOl type="1" {...attributes}>
			{children}
		</StyledOl>
	)
}
const StyledOl = styled.ol`
	list-style: decimal;
	padding-left: 16px;
	padding-top: var(--ntc-user-block-padding);
	padding-bottom: var(--ntc-user-block-padding);

	margin-left: 12px;
	color: var(--ntc-user-font-color);
`

export const BulletedList = ({ children, attributes }: ListProps) => {
	return <StyledUl {...attributes}>{children}</StyledUl>
}

const StyledUl = styled.ul`
	padding-left: 16px;
	padding-top: var(--ntc-user-block-padding);
	padding-bottom: var(--ntc-user-block-padding);

	margin-left: 12px;
	color: var(--ntc-user-font-color);
`
export const ListItem = ({ children, attributes }: ListProps) => {
	return <StyledLi {...attributes}>{children}</StyledLi>
}

const StyledLi = styled.li`
	padding-left: 0px;
	color: var(--ntc-user-font-color);
`

export const getListItem = (editor: Editor) => {
	const [isLi] = Editor.nodes(editor, {
		match: (n) => {
			// TODO: remove ts-ignore and use constants
			//@ts-ignore
			return /^list-item$/.test(n.type)
		},
	})

	return isLi
}

export const insertListItem = (editor: Editor) => {
	editor.insertBreak()
}
export const insertBulletedList = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, {
		type: 'bulleted-list',
		children: [{ type: 'list-item', children: [{ text: '' }] }],
	})
}
export const insertNumberedList = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, {
		type: 'numbered-list',
		children: [{ type: 'list-item', children: [{ text: '' }] }],
	})
}

export const withList = (editor: Editor) => {
	const { normalizeNode, deleteBackward } = editor

	editor.deleteBackward = (...args) => {
		const { selection } = editor

		if (selection && Range.isCollapsed(selection)) {
			const [match] = Editor.nodes(editor, {
				match: (n) => {
					return !Editor.isEditor(n) && Element.isElement(n) && n.type === 'list-item'
				},
			})

			if (match) {
				const [, path] = match
				const start = Editor.start(editor, path)

				if (Point.equals(selection.anchor, start)) {
					Transforms.liftNodes(editor, {
						at: path,
						match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n) && n.type === 'list-item',
					})

					return
				}
			}
		}

		deleteBackward(...args)
	}

	editor.normalizeNode = (entry) => {
		const [node, path] = entry
		const isParentList = Element.isElement(node) && ['bulleted-list', 'numbered-list'].includes(node.type)
		// If the element is a list container, make sure all its childs are lists or list items
		if (isParentList) {
			for (const [child] of Node.children(editor, path)) {
				if (Node.isNode(child) && !['bulleted-list', 'numbered-list', 'list-item'].includes(child.type)) {
					Transforms.setNodes(editor, { type: 'paragraph', children: [{ text: '' }] }, { at: path })
					return
				}
			}
		}

		if (isParentList) {
			// Lists cannot exist at the root level (0 depth)
			if (path.length === 0) {
				Transforms.setNodes(editor, { type: 'paragraph', children: [{ text: '' }] })
				return
			}
		}

		if (Element.isElement(node) && ['list-item'].includes(node.type)) {
			// list items cannot exist at the +1 root level (1 depth)
			if (path.length < 2) {
				Transforms.setNodes(editor, { type: 'paragraph', children: [{ text: '' }] })

				return
			}
			const parent = Editor.parent(editor, path)
			const previous = Editor.previous(editor, {
				match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n) && n.type === 'list-item',
			})

			if (
				previous &&
				Location.isLocation(previous?.[1]) &&
				!Editor.string(editor, previous?.[1]) &&
				!Editor.string(editor, path)
			) {
				Transforms.delete(editor, { at: previous?.[1] })

				try {
					Transforms.liftNodes(editor, {
						at: path,
						match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n) && n.type === 'list-item',
					})
				} catch (ex) {}
				return
			}

			if (!Element.isElement(parent)) return

			// list items can only be direct children of a list
			if (parent[0]?.type !== 'bulleted-list' && parent[0]?.type !== 'numbered-list') {
				Transforms.setNodes(editor, { type: 'paragraph', children: [{ text: '' }] })
				return
			}

			return
		}

		// Fall back to the original `normalizeNode` to enforce other constraints.
		normalizeNode(entry)
	}

	return editor
}
