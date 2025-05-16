import { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
	children: ReactNode
}

const InlineCode = ({ children }: Props) => {
	return <StyledCode>{children}</StyledCode>
}

const StyledCode = styled.code`
    background: ${({ theme }) => theme.colors.backgroundGrey};
    color: ${({ theme }) => theme.colors.textRed};;
    padding: 3px 4px;
    border-radius: 5px;
    margin: 0 1px;
    font-weight: 500;
    line-height: 22.5px;
`
export default InlineCode
