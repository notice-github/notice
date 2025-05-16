import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

export const PageBody = ({ children, ...props }: Props) => {
	return <Container {...props}>{children}</Container>
}

const Container = styled.div`
	padding: 24px;
`
