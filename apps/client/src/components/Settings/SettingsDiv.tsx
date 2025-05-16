import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	button?: React.ReactNode
}

export const SettingsDiv = ({ children, ...props }: Props) => {
	return (
		<Container {...props}>
			<Body>{children}</Body>
		</Container>
	)
}

const Container = styled.div`
	margin-top: 8px;
  	margin-bottom: 8px;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.borderRadius};
  	padding: 12px 16px;
`

const Body = styled.div`
	display: flex;
  height: 100%;
	flex-direction: column;
  justify-content: center;
`
