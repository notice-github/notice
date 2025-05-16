import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

export const PageContent = ({ children, ...props }: Props) => {
	return <Container {...props}>{children}</Container>
}

const Container = styled.div`
	padding: 32px;
	align-self: stretch;
	width: calc(100% - 275px);

	box-sizing: border-box;
`
