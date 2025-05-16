// libs
import { useCallback } from 'react'
import { RenderLeafProps } from 'slate-react'
import styled from 'styled-components'

// Leaves
import { Bold } from './Bold.leaf'
import { Code } from './Code.leaf'
import { BgColor, Color } from './Color.leaf'
import { Italic } from './Italic.leaf'
import { Link } from './Link.leaf'
import { Placeholder } from './Placeholder.leaf'
import { Strikethrough } from './Strikethrough.leaf'
import { Underline } from './Underline.leaf'

// Leaf is the inline element like bold, italic, etc.
const Leaf = (props: RenderLeafProps) => {
	let { attributes, leaf, children } = props

	if (leaf.color) {
		children = <Color color={leaf.color}>{children}</Color>
	}

	if (leaf.bgColor) {
		children = <BgColor bgColor={leaf.bgColor}>{children}</BgColor>
	}

	if (leaf.placeholder) {
		children = <Placeholder {...props} />
	}

	if (leaf.bold) {
		children = <Bold>{children}</Bold>
	}

	if (leaf.code) {
		children = <Code>{children}</Code>
	}

	if (leaf.italic) {
		children = <Italic>{children}</Italic>
	}

	if (leaf.underline) {
		children = (
			<Underline {...attributes} color={leaf.color}>
				{children}
			</Underline>
		)
	}

	if (leaf.strikethrough) {
		children = <Strikethrough color={leaf.color}>{children}</Strikethrough>
	}

	if (leaf.link) {
		children = <Link link={leaf.link}>{children}</Link>
	}

	return <BaseLeaf {...attributes}>{children}</BaseLeaf>
}

// Base styling for all leaves, this will override everything else, be careful
const BaseLeaf = styled.span`
	${(props) => props.theme.fonts.editor}
`

export const useRenderLeaf = () => {
	const renderLeaf = useCallback((props: RenderLeafProps) => {
		return <Leaf {...props} />
	}, [])
	return [renderLeaf]
}
