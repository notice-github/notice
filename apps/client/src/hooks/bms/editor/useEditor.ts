import { FileModel, PageModel } from '@notice-app/models'
import { useQuery } from '@tanstack/react-query'
import { BaseEditor, Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import { queryClient } from '../../../utils/query'

export const useEditor = (page: Pick<PageModel.node, 'id'>) => {
	const { data: editor } = useQuery<(BaseEditor & ReactEditor) | null>(['slate-page', page.id], () => null, {
		staleTime: Infinity,
	})

	const insertImage = (image: FileModel.client) => {
		if (editor == null) return

		const { id, ...data } = image

		Transforms.insertNodes(editor, {
			id: crypto.randomUUID(),
			type: 'image',
			children: [{ text: '' }],
			...data,
		})
	}

	const insertDocument = (document: FileModel.client) => {
		if (editor == null) return

		const { id, ...data } = document

		Transforms.insertNodes(editor, {
			id: crypto.randomUUID(),
			type: 'document',
			children: [{ text: '' }],
			...data,
		})
	}

	const insertVideo = (video: FileModel.client) => {
		if (editor == null) return

		const { id, ...data } = video

		Transforms.insertNodes(editor, {
			id: crypto.randomUUID(),
			type: 'video',
			children: [{ text: '' }],
			...data,
		})
	}

	const insertAudio = (audio: FileModel.client) => {
		if (editor == null) return

		const { id, ...data } = audio

		Transforms.insertNodes(editor, {
			id: crypto.randomUUID(),
			type: 'audio',
			children: [{ text: '' }],
			...data,
		})
	}

	const insertText = (text: string) => {
		if (editor == null) return

		Transforms.insertText(editor, text)
	}

	const focusEditor = () => {
		if (editor == null) return

		ReactEditor.focus(editor)
	}

	const deleteTextBlock = () => {
		if (editor == null) return

		Editor.deleteForward(editor, { unit: 'block' })
		Editor.deleteBackward(editor, { unit: 'block' })
	}

	const setEditor = (editor: (BaseEditor & ReactEditor) | null) => {
		queryClient.resetQueries(['slate-page', page.id]).then(() => {
			queryClient.setQueryData(['slate-page', page.id], editor)
		})
	}

	return [
		{ insertImage, insertDocument, insertVideo, insertAudio, insertText, deleteTextBlock, focusEditor },
		setEditor,
	] as const
}
