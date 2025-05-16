import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	minWidth?: string
}

export const Page = ({ children, ...props }: Props) => {
	return <Container {...props}>{children}</Container>
}

const Container = styled.div<Props>`
	display: flex;
	align-items: flex-start;
	min-width: ${({ minWidth }) => minWidth};
`
