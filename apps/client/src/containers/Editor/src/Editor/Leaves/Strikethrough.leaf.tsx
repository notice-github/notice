import { ReactNode } from 'react'
import { Editor, Transforms, Text } from 'slate'
import styled, { css } from 'styled-components'

interface StrikethroughProps {
	children: ReactNode
	color: undefined | string
}

export const Strikethrough = ({ children, color }: StrikethroughProps) => {
	return <StyledStrikeThrough color={color}>{children}</StyledStrikeThrough>
}

const StyledStrikeThrough = styled.s`
	${({ color }) => {
		if (!color) return ''
		return css`
			text-decoration-color: ${color};
		`
	}}
`

export const isStrikethrough = (editor: Editor) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => 'strikethrough' in n && n.strikethrough === true,
		universal: true,
	})

	return !!match
}

export const toggleStrikethrough = (editor: Editor) => {
	const toggled = !isStrikethrough(editor)

	if (toggled) {
		Editor.addMark(editor, 'strikethrough', toggled) 
	} else {
		Editor.removeMark(editor, 'strikethrough')
	}
}
