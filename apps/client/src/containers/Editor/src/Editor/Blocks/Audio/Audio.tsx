import { ReactNode } from 'react'
import { RenderElementProps } from 'slate-react'

import { CustomText } from '../../types'
import styled from 'styled-components'
import { Editor, Path, Transforms } from 'slate'
import { WorkspaceModel } from '@notice-app/models'
import { EditorMethodsContext } from '../../Contexts/EditorMethods.provider'

export const AUDIO_TYPE = 'audio'

export type AudioElement = {
	id?: string
	type: typeof AUDIO_TYPE
	url: string
	size?: number | null
	originalName?: string | null
	mimetype: string

	children: CustomText[]
}

interface AudioElementProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: AudioElement
}

export const Audio = ({ attributes, children, element }: AudioElementProps) => {
	const { url } = element

	return (
		<StyledAudio controls {...attributes} contentEditable={false}>
			{children}
			<source src={url} />
		</StyledAudio>
	)
}

const StyledAudio = styled.audio`
	margin: var(--ntc-user-block-padding) 0;
`

export const insertAudio = (editor: Editor, file: WorkspaceModel.client | string, dropPath?: Path) => {
	let node: any = { type: 'audio', children: [{ text: '' }] }

	if (typeof file === 'string') node.url = file
	else node = { ...node, ...file }

	Transforms.insertNodes(editor, node, { at: dropPath })
}

export const openAudioUploader = (editor: Editor, { openAudioUploader }: EditorMethodsContext) => {
	openAudioUploader?.call(openAudioUploader)
}
