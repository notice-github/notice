import { ReactNode } from 'react'
import { Editor, Transforms, Text } from 'slate'
import styled from 'styled-components'

interface BoldProps {
	children: ReactNode
}

export const Bold = ({ children }: BoldProps) => {
	return <StyledBold>{children}</StyledBold>
}

const StyledBold = styled.strong``

export const isBold = (editor: Editor) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => 'bold' in n && n.bold === true,
		universal: true,
	})

	return !!match
}

export const toggleBold = (editor: Editor) => {
	const toggled = !isBold(editor)

	if (toggled) {
		Editor.addMark(editor, 'bold', toggled) 
	} else {
		Editor.removeMark(editor, 'bold')
	}
}
