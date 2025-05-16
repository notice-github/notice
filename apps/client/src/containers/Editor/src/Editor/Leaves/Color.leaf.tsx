import { ReactNode } from 'react'
import { Editor, Transforms, Text } from 'slate'
import styled from 'styled-components'

interface ColorProps {
	color: string
	children: ReactNode
}

export const Color = ({ children, color }: ColorProps) => {
	return <StyledColor color={color}>{children}</StyledColor>
}

interface BgColorProps {
	bgColor: string
	children: ReactNode
}

export const BgColor = ({ children, bgColor }: BgColorProps) => {
	return <StyledBgColor bgColor={bgColor}>{children}</StyledBgColor>
}

export const isColor = (editor: Editor, color: string) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => {
			return 'color' in n && n.color === color
		},
		universal: true,
	})
	return match
}

export const setLeafColor = (editor: Editor, color: string) => {
	Transforms.setNodes(
		editor,
		{
			color: isColor(editor, color) ? undefined : color,
		},
		{
			match: (n) => Text.isText(n),
			split: true,
		}
	)
}

export const isBgColor = (editor: Editor, color: string) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => 'bgColor' in n && n.bgColor === color,
		universal: true,
	})

	return match
}

export const setLeafBgColor = (editor: Editor, color: string) => {
	Transforms.setNodes(
		editor,
		{
			bgColor: isBgColor(editor, color) ? undefined : color,
		},
		{
			match: (n) => Text.isText(n),
			split: true,
		}
	)
}

const StyledBgColor = styled.span<any>`
	background-color: ${(props) => props.bgColor};
`

const StyledColor = styled.span<any>`
	color: ${(props) => props.color};
	text-decoration-color: ${(props) => props.color};
`
