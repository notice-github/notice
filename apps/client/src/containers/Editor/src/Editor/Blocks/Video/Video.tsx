import { WorkspaceModel } from '@notice-app/models'
import { ReactNode } from 'react'
import { Editor, Path, Transforms } from 'slate'
import { RenderElementProps } from 'slate-react'
import styled from 'styled-components'
import { EditorMethodsContext } from '../../Contexts/EditorMethods.provider'
import { CustomText } from '../../types'

export interface VideoElement {
	id?: string
	type: 'video'
	url: string
	mimetype?: string | null
	size?: number | null
	originalName?: string | null
	aspectRatio?: number | null
	children: CustomText[]
}

interface VideoElementProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: VideoElement
}

export const Video = ({ attributes, children, element }: VideoElementProps) => {
	return (
		<div {...attributes} contentEditable={false}>
			{children}
			<StyledVideo src={element.url} aspectRatio={element.aspectRatio ?? undefined} controls />
		</div>
	)
}

const StyledVideo = styled.video<{ aspectRatio?: number }>`
	outline: none;
	margin: auto;
	width: 100%;
	padding-top: var(--NTCVAR-large-padding);
	padding-bottom: var(--NTCVAR-large-padding);
	aspect-ratio: ${({ aspectRatio }) => aspectRatio};
	margin: var(--ntc-user-block-padding) 0;
`

export const insertVideo = (editor: Editor, file: WorkspaceModel.client | string, dropPath?: Path) => {
	let node: any = { type: 'video', children: [{ text: '' }] }

	if (typeof file === 'string') node.url = file
	else node = { ...node, ...file }

	Transforms.insertNodes(editor, node, { at: dropPath })
}

export const openVideoUploader = (editor: Editor, { openVideoUploader }: EditorMethodsContext) => {
	openVideoUploader?.call(openVideoUploader)
}
