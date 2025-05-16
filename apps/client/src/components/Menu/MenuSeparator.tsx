import styled from 'styled-components'

interface Props {
	weight?: number
}

export const MenuSeparator = ({ weight = 2 }: Props) => {
	return <StyledDiv weight={weight} />
}

const StyledDiv = styled.div<Required<Pick<Props, 'weight'>>>`
	width: 100%;
	height: ${({ weight }) => weight}px;
	background-color: ${({ theme }) => theme.colors.borderLight};
`
