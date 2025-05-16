import { Editor, Element, Range, Transforms, Point } from 'slate'

const SHORTCUTS = {
	'*': 'list-item',
	'-': 'list-item',
	'+': 'list-item',
	'1.': 'list-item',
	'>': 'quote',
	'#': 'header-1',
	'##': 'header-2',
	'###': 'header-3',
	'####': 'header-3',
	'#####': 'header-3',
	'######': 'header-3',
}

export const withShortcuts = (editor: Editor) => {
	const { deleteBackward, insertText } = editor

	editor.insertText = (text) => {
		const { selection } = editor

		if (text.endsWith(' ') && selection && Range.isCollapsed(selection)) {
			const { anchor } = selection
			const block = Editor.above(editor, {
				match: (n) => Editor.isBlock(editor, n),
			})
			const path = block ? block[1] : []
			const start = Editor.start(editor, path)
			const range = { anchor, focus: start }
			const beforeText = Editor.string(editor, range) + text.slice(0, -1)
			const type = SHORTCUTS[beforeText]

			if (type) {
				Editor.withoutNormalizing(editor, () => {
					Transforms.select(editor, range)

					if (!Range.isCollapsed(range)) {
						Transforms.delete(editor)
					}

					const newProperties = {
						type,
					}
					Transforms.setNodes(editor, newProperties, {
						match: (n) => Editor.isBlock(editor, n),
					})

					if (type === 'list-item') {
						const list =
							beforeText === '1.'
								? {
										type: 'numbered-list',
										children: [],
								  }
								: {
										type: 'bulleted-list',
										children: [],
								  }
						Transforms.wrapNodes(editor, list, {
							match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'list-item',
						})
					}
				})

				return
			}
		}

		insertText(text)
	}

	editor.deleteBackward = (...args) => {
		deleteBackward(...args)
	}

	return editor
}
