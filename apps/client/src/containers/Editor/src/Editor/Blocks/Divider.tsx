import { Editor, Transforms } from 'slate'
import { RenderElementProps } from 'slate-react'
import styled from 'styled-components'
import { CustomText } from '../types'

export const DIVIDER_TYPE = 'divider'

export interface DividerBlock {
	type: typeof DIVIDER_TYPE
	children: CustomText[]
	id?: string
}

interface DividerProps {
	attributes: RenderElementProps['attributes']
	children: any
}

export const Divider = ({ attributes, children }: DividerProps) => {
	return (
		<Container {...attributes} contentEditable={false}>
			<DividerLine></DividerLine>
			<div style={{ display: 'none' }}>{children}</div>
		</Container>
	)
}

const DividerLine = styled.div`
	width: 100%;
	height: 1px;
	color: rgba(55, 53, 47, 0.16);
	background-color: rgba(55, 53, 47, 0.16);
`
const Container = styled.div`
	width: 100%;
	margin-top: 6px;
	margin-bottom: 6px;
`

export const withDivider = (editor: Editor) => {
	const { isVoid } = editor

	editor.isVoid = (element) => {
		return element.type === 'divider' ? true : isVoid(element)
	}

	return editor
}

export const insertDivider = (editor: Editor) => {
	Transforms.insertNodes(editor, [{ type: 'divider', children: [{ text: '' }] }])
}
