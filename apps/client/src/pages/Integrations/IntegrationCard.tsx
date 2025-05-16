import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useTrackEvent } from '../../hooks/analytics/useTrackEvent'
import { useUser } from '../../hooks/api/useUser'

import { Pages } from '../../pages'

interface Props {
	integration: {
		id: string
		name: string
		icon: string
		description: string
	}
}

export const IntegrationCard = ({ integration }: Props) => {
	const navigate = useNavigate()
	const trackEvent = useTrackEvent()
	const user = useUser()

	return (
		<Container
			onClick={() => {
				navigate(Pages.INTEGRATION_VIEW(integration.id))
			}}
		>
			<Icon src={integration.icon} />
			<Name>{integration.name}</Name>
			<Description>{integration.description}</Description>
		</Container>
	)
}

const Container = styled.div`
	height: 150px;
	display: flex;
	flex-direction: column;
	border-radius: ${({ theme }) => theme.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	overflow: hidden;
	box-shadow: rgb(0 0 0 / 3%) 0px 3px 7px;
	padding: 18px;

	cursor: pointer;

	&:hover {
		box-shadow: rgb(0 0 0 / 9%) 0px 3px 7px;
		transform: translateY(-3px);
	}

	transition:
		transform ease 0.25s,
		box-shadow ease 0.25s;
`

const Icon = styled.img`
	width: 48px;
	height: 48px;
`

const Name = styled.h2`
	margin-top: 14px;
`

const Description = styled.p`
	margin-top: 4px;
	color: ${({ theme }) => theme.colors.greyDark};
`
