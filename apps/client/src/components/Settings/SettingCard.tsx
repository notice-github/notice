import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	title: string
	button?: React.ReactNode
}

export const SettingsCard = ({ title, button, children, ...props }: Props) => {
	return (
		<Container {...props}>
			<Head>
				<Title>{title}</Title>
				{button}
			</Head>
			<Body>{children}</Body>
		</Container>
	)
}

const Container = styled.div`
	margin-top: 24px;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.borderRadius};
	max-width: 750px;
`

const Head = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
	padding: 12px 16px;
`

const Title = styled.h2`
	font-size: 18px;
	font-weight: 700;
`

const Body = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding: 12px 16px;
`
