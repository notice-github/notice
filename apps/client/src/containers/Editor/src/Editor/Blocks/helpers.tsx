import { Editor, Transforms, Element, Operation, Path, Point } from 'slate'
import { useSlateSelection } from 'slate-react'
import { EditorOptions } from '../Editor'
import { Node } from 'slate'

const blockExcludedFromDatabase = ['notice-ai-text-prompt', 'notice-ai-image-prompt']

export const withEditorNormalization = (editor: Editor, editorOptions?: EditorOptions) => {
	const { editOnly = false, readOnly = false } = editorOptions ?? {}
	const { normalizeNode, apply, insertNode, insertBreak, insertSoftBreak } = editor

	editor.normalizeNode = (entry) => {
		const [node, path] = entry

		// assign ids to every type of block except the ones listed in the exclusion list
		if (Element.isElement(node) && !node?.id && node.type && !blockExcludedFromDatabase.includes(node.type)) {
			Transforms.setNodes(editor, { id: crypto.randomUUID() }, { at: path })
			return
		}

		// Fall back to the original `normalizeNode` to enforce other constraints.
		normalizeNode(entry)
	}

	editor.insertNode = (node) => {
		insertNode(node)
	}

	editor.insertBreak = () => {
		if (editOnly) {
			Transforms.insertText(editor, '\n')
			return
		}
		insertBreak()
	}

	editor.insertSoftBreak = () => {
		insertSoftBreak()
	}

	editor.apply = (op) => {
		if (readOnly) return

		// In edit, we don't allow creating new nodes
		// The very specific case of 'split_node', on which I spent 5 hours
		// is not usable here, because it can mean splitting an inline node in multiple leaves
		if (editOnly) {
			if (['insert_node'].includes(op.type)) {
				Transforms.insertText(editor, '\n')
				return
			}
			if (['move_node', 'remove_node'].includes(op.type)) return
		}

		// TODO: fix typing
		// TODO2: shall review this, the risk is that it assigns new id to existing node,
		// creating a lot of nodes. Shall we check for specific ops? insert_node/split_node?
		// Each time you split a node, assign new id, otherwise it creates duplicate ids
		if (op?.properties && op?.properties?.id && op?.properties?.type) {
			op.properties.id = crypto.randomUUID()
		}

		apply(op)
	}

	return editor
}

export const getTextFromNodes = (nodes: Array<Node>) => {
	return nodes.map((node) => (Node.isNode(node) ? Node.string(node) : '')).join('\n')
}

export const containsTopLevelNodes = (nodes: Array<Node>, list: Array<string>) =>
	nodes.find((node) => list.includes(node.type))
