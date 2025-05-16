import styled from 'styled-components'

interface Props {
	integration: {
		id: string
		name: string
		icon: string
		description: string
	}
	secondary?: boolean
	overrideName?: string
	onClick?: () => any
}

export const IntegrationCard = ({ integration, secondary, overrideName, onClick }: Props) => {
	return (
		<Container secondary={secondary} onClick={onClick}>
			<Icon src={integration.icon} secondary={secondary} />
			<TextContainer>
				<Name secondary={secondary}>{overrideName ?? integration.name}</Name>
				{!secondary && <Description>{integration.description}</Description>}
			</TextContainer>
		</Container>
	)
}

const Container = styled.div<{ secondary?: boolean }>`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 16px;
	border-radius: ${({ theme }) => theme.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.border};
	overflow: hidden;
	box-shadow: rgb(0 0 0 / 3%) 0px 3px 7px;
	padding: ${({ secondary }) => (secondary ? '14px' : '18px')};

	cursor: pointer;

	&:hover {
		box-shadow: rgb(0 0 0 / 9%) 0px 3px 7px;
		transform: translateY(-3px);
	}

	transition:
		transform ease 0.25s,
		box-shadow ease 0.25s;
`

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const Icon = styled.img<{ secondary?: boolean }>`
	width: ${({ secondary }) => (secondary ? '32px' : '48px')};
	height: ${({ secondary }) => (secondary ? '32px' : '48px')};
`

const Name = styled.h2<{ secondary?: boolean }>`
	font-size: ${({ secondary }) => (secondary ? '18px' : '24px')};
`

const Description = styled.p`
	margin-top: 4px;
	color: ${({ theme }) => theme.colors.greyDark};
`
