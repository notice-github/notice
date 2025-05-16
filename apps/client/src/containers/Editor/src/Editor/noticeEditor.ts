import { Descendant, Editor, Transforms, Element } from 'slate'
import { ReactEditor } from 'slate-react'
import { CustomElement } from './types'

export const NTransforms = {
	...Editor,
	insertNodeCurrent: (editor: Editor, node: CustomElement | [CustomElement]) => {
		const { selection } = editor
		if (!selection) {
			console.error('Select the editor before inserting a node')
			return
		}
		const path = selection.anchor.path
		if (!path) {
			console.error('Could not retrieve path from selection')
			return
		}
		const newNode = Array.isArray(node) ? node : [node]

		Transforms.insertFragment(editor, newNode)
	},

	cloneCurrentNode: (editor: Editor, node: CustomElement) => {
		const path = ReactEditor.findPath(editor, node)
		const newPath = [...path]
		newPath[newPath.length - 1] = newPath[newPath.length - 1] + 1

		const newNode = { ...node, id: crypto.randomUUID(), children: cloneChildren(node.children) }
		Transforms.insertNodes(editor, newNode, { at: newPath })
	},
}

export function cloneChildren(children: Descendant[]): any {
	return children.map((node) => {
		if (Element.isElement(node)) {
			// shall we re-assign unique IDs here? I did not properly check
			// Answer: YES
			return {
				...node,
				id: crypto.randomUUID(),
				children: cloneChildren(node.children),
			}
		}

		return { ...node }
	})
}
