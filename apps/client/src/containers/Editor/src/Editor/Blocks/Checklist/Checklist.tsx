import { ReactNode } from 'react'
import { Editor, Element, Point, Range, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useReadOnly, useSlate } from 'slate-react'
import styled from 'styled-components'
import { NTransforms } from '../../noticeEditor'
import { CustomText } from '../../types'

export type CheckListItemBlock = {
	type: 'check-list-item'
	children: CustomText[]
	checked: boolean
	id?: string
}

interface CheckListBlockProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: CheckListItemBlock
}

export const CheckListItemElement = ({ attributes, children, element }: CheckListBlockProps) => {
	const editor = useSlate()
	const readOnly = useReadOnly()
	const { checked } = element
	return (
		<Container {...attributes}>
			<span contentEditable={false} style={{ marginRight: ' 0.75em' }}>
				<input
					type="checkbox"
					checked={checked}
					onChange={(event) => {
						const path = ReactEditor.findPath(editor, element)
						const newProperties: Partial<Element> = {
							checked: event.target.checked,
						}
						Transforms.setNodes(editor, newProperties, { at: path })
					}}
				/>
			</span>
			<StrikethroughSpan checked={checked} contentEditable={!readOnly} suppressContentEditableWarning>
				{children}
			</StrikethroughSpan>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: baseline;
	margin: var(--ntc-user-block-padding) 0;

	& + & {
		margin-top: 0;
	}
`

const StrikethroughSpan = styled.span<{ checked: boolean }>`
	flex: 1;
	opacity: ${({ checked }) => (checked ? 0.666 : 1)};
	text-decoration: ${({ checked }) => (!checked ? 'none' : 'line-through')};
	text-decoration-color: var(--ntc-user-font-color);
	&:focus {
		outline: none;
	}
`

export const withChecklists = (editor: Editor) => {
	const { deleteBackward, normalizeNode, insertBreak } = editor

	editor.insertBreak = () => {
		const [match] = Editor.nodes(editor, {
			match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n) && n.type === 'check-list-item',
		})
		if (match) {
			// empty nodes get removed on inserts
			if (!Editor.string(editor, match?.[1])) {
				Transforms.removeNodes(editor, { at: match?.[1] })
				return
			}
			// we are on a checklist, insert one after the current node
			Transforms.insertNodes(editor, { type: 'check-list-item', checked: false, children: [{ text: '' }] })
			return
		}
		insertBreak()
	}

	editor.normalizeNode = (entry) => {
		// Fall back to the original `normalizeNode` to enforce other constraints.
		normalizeNode(entry)
	}

	editor.deleteBackward = (...args) => {
		const { selection } = editor

		if (selection && Range.isCollapsed(selection)) {
			const [match] = Editor.nodes(editor, {
				match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'check-list-item',
			})

			if (match) {
				const [, path] = match
				const start = Editor.start(editor, path)

				if (Point.equals(selection.anchor, start)) {
					const newProperties: Partial<Element> = {
						type: 'paragraph',
					}
					Transforms.setNodes(editor, newProperties, {
						match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'check-list-item',
					})
					return
				}
			}
		}

		deleteBackward(...args)
	}

	return editor
}

export const insertCheckList = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, {
		type: 'check-list-item',
		checked: false,
		children: [{ text: '' }],
	})
}

export const getTodoListItem = (editor: Editor) => {
	const [isLi] = Editor.nodes(editor, {
		match: (n) => {
			// TODO: remove ts-ignore and use constants
			//@ts-ignore
			return /^check-list-item$/.test(n.type)
		},
	})

	return isLi
}
