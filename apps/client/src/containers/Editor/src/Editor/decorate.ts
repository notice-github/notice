import { Editor, Node, Path, Range } from 'slate'
import { useNoticeEditorContext } from './Contexts/NoticeEditor.provider'

export const decorate = (node: Node, path: Path, editor: Editor) => {
	if (editor.selection != null) {
		return checkEmptyNode(node, editor, path)
	}
	// shall always return an iterable
	return []
}

export const checkEmptyNode = (node: Node, editor: Editor, path: Path) => {
	if (
		!Editor.isEditor(node) &&
		Editor.string(editor, [path[0]]) === '' &&
		editor.selection &&
		Range.includes(editor.selection, path) &&
		Range.isCollapsed(editor.selection)
	) {
		return [
			{
				...editor.selection,
				placeholder: true,
			},
		]
	}
	return []
}
