import { ReactNode } from 'react'
import { Editor, Transforms, Text } from 'slate'
import styled, { css } from 'styled-components'

interface UnderlineProps {
	children: ReactNode
	color: string | undefined
}

export const Underline = ({ children, color }: UnderlineProps) => {
	return <StyledUnderline color={color}>{children}</StyledUnderline>
}

const StyledUnderline = styled.u<any>`
	${({ color }) => {
		if (!color) return ''
		return css`
			text-decoration-color: ${color};
		`
	}}
`

export const isUnderlined = (editor: Editor) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => 'underline' in n && n.underline === true,
		universal: true,
	})

	return !!match
}

export const toggleUnderline = (editor: Editor) => {
	const toggled = !isUnderlined(editor)

	if (toggled) {
		Editor.addMark(editor, 'underline', toggled) 
	} else {
		Editor.removeMark(editor, 'underline')
	}
}
