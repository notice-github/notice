import { ReactNode } from 'react'
import { Editor, Transforms, Text } from 'slate'
import styled from 'styled-components'

interface CodeProps {
	children: ReactNode
}

export const Code = ({ children }: CodeProps) => {
	return <StyledCode>{children}</StyledCode>
}

export const isCode = (editor: Editor) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => 'code' in n && n.code === true,
		universal: true,
	})

	return !!match
}

export const toggleCode = (editor: Editor) => {
	const toggled = !isCode(editor)

	if (toggled) {
		Editor.addMark(editor, 'code', toggled) 
	} else {
		Editor.removeMark(editor, 'code')
	}
}

const StyledCode = styled.code`
	font-family: monospace;

	/* hardcoded colors because I don't think we are going to re-use */
	background: ${({ theme }) => theme.colors.backgroundGrey};
	color: ${({ theme }) => theme.colors.textRed};
	padding: 3px 6px;
	border-radius: 5px;
	margin: 0 1px;
	font-weight: 500;
	line-height: 22.5px;
`
