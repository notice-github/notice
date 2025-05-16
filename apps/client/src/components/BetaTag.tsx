import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'span'> {
	small?: boolean
}

export const BetaTag = ({ ...props }: Props) => {
	return <StyledSpan {...props}>BETA</StyledSpan>
}

const StyledSpan = styled.span<Pick<Props, 'small'>>`
	font-size: ${({ small }) => (small ? 8 : 12)}px;
	font-weight: 500;
	color: ${({ theme }) => theme.colors.textLight};
	background-color: ${({ theme }) => theme.colors.primaryLight};
	padding: ${({ small }) => small ? '3px 5px 2px 5px' : '4px 7px 3px 7px'};
	border-radius: ${({ theme }) => theme.borderRadius};
`
