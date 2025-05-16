import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	width?: string
}

export const PageSide = ({ children, width = '275px', ...props }: Props) => {
	return (
		<Container width={width} {...props}>
			{children}
		</Container>
	)
}

const Container = styled.div<{ width: string }>`
	position: sticky;
	box-sizing: border-box;
	top: 0;
	height: 100vh;
	width: ${({ width }) => width};
	border-right: 2px solid ${({ theme }) => theme.colors.borderLight};
`
