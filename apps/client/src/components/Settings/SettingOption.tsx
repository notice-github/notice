import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	title: string
	description: React.ReactNode
	icon?: React.ReactNode
}

export const SettingOption = ({ title, description, icon, children, ...props }: Props) => {
	return (
		<Container {...props}>
			<InfoWrapper>
				{icon}
				<div>
					<Title>{title}</Title>
					<Description>{description}</Description>
				</div>
			</InfoWrapper>
			<ChildrenWrapper>{children}</ChildrenWrapper>
		</Container>
	)
}

const Container = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 32px;
`

const InfoWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`

const Title = styled.h3`
	font-size: 16px;
	font-weight: 500;
`

const Description = styled.div`
	color: ${({ theme }) => theme.colors.textLightGrey};
	font-size: 13px;
`

const ChildrenWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`
