// libs
import { Editor, Element, Transforms } from 'slate'
import { getListItem } from './Blocks/List'
import { insertParagraph } from './Blocks/Paragraph'

// Leaves helpers functions
import { toggleBold } from './Leaves/Bold.leaf'
import { toggleCode } from './Leaves/Code.leaf'
import { toggleItalic } from './Leaves/Italic.leaf'
import { toggleUnderline } from './Leaves/Underline.leaf'
import { SetSlashOpen } from './SlashMenu/SlashMenuProvider'

const SLASH_FLORBIDDEN_BLOCK = ['bulleted-list', 'numbered-list']

const LEAF_MARKS = ['bold', 'italic', 'underline', 'code', 'strikethrough', 'color', 'link']

const removeAllMarks = (editor: Editor) => {
	for (const mark of LEAF_MARKS) {
		Editor.removeMark(editor, mark)
	}
}

export const onEditorKeyDown = (event: any, editor: Editor, setSlashOpen: SetSlashOpen, slashOpen: boolean) => {
	const [block] = Editor.nodes(editor, {
		match: (n) => Editor.isBlock(editor, n),
	})

	if (event.key === '/') {
		event.preventDefault()
		const [match] = Editor.nodes(editor, { voids: true, match: (n) => Editor.isBlock(editor, n) })
		if (!match || !editor.selection) return

		if (!Editor.string(editor, match?.[1]) && !SLASH_FLORBIDDEN_BLOCK?.includes(match?.[0].type)) {
			setSlashOpen(true, true)
		} else {
			Transforms.insertText(editor, '/')
		}
	}

	if (event.shiftKey && event.key === 'Enter') {
		event.preventDefault()
		Transforms.insertText(editor, '\n')
		return
	}

	if (event.key === 'Tab') {
		if (getListItem(editor)) {
			const listStructure = getListItem(editor)[1]
			event.preventDefault()

			if (event.shiftKey) {
				Transforms.liftNodes(editor)
				return
			}

			if (listStructure.reverse()[0] === 0) {
				Transforms.insertText(editor, '\t')
				return
			}

			Transforms.wrapNodes(editor, {
				// TODO: fix typing
				// @ts-ignore
				type: block[0].type,
				children: [{ type: 'list-item', children: [{ text: '' }] }],
			})
			return
		}

		const next = Editor.next(editor, { match: (n) => Editor.isBlock(editor, n) })

		// in tables, TAB go to next cell or to next block if it's the end of the table
		if (block && Element.isElement(block[0]) && block[0]?.type === 'table' && next) {
			event.preventDefault()
			Transforms.select(editor, next[1])
			return
		}

		event.preventDefault()
		Transforms.insertText(editor, '\t')
		return
	}

	// If the user presses cmd + enter, we insert a new paragraph
	if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
		event.preventDefault()
		insertParagraph(editor)
		return
	}

	// REMOVE ALL MARKS
	if (event.key === 'Enter') {
		removeAllMarks(editor)
		return
	}

	// Everything after here is when the user holds CTRL or metaKey (CMD for Apple) and presses a key
	if (!event.ctrlKey && !event.metaKey) return

	switch (event.key) {
		// When "B" is pressed, bold the text in the selection.
		case 'b': {
			event.preventDefault()
			toggleBold(editor)
			break
		}
		// When "U" is pressed, underline the text in the selection.
		case 'u': {
			event.preventDefault()
			toggleUnderline(editor)
			break
		}

		// When "I" is pressed, italic the text in the selection.
		case 'i': {
			event.preventDefault()
			toggleItalic(editor)
			break
		}

		// When "E" is pressed, format as code the text in the selection.
		case 'e': {
			event.preventDefault()
			toggleCode(editor)
			break
		}
	}
}
