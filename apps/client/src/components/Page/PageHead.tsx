import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

export const PageHead = ({ children, ...props }: Props) => {
	return <Container {...props}>{children}</Container>
}

export const Container = styled.div`
	border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
	padding: 24px;
`

export const PageHeadIcon = styled.img`
	width: 58px;
	height: 58px;
`

export const PageHeadTitle = styled.h1`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 8px;
	font-size: 32px;
	font-weight: 800;
	line-height: 1.6;
`

export const PageHeadDescription = styled.p``
