import styled from 'styled-components'

export const MenuSeparator = () => {
	return <StyledDiv />
}

const StyledDiv = styled.div`
	width: 100%;
	height: 2px;
	background-color: ${({ theme }) => theme.colors.border};
`
