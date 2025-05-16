import { cloneElement } from 'react'
import styled, { useTheme } from 'styled-components'
import { Loader } from '../Loader'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	icon?: React.ReactElement
	text: string
	hint?: string
	loading?: boolean
	isDisabled?: boolean
}

export const MenuItem = ({ icon, text, hint, isDisabled, loading, ...props }: Props) => {
	const theme = useTheme()

	return (
		<StyledDiv isDisabled={isDisabled} {...props}>
			{icon && <IconWrapper>{cloneElement(icon, { color: theme.colors.primary })}</IconWrapper>}
			<TextWrapper>
				{text}
				{hint && <HintWrapper>{hint}</HintWrapper>}
			</TextWrapper>
			{loading && <Loader size={18} />}
		</StyledDiv>
	)
}

const StyledDiv = styled.div<{ isDisabled: boolean | undefined }>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 12px;
	margin: 0;

	cursor: pointer;

	pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'auto')};
	opacity: ${({ isDisabled }) => (isDisabled ? 0.3 : 1)};
	background-color: ${({ theme, isDisabled }) => (isDisabled ? theme.colors.hover : undefined)};

	&:hover {
		background-color: ${({ theme }) => theme.colors.hover};
	}
`

const IconWrapper = styled.div`
	width: 18px;
	height: 18px;
`

const TextWrapper = styled.div`
	display: flex;
	flex-direction: column;
`

const HintWrapper = styled.span`
	margin-top: 2px;
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textLightGrey};
`
