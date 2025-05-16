import { ReactNode } from 'react'
import { Editor, Transforms, Text } from 'slate'
import styled from 'styled-components'

interface ItalicProps {
	children: ReactNode
}

export const Italic = ({ children }: ItalicProps) => {
	return <StyledItalic>{children}</StyledItalic>
}

const StyledItalic = styled.em``

export const isItalic = (editor: Editor) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => 'italic' in n && n.italic === true,
		universal: true,
	})

	return !!match
}

export const toggleItalic = (editor: Editor) => {
	const toggled = !isItalic(editor)

	if (toggled) {
		Editor.addMark(editor, 'italic', toggled) 
	} else {
		Editor.removeMark(editor, 'italic')
	}
}
