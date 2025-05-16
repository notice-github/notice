import { useState } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { useIsHovered } from '../hooks/useIsHovered'
import { CrossIcon } from '../icons'

type TagVariant = 'active' | 'disabled'

interface IProps {
	value: string
	onDelete?: () => void
	variant?: TagVariant
}

const Tag = ({ value, onDelete, variant = 'active' }: IProps) => {
	const theme = useTheme()
	const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null)
	const isHovered = useIsHovered([parentRef]).some(Boolean)

	return (
		<TagContainer ref={setParentRef}>
			<TagTextSpan variant={variant}>{value}</TagTextSpan>
			{isHovered && onDelete && (
				<IconContainer onClick={onDelete}>
					<CrossIcon size={6} color={theme.colors.white} />
				</IconContainer>
			)}
		</TagContainer>
	)
}

const TagContainer = styled.div`
	position: relative;
	margin-bottom: 12px;
	cursor: pointer;
`

const TagTextSpan = styled.span<{ variant: TagVariant }>`
	padding: 4px 6px;
	border-radius: 4px;

	user-select: none;

	${(props) => {
		switch (props.variant) {
			case 'active':
				return css`
					color: ${({ theme }) => theme.colors.primaryDark};
					border: 1px solid ${({ theme }) => theme.colors.primaryDark};
				`
			case 'disabled':
				return css`
					color: ${({ theme }) => theme.colors.greyDark};
					border: 1px solid ${({ theme }) => theme.colors.greyDark};
					opacity: 0.5;
				`
		}
	}}
`

const IconContainer = styled.div`
	position: absolute;
	top: -13px;
	right: -5px;
	z-index: 1;
	background: ${({ theme }) => theme.colors.primaryDark};
	border-radius: 50%;
	width: 16px;
	height: 16px;

	display: flex;
	justify-content: center;
	align-items: center;

	transition: all 3s ease-in-out;
`

export default Tag
