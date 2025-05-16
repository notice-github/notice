import styled from 'styled-components'
import { assignColor, capitalize, minimalize } from './helpers'
import { CrossIcon } from '../../../../../icons'
import { darken, lighten } from 'polished'

interface TagProps {
	name: string
	removeTag: (tag: string) => void
}

export function Tag({ name, removeTag }: TagProps) {
	const color = assignColor(name)
	return (
		<StyledTag style={{ backgroundColor: color }}>
			<NameWrapper>{capitalize(name)}</NameWrapper>
			<CrossIconWrapper color={color} onClick={() => removeTag(minimalize(name))}>
				<CrossIcon color="white" size={8} />
			</CrossIconWrapper>
		</StyledTag>
	)
}

const CrossIconWrapper = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background-color 0.1s ease-in-out;
	padding: 4px 8px 4px 8px;
	border-left: 1px solid ${({ color }) => darken(0.05, color)};
	height: 100%;
	:hover {
		background-color: ${({ color }) => lighten(0.1, color)};
	}
`

const NameWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4px 8px 4px 8px;
`

const StyledTag = styled.div`
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: ${({ theme }) => theme.colors.primary};
	color: white;
	border-radius: 4px;
	padding: 0px;
	margin: 0px;
	font-size: 12px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`
