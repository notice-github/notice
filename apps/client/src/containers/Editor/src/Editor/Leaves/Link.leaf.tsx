import { ReactNode } from 'react'
import { Editor, Transforms, Text } from 'slate'
import styled from 'styled-components'

interface LinkProps {
	children: ReactNode
	link: string
}

export const Link = ({ children, link }: LinkProps) => {
	return (
		<StyledLink href={link} target="_blank">
			{children}
		</StyledLink>
	)
}

const StyledLink = styled.a`
	color: var(--ntc-user-accent-color);
	cursor: pointer;
	text-decoration: none;
`

export const isLink = (editor: Editor) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => 'link' in n && typeof n.link === 'string',
		universal: true,
	})

	return !!match
}

export const isSpecificLink = (editor: Editor, link: string) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => 'link' in n && n.link === link,
		universal: true,
	})

	return !!match
}

export const setLink = (editor: Editor, link: string) => {
	Transforms.setNodes(
		editor,
		{
			link: isSpecificLink(editor, link) ? undefined : link,
		},
		{
			match: (n) => Text.isText(n),
			split: true,
		}
	)
}
